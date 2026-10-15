// Datenbank-Helfer und Fachlogik (Freischaltung, Zertifikate, Rate-Limits).
import { MODS, PARTS, durationOf, modulesOfPart } from './content.js';
import { randomCode } from './crypto.js';
import { now } from './util.js';

export const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// ---------- Kurzformen für D1 ----------
export const first = (env, sql, ...p) => env.DB.prepare(sql).bind(...p).first();
export const all = async (env, sql, ...p) => (await env.DB.prepare(sql).bind(...p).all()).results || [];
export const run = (env, sql, ...p) => env.DB.prepare(sql).bind(...p).run();

// ---------- Einstellungen ----------
export async function getSetting(env, key) {
  const row = await first(env, 'SELECT value FROM settings WHERE key = ?', key);
  return row ? row.value : null;
}

export const setSetting = (env, key, value) =>
  run(env, 'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', key, value);

export const newCompanyCode = () => 'MB-' + randomCode(CODE_ALPHABET, 4);

// ---------- Rate-Limits ----------
// Zählt einen Treffer im Zeitfenster und liefert den neuen Zählerstand.
export async function rateHit(env, key, windowSec) {
  const t = now();
  const row = await first(
    env,
    `INSERT INTO rate (key, count, window_start) VALUES (?1, 1, ?2)
     ON CONFLICT(key) DO UPDATE SET
       count = CASE WHEN window_start <= ?3 THEN 1 ELSE count + 1 END,
       window_start = CASE WHEN window_start <= ?3 THEN ?2 ELSE window_start END
     RETURNING count`,
    key, t, t - windowSec,
  );
  return row.count;
}

// Aktueller Zählerstand im Zeitfenster (ohne zu zählen).
export async function rateCount(env, key, windowSec) {
  const row = await first(env, 'SELECT count FROM rate WHERE key = ? AND window_start > ?', key, now() - windowSec);
  return row ? row.count : 0;
}

// Aufräumen: abgelaufene Sessions, alte Rate-/Sperr-Einträge, liegengebliebene Quiz-Läufe
// (wird bei Anmeldungen miterledigt).
export async function housekeeping(env) {
  const t = now();
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(t),
    env.DB.prepare('DELETE FROM rate WHERE window_start < ?').bind(t - 86400),
    env.DB.prepare('DELETE FROM login_guard WHERE updated_at < ? AND locked_until < ?').bind(t - 86400, t),
    env.DB.prepare('DELETE FROM quiz_runs WHERE created_at < ?').bind(t - 86400),
  ]);
}

// ---------- Eskalierende Sperren bei Fehlversuchen (Login) ----------
// Je 5 Fehlversuche (seit dem letzten Erfolg) wird die nächste Stufe gesperrt:
// 5 -> 15 min, 10 -> 1 h, 15 -> 24 h, 20 -> "permanent" (permSeconds; Chef-Zugänge: nur 24 h).
// Das Zählen läuft in EINEM atomaren UPSERT (erst zählen, dann prüfen); prev_locked liefert die Sperre
// VOR diesem Versuch. Nur wenn sie abgelaufen war, darf das Passwort/die PIN geprüft werden.
export const PERM_LOCK_SECONDS = 10 * 365 * 86400;

// Lesender Vorab-Check (spart das Zählen, solange eine Sperre läuft). Rückgabe: locked_until oder 0.
export async function guardLockedUntil(env, key) {
  const row = await first(env, 'SELECT locked_until FROM login_guard WHERE key = ?', key);
  return row && row.locked_until > now() ? row.locked_until : 0;
}

// Zählt einen Versuch. Rückgabe: { count, lockedUntil, allowed }.
export async function guardAttempt(env, key, permSeconds = PERM_LOCK_SECONDS) {
  const t = now();
  const r = await first(
    env,
    `INSERT INTO login_guard (key, count, locked_until, prev_locked, updated_at) VALUES (?1, 1, 0, 0, ?2)
     ON CONFLICT(key) DO UPDATE SET
       prev_locked = locked_until,
       count = count + 1,
       updated_at = ?2,
       locked_until = CASE WHEN (count + 1) % 5 = 0
         THEN ?2 + (CASE WHEN count + 1 >= 20 THEN ?3 WHEN count + 1 >= 15 THEN 86400 WHEN count + 1 >= 10 THEN 3600 ELSE 900 END)
         ELSE locked_until END
     RETURNING count, locked_until, prev_locked`,
    key, t, permSeconds,
  );
  return { count: r.count, lockedUntil: r.locked_until, allowed: r.prev_locked <= t };
}

export const guardReset = (env, key) => run(env, 'DELETE FROM login_guard WHERE key = ?', key);

// ---------- Fortschritt, Freischaltung ----------
// Rechnet aus Fortschritts- und Quiz-Zeilen den Stand aller 16 Module aus.
// progressRows: [{module, max_pos, completed_at}], quizRows: [{module, best, passed, attempts}]
export function computeModules(env, progressRows, quizRows) {
  const pm = new Map(progressRows.map((r) => [r.module, r]));
  const qm = new Map(quizRows.map((r) => [r.module, r]));
  const mods = MODS.map((m) => {
    const p = pm.get(m.n);
    const q = qm.get(m.n);
    const duration = durationOf(m.n, env);
    const completed = !!(p && p.completed_at);
    return {
      n: m.n,
      part: m.p,
      duration,
      maxPos: completed ? duration : p ? Math.min(p.max_pos, duration) : 0,
      completed,
      completedAt: p ? p.completed_at : null,
      started: !!p,
      quizPassed: !!(q && q.passed),
      quizBest: q ? q.best : null,
      attempts: q ? q.attempts : 0,
      // Modul 0 hat kein Quiz: Video genügt. Sonst Video fertig UND Quiz bestanden.
      fullyDone: completed && (m.n === 0 || !!(q && q.passed)),
      unlocked: false,
    };
  });
  // Freischaltung: Modul n frei, wenn n = 0 oder Vorgänger vollständig erledigt.
  mods.forEach((m, i) => { m.unlocked = i === 0 || mods[i - 1].fullyDone; });
  return mods;
}

// Teilstand: Teil k abgeschlossen, wenn alle seine Module fullyDone sind.
export function computeParts(mods) {
  return [1, 2, 3].map((k) => {
    const list = mods.filter((m) => m.part === k);
    const done = list.filter((m) => m.fullyDone).length;
    return { k, done, total: list.length, complete: done === list.length };
  });
}

export function sumRemainingSec(mods) {
  return Math.round(mods.reduce((a, m) => a + Math.max(0, m.duration - (m.completed ? m.duration : m.maxPos)), 0));
}

export async function loadModules(env, empId) {
  const [prog, quiz] = await Promise.all([
    all(env, 'SELECT module, max_pos, completed_at FROM progress WHERE emp_id = ?', empId),
    all(
      env,
      'SELECT module, MAX(score) AS best, MAX(passed) AS passed, COUNT(*) AS attempts FROM quiz_attempts WHERE emp_id = ? GROUP BY module',
      empId,
    ),
  ]);
  return computeModules(env, prog, quiz);
}

export async function isUnlocked(env, empId, n) {
  if (n === 0) return true;
  const prog = await first(env, 'SELECT completed_at FROM progress WHERE emp_id = ? AND module = ?', empId, n - 1);
  if (!prog || !prog.completed_at) return false;
  if (n - 1 === 0) return true;
  const q = await first(env, 'SELECT 1 AS ok FROM quiz_attempts WHERE emp_id = ? AND module = ? AND passed = 1 LIMIT 1', empId, n - 1);
  return !!q;
}

// ---------- Zertifikate ----------
// Legt fehlende Zertifikate für abgeschlossene Teile an. Rückgabe: neu erstellte [{part, code}].
export async function ensureCertificates(env, empId) {
  const mods = await loadModules(env, empId);
  const existing = await all(env, 'SELECT part FROM certificates WHERE emp_id = ?', empId);
  const have = new Set(existing.map((r) => r.part));
  const created = [];
  for (const p of computeParts(mods)) {
    if (!p.complete || have.has(p.k)) continue;
    for (let tries = 0; tries < 8; tries++) {
      const code = `MB-T${p.k}-${randomCode(CODE_ALPHABET, 4)}`;
      try {
        await run(env, 'INSERT INTO certificates (emp_id, part, code, issued_at) VALUES (?, ?, ?, ?)', empId, p.k, code, now());
        created.push({ part: p.k, code });
        break;
      } catch (e) {
        // Entweder gibt es das Zertifikat inzwischen (parallele Anfrage) oder der Code ist doppelt.
        const again = await first(env, 'SELECT 1 AS ok FROM certificates WHERE emp_id = ? AND part = ?', empId, p.k);
        if (again) break;
      }
    }
  }
  return created;
}

export function partTitle(k, lang) {
  const p = PARTS[k];
  return p ? p[lang === 'sq' ? 'sq' : 'de'] : '';
}

// Gesamtminuten (echte Dauer) der Module eines Teils.
export function partMinutes(k) {
  const sec = modulesOfPart(k).reduce((a, n) => a + MODS[n].duration, 0);
  return Math.round(sec / 60);
}
