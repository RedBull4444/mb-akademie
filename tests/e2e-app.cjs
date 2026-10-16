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
  cp.on('pageerror', (e) => consoleLog.push('chef pageerror: ' + e.message + ' @ ' + String(e.stack || '').split('\n').slice(1, 3).map((x) => x.trim()).join(' | ')));
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
  // Kein window.alert/confirm/prompt: jeder native Dialog ist ein Fehler.
  p.on('dialog', (d) => { consoleLog.push('app dialog (' + d.type() + '): ' + d.message()); d.dismiss().catch(() => {}); });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
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

  step('9 Teil 1 komplett bis Zertifikat (Abschluss-Moment)');
  for (let n = 2; n <= 7; n++) {
    await openModule(n);
    if (!(await p.$eval('#pl', (e) => e.dataset.ov === 'done'))) await playToEnd(n);
    await p.click('#qbtn');
    await p.waitForSelector('.opt');
    const r = await doQuiz(n, 'pass');
    if (n < 7) {
      await p.waitForSelector('.result');
      check(r === 5 && (await txt('.result h1')) === 'Kalove', `Modul ${n} bestanden`, await txt('.result h1'));
    } else {
      await p.waitForSelector('.cel');
      check(r === 5 && (await p.$('.result')) === null, 'Modul 7: statt Ergebnis-Screen erscheint der Abschluss-Moment', r);
    }
  }
  // Abschluss-Moment (SQ, da die App gerade albanisch läuft)
  await sleep(1400);
  await shot('abschluss-moment');
  check(/Pjesa 1 u krye/.test(await txt('.cel .eb')), 'Abschluss: "Pjesa 1 u krye"', await txt('.cel .eb'));
  check((await txt('.cel h1')) === 'Siguria & presioni', 'Abschluss: Abzeichen-Name Teil 1 (SQ)', await txt('.cel h1'));
  check(/Të 8 modulet u kryen/.test(await txt('.cel .ct')), 'Abschluss: Text mit Modulzahl', await txt('.cel .ct'));
  check((await p.$$('.cel svg.pop circle.ring')).length === 1 && /^MB-T1-[A-Z0-9]{4}$/.test(await txt('.cel .ccard .t6')), 'Abschluss: Abzeichen mit Ring und Karte mit Prüfcode', await txt('.cel .ccard .t6'));
  check((await txt('.cel .ccard .t3')) === `${FIRST} ${LAST}`, 'Abschluss: Name auf der Karte');
  check(/Shiko certifikatën/.test(await txt('#rmain')) && /Vazhdo me pjesën 2/.test(await txt('#rnext')) && (await p.getAttribute('#rnext', 'href')) === '#/video/8', 'Abschluss: Buttons "Zertifikat ansehen" / "Weiter mit Teil 2"', [await txt('#rmain'), await txt('#rnext')]);
  const anim = () => p.$eval('.cel svg.pop', (e) => getComputedStyle(e).animationName);
  check((await anim()) !== 'none', 'Animation läuft normalerweise');
  await p.emulateMedia({ reducedMotion: 'reduce' });
  check((await anim()) === 'none' && (await p.$eval('.cel .rise', (e) => getComputedStyle(e).animationName)) === 'none' && (await p.$eval('.cel .ring', (e) => getComputedStyle(e).animationName)) === 'none', 'prefers-reduced-motion: keine Animation, Abzeichen sofort vollständig');
  await p.emulateMedia({ reducedMotion: 'no-preference' });
  await p.click('#rmain');
  await p.waitForFunction(() => location.hash === '#/zertifikate');
  await p.waitForSelector('.certcard');
  await sleep(900);

  step('9a Abzeichen im Tab Zertifikate');
  await p.evaluate(() => { location.hash = '#/zertifikate'; });
  await p.waitForSelector('.certcard');
  await sleep(1200);
  await shot('zertifikate');
  const certCode = (await txt('.cprev .nr b'));
  check(/^MB-T1-[A-Z0-9]{4}$/.test(certCode), 'Zertifikat-Code Teil 1: ' + certCode);
  // Abzeichen (SQ)
  check((await p.$$('.badges .badge')).length === 4 && (await p.$$('.badges button.badge[data-badge]')).length === 1 && (await p.$$('.badges .badge.open')).length === 3, 'Abzeichen: 4 Embleme, nur Teil 1 erreicht, 3 offen');
  check(/1 nga 4 të arritura/.test(await txt('.scroll > p.meta')) && (await txt('h1')) === 'Distinktivet e tua', 'Abzeichen: Titel und Zähler (SQ)', await txt('.scroll > p.meta'));
  const bTxt = await p.$$eval('.badges .badge', (b) => b.map((x) => Array.from(x.querySelectorAll('.bt,.bs')).map((e) => e.textContent.trim()).join(' ')));
  check(/^Siguria & presioni Pjesa 1 · \d\d\.\d\d\.\d{4}$/.test(bTxt[0]) && /^Depozita & sistemi Pjesa 2 · edhe 4 module$/.test(bTxt[1]) && /^Profi i hidraulikës Pjesa 3 · edhe 4 module$/.test(bTxt[2]) && /^M&B Akademia të 3 pjesët$/.test(bTxt[3]), 'Abzeichen: Namen, Datum / "noch X Module" (SQ)', bTxt);
  check((await p.$$('.badge.open svg circle[stroke-dasharray]')).length === 3 && (await p.$$('.badges button.badge svg circle[stroke="#d6001c"]')).length === 1, 'Abzeichen: offene gestrichelt mit Schloss, erreichtes mit rotem Ring');
  await p.evaluate(() => { document.querySelector('.scroll').scrollTop = 0; });
  await sleep(150);
  await shot('abzeichen');

  // Zertifikat teilen: Bottom-Sheet
  check((await p.$('.sheet')) === null, 'Sheet zunächst zu');
  await p.click('[data-share="1"]');
  await p.waitForSelector('.sheet');
  await sleep(350);
  await shot('teilen-sheet');
  const shareUrl = BASE + '/pruefen/?code=' + certCode;
  const waHref = await p.getAttribute('#sh-wa', 'href');
  check(/^https:\/\/wa\.me\/\?text=/.test(waHref) && decodeURIComponent(waHref.split('?text=')[1]).includes(shareUrl), 'Teilen: WhatsApp-Link mit Text und Prüf-Link', decodeURIComponent(waHref));
  check((await p.getAttribute('#sh-wa', 'target')) === '_blank' && /noopener/.test(await p.getAttribute('#sh-wa', 'rel')), 'Teilen: WhatsApp öffnet in neuem Tab (noopener)');
  check((await p.$('#sh-native')) === null, 'Teilen: ohne navigator.share kein "Mehr Apps"');
  await p.click('#sh-copy');
  await p.waitForFunction(() => /kopjua/.test(document.getElementById('sh-copy').textContent));
  check((await p.evaluate(() => navigator.clipboard.readText())) === shareUrl, 'Teilen: Link kopieren legt den Prüf-Link in die Zwischenablage');
  check(/Lidhja u kopjua/.test(await txt('#sh-live')), 'Teilen: Bestätigung (live region)', await txt('#sh-live'));
  await p.keyboard.press('Escape');
  check((await p.$('.sheet')) === null, 'Teilen: Escape schließt das Sheet');
  check(await p.evaluate(() => document.activeElement && document.activeElement.hasAttribute('data-share')), 'Teilen: Fokus kehrt zum Knopf zurück');
  // native Teilen (falls vom Gerät unterstützt)
  await p.evaluate(() => { navigator.share = (d) => { window.__shared = d; return Promise.resolve(); }; });
  await p.click('[data-share="1"]');
  await p.waitForSelector('#sh-native');
  await p.click('#sh-native');
  await p.waitForSelector('.sheet', { state: 'detached' });
  const shared = await p.evaluate(() => window.__shared);
  check(shared && shared.url === shareUrl && /1/.test(shared.text || ''), 'Teilen: navigator.share bekommt Text und Prüf-Link', shared);
  await p.evaluate(() => { delete navigator.share; navigator.share = undefined; });
  // PDF aus dem Sheet
  await p.click('[data-share="1"]');
  await p.waitForSelector('#sh-pdf');
  const [dlS] = await Promise.all([p.waitForEvent('download', { timeout: 30000 }), p.click('#sh-pdf')]);
  check(/^Zertifikat-Teil1-.*\.pdf$/.test(dlS.suggestedFilename()), 'Teilen: PDF herunterladen aus dem Sheet', dlS.suggestedFilename());
  await p.waitForSelector('.sheet', { state: 'detached' });
  // Backdrop schließt ebenfalls
  await p.click('[data-share="1"]');
  await p.waitForSelector('.sheet');
  await p.mouse.click(195, 60);
  await p.waitForSelector('.sheet', { state: 'detached' });
  check(true, 'Teilen: Tippen neben das Sheet schließt es');

  // Abschluss-Moment nur einmal: Quiz 7 nochmal bestehen -> normaler Ergebnis-Screen
  await p.evaluate(() => { location.hash = '#/quiz/7'; });
  await p.waitForSelector('.opt');
  await doQuiz(7, 'pass');
  await p.waitForSelector('.result');
  check((await p.$('.cel')) === null && (await txt('.result h1')) === 'Kalove', 'Abschluss-Moment erscheint nur einmal (nochmal bestanden: normaler Ergebnis-Screen)', await txt('.result h1'));
  check(await p.evaluate(() => Object.keys(localStorage).some((k) => /^mb_cel_\d+_1$/.test(k))), 'Merker "Abschluss gezeigt" gespeichert');
  await p.evaluate(() => { location.hash = '#/zertifikate'; });
  await p.waitForSelector('.certcard');
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 30000 }), p.click('[data-dl="1"]')]);
  const pdfPath = path.join(OUT, 'e2e-app-zertifikat-t1.pdf');
  await dl.saveAs(pdfPath);
  const sz = fs.statSync(pdfPath).size;
  check(sz > 20000, `PDF-Download ${dl.suggestedFilename()} (${sz} Bytes)`);
  check(fs.readFileSync(pdfPath).slice(0, 5).toString() === '%PDF-', 'Datei ist ein PDF');
  await sleep(300);

  step('9b Nachschlagen');
  let progressCalls = 0;
  p.on('request', (r) => { if (/\/api\/progress/.test(r.url())) progressCalls++; });
  await p.route('**/assets/chapters.json', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ 6: [{ t: 5, de: 'Woher kommt der Schmutz?', sq: 'Nga vjen papastërtia?' }, { t: 2, de: 'Wie funktioniert der Magnet?', sq: 'Si funksionon magneti?' }] }) }));
  await p.evaluate(() => { location.hash = '#/nachschlagen'; });
  await p.waitForSelector('.refitem');
  check((await p.$$('.tabbar .tab')).length === 4 && /Rishiko/.test(await txt('.tabbar .tab:nth-child(3)')), 'Tab-Leiste mit 4. Eintrag "Rishiko" (SQ)', await txt('.tabbar'));
  check((await p.$$('.refitem')).length === 8, 'Liste zeigt die 8 geschafften Module', (await p.$$('.refitem')).length);
  check((await p.$$('.refitem ul li')).length >= 8, 'Kernpunkte werden mit angezeigt');
  await shot('nachschlagen-sq');
  await p.fill('#refq', 'NDARESI');
  check((await p.$$('.refitem')).length >= 2 && (await p.$$eval('.refitem .n', (e) => e.map((x) => x.textContent))).filter((x) => x === '06' || x === '07').length === 2, 'Suche "NDARESI" findet Module 06 und 07 ("Ndarësi …"; Groß/klein, ë tolerant)', await p.$$eval('.refitem .n', (e) => e.map((x) => x.textContent)));
  await p.fill('#refq', 'xyzxyz');
  check((await p.$$('.refitem')).length === 0 && /Nuk u gjet/.test(await txt('.refnone')), 'Suche ohne Treffer -> Hinweis', await txt('.reflist'));
  await p.fill('#refq', 'llum');
  await p.click('.refitem');
  await p.waitForFunction(() => location.hash === '#/nachschlagen/6');
  await p.waitForSelector('#rvid');
  check(await p.$eval('#rvid', (v) => v.hasAttribute('controls') && /M06_SQ\.mp4$/.test(v.getAttribute('src'))), 'Freier Player (controls) mit M06_SQ');
  await p.waitForFunction(() => document.getElementById('rvid').readyState >= 1, null, { timeout: 15000 });
  const chapTxt = await p.$$eval('.chap', (b) => b.map((x) => x.textContent.replace(/\s+/g, ' ').trim()));
  check(chapTxt.length === 2 && /0:02\s*Si funksionon magneti/.test(chapTxt[0]) && /0:05\s*Nga vjen papastërtia/.test(chapTxt[1]), 'Kapitel (SQ) nach Zeit sortiert', chapTxt);
  await shot('nachschlagen-video');
  await p.evaluate(() => { document.getElementById('rvid').currentTime = 6; });
  await sleep(500);
  check(Math.abs(await p.$eval('#rvid', (v) => v.currentTime) - 6) < 0.5, 'Vorspulen im freien Modus erlaubt (kein Zurücksetzen)', await p.$eval('#rvid', (v) => v.currentTime));
  await p.click('.chap:nth-child(2)');
  await sleep(500);
  check(Math.abs(await p.$eval('#rvid', (v) => v.currentTime) - 5) < 1, 'Tippen auf Kapitel springt zur Zeit', await p.$eval('#rvid', (v) => v.currentTime));
  await p.click('.vtop .iconbtn');
  await p.waitForFunction(() => location.hash === '#/nachschlagen');
  check(progressCalls === 0, 'Kein Fortschritts-Tracking im Nachschlage-Modus (0 Aufrufe /api/progress)', progressCalls);
  await p.unroute('**/assets/chapters.json');
  // Deutsch: Umlaute/ß tolerant
  await p.evaluate(() => { location.hash = '#/start'; });
  await p.waitForSelector('.langsw');
  await p.click('.langsw [data-lang="de"]');
  await p.waitForFunction(() => document.documentElement.lang === 'de');
  await sleep(500);
  await p.evaluate(() => { location.hash = '#/nachschlagen'; });
  await p.waitForSelector('#refq');
  check(await p.$eval('#refq', (i) => i.value) === 'llum', 'Suchbegriff bleibt beim Zurückkommen erhalten');
  await p.fill('#refq', '');
  await p.waitForSelector('.refitem');
  check(/Nachschlagen/.test(await txt('.tabbar .tab:nth-child(3)')), 'Tab "Nachschlagen" (DE)');
  await p.evaluate(() => { location.hash = '#/zertifikate'; });
  await p.waitForSelector('.badges');
  check((await txt('h1')) === 'Deine Abzeichen' && /1 von 4 erreicht/.test(await txt('.scroll > p.meta')), 'Abzeichen (DE): Titel und "1 von 4 erreicht"', await txt('.scroll > p.meta'));
  const bDe = await p.$$eval('.badges .badge', (b) => b.map((x) => Array.from(x.querySelectorAll('.bt,.bs')).map((e) => e.textContent.trim()).join(' ')));
  check(/^Sicherheit & Druck Teil 1 · \d\d\.\d\d\.\d{4}$/.test(bDe[0]) && bDe[1] === 'Speicher & Anlage Teil 2 · noch 4 Module' && bDe[2] === 'Hydraulik-Profi Teil 3 · noch 4 Module' && bDe[3] === 'M&B Akademie alle 3 Teile', 'Abzeichen (DE): Namen und Zustände', bDe);
  await p.click('[data-share="1"]');
  await p.waitForSelector('.sheet');
  check(/Zertifikat teilen/.test(await txt('.sheet .st')) && /Per WhatsApp/.test(await txt('#sh-wa')) && /Link kopieren/.test(await txt('#sh-copy')) && /PDF herunterladen/.test(await txt('#sh-pdf')), 'Teilen-Sheet (DE): Texte');
  await p.keyboard.press('Escape');
  await p.evaluate(() => { location.hash = '#/nachschlagen'; });
  await p.waitForSelector('#refq');
  await p.waitForSelector('.refitem');
  await sleep(250); // erst nach dem Binden des Eingabefelds tippen
  const hits = async (q) => { await p.fill('#refq', q); return (await p.$$('.refitem')).length; };
  const g1 = await hits('Gefäß'), g2 = await hits('gefass'), g3 = await hits('GEFAESS'), g4 = await hits('gefaß');
  check(g1 >= 2 && g1 === g2 && g2 === g3 && g3 === g4, 'Suche "Gefäß" = "gefass" = "GEFAESS" = "gefaß"', [g1, g2, g3, g4]);
  const s1 = await hits('schlammabscheider');
  check(s1 >= 1 && (await hits('abscheider schlamm')) >= 1 && (await hits('schlamm zzzzqq')) === 0, 'Mehrere Suchwörter müssen alle vorkommen', s1);
  check((await hits('SICHERHEITSGRUPPE')) >= 2 && (await hits('sicherheitsgruppe warmwasserspeicher')) >= 1, 'Suche "sicherheitsgruppe" findet Modul 4 und 5');
  await p.fill('#refq', '');

  step('10a Chef-Cockpit');
  const berlinHour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
  const wantGreet = berlinHour >= 4 && berlinHour < 11 ? 'Guten Morgen' : berlinHour >= 11 && berlinHour < 18 ? 'Guten Tag' : 'Guten Abend';
  await cp.goto(BASE + '/chef/#/cockpit');
  await cp.waitForSelector('.cock .kpi');
  await cp.waitForFunction(() => document.querySelectorAll('.kpi').length === 3 && !document.querySelector('.splash'));
  await sleep(300);
  check((await cp.textContent('.cock h1')).trim() === `${wantGreet}, Miran`, 'Cockpit: Begrüßung nach Berliner Zeit', await cp.textContent('.cock h1'));
  check(/1 Mitarbeiter · Stand heute \d\d:\d\d/.test((await cp.textContent('.ck-sub')).trim()), 'Cockpit: Untertitel mit Stand', await cp.textContent('.ck-sub'));
  const navTxt = await cp.$$eval('.desknav a', (a) => a.map((x) => x.textContent.trim()));
  check(navTxt[0] === 'Cockpit' && navTxt.includes('Team') && navTxt.includes('Einstellungen') && (await cp.getAttribute('.desknav a[aria-current="page"]', 'href')) === '#/cockpit', 'Cockpit ist der erste Tab und aktiv', navTxt);
  const kn = await cp.$$eval('.kpi .kn', (e) => e.map((x) => x.textContent.trim()));
  check(kn.join() === '0,1,0', 'Cockpit: fertig 0, in Arbeit 1, nicht gestartet 0', kn);
  const ckAll = (await cp.textContent('.cock')).replace(/\s+/g, ' ');
  check(/Ø Modul 8 von 15/.test(ckAll), 'Cockpit: Ø aktuelles Modul', ckAll.slice(0, 200));
  check(/Teil 1 · Bauteile\s*1 \/ 1/.test(ckAll) && /Teil 2 · Anlage & Hydraulik\s*0 \/ 1/.test(ckAll), 'Cockpit: Fortschritt je Teil', ckAll);
  check(/1 Zertifikat ausgestellt/.test(ckAll) && /86 % Quiz im 1\. Versuch bestanden/.test(ckAll), 'Cockpit: Zertifikate gesamt und Quote 1. Versuch (6 von 7)', ckAll);
  check(/Gerade ist alles im grünen Bereich/.test(ckAll) && /Noch keine Daten/.test(ckAll), 'Cockpit: leere Zustände (Aufmerksamkeit, Fragen)');
  const certLine = (await cp.textContent('[aria-labelledby="ck-h3"]')).replace(/\s+/g, ' ');
  check(certLine.includes(`${FIRST} ${LAST}`) && /Teil 1 · (Mo|Di|Mi|Do|Fr|Sa|So)/.test(certLine), 'Cockpit: Zertifikat mit Name, Teil und Wochentag', certLine);
  await cp.screenshot({ path: path.join(OUT, `e2e-app-${String(++shotN).padStart(2, '0')}-chef-cockpit.png`), fullPage: true });
  const [dlC] = await Promise.all([cp.waitForEvent('download', { timeout: 15000 }), cp.click('.ck-head a.btn')]);
  check(/^mb-akademie-\d{4}-\d\d-\d\d\.csv$/.test(dlC.suggestedFilename()), 'Cockpit: Monatsbericht = CSV-Export', dlC.suggestedFilename());
  await cp.click('[aria-labelledby="ck-h3"] button.line');
  await cp.waitForFunction(() => /^#\/mitarbeiter\/\d+$/.test(location.hash));
  await cp.waitForFunction((n) => document.querySelector('#detail') && document.querySelector('#detail').textContent.includes(n), `${FIRST} ${LAST}`);
  check(true, 'Cockpit: Klick auf eine Person öffnet deren Detailansicht');
  // Handy-Ansicht: untereinander, 4 Tabs, kein seitliches Scrollen
  await cp.setViewportSize({ width: 390, height: 844 });
  await cp.goto(BASE + '/chef/#/cockpit');
  await cp.waitForSelector('.cock .kpi');
  await cp.waitForFunction(() => document.querySelectorAll('.kpi').length === 3);
  await sleep(300);
  check((await cp.$$('.tabbar a')).length === 4 && (await cp.textContent('.tabbar a:first-child')).trim() === 'Cockpit', 'Cockpit (Handy): Tab-Leiste mit 4 Einträgen, Cockpit zuerst');
  check(await cp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'Cockpit (Handy): kein seitliches Scrollen');
  const ys = await cp.$$eval('.kpi, .ck-grid .card', (e) => e.map((x) => Math.round(x.getBoundingClientRect().top)));
  check(ys.every((y, i) => i === 0 || y > ys[i - 1]), 'Cockpit (Handy): Kacheln und Karten stehen untereinander', ys);
  await cp.screenshot({ path: path.join(OUT, `e2e-app-${String(++shotN).padStart(2, '0')}-chef-cockpit-handy.png`), fullPage: true });
  await cp.setViewportSize({ width: 1280, height: 900 });

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

  step('11 Chef: Mitarbeiter löschen und Rollen');
  await cp.goto(BASE + '/chef/#/einstellungen');
  await cp.waitForSelector('.who');
  const whoTxt = (await cp.textContent('.settings-in')).replace(/\s+/g, ' ');
  check(/Miran Shala \(du\)/.test(whoTxt) && /Hauptadmin/.test(whoTxt), 'Zugänge zeigen Rolle "Hauptadmin"', whoTxt.slice(0, 300));
  check((await cp.$$('[data-role]')).length === 0 && (await cp.$$('[data-del]')).length === 0, 'Einziger Hauptadmin: weder zurückstufen noch entfernen angeboten');
  await cp.screenshot({ path: path.join(OUT, `e2e-app-${String(++shotN).padStart(2, '0')}-chef-einstellungen.png`) });
  await cp.goto(BASE + '/chef/#/team');
  await cp.waitForSelector('table.team tbody tr[data-id]');
  await cp.click('table.team tbody tr[data-id]');
  await cp.waitForSelector('[data-act="delete"]');
  await cp.click('[data-act="delete"]');
  await cp.waitForSelector('dialog[open] input[name=n]');
  check(/Prüfseite|nicht gefunden/.test(await cp.textContent('dialog[open]')), 'Dialog erwähnt die Prüfseite');
  check(await cp.$eval('dialog[open] [type=submit]', (b) => b.disabled), 'Löschen-Knopf zunächst gesperrt');
  await cp.fill('dialog[open] input[name=n]', 'Falscher Name');
  check(await cp.$eval('dialog[open] [type=submit]', (b) => b.disabled), 'Falscher Name: weiter gesperrt');
  await cp.screenshot({ path: path.join(OUT, `e2e-app-${String(++shotN).padStart(2, '0')}-chef-loeschen.png`) });
  await cp.fill('dialog[open] input[name=n]', `  ${FIRST.toLowerCase()}   ${LAST} `);
  check(!(await cp.$eval('dialog[open] [type=submit]', (b) => b.disabled)), 'Richtiger Name (Groß/klein, Leerzeichen egal): Knopf frei');
  await cp.click('dialog[open] [type=submit]');
  await cp.waitForSelector('dialog', { state: 'detached', timeout: 10000 });
  await sleep(600);
  check((await cp.$$('table.team tbody tr[data-id]')).length === 0, 'Mitarbeiter ist aus der Teamliste verschwunden');
  const gone = (await ctx.request.get(BASE + '/api/me')).status();
  check(gone === 401, 'Sitzung des gelöschten Mitarbeiters ungültig (401)', gone);
  await vp.goto(BASE + '/pruefen/?code=' + certCode);
  await vp.waitForSelector('.result');
  check(/Kein Zertifikat/.test(await vp.textContent('.result')), 'Prüfseite: Zertifikat nach dem Löschen nicht gefunden');

  step('Konsole');
  consoleLog.forEach((l) => console.log('  ' + l));
  check(consoleLog.length === 0, 'Browser-Konsole sauber (' + consoleLog.length + ' Meldungen)');

  await browser.close();
  console.log(`\n${okN} ok, ${failN} fehlgeschlagen`);
  if (failN) { console.log(fails.join('\n')); process.exit(1); }
})().catch((e) => { console.error('ABBRUCH', e); consoleLog.forEach((l) => console.log('  ' + l)); process.exit(2); });
