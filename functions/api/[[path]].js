// M&B Akademie – EIN Router für alle /api/*-Routen.
import { MODS, PARTS, durationOf } from '../_lib/content.js';

import { QUIZ, PASS_MIN } from '../_lib/quiz.js';
import { dummyVerify, hashSecret, randomInt, timingSafeEqual, verifySecret } from '../_lib/crypto.js';
import {
  clearCookie, createSession, currentAdmin, destroySession, destroySessionsOf, requireAdmin, requireEmployee,
} from '../_lib/auth.js';
import {
  all, computeModules, computeParts, ensureCertificates, first, getSetting, guardAttempt, guardLockedUntil, guardReset,
  housekeeping, isUnlocked, loadModules, newCompanyCode, partMinutes, partTitle, rateCount, rateHit, run, setSetting,
  sumRemainingSec,
} from '../_lib/db.js';
import {
  HttpError, SECURITY_HEADERS, cleanName, clientIp, fmtDateTime, isTrivialPin, json, msg, nameKey, nameKeyOf, now,
  originOk, pickLang, readJson, validNamePart, validPinFormat,
} from '../_lib/util.js';

const HOUR = 3600;
const LOGIN_WINDOW = 15 * 60;

// Geheimer Pepper für PINs (Secret PIN_PEPPER): ohne ihn ist ein Datenbank-Leak allein nicht offline knackbar.
// ACHTUNG: Nach dem ersten Mitarbeiter nie mehr ändern, sonst passen alle PINs nicht mehr.
// Fail closed: Außerhalb der lokalen Entwicklung (DEV_SHORT=1) wird ohne Pepper nichts angenommen.
function peppered(env, pin) {
  if (env.PIN_PEPPER) return env.PIN_PEPPER + ':' + String(pin);
  if (String(env.DEV_SHORT) === '1') return String(pin);
  console.error('KONFIGURATIONSFEHLER: Secret PIN_PEPPER fehlt (wrangler pages secret put PIN_PEPPER). PIN-Funktionen sind gesperrt.');
  throw new HttpError(500, msg('server', 'de'));
}

// "15 Minuten" / "24 Stunden" in der Sprache des Nutzers
function durText(seconds, lang) {
  const min = Math.max(1, Math.ceil(seconds / 60));
  if (min >= 120) return `${Math.ceil(min / 60)} ${lang === 'sq' ? 'orë' : 'Stunden'}`;
  return `${min} ${lang === 'sq' ? (min === 1 ? 'minutë' : 'minuta') : (min === 1 ? 'Minute' : 'Minuten')}`;
}

// Fehler "gesperrt": dauerhaft (Chef muss helfen) oder zeitlich
function lockedOut(lockedUntil, lang, justNow = false) {
  const rest = lockedUntil - now();
  if (rest > 30 * 86400) return new HttpError(403, msg('account_locked', lang), { locked: true, disabled: true, remaining: 0 });
  const key = justNow ? 'locked_now' : 'locked';
  return new HttpError(429, msg(key, lang, durText(rest, lang)), { locked: true, remaining: 0 });
}

// Fehlversuch-Antwort nach Zählerstand: Restversuche in der aktuellen Fünferstufe oder Sperre.
function failureError(g, lang) {
  if (g.count % 5 === 0 || g.count >= 20) return lockedOut(g.lockedUntil, lang, true);
  const remaining = 5 - (g.count % 5);
  const text = remaining === 1 ? msg('tries_left_1', lang) : msg('tries_left', lang, remaining);
  return new HttpError(401, text, { remaining });
}

// Titel eines Moduls in der Sprache des Nutzers
const titleOf = (n, lang) => MODS[n][lang === 'sq' ? 'sq' : 'de'];

// Modulnummer aus Pfad prüfen (0..15)
function parseModule(s, lang) {
  const n = Number(s);
  if (!Number.isInteger(n) || n < 0 || n >= MODS.length) throw new HttpError(400, msg('module_invalid', lang));
  return n;
}

// Ziffern-PIN zufällig erzeugen, nie trivial
function randomPin() {
  for (;;) {
    const pin = String(randomInt(10000)).padStart(4, '0');
    if (!isTrivialPin(pin)) return pin;
  }
}

// =====================================================================
// Öffentliche Routen
// =====================================================================

async function register({ env, body, lang, request }) {
  const ip = clientIp(request);
  // Erst zählen (atomar), dann prüfen. Alle Versuche: 40/Stunde/IP; zusätzlich FALSCHE Codes: 10/Stunde/IP.
  // So können viele Kollegen hinter derselben Firmen-IP starten, Raten bleibt aber bei 10 Fehlern/h gedeckelt.
  if ((await rateHit(env, 'reg:' + ip, HOUR)) > 40) throw new HttpError(429, msg('too_many', lang));
  if ((await rateCount(env, 'regfail:' + ip, HOUR)) >= 10) throw new HttpError(429, msg('too_many', lang));

  const code = String(body.code || '').trim().toUpperCase();
  const company = await getSetting(env, 'company_code');
  if (!company || !timingSafeEqual(code, company)) {
    await rateHit(env, 'regfail:' + ip, HOUR);
    throw new HttpError(403, msg('code_wrong', lang));
  }

  const first_ = cleanName(body.first);
  const last = cleanName(body.last);
  if (!validNamePart(first_) || !validNamePart(last)) throw new HttpError(400, msg('name_invalid', lang));
  if (body.lang !== 'de' && body.lang !== 'sq') throw new HttpError(400, msg('lang_invalid', lang));
  if (!validPinFormat(body.pin)) throw new HttpError(400, msg('pin_format', lang));
  if (isTrivialPin(body.pin)) throw new HttpError(400, msg('pin_trivial', lang));
  const secret = peppered(env, body.pin); // fail closed, falls PIN_PEPPER fehlt

  const key_ = nameKey(first_, last);
  if (await first(env, 'SELECT 1 AS x FROM employees WHERE name_key = ?', key_)) {
    throw new HttpError(409, msg('name_taken', body.lang));
  }

  const { hash, salt } = await hashSecret(secret);
  let id;
  try {
    const t = now();
    const r = await first(
      env,
      `INSERT INTO employees (first, last, name_key, lang, pin_hash, pin_salt, active, failed, created_at, last_seen)
       VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?, ?) RETURNING id`,
      first_, last, key_, body.lang, hash, salt, t, t,
    );
    id = r.id;
  } catch {
    // Gleichzeitige Registrierung desselben Namens (UNIQUE-Verletzung)
    throw new HttpError(409, msg('name_taken', body.lang));
  }
  await guardReset(env, 'n:' + key_); // alte Fehlversuche auf diesen (damals unbekannten) Namen verwerfen
  await housekeeping(env);
  return json({ ok: true }, 200, { 'Set-Cookie': await createSession(env, 'emp', id) });
}

// Login. Bekannte und unbekannte Namen laufen durch denselben Ablauf (gleiche Zähler, Meldungen, Rechenzeit),
// damit man per Probieren keine Konten erraten kann. Fehlermeldungen immer in der Anfrage-Sprache.
async function login({ env, body, lang, request }) {
  const ip = clientIp(request);
  // IP-Drosselung zuerst: erst zählen (atomar), dann prüfen. Alle Versuche, 100 pro 15 Minuten.
  if ((await rateHit(env, 'login:' + ip, LOGIN_WINDOW)) > 100) throw new HttpError(429, msg('too_many', lang));

  const pin = body.pin;
  if (!validPinFormat(pin) || typeof body.name !== 'string' || body.name.length > 200) throw new HttpError(400, msg('pin_format', lang));
  const secret = peppered(env, pin);
  const nk = nameKeyOf(body.name);
  const gkey = 'n:' + nk;

  const lockedUntil = await guardLockedUntil(env, gkey);
  if (lockedUntil) throw lockedOut(lockedUntil, lang);
  const g = await guardAttempt(env, gkey); // zählt diesen Versuch atomar mit
  if (!g.allowed) throw lockedOut(g.lockedUntil, lang);

  const emp = nk ? await first(env, 'SELECT * FROM employees WHERE name_key = ?', nk) : null;
  const good = emp ? await verifySecret(secret, emp.pin_hash, emp.pin_salt) : await dummyVerify(secret);

  if (!good) {
    if (emp && g.count % 5 === 0) {
      // Sperre auch am Konto vermerken (Anzeige im Chef-Bereich); ab 20 Fehlversuchen nur noch Chef-Reset.
      await run(env, 'UPDATE employees SET failed = ?, locked_until = ?, active = CASE WHEN ? >= 20 THEN 0 ELSE active END WHERE id = ?',
        g.count, g.lockedUntil, g.count, emp.id);
    }
    throw failureError(g, lang);
  }
  await guardReset(env, gkey);
  if (!emp.active) throw new HttpError(403, msg('account_locked', lang), { disabled: true });

  await run(env, 'UPDATE employees SET failed = 0, locked_until = NULL, last_seen = ? WHERE id = ?', now(), emp.id);
  await housekeeping(env);
  return json({ ok: true, lang: emp.lang }, 200, { 'Set-Cookie': await createSession(env, 'emp', emp.id) });
}

async function logout({ env, request }) {
  await destroySession(request, env, 'emp');
  return json({ ok: true }, 200, { 'Set-Cookie': clearCookie('emp') });
}

async function verifyCertificate({ env, url, request }) {
  if ((await rateHit(env, 'verify:' + clientIp(request), HOUR)) > 60) throw new HttpError(429, msg('too_many', 'de'));
  const lang = url.searchParams.get('lang') === 'sq' ? 'sq' : 'de';
  const code = (url.searchParams.get('code') || '').trim().toUpperCase();
  if (!/^MB-T[123]-[A-Z0-9]{4}$/.test(code)) return json({ valid: false });
  const c = await first(
    env,
    `SELECT c.part, c.issued_at, e.first, e.last FROM certificates c JOIN employees e ON e.id = c.emp_id WHERE c.code = ?`,
    code,
  );
  if (!c) return json({ valid: false });
  return json({ valid: true, name: `${c.first} ${c.last}`, part: c.part, partTitle: partTitle(c.part, lang), issuedAt: c.issued_at });
}

// =====================================================================
// Mitarbeiter
// =====================================================================

async function me({ env, emp }) {
  const lang = emp.lang;
  await run(env, 'UPDATE employees SET last_seen = ? WHERE id = ?', now(), emp.id);
  const mods = await loadModules(env, emp.id);
  const certs = await all(env, 'SELECT part, code, issued_at FROM certificates WHERE emp_id = ?', emp.id);
  const cm = new Map(certs.map((c) => [c.part, c]));
  return json({
    id: emp.id,
    first: emp.first,
    last: emp.last,
    lang,
    modules: mods.map((m) => ({
      n: m.n,
      part: m.part,
      title: titleOf(m.n, lang),
      goal: MODS[m.n].g[lang],
      points: MODS[m.n].k[lang],
      duration: m.duration,
      maxPos: m.maxPos,
      completed: m.completed,
      quizPassed: m.quizPassed,
      quizBest: m.quizBest,
      unlocked: m.unlocked,
    })),
    parts: computeParts(mods).map((p) => ({
      k: p.k,
      title: partTitle(p.k, lang),
      done: p.done,
      total: p.total,
      certificate: cm.has(p.k) ? { code: cm.get(p.k).code, issuedAt: cm.get(p.k).issued_at } : null,
    })),
    totals: { done: mods.filter((m) => m.completed).length, total: mods.length, remainingSec: sumRemainingSec(mods) },
  });
}

async function setLang({ env, emp, body, lang }) {
  if (body.lang !== 'de' && body.lang !== 'sq') throw new HttpError(400, msg('lang_invalid', lang));
  await run(env, 'UPDATE employees SET lang = ? WHERE id = ?', body.lang, emp.id);
  return json({ ok: true, lang: body.lang });
}

// Vorspul-Schutz. Das Guthaben an Fortschritt kommt nur aus echt vergangener Zeit (Server-Uhr):
//  - Erste Meldung eines Moduls: höchstens 6 s.
//  - Weitere Meldungen: min(60, Sekunden seit der letzten angerechneten Meldung) * 1,25.
//  - Meldungen im Abstand < 2 s geben KEIN Guthaben und verschieben den Zeitpunkt nicht
//    (sonst ließe sich der Schutz mit schnellen Anfragen aushebeln).
// last_report ist in Millisekunden. Das Update läuft in EINEM SQL-Statement (atomar, auch bei parallelen Anfragen):
//   max_pos = MAX(max_pos, MIN(pos, max_pos + Guthaben, Dauer))
const FIRST_CREDIT_SEC = 6;
const DT = '(?3 - COALESCE(last_report, ?3))';
const CREDIT = `(CASE WHEN ${DT} >= 2000 THEN MIN(60.0, ${DT} / 1000.0) * 1.25 ELSE 0 END)`;
const NEW_MAX = `MAX(max_pos, MIN(?4, max_pos + ${CREDIT}, ?5))`;
const PROGRESS_UPDATE = `UPDATE progress SET
    max_pos = CASE WHEN ${NEW_MAX} >= ?5 - 2 THEN ?5 ELSE ${NEW_MAX} END,
    completed_at = CASE WHEN completed_at IS NOT NULL THEN completed_at WHEN ${NEW_MAX} >= ?5 - 2 THEN ?6 ELSE NULL END,
    last_report = CASE WHEN ${DT} >= 2000 THEN ?3 ELSE last_report END
  WHERE emp_id = ?1 AND module = ?2 AND completed_at IS NULL
  RETURNING max_pos, completed_at`;

async function progress({ env, emp, body, lang }) {
  const n = body.module;
  if (!Number.isInteger(n) || n < 0 || n >= MODS.length) throw new HttpError(400, msg('module_invalid', lang));
  const pos = Number(body.pos);
  if (!Number.isFinite(pos) || pos < 0) throw new HttpError(400, msg('bad_request', lang));
  if (!(await isUnlocked(env, emp.id, n))) throw new HttpError(403, msg('module_locked', lang));

  const dur = durationOf(n, env);
  const tMs = Date.now();
  const t = Math.floor(tMs / 1000);
  await run(env, 'UPDATE employees SET last_seen = ? WHERE id = ?', t, emp.id);

  // Schon abgeschlossen: Client darf frei springen, nichts mehr zu ändern.
  const done = await first(env, 'SELECT completed_at FROM progress WHERE emp_id = ? AND module = ?', emp.id, n);
  if (done && done.completed_at) return json({ maxPos: dur, completed: true });

  // Erste Meldung: Zeile mit höchstens 6 s Guthaben anlegen (bei paralleler Erstmeldung gewinnt eine).
  const firstMax = Math.min(pos, FIRST_CREDIT_SEC, dur);
  const firstDone = firstMax >= dur - 2;
  const ins = await run(
    env,
    'INSERT OR IGNORE INTO progress (emp_id, module, max_pos, last_report, completed_at) VALUES (?, ?, ?, ?, ?)',
    emp.id, n, firstDone ? dur : firstMax, tMs, firstDone ? t : null,
  );
  if (ins.meta.changes) return json({ maxPos: firstDone ? dur : firstMax, completed: firstDone });

  const row = await first(env, PROGRESS_UPDATE, emp.id, n, tMs, pos, dur, t);
  if (!row) return json({ maxPos: dur, completed: true }); // zwischenzeitlich (parallel) abgeschlossen
  return json({ maxPos: row.max_pos, completed: row.completed_at != null });
}

// Quiz setzt ein freigeschaltetes Modul mit fertigem Video voraus.
async function quizGate(env, emp, n, lang) {
  if (n < 1) throw new HttpError(404, msg('no_quiz', lang));
  if (!(await isUnlocked(env, emp.id, n))) throw new HttpError(403, msg('module_locked', lang));
  const p = await first(env, 'SELECT completed_at FROM progress WHERE emp_id = ? AND module = ?', emp.id, n);
  if (!p || !p.completed_at) throw new HttpError(403, msg('video_first', lang));
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Neuer Quiz-Lauf: Fragen ohne Lösung, Antworten gemischt (jede trägt ihre Original-ID 0..3).
// Je Lauf wird pro Frage genau EINE Antwort angenommen (siehe quizCheck).
async function quizGet({ env, emp, params, lang }) {
  const n = parseModule(params[0], lang);
  await quizGate(env, emp, n, lang);
  await run(env, 'DELETE FROM quiz_runs WHERE emp_id = ? AND module = ? AND finished = 0', emp.id, n);
  const r = await first(env, 'INSERT INTO quiz_runs (emp_id, module, created_at) VALUES (?, ?, ?) RETURNING id', emp.id, n, now());
  const questions = QUIZ[n].map((item, id) => ({
    id,
    q: item.q[lang],
    a: shuffle(item.a.map((a, aid) => ({ id: aid, text: a[lang] }))),
  }));
  return json({ runId: r.id, questions });
}

// Lauf laden und prüfen: gehört dem Mitarbeiter, passt zum Modul, offen, nicht älter als 2 Stunden.
async function loadRun(env, emp, n, runId, lang) {
  if (!Number.isInteger(runId)) throw new HttpError(400, msg('bad_request', lang));
  const r = await first(env, 'SELECT * FROM quiz_runs WHERE id = ? AND emp_id = ? AND module = ?', runId, emp.id, n);
  if (!r) throw new HttpError(404, msg('not_found', lang));
  if (r.finished || now() - r.created_at > 2 * HOUR) throw new HttpError(409, msg('run_over', lang));
  return r;
}

// Sofort-Feedback pro Frage. Pro Lauf und Frage wird genau eine Antwort gespeichert; eine zweite, andere
// Antwort -> 409. (Dieselbe Antwort nochmal, z. B. nach Verbindungsabbruch, bekommt dieselbe Rückmeldung.)
// correctId und Erklärung gibt es erst, nachdem die eigene Antwort gespeichert ist.
async function quizCheck({ env, emp, params, body, lang }) {
  const n = parseModule(params[0], lang);
  await quizGate(env, emp, n, lang);
  const run_ = await loadRun(env, emp, n, body.runId, lang);
  const q = Number.isInteger(body.q) ? QUIZ[n][body.q] : null;
  if (!q || !Number.isInteger(body.a) || body.a < 0 || body.a > 3) throw new HttpError(400, msg('bad_request', lang));

  const r = await run(
    env,
    // CAST nötig: D1 bindet Zahlen als REAL (sonst würde der Pfad zu '$.q0.0').
    `UPDATE quiz_runs SET answers = json_set(answers, '$.q' || CAST(?1 AS INTEGER), CAST(?2 AS INTEGER))
     WHERE id = ?3 AND emp_id = ?4 AND module = ?5 AND finished = 0
       AND json_extract(answers, '$.q' || CAST(?1 AS INTEGER)) IS NULL`,
    body.q, body.a, run_.id, emp.id, n,
  );
  if (!r.meta.changes) {
    const cur = JSON.parse((await first(env, 'SELECT answers FROM quiz_runs WHERE id = ?', run_.id)).answers)['q' + body.q];
    if (cur !== body.a) throw new HttpError(409, msg('already_answered', lang));
  }
  return json({ correct: body.a === q.correct, correctId: q.correct, why: q.why[lang] });
}

// Auswertung aus den gespeicherten Antworten des Laufs (alle Fragen müssen beantwortet sein).
async function quizSubmit({ env, emp, params, body, lang }) {
  const n = parseModule(params[0], lang);
  await quizGate(env, emp, n, lang);
  if (body.answers !== undefined) throw new HttpError(400, msg('bad_request', lang)); // altes Format nicht mehr zulässig
  const run_ = await loadRun(env, emp, n, body.runId, lang);
  const stored = JSON.parse(run_.answers);
  const a = QUIZ[n].map((_, i) => stored['q' + i]);
  if (a.some((x) => !Number.isInteger(x))) throw new HttpError(400, msg('quiz_answers', lang));

  // Lauf atomar abschließen: nur ein Submit pro Lauf (verhindert Doppelwertung bei parallelen Anfragen).
  const fin = await run(env, 'UPDATE quiz_runs SET finished = 1 WHERE id = ? AND finished = 0', run_.id);
  if (!fin.meta.changes) throw new HttpError(409, msg('run_over', lang));

  const results = QUIZ[n].map((q, i) => a[i] === q.correct);
  const score = results.filter(Boolean).length;
  const passed = score >= PASS_MIN;
  await run(
    env,
    'INSERT INTO quiz_attempts (emp_id, module, score, passed, answers, at) VALUES (?, ?, ?, ?, ?, ?)',
    emp.id, n, score, passed ? 1 : 0, JSON.stringify(a), now(),
  );

  let unlockedNext = null;
  let certificate = null;
  if (passed) {
    if (n < MODS.length - 1) {
      unlockedNext = { n: n + 1, title: titleOf(n + 1, lang), duration: durationOf(n + 1, env) };
    }
    const created = await ensureCertificates(env, emp.id);
    if (created.length) certificate = created[0];
  }
  return json({ score, passed, results, unlockedNext, certificate });
}

async function certificate({ env, emp, params, lang }) {
  const part = Number(params[0]);
  if (![1, 2, 3].includes(part)) throw new HttpError(404, msg('cert_none', lang));
  const c = await first(env, 'SELECT code, issued_at FROM certificates WHERE emp_id = ? AND part = ?', emp.id, part);
  if (!c) throw new HttpError(404, msg('cert_none', lang));
  const list = MODS.filter((m) => m.p === part).map((m) => ({ n: m.n, title: titleOf(m.n, lang) }));
  return json({
    name: `${emp.first} ${emp.last}`,
    part,
    partTitle: partTitle(part, lang),
    modules: list,
    minutes: partMinutes(part),
    issuedAt: c.issued_at,
    code: c.code,
  });
}

// =====================================================================
// Chef
// =====================================================================

const adminInfo = (a) => ({ id: a.id, name: a.name, username: a.username, role: a.role });

async function chefStatus({ env, request }) {
  const count = await first(env, 'SELECT COUNT(*) AS c FROM admins');
  const admin = await currentAdmin(request, env);
  return json({ setupNeeded: count.c === 0, loggedIn: !!admin, ...(admin ? { me: adminInfo(admin) } : {}) });
}

function validAdminFields(body) {
  const name = cleanName(body.name);
  const username = String(body.username || '').trim().toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const ok = name.length >= 2 && name.length <= 60 && /^[a-z0-9._-]{3,40}$/.test(username) && password.length >= 10 && password.length <= 200;
  return ok ? { name, username, password } : null;
}

async function chefSetup({ env, body, request }) {
  const key = 'setup:' + clientIp(request);
  if ((await rateHit(env, key, HOUR)) > 10) throw new HttpError(429, msg('too_many', 'de')); // erst zählen, dann prüfen
  const count = await first(env, 'SELECT COUNT(*) AS c FROM admins');
  if (count.c > 0) throw new HttpError(404, msg('not_found', 'de')); // danach ist die Route tot
  const token = env.SETUP_TOKEN;
  if (!token || typeof body.setupToken !== 'string' || !timingSafeEqual(body.setupToken, String(token))) {
    throw new HttpError(403, msg('setup_token', 'de'));
  }
  const f = validAdminFields(body);
  if (!f) throw new HttpError(400, msg('admin_fields', 'de'));

  const { hash, salt } = await hashSecret(f.password);
  // Atomar: nur einfügen, wenn noch kein Admin existiert (schützt vor gleichzeitigem Setup).
  const r = await run(
    env,
    `INSERT INTO admins (name, username, pass_hash, pass_salt, role, created_at)
     SELECT ?, ?, ?, ?, 'owner', ? WHERE NOT EXISTS (SELECT 1 FROM admins)`,
    f.name, f.username, hash, salt, now(),
  );
  if (!r.meta.changes) throw new HttpError(404, msg('not_found', 'de'));
  if (!(await getSetting(env, 'company_code'))) await setSetting(env, 'company_code', newCompanyCode());
  const admin = await first(env, 'SELECT id FROM admins WHERE username = ?', f.username);
  return json({ ok: true }, 200, { 'Set-Cookie': await createSession(env, 'admin', admin.id) });
}

// Chef-Login: globale IP-Drosselung zuerst, dann Sperre pro (Benutzername + IP) – so kann niemand von fremden
// IPs den Inhaber aussperren. Stufen wie beim Mitarbeiter-Login, aber höchstens 24 h (kein "permanent").
async function chefLogin({ env, body, request }) {
  const ip = clientIp(request);
  if ((await rateHit(env, 'alogin:' + ip, HOUR)) > 30) throw new HttpError(429, msg('too_many', 'de'));
  const username = String(body.username || '').trim().toLowerCase().slice(0, 64);
  const password = typeof body.password === 'string' ? body.password : '';
  if (password.length > 200) throw new HttpError(400, msg('bad_request', 'de'));

  const gkey = `a:${username}|${ip}`;
  const lockedUntil = await guardLockedUntil(env, gkey);
  if (lockedUntil) throw lockedOut(lockedUntil, 'de');
  const g = await guardAttempt(env, gkey, 86400);
  if (!g.allowed) throw lockedOut(g.lockedUntil, 'de');

  const admin = username ? await first(env, 'SELECT * FROM admins WHERE username = ?', username) : null;
  const good = admin ? await verifySecret(password, admin.pass_hash, admin.pass_salt) : await dummyVerify(password);
  if (!good) {
    const e = failureError(g, 'de');
    throw new HttpError(e.status, e.status === 401 ? msg('admin_bad', 'de') : e.message, e.extra);
  }
  await guardReset(env, gkey);
  await housekeeping(env);
  return json({ ok: true, me: adminInfo(admin) }, 200, { 'Set-Cookie': await createSession(env, 'admin', admin.id) });
}

async function chefLogout({ env, request }) {
  await destroySession(request, env, 'admin');
  return json({ ok: true }, 200, { 'Set-Cookie': clearCookie('admin') });
}

// Alle Mitarbeiter samt berechnetem Stand (für Team-Liste und CSV).
async function loadTeam(env) {
  const [emps, prog, quiz, certs] = await Promise.all([
    all(env, 'SELECT * FROM employees ORDER BY first COLLATE NOCASE, last COLLATE NOCASE'),
    all(env, 'SELECT emp_id, module, max_pos, completed_at FROM progress'),
    all(env, 'SELECT emp_id, module, MAX(score) AS best, MAX(passed) AS passed, COUNT(*) AS attempts FROM quiz_attempts GROUP BY emp_id, module'),
    all(env, 'SELECT emp_id, part, code, issued_at FROM certificates'),
  ]);
  const group = (rows) => {
    const m = new Map();
    for (const r of rows) { if (!m.has(r.emp_id)) m.set(r.emp_id, []); m.get(r.emp_id).push(r); }
    return m;
  };
  const gp = group(prog), gq = group(quiz), gc = group(certs);
  return emps.map((e) => {
    const mods = computeModules(env, gp.get(e.id) || [], gq.get(e.id) || []);
    const cs = gc.get(e.id) || [];
    const withQuiz = mods.filter((m) => m.quizBest !== null);
    const next = mods.find((m) => !m.fullyDone);
    return {
      e,
      mods,
      certs: [1, 2, 3].map((k) => cs.find((c) => c.part === k) || null),
      done: mods.filter((m) => m.completed).length,
      finished: !next,
      current: next ? { n: next.n, title: MODS[next.n].de } : null,
      started: mods.some((m) => m.started),
      quizAvg: withQuiz.length ? Math.round((withQuiz.reduce((a, m) => a + m.quizBest, 0) / withQuiz.length) * 10) / 10 : null,
      lastSeen: e.last_seen || e.created_at,
    };
  });
}

async function chefTeam({ env }) {
  const team = await loadTeam(env);
  // "Nicht aktiv" (eine Definition für Zahl UND Filter): aktives (nicht gesperrtes), nicht fertiges Konto,
  // zuletzt gesehen (bzw. angemeldet, falls nie gesehen) vor mehr als 7 Tagen.
  const weekAgo = now() - 7 * 86400;
  const isInactive = (t) => !!t.e.active && !t.finished && t.lastSeen < weekAgo;
  return json({
    summary: {
      registered: team.length,
      cert1: team.filter((t) => t.certs[0]).length,
      finished: team.filter((t) => t.finished).length,
      inactive7: team.filter(isInactive).length,
    },
    employees: team.map((t) => ({
      id: t.e.id,
      name: `${t.e.first} ${t.e.last}`,
      lang: t.e.lang,
      done: t.done,
      total: MODS.length,
      current: t.current,
      started: t.started,
      finished: t.finished,
      certs: t.certs.map(Boolean),
      quizAvg: t.quizAvg,
      lastSeen: t.lastSeen,
      active: !!t.e.active,
      inactive: isInactive(t),
    })),
  });
}

// =====================================================================
// Cockpit (Chef-Startseite): alles, was der Chef auf einen Blick braucht.
// =====================================================================
const DAY = 86400;
const ATTN_YELLOW_DAYS = 7;   // ab 7 Tagen ohne Aktivität (gelb) ...
const ATTN_RED_DAYS = 10;     // ... ab 10 Tagen rot
const ATTN_FAILS = 3;         // 3 Fehlversuche im selben Quiz ohne Bestehen (rot)
const ATTN_MAX = 8;           // höchstens so viele Zeilen in der Liste
const HARD_MIN_ANSWERS = 5;   // Fragen erst ab so vielen Antworten in der Auswertung

// Frage-Titel kurz (DE): an Wortgrenze gekürzt
function shortTitle(text, max = 64) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.\-–?]+$/, '') + ' …';
}

async function chefCockpit({ env }) {
  const t = now();
  const weekAgo = t - 7 * DAY;
  const [team, firstTry, answerRows] = await Promise.all([
    loadTeam(env),
    all(env, 'SELECT passed FROM quiz_attempts WHERE id IN (SELECT MIN(id) FROM quiz_attempts GROUP BY emp_id, module)'),
    all(env, 'SELECT module, answers FROM quiz_attempts WHERE answers IS NOT NULL'),
  ]);

  // --- Kacheln: fertig / in Arbeit / nicht gestartet (zusammen = alle Mitarbeiter) ---
  const finishedList = team.filter((x) => x.finished);
  const notStarted = team.filter((x) => !x.finished && !x.started);
  const inWork = team.filter((x) => !x.finished && x.started);
  const lastCert = (x) => Math.max(0, ...x.certs.filter(Boolean).map((c) => c.issued_at || 0));
  const finishedWeek = finishedList.filter((x) => lastCert(x) >= weekAgo).length;
  const activeInWork = inWork.filter((x) => x.e.active);
  const curMods = activeInWork.map((x) => (x.current ? x.current.n : null)).filter((n) => n !== null);
  const avgModule = curMods.length ? Math.round((curMods.reduce((a, b) => a + b, 0) / curMods.length) * 10) / 10 : null;

  // --- Teile: wie viele haben das Zertifikat ---
  const parts = [1, 2, 3].map((k) => ({
    k,
    title: partTitle(k, 'de'),
    certified: team.filter((x) => x.certs[k - 1]).length,
    total: team.length,
  }));
  const certificatesTotal = team.reduce((a, x) => a + x.certs.filter(Boolean).length, 0);

  // --- Quiz im 1. Versuch bestanden (je Mitarbeiter und Modul zählt der erste Versuch) ---
  const firstTryRate = firstTry.length ? Math.round((firstTry.filter((r) => r.passed).length / firstTry.length) * 100) : null;

  // --- Braucht Aufmerksamkeit ---
  const attention = [];
  for (const x of team) {
    if (!x.e.active || x.finished) continue;
    const idle = Math.floor((t - x.lastSeen) / DAY);
    if (x.started && idle >= ATTN_YELLOW_DAYS) {
      attention.push({ id: x.e.id, name: `${x.e.first} ${x.e.last}`, kind: 'inactive', days: idle, module: x.current ? x.current.n : null, level: idle >= ATTN_RED_DAYS ? 'red' : 'yellow' });
    }
    const stuck = x.mods.filter((m) => m.attempts >= ATTN_FAILS && !m.quizPassed).sort((a, b) => b.attempts - a.attempts)[0];
    if (stuck) {
      attention.push({ id: x.e.id, name: `${x.e.first} ${x.e.last}`, kind: 'failed', fails: stuck.attempts, module: stuck.n, level: 'red' });
    }
  }
  attention.sort((a, b) => (a.level === b.level ? 0 : a.level === 'red' ? -1 : 1) || (b.days || b.fails * 3) - (a.days || a.fails * 3) || a.name.localeCompare(b.name, 'de'));

  // --- Zertifikate der letzten 7 Tage ---
  const recent = await all(
    env,
    `SELECT c.part, c.issued_at, e.id AS emp_id, e.first, e.last FROM certificates c JOIN employees e ON e.id = c.emp_id
     WHERE c.issued_at >= ? ORDER BY c.issued_at DESC LIMIT 20`,
    weekAgo,
  );

  // --- Am häufigsten falsch beantwortete Fragen (aus allen gespeicherten Antworten) ---
  const stat = new Map(); // "modul:frage" -> {n, wrong}
  for (const r of answerRows) {
    let a;
    try { a = JSON.parse(r.answers); } catch { continue; }
    const qs = QUIZ[r.module];
    if (!Array.isArray(a) || !qs) continue;
    qs.forEach((q, i) => {
      if (!Number.isInteger(a[i])) return;
      const key = r.module + ':' + i;
      const s = stat.get(key) || { module: r.module, q: i, n: 0, wrong: 0 };
      s.n++;
      if (a[i] !== q.correct) s.wrong++;
      stat.set(key, s);
    });
  }
  const hardest = [...stat.values()]
    .filter((s) => s.n >= HARD_MIN_ANSWERS && s.wrong > 0)
    .map((s) => ({ module: s.module, question: s.q, title: shortTitle(QUIZ[s.module][s.q].q.de), answers: s.n, wrongRate: Math.round((s.wrong / s.n) * 100) }))
    .sort((a, b) => b.wrongRate - a.wrongRate || b.answers - a.answers || a.module - b.module || a.question - b.question)
    .slice(0, 3);

  return json({
    asOf: t,
    registered: team.length,
    finished: finishedList.length,
    finishedWeek,
    inWork: inWork.length,
    notStarted: notStarted.length,
    avgModule,
    moduleTotal: MODS.length - 1,
    parts,
    certificatesTotal,
    firstTryRate,
    attention: attention.slice(0, ATTN_MAX),
    attentionTotal: attention.length,
    recentCerts: recent.map((r) => ({ empId: r.emp_id, name: `${r.first} ${r.last}`, part: r.part, issuedAt: r.issued_at })),
    hardest,
  });
}

async function chefEmployee({ env, params }) {
  const id = Number(params[0]);
  const e = Number.isInteger(id) ? await first(env, 'SELECT * FROM employees WHERE id = ?', id) : null;
  if (!e) throw new HttpError(404, msg('not_found', 'de'));
  const mods = await loadModules(env, id);
  const certs = await all(env, 'SELECT part, code, issued_at FROM certificates WHERE emp_id = ? ORDER BY part', id);
  return json({
    id: e.id,
    name: `${e.first} ${e.last}`,
    first: e.first,
    last: e.last,
    lang: e.lang,
    active: !!e.active,
    locked: !!(e.locked_until && e.locked_until > now()),
    createdAt: e.created_at,
    lastSeen: e.last_seen,
    done: mods.filter((m) => m.completed).length,
    total: mods.length,
    modules: mods.map((m) => ({
      n: m.n,
      title: MODS[m.n].de,
      completed: m.completed,
      completedAt: m.completedAt,
      maxPos: m.maxPos,
      duration: m.duration,
      quizBest: m.quizBest,
      attempts: m.attempts,
      unlocked: m.unlocked,
    })),
    certificates: certs.map((c) => ({ part: c.part, partTitle: partTitle(c.part, 'de'), code: c.code, issuedAt: c.issued_at })),
  });
}

async function loadEmployeeOr404(env, idStr) {
  const id = Number(idStr);
  const e = Number.isInteger(id) ? await first(env, 'SELECT * FROM employees WHERE id = ?', id) : null;
  if (!e) throw new HttpError(404, msg('not_found', 'de'));
  return e;
}

async function chefResetPin({ env, params }) {
  const e = await loadEmployeeOr404(env, params[0]);
  const pin = randomPin();
  const { hash, salt } = await hashSecret(peppered(env, pin));
  await run(env, 'UPDATE employees SET pin_hash = ?, pin_salt = ?, failed = 0, locked_until = NULL WHERE id = ?', hash, salt, e.id);
  await guardReset(env, 'n:' + e.name_key); // Fehlversuche und Sperren zurücksetzen
  await destroySessionsOf(env, 'emp', e.id);
  return json({ pin });
}

async function chefActive({ env, params, body }) {
  const e = await loadEmployeeOr404(env, params[0]);
  if (typeof body.active !== 'boolean') throw new HttpError(400, msg('bad_request', 'de'));
  await run(env, 'UPDATE employees SET active = ?, failed = 0, locked_until = NULL WHERE id = ?', body.active ? 1 : 0, e.id);
  await guardReset(env, 'n:' + e.name_key);
  if (!body.active) await destroySessionsOf(env, 'emp', e.id);
  return json({ ok: true, active: body.active });
}

async function chefSettings({ env }) {
  const admins = await all(env, 'SELECT id, name, username, role FROM admins ORDER BY id');
  return json({ companyCode: await getSetting(env, 'company_code'), admins });
}

async function chefRotate({ env }) {
  const old = await getSetting(env, 'company_code');
  let code;
  do { code = newCompanyCode(); } while (code === old);
  await setSetting(env, 'company_code', code);
  return json({ companyCode: code });
}

async function chefAddAdmin({ env, admin, body }) {
  if (admin.role !== 'owner') throw new HttpError(403, msg('owner_only', 'de'));
  const f = validAdminFields(body);
  if (!f) throw new HttpError(400, msg('admin_fields', 'de'));
  if (await first(env, 'SELECT 1 AS x FROM admins WHERE username = ?', f.username)) throw new HttpError(409, msg('admin_taken', 'de'));
  const { hash, salt } = await hashSecret(f.password);
  const r = await first(
    env,
    `INSERT INTO admins (name, username, pass_hash, pass_salt, role, created_at) VALUES (?, ?, ?, ?, 'admin', ?) RETURNING id`,
    f.name, f.username, hash, salt, now(),
  );
  return json({ ok: true, id: r.id });
}

// Hauptadmins (owner) dürfen andere Zugänge entfernen, auch andere Hauptadmins – aber nie sich selbst
// und nie den letzten Hauptadmin (atomar in einem Statement geprüft).
async function chefDeleteAdmin({ env, admin, params }) {
  if (admin.role !== 'owner') throw new HttpError(403, msg('owner_only', 'de'));
  const id = Number(params[0]);
  if (id === admin.id) throw new HttpError(400, msg('self_delete', 'de'));
  const target = Number.isInteger(id) ? await first(env, 'SELECT id, role FROM admins WHERE id = ?', id) : null;
  if (!target) throw new HttpError(404, msg('not_found', 'de'));
  const r = await run(
    env,
    `DELETE FROM admins WHERE id = ? AND (role != 'owner' OR (SELECT COUNT(*) FROM admins WHERE role = 'owner') > 1)`,
    id,
  );
  if (!r.meta.changes) throw new HttpError(400, msg('last_owner', 'de'));
  await destroySessionsOf(env, 'admin', id);
  return json({ ok: true });
}

// Rolle ändern: Admin <-> Hauptadmin (owner). Nur Hauptadmins; der letzte Hauptadmin bleibt Hauptadmin.
async function chefAdminRole({ env, admin, params, body }) {
  if (admin.role !== 'owner') throw new HttpError(403, msg('owner_only', 'de'));
  if (body.role !== 'owner' && body.role !== 'admin') throw new HttpError(400, msg('role_invalid', 'de'));
  const id = Number(params[0]);
  const target = Number.isInteger(id) ? await first(env, 'SELECT id, role FROM admins WHERE id = ?', id) : null;
  if (!target) throw new HttpError(404, msg('not_found', 'de'));
  if (target.role !== body.role) {
    const r = await run(
      env,
      `UPDATE admins SET role = ?1 WHERE id = ?2 AND (?1 = 'owner' OR role != 'owner' OR (SELECT COUNT(*) FROM admins WHERE role = 'owner') > 1)`,
      body.role, id,
    );
    if (!r.meta.changes) throw new HttpError(400, msg('last_owner', 'de'));
  }
  return json({ ok: true, role: body.role });
}

// Mitarbeiter endgültig löschen (nur Hauptadmin): Konto samt Fortschritt, Quiz, Sitzungen und Zertifikaten.
// Die Prüfseite zeigt danach für dessen Zertifikate "nicht gefunden". In EINEM Batch (atomar).
async function chefDeleteEmployee({ env, admin, params }) {
  if (admin.role !== 'owner') throw new HttpError(403, msg('owner_only', 'de'));
  const e = await loadEmployeeOr404(env, params[0]);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM progress WHERE emp_id = ?').bind(e.id),
    env.DB.prepare('DELETE FROM quiz_attempts WHERE emp_id = ?').bind(e.id),
    env.DB.prepare('DELETE FROM quiz_runs WHERE emp_id = ?').bind(e.id),
    env.DB.prepare("DELETE FROM sessions WHERE kind = 'emp' AND subject_id = ?").bind(e.id),
    env.DB.prepare('DELETE FROM certificates WHERE emp_id = ?').bind(e.id),
    env.DB.prepare('DELETE FROM login_guard WHERE key = ?').bind('n:' + e.name_key),
    env.DB.prepare('DELETE FROM employees WHERE id = ?').bind(e.id),
  ]);
  return json({ ok: true });
}

// CSV für Excel: Semikolon, UTF-8 mit BOM. Zellen mit Formel-Zeichen am Anfang werden entschärft.
const csvCell = (v) => {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const dateOnly = (sec) => (sec ? fmtDateTime(sec).slice(0, 10) : '');

async function chefExport({ env }) {
  const team = await loadTeam(env);
  const head = ['Name', 'Sprache', 'Videos erledigt', 'von', 'Aktuelles Modul', 'Zertifikat Teil 1', 'Zertifikat Teil 2', 'Zertifikat Teil 3', 'Quiz-Durchschnitt', 'Zuletzt aktiv', 'Status'];
  const rows = team.map((t) => [
    `${t.e.first} ${t.e.last}`,
    t.e.lang.toUpperCase(),
    t.done,
    MODS.length,
    t.finished ? 'Fertig' : t.current ? `Modul ${String(t.current.n).padStart(2, '0')} ${t.current.title}` : '',
    ...t.certs.map((c) => (c ? dateOnly(c.issued_at) : '')),
    t.quizAvg === null ? '' : String(t.quizAvg).replace('.', ','),
    fmtDateTime(t.lastSeen),
    t.e.active ? 'Aktiv' : 'Gesperrt',
  ]);
  const text = '﻿' + [head, ...rows].map((r) => r.map(csvCell).join(';')).join('\r\n') + '\r\n';
  const day = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date()); // JJJJ-MM-TT, Berliner Datum
  return new Response(text, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="mb-akademie-${day}.csv"`,
      'Cache-Control': 'no-store',
      ...SECURITY_HEADERS,
    },
  });
}

// =====================================================================
// Routentabelle: [Methode, Pfad-Regex, Auth, Handler]
// =====================================================================
const ROUTES = [
  ['POST', /^register$/, null, register],
  ['POST', /^login$/, null, login],
  ['POST', /^logout$/, null, logout],
  ['GET', /^verify$/, null, verifyCertificate],

  ['GET', /^me$/, 'emp', me],
  ['POST', /^lang$/, 'emp', setLang],
  ['POST', /^progress$/, 'emp', progress],
  ['GET', /^quiz\/(\d+)$/, 'emp', quizGet],
  ['POST', /^quiz\/(\d+)\/check$/, 'emp', quizCheck],
  ['POST', /^quiz\/(\d+)\/submit$/, 'emp', quizSubmit],
  ['GET', /^certificate\/(\d+)$/, 'emp', certificate],

  ['GET', /^chef\/status$/, null, chefStatus],
  ['POST', /^chef\/setup$/, null, chefSetup],
  ['POST', /^chef\/login$/, null, chefLogin],
  ['POST', /^chef\/logout$/, null, chefLogout],
  ['GET', /^chef\/team$/, 'admin', chefTeam],
  ['GET', /^chef\/cockpit$/, 'admin', chefCockpit],
  ['GET', /^chef\/employee\/(\d+)$/, 'admin', chefEmployee],
  ['POST', /^chef\/employee\/(\d+)\/reset-pin$/, 'admin', chefResetPin],
  ['POST', /^chef\/employee\/(\d+)\/active$/, 'admin', chefActive],
  ['POST', /^chef\/employee\/(\d+)\/delete$/, 'admin', chefDeleteEmployee],
  ['GET', /^chef\/settings$/, 'admin', chefSettings],
  ['POST', /^chef\/company-code\/rotate$/, 'admin', chefRotate],
  ['POST', /^chef\/admins$/, 'admin', chefAddAdmin],
  ['POST', /^chef\/admins\/(\d+)\/delete$/, 'admin', chefDeleteAdmin],
  ['POST', /^chef\/admins\/(\d+)\/role$/, 'admin', chefAdminRole],
  ['GET', /^chef\/export\.csv$/, 'admin', chefExport],
];

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  let lang = pickLang(request, null);
  try {
    const path = url.pathname.replace(/^\/api\//, '').replace(/\/+$/, '');
    let route = null, params = [], pathMatched = false;
    for (const r of ROUTES) {
      const m = path.match(r[1]);
      if (!m) continue;
      pathMatched = true;
      if (r[0] === request.method || (r[0] === 'GET' && request.method === 'HEAD')) { route = r; params = m.slice(1); break; }
    }
    if (!route) throw new HttpError(pathMatched ? 405 : 404, msg(pathMatched ? 'method' : 'not_found', lang));

    const [method, , auth, handler] = route;
    let body = {};
    if (method === 'POST') {
      // CSRF-Schutz zusätzlich zu SameSite: Origin muss die eigene Origin sein.
      if (!originOk(request)) throw new HttpError(403, msg('forbidden_origin', lang));
      body = await readJson(request);
      lang = pickLang(request, body);
    }
    const ctx = { request, env, url, params, body, lang };
    if (auth === 'emp') { ctx.emp = await requireEmployee(request, env); ctx.lang = ctx.emp.lang; }
    if (auth === 'admin') ctx.admin = await requireAdmin(request, env);
    return await handler(ctx);
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message, ...err.extra }, err.status);
    console.error('API-Fehler:', err && err.stack ? err.stack : err);
    return json({ error: msg('server', lang) }, 500);
  }
}
