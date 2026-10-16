// M&B Akademie – Mitarbeiter-App (Vanilla JS, ES-Modul, Hash-Routing).
// Verbindlich: SPEC.md. Design: design/App-A3-*.dc.html.
import { t as tr } from './i18n.js';

/* ====================================================================
   Helfer
   ==================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nn = (n) => String(n).padStart(2, '0');
const fmt = (sec) => { sec = Math.max(0, Math.floor(sec || 0)); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); };
const fmtDate = (sec) => {
  try { return new Date(sec * 1000).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Berlin' }); }
  catch (e) { const d = new Date(sec * 1000); return `${nn(d.getDate())}.${nn(d.getMonth() + 1)}.${d.getFullYear()}`; }
};

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* privater Modus o. Ä. */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* egal */ } },
};

/* ====================================================================
   Icons (inline SVG aus dem Design)
   ==================================================================== */
const svg = (inner, { s = 24, sw = 2, fill = 'none', stroke = 'currentColor', label = '' } = {}) =>
  `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}>${inner}</svg>`;
const P = {
  lock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.5-1.9"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  x: '<path d="M7 7l10 10M17 7L7 17"/>',
  chevDown: '<path d="M6 9l6 6 6-6"/>',
  chevUp: '<path d="M6 15l6-6 6 6"/>',
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h3.5v-5.5h3V20H17a1 1 0 0 0 1-1v-9"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  award: '<circle cx="12" cy="9.5" r="5.5"/><path d="M8.7 14l-1.7 6.5 5-2.7 5 2.7-1.7-6.5"/>',
  backspace: '<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/>',
  warn: '<path d="M12 4.5l9 15.5H3z"/><path d="M12 10.5v4"/><path d="M12 17.4v.2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6v.2"/>',
  fs: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  fsExit: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
  wifiOff: '<path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><path d="M12 19.4v.1"/><path d="M3 3l18 18"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  chevR: '<path d="M9 5l7 7-7 7"/>',
  retry: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
};
const I = {
  lock: (s = 20, sw = 1.9) => svg(P.lock, { s, sw }),
  unlock: (s = 28, sw = 1.75) => svg(P.unlock, { s, sw }),
  check: (s = 24, sw = 2.5, stroke = 'currentColor') => svg(P.check, { s, sw, stroke }),
  back: () => svg(P.back),
  close: () => svg(P.close),
  x: (s = 24, sw = 2.5, stroke = 'currentColor') => svg(P.x, { s, sw, stroke }),
  chevDown: (s = 20, stroke = '#5b6570') => svg(P.chevDown, { s, stroke }),
  chevUp: (s = 20, stroke = '#5b6570') => svg(P.chevUp, { s, stroke }),
  home: () => svg(P.home, { s: 26 }),
  grid: () => svg(P.grid, { s: 26 }),
  search: () => svg(P.search, { s: 26 }),
  chevR: () => svg(P.chevR, { s: 20, stroke: '#5b6570' }),
  award: (s = 24, sw = 1.75) => svg(P.award, { s, sw }),
  backspace: () => svg(P.backspace, { s: 26, sw: 1.9 }),
  warn: (s = 18) => svg(P.warn, { s }),
  info: (s = 15) => svg(P.info, { s }),
  fs: () => svg(P.fs, { s: 22 }),
  fsExit: () => svg(P.fsExit, { s: 22 }),
  wifiOff: (s = 40) => svg(P.wifiOff, { s, sw: 1.9 }),
  play: (s = 26) => svg('<path d="M7 4.5v15l12.5-7.5z"/>', { s, fill: 'currentColor', stroke: 'currentColor', sw: 2 }),
  pause: (s = 24) => svg('<rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/>', { s, stroke: 'none' }),
};

/* ====================================================================
   Zustand, Sprache
   ==================================================================== */
const S = {
  me: null,
  lang: 'de',
  lastTab: 'start',
  refQ: '',
  expanded: new Set(),
  reg: { code: '', first: '', last: '' },
  notice: '',
  cleanups: [],
  celebrated: new Set(),
  scrollCert: null,
};
const T = (k, v) => tr(S.lang, k, v);

function setLang(l) {
  S.lang = l === 'sq' ? 'sq' : 'de';
  document.documentElement.lang = S.lang;
  store.set('mb_lang', S.lang);
}
(function initLang() {
  let l = store.get('mb_lang');
  if (!l) l = (navigator.language || '').toLowerCase().startsWith('sq') ? 'sq' : 'de';
  setLang(l);
})();

function onTeardown(fn) { S.cleanups.push(fn); }
function listen(target, type, fn, opts) {
  target.addEventListener(type, fn, opts);
  onTeardown(() => target.removeEventListener(type, fn, opts));
}
function teardown() {
  const c = S.cleanups; S.cleanups = [];
  c.forEach((fn) => { try { fn(); } catch (e) { /* egal */ } });
  hideToast();
}

/* ====================================================================
   API
   ==================================================================== */
class ApiError extends Error {
  constructor(status, message, data, path) {
    super(message); this.status = status; this.data = data || {}; this.path = path || '';
    this.offline = status === 0;
  }
}
async function api(path, body, opts = {}) {
  const init = { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } };
  if (body !== undefined) {
    init.method = 'POST';
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  if (opts.keepalive) init.keepalive = true;
  let res;
  try { res = await fetch(path, init); }
  catch (e) { throw new ApiError(0, T('err.offline'), { offline: true }, path); }
  let data = null;
  try { data = await res.json(); } catch (e) { data = null; }
  if (!res.ok) throw new ApiError(res.status, (data && data.error) || T('err.generic'), data, path);
  return data;
}

async function ensureMe(force) {
  if (S.me && !force) return S.me;
  const me = await api('/api/me');
  S.me = me;
  if (me.lang && me.lang !== S.lang) setLang(me.lang);
  store.set('mb_known', '1');
  return me;
}

function goAuth(notice) {
  S.me = null;
  S.notice = notice || '';
  const target = store.get('mb_known') ? '#/anmelden' : '#/willkommen';
  if (location.hash === target) route(); else location.hash = target;
}

/* ====================================================================
   Darstellung
   ==================================================================== */
const appEl = () => $('#app');
let lastPaint = '';

function paint(html, { tab = null, key = '', focus = true, keepScroll = false } = {}) {
  const app = appEl();
  const old = $('.scroll', app);
  const st = keepScroll && old ? old.scrollTop : 0;
  app.innerHTML = html + (tab ? tabbar(tab) : '');
  if (keepScroll) { const sc = $('.scroll', app); if (sc) sc.scrollTop = st; }
  lastPaint = key;
  if (focus) {
    const h = $('h1', app);
    if (h) { h.tabIndex = -1; try { h.focus({ preventScroll: true }); } catch (e) { /* egal */ } }
  }
  document.title = (($('h1', app) && $('h1', app).textContent.trim()) || T('app.name')) + ' · ' + T('app.name');
}

function paintLoading() {
  appEl().innerHTML = `<div class="loading" role="status"><span class="spin" aria-hidden="true"></span>${esc(T('common.loading'))}</div>`;
  lastPaint = 'loading';
}

function tabbar(active) {
  const tab = (id, href, icon, label) =>
    `<a class="tab" href="${href}"${active === id ? ' aria-current="page"' : ''}>${icon}<span>${esc(label)}</span></a>`;
  // "Nachschlagen" erscheint, sobald mindestens ein Video geschafft ist.
  const ref = active === 'ref' || (S.me && S.me.modules.some((m) => m.completed));
  return `<nav class="tabbar"${ref ? ' style="--tabs:4"' : ''} aria-label="${esc(T('nav.label'))}">${tab('start', '#/start', I.home(), T('nav.start'))}${tab('module', '#/module', I.grid(), T('nav.modules'))}${ref ? tab('ref', '#/nachschlagen', I.search(), T('nav.ref')) : ''}${tab('zertifikate', '#/zertifikate', I.award(26, 2), T('nav.certs'))}</nav>`;
}

let toastTimer = 0;
function toast(msg, ms = 3200) {
  hideToast();
  const el = document.createElement('div');
  el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el);
  toastTimer = setTimeout(hideToast, ms);
}
function hideToast() {
  clearTimeout(toastTimer);
  $$('.toast').forEach((e) => e.remove());
}

function viewError(kind, retry, extra = {}) {
  const offline = kind === 'offline';
  const locked = kind === 'locked';
  const title = locked ? T('err.lockedTitle') : offline ? T('err.offline') : (extra.title || T('err.generic'));
  const text = locked ? (extra.text || T('err.locked')) : (extra.text || '');
  paint(`<div class="screen"><div class="center" role="alert">
    <div class="circ neutral">${offline ? I.wifiOff() : locked ? I.lock(40, 1.75) : I.warn(40)}</div>
    <h1>${esc(title)}</h1>${text ? `<p>${esc(text)}</p>` : ''}
    ${locked ? '' : `<button class="btn" data-retry>${esc(T('common.retry'))}</button>`}
  </div></div>`, { key: 'error' });
  const b = $('[data-retry]');
  if (b) b.addEventListener('click', () => (retry ? retry() : route()));
}

function handleError(e, retry) {
  if (e && e.status === 401) return goAuth(T('login.expired'));
  if (e && e.offline) return viewError('offline', retry);
  if (e && e.status === 403 && e.path === '/api/me') return viewError('locked', null, { text: e.message });
  console.error(e);
  return viewError('generic', retry, { title: (e && e.message) || T('err.generic') });
}

/* ====================================================================
   Fortschritts-Logik
   ==================================================================== */
const isDone = (m) => !!m.completed && (m.n === 0 || !!m.quizPassed);
const currentModule = (me) => me.modules.find((m) => !isDone(m)) || null;
const modLabel = (n) => (n === 0 ? T('start.intro') : T('start.module', { nn: nn(n) }));
const partOf = (me, k) => me.parts.find((p) => p.k === k);
const partTitle = (me, k) => (partOf(me, k) || {}).title || '';

/* ====================================================================
   PIN-Ziffernblock
   ==================================================================== */
function padHtml() {
  const k = (d) => `<button type="button" class="key" data-d="${d}">${d}</button>`;
  return `<div class="pad" role="group" aria-label="${esc(T('pin.pad'))}">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k).join('')}<span class="gap" aria-hidden="true"></span>${k(0)}<button type="button" class="key" data-del aria-label="${esc(T('pin.delete'))}">${I.backspace()}</button></div>`;
}

function pinPad(root, opts = {}) {
  let val = '';
  let err = false;
  const row = $('.pinrow', root);
  function draw() {
    row.innerHTML = [0, 1, 2, 3].map((i) => `<span class="pinbox${err ? ' err' : i === val.length ? ' cur' : ''}">${i < val.length ? '<i></i>' : ''}</span>`).join('');
    row.setAttribute('aria-label', err ? T('pin.statusWrong') : T('pin.status', { n: val.length }));
  }
  function resetIfErr() { if (err) { val = ''; err = false; if (opts.onErrClear) opts.onErrClear(); } }
  function press(d) {
    resetIfErr();
    if (val.length < 4) { val += d; draw(); if (opts.onChange) opts.onChange(val); }
  }
  function del() {
    if (err) { resetIfErr(); } else { val = val.slice(0, -1); }
    draw(); if (opts.onChange) opts.onChange(val);
  }
  root.addEventListener('click', (e) => {
    const k = e.target.closest('.key');
    if (!k || !root.contains(k)) return;
    if (k.hasAttribute('data-del')) del(); else press(k.dataset.d);
  });
  // Hardware-Tastatur (nur wenn kein Textfeld den Fokus hat)
  listen(document, 'keydown', (e) => {
    const tg = e.target;
    if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[0-9]$/.test(e.key)) { press(e.key); e.preventDefault(); }
    else if (e.key === 'Backspace') { del(); e.preventDefault(); }
    else if (e.key === 'Enter' && opts.onEnter && tg && tg.tagName !== 'BUTTON' && tg.tagName !== 'A') { opts.onEnter(); }
  });
  draw();
  return {
    get value() { return val; },
    setError(b) { err = !!b; draw(); },
    clear() { val = ''; err = false; draw(); },
  };
}

/* ====================================================================
   Router
   ==================================================================== */
let navId = 0;
async function route() {
  const id = ++navId;
  const ok = () => id === navId;
  teardown();
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  const name = parts[0] || '';
  const arg = parts[1];
  try {
    switch (name) {
      case 'willkommen': return viewWelcome();
      case 'registrieren': return viewRegister();
      case 'anmelden': return viewLogin();
      case 'start': return await tabView(ok, 'start', buildStart);
      case 'module': return await tabView(ok, 'module', buildModules);
      case 'zertifikate': return await tabView(ok, 'zertifikate', buildCerts);
      case 'nachschlagen': return arg !== undefined && arg !== '' ? await viewRef(Number(arg), ok) : await tabView(ok, 'ref', buildRef);
      case 'video': return await viewVideo(Number(arg), ok);
      case 'quiz': return await viewQuiz(Number(arg), ok);
      default: {
        // Ersten Besuch (nie angemeldet) ohne API-Aufruf zur Willkommen-Seite: vermeidet einen 401-Fehler in der Konsole.
        if (!S.me && !store.get('mb_known')) { if (ok()) location.hash = '#/willkommen'; return; }
        paintLoading();
        try { await ensureMe(); } catch (e) { if (e.status === 401) { if (ok()) goAuth(); return; } throw e; }
        if (ok()) location.hash = '#/start';
      }
    }
  } catch (e) {
    if (ok()) handleError(e, route);
  }
}

/* ====================================================================
   L1 · Willkommen
   ==================================================================== */
function viewWelcome() {
  const draw = () => {
    const tile = (l, label) =>
      `<button type="button" class="langtile" data-lang="${l}" aria-pressed="${S.lang === l}">${esc(label)}${S.lang === l ? I.check(22, 2.5) : ''}</button>`;
    paint(`<div class="screen">
      <div class="scroll top18">
        <div class="brand"><img src="/assets/logo.webp" width="108" height="40" alt="M&amp;B Gebäudetechnik"><span>${esc(T('app.academy'))}</span></div>
        <h1 class="h-xl" style="margin-top:40px">${esc(T('welcome.title'))}</h1>
        <p class="lead" style="margin-top:10px">${esc(T('welcome.sub'))}</p>
        <div role="group" aria-labelledby="l1-sprache" style="margin-top:32px">
          <div id="l1-sprache" class="lbl">${esc(T('lang.group'))}</div>
          <div class="langtiles">${tile('de', T('lang.de'))}${tile('sq', T('lang.sq'))}</div>
        </div>
        <div class="field" style="margin-top:28px">
          <label class="lbl" for="l1-code">${esc(T('welcome.codeLabel'))}</label>
          <input id="l1-code" type="text" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" placeholder="${esc(T('welcome.codePh'))}" aria-describedby="l1-hilfe l1-err" value="${esc(S.reg.code)}">
          <p id="l1-hilfe" class="hint" style="margin-top:10px">${esc(T('welcome.codeHelp'))}</p>
          <p id="l1-err" class="errtxt formerr" role="alert" hidden></p>
        </div>
      </div>
      <div class="foot">
        <button type="button" class="btn" id="l1-next">${esc(T('welcome.next'))}</button>
        <a class="linkbtn" href="#/anmelden" style="margin-top:4px">${esc(T('welcome.haveAccount'))}</a>
        <p class="legal">${esc(T('welcome.privacy'))} <a href="/datenschutz/">${esc(T('common.privacy'))}</a></p>
      </div>
    </div>`, { key: 'welcome', focus: false });
    const input = $('#l1-code');
    const err = $('#l1-err');
    $$('[data-lang]').forEach((b) => b.addEventListener('click', () => {
      S.reg.code = input.value;
      setLang(b.dataset.lang);
      draw();
    }));
    const go = () => {
      const code = input.value.trim().toUpperCase();
      if (!code) {
        err.innerHTML = I.warn() + '<span>' + esc(T('welcome.needCode')) + '</span>';
        err.hidden = false; input.focus(); return;
      }
      S.reg.code = code;
      location.hash = '#/registrieren';
    };
    $('#l1-next').addEventListener('click', go);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    input.addEventListener('input', () => { err.hidden = true; });
  };
  draw();
}

/* ====================================================================
   L2 · Konto anlegen
   ==================================================================== */
function viewRegister() {
  if (!S.reg.code) { location.hash = '#/willkommen'; return; }
  paint(`<div class="screen">
    <div class="topbar"><a class="iconbtn" href="#/willkommen" aria-label="${esc(T('common.back'))}">${I.back()}</a><span class="step">${esc(T('reg.step'))}</span></div>
    <div class="scroll top4" id="regroot">
      <h1 class="h-xl" style="margin-top:16px">${esc(T('reg.title'))}</h1>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:28px">
        <div class="field"><label class="lbl" for="l2-first">${esc(T('reg.first'))}</label><input id="l2-first" type="text" autocomplete="given-name" autocapitalize="words" value="${esc(S.reg.first)}"></div>
        <div class="field"><label class="lbl" for="l2-last">${esc(T('reg.last'))}</label><input id="l2-last" type="text" autocomplete="family-name" autocapitalize="words" value="${esc(S.reg.last)}"></div>
      </div>
      <div style="margin-top:32px">
        <div id="l2-pin" class="lbl">${esc(T('reg.pinSet'))}</div>
        <p id="l2-help" class="hint" style="margin-top:2px;line-height:20px">${esc(T('reg.pinHelp'))}</p>
        <div class="pinrow" role="img" style="margin-top:16px"></div>
        <div id="l2-err" class="errtxt mid" role="alert" style="margin-top:10px;min-height:20px"></div>
      </div>
      <div style="margin-top:16px">${padHtml()}</div>
    </div>
    <div class="foot p24"><button type="button" class="btn" id="l2-submit">${esc(T('reg.submit'))}</button></div>
  </div>`, { key: 'register', focus: false });

  const root = $('#regroot');
  const first = $('#l2-first'); const last = $('#l2-last');
  const err = $('#l2-err'); const pinLbl = $('#l2-pin'); const help = $('#l2-help');
  let stage = 1; let pin1 = ''; let confirmed = ''; let busy = false;
  const showErr = (m) => { err.innerHTML = m ? I.warn() + '<span>' + esc(m) + '</span>' : ''; };

  const pad = pinPad(root, {
    onErrClear() { showErr(''); },
    onChange(v) {
      showErr('');
      if (v.length < 4) { if (stage === 2) confirmed = ''; return; }
      if (stage === 1) {
        pin1 = v;
        setTimeout(() => {
          if (pad.value !== v) return;
          stage = 2; pad.clear();
          pinLbl.textContent = T('reg.pinRepeat'); help.textContent = T('reg.pinRepeatHelp');
        }, 180);
      } else if (v === pin1) {
        confirmed = v;
      } else {
        pad.setError(true); showErr(T('reg.mismatch'));
        setTimeout(() => { stage = 1; pin1 = ''; confirmed = ''; pad.clear(); pinLbl.textContent = T('reg.pinSet'); help.textContent = T('reg.pinHelp'); }, 900);
      }
    },
  });

  const submit = async () => {
    if (busy) return;
    const f = first.value.trim(); const l = last.value.trim();
    S.reg.first = f; S.reg.last = l;
    if (!f || !l) { showErr(T('reg.needNames')); (f ? last : first).focus(); return; }
    if (!confirmed || pad.value !== confirmed) { showErr(T('reg.needPin')); return; }
    busy = true;
    const btn = $('#l2-submit'); btn.disabled = true; btn.textContent = T('reg.busy');
    try {
      await api('/api/register', { code: S.reg.code, first: f, last: l, lang: S.lang, pin: confirmed });
      store.set('mb_known', '1');
      S.reg = { code: '', first: '', last: '' };
      await ensureMe(true);
      location.hash = '#/start';
    } catch (e) {
      busy = false; btn.disabled = false; btn.textContent = T('reg.submit');
      showErr(e.offline ? T('err.offline') : e.message);
    }
  };
  $('#l2-submit').addEventListener('click', submit);
  [first, last].forEach((i) => i.addEventListener('input', () => showErr('')));
  first.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); last.focus(); } });
  last.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); last.blur(); } });
}

/* ====================================================================
   L3 · Wieder anmelden
   ==================================================================== */
function viewLogin() {
  const notice = S.notice; S.notice = '';
  const draw = (keepName) => {
    const name = keepName !== undefined ? keepName : '';
    paint(`<div class="screen">
      <div class="topbar"><a class="iconbtn" href="#/willkommen" aria-label="${esc(T('common.back'))}">${I.back()}</a><span class="grow"></span>
        <div class="langsw" role="group" aria-label="${esc(T('lang.group'))}"><button type="button" data-lang="de" aria-pressed="${S.lang === 'de'}" aria-label="${esc(T('lang.switchDe'))}">DE</button><span class="sep" aria-hidden="true"></span><button type="button" data-lang="sq" aria-pressed="${S.lang === 'sq'}" aria-label="${esc(T('lang.switchSq'))}">SQ</button></div></div>
      <div class="scroll top4" id="logroot">
        <h1 class="h-xl" style="margin-top:16px">${esc(T('login.title'))}</h1>
        ${notice ? `<p class="meta" style="margin-top:8px">${esc(notice)}</p>` : ''}
        <div class="field" style="margin-top:24px"><label class="lbl" for="l3-name">${esc(T('login.name'))}</label>
          <input id="l3-name" type="text" autocomplete="name" autocapitalize="words" placeholder="${esc(T('login.namePh'))}" value="${esc(name)}"></div>
        <div style="margin-top:24px">
          <div class="lbl">${esc(T('login.pin'))}</div>
          <div class="pinrow" role="img" style="margin-top:12px"></div>
          <div id="l3-err" class="errtxt mid" role="alert" style="margin-top:10px;min-height:20px"></div>
        </div>
        <div style="margin-top:12px">${padHtml()}</div>
        <div style="display:flex;flex-direction:column;align-items:center;margin-top:8px">
          <span class="linkbtn u" style="font-weight:700;cursor:default">${esc(T('login.forgot'))}</span>
          <p class="hint" style="text-align:center;line-height:20px">${esc(T('login.forgotHelp'))}</p>
        </div>
      </div>
      <div class="foot p24"><button type="button" class="btn" id="l3-submit">${esc(T('login.submit'))}</button></div>
    </div>`, { key: 'login', focus: false });

    const root = $('#logroot'); const nameIn = $('#l3-name'); const err = $('#l3-err');
    const showErr = (m) => { err.innerHTML = m ? I.warn() + '<span>' + esc(m) + '</span>' : ''; };
    let busy = false;
    const pad = pinPad(root, { onErrClear() { showErr(''); }, onChange() { showErr(''); }, onEnter: () => submit() });
    $$('[data-lang]').forEach((b) => b.addEventListener('click', () => { setLang(b.dataset.lang); draw(nameIn.value); }));
    nameIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); nameIn.blur(); } });
    nameIn.addEventListener('input', () => showErr(''));

    async function submit() {
      if (busy) return;
      const nm = nameIn.value.trim().replace(/\s+/g, ' ');
      if (!nm || !nm.includes(' ')) { showErr(T('login.needName')); nameIn.focus(); return; }
      if (pad.value.length !== 4) { showErr(T('login.needPin')); return; }
      busy = true; const btn = $('#l3-submit'); btn.disabled = true;
      try {
        await api('/api/login', { name: nm, pin: pad.value });
        store.set('mb_known', '1');
        await ensureMe(true);
        location.hash = '#/start';
      } catch (e) {
        busy = false; btn.disabled = false;
        if (e.offline) { showErr(T('err.offline')); return; }
        const rem = e.data && typeof e.data.remaining === 'number' ? e.data.remaining : null;
        if (rem !== null && rem > 0) { pad.setError(true); showErr(rem === 1 ? T('login.wrongOne') : T('login.wrong', { n: rem })); }
        else { if (rem !== null) pad.setError(true); showErr(e.message); }
      }
    }
    $('#l3-submit').addEventListener('click', submit);
  };
  draw();
}

/* ====================================================================
   Tab-Ansichten (Start, Module, Zertifikate) – erst Cache, dann frisch
   ==================================================================== */
async function tabView(ok, tab, build) {
  S.lastTab = tab;
  const show = (me, first) => {
    const v = build(me);
    paint(v.html, { tab, key: tab, focus: first, keepScroll: !first });
    if (v.bind) v.bind(appEl());
  };
  if (S.me) {
    show(S.me, true);
    try {
      const fresh = await ensureMe(true);
      if (ok()) show(fresh, false);
    } catch (e) { if (e.status === 401 || e.status === 403) throw e; }
  } else {
    paintLoading();
    const me = await ensureMe(true);
    if (ok()) show(me, true);
  }
}

/* ---------- Start ---------- */
function moduleProgressText(m) {
  if (m.completed && m.n > 0 && !m.quizPassed) return T('start.quizOpen');
  if ((m.maxPos || 0) > 1 && !m.completed) return T('start.posOf', { a: fmt(m.maxPos), b: fmt(m.duration) });
  return T('start.notStarted', { b: fmt(m.duration) });
}

function buildStart(me) {
  const cur = currentModule(me);
  const tot = me.totals || { done: 0, total: me.modules.length, remainingSec: 0 };
  const pct = tot.total ? Math.round((tot.done / tot.total) * 100) : 0;
  const min = Math.max(cur ? 1 : 0, Math.ceil((tot.remainingSec || 0) / 60));
  const head = `<div class="brandrow"><img src="/assets/logo.webp" width="75" height="28" alt="M&amp;B Gebäudetechnik">
    <div class="langsw" role="group" aria-label="${esc(T('lang.group'))}"><button type="button" data-lang="de" aria-pressed="${S.lang === 'de'}" aria-label="${esc(T('lang.switchDe'))}">DE</button><span class="sep" aria-hidden="true"></span><button type="button" data-lang="sq" aria-pressed="${S.lang === 'sq'}" aria-label="${esc(T('lang.switchSq'))}">SQ</button></div></div>
    <h1 class="h-xl" style="margin-top:28px">${esc(T('start.hello', { name: me.first }))}</h1>`;
  let body;
  if (!cur) {
    body = `<p class="meta" style="margin-top:10px">${esc(T('start.allText', { total: tot.total }))}</p>
      <div class="bar" role="img" aria-label="${esc(T('start.progressAria', { pct: 100 }))}" style="margin-top:12px"><i style="width:100%"></i></div>
      <div class="alldone"><div class="circ">${I.check(52, 2.6)}</div><h2 class="h-xl" style="font-size:28px">${esc(T('start.allTitle'))}</h2>
      <a class="btn" href="#/zertifikate">${esc(T('start.toCerts'))}</a></div>`;
  } else {
    const frac = cur.completed ? 1 : Math.min(1, (cur.maxPos || 0) / (cur.duration || 1));
    const label = modLabel(cur.n);
    const progLine = moduleProgressText(cur);
    const started = cur.completed || (cur.maxPos || 0) > 1;
    const idx = me.modules.indexOf(cur);
    const nexts = me.modules.slice(idx + 1, idx + 3);
    const certPart = partOf(me, cur.part);
    body = `<p class="meta" style="margin-top:10px">${esc(T('start.progress', { done: tot.done, total: tot.total, min }))}</p>
      <div class="bar" role="img" aria-label="${esc(T('start.progressAria', { pct }))}" style="margin-top:12px"><i style="width:${pct}%"></i></div>
      <a class="resume" href="#/video/${cur.n}" aria-label="${esc(started ? T('start.resumeAria', { label, pos: fmt(cur.completed ? cur.duration : cur.maxPos), total: fmt(cur.duration) }) : T('start.startAria', { label }))}">
        <div class="txt"><div class="k">${esc(label)}</div><h2>${esc(cur.title)}</h2>
          ${started ? `<div class="rbar" aria-hidden="true"><i style="width:${Math.round(frac * 100)}%"></i></div>` : ''}
          <div class="sub${started ? '' : ' first'}">${esc(progLine)}</div></div>
        <span class="go" aria-hidden="true">${I.play(26)}</span></a>
      <h2 class="h-next">${esc(T('start.next'))}</h2>
      <ul class="rows">
        ${nexts.map((m) => `<li class="row"><span class="n">${nn(m.n)}</span><span class="t">${esc(m.title)}</span>${m.unlocked ? '' : svg(P.lock, { s: 20, sw: 1.9, label: T('start.locked') })}</li>`).join('')}
        ${certPart ? `<li><a class="row" href="#/zertifikate" style="text-decoration:none">${I.award(24, 1.75)}<span class="t">${esc(T('start.certPart', { k: certPart.k }))}</span></a></li>` : ''}
      </ul>`;
  }
  return {
    html: `<div class="screen"><div class="scroll top18">${head}${body}</div></div>`,
    bind(root) {
      $$('[data-lang]', root).forEach((b) => b.addEventListener('click', async () => {
        if (b.dataset.lang === S.lang) return;
        const l = b.dataset.lang;
        try {
          await api('/api/lang', { lang: l });
          setLang(l);
          const fresh = await ensureMe(true);
          const v = buildStart(fresh); paint(v.html, { tab: 'start', key: 'start', focus: false }); v.bind(appEl());
        } catch (e) { handleError(e, route); }
      }));
    },
  };
}

/* ---------- Module ---------- */
function buildModules(me) {
  const totalSec = me.modules.reduce((a, m) => a + (m.duration || 0), 0);
  const totalMin = Math.round(totalSec / 60);
  const dur = totalMin >= 60 ? T(totalMin % 60 ? 'modules.durH' : 'modules.durH0', { h: Math.floor(totalMin / 60), m: totalMin % 60 }) : T('modules.durM', { m: Math.max(1, totalMin) });
  const cur = currentModule(me);
  const rowHtml = (m) => {
    const done = isDone(m);
    const isCur = cur && cur.n === m.n;
    const inner = (end) => `<span class="n">${nn(m.n)}</span><span class="t">${isCur ? `<span style="display:block">${esc(m.title)}</span><span class="s">${esc(m.completed && m.n > 0 && !m.quizPassed ? T('modules.quizOpen') : (m.maxPos || 0) > 1 ? T('start.posOf', { a: fmt(m.maxPos), b: fmt(m.duration) }) : fmt(m.duration))}</span>` : esc(m.title)}</span>${end}`;
    if (m.unlocked) {
      const end = done ? svg(P.check, { s: 20, sw: 2.5, stroke: '#1b7a43', label: T('modules.done') }) : '';
      return `<li><a class="mrow${isCur ? ' cur' : done ? ' ok' : ''}" href="#/video/${m.n}"${isCur ? ' aria-current="step"' : ''}>${inner(end)}</a></li>`;
    }
    return `<li class="mrow">${inner(svg(P.lock, { s: 18, sw: 1.9, label: T('modules.locked') }))}</li>`;
  };
  const partsHtml = me.parts.map((p, i) => {
    const mods = me.modules.filter((m) => m.part === p.k);
    const allDone = mods.length > 0 && mods.every(isDone);
    const open = !allDone || S.expanded.has(p.k);
    const head = `<div class="parthead${i === 0 ? ' first' : ''}"><h2>${esc(T('modules.part', { k: p.k, title: p.title }))}</h2><span>${p.done}/${p.total}</span></div>`;
    if (allDone) {
      return head + `<button type="button" class="collapse" data-toggle="${p.k}" aria-expanded="${open}" aria-label="${esc(open ? T('modules.collapse', { k: p.k }) : T('modules.expand', { k: p.k, n: mods.length }))}">${I.check(22, 2.5, '#1b7a43')}<span>${esc(T('modules.allDone', { n: mods.length }))}</span>${open ? I.chevUp() : I.chevDown()}</button>` +
        (open ? `<ul class="partlist" style="margin-top:0">${mods.map(rowHtml).join('')}</ul>` : '');
    }
    return head + `<ul class="partlist">${mods.map(rowHtml).join('')}</ul>`;
  }).join('');
  return {
    html: `<div class="screen"><div class="scroll top18">
      <h1 class="h-page">${esc(T('modules.title'))}</h1>
      <p class="meta" style="margin-top:2px">${esc(T('modules.sub', { n: me.modules.length, dur }))}</p>
      ${partsHtml}
      <button type="button" class="linkbtn logout" data-logout>${esc(T('modules.logout'))}</button>
    </div></div>`,
    bind(root) {
      $$('[data-toggle]', root).forEach((b) => b.addEventListener('click', () => {
        const k = Number(b.dataset.toggle);
        if (S.expanded.has(k)) S.expanded.delete(k); else S.expanded.add(k);
        const v = buildModules(S.me);
        paint(v.html, { tab: 'module', key: 'module', focus: false, keepScroll: true });
        v.bind(appEl());
        const nb = $(`[data-toggle="${k}"]`); if (nb) nb.focus({ preventScroll: true });
      }));
      const lo = $('[data-logout]', root);
      if (lo) lo.addEventListener('click', async () => {
        try { await api('/api/logout', {}); } catch (e) { /* egal, lokal trotzdem abmelden */ }
        S.me = null; store.set('mb_known', '1'); location.hash = '#/anmelden';
      });
    },
  };
}

/* ---------- Zertifikate ---------- */
const loadedScripts = {};
function loadScript(src) {
  if (!loadedScripts[src]) {
    loadedScripts[src] = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res;
      s.onerror = () => { delete loadedScripts[src]; rej(new Error('script ' + src)); };
      document.head.appendChild(s);
    });
  }
  return loadedScripts[src];
}
async function loadCert() {
  if (window.MBCert) return window.MBCert;
  await loadScript('/assets/pdf-lib.min.js');
  await Promise.all([loadScript('/assets/fontkit.umd.min.js'), loadScript('/assets/qrcode.js')]);
  await loadScript('/assets/cert.js');
  if (!window.MBCert) throw new Error('MBCert fehlt');
  return window.MBCert;
}

function certPreview(me, p) {
  const cert = p.certificate;
  const mods = me.modules.filter((m) => m.part === p.k);
  return `<div class="cprev" role="img" aria-label="${esc(T('certs.previewAlt', { k: p.k, title: p.title }))}">
    <div class="frame"></div>
    <img src="/assets/logo.webp" alt="" width="420" height="156">
    <div class="nr">${esc(T('certs.pNr'))}<b>${esc(cert.code)}</b></div>
    <div class="acad">${esc(T('certs.pHead'))}</div>
    <div class="ct">${esc(T('certs.pTitle'))}</div>
    <div class="conf">${esc(T('certs.pConfirm'))}</div>
    <div class="nm">${esc(me.first + ' ' + me.last)}</div>
    <div class="tx">${esc(T('certs.pText', { k: p.k, title: p.title }))}</div>
    <div class="toc"><div class="h">${esc(T('certs.pContent'))}</div>${mods.map((m) => `<div class="r"><span>${nn(m.n)}</span><span>${esc(m.title)}</span></div>`).join('')}</div>
    <div class="place"><span style="display:block;font-size:1.3cqw;letter-spacing:.08em;color:#5b6570">${esc(T('certs.pPlace'))}</span>Treuchtlingen, ${esc(fmtDate(cert.issuedAt))}</div>
    <div class="seal" aria-hidden="true">M&amp;B<br>${esc(fmtDate(cert.issuedAt).slice(-4))}</div>
  </div>`;
}

/* ---------- Abzeichen (Embleme aus dem Design App-A3-Abzeichen) ---------- */
// Symbole je Teil; c1 = Linienfarbe, c2 = Akzent. k = 1..3 Teile, 4 = Gesamt.
const EMBLEM_GLYPH = {
  1: (c1, c2) => `<path d="M56 32l18 7v13c0 12-8 21-18 25-10-4-18-13-18-25V39z" fill="none" stroke="${c1}" stroke-width="2.6" stroke-linejoin="round"/><path d="M48 55l6 6 11-12" fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  2: (c1, c2) => `<rect x="40" y="30" width="22" height="44" rx="10" fill="none" stroke="${c1}" stroke-width="2.6"/><path d="M62 42h12v24h-12M68 42v-6M68 66v8" fill="none" stroke="${c1}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M45 58c3 0 3 3 6 3s3-3 6-3" fill="none" stroke="${c2}" stroke-width="2.6" stroke-linecap="round"/>`,
  3: (c1, c2) => `<path d="M56 30c9 12 15 20 15 28a15 15 0 0 1-30 0c0-8 6-16 15-28z" fill="none" stroke="${c1}" stroke-width="2.6" stroke-linejoin="round"/><path d="M50 60h12" stroke="${c2}" stroke-width="2.6" stroke-linecap="round"/>`,
  4: (c1, c2) => `<path d="M56 31l7 14 15 2-11 11 3 15-14-7-14 7 3-15-11-11 15-2z" fill="none" stroke="${c1}" stroke-width="2.6" stroke-linejoin="round"/>${c2 ? `<circle cx="56" cy="57" r="3.2" fill="${c2}"/>` : ''}`,
};
// mode: 'reached' (Ring rot), 'open' (gestrichelt + Schloss), 'celebrate' (Abschluss-Moment mit gezeichnetem Ring)
function emblem(k, { mode = 'reached', size = 112 } = {}) {
  const open = mode === 'open';
  const head = open
    ? '<circle cx="56" cy="56" r="48" fill="#f7f8fa" stroke="#c9ced4" stroke-width="2" stroke-dasharray="5 5"/>'
    : mode === 'celebrate'
      ? '<circle cx="56" cy="56" r="48" fill="#fff" stroke="#f1f2f4" stroke-width="3"/><circle class="ring" cx="56" cy="56" r="48" fill="none" stroke="#d6001c" stroke-width="3" transform="rotate(-90 56 56)"/><circle cx="56" cy="56" r="41" fill="#fff6f7" stroke="#f3c7cd" stroke-width="1"/>'
      : `<circle cx="56" cy="56" r="48" fill="#fff" stroke="#d6001c" stroke-width="3"/>${k === 4 ? '<circle cx="56" cy="56" r="53" fill="none" stroke="#f3c7cd" stroke-width="1"/>' : ''}<circle cx="56" cy="56" r="41" fill="#fff6f7" stroke="#f3c7cd" stroke-width="1"/>`;
  const glyph = open ? EMBLEM_GLYPH[k]('#b7bec6', k === 4 ? null : '#b7bec6') : EMBLEM_GLYPH[k]('#0f1317', '#d6001c');
  const lock = open ? '<circle cx="84" cy="84" r="13" fill="#fff" stroke="#d9dde2"/><path d="M79 84v-3a5 5 0 0 1 10 0v3M77.5 84h13v8h-13z" fill="none" stroke="#5b6570" stroke-width="1.8" stroke-linejoin="round"/>' : '';
  return `<svg${mode === 'celebrate' ? ' class="pop"' : ''} viewBox="0 0 112 112" width="${size}" height="${size}" aria-hidden="true">${head}${glyph}${lock}</svg>`;
}
const badgeName = (k) => T(k === 4 ? 'badge.all' : 'badge.p' + k);

function buildCerts(me) {
  const earned = me.parts.filter((p) => p.certificate);
  const open = me.parts.filter((p) => !p.certificate);
  const remainingOf = (k) => me.modules.filter((m) => m.part === k && !isDone(m)).length;
  const allDone = earned.length === 3;
  const allDate = allDone ? Math.max(...earned.map((p) => p.certificate.issuedAt || 0)) : 0;

  const badge = (k) => {
    const p = k < 4 ? partOf(me, k) : null;
    const reached = k < 4 ? !!(p && p.certificate) : allDone;
    const name = badgeName(k);
    let sub;
    if (k < 4) {
      const rem = remainingOf(k);
      sub = reached ? T('badge.partDone', { k, date: fmtDate(p.certificate.issuedAt) })
        : T('badge.partOpen', { k, rest: rem === 1 ? T('certs.remainingOne') : T('certs.remainingMany', { n: rem }) });
    } else sub = reached ? T('badge.allDone', { date: fmtDate(allDate) }) : T('badge.allOpen');
    const inner = `${emblem(k, { mode: reached ? 'reached' : 'open' })}<div class="bt">${esc(name)}</div><div class="bs">${esc(sub)}</div>`;
    const aria = esc(T(reached ? 'badge.reached' : 'badge.notReached', { name }) + ' · ' + sub);
    return reached
      ? `<button type="button" class="badge" data-badge="${k}" aria-label="${aria}">${inner}</button>`
      : `<div class="badge open" role="img" aria-label="${aria}">${inner}</div>`;
  };
  const reachedCount = earned.length + (allDone ? 1 : 0);

  const cards = earned.map((p) => `<section class="certcard" id="cert-${p.k}" aria-label="${esc(T('certs.part', { k: p.k, title: p.title }))}">
      ${certPreview(me, p)}
      <h3>${esc(T('certs.part', { k: p.k, title: p.title }))}</h3>
      <p class="meta">${esc(T('certs.received', { date: fmtDate(p.certificate.issuedAt) }))}</p>
      <div class="cbtns"><button type="button" class="btn" data-share="${p.k}">${esc(T('certs.share'))}</button><button type="button" class="btn ghost" data-dl="${p.k}">${esc(T('certs.download'))}</button></div>
    </section>`).join('');
  const rows = open.map((p) => {
    const mods = me.modules.filter((m) => m.part === p.k);
    const reachable = mods.some((m) => m.unlocked);
    const remaining = mods.filter((m) => !isDone(m)).length;
    const sub = reachable ? (remaining === 1 ? T('certs.remainingOne') : T('certs.remainingMany', { n: remaining })) : T('certs.locked');
    return `<li class="crow${reachable ? '' : ' lock'}"><div class="a"><div class="t">${esc(T('certs.part', { k: p.k, title: p.title }))}</div><div class="s">${esc(sub)}</div></div>${reachable ? '' : I.lock(18, 1.9)}</li>`;
  }).join('');
  return {
    html: `<div class="screen"><div class="scroll top18">
      <h1 class="h-page">${esc(T('badge.title'))}</h1>
      <p class="meta" style="margin-top:2px">${esc(T('badge.count', { n: reachedCount }))}</p>
      <div class="badges">${[1, 2, 3, 4].map(badge).join('')}</div>
      <div class="badgeinfo">${svg(P.info, { s: 22, sw: 2, stroke: '#5b6570' })}<span>${esc(T('badge.info'))}</span></div>
      <h2 class="sect" id="certs-top">${esc(T('certs.title'))}</h2>
      ${cards}
      ${rows ? `<ul class="cparts">${rows}</ul>` : ''}
      <p class="cnote">${esc(T('certs.note'))}</p>
    </div></div>`,
    bind(root) {
      if (earned.length) setTimeout(() => loadCert().catch(() => {}), 600);
      const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
      };
      $$('[data-badge]', root).forEach((b) => b.addEventListener('click', () => {
        const k = Number(b.dataset.badge);
        scrollTo(k < 4 ? 'cert-' + k : 'certs-top');
      }));
      $$('[data-dl]', root).forEach((b) => b.addEventListener('click', () => pdfFor(Number(b.dataset.dl), b)));
      $$('[data-share]', root).forEach((b) => b.addEventListener('click', () => openShare(me, partOf(me, Number(b.dataset.share)), b)));
      // Nach dem Abschluss-Moment: direkt zum Zertifikat des Teils springen
      if (S.scrollCert) { const id = 'cert-' + S.scrollCert; S.scrollCert = null; setTimeout(() => scrollTo(id), 60); }
    },
  };
}

const reducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// PDF erzeugen und speichern (Button zeigt "Wird erstellt …"). Rückgabe: true bei Erfolg.
async function pdfFor(k, btn) {
  const label = btn ? btn.textContent : '';
  const all = $$('[data-dl],[data-share],[data-pdf]');
  all.forEach((b) => { b.disabled = true; });
  if (btn) btn.textContent = T('certs.busy');
  try {
    const [lib, data] = await Promise.all([loadCert(), api('/api/certificate/' + k)]);
    await lib.download(data);
    return true;
  } catch (e) {
    if (e && e.status === 401) goAuth(T('login.expired'));
    else toast(e && e.offline ? T('err.offline') : T('certs.error'));
    return false;
  } finally {
    if (btn) btn.textContent = label;
    all.forEach((b) => { b.disabled = false; });
  }
}

async function copyText(txt) {
  try { await navigator.clipboard.writeText(txt); return true; } catch (e) { /* Fallback */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = txt; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (e) { return false; }
}

/* ---------- Zertifikat teilen (Bottom-Sheet) ---------- */
function openShare(me, p, opener) {
  if (!p || !p.certificate) return;
  $$('.sheetwrap').forEach((e) => e.remove());
  const k = p.k;
  const url = `${location.origin}/pruefen/?code=${encodeURIComponent(p.certificate.code)}`;
  const text = T('share.msg', { k }) + '\n' + T('share.msgLink', { url });
  const wa = 'https://wa.me/?text=' + encodeURIComponent(text);
  const canNative = typeof navigator.share === 'function';
  const wrap = document.createElement('div');
  wrap.className = 'sheetwrap';
  wrap.innerHTML = `<div class="scrim" data-close></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-t">
      <div class="grab" aria-hidden="true"></div>
      <div class="shead"><div class="st" id="sh-t">${esc(T('share.title'))}</div><button type="button" class="iconbtn" data-close aria-label="${esc(T('common.close'))}">${I.close()}</button></div>
      <p class="ss">${esc(T('share.sub'))}</p>
      <div class="srow">
        <a class="btn sm" id="sh-wa" href="${esc(wa)}" target="_blank" rel="noopener noreferrer">${esc(T('share.wa'))}</a>
        <button type="button" class="btn sm ghost" id="sh-copy">${esc(T('share.copy'))}</button>
      </div>
      ${canNative ? `<button type="button" class="linkbtn sbtn" id="sh-native">${esc(T('share.more'))}</button>` : ''}
      <button type="button" class="linkbtn sbtn" id="sh-pdf" data-pdf="${k}">${esc(T('certs.download'))}</button>
      <div class="vh" role="status" aria-live="polite" id="sh-live"></div>
    </div>`;
  document.body.appendChild(wrap);
  let closed = false;
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const f = $$('a[href],button:not(:disabled)', wrap);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  function close() {
    if (closed) return; closed = true;
    document.removeEventListener('keydown', onKey);
    wrap.remove();
    if (opener && document.contains(opener)) { try { opener.focus({ preventScroll: true }); } catch (e) { /* egal */ } }
  }
  document.addEventListener('keydown', onKey);
  onTeardown(() => { if (!closed) { closed = true; document.removeEventListener('keydown', onKey); wrap.remove(); } });
  $$('[data-close]', wrap).forEach((b) => b.addEventListener('click', close));

  const live = $('#sh-live', wrap);
  const copyBtn = $('#sh-copy', wrap);
  let copyTimer = 0;
  copyBtn.addEventListener('click', async () => {
    const okc = await copyText(url);
    clearTimeout(copyTimer);
    if (okc) {
      copyBtn.innerHTML = `${I.check(20, 2.5)}<span>${esc(T('share.copied'))}</span>`;
      copyBtn.classList.add('done');
      live.textContent = T('share.copied');
      copyTimer = setTimeout(() => { copyBtn.textContent = T('share.copy'); copyBtn.classList.remove('done'); live.textContent = ''; }, 2600);
    } else {
      live.textContent = T('share.copyFail');
      toast(T('share.copyFail'), 4200);
    }
  });
  const nb = $('#sh-native', wrap);
  if (nb) nb.addEventListener('click', async () => {
    try { await navigator.share({ title: T('share.native', { k, title: p.title }), text: T('share.msg', { k }), url }); close(); }
    catch (e) { /* abgebrochen oder nicht möglich: Sheet bleibt offen */ }
  });
  $('#sh-pdf', wrap).addEventListener('click', async (ev) => { if (await pdfFor(k, ev.currentTarget)) close(); });
  setTimeout(() => { const wab = $('#sh-wa', wrap); if (wab) wab.focus({ preventScroll: true }); }, 30);
}

/* ====================================================================
   Video (Screen 2 + Schutz-Zustände S1–S3)
   ==================================================================== */
function backToTab() { location.hash = '#/' + (S.lastTab === 'zertifikate' ? 'zertifikate' : S.lastTab === 'module' ? 'module' : S.lastTab === 'ref' ? 'nachschlagen' : 'start'); }

function viewLockedModule() {
  paint(`<div class="screen"><div class="center"><div class="circ neutral">${I.lock(40, 1.75)}</div>
    <h1>${esc(T('video.lockedTitle'))}</h1><p>${esc(T('video.lockedText'))}</p>
    <a class="btn" href="#/module">${esc(T('video.toOverview'))}</a></div></div>`, { key: 'locked' });
}

async function viewVideo(n, ok) {
  if (!Number.isInteger(n) || n < 0) { location.hash = '#/start'; return; }
  paintLoading();
  const me = await ensureMe(true);
  if (!ok()) return;
  const m = me.modules.find((x) => x.n === n);
  if (!m) { viewError('generic', null, { title: T('err.notFound') }); return; }
  if (!m.unlocked) { viewLockedModule(); return; }

  const dur = m.duration;
  const next = me.modules.find((x) => x.n === n + 1) || null;
  let done = !!m.completed;
  let maxPos = Math.max(m.maxPos || 0, done ? dur : 0);
  const src = `/videos/M${nn(n)}_${S.lang.toUpperCase()}.mp4`;
  const label = n === 0 ? T('video.titleIntro') : T('video.title', { nn: nn(n) });
  const points = Array.isArray(m.points) ? m.points : [];

  paint(`<div class="screen" id="vscreen">
    <div class="vtop"><button type="button" class="iconbtn" id="vback" aria-label="${esc(T('common.back'))}">${I.back()}</button><span class="tt">${esc(label)}</span><span></span></div>
    <div class="player" id="pl" data-ov="${done ? 'done' : 'idle'}">
      <video id="vid" playsinline webkit-playsinline preload="metadata" controlslist="nodownload noplaybackrate noremoteplayback" disablepictureinpicture disableremoteplayback src="${esc(src)}"></video>
      <div class="pnum" aria-hidden="true">${nn(n)}</div>
      <button type="button" class="pfs" id="pfs" aria-label="${esc(T('video.fullscreen'))}">${I.fs()}</button>
      <button type="button" class="pbtn" id="pbtn" aria-label="${esc(T('video.play'))}"></button>
      <div class="ptoast" id="ptoast" role="status" hidden>${I.lock(16, 2)}<span>${esc(T('video.toastSeek'))}</span></div>
      <div class="pseek" id="pseek"><div class="track"></div><div class="fill" id="pfill"></div><div class="tick" id="ptick"></div>
        <button type="button" class="pthumb" id="pthumb" role="slider" aria-label="${esc(T('video.position'))}" aria-valuemin="0" aria-valuemax="${Math.round(dur)}" aria-valuenow="0" aria-valuetext=""></button></div>
      <div class="ptimes" aria-hidden="true"><span id="tcur">0:00</span><span>${fmt(dur)}</span></div>
      <div class="pov" id="pov" hidden></div>
    </div>
    <div class="vhint" id="vhint"></div>
    <div class="scroll vbody">
      <h1 class="h-mod">${esc(m.title)}</h1>
      ${m.goal ? `<p class="lead">${esc(m.goal)}</p>` : ''}
      ${points.length ? `<h2>${esc(T('video.keyPoints'))}</h2><ol class="points">${points.map((p, i) => `<li><span class="i">${i + 1}</span><p>${esc(p)}</p></li>`).join('')}</ol>` : ''}
    </div>
    <div class="foot line vfoot"><button type="button" class="btn h54" id="qbtn" disabled></button><p id="qinfo"></p></div>
  </div>`, { key: 'video', focus: false });

  const el = (id) => document.getElementById(id);
  const vid = el('vid'); const pl = el('pl'); const pbtn = el('pbtn'); const pov = el('pov');
  const pseek = el('pseek'); const pfill = el('pfill'); const ptick = el('ptick'); const pthumb = el('pthumb');
  const tcur = el('tcur'); const ptoast = el('ptoast'); const vhint = el('vhint');
  const qbtn = el('qbtn'); const qinfo = el('qinfo');

  let alive = true; let bg = false; let ov = done ? 'done' : 'idle'; let lastT = 0;
  let timer = 0; let toastT = 0; let thumbT = 0; let dragging = false; let dragT = 0; let offlineShown = false;
  let lastFootSec = -1; let savingTries = 0;

  // Schutz: Rate fest, kein Kontextmenü, nativer Stream nicht kopierbar
  vid.defaultPlaybackRate = 1; vid.playbackRate = 1;
  vid.addEventListener('contextmenu', (e) => e.preventDefault());
  pl.addEventListener('contextmenu', (e) => e.preventDefault());

  /* ---- Overlay-Zustände ---- */
  function setOv(kind) {
    ov = kind;
    pl.dataset.ov = kind === 'saving' ? 'done' : kind;
    pov.hidden = kind === 'none';
    pov.className = 'pov ' + kind;
    const play = (aria) => `<button type="button" class="big" data-a="play" aria-label="${esc(aria)}">${I.play(28)}</button>`;
    if (kind === 'idle') pov.innerHTML = play(T('video.play'));
    else if (kind === 'bg') pov.innerHTML = play(T('video.resume')) + `<p>${esc(T('video.bgPaused'))}</p>`;
    else if (kind === 'done') pov.innerHTML = `<button type="button" class="big green" data-a="replay" aria-label="${esc(T('video.replay'))}">${I.check(28, 2.75, '#fff')}</button><p class="b">${esc(T('video.done'))}</p>`;
    else if (kind === 'saving') pov.innerHTML = `<span class="spin" aria-hidden="true" style="margin:0;border-color:rgba(255,255,255,.3);border-top-color:#fff"></span><p class="b">${esc(T('video.saving'))}</p>`;
    else if (kind === 'err') pov.innerHTML = `<p class="b">${esc(T('video.error'))}</p><button type="button" class="btn ghost sm" data-a="retry" style="width:auto;padding:0 20px;height:44px">${esc(T('common.retry'))}</button>`;
    else pov.innerHTML = '';
    // Ein offener Vorspul-Hinweis würde sonst über Pause-/Fertig-Overlay liegen und mit ihnen überlappen.
    if (kind !== 'none') { clearTimeout(toastT); ptoast.hidden = true; }
    updateHint(); updateUI();
    const f = $('button', pov); if (f && kind !== 'none' && document.activeElement === pbtn) f.focus({ preventScroll: true });
  }
  function setPbtn(playing) {
    pbtn.innerHTML = playing ? I.pause(24) : I.play(24);
    pbtn.classList.toggle('paused', !playing);
    pbtn.setAttribute('aria-label', playing ? T('video.pause') : T('video.resume'));
  }
  function updateHint() {
    if (done) { vhint.innerHTML = ''; vhint.setAttribute('aria-hidden', 'true'); return; }
    vhint.removeAttribute('aria-hidden');
    vhint.innerHTML = ov === 'bg' ? `${I.info(15)}${esc(T('video.bgInfo'))}` : `${I.lock(15, 2)}${esc(T('video.lockHint'))}`;
  }
  function updateFoot(force) {
    const rem = Math.ceil(Math.max(0, dur - maxPos));
    if (!force && rem === lastFootSec) return;
    lastFootSec = rem;
    if (done) {
      qbtn.disabled = false; qbtn.classList.remove('off');
      qbtn.textContent = n === 0 ? T('video.toNext') : T('video.toQuiz');
      qinfo.textContent = n === 0 ? (next ? T('video.nextInfo', { title: next.title }) : T('video.introDone')) : T('video.quizInfo');
    } else {
      qbtn.disabled = true;
      qbtn.textContent = n === 0 ? T('video.toNext') : T('video.toQuiz');
      qinfo.textContent = T('video.freeAfter', { t: fmt(rem) });
    }
  }
  function updateUI() {
    if (dragging) return;
    const cur = vid.currentTime || 0;
    const full = ov === 'done' || ov === 'saving';
    const f = full ? 1 : Math.min(1, cur / dur);
    pfill.style.width = f * 100 + '%';
    pthumb.style.left = f * 100 + '%';
    tcur.textContent = fmt(full ? dur : cur);
    const mf = Math.min(1, maxPos / dur);
    ptick.style.left = mf * 100 + '%';
    pseek.classList.toggle('showtick', !done && maxPos - cur > 2);
    pthumb.setAttribute('aria-valuenow', String(Math.round(cur)));
    pthumb.setAttribute('aria-valuetext', T('video.positionText', { t: fmt(cur) }));
  }
  function flashThumb(ms = 2800) {
    pseek.classList.add('showthumb');
    clearTimeout(thumbT);
    thumbT = setTimeout(() => { if (!dragging) pseek.classList.remove('showthumb'); }, ms);
  }
  function lockToast() {
    ptoast.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(() => { ptoast.hidden = true; }, 2600);
    flashThumb(3200);
  }

  /* ---- Heartbeat ---- */
  async function beat(final) {
    if (!alive && !final) return null;
    if (done && !final) return null;
    const pos = Math.max(0, vid.currentTime || 0);
    if (!(pos > 0) && !final) return null;
    try {
      const r = await api('/api/progress', { module: n, pos }, { keepalive: !!final });
      offlineShown = false;
      if (alive && r && typeof r.maxPos === 'number') { maxPos = r.maxPos; updateFoot(); updateUI(); }
      return r;
    } catch (e) {
      if (!alive) return null;
      if (e.status === 401) { goAuth(T('login.expired')); return null; }
      if (e.status === 403) { vid.pause(); viewLockedModule(); return null; }
      if (e.offline && !offlineShown) { offlineShown = true; toast(T('err.offline')); }
      return null;
    }
  }
  function startTimer() { clearInterval(timer); timer = setInterval(() => beat(false), 5000); }
  function stopTimer() { clearInterval(timer); timer = 0; }

  function markDone() {
    done = true; maxPos = dur; m.completed = true; m.maxPos = dur;
    stopTimer();
    setOv('done'); updateFoot(true);
    ensureMe(true).catch(() => {});
  }
  async function checkFinished() {
    setOv('saving');
    const r = await beat(true);
    if (!alive) return;
    if (r && r.completed) { savingTries = 0; markDone(); return; }
    // Der Server rechnet nur Meldungen im Abstand >= 2 s an: alle 3 s nachmelden, bis "completed" kommt.
    if (savingTries++ < 6) { setTimeout(() => { if (alive) checkFinished(); }, 3000); return; }
    savingTries = 0; setOv('idle'); toast(T('err.generic'));
  }

  /* ---- Wiedergabe ---- */
  function play() {
    bg = false;
    const p = vid.play();
    if (p && p.catch) p.catch(() => { if (alive) setOv(done ? 'done' : 'idle'); });
  }
  pov.addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]');
    if (!b) { if (ov === 'idle') play(); return; }
    if (b.dataset.a === 'play') play();
    else if (b.dataset.a === 'replay') { vid.currentTime = 0; lastT = 0; play(); }
    else if (b.dataset.a === 'retry') { setOv(done ? 'done' : 'idle'); vid.load(); }
  });
  pbtn.addEventListener('click', () => { if (vid.paused) play(); else vid.pause(); });
  vid.addEventListener('click', () => { if (ov === 'none') { if (vid.paused) play(); else vid.pause(); } });

  vid.addEventListener('play', () => { setOv('none'); setPbtn(true); startTimer(); });
  vid.addEventListener('playing', () => { setPbtn(true); });
  vid.addEventListener('pause', () => {
    if (vid.ended || !alive) return;
    stopTimer(); beat(false);
    if (bg) setOv('bg'); else { setOv('none'); setPbtn(false); }
  });
  vid.addEventListener('ended', () => { stopTimer(); if (!done) checkFinished(); else { setOv('done'); } });
  vid.addEventListener('error', () => { if (alive) { stopTimer(); setOv('err'); } });
  vid.addEventListener('ratechange', () => { if (vid.playbackRate !== 1) vid.playbackRate = 1; });
  vid.addEventListener('loadedmetadata', () => {
    if (!done && maxPos > 1) { try { vid.currentTime = Math.min(maxPos, Math.max(0, (vid.duration || dur) - 1)); } catch (e) { /* egal */ } }
    updateUI();
  });
  vid.addEventListener('seeking', () => {
    const t = vid.currentTime;
    if (t > maxPos + 1) { vid.currentTime = maxPos; lockToast(); }
    lastT = vid.currentTime; updateUI();
  });
  vid.addEventListener('timeupdate', () => {
    if (vid.playbackRate !== 1) vid.playbackRate = 1;
    const t = vid.currentTime;
    if (!vid.seeking && t > lastT && t - lastT < 2 && !vid.paused) maxPos = Math.max(maxPos, t);
    lastT = t;
    updateUI(); updateFoot();
  });

  /* ---- Seek-Leiste (Zurückspulen ja, Vorspulen über maxPos nein) ---- */
  const fracAt = (e) => { const r = pseek.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / (r.width || 1))); };
  const preview = (e) => {
    dragT = fracAt(e) * dur;
    const shown = Math.min(dragT, maxPos);
    pfill.style.width = (shown / dur) * 100 + '%'; pthumb.style.left = (shown / dur) * 100 + '%';
    tcur.textContent = fmt(shown);
  };
  pseek.addEventListener('pointerdown', (e) => {
    if (ov === 'bg' || ov === 'done' || ov === 'err') return;
    dragging = true; try { pseek.setPointerCapture(e.pointerId); } catch (x) { /* egal */ }
    pseek.classList.add('showthumb'); preview(e);
  });
  pseek.addEventListener('pointermove', (e) => { if (dragging) preview(e); });
  const endDrag = (e, commit) => {
    if (!dragging) return;
    dragging = false;
    if (commit) {
      const target = Math.min(dragT, Math.max(0, (vid.duration || dur) - 0.05));
      if (target > maxPos + 1) lockToast();
      vid.currentTime = target > maxPos + 1 ? maxPos : target;
    }
    flashThumb(1800); updateUI();
  };
  pseek.addEventListener('pointerup', (e) => endDrag(e, true));
  pseek.addEventListener('pointercancel', (e) => endDrag(e, false));
  pthumb.addEventListener('keydown', (e) => {
    const cur = vid.currentTime || 0;
    let target = null;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') target = Math.max(0, cur - 10);
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') target = cur + 10;
    else if (e.key === 'PageDown') target = Math.max(0, cur - 30);
    else if (e.key === 'PageUp') target = cur + 30;
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = dur;
    if (target === null) return;
    e.preventDefault(); e.stopPropagation();
    if (target > maxPos + 1) { lockToast(); target = maxPos; }
    vid.currentTime = target; flashThumb();
  });

  // Tastatur: Pfeil rechts & Co. blockieren, Leertaste = Play/Pause
  listen(document, 'keydown', (e) => {
    const tg = e.target;
    if (tg === pthumb) return;
    const onPage = tg === document.body || tg === vid || tg === pl;
    if (!onPage) return;
    if (['ArrowRight', 'End', 'PageUp', 'l', 'L'].includes(e.key)) { e.preventDefault(); lockToast(); }
    else if (e.key === ' ' && ov === 'none') { e.preventDefault(); if (vid.paused) play(); else vid.pause(); }
  });

  /* ---- Hintergrund: pausieren + Overlay ---- */
  listen(document, 'visibilitychange', () => {
    if (!document.hidden) return;
    if (!vid.paused && !vid.ended) { bg = true; vid.pause(); } else beat(false);
  });
  listen(window, 'pagehide', () => { beat(true); });

  /* ---- Vollbild ---- */
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  el('pfs').addEventListener('click', () => {
    if (fsEl()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    if (pl.requestFullscreen) pl.requestFullscreen().catch(() => {});
    else if (pl.webkitRequestFullscreen) pl.webkitRequestFullscreen();
    else if (vid.webkitEnterFullscreen) vid.webkitEnterFullscreen();
  });
  const onFs = () => {
    const on = !!fsEl();
    el('pfs').innerHTML = on ? I.fsExit() : I.fs();
    el('pfs').setAttribute('aria-label', on ? T('video.exitFullscreen') : T('video.fullscreen'));
  };
  listen(document, 'fullscreenchange', onFs);
  listen(document, 'webkitfullscreenchange', onFs);

  /* ---- Navigation ---- */
  el('vback').addEventListener('click', backToTab);
  qbtn.addEventListener('click', () => {
    if (!done) return;
    if (n === 0) location.hash = next ? '#/video/' + next.n : '#/start';
    else location.hash = '#/quiz/' + n;
  });

  onTeardown(() => {
    if (!done && (vid.currentTime || 0) > 0) beat(true);
    alive = false; stopTimer(); clearTimeout(toastT); clearTimeout(thumbT);
    m.maxPos = Math.max(m.maxPos || 0, maxPos);
    try { vid.pause(); vid.removeAttribute('src'); vid.load(); } catch (e) { /* egal */ }
    if (fsEl()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) { /* egal */ } }
  });

  setPbtn(false);
  setOv(done ? 'done' : 'idle');
  updateFoot(true); updateUI();
}

/* ====================================================================
   Nachschlagen: geschaffte Videos suchen und frei ansehen (ohne Fortschritts-Tracking)
   ==================================================================== */
// Suchtext vereinheitlichen: klein, ohne Akzente, Umlaute/ß tolerant (ä = a = ae, ß = ss = s).
const fold = (x) => String(x ?? '').toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/ae|oe|ue/g, (m) => m[0]).replace(/ss/g, 's');

function refMatches(m, q) {
  const words = fold(q).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = fold([m.title].concat(Array.isArray(m.points) ? m.points : []).join(' \n '));
  return words.every((w) => hay.includes(w));
}

function refItems(me, q) {
  const list = me.modules.filter((m) => m.completed);
  if (!list.length) return `<p class="refnone">${esc(T('ref.empty'))}</p>`;
  const hits = list.filter((m) => refMatches(m, q));
  if (!hits.length) return `<p class="refnone" role="status">${esc(T('ref.none'))}</p>`;
  return hits.map((m) => `<a class="refitem" href="#/nachschlagen/${m.n}" aria-label="${esc(T('ref.open') + ': ' + m.title)}"><span class="n">${nn(m.n)}</span><span class="b"><span class="t">${esc(m.title)}</span>${Array.isArray(m.points) && m.points.length ? `<ul>${m.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}</span>${I.chevR()}</a>`).join('');
}

function buildRef(me) {
  return {
    html: `<div class="screen"><div class="scroll top18">
      <h1 class="h-page">${esc(T('ref.title'))}</h1>
      <p class="meta" style="margin-top:2px">${esc(T('ref.sub'))}</p>
      <label class="refsearch"><span class="vh">${esc(T('ref.search'))}</span><input id="refq" type="search" enterkeyhint="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="${esc(T('ref.searchPh'))}" value="${esc(S.refQ)}"></label>
      <div class="reflist" id="reflist">${refItems(me, S.refQ)}</div>
    </div></div>`,
    bind(root) {
      const input = $('#refq', root); const host = $('#reflist', root);
      input.addEventListener('input', () => { S.refQ = input.value; host.innerHTML = refItems(S.me || me, S.refQ); });
    },
  };
}

// Kapitel (optional): /assets/chapters.json = { "1": [{ t, de, sq }, ...], ... }. Fehlt die Datei oder ist sie kaputt -> keine Kapitel.
let chaptersP = null;
function loadChapters() {
  if (!chaptersP) {
    chaptersP = fetch('/assets/chapters.json', { credentials: 'same-origin', cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : {}))
      .then((j) => (j && typeof j === 'object' && !Array.isArray(j) ? j : {}))
      .catch(() => { chaptersP = null; return {}; });
  }
  return chaptersP;
}

async function viewRef(n, ok) {
  if (!Number.isInteger(n) || n < 0) { location.hash = '#/nachschlagen'; return; }
  paintLoading();
  const [me, allCh] = await Promise.all([ensureMe(true), loadChapters()]);
  if (!ok()) return;
  const m = me.modules.find((x) => x.n === n);
  if (!m || !m.completed) { location.hash = '#/nachschlagen'; return; }
  S.lastTab = 'ref';

  const src = `/videos/M${nn(n)}_${S.lang.toUpperCase()}.mp4`;
  const label = n === 0 ? T('video.titleIntro') : T('video.title', { nn: nn(n) });
  const points = Array.isArray(m.points) ? m.points : [];
  const chaps = (Array.isArray(allCh[String(n)]) ? allCh[String(n)] : [])
    .filter((c) => c && Number.isFinite(Number(c.t)))
    .map((c) => ({ t: Math.max(0, Number(c.t)), title: String(c[S.lang] || c.de || c.sq || '') }))
    .filter((c) => c.title)
    .sort((a, b) => a.t - b.t);

  paint(`<div class="screen">
    <div class="vtop"><a class="iconbtn" href="#/nachschlagen" aria-label="${esc(T('common.back'))}">${I.back()}</a><span class="tt">${esc(label)}</span><span></span></div>
    <div class="player ref"><video id="rvid" controls playsinline preload="metadata" controlslist="nodownload noremoteplayback" disablepictureinpicture disableremoteplayback src="${esc(src)}"></video></div>
    <p class="hint" id="rerr" role="alert" style="padding:12px 24px 0" hidden>${esc(T('video.error'))}</p>
    <div class="scroll vbody">
      <h1 class="h-mod">${esc(m.title)}</h1>
      ${chaps.length ? `<h2>${esc(T('ref.chapters'))}</h2><div class="chaps">${chaps.map((c, i) => `<button type="button" class="chap" data-i="${i}" aria-label="${esc(T('ref.chapterAria', { t: fmt(c.t), title: c.title }))}"><span class="tm">${fmt(c.t)}</span><span class="ct">${esc(c.title)}</span></button>`).join('')}</div>` : ''}
      ${points.length ? `<h2>${esc(T('video.keyPoints'))}</h2><ol class="points">${points.map((p, i) => `<li><span class="i">${i + 1}</span><p>${esc(p)}</p></li>`).join('')}</ol>` : ''}
    </div>
  </div>`, { key: 'ref', focus: false });

  const vid = document.getElementById('rvid');
  vid.addEventListener('contextmenu', (e) => e.preventDefault());
  vid.addEventListener('error', () => { const e = document.getElementById('rerr'); if (e) e.hidden = false; });
  const btns = $$('.chap');
  const markActive = () => {
    const t = vid.currentTime || 0; let cur = -1;
    chaps.forEach((c, i) => { if (c.t <= t + 0.25) cur = i; });
    btns.forEach((b, i) => { if (i === cur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  };
  btns.forEach((b) => b.addEventListener('click', () => {
    vid.currentTime = chaps[Number(b.dataset.i)].t;
    const p = vid.play(); if (p && p.catch) p.catch(() => {});
    markActive();
  }));
  if (chaps.length) { vid.addEventListener('timeupdate', markActive); vid.addEventListener('seeked', markActive); }
  onTeardown(() => { try { vid.pause(); vid.removeAttribute('src'); vid.load(); } catch (e) { /* egal */ } });
}

/* ====================================================================
   Quiz (Screen 3 + Ergebnis 5)
   ==================================================================== */
async function viewQuiz(n, ok) {
  if (!Number.isInteger(n) || n < 1) { location.hash = '#/start'; return; }
  paintLoading();
  const me = await ensureMe(true);
  if (!ok()) return;
  const m = me.modules.find((x) => x.n === n);
  if (!m) { viewError('generic', null, { title: T('err.notFound') }); return; }
  if (!m.unlocked) { viewLockedModule(); return; }
  if (!m.completed) {
    paint(`<div class="screen"><div class="center"><div class="circ neutral">${I.lock(40, 1.75)}</div><h1>${esc(T('video.lockedTitle'))}</h1><p>${esc(T('quiz.notReady'))}</p>
      <a class="btn" href="#/video/${n}">${esc(T('quiz.toVideo'))}</a></div></div>`, { key: 'quizlocked' });
    return;
  }

  let data;
  try { data = await api('/api/quiz/' + n); }
  catch (e) {
    if (!ok()) return;
    if (e.status === 403) {
      paint(`<div class="screen"><div class="center"><div class="circ neutral">${I.lock(40, 1.75)}</div><h1>${esc(T('video.lockedTitle'))}</h1><p>${esc(e.message)}</p>
        <a class="btn" href="#/video/${n}">${esc(T('quiz.toVideo'))}</a></div></div>`, { key: 'quizlocked' });
      return;
    }
    throw e;
  }
  if (!ok()) return;
  const qs = (data.questions || []).map((q, qi) => ({
    q: q.q ?? q.text ?? '',
    idx: q.index ?? qi,
    a: (q.a || q.answers || []).map((x, i) => (typeof x === 'string' ? { id: i, text: x } : { id: x.id ?? i, text: x.text ?? x.t ?? x.a ?? x.label ?? '' })),
  }));
  const total = qs.length;
  const runId = data.runId; // serverseitiger Quiz-Lauf: je Frage genau eine Antwort, Auswertung über runId
  const answers = []; const checks = [];
  let i = 0; let picked = null; let result = null; let busy = false;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  function drawQ() {
    const q = qs[i];
    const chk = result;
    const pct = Math.round(((i + 1) / total) * 100);
    paint(`<div class="screen">
      <div class="qtop"><button type="button" class="iconbtn" id="qx" aria-label="${esc(T('quiz.leave'))}">${I.close()}</button><span class="step">${esc(T('quiz.question', { i: i + 1, n: total }))}</span></div>
      <div class="qbar"><div class="bar" role="img" aria-label="${esc(T('quiz.progressAria', { i: i + 1, n: total }))}"><i style="width:${pct}%"></i></div></div>
      <div class="scroll qbody">
        <h1 class="h-q">${esc(q.q)}</h1>
        <div class="opts" role="group" aria-label="${esc(q.q)}">${q.a.map((a, k) => {
          let cls = ''; let icon = ''; let sr = '';
          if (chk) {
            if (a.id === chk.correctId) { cls = ' right'; icon = I.check(24, 2.5, '#1b7a43'); sr = T('quiz.correct'); }
            else if (a.id === picked) { cls = ' bad'; icon = I.x(24, 2.5, '#d6001c'); sr = T('quiz.wrong'); }
          } else if (a.id === picked) cls = ' sel';
          return `<button type="button" class="opt${cls}" data-id="${a.id}" aria-pressed="${a.id === picked}"${chk || busy ? ' disabled' : ''}><span class="l">${letters[k] || ''}</span><span class="x">${esc(a.text)}</span>${icon}${sr ? `<span class="vh">${esc(sr)}</span>` : ''}</button>`;
        }).join('')}</div>
        <p class="feedback" role="status" id="qfb">${chk ? `<b class="${chk.correct ? 'ok' : 'no'}">${esc(chk.correct ? T('quiz.correct') : T('quiz.wrong'))}</b> ${esc(chk.why || '')}` : ''}</p>
      </div>
      <div class="foot qfoot p24"><button type="button" class="btn" id="qnext" ${chk ? '' : 'hidden'}>${esc(i === total - 1 ? T('quiz.showResult') : T('quiz.next'))}</button></div>
    </div>`, { key: 'quiz', focus: false });
    $('#qx').addEventListener('click', () => { location.hash = '#/video/' + n; });
    $$('.opt').forEach((b) => b.addEventListener('click', () => choose(Number(b.dataset.id))));
    const nx = $('#qnext');
    nx.addEventListener('click', advance);
    if (chk) { nx.focus({ preventScroll: true }); }
  }

  async function choose(id) {
    if (busy || result) return;
    busy = true; picked = id; drawQ();
    try {
      const r = await api(`/api/quiz/${n}/check`, { runId, q: qs[i].idx, a: id });
      if (!ok()) return;
      result = r; checks[i] = r; answers[i] = id; busy = false; drawQ();
    } catch (e) {
      busy = false; picked = null;
      if (!ok()) return;
      if (e.status === 401) { goAuth(T('login.expired')); return; }
      drawQ(); toast(e.offline ? T('err.offline') : e.message);
    }
  }

  async function advance() {
    if (busy || !result) return;
    if (i < total - 1) { i++; picked = null; result = null; drawQ(); window.scrollTo(0, 0); return; }
    busy = true;
    const nx = $('#qnext'); nx.disabled = true; nx.textContent = T('quiz.checking');
    try {
      const res = await api(`/api/quiz/${n}/submit`, { runId });
      if (!ok()) return;
      try { await ensureMe(true); } catch (e) { /* Anzeige klappt auch ohne */ }
      drawResult(res);
    } catch (e) {
      busy = false;
      if (!ok()) return;
      if (e.status === 401) { goAuth(T('login.expired')); return; }
      nx.disabled = false; nx.textContent = T('quiz.showResult');
      toast(e.offline ? T('err.offline') : e.message);
    }
  }

  // Abschluss-Moment: Teil geschafft (Zertifikat ist durch dieses Quiz entstanden). Nur einmal pro Teil.
  function drawCelebration(res) {
    const k = res.certificate.part;
    const cur = S.me || me;
    const eid = cur.id != null ? cur.id : 'x';
    store.set(`mb_cel_${eid}_${k}`, '1');
    S.celebrated.add(`${eid}_${k}`);
    const last = k >= 3 || !res.unlockedNext;
    const mods = cur.modules.filter((x) => x.part === k).length;
    const nextN = res.unlockedNext ? res.unlockedNext.n : null;
    paint(`<div class="screen">
      <div class="scroll"><div class="cel">
        ${emblem(k, { mode: 'celebrate', size: 168 })}
        <div class="rise">
          <div class="eb">${esc(T('done.eyebrow', { k }))}</div>
          <h1>${esc(badgeName(k))}</h1>
          <p class="ct">${esc(T(last ? 'done.textAll' : 'done.text', { n: mods }))}</p>
          <div class="ccard" aria-hidden="true">
            <div class="t1">${esc(T('certs.pTitle'))}</div>
            <div class="t2">${esc(T('done.cardHead', { k }))}</div>
            <div class="t3">${esc(cur.first + ' ' + cur.last)}</div>
            <div class="t4"></div>
            <div class="t5"></div>
            <div class="t6">${esc(res.certificate.code)}</div>
          </div>
        </div>
      </div></div>
      <div class="foot p24 vfoot2">
        <a class="btn" href="#/zertifikate" id="rmain">${esc(T(last ? 'done.toCerts' : 'quiz.certView'))}</a>
        ${last ? '' : `<a class="linkbtn" href="#/video/${nextN}" id="rnext">${esc(T('done.next', { k: k + 1 }))}</a>`}
      </div>
    </div>`, { key: 'celebrate' });
    const main = $('#rmain');
    if (main) main.addEventListener('click', () => { S.scrollCert = k; });
  }

  function drawResult(res) {
    const passed = !!res.passed;
    if (passed && res.certificate) {
      const cur = S.me || me;
      const eid = cur.id != null ? cur.id : 'x';
      if (!store.get(`mb_cel_${eid}_${res.certificate.part}`) && !S.celebrated.has(`${eid}_${res.certificate.part}`)) { drawCelebration(res); return; }
    }
    const wrongIdx = qs.map((q, k) => k).filter((k) => (res.results ? res.results[k] === false : checks[k] && !checks[k].correct));
    let showWrong = false;
    const un = res.unlockedNext;
    const cert = res.certificate;
    const draw = () => {
      const unlocked = passed && un ? `<div class="rsep"></div><div class="unl">${I.unlock(28, 1.75)}<div><div class="a">${esc(T('quiz.unlocked', { n: nn(un.n) }))}</div><div class="b">${esc(un.title)}${un.duration ? ' · ' + esc(fmt(un.duration)) : ''}</div></div></div>` : '';
      const certRow = passed && cert ? `${un ? '' : '<div class="rsep"></div>'}<a class="unl" href="#/zertifikate">${I.award(28, 1.75)}<div><div class="a">${esc(T('quiz.certEarned', { k: cert.part }))}</div><div class="b">${esc(T('quiz.certView'))}</div></div></a>` : '';
      const allDone = passed && !un && !cert && !currentModule(S.me || me);
      const review = showWrong ? `<ul class="review">${wrongIdx.map((k) => {
        const q = qs[k]; const c = checks[k] || {};
        const mine = q.a.find((a) => a.id === answers[k]); const right = q.a.find((a) => a.id === c.correctId);
        return `<li><div class="q">${esc(q.q)}</div>
          <div class="a"><b>${esc(T('quiz.yourAnswer'))}:</b> <span class="no">${esc(mine ? mine.text : '–')}</span></div>
          <div class="a"><b>${esc(T('quiz.rightAnswer'))}:</b> <span class="ok">${esc(right ? right.text : '–')}</span></div>
          ${c.why ? `<div class="w">${esc(c.why)}</div>` : ''}</li>`;
      }).join('')}</ul>` : '';
      const nextLabel = un ? T('quiz.continue', { n: nn(un.n) }) : cert ? T('quiz.certView') : T('start.toCerts');
      paint(`<div class="screen">
        <div class="scroll"><div class="result">
          <div class="circ${passed ? '' : ' neutral'}">${passed ? I.check(52, 2.6) : svg(P.retry, { s: 44, sw: 2 })}</div>
          <h1>${esc(passed ? T('quiz.passed') : T('quiz.failed'))}</h1>
          <p class="sc">${esc(T('quiz.score', { s: res.score, n: total }))}</p>
          ${passed ? '' : `<p class="fh">${esc(T('quiz.failedHint'))}</p>`}
          ${wrongIdx.length ? `<button type="button" class="linkbtn" id="rwrong" aria-expanded="${showWrong}">${esc(showWrong ? T('quiz.hideWrong') : wrongIdx.length === 1 ? T('quiz.showWrongOne') : T('quiz.showWrongMany'))}</button>` : ''}
          ${review}
          <div style="width:100%">${unlocked}${certRow}${allDone ? `<div class="rsep"></div><div class="unl">${I.check(28, 2.2, '#1b7a43')}<div><div class="a">${esc(T('quiz.allDone'))}</div></div></div>` : ''}</div>
        </div></div>
        <div class="foot p24 vfoot2">
          ${passed
            ? `<a class="btn" href="${un ? '#/video/' + un.n : '#/zertifikate'}" id="rmain">${esc(nextLabel)}</a><a class="linkbtn" href="#/module">${esc(T('quiz.overview'))}</a>`
            : `<button type="button" class="btn" id="rretry">${esc(T('quiz.retry'))}</button><a class="linkbtn" href="#/video/${n}">${esc(T('quiz.rewatch'))}</a>`}
        </div>
      </div>`, { key: 'result', focus: !showWrong });
      const rw = $('#rwrong'); if (rw) rw.addEventListener('click', () => { showWrong = !showWrong; draw(); const b = $('#rwrong'); if (b) b.focus({ preventScroll: true }); });
      const rr = $('#rretry'); if (rr) rr.addEventListener('click', () => route());
    };
    draw();
  }

  drawQ();
}

/* ====================================================================
   Start
   ==================================================================== */
window.addEventListener('hashchange', route);
(async function boot() {
  const qp = new URLSearchParams(location.search);
  if (qp.get('mock')) {
    try { await import('./mock.js'); } catch (e) { console.error('mock.js fehlt', e); }
  }
  route();
})();
