// API-Tests für die M&B Akademie (Node 22, nur fetch, keine Bibliotheken).
//
// Voraussetzungen (siehe SPEC): lokaler Dev-Server auf Port 8788 mit
//   SETUP_TOKEN=test-setup-123 und DEV_SHORT=1 (steht in .dev.vars)
//   npx wrangler d1 execute akademie-db --local --file=schema.sql
//   npx wrangler pages dev public --port 8788
// Start: node tests/api.test.mjs
// Die Tests sind wiederholbar (zufällige Namen); die Ersteinrichtung läuft nur, wenn noch kein Chef existiert.
// Echte Video-Dauern (DEV_SHORT=0): siehe tests/progress-real.test.mjs.
import {
  BASE, CHEF, Client, ORIGIN, RUN_IP, SETUP_TOKEN, cap, ok, rnd, section, sleep, solveQuiz, sql, sqlRows, summary, watch,
} from './lib.mjs';

async function main() {
  const chef = new Client();
  const emp = new Client();
  const first = 'Arben', last = 'Test' + cap(rnd());
  const PIN = '4827';

  // =====================================================================
  section('Server erreichbar, Header, Methoden');
  const st0 = await chef.get('/api/chef/status');
  ok(st0.status === 200 && typeof st0.data.setupNeeded === 'boolean', 'GET /api/chef/status antwortet', st0);
  ok(st0.headers.get('cache-control') === 'no-store', 'API: Cache-Control no-store');
  ok(st0.headers.get('x-content-type-options') === 'nosniff', 'API: X-Content-Type-Options');
  ok(st0.headers.get('x-frame-options') === 'DENY', 'API: X-Frame-Options');
  ok(st0.headers.get('referrer-policy') === 'same-origin', 'API: Referrer-Policy');
  ok((await chef.get('/api/gibtsnicht')).status === 404, 'Unbekannte Route -> 404');
  ok((await chef.get('/api/login')).status === 405, 'GET auf POST-Route -> 405');
  const noOrigin = await chef.post('/api/login', { name: 'a b', pin: '4827' }, { origin: null });
  ok(noOrigin.status === 403, 'POST ohne Origin -> 403', noOrigin.status);
  const badOrigin = await chef.post('/api/login', { name: 'a b', pin: '4827' }, { origin: 'https://evil.example' });
  ok(badOrigin.status === 403, 'POST mit fremdem Origin -> 403', badOrigin.status);

  // =====================================================================
  section('Ersteinrichtung Chef');
  if (st0.data.setupNeeded) {
    const bad = await chef.post('/api/chef/setup', { setupToken: 'falsch', ...CHEF });
    ok(bad.status === 403, 'Setup mit falschem Code -> 403', bad.status);
    const short = await chef.post('/api/chef/setup', { setupToken: SETUP_TOKEN, ...CHEF, password: 'kurz' });
    ok(short.status === 400, 'Setup mit zu kurzem Passwort -> 400', short.status);
    const good = await chef.post('/api/chef/setup', { setupToken: SETUP_TOKEN, ...CHEF });
    ok(good.status === 200 && good.data.ok, 'Setup mit richtigem Code legt Owner an', good);
    ok(good.setCookies.some((c) => c.startsWith('mb_a=') && /HttpOnly/i.test(c) && /Secure/i.test(c) && /SameSite=Lax/i.test(c) && /Max-Age=43200/.test(c)), 'Chef-Cookie mb_a: HttpOnly, Secure, SameSite=Lax, 12 h');
    const again = await new Client().post('/api/chef/setup', { setupToken: SETUP_TOKEN, ...CHEF, username: 'zweiter' });
    ok(again.status === 404, 'Zweites Setup ist tot (404)', again.status);
  } else {
    console.log('  (Chef existiert schon, Setup übersprungen)');
    const l = await chef.post('/api/chef/login', { username: CHEF.username, password: CHEF.password });
    ok(l.status === 200, 'Chef-Login mit bekannten Daten', l);
  }
  const st1 = await chef.get('/api/chef/status');
  ok(st1.data.setupNeeded === false && st1.data.loggedIn === true && st1.data.me.username === CHEF.username, 'Status: eingerichtet und eingeloggt', st1.data);

  // =====================================================================
  section('Chef: Firmencode aus den Einstellungen');
  const set1 = await chef.get('/api/chef/settings');
  const CODE = set1.data && set1.data.companyCode;
  ok(/^MB-[A-HJ-NP-Z2-9]{4}$/.test(CODE || ''), 'Firmencode hat Format MB-XXXX', CODE);
  ok(Array.isArray(set1.data.admins) && set1.data.admins.some((a) => a.role === 'owner'), 'Settings listet Owner');
  ok((await new Client().get('/api/chef/settings')).status === 401, 'Settings ohne Chef-Login -> 401');
  ok((await new Client().get('/api/chef/team')).status === 401, 'Team ohne Chef-Login -> 401');

  // =====================================================================
  section('Registrierung');
  const reg = (over) => emp.post('/api/register', { code: CODE, first, last, lang: 'de', pin: PIN, ...over });
  const wrongCode = await reg({ code: 'MB-XXXX' });
  ok(wrongCode.status === 403 && /Firmencode/.test(wrongCode.data.error), 'Falscher Firmencode -> 403', wrongCode.data);
  for (const bad of ['1234', '0000', '1111', '4321']) {
    const r = await reg({ pin: bad });
    ok(r.status === 400, `Triviale PIN ${bad} -> 400`, r.data);
  }
  ok((await reg({ pin: '12' })).status === 400, 'PIN mit 2 Ziffern -> 400');
  ok((await reg({ pin: 'abcd' })).status === 400, 'PIN mit Buchstaben -> 400');
  ok((await reg({ pin: 4827 })).status === 400, 'PIN als Zahl statt Text -> 400');
  ok((await reg({ lang: 'fr' })).status === 400, 'Ungültige Sprache -> 400');
  ok((await reg({ first: '<b>x</b>' })).status === 400, 'Name mit HTML -> 400');
  ok((await reg({ last: '' })).status === 400, 'Leerer Nachname -> 400');
  ok(Object.keys(emp.jar).length === 0, 'Nach Fehlern kein Cookie gesetzt');
  const ok1 = await reg();
  ok(ok1.status === 200 && ok1.data.ok === true, 'Registrierung mit richtigem Code', ok1);
  const sc = ok1.setCookies.find((c) => c.startsWith('mb_s='));
  ok(!!sc && /HttpOnly/i.test(sc) && /Secure/i.test(sc) && /SameSite=Lax/i.test(sc) && /Path=\//.test(sc) && /Max-Age=15552000/.test(sc), 'Cookie mb_s: HttpOnly, Secure, SameSite=Lax, Path=/, 180 Tage', sc);
  ok(/^mb_s=[A-Za-z0-9_-]{43}/.test(sc || ''), 'Token hat 32 Zufallsbytes (43 Zeichen Base64url)');
  const dup = await new Client().post('/api/register', { code: CODE, first: first.toUpperCase(), last: '  ' + last + ' ', lang: 'de', pin: '5839' });
  ok(dup.status === 409 && dup.data.error === 'Diesen Namen gibt es schon. Bitte im Büro melden.', 'Doppelter Name (Groß-/Kleinschreibung, Leerzeichen) -> 409', dup.data);
  const dupSq = await new Client().post('/api/register', { code: CODE, first, last, lang: 'sq', pin: '5839' });
  ok(dupSq.status === 409 && /Ky emër/.test(dupSq.data.error), 'Doppelter Name: Fehlertext in SQ', dupSq.data);

  // Rate-Limit Firmencode (mit eigener Test-IP, damit die anderen Tests nicht blockiert werden)
  const bruteIp = '203.0.113.' + (10 + Math.floor(Math.random() * 200));
  const brute = new Client(bruteIp);
  let last429 = null;
  for (let i = 0; i < 11; i++) last429 = await brute.post('/api/register', { code: 'MB-ZZZ' + i, first: 'Max', last: 'Brute' + rnd(), lang: 'de', pin: '5839' });
  ok(last429.status === 429, 'Nach 10 falschen Codes pro IP -> 429', last429.status);
  const bruteRight = await brute.post('/api/register', { code: CODE, first: 'Max', last: 'Brute' + rnd(), lang: 'de', pin: '5839' });
  ok(bruteRight.status === 429, 'Auch der richtige Code wird dann abgewiesen (429)', bruteRight.status);

  // =====================================================================
  section('/api/me');
  ok((await new Client().get('/api/me')).status === 401, '/api/me ohne Login -> 401');
  const me0 = await emp.get('/api/me');
  const m = me0.data;
  ok(me0.status === 200 && m.first === first && m.last === last && m.lang === 'de', '/api/me liefert Name und Sprache', m);
  ok(m.modules.length === 16 && m.modules.every((x, i) => x.n === i), '16 Module in Reihenfolge');
  ok(m.modules[0].unlocked && m.modules.slice(1).every((x) => !x.unlocked), 'Nur Modul 0 ist frei');
  ok(m.modules[1].title === 'Membran-Ausdehnungsgefäß (MAG) Heizung' && m.modules[1].points.length === 4 && m.modules[1].goal.length > 10, 'Modul 1: Titel, Lernziel, 4 Kernpunkte (DE)');
  ok(m.modules.map((x) => x.part).join('') === '1111111122223333', 'Teile: 1 = 0-7, 2 = 8-11, 3 = 12-15');
  ok(m.parts.length === 3 && m.parts[0].title === 'Bauteile' && m.parts[0].total === 8 && m.parts[1].total === 4 && m.parts[2].total === 4, 'Teile mit Titel und Anzahl', m.parts);
  ok(m.totals.done === 0 && m.totals.total === 16 && m.totals.remainingSec === 16 * 8, 'Totals bei DEV_SHORT (16 x 8 s)', m.totals);
  const sq = await emp.post('/api/lang', { lang: 'sq' });
  ok(sq.status === 200, 'POST /api/lang sq');
  const meSq = (await emp.get('/api/me')).data;
  ok(meSq.lang === 'sq' && meSq.modules[1].title.startsWith('Ena e zgjerimit') && meSq.parts[0].title === 'Pjesët', '/api/me in Albanisch');
  ok((await emp.post('/api/lang', { lang: 'xx' })).status === 400, 'Ungültige Sprache -> 400');
  await emp.post('/api/lang', { lang: 'de' });

  // =====================================================================
  section('Login, Fehlversuche, Sperre');
  const lc = new Client();
  ok((await lc.post('/api/login', { name: 'Gibt Esnicht', pin: '4827' })).status === 401, 'Unbekannter Name -> 401');
  const w1 = await lc.post('/api/login', { name: `${first} ${last}`, pin: '9999' });
  ok(w1.status === 401 && w1.data.remaining === 4 && /Noch 4 Versuche/.test(w1.data.error), 'Falsche PIN -> "Noch 4 Versuche"', w1.data);
  const w2 = await lc.post('/api/login', { name: `${first} ${last}`, pin: '9998' });
  ok(w2.data.remaining === 3, 'Zweiter Fehlversuch: 3 übrig', w2.data);
  const good = await lc.post('/api/login', { name: `  ${first.toLowerCase()}   ${last.toUpperCase()} `, pin: PIN });
  ok(good.status === 200 && good.data.ok && !!lc.jar.mb_s, 'Richtige PIN (Name unabhängig von Schreibweise) -> Cookie', good);
  ok((await lc.get('/api/me')).data.first === first, 'Login-Session funktioniert');
  const w3 = await new Client().post('/api/login', { name: `${first} ${last}`, pin: '9997' });
  ok(w3.data.remaining === 4, 'Erfolgreicher Login setzt Zähler zurück (wieder 4 übrig)', w3.data);
  // Sperre nach 5 Fehlversuchen (eigener Mitarbeiter)
  const lockFirst = 'Sperr', lockLast = 'Test' + cap(rnd());
  const lockC = new Client();
  await lockC.post('/api/register', { code: CODE, first: lockFirst, last: lockLast, lang: 'de', pin: '2846' });
  const nm = `${lockFirst} ${lockLast}`;
  const rem = [];
  let r5;
  for (let i = 0; i < 5; i++) { r5 = await new Client().post('/api/login', { name: nm, pin: '0001' }); rem.push(r5.data.remaining); }
  ok(rem.join(',') === '4,3,2,1,0', 'Restversuche 4,3,2,1,0', rem);
  ok(r5.status === 429 && /Gesperrt/i.test(r5.data.error), 'Fünfter Fehlversuch sperrt (429)', r5.data);
  const lockedGood = await new Client().post('/api/login', { name: nm, pin: '2846' });
  ok(lockedGood.status === 429, 'Richtige PIN während der Sperre wird abgewiesen', lockedGood.data);
  sql(`UPDATE login_guard SET locked_until = 1 WHERE key = 'n:${nm.toLowerCase()}'`);
  const afterLock = await new Client().post('/api/login', { name: nm, pin: '2846' });
  ok(afterLock.status === 200, 'Nach Ablauf der Sperre geht der Login wieder', afterLock.data);

  // =====================================================================
  section('Video-Zugriff und Fortschritt (Modul 0)');
  const noSess = new Client();
  ok((await noSess.get('/videos/M00_DE.mp4')).status === 403, 'Video ohne Session -> 403');
  const v0 = await emp.get('/videos/M00_DE.mp4');
  ok(v0.status === 200, 'Video Modul 0 mit Session -> 200', v0.status);
  ok((v0.headers.get('cache-control') || '').includes('no-store') && (v0.headers.get('cache-control') || '').includes('private'), 'Video: Cache-Control private, no-store', v0.headers.get('cache-control'));
  const vr = await emp.get('/videos/M00_DE.mp4', { headers: { Range: 'bytes=0-99' } });
  ok(vr.status === 206 || vr.status === 200, 'Video: Range-Request wird bedient', vr.status);
  ok((await emp.get('/videos/M01_DE.mp4')).status === 403, 'Video Modul 1 vor Freischaltung -> 403');
  ok((await emp.get('/videos/M01_SQ.mp4')).status === 403, 'Video Modul 1 (SQ) vor Freischaltung -> 403');
  ok((await emp.get('/videos/M99_DE.mp4')).status === 404, 'Unbekannte Videodatei -> 404');
  ok((await chef.get('/videos/M09_DE.mp4')).status === 200, 'Chef darf jedes Video (Modul 9) -> 200');
  const p1 = await emp.post('/api/progress', { module: 1, pos: 3 });
  ok(p1.status === 403, 'Fortschritt Modul 1 vor Modul 0 -> 403', p1.data);
  ok((await emp.post('/api/progress', { module: 99, pos: 3 })).status === 400, 'Fortschritt: ungültiges Modul -> 400');
  ok((await emp.post('/api/progress', { module: 0, pos: 'x' })).status === 400, 'Fortschritt: ungültige Position -> 400');
  ok((await emp.get('/api/quiz/0')).status === 404, 'Modul 0 hat kein Quiz -> 404');

  // Vorspul-Schutz (Befund 1): Guthaben nur aus vergangener Zeit; Meldungen < 2 s geben nichts und
  // verschieben den Zeitpunkt nicht. Erste Meldung (pos 1) wird übernommen.
  const a = await emp.post('/api/progress', { module: 0, pos: 1 });
  ok(a.status === 200 && a.data.maxPos === 1 && a.data.completed === false, 'Erste Meldung (pos 1) wird übernommen', a.data);
  const jump = await emp.post('/api/progress', { module: 0, pos: 1000 });
  ok(jump.data.maxPos === 1 && jump.data.completed === false, 'Sofortiger Sprung (dt < 2 s) bringt KEIN Guthaben (kein pauschales +3)', jump.data);
  const back = await emp.post('/api/progress', { module: 0, pos: 0.5 });
  ok(back.data.maxPos === 1, 'Zurückspulen verringert maxPos nicht', back.data);
  // Schnelle Meldungen verschieben last_report NICHT: nach 3 x 0,9 s zählt die Zeit seit der ersten Meldung (~2,7 s).
  await sleep(900); const f1 = await emp.post('/api/progress', { module: 0, pos: 100 });
  await sleep(900); const f2 = await emp.post('/api/progress', { module: 0, pos: 100 });
  await sleep(900); const f3_ = await emp.post('/api/progress', { module: 0, pos: 100 });
  ok(f1.data.maxPos === 1 && f2.data.maxPos === 1, 'Meldungen nach 0,9 s und 1,8 s: kein Guthaben', [f1.data, f2.data]);
  ok(f3_.data.maxPos >= 1 + 2.5 && f3_.data.maxPos <= 1 + 1.25 * 4 && !f3_.data.completed, 'Nach ~2,7 s zählt die Zeit seit der ersten Meldung (1,25-fach), nicht seit der letzten', f3_.data);
  const mid = (await emp.get('/api/me')).data;
  ok(mid.modules[0].maxPos === f3_.data.maxPos && !mid.modules[0].completed && !mid.modules[1].unlocked, '/api/me spiegelt maxPos; Modul 1 noch gesperrt');
  // Realistischer 5-s-Takt (Heartbeat des Players) schließt ab: Position folgt der Wiedergabe in Echtzeit.
  await sleep(3200);
  const beat1 = await emp.post('/api/progress', { module: 0, pos: Math.min(8, f3_.data.maxPos + 3.2) });
  ok(beat1.data.maxPos > f3_.data.maxPos, 'Heartbeat im Echtzeit-Takt (Position folgt der Zeit) wird übernommen', beat1.data);
  const c = beat1.data.completed ? beat1 : await (async () => { await sleep(3200); return emp.post('/api/progress', { module: 0, pos: 8 }); })();
  ok(c.data.completed === true && c.data.maxPos === 8, 'Modul 0 abgeschlossen (maxPos = Dauer)', c.data);
  const after = (await emp.get('/api/me')).data;
  ok(after.modules[0].completed && after.modules[1].unlocked && !after.modules[2].unlocked, 'Modul 1 erst NACH Modul 0 frei, Modul 2 noch nicht');
  ok(after.parts[0].done === 1 && after.totals.done === 1, 'Teil 1: 1 von 8 erledigt (Modul 0 ohne Quiz)', after.parts[0]);
  const c2 = await emp.post('/api/progress', { module: 0, pos: 2 });
  ok(c2.data.completed === true, 'Erneutes Melden bei fertigem Modul bleibt completed', c2.data);
  ok((await emp.get('/videos/M01_DE.mp4')).status === 200, 'Video Modul 1 ist jetzt freigegeben -> 200');
  ok((await emp.get('/videos/M02_DE.mp4')).status === 403, 'Video Modul 2 noch 403');

  // =====================================================================
  section('Quiz (Modul 1): holen, prüfen, durchfallen, bestehen');
  const early = await emp.get('/api/quiz/1');
  ok(early.status === 403, 'Quiz vor Video-Ende -> 403', early.data);
  const w = await watch(emp, 1);
  ok(w.data.completed === true, 'Modul 1 Video abgeschlossen', w.data);
  const qg = await emp.get('/api/quiz/1');
  ok(qg.status === 200 && qg.data.questions.length === 5 && Number.isInteger(qg.data.runId), 'Quiz liefert runId und 5 Fragen', qg.data);
  ok(qg.data.questions.every((q) => typeof q.q === 'string' && q.a.length === 4 && q.a.every((x) => Number.isInteger(x.id) && typeof x.text === 'string')), 'Jede Frage: Text + 4 Antworten mit ID');
  ok(!/correct|why/.test(JSON.stringify(qg.data)), 'Quiz-Antwort enthält keine Lösung');
  ok(qg.data.questions.every((q) => [0, 1, 2, 3].every((i) => q.a.some((x) => x.id === i))), 'Antwort-IDs 0-3 vollständig');
  const run1 = qg.data.runId;
  const chkOne = await emp.post('/api/quiz/1/check', { runId: run1, q: 0, a: 0 });
  ok(typeof chkOne.data.correct === 'boolean' && Number.isInteger(chkOne.data.correctId) && typeof chkOne.data.why === 'string', 'check liefert correct, correctId, why', chkOne.data);
  // Befund 3: pro Lauf und Frage genau eine Antwort
  const other = 1; // erste Antwort war 0
  const second = await emp.post('/api/quiz/1/check', { runId: run1, q: 0, a: other });
  ok(second.status === 409, 'Zweite (andere) Antwort auf dieselbe Frage im selben Lauf -> 409', second);
  const sameAgain = await emp.post('/api/quiz/1/check', { runId: run1, q: 0, a: 0 });
  ok(sameAgain.status === 200 && sameAgain.data.correctId === chkOne.data.correctId, 'Identische Wiederholung (Verbindungsabbruch) bekommt dieselbe Rückmeldung');
  ok((await emp.post('/api/quiz/1/check', { q: 1, a: 0 })).status === 400, 'check ohne runId -> 400');
  ok((await emp.post('/api/quiz/1/check', { runId: 999999, q: 1, a: 0 })).status === 404, 'check mit fremder/unbekannter runId -> 404');
  ok((await emp.post('/api/quiz/1/check', { runId: run1, q: 7, a: 0 })).status === 400, 'check mit ungültiger Frage -> 400');
  ok((await emp.post('/api/quiz/1/check', { runId: run1, q: 1, a: 4 })).status === 400, 'check mit ungültiger Antwort-ID -> 400');
  ok((await emp.post('/api/quiz/1/submit', { runId: run1 })).status === 400, 'submit mit unvollständigem Lauf (1 von 5 Fragen) -> 400');
  ok((await emp.post('/api/quiz/1/submit', { answers: [0, 1, 2, 3, 1] })).status === 400, 'submit im alten Format (answers) -> 400');
  ok((await emp.post('/api/quiz/1/submit', { runId: run1, answers: [0, 1, 2, 3, 1] })).status === 400, 'submit mit runId UND answers -> 400');
  ok((await emp.get('/api/quiz/2')).status === 403, 'Quiz Modul 2 (nicht freigeschaltet) -> 403');
  // Lauf eines anderen Mitarbeiters ist nicht benutzbar
  const spy = new Client();
  await spy.post('/api/register', { code: CODE, first: 'Spy', last: 'Run' + cap(rnd()), lang: 'de', pin: '5839' });
  await watch(spy, 0); await watch(spy, 1);
  ok((await spy.post('/api/quiz/1/check', { runId: run1, q: 1, a: 0 })).status === 404, 'Fremde runId (anderer Mitarbeiter) -> 404');
  // Neuer Abruf (GET) ersetzt den alten, unfertigen Lauf: der alte ist danach nicht mehr nutzbar.
  const qg2 = await emp.get('/api/quiz/1');
  ok(qg2.data.runId !== run1, 'Neuer Abruf = neuer Lauf');
  ok((await emp.post('/api/quiz/1/check', { runId: run1, q: 2, a: 0 })).status === 404, 'Der alte, unfertige Lauf ist nach neuem Abruf ungültig (404)');
  // Alle vier Antworten durchprobieren (die Lösung "aus dem Server rausholen") geht nicht: nur eine Antwort je Frage.
  const probes = [];
  for (let k = 0; k < 4; k++) probes.push((await emp.post('/api/quiz/1/check', { runId: qg2.data.runId, q: 3, a: k })).status);
  ok(probes.filter((x) => x === 200).length === 1 && probes.filter((x) => x === 409).length === 3, 'Vier verschiedene Antworten auf Frage 4: nur die erste zählt (1x 200, 3x 409)', probes);
  const fail = await solveQuiz(emp, 1, 5);
  ok(fail.sub.data.score === 0 && fail.sub.data.passed === false && fail.sub.data.results.every((x) => x === false) && fail.sub.data.unlockedNext === null, 'Alles falsch: durchgefallen, nichts freigeschaltet', fail.sub.data);
  ok(!(await emp.get('/api/me')).data.modules[2].unlocked && (await emp.post('/api/progress', { module: 2, pos: 3 })).status === 403, 'Nach Durchfallen bleibt Modul 2 gesperrt');
  const f3 = await solveQuiz(emp, 1, 2);
  ok(f3.sub.data.score === 3 && f3.sub.data.passed === false, '3 von 5 richtig: nicht bestanden', f3.sub.data);
  const pass4 = await solveQuiz(emp, 1, 1);
  ok(pass4.sub.data.score === 4 && pass4.sub.data.passed === true && pass4.sub.data.results.filter(Boolean).length === 4, '4 von 5 richtig: bestanden', pass4.sub.data);
  ok(pass4.sub.data.unlockedNext && pass4.sub.data.unlockedNext.n === 2 && pass4.sub.data.unlockedNext.title.startsWith('Trinkwasser') && pass4.sub.data.unlockedNext.duration === 8, 'unlockedNext = Modul 2 mit Titel und Dauer', pass4.sub.data.unlockedNext);
  ok(pass4.sub.data.certificate === null, 'Noch kein Zertifikat nach Modul 1');
  const me2 = (await emp.get('/api/me')).data;
  ok(me2.modules[1].quizPassed && me2.modules[1].quizBest === 4 && me2.modules[2].unlocked, '/api/me: Modul 1 bestanden (Bestwert 4), Modul 2 frei', me2.modules[1]);
  const pass5 = await solveQuiz(emp, 1, 0);
  ok(pass5.sub.data.score === 5 && pass5.sub.data.passed, 'Wiederholen ist unbegrenzt möglich (5/5)');
  ok((await emp.get('/api/me')).data.modules[1].quizBest === 5, 'quizBest steigt auf 5');
  ok((await emp.get('/videos/M02_DE.mp4')).status === 200, 'Video Modul 2 nach bestandenem Quiz -> 200');
  // Modul 9: echte Frage 2 mit Lösung B (Index 1) – über Chef-Daten prüfbar, wenn freigeschaltet (später)

  // =====================================================================
  section('Zertifikat Teil 1 (Module 2-7)');
  let certFromSubmit = null;
  for (let n = 2; n <= 7; n++) {
    const wv = await watch(emp, n);
    const r = await solveQuiz(emp, n, 0);
    if (!wv.data.completed || !r.sub.data.passed) ok(false, `Modul ${n} durchspielen`, { wv: wv.data, sub: r.sub && r.sub.data });
    if (n < 7) {
      ok(r.sub.data.certificate === null, `Modul ${n}: noch kein Zertifikat`);
    } else {
      certFromSubmit = r.sub.data.certificate;
    }
  }
  ok(certFromSubmit && certFromSubmit.part === 1 && /^MB-T1-[A-HJ-NP-Z2-9]{4}$/.test(certFromSubmit.code), 'Nach Modul 7 entsteht Zertifikat Teil 1 (MB-T1-XXXX)', certFromSubmit);
  const me3 = (await emp.get('/api/me')).data;
  ok(me3.parts[0].certificate && me3.parts[0].certificate.code === certFromSubmit.code && me3.parts[0].done === 8 && me3.parts[1].certificate === null, '/api/me zeigt Zertifikat Teil 1');
  ok(me3.modules[8].unlocked, 'Modul 8 (Teil 2) ist nach Teil 1 frei');
  const again7 = await solveQuiz(emp, 7, 0);
  ok(again7.sub.data.certificate === null, 'Erneutes Bestehen erzeugt kein zweites Zertifikat');
  const cert = await emp.get('/api/certificate/1');
  ok(cert.status === 200 && cert.data.name === `${first} ${last}` && cert.data.part === 1 && cert.data.partTitle === 'Bauteile' && cert.data.code === certFromSubmit.code && cert.data.modules.length === 8 && Number.isInteger(cert.data.minutes) && cert.data.minutes > 0 && cert.data.issuedAt > 1.7e9, 'GET /api/certificate/1: Daten fürs PDF', cert.data);
  ok(cert.data.minutes === 46, 'Minuten Teil 1 aus echten Dauern (46)', cert.data.minutes);
  ok((await emp.get('/api/certificate/2')).status === 404, 'Zertifikat Teil 2 existiert noch nicht -> 404');
  ok((await emp.get('/api/certificate/7')).status === 404, 'Zertifikat Teil 7 -> 404');

  // =====================================================================
  section('Prüfseite /api/verify');
  const pub = new Client();
  const vOk = await pub.get('/api/verify?code=' + certFromSubmit.code);
  ok(vOk.data.valid === true && vOk.data.name === `${first} ${last}` && vOk.data.part === 1 && vOk.data.partTitle === 'Bauteile' && vOk.data.issuedAt === cert.data.issuedAt, 'Gültiger Code wird bestätigt', vOk.data);
  const vLow = await pub.get('/api/verify?code=' + certFromSubmit.code.toLowerCase());
  ok(vLow.data.valid === true, 'Code ist unabhängig von Groß-/Kleinschreibung');
  ok((await pub.get('/api/verify?code=MB-T1-ZZZZ')).data.valid === false, 'Unbekannter Code -> valid:false');
  ok((await pub.get('/api/verify?code=%27%20OR%201%3D1')).data.valid === false, 'Ungültiges Format -> valid:false');
  ok((await pub.get('/api/verify')).data.valid === false, 'Ohne Code -> valid:false');
  const vLimitIp = new Client('198.51.100.' + (10 + Math.floor(Math.random() * 200)));
  let vl;
  for (let i = 0; i < 62; i++) vl = await vLimitIp.get('/api/verify?code=MB-T1-AAAA');
  ok(vl.status === 429, 'Verify: Rate-Limit 60/h pro IP -> 429', vl.status);

  // =====================================================================
  section('Chef: Team, Detail, PIN, Sperren');
  const team = await chef.get('/api/chef/team');
  const t = team.data;
  const mine = t.employees.find((e) => e.name === `${first} ${last}`);
  ok(team.status === 200 && t.summary.registered >= 2 && t.summary.cert1 >= 1 && typeof t.summary.finished === 'number' && typeof t.summary.inactive7 === 'number', 'Team: Summary', t.summary);
  ok(mine && mine.done === 8 && mine.total === 16 && mine.current && mine.current.n === 8 && mine.current.title === 'Warmwasserspeicher anschließen' && mine.finished === false && mine.certs.join() === 'true,false,false' && mine.lang === 'de' && mine.active === true, 'Team: Mitarbeiter-Zeile (8/16, aktuell Modul 8, Zertifikat T1)', mine);
  ok(typeof mine.quizAvg === 'number' && mine.quizAvg >= 4 && mine.lastSeen > 1.7e9, 'Team: Quiz-Durchschnitt und zuletzt aktiv', mine);
  const detail = await chef.get('/api/chef/employee/' + mine.id);
  ok(detail.status === 200 && detail.data.modules.length === 16 && detail.data.certificates.length === 1 && detail.data.certificates[0].code === certFromSubmit.code, 'Mitarbeiter-Detail', detail.status);
  const d1 = detail.data.modules[1];
  ok(d1.completed && d1.completedAt > 0 && d1.quizBest === 5 && d1.attempts === 4, 'Detail: Modul 1 completedAt, quizBest 5, 4 Versuche', d1);
  ok((await chef.get('/api/chef/employee/999999')).status === 404, 'Detail unbekannte ID -> 404');

  const oldSession = { ...emp.jar };
  const rp = await chef.post(`/api/chef/employee/${mine.id}/reset-pin`);
  ok(rp.status === 200 && /^\d{4}$/.test(rp.data.pin), 'reset-pin liefert neue 4-stellige PIN', rp.data);
  const stale = new Client(); stale.jar = oldSession;
  ok((await stale.get('/api/me')).status === 401, 'Nach reset-pin ist die alte Session ungültig');
  ok((await new Client().post('/api/login', { name: `${first} ${last}`, pin: PIN })).status === 401, 'Alte PIN funktioniert nicht mehr');
  const relog = new Client();
  ok((await relog.post('/api/login', { name: `${first} ${last}`, pin: rp.data.pin })).status === 200, 'Neue PIN funktioniert');
  const rp2 = await chef.post(`/api/chef/employee/${mine.id}/reset-pin`);
  ok(rp2.data.pin !== undefined && !isTrivialPinTest(rp2.data.pin), 'Zufalls-PIN ist nicht trivial', rp2.data.pin);
  ok((await new Client().post(`/api/chef/employee/${mine.id}/reset-pin`)).status === 401, 'reset-pin ohne Chef-Login -> 401');

  const lockedSession = new Client();
  await lockedSession.post('/api/login', { name: `${first} ${last}`, pin: rp2.data.pin });
  ok((await lockedSession.get('/api/me')).status === 200, 'Mitarbeiter eingeloggt vor dem Sperren');
  const deact = await chef.post(`/api/chef/employee/${mine.id}/active`, { active: false });
  ok(deact.status === 200 && deact.data.active === false, 'Mitarbeiter sperren');
  ok((await lockedSession.get('/api/me')).status === 401, 'Beim Sperren werden Sessions gelöscht');
  ok((await lockedSession.get('/videos/M00_DE.mp4')).status === 403, 'Gesperrter Mitarbeiter: Video -> 403');
  const lgDis = await new Client().post('/api/login', { name: `${first} ${last}`, pin: rp2.data.pin });
  ok(lgDis.status === 403 && lgDis.data.error === 'Konto gesperrt. Bitte im Büro melden.', 'Login gesperrt: "Konto gesperrt. Bitte im Büro melden."', lgDis.data);
  const inact = (await chef.get('/api/chef/team')).data.employees.find((e) => e.id === mine.id);
  ok(inact.active === false, 'Team zeigt active:false');
  ok((await chef.post(`/api/chef/employee/${mine.id}/active`, { active: 'ja' })).status === 400, 'active ohne Boolean -> 400');
  await chef.post(`/api/chef/employee/${mine.id}/active`, { active: true });
  const relogin = new Client();
  ok((await relogin.post('/api/login', { name: `${first} ${last}`, pin: rp2.data.pin })).status === 200, 'Entsperrt: Login geht wieder');
  Object.assign(emp.jar, relogin.jar); // ab hier mit gültiger Session weiterarbeiten

  // =====================================================================
  section('Chef: Einstellungen, Firmencode, Zugänge, Export');
  const rot = await chef.post('/api/chef/company-code/rotate');
  ok(rot.status === 200 && /^MB-[A-HJ-NP-Z2-9]{4}$/.test(rot.data.companyCode) && rot.data.companyCode !== CODE, 'Firmencode ändern', rot.data);
  ok((await chef.get('/api/chef/settings')).data.companyCode === rot.data.companyCode, 'Settings zeigen neuen Code');
  const oldCodeReg = await new Client().post('/api/register', { code: CODE, first: 'Alt', last: 'Code' + cap(rnd()), lang: 'de', pin: '5839' });
  ok(oldCodeReg.status === 403, 'Alter Firmencode funktioniert nicht mehr');
  const newCodeReg = await new Client().post('/api/register', { code: rot.data.companyCode.toLowerCase(), first: 'Neu', last: 'Code' + cap(rnd()), lang: 'sq', pin: '5839' });
  ok(newCodeReg.status === 200, 'Neuer Firmencode funktioniert (auch klein geschrieben)', newCodeReg.data);

  const uname = 'zweiter' + rnd(4);
  ok((await chef.post('/api/chef/admins', { name: 'Zweiter Chef', username: uname, password: 'kurz' })).status === 400, 'Admin mit kurzem Passwort -> 400');
  const addA = await chef.post('/api/chef/admins', { name: 'Zweiter Chef', username: uname, password: 'Zweites-Passwort-1' });
  ok(addA.status === 200 && Number.isInteger(addA.data.id), 'Owner legt Admin an', addA.data);
  ok((await chef.post('/api/chef/admins', { name: 'Doppelt', username: uname, password: 'Zweites-Passwort-1' })).status === 409, 'Doppelter Benutzername -> 409');
  const admin2 = new Client();
  ok((await admin2.post('/api/chef/login', { username: uname, password: 'Zweites-Passwort-1' })).status === 200, 'Zweiter Admin kann sich anmelden');
  ok((await admin2.get('/api/chef/team')).status === 200, 'Zweiter Admin sieht Team');
  ok((await admin2.post('/api/chef/admins', { name: 'X Y', username: 'dritter' + rnd(3), password: 'Drittes-Passwort-1' })).status === 403, 'Nicht-Owner darf keine Admins anlegen -> 403');
  ok((await admin2.post(`/api/chef/admins/${addA.data.id}/delete`)).status === 403, 'Nicht-Owner darf nicht löschen -> 403');
  const ownerId = set1.data.admins.find((x) => x.role === 'owner').id;
  ok((await chef.post(`/api/chef/admins/${ownerId}/delete`)).status === 400, 'Owner kann sich nicht selbst löschen -> 400');

  // Chef-Login: falsch / Sperre nach 5
  const adminLock = new Client();
  const lres = [];
  for (let i = 0; i < 5; i++) lres.push((await adminLock.post('/api/chef/login', { username: uname, password: 'falsch-falsch-1' })).status);
  ok(lres.join() === '401,401,401,401,429', 'Chef-Login: 4x 401, dann Sperre (429)', lres);
  ok((await adminLock.post('/api/chef/login', { username: uname, password: 'Zweites-Passwort-1' })).status === 429, 'Chef gesperrt: auch richtiges Passwort -> 429');
  ok((await adminLock.post('/api/chef/login', { username: 'gibtsnicht', password: 'irgendwas-langes' })).status === 401, 'Chef-Login unbekannter Benutzer -> 401');

  const delA = await chef.post(`/api/chef/admins/${addA.data.id}/delete`);
  ok(delA.status === 200, 'Owner löscht Admin');
  ok((await admin2.get('/api/chef/team')).status === 401, 'Gelöschter Admin: Session ungültig');

  const csvNo = await new Client().get('/api/chef/export.csv');
  ok(csvNo.status === 401, 'Export ohne Login -> 401');
  const csv = await chef.get('/api/chef/export.csv');
  ok(csv.status === 200 && (csv.headers.get('content-type') || '').startsWith('text/csv') && /attachment/.test(csv.headers.get('content-disposition') || ''), 'Export: text/csv als Download');
  ok(csv.text.charCodeAt(0) === 0xfeff, 'Export: UTF-8 mit BOM');
  const lines = csv.text.replace(/^﻿/, '').trim().split('\r\n');
  ok(lines[0] === 'Name;Sprache;Videos erledigt;von;Aktuelles Modul;Zertifikat Teil 1;Zertifikat Teil 2;Zertifikat Teil 3;Quiz-Durchschnitt;Zuletzt aktiv;Status', 'Export: Kopfzeile', lines[0]);
  const row = lines.find((l) => l.startsWith(`${first} ${last};`));
  const cols = (row || '').split(';');
  ok(cols.length === 11 && cols[1] === 'DE' && cols[2] === '8' && cols[3] === '16' && cols[4] === 'Modul 08 Warmwasserspeicher anschließen' && /^\d\d\.\d\d\.\d{4}$/.test(cols[5]) && cols[6] === '' && /^\d,\d$|^\d$/.test(cols[8]) && cols[10] === 'Aktiv', 'Export: Zeile des Testmitarbeiters', cols);

  // =====================================================================
  // Befunde aus dem unabhängigen Review (jeder Test wäre vorher fehlgeschlagen)
  // =====================================================================
  const CUR = rot.data.companyCode; // aktueller Firmencode (nach dem Ändern oben)

  section('Review 2: Video-Pfade ohne Login (Umgehungsversuche)');
  const anon = new Client();
  const viaAnon = [
    '/videos/M05_DE.mp4', '/videos//M05_DE.mp4', '//videos/M05_DE.mp4', '/videos%2FM05_DE.mp4', '/%76ideos/M05_DE.mp4',
    '/videos/./M05_DE.mp4', '/videos/../videos/M05_DE.mp4', '/VIDEOS/M05_DE.mp4', '/videos/m05_de.MP4', '/videos/%4d05_DE.mp4',
    '/videos%5CM05_DE.mp4', '/videos\\M05_DE.mp4', '/videos/%252e/M05_DE.mp4', '/videos%252FM05_DE.mp4', '/%2576ideos/M05_DE.mp4',
    '/x/../videos/M05_DE.mp4', '/videos/M05_DE.mp4/', '/videos///M05_SQ.mp4', '/%2e/videos/M05_DE.mp4',
  ];
  for (const v of viaAnon) {
    const r = await anon.raw(v);
    ok(r.status === 403, `Ohne Login gesperrt: ${v}`, r.status);
  }
  for (const v of ['/videos/M99_DE.mp4', '/videos/secret.txt', '/videos/M05_DE.mp4.bak', '/videos/%zz', '/assets/x.mp4', '/videos']) {
    const r = await anon.raw(v);
    ok(r.status === 404, `Ungültiger Video-Pfad -> 404: ${v}`, r.status);
  }
  ok((await anon.raw('/index.html')).status === 200 || (await anon.raw('/')).status === 200, 'Normale Seiten sind weiter erreichbar');
  const empV = new Client(); empV.jar = { ...relogin.jar };
  await empV.post('/api/login', { name: `${first} ${last}`, pin: rp2.data.pin });
  const okV = await empV.raw('//videos/M00_DE.mp4');
  ok(okV.status === 200 && okV.body.length > 1000 && okV.headers['cache-control'] === 'private, no-store', 'Mitarbeiter: freigeschaltetes Video über //videos/ -> 200 (ausgeliefert, no-store)', okV.status);
  ok((await empV.raw('/%76ideos/M00_DE.mp4')).status === 200, 'Mitarbeiter: %76ideos-Variante des freigeschalteten Videos -> 200');
  ok((await empV.raw('/videos//M12_DE.mp4')).status === 403, 'Mitarbeiter: gesperrtes Modul 12 über //-Variante -> 403');
  ok((await empV.raw('/VIDEOS/M13_SQ.mp4')).status === 403, 'Mitarbeiter: gesperrtes Modul 13 über Großschreibung -> 403');
  const chefV = await chef.raw('/%76ideos/M09_DE.mp4');
  ok(chefV.status === 200, 'Chef darf jedes Video, auch über %76ideos -> 200', chefV.status);

  section('Review 2: Login – unbekannte Namen, Stufen-Sperren, Sperre bis Chef-Reset');
  const ipL = '203.0.113.' + (10 + Math.floor(Math.random() * 100));
  const known = { first: 'Kerim', last: 'Esk' + cap(rnd()) };
  const unk = { first: 'Unbek', last: 'Ann' + cap(rnd()) };
  const kc = new Client(ipL);
  ok((await kc.post('/api/register', { code: CUR, ...known, lang: 'de', pin: '5839' })).status === 200, 'Testkonto für Stufen-Sperre angelegt');
  const nmK = `${known.first} ${known.last}`, nmU = `${unk.first} ${unk.last}`;
  const keyK = nmK.toLowerCase(), keyU = nmU.toLowerCase();
  const fails = async (name, n) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const r = await new Client(ipL).post('/api/login', { name, pin: '0001' });
      out.push([r.status, r.data.remaining, r.data.locked || false, r.data.disabled || false, r.data.error]);
    }
    return out;
  };
  const free = () => sql(`UPDATE login_guard SET locked_until = 1 WHERE key IN ('n:${keyK}', 'n:${keyU}')`);
  const s1k = await fails(nmK, 5), s1u = await fails(nmU, 5);
  ok(JSON.stringify(s1k) === JSON.stringify(s1u), 'Stufe 1: bekannter und unbekannter Name liefern identische Antworten (Status, remaining, Text)', { s1k, s1u });
  ok(s1u.map((x) => x[1]).join() === '4,3,2,1,0' && s1u[4][0] === 429 && /15 Minuten/.test(s1u[4][4]), 'Unbekannter Name: 4,3,2,1,0 Restversuche, dann 15 Minuten Sperre', s1u);
  const lk = await new Client(ipL).post('/api/login', { name: nmU, pin: '0001' });
  ok(lk.status === 429 && lk.data.locked === true, 'Unbekannter Name ist während der Sperre gesperrt (429)', lk.data);
  free();
  const s2k = await fails(nmK, 5), s2u = await fails(nmU, 5);
  ok(JSON.stringify(s2k) === JSON.stringify(s2u) && /60 Minuten/.test(s2k[4][4]), 'Stufe 2 (Versuche 6-10): identisch, Sperre 1 Stunde', s2k[4]);
  free();
  const s3k = await fails(nmK, 5), s3u = await fails(nmU, 5);
  ok(JSON.stringify(s3k) === JSON.stringify(s3u) && /24 Stunden/.test(s3k[4][4]), 'Stufe 3 (Versuche 11-15): identisch, Sperre 24 Stunden', s3k[4]);
  free();
  const s4k = await fails(nmK, 5), s4u = await fails(nmU, 5);
  ok(JSON.stringify(s4k) === JSON.stringify(s4u) && s4k[4][0] === 403 && s4k[4][4] === 'Konto gesperrt. Bitte im Büro melden.', 'Nach 20 Fehlversuchen: "Konto gesperrt. Bitte im Büro melden." (bekannt = unbekannt)', s4k[4]);
  free();
  const afterPerm = await new Client(ipL).post('/api/login', { name: nmK, pin: '5839' });
  ok(afterPerm.status === 403 && afterPerm.data.error === 'Konto gesperrt. Bitte im Büro melden.', 'Auch die richtige PIN geht nicht mehr (nur Chef-Reset)', afterPerm.data);
  const teamP = (await chef.get('/api/chef/team')).data.employees.find((e) => e.name === nmK);
  ok(teamP && teamP.active === false, 'Chef sieht das Konto als gesperrt');
  await chef.post(`/api/chef/employee/${teamP.id}/active`, { active: true });
  ok((await new Client(ipL).post('/api/login', { name: nmK, pin: '5839' })).status === 200, 'Nach Entsperren durch den Chef geht der Login wieder (Zähler zurückgesetzt)');

  section('Review 2: Chef-Login-Sperre pro Benutzername+IP, IP-Drosselung, Atomarität');
  const attacker = new Client('203.0.113.' + (120 + Math.floor(Math.random() * 100)));
  const atk = [];
  for (let i = 0; i < 5; i++) atk.push((await attacker.post('/api/chef/login', { username: CHEF.username, password: 'falsch-falsch-1' })).status);
  ok(atk.join() === '401,401,401,401,429', 'Fremde IP: 5 Fehlversuche auf "chef" sperren diese IP', atk);
  const ownerLogin = await new Client().post('/api/chef/login', { username: CHEF.username, password: CHEF.password });
  ok(ownerLogin.status === 200, 'Der Inhaber kann sich von seiner IP weiter anmelden (nicht von fremden IPs aussperrbar)', ownerLogin.status);
  const ipT = new Client('198.51.100.' + (10 + Math.floor(Math.random() * 100)));
  let thr = [];
  for (let i = 0; i < 31; i++) thr.push((await ipT.post('/api/chef/login', { username: 'nutzer' + i, password: 'irgendwas-langes' })).status);
  ok(thr.slice(0, 30).every((x) => x === 401) && thr[30] === 429, 'Chef-Login: globale IP-Drosselung (31. Versuch pro Stunde -> 429)', thr.slice(28));
  const par = new Client('198.51.100.' + (120 + Math.floor(Math.random() * 100)));
  const burst = await Promise.all(Array.from({ length: 130 }, () => par.post('/api/login', { name: 'x y', pin: 'abc' })));
  ok(burst.filter((r) => r.status === 429).length === 30, 'Login-IP-Drosselung ist atomar: von 130 parallelen Anfragen werden genau 100 durchgelassen, 30 gebremst', burst.filter((r) => r.status === 429).length);
  const par2 = new Client('198.51.100.' + (120 + Math.floor(Math.random() * 100)));
  const burst2 = await Promise.all(Array.from({ length: 60 }, (_, i) => par2.post('/api/register', { code: 'MB-ZZ' + i, first: 'Max', last: 'Muster', lang: 'de', pin: '5839' })));
  ok(burst2.filter((r) => r.status === 429).length >= 20, 'Registrierung: von 60 parallelen Raten höchstens 40 kommen durch (Zählen vor Prüfen)', burst2.filter((r) => r.status === 429).length);

  section('Review 2: Namen (NFKC, nur lateinische Buchstaben, türkisches İ/ı)');
  const nm0 = 'Test' + cap(rnd());
  const tk = new Client();
  const rTurk = await tk.post('/api/register', { code: CUR, first: 'İbrahim', last: nm0, lang: 'de', pin: '5839' });
  ok(rTurk.status === 200, 'Name mit İ wird akzeptiert', rTurk.data);
  ok((await new Client().post('/api/login', { name: `ibrahim ${nm0.toLowerCase()}`, pin: '5839' })).status === 200, 'Login mit "ibrahim" (kleines i) findet "İbrahim"');
  ok((await new Client().post('/api/login', { name: `ıbrahim ${nm0.toUpperCase()}`, pin: '5839' })).status === 200, 'Login mit punktlosem "ı" findet ebenfalls denselben Namen');
  ok((await new Client().post('/api/register', { code: CUR, first: 'Ibrahim', last: nm0, lang: 'de', pin: '5839' })).status === 409, 'Doppelter Name trotz İ/I-Schreibweise -> 409');
  ok((await new Client().post('/api/register', { code: CUR, first: 'Ａrben', last: last, lang: 'de', pin: '5839' })).status === 409, 'Vollbreite Buchstaben (NFKC) zählen als derselbe Name -> 409');
  for (const bad of ['Иван', 'محمد', 'Ali2', 'Ali😀', 'A', 'Ali_Baba', 'Ali.B', "Alí́́"]) {
    ok((await new Client().post('/api/register', { code: CUR, first: bad, last: 'Test' + cap(rnd()), lang: 'de', pin: '5839' })).status === 400, `Name abgelehnt: ${JSON.stringify(bad)}`);
  }
  const rE = await new Client().post('/api/register', { code: CUR, first: 'Ëndrit', last: "O’Brien-" + cap(rnd()), lang: 'sq', pin: '5839' });
  ok(rE.status === 200, 'Albanischer Name (Ë) und Apostroph/Bindestrich werden akzeptiert', rE.data);

  section('Review 2: "Nicht aktiv" nur vom Server, ein Maßstab');
  const T0 = (await chef.get('/api/chef/team')).data;
  const mine2 = T0.employees.find((e) => e.name === `${first} ${last}`);
  ok(typeof mine2.inactive === 'boolean' && mine2.inactive === false, 'Frisch aktiver Mitarbeiter: inactive=false');
  sql(`UPDATE employees SET last_seen = CAST(strftime('%s','now') AS INTEGER) - 9*86400 WHERE id = ${mine2.id}`);
  const T1 = (await chef.get('/api/chef/team')).data;
  ok(T1.employees.find((e) => e.id === mine2.id).inactive === true, '9 Tage nichts gesehen: inactive=true');
  ok(T1.summary.inactive7 === T1.employees.filter((e) => e.inactive).length && T1.summary.inactive7 >= 1, 'summary.inactive7 = Anzahl der inactive-Mitarbeiter (gleiche Definition)', T1.summary);
  sql(`UPDATE employees SET last_seen = NULL, created_at = CAST(strftime('%s','now') AS INTEGER) - 9*86400 WHERE id = ${mine2.id}`);
  ok((await chef.get('/api/chef/team')).data.employees.find((e) => e.id === mine2.id).inactive === true, 'Nie gesehen und vor > 7 Tagen angemeldet: inactive=true');
  await chef.post(`/api/chef/employee/${mine2.id}/active`, { active: false });
  const T2 = (await chef.get('/api/chef/team')).data;
  ok(T2.employees.find((e) => e.id === mine2.id).inactive === false && T2.summary.inactive7 === T2.employees.filter((e) => e.inactive).length, 'Gesperrte Konten zählen nicht als "nicht aktiv"');
  await chef.post(`/api/chef/employee/${mine2.id}/active`, { active: true });
  sql(`UPDATE employees SET last_seen = CAST(strftime('%s','now') AS INTEGER), created_at = CAST(strftime('%s','now') AS INTEGER) WHERE id = ${mine2.id}`);

  section('Review 2: CSV-Dateiname mit Berliner Datum');
  const berlinDay = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());
  const csv2 = await chef.get('/api/chef/export.csv');
  ok((csv2.headers.get('content-disposition') || '').includes(`mb-akademie-${berlinDay}.csv`), `Dateiname enthält das Berliner Datum (${berlinDay})`, csv2.headers.get('content-disposition'));

  // =====================================================================
  section('Chef-Cockpit: GET /api/chef/cockpit');
  const { QUIZ } = await import(new URL('../functions/_lib/quiz.js', import.meta.url).href);
  ok((await new Client().get('/api/chef/cockpit')).status === 401, 'Cockpit ohne Login -> 401');
  ok((await emp.get('/api/chef/cockpit')).status === 401, 'Cockpit mit Mitarbeiter-Session -> 401');
  const ckAdmin = new Client();
  const ckName = 'ck' + rnd(5);
  const ckMk = await chef.post('/api/chef/admins', { name: 'Cockpit Test', username: ckName, password: 'Cockpit-Test-123' });
  await ckAdmin.post('/api/chef/login', { username: ckName, password: 'Cockpit-Test-123' });
  const ckPlain = await ckAdmin.get('/api/chef/cockpit');
  ok(ckMk.status === 200 && ckPlain.status === 200, 'Cockpit: auch normaler Admin (nicht Hauptadmin) darf lesen', ckPlain.status);
  await chef.post(`/api/chef/admins/${ckMk.data.id}/delete`);

  const ck0r = await chef.get('/api/chef/cockpit');
  const ck0d = ck0r.data;
  ok(ck0r.status === 200 && ck0r.headers.get('cache-control') === 'no-store', 'Cockpit antwortet 200 (no-store)');
  ok(['asOf', 'registered', 'finished', 'finishedWeek', 'inWork', 'notStarted', 'avgModule', 'moduleTotal', 'parts', 'certificatesTotal', 'firstTryRate', 'attention', 'attentionTotal', 'recentCerts', 'hardest'].every((k) => k in ck0d), 'Cockpit: alle Felder vorhanden', Object.keys(ck0d));
  const teamNow = (await chef.get('/api/chef/team')).data.employees;
  ok(ck0d.registered === teamNow.length, 'Cockpit: registered = Anzahl Mitarbeiter', [ck0d.registered, teamNow.length]);
  ok(ck0d.finished === teamNow.filter((e) => e.finished).length && ck0d.notStarted === teamNow.filter((e) => !e.finished && !e.started).length && ck0d.finished + ck0d.inWork + ck0d.notStarted === ck0d.registered, 'Cockpit: fertig / in Arbeit / nicht gestartet passen zur Teamliste und ergeben zusammen alle', ck0d);
  ok(ck0d.inWork >= 1 && ck0d.notStarted >= 1, 'Cockpit: Testdaten decken in Arbeit und nicht gestartet ab', ck0d);
  ok(ck0d.parts.length === 3 && ck0d.parts.every((p, i) => p.k === i + 1 && p.total === ck0d.registered && p.certified === teamNow.filter((e) => e.certs[i]).length) && ck0d.parts[0].certified >= 1 && ck0d.parts[0].title === 'Bauteile', 'Cockpit: je Teil Anzahl mit Zertifikat / Gesamt', ck0d.parts);
  ok(ck0d.certificatesTotal === teamNow.reduce((a, e) => a + e.certs.filter(Boolean).length, 0) && ck0d.certificatesTotal >= 1, 'Cockpit: Zertifikate gesamt', ck0d.certificatesTotal);
  const ftRows = sqlRows('SELECT passed FROM quiz_attempts WHERE id IN (SELECT MIN(id) FROM quiz_attempts GROUP BY emp_id, module)');
  const ftExpect = ftRows.length ? Math.round((ftRows.filter((r) => r.passed).length / ftRows.length) * 100) : null;
  ok(ck0d.firstTryRate === ftExpect && (ftExpect === null || (ftExpect >= 0 && ftExpect <= 100)), 'Cockpit: Quote Quiz im 1. Versuch bestanden stimmt mit den Versuchen überein', [ck0d.firstTryRate, ftExpect]);
  ok(typeof ck0d.avgModule === 'number' && ck0d.avgModule >= 0 && ck0d.avgModule <= ck0d.moduleTotal && ck0d.moduleTotal === 15, 'Cockpit: Ø aktuelles Modul im Bereich 0..15', [ck0d.avgModule, ck0d.moduleTotal]);
  ok(Array.isArray(ck0d.attention) && ck0d.attention.every((a) => a.id && a.name && ['inactive', 'failed'].includes(a.kind) && ['red', 'yellow'].includes(a.level)) && Array.isArray(ck0d.recentCerts) && ck0d.hardest.length <= 3 && ck0d.hardest.every((h) => h.answers >= 5 && h.wrongRate > 0 && h.wrongRate <= 100 && h.title && Number.isInteger(h.module)), 'Cockpit: Listen haben gültige Struktur (Fragen erst ab 5 Antworten)', ck0d);
  ok(ck0d.recentCerts.some((r) => r.name === `${first} ${last}` && r.part === 1 && r.issuedAt > 1.7e9), 'Cockpit: frisches Zertifikat steht in "diese Woche"', ck0d.recentCerts);

  // Aufmerksamkeit: Inaktivität gelb (7-9 Tage) / rot (ab 10), Fehlversuche rot
  const attOf = async () => (await chef.get('/api/chef/cockpit')).data.attention.filter((a) => a.id === mine2.id);
  sql(`UPDATE employees SET last_seen = CAST(strftime('%s','now') AS INTEGER) - 6*86400 WHERE id = ${mine2.id}`);
  ok((await attOf()).length === 0, '6 Tage inaktiv: noch nicht in der Liste');
  sql(`UPDATE employees SET last_seen = CAST(strftime('%s','now') AS INTEGER) - 8*86400 WHERE id = ${mine2.id}`);
  let a8 = await attOf();
  ok(a8.length === 1 && a8[0].kind === 'inactive' && a8[0].level === 'yellow' && a8[0].days === 8 && a8[0].module === 8, '8 Tage inaktiv: gelb, Modul 8', a8);
  sql(`UPDATE employees SET last_seen = CAST(strftime('%s','now') AS INTEGER) - 11*86400 WHERE id = ${mine2.id}`);
  a8 = await attOf();
  ok(a8.length === 1 && a8[0].level === 'red' && a8[0].days === 11, '11 Tage inaktiv: rot', a8);
  const wrongOf = (q) => (QUIZ[9][q].correct + 1) % 4;
  const rightOf = (q) => QUIZ[9][q].correct;
  const failAnswers = JSON.stringify([wrongOf(0), wrongOf(1), rightOf(2), rightOf(3), rightOf(4)]);
  const ins = `INSERT INTO quiz_attempts (emp_id, module, score, passed, answers, at) VALUES (${mine2.id}, 9, 3, 0, '${failAnswers}', CAST(strftime('%s','now') AS INTEGER));`;
  sql(ins + ins);
  ok((await attOf()).every((a) => a.kind !== 'failed'), '2 Fehlversuche im selben Quiz: noch kein Eintrag');
  const ck1d = (await chef.get('/api/chef/cockpit')).data;
  ok(ck1d.hardest.every((h) => !(h.module === 9 && h.question === 0)), 'Frage mit nur 2 Antworten erscheint nicht in der Fehlerliste');
  sql(ins);
  const a3 = (await attOf()).find((a) => a.kind === 'failed');
  ok(a3 && a3.fails === 3 && a3.module === 9 && a3.level === 'red', '3 Fehlversuche im selben Quiz ohne Bestehen: rot', a3);
  const redFirst = (await chef.get('/api/chef/cockpit')).data.attention;
  ok(redFirst.length >= 1 && redFirst.every((a, i, arr) => i === 0 || !(arr[i - 1].level === 'yellow' && a.level === 'red')), 'Liste: rote Einträge vor gelben');
  sql(ins + ins);
  const ck2d = (await chef.get('/api/chef/cockpit')).data;
  const h0 = ck2d.hardest.find((h) => h.module === 9 && h.question === 0);
  ok(h0 && h0.answers === 5 && h0.wrongRate === 100 && h0.title.length > 3 && h0.title.length <= 70, 'Top-Fragen: ab 5 Antworten mit Fehlerquote 100 % und kurzem DE-Titel', h0);
  ok(ck2d.hardest.length <= 3 && ck2d.hardest.every((h, i, arr) => i === 0 || arr[i - 1].wrongRate >= h.wrongRate) && !ck2d.hardest.some((h) => h.module === 9 && h.question === 2), 'Top-3 sortiert; richtig beantwortete Frage fehlt', ck2d.hardest);
  ok(ck2d.firstTryRate !== null && ck2d.firstTryRate >= 0, 'Quote bleibt gültig');
  // gesperrte Konten tauchen nicht auf
  await chef.post(`/api/chef/employee/${mine2.id}/active`, { active: false });
  ok((await attOf()).length === 0, 'Gesperrtes Konto steht nicht in "Braucht Aufmerksamkeit"');
  await chef.post(`/api/chef/employee/${mine2.id}/active`, { active: true });
  // Zertifikate älter als 7 Tage verschwinden aus "diese Woche"
  sql(`UPDATE certificates SET issued_at = CAST(strftime('%s','now') AS INTEGER) - 8*86400 WHERE emp_id = ${mine2.id}`);
  ok(!(await chef.get('/api/chef/cockpit')).data.recentCerts.some((r) => r.empId === mine2.id), 'Zertifikat vor 8 Tagen: nicht mehr in "diese Woche"');
  // Aufräumen
  sql(`DELETE FROM quiz_attempts WHERE emp_id = ${mine2.id} AND module = 9`);
  sql(`UPDATE employees SET last_seen = CAST(strftime('%s','now') AS INTEGER) WHERE id = ${mine2.id}`);
  ok((await attOf()).length === 0, 'Nach dem Aufräumen steht die Person nicht mehr in der Liste');

  // =====================================================================
  section('Mehrere Hauptadmins: Rollen wechseln, letzter Hauptadmin geschützt');
  const mkAdmin = async (label) => {
    const username = label + rnd(4);
    const password = 'Passwort-' + rnd(6) + '-1';
    const add = await chef.post('/api/chef/admins', { name: 'Test ' + label, username, password });
    const c = new Client();
    const lg = await c.post('/api/chef/login', { username, password });
    return { id: add.data.id, username, password, c, ok: add.status === 200 && lg.status === 200 };
  };
  const roleOf = async (id) => (await chef.get('/api/chef/settings')).data.admins.find((a) => a.id === id)?.role;
  const A = await mkAdmin('anna'), B = await mkAdmin('berat');
  ok(A.ok && B.ok, 'Zwei Test-Admins angelegt und angemeldet');
  ok((await roleOf(A.id)) === 'admin' && (await chef.get('/api/chef/settings')).data.admins.every((a) => ['owner', 'admin'].includes(a.role)), 'Admin-Liste zeigt Rollen (owner/admin)');

  // Admin (nicht Hauptadmin) darf weder Rollen ändern noch Mitarbeiter/Admins löschen
  ok((await A.c.post(`/api/chef/admins/${B.id}/role`, { role: 'owner' })).status === 403, 'Admin darf keine Rolle vergeben -> 403');
  ok((await A.c.post(`/api/chef/admins/${A.id}/role`, { role: 'owner' })).status === 403, 'Admin kann sich nicht selbst befördern -> 403');
  ok((await A.c.post(`/api/chef/admins/${B.id}/delete`)).status === 403, 'Admin darf keinen Zugang löschen -> 403');
  ok((await new Client().post(`/api/chef/admins/${A.id}/role`, { role: 'owner' })).status === 401, 'Rollenwechsel ohne Login -> 401');
  ok((await chef.post(`/api/chef/admins/${A.id}/role`, { role: 'owner' }, { origin: 'https://evil.example' })).status === 403, 'Rollenwechsel mit fremdem Origin -> 403');
  ok((await chef.post(`/api/chef/admins/${A.id}/role`, { role: 'superuser' })).status === 400, 'Ungültige Rolle -> 400');
  ok((await chef.post(`/api/chef/admins/999999/role`, { role: 'owner' })).status === 404, 'Unbekannter Admin -> 404');

  // Opfer-Mitarbeiter mit allem, was es zu löschen gibt: Fortschritt, Quiz-Versuche, Quiz-Lauf, Sitzung, Zertifikat Teil 1
  const vFirst = 'Lösch', vLast = 'Test' + cap(rnd());
  const victim = new Client();
  const vReg = await victim.post('/api/register', { code: CUR, first: vFirst, last: vLast, lang: 'de', pin: '5839' });
  ok(vReg.status === 200, 'Testmitarbeiter zum Löschen angelegt', vReg.data);
  for (let n = 0; n <= 7; n++) { await watch(victim, n); if (n > 0) await solveQuiz(victim, n, 0); }
  await victim.get('/api/quiz/1'); // offener Quiz-Lauf
  const vMe = (await victim.get('/api/me')).data;
  const vCert = vMe.parts[0].certificate && vMe.parts[0].certificate.code;
  ok(/^MB-T1-/.test(vCert || ''), 'Testmitarbeiter hat Zertifikat Teil 1', vMe.parts[0]);
  ok((await new Client().get('/api/verify?code=' + vCert)).data.valid === true, 'Zertifikat ist vorher gültig (Prüfseite)');
  const vId = vMe.id;
  const cnt = () => sqlRows(`SELECT (SELECT COUNT(*) FROM progress WHERE emp_id=${vId}) AS p, (SELECT COUNT(*) FROM quiz_attempts WHERE emp_id=${vId}) AS a, (SELECT COUNT(*) FROM quiz_runs WHERE emp_id=${vId}) AS r, (SELECT COUNT(*) FROM sessions WHERE kind='emp' AND subject_id=${vId}) AS s, (SELECT COUNT(*) FROM certificates WHERE emp_id=${vId}) AS c, (SELECT COUNT(*) FROM employees WHERE id=${vId}) AS e`)[0];
  const cBefore = cnt();
  ok(cBefore.p >= 8 && cBefore.a >= 7 && cBefore.r >= 1 && cBefore.s >= 1 && cBefore.c >= 1 && cBefore.e === 1, 'Vor dem Löschen sind alle Datensätze da', cBefore);

  ok((await A.c.post(`/api/chef/employee/${vId}/delete`)).status === 403, 'Admin darf keinen Mitarbeiter löschen -> 403');
  ok((await new Client().post(`/api/chef/employee/${vId}/delete`)).status === 401, 'Mitarbeiter löschen ohne Login -> 401');
  ok((await chef.post(`/api/chef/employee/${vId}/delete`, {}, { origin: 'https://evil.example' })).status === 403, 'Mitarbeiter löschen mit fremdem Origin -> 403');
  ok((await chef.get(`/api/chef/employee/${vId}/delete`)).status === 405, 'Mitarbeiter löschen per GET -> 405');
  ok(cnt().e === 1 && (await victim.get('/api/me')).status === 200, 'Abgelehnte Löschversuche ändern nichts');

  // Hauptadmin-Rechte vergeben: A wird Hauptadmin und darf dann löschen
  ok((await chef.post(`/api/chef/admins/${A.id}/role`, { role: 'owner' })).status === 200 && (await roleOf(A.id)) === 'owner', 'Owner macht Admin zum Hauptadmin');
  ok((await chef.post(`/api/chef/admins/${A.id}/role`, { role: 'owner' })).status === 200, 'Gleiche Rolle nochmal setzen ist harmlos (200)');
  const Aperm = await A.c.post('/api/chef/admins', { name: 'X Y', username: 'dritter' + rnd(4), password: 'Drittes-Passwort-1' });
  ok(Aperm.status === 200, 'Neuer Hauptadmin darf Zugänge anlegen (Rolle gilt sofort, ohne neues Login)', Aperm.data);
  if (Aperm.data.id) await A.c.post(`/api/chef/admins/${Aperm.data.id}/delete`);

  const del = await A.c.post(`/api/chef/employee/${vId}/delete`);
  ok(del.status === 200 && del.data.ok === true, 'Hauptadmin löscht Mitarbeiter');
  const cAfter = cnt();
  ok(cAfter.p === 0 && cAfter.a === 0 && cAfter.r === 0 && cAfter.s === 0 && cAfter.c === 0 && cAfter.e === 0, 'Danach: progress, quiz_attempts, quiz_runs, sessions, certificates, Konto weg', cAfter);
  ok((await victim.get('/api/me')).status === 401, 'Alte Sitzung des Mitarbeiters ist ungültig (401)');
  ok((await new Client().post('/api/login', { name: `${vFirst} ${vLast}`, pin: '5839' })).status === 401, 'Anmeldung des gelöschten Mitarbeiters scheitert (401)');
  ok((await new Client().get('/api/verify?code=' + vCert)).data.valid === false, 'Prüfseite: Zertifikat nach dem Löschen "nicht gefunden"');
  ok((await chef.get(`/api/chef/employee/${vId}`)).status === 404, 'Detail des gelöschten Mitarbeiters -> 404');
  ok(!(await chef.get('/api/chef/team')).data.employees.some((e) => e.id === vId), 'Teamliste enthält ihn nicht mehr');
  ok((await chef.post(`/api/chef/employee/${vId}/delete`)).status === 404, 'Nochmal löschen -> 404');
  const reReg = new Client();
  ok((await reReg.post('/api/register', { code: CUR, first: vFirst, last: vLast, lang: 'de', pin: '5839' })).status === 200 && (await reReg.get('/api/me')).data.totals.done === 0, 'Name ist wieder frei; neues Konto startet bei 0');

  // Hauptadmin stuft Hauptadmin zurück; letzter Hauptadmin geschützt
  ok((await A.c.post(`/api/chef/admins/${A.id}/role`, { role: 'admin' })).status === 200 && (await roleOf(A.id)) === 'admin', 'Hauptadmin darf sich zurückstufen, solange es einen weiteren gibt');
  ok((await A.c.post(`/api/chef/employee/${vId}/delete`)).status === 403, 'Zurückgestufter Admin darf nicht mehr löschen -> 403 (Rolle wirkt sofort)');
  ok((await chef.post(`/api/chef/admins/${A.id}/role`, { role: 'owner' })).status === 200, 'Wieder befördert');
  const ownerNow = (await chef.get('/api/chef/status')).data.me;
  ok((await A.c.post(`/api/chef/admins/${ownerNow.id}/role`, { role: 'admin' })).status === 200 && (await roleOf(ownerNow.id)) === 'admin', 'Hauptadmin A stuft Hauptadmin Chef zurück (2 Hauptadmins)');
  ok((await chef.post(`/api/chef/admins/${A.id}/role`, { role: 'admin' })).status === 403, 'Chef ist jetzt Admin und darf nichts mehr ändern -> 403');
  const last1 = await A.c.post(`/api/chef/admins/${A.id}/role`, { role: 'admin' });
  ok(last1.status === 400 && /letzte Hauptadmin/.test(last1.data.error) && (await roleOf(A.id)) === 'owner', 'Letzter Hauptadmin kann nicht zurückgestuft werden (400)', last1.data);
  ok((await A.c.post(`/api/chef/admins/${A.id}/delete`)).status === 400 && (await roleOf(A.id)) === 'owner', 'Letzter Hauptadmin kann sich nicht selbst löschen (400)');
  ok((await A.c.post(`/api/chef/admins/${ownerNow.id}/role`, { role: 'owner' })).status === 200 && (await roleOf(ownerNow.id)) === 'owner', 'Chef wieder Hauptadmin');

  // Löschen von Hauptadmins durch andere Hauptadmins; nie der letzte, nie man selbst
  ok((await chef.post(`/api/chef/admins/${B.id}/role`, { role: 'owner' })).status === 200, 'B wird Hauptadmin (jetzt 3 Hauptadmins)');
  ok((await B.c.post(`/api/chef/admins/${B.id}/delete`)).status === 400, 'Hauptadmin kann sich nicht selbst löschen (400)');
  ok((await chef.post(`/api/chef/admins/${B.id}/delete`)).status === 200 && (await roleOf(B.id)) === undefined, 'Hauptadmin löscht anderen Hauptadmin');
  ok((await B.c.get('/api/chef/team')).status === 401, 'Gelöschter Hauptadmin: Sitzung ungültig');
  ok((await chef.post(`/api/chef/admins/${A.id}/delete`)).status === 200, 'Hauptadmin löscht weiteren Hauptadmin (A)');
  const ownersLeft = (await chef.get('/api/chef/settings')).data.admins.filter((a) => a.role === 'owner');
  ok(ownersLeft.length >= 1 && ownersLeft.some((a) => a.id === ownerNow.id), 'Mindestens ein Hauptadmin bleibt (der ursprüngliche)', ownersLeft);
  ok((await chef.post(`/api/chef/admins/${ownerNow.id}/role`, { role: 'admin' })).status === (ownersLeft.length > 1 ? 200 : 400), 'Letzter Hauptadmin: Rückstufen abgelehnt');
  ok((await roleOf(ownerNow.id)) === 'owner', 'Chef bleibt Hauptadmin');

  // =====================================================================
  section('Abmelden');
  const outEmp = await emp.post('/api/logout');
  ok(outEmp.status === 200 && outEmp.setCookies.some((c) => /^mb_s=;/.test(c) && /Max-Age=0/.test(c)), 'Mitarbeiter-Logout löscht Cookie');
  const reuse = new Client(); reuse.jar = { ...relogin.jar };
  ok((await reuse.get('/api/me')).status === 401, 'Session nach Logout in der DB gelöscht (altes Cookie ungültig)');
  ok((await emp.get('/api/me')).status === 401, '/api/me nach Logout -> 401');
  const outChef = await chef.post('/api/chef/logout');
  ok(outChef.status === 200, 'Chef-Logout');
  ok((await chef.get('/api/chef/team')).status === 401, 'Chef nach Logout -> 401');
  ok((await chef.get('/api/chef/status')).data.loggedIn === false, 'Status: nicht mehr eingeloggt');

  // =====================================================================
  process.exit(summary());
}

// Gegenprobe der Trivial-PIN-Regeln (unabhängig vom Server): gleiche Ziffern, Folgen
function isTrivialPinTest(p) {
  return /^(\d)\1{3}$/.test(p) || ['0123', '1234', '2345', '3456', '4567', '5678', '6789', '3210', '4321', '5432', '6543', '7654', '8765', '9876'].includes(p);
}

main().catch((e) => { console.error('Testabbruch:', e); process.exit(2); });
