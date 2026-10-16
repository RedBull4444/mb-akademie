/* M&B Akademie – Chef-Bereich (Vanilla JS, ES-Modul)
 * Status prüfen -> Ersteinrichtung / Login / App (Team, Mitarbeiter, Einstellungen, Vorführen).
 * Mit ?mock=1 läuft alles gegen assets/chef-mock.js (ohne Backend).
 */

/* ============================================================ Daten */
// Kopie von functions/_lib/content.js: [n, Teil, Dauer s, Titel DE, Titel SQ]
const MODS = [[0,1,39.5,"Einführung in die Schulungsreihe","Hyrje në serinë e trajnimeve"],[1,1,300,"Membran-Ausdehnungsgefäß (MAG) Heizung","Ena e zgjerimit me membranë (MAG) për ngrohje"],[2,1,339.4,"Trinkwasser-Ausdehnungsgefäß","Ena e zgjerimit për ujë të pijshëm"],[3,1,451.9,"Nachfülleinheit und Wasseraufbereitung","Njësia e rimbushjes dhe trajtimi i ujit"],[4,1,347.7,"Sicherheitsgruppe Heizung","Grupi i sigurisë së ngrohjes"],[5,1,407,"Sicherheitsgruppe Warmwasserspeicher","Grupi i sigurisë së depozitës së ujit të ngrohtë"],[6,1,440.3,"Schlammabscheider","Ndarësi i llumit"],[7,1,428.2,"Luftabscheider und Entlüfter","Ndarësi i ajrit dhe ajruesi"],[8,2,401.1,"Warmwasserspeicher anschließen","Lidhja e depozitës së ujit të ngrohtë"],[9,2,499.2,"Heizungsanlage anschließen","Lidhja e sistemit të ngrohjes"],[10,2,423.1,"Wärmepumpen-Hydraulik","Hidraulika e pompës së nxehtësisë"],[11,2,524.8,"Umwälzpumpe und Rückschlagventile","Pompa qarkulluese dhe valvulat e kundërkthimit"],[12,3,415.2,"Hydraulischer Abgleich","Balancimi hidraulik"],[13,3,393.6,"Mischerkreis","Qarku me përzierje"],[14,3,432.8,"Heizungswasser: Magnetit und VDI 2035","Uji i ngrohjes: magnetiti dhe VDI 2035"],[15,3,385.5,"Typische Montagefehler und Abschlusskontrolle","Gabimet tipike të montimit dhe kontrolli përfundimtar"]];
const PARTS = { 1: { de: 'Bauteile', sq: 'Pjesët' }, 2: { de: 'Anlage & Hydraulik', sq: 'Sistemi & hidraulika' }, 3: { de: 'Betrieb & Kontrolle', sq: 'Funksionimi & kontrolli' } };
const PASS = 4;            // Quiz bestanden ab 4 von 5
const INACTIVE_DAYS = 7;

/* ============================================================ Helfer */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad2 = n => String(n).padStart(2, '0');
const mq = window.matchMedia('(min-width: 900px)');
const isDesk = () => mq.matches;

const TZ = 'Europe/Berlin';
const fKey = new Intl.DateTimeFormat('sv-SE', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const fDate = new Intl.DateTimeFormat('de-DE', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' });
const fTime = new Intl.DateTimeFormat('de-DE', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
const toMs = v => (v == null || v === '' ? null : (typeof v === 'number' || /^\d+$/.test(String(v)) ? (Number(v) < 1e12 ? Number(v) * 1000 : Number(v)) : Date.parse(v)));
const dayNum = ms => { const [y, m, d] = fKey.format(ms).split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86400000); };
function daysAgo(ts) { const ms = toMs(ts); return ms == null ? null : dayNum(Date.now()) - dayNum(ms); }
function rel(ts) {
  const d = daysAgo(ts);
  if (d == null) return 'noch nie';
  if (d <= 0) return 'heute';
  if (d === 1) return 'gestern';
  return `vor ${d} Tagen`;
}
function relTime(ts) {
  const d = daysAgo(ts);
  if (d == null) return 'noch nie';
  if (d <= 0) return `heute ${fTime.format(toMs(ts))}`;
  if (d === 1) return `gestern ${fTime.format(toMs(ts))}`;
  return `vor ${d} Tagen`;
}
const fmtDate = ts => (toMs(ts) == null ? '' : fDate.format(toMs(ts)));
const fmtT = sec => { sec = Math.max(0, Math.round(sec)); return `${Math.floor(sec / 60)}:${pad2(sec % 60)}`; };
const fmtAvg = v => (v == null || isNaN(v) ? '–' : (Math.round(v * 10) / 10).toFixed(1).replace('.', ','));
// "Nicht aktiv": Definition kommt vom Server (Feld `inactive`: aktives, nicht fertiges Konto, >7 Tage ohne Aktivität).
// Nur ohne Server-Feld (Vorschau/Mock) wird lokal gerechnet.
const isInactive = e => { if (typeof e.inactive === 'boolean') return e.inactive; if (e.finished || e.active === false || e.active === 0) return false; const d = daysAgo(e.lastSeen); return d == null || d > INACTIVE_DAYS; };
const modTitle = (n, lang = 'de') => { const m = MODS.find(x => x[0] === n); return m ? (lang === 'sq' ? m[4] : m[3]) : `Modul ${pad2(n)}`; };

const I = {
  search: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  searchS: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  clock: (s = 20, c = 'currentColor') => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  check: (s = 22, c = '#1b7a43', w = 2.5, label = '') => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  lock: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="gesperrt"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  chevR: (s = 18) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>`,
  chevL: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  chevD: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  doc: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 14h6M9 17.5h4"/></svg>',
  download: (s = 24) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M5 20h14"/></svg>`,
  cockpit: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 20v-8M12 20V5M19 20v-5"/></svg>',
  team: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6"/><path d="M18 14a6.5 6.5 0 0 1 3.5 6"/></svg>',
  sliders: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3.5"/><path d="M10.5 9.5v5l4-2.5z"/></svg>'
};
const LOGO = (w, h) => `<img src="/assets/logo.webp" alt="M&amp;B Gebäudetechnik" width="${w}" height="${h}">`;

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
async function copyText(txt) {
  try { await navigator.clipboard.writeText(txt); return true; } catch (e) { /* Fallback */ }
  try {
    const ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0';
    document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (e) { return false; }
}
function loadScript(src) {
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Skript fehlt')); document.head.appendChild(s); });
}

/* ============================================================ API */
class ApiError extends Error { constructor(msg, status) { super(msg); this.status = status; } }
const MOCK = new URLSearchParams(location.search).has('mock');
let mockApi = null;
async function api(path, body, method) {
  const m = method || (body !== undefined ? 'POST' : 'GET');
  if (MOCK) {
    mockApi = mockApi || (await import('/assets/chef-mock.js')).default;
    return mockApi(path, m, body);
  }
  let res;
  try {
    res = await fetch('/api' + path, {
      method: m, credentials: 'same-origin', cache: 'no-store',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (e) { throw new ApiError('Keine Verbindung. Bitte später nochmal.', 0); }
  let data = null; try { data = await res.json(); } catch (e) { /* kein JSON */ }
  if (!res.ok) {
    const err = new ApiError((data && data.error) || `Fehler (${res.status})`, res.status);
    err.data = data;
    if (res.status === 401 && !/\/chef\/(login|setup|status)/.test(path)) { S.status = { setupNeeded: false, loggedIn: false }; render(); }
    throw err;
  }
  return data;
}
const errText = e => (e && e.message) || 'Etwas ist schiefgegangen.';

/* ============================================================ State */
const S = {
  status: null, team: null, settings: null,
  filter: 'all', lang: 'all', q: '', searchOpen: false,
  sel: null, details: {}, showAll: false, open: {},
  vlang: 'de', loadErr: '', cockpit: null, cockErr: ''
};

function parseRoute() {
  const h = (location.hash || '').replace(/^#\/?/, '').split('/');
  if (h[0] === 'mitarbeiter' && h[1]) return { v: 'emp', id: h[1] };
  if (h[0] === 'team') return { v: 'team' };
  if (h[0] === 'einstellungen') return { v: 'settings' };
  if (h[0] === 'vorfuehren') return { v: 'demo', n: h[1] != null && h[1] !== '' ? Number(h[1]) : null };
  return { v: 'cockpit' };
}
const go = h => { location.hash = h; };
const amOwner = () => !!(S.status && S.status.me && S.status.me.role === 'owner');

/* ============================================================ Start */
async function boot() {
  try { S.status = await api('/chef/status'); }
  catch (e) { S.status = null; S.loadErr = errText(e); }
  render();
}
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
mq.addEventListener('change', () => render());
boot();

/* ============================================================ Render-Wurzel */
function render() {
  const app = $('#app');
  if (app._h) { app.removeEventListener('click', app._h); app._h = null; }
  document.documentElement.lang = 'de';
  if (!S.status) {
    app.innerHTML = `<div class="authwrap">${LOGO(112, 42)}<h1 class="title">Chef-Bereich</h1><div class="err">${esc(S.loadErr || 'Lädt …')}</div><button class="btn btn-sec" id="retry">Nochmal versuchen</button></div>`;
    $('#retry').onclick = () => { S.loadErr = ''; boot(); };
    return;
  }
  if (S.status.setupNeeded) return renderSetup(app);
  if (!S.status.loggedIn) return renderLogin(app);
  const r = parseRoute();
  if (r.v === 'cockpit') return renderCockpit(app);
  if (r.v === 'team' || r.v === 'emp') return renderTeam(app, r);
  if (r.v === 'settings') return renderSettings(app);
  if (r.v === 'demo') return renderDemo(app, r);
}

/* ============================================================ Login / Einrichtung */
function renderLogin(app) {
  document.title = 'Anmelden · Chef-Bereich';
  app.innerHTML = `<main class="authwrap">${LOGO(112, 42)}
    <h1 class="title">Chef-Bereich</h1>
    <p class="hint">Bitte mit Benutzername und Passwort anmelden.</p>
    <form id="f" novalidate>
      <label class="field"><span>Benutzername</span><input name="username" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required></label>
      <label class="field"><span>Passwort</span><input name="password" type="password" autocomplete="current-password" required></label>
      <div id="e" role="alert"></div>
      <button class="btn btn-primary" type="submit">Anmelden</button>
    </form></main>`;
  const f = $('#f');
  if (isDesk()) f.username.focus();
  f.onsubmit = async ev => {
    ev.preventDefault();
    const btn = f.querySelector('button'); $('#e').innerHTML = '';
    if (!f.username.value.trim() || !f.password.value) { $('#e').innerHTML = '<div class="err">Bitte Benutzername und Passwort eingeben.</div>'; return; }
    btn.disabled = true; btn.textContent = 'Moment …';
    try {
      await api('/chef/login', { username: f.username.value.trim(), password: f.password.value });
      S.team = null; S.settings = null; S.details = {}; S.cockpit = null;
      await boot();
    } catch (e) {
      btn.disabled = false; btn.textContent = 'Anmelden';
      let t = errText(e);
      if (e.data && e.data.remaining != null && !/Versuch/.test(t)) t += ` Noch ${e.data.remaining} ${e.data.remaining === 1 ? 'Versuch' : 'Versuche'}.`;
      $('#e').innerHTML = `<div class="err">${esc(t)}</div>`;
    }
  };
}

function renderSetup(app) {
  document.title = 'Ersteinrichtung · Chef-Bereich';
  app.innerHTML = `<main class="authwrap">${LOGO(112, 42)}
    <h1 class="title">Ersteinrichtung</h1>
    <p class="hint">Hier legst du den ersten Zugang an. Danach wird auch der Firmencode für die Mitarbeiter erzeugt.</p>
    <form id="f" novalidate>
      <label class="field"><span>Einrichtungs-Code</span><input name="setupToken" autocomplete="off" autocapitalize="none" spellcheck="false" required><small>Den Code hast du vom Einrichter bekommen.</small></label>
      <label class="field"><span>Dein Name</span><input name="name" autocomplete="name" required></label>
      <label class="field"><span>Benutzername</span><input name="username" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required></label>
      <label class="field"><span>Passwort</span><input name="password" type="password" autocomplete="new-password" minlength="10" required><small>Mindestens 10 Zeichen.</small></label>
      <div id="e" role="alert"></div>
      <button class="btn btn-primary" type="submit">Einrichten</button>
    </form></main>`;
  const f = $('#f');
  if (isDesk()) f.setupToken.focus();
  f.onsubmit = async ev => {
    ev.preventDefault();
    const e = $('#e'); e.innerHTML = '';
    const v = { setupToken: f.setupToken.value.trim(), name: f.name.value.trim(), username: f.username.value.trim(), password: f.password.value };
    if (!v.setupToken || !v.name || !v.username || !v.password) { e.innerHTML = '<div class="err">Bitte alle Felder ausfüllen.</div>'; return; }
    if (v.password.length < 10) { e.innerHTML = '<div class="err">Das Passwort braucht mindestens 10 Zeichen.</div>'; return; }
    const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'Moment …';
    try {
      await api('/chef/setup', v);
      // evtl. direkt eingeloggt, sonst Login
      await boot();
      if (S.status && S.status.loggedIn) { go('#/einstellungen'); }
    } catch (er) {
      btn.disabled = false; btn.textContent = 'Einrichten';
      e.innerHTML = `<div class="err">${esc(errText(er))}</div>`;
    }
  };
}

/* ============================================================ Gemeinsamer Rahmen */
function shell(active, inner, opts = {}) {
  const me = (S.status && S.status.me) || {};
  const myName = me.name || me.username || '';
  const tabs = [['cockpit', '#/cockpit', 'Cockpit', I.cockpit], ['team', '#/team', 'Team', I.team], ['demo', '#/vorfuehren', 'Vorführen', I.play], ['settings', '#/einstellungen', 'Einstellungen', I.sliders]];
  if (isDesk()) {
    return `<div class="page">
      <header class="deskhead"><div class="l">${LOGO(86, 32)}<span class="sep" aria-hidden="true"></span><span class="tag">Chef-Bereich</span></div>
        <div class="r">${myName ? `<b>${esc(myName)}</b><span class="sep s" aria-hidden="true"></span>` : ''}<button id="logout">Abmelden</button></div></header>
      <nav class="desknav" aria-label="Chef-Bereich">${tabs.map(t => `<a href="${t[1]}" ${t[0] === active ? 'aria-current="page"' : ''}>${t[2]}</a>`).join('')}</nav>
      <main>${inner}</main></div>`;
  }
  return `<div class="page ${opts.actions ? 'with-actions' : ''}"><main>${inner}</main></div>
    ${opts.actions || ''}
    <nav class="tabbar" aria-label="Hauptnavigation">${tabs.map(t => `<a href="${t[1]}" ${t[0] === active ? 'aria-current="page"' : ''}>${t[3]}${t[2]}</a>`).join('')}</nav>`;
}
function bindShell() {
  const lo = $('#logout'); if (lo) lo.onclick = logout;
}
async function logout() {
  try { await api('/chef/logout', {}); } catch (e) { /* egal */ }
  S.status = { setupNeeded: false, loggedIn: false }; S.team = null; S.settings = null; S.details = {}; S.sel = null; S.cockpit = null;
  go('#/cockpit'); render();
}

/* ============================================================ Dialoge */
function modal(html) {
  const dlg = document.createElement('dialog');
  dlg.innerHTML = `<div class="box">${html}</div>`;
  document.body.appendChild(dlg);
  dlg.addEventListener('close', () => dlg.remove());
  dlg.addEventListener('click', ev => { if (ev.target === dlg) dlg.close(); });
  dlg.showModal();
  return dlg;
}
function confirmDlg({ title, text, ok = 'Ja', cancel = 'Abbrechen', danger = false }) {
  return new Promise(res => {
    const dlg = modal(`<h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ''}
      <div class="btns"><button class="btn btn-sec btn-sm" data-a="no">${esc(cancel)}</button><button class="btn ${danger ? 'btn-primary' : 'btn-primary'} btn-sm" data-a="yes">${esc(ok)}</button></div>`);
    let done = false;
    dlg.addEventListener('click', ev => { const b = ev.target.closest('[data-a]'); if (!b) return; done = true; res(b.dataset.a === 'yes'); dlg.close(); });
    dlg.addEventListener('close', () => { if (!done) res(false); });
    dlg.querySelector('[data-a="no"]').focus();
  });
}

/* ============================================================ Cockpit */
const WEEKDAY = new Intl.DateTimeFormat('de-DE', { timeZone: TZ, weekday: 'short' });
// Begrüßung nach Berliner Zeit: 4–10 Uhr Morgen, 11–17 Tag, sonst Abend
function greetingFor(date = new Date()) {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(date));
  return h >= 4 && h < 11 ? 'Guten Morgen' : h >= 11 && h < 18 ? 'Guten Tag' : 'Guten Abend';
}
const TIMES = { 3: 'dreimal', 4: 'viermal', 5: 'fünfmal' };

async function loadCockpit() {
  try { S.cockpit = await api('/chef/cockpit'); S.cockErr = ''; }
  catch (e) { if (!S.cockpit) S.cockErr = errText(e); }
}

function cockpitHtml(c) {
  const me = (S.status && S.status.me) || {};
  const first = String(me.name || me.username || '').trim().split(/\s+/)[0];
  const stand = fTime.format(toMs(c.asOf) || Date.now());
  const sub = c.registered === 0 ? `Noch niemand angemeldet · Stand heute ${stand}` : `${c.registered} ${c.registered === 1 ? 'Mitarbeiter' : 'Mitarbeiter'} · Stand heute ${stand}`;

  const kFinSub = c.finishedWeek > 0 ? `<div class="ks ok">+${c.finishedWeek} diese Woche</div>` : '<div class="ks">diese Woche niemand neu</div>';
  const kWorkSub = c.avgModule != null ? `<div class="ks">Ø Modul ${Math.round(c.avgModule)} von ${c.moduleTotal}</div>` : '<div class="ks">Niemand in Arbeit</div>';
  const kNewSub = c.notStarted > 0 ? '<a class="ks lnk" id="resend" href="#/einstellungen">Firmencode erneut schicken</a>' : '<div class="ks">Alle haben angefangen</div>';

  const parts = c.parts.map(p => {
    const pct = p.total ? Math.round((p.certified / p.total) * 100) : 0;
    return `<div class="pr"><div class="pt"><span>Teil ${p.k} · ${esc(p.title)}</span><span class="num">${p.certified} / ${p.total}</span></div>
      <div class="pbar" role="img" aria-label="${p.certified} von ${p.total} mit Zertifikat Teil ${p.k}"><i style="width:${pct}%"></i></div></div>`;
  }).join('');
  const stats = `<div class="pstats"><span><b class="num">${c.certificatesTotal}</b> ${c.certificatesTotal === 1 ? 'Zertifikat ausgestellt' : 'Zertifikate ausgestellt'}</span>
    <span>${c.firstTryRate == null ? 'Noch keine Quizze abgeschlossen' : `<b class="num">${c.firstTryRate} %</b> Quiz im 1. Versuch bestanden`}</span></div>`;

  const attn = c.attention.length ? c.attention.map(a => {
    const txt = a.kind === 'failed'
      ? `Quiz Modul ${a.module} ${TIMES[a.fails] || a.fails + '-mal'} nicht bestanden`
      : `seit ${a.days} Tagen nicht aktiv${a.module != null ? ` · Modul ${a.module}` : ''}`;
    return `<button class="rowbtn" data-emp="${esc(a.id)}"><span class="dot ${a.level}" aria-hidden="true"></span><span class="rb"><span class="rn">${esc(a.name)}</span><span class="rs">${esc(txt)}</span></span><span class="rc" aria-hidden="true">›</span></button>`;
  }).join('') + (c.attentionTotal > c.attention.length ? `<p class="more">+ ${c.attentionTotal - c.attention.length} weitere</p>` : '')
    : `<p class="none">${c.registered ? 'Gerade ist alles im grünen Bereich.' : 'Noch niemand angemeldet.'}</p>`;

  const certs = c.recentCerts.length ? c.recentCerts.map(r =>
    `<button class="line" data-emp="${esc(r.empId)}"><span class="ln">${esc(r.name)}</span><span class="lr">Teil ${r.part} · ${esc(WEEKDAY.format(toMs(r.issuedAt)).replace('.', ''))}</span></button>`).join('')
    : '<p class="none">Diese Woche noch keine neuen Zertifikate.</p>';

  const hard = c.hardest.length ? c.hardest.map(h =>
    `<div class="line"><span class="ln mid">Modul ${h.module} · ${esc(h.title)}</span><span class="lr pct ${h.wrongRate >= 30 ? 'hot' : ''} num">${h.wrongRate} %</span></div>`).join('')
    : '<p class="none">Noch keine Daten. Die Auswertung startet, sobald eine Frage mindestens 5 Antworten hat.</p>';

  return `<div class="cock">
    <div class="ck-head"><div class="tl"><h1 class="title">${esc(greetingFor())}${first ? ', ' + esc(first) : ''}</h1><p class="ck-sub">${esc(sub)}</p></div>
      <a class="btn btn-sec btn-d ex" href="/api/chef/export.csv" download>${I.download(20)}Monatsbericht herunterladen</a></div>
    <div class="kpis">
      <div class="kpi"><div class="kt"><div class="kl">Komplett fertig</div>${kFinSub}</div><div class="kn num">${c.finished}</div></div>
      <div class="kpi"><div class="kt"><div class="kl">In Arbeit</div>${kWorkSub}</div><div class="kn num">${c.inWork}</div></div>
      <div class="kpi ${c.notStarted > 0 ? 'warn' : ''}"><div class="kt"><div class="kl">Noch nicht gestartet</div>${kNewSub}</div><div class="kn num">${c.notStarted}</div></div>
    </div>
    <div class="ck-grid a">
      <section class="card" aria-labelledby="ck-h1"><h2 id="ck-h1">Fortschritt je Teil</h2>${parts}${stats}</section>
      <section class="card" aria-labelledby="ck-h2"><h2 id="ck-h2">Braucht Aufmerksamkeit</h2><div class="rows">${attn}</div></section>
    </div>
    <div class="ck-grid b">
      <section class="card" aria-labelledby="ck-h3"><h2 id="ck-h3">Neue Zertifikate diese Woche</h2><div class="lines">${certs}</div></section>
      <section class="card" aria-labelledby="ck-h4"><h2 id="ck-h4">Wo das Team noch unsicher ist</h2><p class="cs">Am häufigsten falsch beantwortete Quizfragen – gutes Thema für die Teamrunde.</p><div class="lines">${hard}</div></section>
    </div>
  </div>`;
}

function renderCockpit(app) {
  document.title = 'Cockpit · Chef-Bereich';
  const desk = isDesk();
  const paint = () => {
    let inner;
    if (S.cockpit) inner = cockpitHtml(S.cockpit);
    else inner = `<div class="cock"><div class="splash">${esc(S.cockErr || 'Lädt …')}</div>${S.cockErr ? '<div style="text-align:center"><button class="btn btn-sec btn-sm" id="ckRetry" style="display:inline-flex">Nochmal versuchen</button></div>' : ''}</div>`;
    app.innerHTML = shell('cockpit', (desk ? '' : `<div class="topbar m">${LOGO(75, 28)}<span class="where">Chef-Bereich</span></div>`) + inner);
    bindShell();
    const rt = $('#ckRetry'); if (rt) rt.onclick = () => { S.cockErr = ''; paint(); loadCockpit().then(done); };
    $$('[data-emp]').forEach(b => b.onclick = () => go('#/mitarbeiter/' + b.dataset.emp));
    const rs = $('#resend');
    if (rs) {
      const set = () => { if (S.settings && S.settings.companyCode) { rs.href = waLink(S.settings.companyCode); rs.target = '_blank'; rs.rel = 'noopener noreferrer'; } };
      if (S.settings) set(); else api('/chef/settings').then(x => { S.settings = x; set(); }).catch(() => { });
    }
  };
  const done = () => { if (parseRoute().v === 'cockpit') paint(); };
  paint();
  loadCockpit().then(done);
}

/* ============================================================ Team */
function empRows() {
  const all = (S.team && S.team.employees) || [];
  const q = S.q.trim().toLowerCase();
  return all.filter(e => {
    if (S.filter === 'inactive' && !isInactive(e)) return false;
    if (S.filter === 'finished' && !e.finished) return false;
    if (S.lang !== 'all' && e.lang !== S.lang) return false;
    if (q && !String(e.name).toLowerCase().includes(q)) return false;
    return true;
  }).sort((a, b) => String(a.name).localeCompare(String(b.name), 'de'));
}
function summaryParts() {
  const emps = (S.team && S.team.employees) || [];
  const s = (S.team && S.team.summary) || {};
  return {
    registered: s.registered ?? emps.length,
    cert1: s.cert1 ?? emps.filter(e => e.certs && e.certs[0]).length,
    finished: s.finished ?? emps.filter(e => e.finished).length,
    inactive: emps.filter(isInactive).length // gleiche Definition wie der Filter "Nicht aktiv"
  };
}

async function loadTeam() {
  try { S.team = await api('/chef/team'); S.loadErr = ''; }
  catch (e) { if (!S.team) S.loadErr = errText(e); }
}

function renderTeam(app, r) {
  document.title = 'Team · Chef-Bereich';
  const desk = isDesk();
  if (r.v === 'emp' && !desk) return renderEmpPage(app, r.id);
  if (r.v === 'emp' && desk) S.sel = String(r.id);
  const sm = summaryParts();

  if (desk) {
    app.innerHTML = shell('team', `
      <div class="dtitle">
        <div class="tl"><h1 class="title">Team</h1>
          <p id="sumline"></p></div>
        <div class="tr">
          <a class="btn btn-sec btn-d ex" href="/api/chef/export.csv" download>${I.download(20)}Liste exportieren</a>
          <a class="btn btn-primary btn-d" id="shareTop" href="#/einstellungen">Firmencode teilen</a>
        </div></div>
      <div class="dfilter">
        <label class="searchbox"><span class="ico">${I.searchS}</span><input id="q" type="search" placeholder="Mitarbeiter suchen" aria-label="Mitarbeiter suchen" value="${esc(S.q)}" autocomplete="off"></label>
        <div class="grp" role="group" aria-label="Filter">${filterBtns()}</div>
        <div class="sel"><select id="langSel" aria-label="Sprache filtern"><option value="all">Alle Sprachen</option><option value="de">Deutsch</option><option value="sq">Albanisch</option></select>${I.chevD}</div>
      </div>
      <div class="split"><section aria-label="Mitarbeiter"><div class="tbl-wrap"><table class="team"><caption class="sr">Fortschritt aller Mitarbeiter</caption>
        <colgroup><col><col style="width:72px"><col style="width:130px"><col style="width:104px"><col style="width:96px"><col style="width:60px"><col style="width:118px"><col style="width:32px"></colgroup>
        <thead><tr><th scope="col">Name</th><th scope="col">Sprache</th><th scope="col">Fortschritt</th><th scope="col">Aktuell</th><th scope="col">Zertifikate</th><th scope="col">Ø Quiz</th><th scope="col">Zuletzt aktiv</th><th scope="col"><span class="sr">Details</span></th></tr></thead>
        <tbody id="rows"></tbody></table></div><p class="tcount" id="tcount"></p></section>
        <aside id="detail" aria-label="Details"></aside></div>`);
    bindShell();
    $('#langSel').value = S.lang;
    bindTeamControls();
    paintSummary(); paintRows(); paintShareTop();
    if (!S.team) loadTeam().then(() => { if (parseRoute().v === 'team' || parseRoute().v === 'emp') { paintSummary(); paintRows(); } });
    else loadTeam().then(() => { paintSummary(); paintRows(); });
    return;
  }

  // Handy
  app.innerHTML = shell('team', `
    <div class="topbar m">${LOGO(75, 28)}<span class="where">Chef-Bereich</span></div>
    <div class="team-head"><h1 class="title">Team</h1><button class="iconbtn" id="searchToggle" aria-label="Mitarbeiter suchen" aria-expanded="${S.searchOpen}" style="margin-right:-10px">${I.search}</button></div>
    <p class="team-sub" id="sumline"></p>
    <div id="notice"></div>
    <label class="searchbox" id="searchRow" ${S.searchOpen || S.q ? '' : 'hidden'}><span class="ico">${I.searchS}</span><input id="q" type="search" placeholder="Mitarbeiter suchen" aria-label="Mitarbeiter suchen" value="${esc(S.q)}" autocomplete="off"></label>
    <div class="filters" role="group" aria-label="Filter">${filterBtns()}</div>
    <div id="rows"></div>`);
  bindShell();
  bindTeamControls();
  paintSummary(); paintRows();
  loadTeam().then(() => { paintSummary(); paintRows(); });
}

function filterBtns() {
  return [['all', 'Alle'], ['inactive', 'Nicht aktiv'], ['finished', 'Fertig']]
    .map(f => `<button data-filter="${f[0]}" aria-pressed="${S.filter === f[0]}">${f[1]}</button>`).join('');
}

function bindTeamControls() {
  $$('[data-filter]').forEach(b => b.onclick = () => { S.filter = b.dataset.filter; $$('[data-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); paintRows(); });
  const q = $('#q'); if (q) q.oninput = () => { S.q = q.value; paintRows(); };
  const ls = $('#langSel'); if (ls) ls.onchange = () => { S.lang = ls.value; paintRows(); };
  const st = $('#searchToggle');
  if (st) st.onclick = () => {
    S.searchOpen = !S.searchOpen; st.setAttribute('aria-expanded', String(S.searchOpen));
    const row = $('#searchRow'); row.hidden = !S.searchOpen && !S.q;
    if (S.searchOpen) $('#q').focus(); else { S.q = ''; $('#q').value = ''; paintRows(); }
  };
}

function paintSummary() {
  const sm = summaryParts();
  const base = `${sm.registered} angemeldet · ${sm.cert1} mit Zertifikat Teil 1 · ${sm.finished} fertig`;
  const el = $('#sumline'); if (!el) return;
  if (!S.team) { el.textContent = S.loadErr || 'Lädt …'; return; }
  if (isDesk()) {
    el.innerHTML = `<span>${esc(base)}${sm.inactive ? ' ·' : ''}</span>${sm.inactive ? `<span class="warn">${I.clock(16)}${sm.inactive} seit über ${INACTIVE_DAYS} Tagen nicht aktiv</span>` : ''}`;
  } else {
    el.textContent = base;
    const n = $('#notice'); if (!n) return; // Ansicht wurde zwischenzeitlich gewechselt (Fenstergröße)
    n.innerHTML = sm.inactive && S.filter !== 'inactive'
      ? `<div class="notice">${I.clock(20, '#5b6570')}<span>${sm.inactive} seit über ${INACTIVE_DAYS} Tagen nicht aktiv</span><button id="showInactive">Anzeigen</button></div>` : '';
    const b = $('#showInactive');
    if (b) b.onclick = () => { S.filter = 'inactive'; $$('[data-filter]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.filter === 'inactive'))); paintSummary(); paintRows(); };
  }
}

function paintShareTop() {
  const a = $('#shareTop'); if (!a) return;
  const set = () => { if (S.settings && S.settings.companyCode) { a.href = waLink(S.settings.companyCode); a.target = '_blank'; a.rel = 'noopener noreferrer'; } };
  if (S.settings) set(); else api('/chef/settings').then(s => { S.settings = s; set(); }).catch(() => { });
}

function emptyText() {
  if (!S.team) return S.loadErr || 'Lädt …';
  if (S.q.trim()) return 'Niemand gefunden.';
  if (S.filter === 'inactive') return 'Alle sind aktiv. Gut so.';
  if (S.filter === 'finished') return 'Noch niemand ist fertig.';
  return 'Noch niemand angemeldet.';
}

function paintRows() {
  const rows = empRows();
  const host = $('#rows'); if (!host) return;
  const desk = isDesk();
  if (desk) {
    if (rows.length && (S.sel == null || !rows.some(e => String(e.id) === String(S.sel)))) S.sel = String(rows[0].id);
    host.innerHTML = rows.length ? rows.map(e => deskRow(e)).join('') : `<tr><td colspan="8"><div class="empty">${esc(emptyText())}</div></td></tr>`;
    const total = (S.team && S.team.employees.length) || 0;
    $('#tcount').textContent = S.team ? `${rows.length} von ${total} Mitarbeitern` : '';
    host.onclick = ev => { const tr = ev.target.closest('tr[data-id]'); if (tr) { S.sel = tr.dataset.id; paintRows(); } };
    paintDetail();
  } else {
    host.innerHTML = rows.length ? rows.map(e => mobRow(e)).join('') : `<div class="empty">${esc(emptyText())}</div>`;
    host.onclick = ev => { const b = ev.target.closest('[data-id]'); if (b) go('#/mitarbeiter/' + b.dataset.id); };
  }
}

function currentText(e) {
  if (e.finished) return 'Fertig';
  if (!e.done && e.started === false) return 'Noch nicht gestartet';
  if (!e.done && e.started == null) return 'Noch nicht gestartet';
  return e.current ? `Modul ${pad2(e.current.n)}` : '–';
}
function mobRow(e) {
  const total = e.total || 16, pct = Math.min(100, Math.round((e.done / total) * 100));
  const inact = isInactive(e);
  const t = `${currentText(e)} · ${inact ? I.clock(14, '#7a848e') : ''}${rel(e.lastSeen)}`;
  return `<button class="row" data-id="${esc(e.id)}"><span class="main"><span class="nm">${esc(e.name)}</span>
    <span class="sb ${inact ? 'act' : ''}">${e.active === false || e.active === 0 ? '<span class="pill">Gesperrt</span>' : ''}${t}</span></span>
    ${e.finished ? I.check(22, '#1b7a43', 2.5, 'Alle Videos erledigt')
      : `<span class="mini" role="img" aria-label="${e.done} von ${total} Videos"><b>${e.done}/${total}</b><i>${pct ? `<s style="width:${pct}%"></s>` : ''}</i></span>`}</button>`;
}
function deskRow(e) {
  const total = e.total || 16, pct = Math.min(100, Math.round((e.done / total) * 100));
  const inact = isInactive(e), sel = String(e.id) === String(S.sel);
  const certs = [0, 1, 2].map(i => (e.certs && e.certs[i]) ? `<span class="ok">${I.check(14, 'currentColor', 3)}</span>` : `<span>T${i + 1}</span>`).join('');
  return `<tr data-id="${esc(e.id)}" ${sel ? 'aria-current="true"' : ''}>
    <td><button class="nmb" aria-pressed="${sel}">${esc(e.name)}</button></td>
    <td><span class="lg">${esc(String(e.lang || '').toUpperCase())}</span></td>
    <td><div class="pg ${e.finished ? 'ok' : ''}" role="img" aria-label="${e.done} von ${total} Videos"><i>${pct ? `<s style="width:${pct}%"></s>` : ''}</i><b>${e.done}/${total}</b></div></td>
    <td>${e.finished ? `<span class="fin">${I.check(16, 'currentColor', 2.5)}<span>Fertig</span></span>` : `<span style="${e.done ? '' : 'color:#5b6570'}">${esc(currentText(e))}</span>`}</td>
    <td><div class="certs" role="img" aria-label="Zertifikate">${certs}</div></td>
    <td><span class="qz">${fmtAvg(e.quizAvg)}</span></td>
    <td><span class="ls">${inact ? I.clock(16, '#7a848e') : ''}${esc(rel(e.lastSeen))}${e.active === false || e.active === 0 ? ' · gesperrt' : ''}</span></td>
    <td><span class="chev">${I.chevR()}</span></td></tr>`;
}

/* ============================================================ Mitarbeiter-Detail */
async function loadDetail(id, force) {
  id = String(id);
  if (!force && S.details[id]) return S.details[id];
  const raw = await api('/chef/employee/' + encodeURIComponent(id));
  const d = normEmp(raw, id);
  S.details[id] = d;
  return d;
}
function normEmp(raw, id) {
  const e = raw.employee || raw;
  const mods = (raw.modules || e.modules || []).map(m => ({ ...m }));
  mods.sort((a, b) => a.n - b.n);
  mods.forEach((m, i) => {
    m.passed = m.n === 0 || (m.quizBest != null && m.quizBest >= PASS);
    m.done = !!m.completed && m.passed;
  });
  mods.forEach((m, i) => { if (m.unlocked == null) m.unlocked = i === 0 || mods[i - 1].done; });
  const certs = (raw.certificates || e.certificates || []).map(c => ({ part: Number(c.part), code: c.code, issuedAt: c.issuedAt ?? c.issued_at }));
  return {
    id: e.id ?? id,
    name: e.name || [e.first, e.last].filter(Boolean).join(' '),
    lang: e.lang || 'de',
    createdAt: e.createdAt ?? e.created_at ?? null,
    lastSeen: e.lastSeen ?? e.last_seen ?? null,
    active: !(e.active === false || e.active === 0),
    modules: mods, certificates: certs
  };
}

function paintDetail() {
  const host = $('#detail'); if (!host) return;
  if (S.sel == null) { host.innerHTML = '<div class="empty">Mitarbeiter wählen.</div>'; return; }
  const id = String(S.sel), d = S.details[id];
  if (d) { host.innerHTML = detailHtml(d, true); bindDetail(host, d); return; }
  host.innerHTML = '<div class="empty">Lädt …</div>';
  loadDetail(id).then(() => { if (String(S.sel) === id) paintDetail(); })
    .catch(e => { if (String(S.sel) === id) host.innerHTML = `<div class="empty">${esc(errText(e))}</div>`; });
}

function renderEmpPage(app, id) {
  document.title = 'Mitarbeiter · Chef-Bereich';
  const d = S.details[String(id)];
  const paint = dd => {
    app.innerHTML = shell('team', `<button class="backbtn" id="back" aria-label="Zurück zum Team">${I.chevL}Team</button><div id="detail">${detailHtml(dd, false)}</div>`, { actions: actionBar(dd) });
    $('#back').onclick = () => { if (history.length > 1) history.back(); else go('#/team'); };
    bindDetail(document, dd);
  };
  if (d) paint(d);
  else {
    app.innerHTML = shell('team', `<button class="backbtn" id="back">${I.chevL}Team</button><div class="splash">Lädt …</div>`);
    $('#back').onclick = () => go('#/team');
  }
  loadDetail(id, !!d).then(dd => { if (parseRoute().v === 'emp') paint(dd); })
    .catch(e => { if (!d) { app.innerHTML = shell('team', `<button class="backbtn" id="back">${I.chevL}Team</button><div class="empty">${esc(errText(e))}</div>`); $('#back').onclick = () => go('#/team'); } });
}

function actionBar(d) {
  return `<div class="actionbar"><div class="in"><button class="btn btn-sec btn-sm" data-act="reset">PIN zurücksetzen</button>
    <button class="btn btn-sec btn-sm ${d.active ? 'danger' : ''}" data-act="toggle">${d.active ? 'Sperren' : 'Entsperren'}</button></div></div>`;
}

function detailHtml(d, desk) {
  const mods = d.modules, total = mods.length || 16;
  const done = mods.filter(m => m.completed).length;
  const pct = Math.round((done / total) * 100);
  const finished = done === total && mods.every(m => m.done);
  const meta = `${d.lang === 'sq' ? 'Albanisch' : 'Deutsch'}${d.createdAt ? ` · angemeldet seit ${fmtDate(d.createdAt)}` : ''} · zuletzt ${relTime(d.lastSeen)}`;

  // Module: führende erledigte Module zusammenfassen
  let pre = 0; while (pre < mods.length && mods[pre].done) pre++;
  const collapsed = pre >= 2 && !S.open[d.id] && !S.showAll;
  const firstOpen = mods.findIndex(m => !m.done);
  const rowsHtml = [];
  const summary = () => {
    const quiz = mods.slice(0, pre).filter(m => m.n > 0 && m.quizBest != null);
    const avg = quiz.length ? quiz.reduce((a, m) => a + m.quizBest, 0) / quiz.length : null;
    const multi = mods.slice(0, pre).reduce((b, m) => ((m.attempts || 0) > (b ? b.attempts : 1) ? m : b), null);
    const sub = multi ? `Modul ${pad2(multi.n)} mit ${multi.attempts} Versuchen` : 'Alle Quizze im ersten Versuch bestanden';
    const label = `${pad2(mods[0].n)}–${pad2(mods[pre - 1].n)} erledigt`;
    return desk
      ? `<button class="item" data-open="1" aria-expanded="false">${I.check(20)}<span class="main"><span class="t1">${label}</span></span><span class="right">Ø ${fmtAvg(avg)}</span></button>`
      : `<button class="item" data-open="1" aria-expanded="false">${I.check(22, '#1b7a43', 2.5)}<span class="main"><span class="t1">${label} · Ø ${fmtAvg(avg)}</span><span class="t2">${esc(sub)}</span></span>${I.chevR()}</button>`;
  };
  const modRow = (m, idx) => {
    const num = pad2(m.n);
    const running = !m.completed && (m.maxPos || 0) > 0;
    const dur = (MODS.find(x => x[0] === m.n) || [])[2];
    let sub = '', right = '', cls = '', nocls = '';
    if (m.done) {
      sub = m.n > 0 && m.quizBest != null ? `Quiz ${m.quizBest}/5` : '';
      right = desk ? (sub ? `<span class="right">${sub}</span>` : I.check(18, '#1b7a43', 2.5, 'erledigt')) : I.check(22, '#1b7a43', 2.5, 'erledigt');
      if (desk) sub = '';
    } else if (m.completed) {
      sub = `Video fertig · Quiz offen${m.quizBest != null ? ` (bester Versuch ${m.quizBest}/5)` : ''}`;
      nocls = idx === firstOpen ? 'now' : '';
    } else if (running) {
      sub = `läuft · ${fmtT(m.maxPos)}${dur ? ` von ${fmtT(m.duration || dur)}` : ''}`;
      nocls = 'now';
    } else if (m.unlocked) {
      sub = 'Noch nicht gestartet'; nocls = 'now';
    } else { cls = 'locked'; right = I.lock; }
    const subCls = running ? 'on' : '';
    return `<div class="item ${cls}"><span class="no ${nocls}">${num}</span><span class="main"><span class="t1">${esc(modTitle(m.n))}</span>${sub ? `<span class="t2 ${subCls}">${esc(sub)}</span>` : ''}</span>${right}</div>`;
  };
  if (collapsed) { rowsHtml.push(summary()); for (let i = pre; i < mods.length; i++) rowsHtml.push(modRow(mods[i], i)); }
  else mods.forEach((m, i) => rowsHtml.push(modRow(m, i)));
  let visible = rowsHtml, more = '';
  if (desk && !S.showAll) {
    const lim = collapsed ? 4 : 5;
    if (rowsHtml.length > lim) { visible = rowsHtml.slice(0, lim); }
    more = `<button class="linkbtn" data-all="1">Alle ${total} Module anzeigen</button>`;
  } else if (desk && S.showAll) more = '<button class="linkbtn" data-all="0">Weniger anzeigen</button>';
  else if (!desk && pre >= 2 && !collapsed) more = '';

  const certs = d.certificates.length
    ? d.certificates.sort((a, b) => a.part - b.part).map(c => `<div class="item certrow"><span class="main"><span class="t1">Teil ${c.part} · ${esc((PARTS[c.part] || {}).de || '')}</span><span class="t2">${esc(fmtDate(c.issuedAt))} · ${esc(c.code)}</span></span>
        <button class="iconbtn doc" data-cert="${c.part}" aria-label="Zertifikat Teil ${c.part} als PDF herunterladen">${I.doc}</button></div>`).join('')
    : '<div class="item" style="min-height:52px"><span class="t2" style="margin:0">Noch kein Zertifikat.</span></div>';

  const name = esc(d.name);
  const flag = d.active ? '' : `<div class="flag">${I.lock}Konto gesperrt. Anmeldung ist nicht möglich.</div>`;
  const barCls = finished ? 'green' : 'red';
  const delBtn = amOwner() ? '<div class="delzone"><button class="btn btn-sec btn-sm danger" data-act="delete">Mitarbeiter löschen</button></div>' : '';
  if (desk) {
    return `<h2 class="dn">${name}</h2><p class="meta">${esc(meta)}</p>${flag}
      <div class="prog"><div class="t"><span>${done} von ${total} Videos</span><span>${pct} %</span></div><div class="bar ${barCls}" role="img" aria-label="Fortschritt ${pct} Prozent"><i style="width:${pct}%"></i></div></div>
      <h3 class="sec">Zertifikate</h3><div class="list">${certs}</div>
      <h3 class="sec m">Module</h3><div class="list">${visible.join('')}</div>${more}
      <div class="actions"><button class="btn btn-sec" data-act="reset">PIN zurücksetzen</button><button class="btn btn-sec ${d.active ? 'danger' : ''}" data-act="toggle">${d.active ? 'Sperren' : 'Entsperren'}</button></div>${delBtn}`;
  }
  return `<h1 class="title" style="margin-top:12px;overflow-wrap:anywhere">${name}</h1><p class="meta">${esc(meta)}</p>${flag}
    <div class="prog"><div class="t"><span>${done} von ${total} Videos</span></div><div class="bar ${finished ? 'green' : ''}" role="img" aria-label="Fortschritt ${done} von ${total} Videos"><i style="width:${pct}%"></i></div></div>
    <h2 class="sec">Zertifikate</h2><div class="list">${certs}</div>
    <h2 class="sec">Module</h2><div class="list">${visible.join('')}</div>${delBtn}`;
}

function bindDetail(root, d) {
  const act = ev => {
    const open = ev.target.closest('[data-open]');
    if (open) { S.open[d.id] = true; rerenderDetail(d); return; }
    const all = ev.target.closest('[data-all]');
    if (all) { S.showAll = all.dataset.all === '1'; rerenderDetail(d); return; }
    const cert = ev.target.closest('[data-cert]');
    if (cert) { return downloadCert(d, Number(cert.dataset.cert), cert); }
    const a = ev.target.closest('[data-act]');
    if (a && a.dataset.act === 'reset') return resetPin(d);
    if (a && a.dataset.act === 'toggle') return toggleActive(d);
    if (a && a.dataset.act === 'delete') return deleteEmployee(d);
  };
  const scope = root === document ? document.querySelector('#app') : root;
  if (scope._h) scope.removeEventListener('click', scope._h);
  scope._h = act; scope.addEventListener('click', act);
}
function rerenderDetail(d) {
  const r = parseRoute();
  if (isDesk()) paintDetail(); else renderEmpPage($('#app'), r.id);
}

async function downloadCert(d, part, btn) {
  const c = d.certificates.find(x => x.part === part); if (!c) return;
  const mods = MODS.filter(m => m[1] === part);
  const data = {
    name: d.name, part, partTitle: PARTS[part].de,
    modules: mods.map(m => ({ n: m[0], title: m[3] })),
    minutes: Math.round(mods.reduce((a, m) => a + m[2], 0) / 60),
    issuedAt: c.issuedAt, code: c.code
  };
  btn.disabled = true;
  try {
    if (!window.MBCert) await loadScript('/assets/cert.js');
    await window.MBCert.download(data);
  } catch (e) { toast('PDF konnte nicht erstellt werden.'); }
  btn.disabled = false;
}

async function resetPin(d) {
  const first = d.name.split(' ')[0];
  const ok = await confirmDlg({ title: 'PIN zurücksetzen?', text: `${first} bekommt eine neue PIN und wird überall abgemeldet. Die alte PIN gilt dann nicht mehr.`, ok: 'PIN zurücksetzen' });
  if (!ok) return;
  try {
    const r = await api(`/chef/employee/${encodeURIComponent(d.id)}/reset-pin`, {});
    const dlg = modal(`<h2>Neue PIN für ${esc(d.name)}</h2><div class="pinbig" aria-label="PIN ${esc(String(r.pin).split('').join(' '))}">${esc(r.pin)}</div>
      <p>Gib diese PIN dem Mitarbeiter. Er kann sich damit anmelden.</p>
      <div class="btns"><button class="btn btn-sec btn-sm" data-a="copy">PIN kopieren</button><button class="btn btn-primary btn-sm" data-a="ok">Fertig</button></div>`);
    dlg.addEventListener('click', async ev => {
      const b = ev.target.closest('[data-a]'); if (!b) return;
      if (b.dataset.a === 'copy') { toast((await copyText(String(r.pin))) ? 'PIN kopiert' : 'Kopieren nicht möglich'); }
      else dlg.close();
    });
    delete S.details[String(d.id)];
    loadTeam().then(() => paintRows && $('#rows') && paintRows());
  } catch (e) { toast(errText(e)); }
}

async function toggleActive(d) {
  const lock = d.active, first = d.name.split(' ')[0];
  const ok = await confirmDlg(lock
    ? { title: `${first} sperren?`, text: 'Der Mitarbeiter wird abgemeldet und kann sich nicht mehr anmelden, bis du wieder entsperrst.', ok: 'Sperren', danger: true }
    : { title: `${first} entsperren?`, text: 'Der Mitarbeiter kann sich danach wieder anmelden.', ok: 'Entsperren' });
  if (!ok) return;
  try {
    await api(`/chef/employee/${encodeURIComponent(d.id)}/active`, { active: !lock });
    toast(lock ? 'Gesperrt' : 'Entsperrt');
    await loadDetail(d.id, true);
    await loadTeam();
    if (isDesk()) { paintRows(); } else renderEmpPage($('#app'), d.id);
  } catch (e) { toast(errText(e)); }
}

// Endgültig löschen: eigener Dialog, Name muss eingetippt werden (nur Hauptadmin, Server prüft das ebenfalls).
const normName = v => String(v || '').trim().replace(/\s+/g, ' ').toLowerCase();
function deleteEmployee(d) {
  const dlg = modal(`<h2>${esc(d.name)} löschen?</h2>
    <p>Das Konto wird endgültig gelöscht, samt Fortschritt, Quiz-Ergebnissen und Zertifikaten. Das lässt sich nicht rückgängig machen.</p>
    <p>Die Zertifikate dieser Person werden auf der Prüfseite danach als „nicht gefunden“ angezeigt.</p>
    <form id="df" novalidate><label class="field"><span>Zum Bestätigen den Namen eintippen</span><input name="n" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="${esc(d.name)}"></label>
    <div id="de" role="alert"></div>
    <div class="btns"><button type="button" class="btn btn-sec btn-sm" data-a="no">Abbrechen</button><button type="submit" class="btn btn-primary btn-sm" disabled>Endgültig löschen</button></div></form>`);
  const f = $('#df', dlg), go_ = f.querySelector('[type=submit]');
  dlg.querySelector('[data-a="no"]').onclick = () => dlg.close();
  f.n.oninput = () => { go_.disabled = normName(f.n.value) !== normName(d.name); };
  f.n.focus();
  f.onsubmit = async ev => {
    ev.preventDefault();
    if (normName(f.n.value) !== normName(d.name)) return;
    go_.disabled = true; go_.textContent = 'Moment …';
    try {
      await api(`/chef/employee/${encodeURIComponent(d.id)}/delete`, {});
      dlg.close();
      delete S.details[String(d.id)]; S.sel = null;
      await loadTeam();
      toast('Mitarbeiter gelöscht');
      if (location.hash !== '#/team') go('#/team'); else render();
    } catch (e) {
      go_.disabled = false; go_.textContent = 'Endgültig löschen';
      $('#de', dlg).innerHTML = `<div class="err">${esc(errText(e))}</div>`;
    }
  };
}

/* ============================================================ Einstellungen */
function shareText(code) {
  return `Hallo zusammen, hier geht's zur M&B Akademie: ${location.origin}/\nFirmencode: ${code}\nCode eingeben, Vor- und Nachnamen eintragen, PIN festlegen. Fertig!`;
}
const waLink = code => 'https://wa.me/?text=' + encodeURIComponent(shareText(code));

async function renderSettings(app) {
  document.title = 'Einstellungen · Chef-Bereich';
  const desk = isDesk();
  const paint = () => {
    const s = S.settings;
    const me = (S.status && S.status.me) || {};
    const isOwner = me.role === 'owner';
    const code = s.companyCode || '';
    const owners = (s.admins || []).filter(a => a.role === 'owner').length;
    const admins = (s.admins || []).map(a => {
      const self = me.id != null ? String(a.id) === String(me.id) : (me.username && a.username === me.username);
      const isOwn = a.role === 'owner';
      const acts = !isOwner ? '' : [
        isOwn ? (owners > 1 ? `<button class="del" data-role="admin" data-id="${esc(a.id)}" data-name="${esc(a.name)}">Zum Admin zurückstufen</button>` : '')
          : `<button class="del" data-role="owner" data-id="${esc(a.id)}" data-name="${esc(a.name)}">Zum Hauptadmin machen</button>`,
        !self && (!isOwn || owners > 1) ? `<button class="del" data-del="${esc(a.id)}" data-name="${esc(a.name)}" aria-label="${esc(a.name)} entfernen">Entfernen</button>` : ''
      ].join('');
      return `<div class="who"><span class="n">${esc(a.name)}${self ? ' (du)' : ''}</span><span class="r">${isOwn ? 'Hauptadmin' : 'Admin'}</span>${acts.trim() ? `<span class="wa">${acts}</span>` : ''}</div>`;
    }).join('');
    const inner = `${desk ? '' : `<div class="topbar m">${LOGO(75, 28)}<span class="where">Chef-Bereich</span></div>`}
      <div class="settings-in"><h1 class="title" style="${desk ? 'margin-top:48px' : 'margin-top:8px'}">Einstellungen</h1>
      <h2 class="sec" style="margin-top:22px">Firmencode</h2>
      <div class="codebox" id="code" aria-label="Firmencode">${esc(code)}</div>
      <div class="codebtns"><a class="btn btn-primary" id="wa" href="${waLink(code)}" target="_blank" rel="noopener noreferrer">Per WhatsApp teilen</a><button class="btn btn-sec" id="copy">Kopieren</button></div>
      <p class="hint">Mit diesem Code legen neue Mitarbeiter ihr Konto selbst an.</p>
      <button class="linkbtn" id="rotate" style="margin-top:2px">Code ändern</button>
      <p class="hint t0">Mit dem alten Code kann danach niemand mehr ein neues Konto anlegen.</p>
      <h2 class="sec" style="margin-top:22px">Liste exportieren</h2>
      <a class="item" href="/api/chef/export.csv" download style="margin-top:4px;min-height:58px;text-decoration:none;color:inherit"><span class="main"><span class="t1">Fortschritt aller Mitarbeiter</span><span class="t2" style="margin-top:1px">als CSV-Datei für Excel</span></span>${I.download(24)}</a>
      <h2 class="sec" style="margin-top:22px">Zugänge</h2>
      <div style="margin-top:4px">${admins || '<div class="who"><span class="n mute">Keine Einträge</span></div>'}</div>
      ${isOwner ? '<button class="linkbtn" id="addAdmin" style="text-decoration:none">+ Zugang hinzufügen</button>' : ''}
      <button class="linkbtn quiet" id="logout2" style="${desk ? 'display:none' : ''};text-decoration:underline;text-underline-offset:3px">Abmelden</button></div>`;
    app.innerHTML = shell('settings', inner);
    bindShell();
    $('#copy').onclick = async () => { toast((await copyText(code)) ? 'Code kopiert' : 'Kopieren nicht möglich'); };
    $('#rotate').onclick = rotateCode;
    const aa = $('#addAdmin'); if (aa) aa.onclick = addAdmin;
    const lo2 = $('#logout2'); if (lo2) lo2.onclick = logout;
    $$('[data-del]').forEach(b => b.onclick = () => delAdmin(b.dataset.del, b.dataset.name));
    $$('[data-role]').forEach(b => b.onclick = () => setAdminRole(b.dataset.id, b.dataset.name, b.dataset.role));
  };
  if (S.settings) paint(); else app.innerHTML = shell('settings', '<div class="splash">Lädt …</div>');
  try { S.settings = await api('/chef/settings'); if (parseRoute().v === 'settings') paint(); }
  catch (e) { if (!S.settings) app.innerHTML = shell('settings', `<div class="empty">${esc(errText(e))}</div>`); }
}

async function rotateCode() {
  const ok = await confirmDlg({ title: 'Firmencode ändern?', text: 'Mit dem alten Code kann danach niemand mehr ein neues Konto anlegen. Wer schon ein Konto hat, meldet sich weiter mit Name und PIN an.', ok: 'Code ändern' });
  if (!ok) return;
  try {
    const r = await api('/chef/company-code/rotate', {});
    S.settings = { ...S.settings, companyCode: r.companyCode };
    toast('Neuer Code: ' + r.companyCode);
    renderSettings($('#app'));
  } catch (e) { toast(errText(e)); }
}

function addAdmin() {
  const dlg = modal(`<h2>Zugang hinzufügen</h2><form id="af" novalidate>
    <label class="field"><span>Name</span><input name="name" autocomplete="off" required></label>
    <label class="field"><span>Benutzername</span><input name="username" autocomplete="off" autocapitalize="none" spellcheck="false" required></label>
    <label class="field"><span>Passwort</span><input name="password" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" minlength="10" required><small>Mindestens 10 Zeichen. Gib es der Person persönlich weiter.</small></label>
    <div id="ae" role="alert"></div>
    <div class="btns"><button type="button" class="btn btn-sec btn-sm" data-a="no">Abbrechen</button><button type="submit" class="btn btn-primary btn-sm">Anlegen</button></div></form>`);
  const f = $('#af', dlg);
  dlg.querySelector('[data-a="no"]').onclick = () => dlg.close();
  f.name.focus();
  f.onsubmit = async ev => {
    ev.preventDefault();
    const v = { name: f.name.value.trim(), username: f.username.value.trim(), password: f.password.value };
    const ae = $('#ae', dlg); ae.innerHTML = '';
    if (!v.name || !v.username || !v.password) { ae.innerHTML = '<div class="err">Bitte alle Felder ausfüllen.</div>'; return; }
    if (v.password.length < 10) { ae.innerHTML = '<div class="err">Das Passwort braucht mindestens 10 Zeichen.</div>'; return; }
    try {
      await api('/chef/admins', v);
      dlg.close(); toast('Zugang angelegt');
      S.settings = await api('/chef/settings'); renderSettings($('#app'));
    } catch (e) { ae.innerHTML = `<div class="err">${esc(errText(e))}</div>`; }
  };
}
async function setAdminRole(id, name, role) {
  const up = role === 'owner';
  const ok = await confirmDlg(up
    ? { title: `${name} zum Hauptadmin machen?`, text: 'Hauptadmins verwalten Zugänge und dürfen Mitarbeiter endgültig löschen.', ok: 'Zum Hauptadmin machen' }
    : { title: `${name} zum Admin zurückstufen?`, text: 'Admins sehen das Team, setzen PINs zurück und sperren Konten. Zugänge verwalten und Mitarbeiter löschen geht dann nicht mehr.', ok: 'Zurückstufen', danger: true });
  if (!ok) return;
  try {
    await api(`/chef/admins/${encodeURIComponent(id)}/role`, { role });
    toast(up ? 'Ist jetzt Hauptadmin' : 'Ist jetzt Admin');
    S.status = await api('/chef/status'); // eigene Rolle kann sich geändert haben
    S.details = {};
    S.settings = await api('/chef/settings'); renderSettings($('#app'));
  } catch (e) { toast(errText(e)); }
}
async function delAdmin(id, name) {
  const ok = await confirmDlg({ title: `${name} entfernen?`, text: 'Dieser Zugang kann sich danach nicht mehr im Chef-Bereich anmelden.', ok: 'Entfernen', danger: true });
  if (!ok) return;
  try {
    await api(`/chef/admins/${encodeURIComponent(id)}/delete`, {});
    toast('Zugang entfernt');
    S.settings = await api('/chef/settings'); renderSettings($('#app'));
  } catch (e) { toast(errText(e)); }
}

/* ============================================================ Vorführen */
function renderDemo(app, r) {
  document.title = 'Vorführen · Chef-Bereich';
  const desk = isDesk(), L = S.vlang, n = r.n;
  const mod = n != null ? MODS.find(m => m[0] === n) : null;
  const seg = `<div class="seg" role="group" aria-label="Sprache"><button data-vl="de" aria-pressed="${L === 'de'}">DE</button><button data-vl="sq" aria-pressed="${L === 'sq'}">SQ</button></div>`;
  const listHtml = () => [1, 2, 3].map(p => `<div class="partlabel">Teil ${p} · ${esc(PARTS[p][L])}</div><div class="list">${MODS.filter(m => m[1] === p).map(m =>
    `<a class="item" href="#/vorfuehren/${m[0]}" ${mod && mod[0] === m[0] ? 'aria-current="true"' : ''} style="text-decoration:none;color:inherit;${mod && mod[0] === m[0] ? 'background:#f1f2f4;border-radius:10px;padding-left:8px;padding-right:8px;' : ''}"><span class="no">${pad2(m[0])}</span><span class="main"><span class="t1">${esc(L === 'sq' ? m[4] : m[3])}</span></span><span class="right">${fmtT(m[2])}</span></a>`).join('')}</div>`).join('');
  const player = () => {
    if (!mod) return `<div class="empty">Modul wählen, dann startet das Video hier.</div>`;
    const src = `/videos/M${pad2(mod[0])}_${L.toUpperCase()}.mp4`;
    const prev = MODS.find(m => m[0] === mod[0] - 1), next = MODS.find(m => m[0] === mod[0] + 1);
    return `<video id="vp" class="vid" controls playsinline preload="metadata" src="${src}" aria-label="${esc(L === 'sq' ? mod[4] : mod[3])}"></video>
      <h2 style="margin-top:16px;font-size:22px;font-weight:800;letter-spacing:-.02em;line-height:1.2">${pad2(mod[0])} · ${esc(L === 'sq' ? mod[4] : mod[3])}</h2>
      <p class="meta">Teil ${mod[1]} · ${esc(PARTS[mod[1]][L])} · ${fmtT(mod[2])}</p><p id="verr" class="hint" hidden>Dieses Video ist noch nicht hochgeladen.</p>
      <div class="vnav">${prev ? `<a class="btn btn-sec btn-sm" href="#/vorfuehren/${prev[0]}">Zurück</a>` : '<span></span>'}${next ? `<a class="btn btn-sec btn-sm" href="#/vorfuehren/${next[0]}">Weiter</a>` : '<span></span>'}</div>`;
  };
  let inner;
  if (desk) {
    inner = `<div class="dtitle" style="margin-top:48px"><div class="tl"><h1 class="title">Vorführen</h1><p>Alle Videos frei abspielbar, für Schulungen am Beamer.</p></div><div class="tr">${seg}</div></div>
      <div class="vsplit"><div class="vl">${listHtml()}</div><div class="vr">${player()}</div></div>`;
  } else if (mod) {
    inner = `<button class="backbtn" id="back" aria-label="Zurück zur Liste">${I.chevL}Vorführen</button><div style="display:flex;justify-content:flex-end;margin-top:4px">${seg}</div><div style="margin-top:16px">${player()}</div>`;
  } else {
    inner = `<div class="topbar m">${LOGO(75, 28)}<span class="where">Chef-Bereich</span></div>
      <div class="team-head"><h1 class="title">Vorführen</h1>${seg}</div>
      <p class="team-sub">Alle Videos frei abspielbar, zum Beispiel am Beamer.</p>${listHtml()}`;
  }
  app.innerHTML = shell('demo', inner);
  bindShell();
  const back = $('#back'); if (back) back.onclick = () => go('#/vorfuehren');
  $$('[data-vl]').forEach(b => b.onclick = () => { S.vlang = b.dataset.vl; render(); });
  const vp = $('#vp'); if (vp) vp.addEventListener('error', () => { const e = $('#verr'); if (e) e.hidden = false; }, true);
}
