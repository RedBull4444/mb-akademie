// E2E der Mitarbeiter-App im Browser (Playwright, 390x844) gegen wrangler pages dev.
// Start:  rm -rf /tmp/e2e-state && npx wrangler d1 execute akademie-db --local --persist-to /tmp/e2e-state --file=schema.sql
//         npx wrangler pages dev public --port 8793 --persist-to /tmp/e2e-state
// Lauf:   node tests/e2e-app.cjs
// DEV_SHORT=1 muss gesetzt sein (alle Videos 8 s). Alles über die UI; API nur für Chef-Einrichtung/Firmencode.
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { chromium } = require('/tmp/claude-0/-home-claude/11c135d6-a206-58fa-85d9-899349f4e70c/scratchpad/render/node_modules/playwright');

const BASE = process.env.BASE_URL || 'http://localhost:8793';
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const FIRST = 'Kerim', LAST = 'Bytyqi', PIN = '7391', BADPIN = '1357';

let okN = 0, failN = 0; const fails = [];
const check = (c, name, d) => { if (c) { okN++; console.log('  ok   ' + name); } else { failN++; fails.push(name); console.log('  FAIL ' + name + (d !== undefined ? '  -> ' + JSON.stringify(d) : '')); } };
const step = (t) => console.log('\n# ' + t);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const consoleLog = [];
let shotN = 0;

(async () => {
  const { QUIZ } = await import(pathToFileURL(path.join(__dirname, '..', 'functions', '_lib', 'quiz.js')).href);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--autoplay-policy=no-user-gesture-required'] });

  // ---------- Chef (Desktop-Kontext, eigener Browserkontext) ----------
  const chefCtx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  const cp = await chefCtx.newPage();
  cp.on('pageerror', (e) => consoleLog.push('chef pageerror: ' + e.message));
  cp.on('console', (m) => { if (['error', 'warning'].includes(m.type())) consoleLog.push('chef console.' + m.type() + ': ' + m.text()); });

  step('1 Chef-Ersteinrichtung');
  await cp.goto(BASE + '/chef/');
  await cp.waitForSelector('form');
  await cp.fill('[name=setupToken]', 'test-setup-123');
  await cp.fill('[name=name]', 'Miran Shala');
  await cp.fill('[name=username]', 'miran');
  await cp.fill('[name=password]', 'SehrSicher12345');
  await cp.click('button[type=submit]');
  await cp.waitForSelector('.codebox');
  const code = (await cp.textContent('.codebox')).trim();
  check(/^MB-[A-Z0-9]{4}$/.test(code), 'Firmencode aus Einstellungen: ' + code);

  // ---------- Mitarbeiter ----------
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'de-DE', acceptDownloads: true });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => consoleLog.push('app pageerror: ' + e.message));
  // Die bewusst falsche PIN (Schritt 8) erzeugt ein 401 auf /api/login, das Chromium immer in die Konsole schreibt – erwartet.
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/\/api\/login$/.test(m.location().url || '')) consoleLog.push('app console.' + m.type() + ': ' + m.text()); });
  // ERR_ABORTED bei /api/progress: Heartbeat mit keepalive beim Neuladen (Seite verwirft die Antwort) – unkritisch.
  p.on('requestfailed', (r) => { const e = (r.failure() || {}).errorText; if (!(/ERR_ABORTED/.test(e) && /\/api\/progress/.test(r.url()))) consoleLog.push('app requestfailed: ' + r.url() + ' ' + e); });
  p.on('response', (r) => { if (r.status() >= 400) console.log('  [http ' + r.status() + '] ' + r.request().method() + ' ' + r.url().replace(BASE, '')); });
  const shot = async (name) => { shotN++; await p.screenshot({ path: path.join(OUT, `e2e-app-${String(shotN).padStart(2, '0')}-${name}.png`) }); };
  const txt = async (sel) => ((await p.textContent(sel).catch(() => '')) || '').trim();
  const pad = async (pin) => { for (const d of pin) await p.click(`.pad .key[data-d="${d}"]`); };
  const hash = () => p.evaluate(() => location.hash);
  const lang = () => p.evaluate(() => document.documentElement.lang);

  step('2 Registrieren');
  await p.goto(BASE + '/');
  await p.waitForSelector('#l1-code');
  check((await hash()) === '#/willkommen', 'Willkommen-Screen');
  await p.click('[data-lang="de"]');
  await p.fill('#l1-code', code);
  await shot('willkommen');
  await p.click('#l1-next');
  await p.waitForSelector('#l2-first');
  await p.fill('#l2-first', FIRST);
  await p.fill('#l2-last', LAST);
  await pad(PIN);
  await p.waitForFunction(() => /wiederhol|nochmal|bestät/i.test(document.querySelector('#l2-pin').textContent));
  await shot('pin-wiederholen');
  await pad(PIN);
  await sleep(200);
  await shot('pin-bestaetigt');
  await p.click('#l2-submit');
  await p.waitForFunction(() => location.hash === '#/start');
  await p.waitForSelector('.resume');
  check((await txt('h1')).includes(FIRST), 'Start: Hallo ' + FIRST, await txt('h1'));
  check((await txt('.resume')).includes('Einführung') || (await txt('.resume .k')).length > 0, 'Weiter-Karte Modul 00', await txt('.resume'));
  await shot('start');

  // ---------- Hilfsfunktionen Video/Quiz ----------
  async function openModule(n) {
    await p.evaluate((n) => { location.hash = '#/video/' + n; }, n);
    await p.waitForSelector('#vid', { state: 'attached' });
    await p.waitForFunction(() => document.getElementById('vid').readyState >= 1, null, { timeout: 15000 });
  }
  async function playToEnd(n, { timeout = 30000 } = {}) {
    await p.click('#pov [data-a="play"]');
    await p.waitForFunction(() => document.getElementById('pl').dataset.ov === 'done', null, { timeout });
  }
  async function doQuiz(n, mode) { // mode: 'pass' | 'fail'
    const L = (await lang()) === 'sq' ? 'sq' : 'de';
    const items = QUIZ[n];
    let right = 0;
    for (let i = 0; i < 5; i++) {
      await p.waitForSelector('.opt');
      const qText = (await txt('h1.h-q'));
      const item = items.find((x) => x.q[L] === qText);
      if (!item) { check(false, `Frage gefunden M${n} Q${i + 1}`, qText); return null; }
      const wantRight = mode === 'pass' || i >= 2;
      const opts = await p.$$eval('.opt', (bs) => bs.map((b) => ({ id: Number(b.dataset.id), text: b.querySelector('.x').textContent })));
      const correctText = item.a[item.correct][L];
      const pick = wantRight ? opts.find((o) => o.text === correctText) : opts.find((o) => o.text !== correctText);
      await p.click(`.opt[data-id="${pick.id}"]`);
      await p.waitForSelector('.opt.right');
      const gotRight = await p.$$eval('.opt.bad', (e) => e.length) === 0;
      if (gotRight) right++;
      check(gotRight === wantRight, `M${n} Q${i + 1} Feedback ${wantRight ? 'richtig' : 'falsch'}`);
      if (i === 0 && n === 1 && mode === 'fail') await shot('quiz-feedback-falsch');
      await p.click('#qnext');
    }
    return right;
  }

  step('3 Modul 00 abspielen');
  await openModule(0);
  await shot('modul0-vor-play');
  check((await p.$eval('#qbtn', (b) => b.disabled)) === true, 'Weiter-Button vor Ende gesperrt');
  await playToEnd(0);
  await shot('modul0-geschafft');
  check((await txt('#pov')).includes('Video geschafft'), 'Overlay "Video geschafft"');
  check((await p.$eval('#qbtn', (b) => b.disabled)) === false, 'Weiter-Button aktiv');
  check((await txt('#qbtn')).length > 0 && !/quiz/i.test(await txt('#qbtn')), 'Modul 0 hat kein Quiz', await txt('#qbtn'));
  await p.click('#qbtn');
  await p.waitForFunction(() => location.hash === '#/video/1');
  await p.waitForSelector('#vid', { state: 'attached' });
  check((await hash()) === '#/video/1', 'Weiter öffnet Modul 01 (frei)');

  step('4 Modul 01: Vorspulen, Hintergrund, Ende');
  await p.waitForFunction(() => document.getElementById('vid').readyState >= 1, null, { timeout: 15000 });
  await p.click('#pov [data-a="play"]');
  await sleep(2500);
  // Klick weit rechts auf die Leiste
  const bx = await p.locator('#pseek').boundingBox();
  await p.mouse.click(bx.x + bx.width * 0.95, bx.y + bx.height / 2);
  await sleep(400);
  await shot('vorspulen-gesperrt');
  const ct = await p.$eval('#vid', (v) => v.currentTime);
  check(ct < 5, 'Rücksprung nach Vorspul-Versuch (currentTime ' + ct.toFixed(2) + ')');
  check(await p.$eval('#ptoast', (e) => !e.hidden), 'Toast "Vorspulen gesperrt" sichtbar', await txt('#ptoast'));
  // Tab versteckt
  await p.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await sleep(500);
  check(await p.$eval('#vid', (v) => v.paused), 'Video pausiert bei Tab-Wechsel');
  check((await txt('#pov')).toLowerCase().includes('hintergrund'), 'Pause-Overlay', await txt('#pov'));
  check(await p.$eval('#ptoast', (e) => e.hidden), 'Vorspul-Toast überlappt das Pause-Overlay nicht');
  await shot('hintergrund-pause');
  await p.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await p.click('#pov [data-a="play"]');
  await p.waitForFunction(() => document.getElementById('pl').dataset.ov === 'done', null, { timeout: 30000 });
  await shot('modul1-geschafft');
  check((await txt('#qbtn')).length > 0 && await p.$eval('#qbtn', (b) => !b.disabled), '"Zum Quiz" aktiv', await txt('#qbtn'));

  step('5 Quiz Modul 01: durchfallen, wiederholen, bestehen');
  await p.click('#qbtn');
  await p.waitForSelector('.opt');
  await shot('quiz-frage1');
  const r1 = await doQuiz(1, 'fail');
  await p.waitForSelector('.result');
  await shot('quiz-ergebnis-durchgefallen');
  check(r1 === 3, 'Absichtlich 3 von 5 richtig', r1);
  check((await txt('.result h1')) === 'Nicht bestanden', 'Ergebnis "Nicht bestanden"', await txt('.result h1'));
  check(await p.$('#rretry') !== null, '"Quiz wiederholen" vorhanden');
  await p.click('#rwrong').catch(() => {});
  await shot('quiz-falsche-antworten');
  await p.click('#rretry');
  await p.waitForSelector('.opt');
  const r2 = await doQuiz(1, 'pass');
  await p.waitForSelector('.result');
  await shot('quiz-ergebnis-bestanden');
  check(r2 === 5, 'Zweiter Lauf 5 von 5', r2);
  check((await txt('.result h1')) === 'Bestanden', 'Ergebnis "Bestanden"', await txt('.result h1'));
  check((await txt('.result')).includes('Modul 02 ist jetzt frei'), '"Modul 02 ist jetzt frei"', await txt('.result'));
  await p.click('#rmain');
  await p.waitForFunction(() => location.hash === '#/video/2');
  await p.waitForSelector('#vid', { state: 'attached' });
  check((await txt('.h-mod')).length > 0, 'Modul 02 geöffnet', await txt('.h-mod'));

  step('6 Reload mitten in Modul 02');
  await p.waitForFunction(() => document.getElementById('vid').readyState >= 1, null, { timeout: 15000 });
  await p.click('#pov [data-a="play"]');
  await sleep(6500);
  const before = await p.$eval('#vid', (v) => v.currentTime);
  await p.reload();
  await p.waitForSelector('#vid', { state: 'attached' });
  await p.waitForFunction(() => document.getElementById('vid').readyState >= 1, null, { timeout: 15000 });
  await sleep(800);
  const after = await p.$eval('#vid', (v) => v.currentTime);
  check(after >= 3 && after <= before + 1, `Position fortgesetzt (vorher ${before.toFixed(1)}, nachher ${after.toFixed(1)})`);
  check((await txt('.tt')).length > 0 && (await hash()) === '#/video/2', 'Noch auf Modul 02');
  await shot('reload-modul2');
  // Vorspulen weiter gesperrt (erst abspielen: im Wartezustand startet ein Tipp aufs Video die Wiedergabe)
  await p.click('#pov [data-a="play"]');
  await sleep(600);
  const bx2 = await p.locator('#pseek').boundingBox();
  await p.mouse.click(bx2.x + bx2.width * 0.95, bx2.y + bx2.height / 2);
  await sleep(400);
  const ct2 = await p.$eval('#vid', (v) => v.currentTime);
  check(ct2 <= after + 1.5, 'Vorspulen nach Reload gesperrt (' + ct2.toFixed(2) + ')');
  check(await p.$eval('#ptoast', (e) => !e.hidden), 'Toast nach Reload');
  await shot('reload-vorspulen');

  step('7 Sprache SQ');
  await p.evaluate(() => { location.hash = '#/start'; });
  await p.waitForSelector('.resume');
  await p.click('.langsw [data-lang="sq"]');
  await p.waitForFunction(() => document.documentElement.lang === 'sq');
  await sleep(400);
  const hello = await txt('h1');
  check(/Përshëndetje/.test(hello), 'Start albanisch', hello);
  await shot('start-sq');
  await p.click('.resume');
  await p.waitForSelector('#vid', { state: 'attached' });
  const vsrc = await p.$eval('#vid', (v) => v.getAttribute('src'));
  check(/M02_SQ\.mp4$/.test(vsrc), 'Video-URL _SQ', vsrc);
  await p.waitForFunction(() => document.getElementById('vid').readyState >= 1, null, { timeout: 15000 });
  await shot('video-sq');
  check(/Te kuizi|Vazhdo/i.test(await txt('#qbtn')), 'Video-Screen albanisch', await txt('#qbtn'));

  step('8 Abmelden und Anmelden');
  await p.evaluate(() => { location.hash = '#/module'; });
  await p.waitForSelector('[data-logout]');
  await shot('module-sq');
  await p.click('[data-logout]');
  await p.waitForFunction(() => location.hash === '#/anmelden');
  await p.waitForSelector('#l3-name');
  await shot('anmelden');
  await p.fill('#l3-name', `${FIRST} ${LAST}`);
  await pad(BADPIN);
  await p.click('#l3-submit');
  await p.waitForFunction(() => /\d/.test(document.querySelector('#l3-err').textContent) || /Hasur|gabuar|falsch/i.test(document.querySelector('#l3-err').textContent));
  const errTxt = await txt('#l3-err');
  check(/(Noch 4 Versuche|Edhe 4 përpjekje)/.test(errTxt), 'Falsche PIN -> Restversuche', errTxt);
  await shot('anmelden-falsch');
  await pad(PIN); // erste Eingabe löscht Fehlerzustand
  await p.click('#l3-submit');
  await p.waitForFunction(() => location.hash === '#/start');
  await p.waitForSelector('.resume');
  check(/Përshëndetje|Hallo/.test(await txt('h1')) && (await lang()) === 'sq', 'Login klappt, Sprache SQ gemerkt', await txt('h1'));
  await shot('nach-login');

  step('9 Teil 1 komplett bis Zertifikat');
  for (let n = 2; n <= 7; n++) {
    await openModule(n);
    if (!(await p.$eval('#pl', (e) => e.dataset.ov === 'done'))) await playToEnd(n);
    await p.click('#qbtn');
    await p.waitForSelector('.opt');
    const r = await doQuiz(n, 'pass');
    await p.waitForSelector('.result');
    check(r === 5 && (await txt('.result h1')) === 'Kaluar', `Modul ${n} bestanden`, await txt('.result h1'));
    if (n === 7) await shot('teil1-ergebnis');
  }
  const resTxt = await txt('.result');
  check(/Teil 1|Pjesa 1|certifikat/i.test(resTxt) || (await p.$('a.unl[href="#/zertifikate"]')) !== null, 'Zertifikat-Hinweis im Ergebnis', resTxt);
  await p.evaluate(() => { location.hash = '#/zertifikate'; });
  await p.waitForSelector('.certcard');
  await sleep(1200);
  await shot('zertifikate');
  const certCode = (await txt('.cprev .nr b'));
  check(/^MB-T1-[A-Z0-9]{4}$/.test(certCode), 'Zertifikat-Code Teil 1: ' + certCode);
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 30000 }), p.click('[data-dl="1"]')]);
  const pdfPath = path.join(OUT, 'e2e-app-zertifikat-t1.pdf');
  await dl.saveAs(pdfPath);
  const sz = fs.statSync(pdfPath).size;
  check(sz > 20000, `PDF-Download ${dl.suggestedFilename()} (${sz} Bytes)`);
  check(fs.readFileSync(pdfPath).slice(0, 5).toString() === '%PDF-', 'Datei ist ein PDF');
  await sleep(300);

  step('10 Chef-Bereich und Prüfseite');
  await cp.goto(BASE + '/chef/#/team');
  await cp.waitForSelector('table.team tbody tr[data-id]', { timeout: 15000 });
  await sleep(500);
  const row = await cp.textContent('table.team tbody tr[data-id]');
  console.log('  Team-Zeile:', row.replace(/\s+/g, ' ').trim());
  check(row.includes(`${FIRST} ${LAST}`), 'Mitarbeiter in der Teamliste');
  check(/8\s*\/\s*16|8 von 16/.test(row + (await cp.$eval('table.team tbody tr[data-id] .pg', (e) => e.getAttribute('aria-label')))), 'Fortschritt 8/16');
  await cp.screenshot({ path: path.join(OUT, `e2e-app-${String(++shotN).padStart(2, '0')}-chef-team.png`) });
  await cp.click('table.team tbody tr[data-id]');
  await sleep(800);
  const detail = await cp.textContent('body');
  check(/MB-T1-/.test(detail), 'Chef-Detail zeigt Zertifikat-Code');
  await cp.screenshot({ path: path.join(OUT, `e2e-app-${String(++shotN).padStart(2, '0')}-chef-detail.png`) });

  const vp = await ctx.newPage();
  vp.on('pageerror', (e) => consoleLog.push('pruefen pageerror: ' + e.message));
  vp.on('console', (m) => { if (['error', 'warning'].includes(m.type())) consoleLog.push('pruefen console.' + m.type() + ': ' + m.text()); });
  await vp.goto(BASE + '/pruefen/?code=' + certCode);
  await vp.waitForSelector('.result');
  const vtxt = (await vp.textContent('.result')).replace(/\s+/g, ' ');
  check(/Gültig/.test(vtxt) && vtxt.includes(`${FIRST} ${LAST}`), 'Prüfseite: Gültig', vtxt);
  await vp.screenshot({ path: path.join(OUT, `e2e-app-${String(++shotN).padStart(2, '0')}-pruefen.png`) });
  await vp.goto(BASE + '/pruefen/?code=MB-T1-ZZZZ');
  await vp.waitForSelector('.result');
  check(/Kein Zertifikat/.test(await vp.textContent('.result')), 'Prüfseite: falscher Code -> nicht gefunden');

  step('Konsole');
  consoleLog.forEach((l) => console.log('  ' + l));
  check(consoleLog.length === 0, 'Browser-Konsole sauber (' + consoleLog.length + ' Meldungen)');

  await browser.close();
  console.log(`\n${okN} ok, ${failN} fehlgeschlagen`);
  if (failN) { console.log(fails.join('\n')); process.exit(1); }
})().catch((e) => { console.error('ABBRUCH', e); consoleLog.forEach((l) => console.log('  ' + l)); process.exit(2); });
