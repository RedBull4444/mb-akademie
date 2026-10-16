// Gemeinsames Test-Gerüst (Node 22, nur fetch, keine Bibliotheken): HTTP-Client mit Cookie-Speicher,
// ok()/section()/summary(), Hilfsaufrufe. Genutzt von api.test.mjs und progress-real.test.mjs.
import { execFileSync } from 'node:child_process';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

export const BASE = process.env.BASE_URL || 'http://localhost:8788';
export const ORIGIN = new URL(BASE).origin;
export const ROOT = fileURLToPath(new URL('..', import.meta.url));
// Pro Testlauf eine eigene Test-IP, damit sich wiederholte Läufe nicht gegenseitig in die Rate-Limits laufen.
export const RUN_IP = '192.0.2.' + (1 + Math.floor(Math.random() * 250));
export const SETUP_TOKEN = 'test-setup-123';
export const CHEF = { name: 'Miran Shala', username: 'chef', password: 'Sehr-geheim-123' };

// ---------- kleines Test-Gerüst ----------
let passed = 0, failed = 0;
const failures = [];
export function ok(cond, name, detail) {
  if (cond) { passed++; console.log('  ok   ' + name); }
  else { failed++; failures.push(name); console.log('  FAIL ' + name + (detail !== undefined ? '  -> ' + JSON.stringify(detail) : '')); }
}
export const section = (t) => console.log('\n# ' + t);
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- HTTP-Client mit eigenem Cookie-Speicher ----------
export class Client {
  constructor(ip) { this.jar = {}; this.ip = ip || RUN_IP; }
  cookieHeader() { return Object.entries(this.jar).map(([k, v]) => `${k}=${v}`).join('; '); }
  async req(method, path, { body, origin = ORIGIN, headers = {} } = {}) {
    const h = { ...headers };
    if (this.cookieHeader()) h.Cookie = this.cookieHeader();
    if (origin) h.Origin = origin;
    if (this.ip) h['CF-Connecting-IP'] = this.ip;
    let payload;
    if (body !== undefined) { h['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
    const doFetch = () => fetch(BASE + path, { method, headers: h, body: payload, redirect: 'manual' });
    let res;
    // Eine im Leerlauf (z. B. während eines wrangler-Aufrufs) vom Server geschlossene Verbindung: GET einmal wiederholen.
    try { res = await doFetch(); }
    catch (e) { if (method !== 'GET' || !(e && e.cause && e.cause.code === 'UND_ERR_SOCKET')) throw e; res = await doFetch(); }
    const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    for (const c of setCookies) {
      const [pair, ...attrs] = c.split(';').map((s) => s.trim());
      const i = pair.indexOf('=');
      const name = pair.slice(0, i), value = pair.slice(i + 1);
      if (attrs.some((a) => /^max-age=0$/i.test(a)) || value === '') delete this.jar[name];
      else this.jar[name] = value;
    }
    const type = res.headers.get('content-type') || '';
    let data = null, text = null;
    if (type.includes('application/json')) data = await res.json();
    else text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(await res.arrayBuffer()); // BOM erhalten
    return { status: res.status, data, text, headers: res.headers, setCookies };
  }
  // GET mit EXAKT diesem Pfad (fetch/URL würden ".", "..", "\\" und Ähnliches vorher glätten).
  raw(path, headers = {}) {
    const u = new URL(BASE);
    const h = { 'CF-Connecting-IP': this.ip, ...headers };
    if (this.cookieHeader()) h.Cookie = this.cookieHeader();
    return new Promise((resolve, reject) => {
      const rq = http.request({ host: u.hostname, port: u.port, path, method: 'GET', headers: h }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      });
      rq.on('error', reject);
      rq.end();
    });
  }
  get(path, opt) { return this.req('GET', path, opt); }
  post(path, body, opt) { return this.req('POST', path, { body: body === undefined ? {} : body, ...opt }); }
}

// Wrangler-Hilfsaufruf (nur für Dinge, die per API nicht gehen, z. B. Sperre auslaufen lassen)
// Persistenz-Ordner der D1-Datenbank (wie beim Dev-Server, z. B. PERSIST_TO=.wrangler/state-real).
export function sql(command) {
  const args = ['wrangler', 'd1', 'execute', 'akademie-db', '--local', '--command', command];
  if (process.env.PERSIST_TO) args.push('--persist-to', process.env.PERSIST_TO);
  execFileSync('npx', args, { cwd: ROOT, stdio: 'pipe' });
}

// Lesende Abfrage gegen dieselbe lokale D1 (liefert die Ergebniszeilen).
export function sqlRows(command) {
  const args = ['wrangler', 'd1', 'execute', 'akademie-db', '--local', '--json', '--command', command];
  if (process.env.PERSIST_TO) args.push('--persist-to', process.env.PERSIST_TO);
  const out = execFileSync('npx', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  const j = JSON.parse(out.slice(out.search(/^\[/m)));
  return j[0].results;
}

export const rnd = (n = 6) => Array.from({ length: n }, () => 'abcdefghklmnprstuvz'[Math.floor(Math.random() * 19)]).join('');
export const cap = (s) => s[0].toUpperCase() + s.slice(1);

// Quiz lösen. Die richtigen IDs lernt ein erster, nie abgegebener "Probelauf" (check verrät correctId erst
// NACH der eigenen Antwort). Danach ein zweiter Lauf mit den gewünschten Antworten (optional k Fragen
// absichtlich falsch: die ersten wrongCount Fragen) und submit mit runId.
const known = new Map();
async function learnCorrect(c, n) {
  if (known.has(n)) return { status: 200 };
  const g = await c.get('/api/quiz/' + n);
  if (g.status !== 200) return g;
  const ids = [];
  for (const q of g.data.questions) {
    const chk = await c.post(`/api/quiz/${n}/check`, { runId: g.data.runId, q: q.id, a: q.a[0].id });
    ids[q.id] = chk.data.correctId;
  }
  known.set(n, ids);
  return { status: 200 };
}
export async function solveQuiz(c, n, wrongCount = 0) {
  const l = await learnCorrect(c, n);
  if (l.status !== 200) return { get: l };
  const g = await c.get('/api/quiz/' + n);
  if (g.status !== 200) return { get: g };
  const ids = known.get(n);
  const answers = [];
  for (const q of g.data.questions) {
    answers[q.id] = q.id < wrongCount ? (ids[q.id] + 1) % 4 : ids[q.id];
    await c.post(`/api/quiz/${n}/check`, { runId: g.data.runId, q: q.id, a: answers[q.id] });
  }
  const sub = await c.post(`/api/quiz/${n}/submit`, { runId: g.data.runId });
  return { get: g, sub, answers };
}
// Video "ansehen": mit DEV_SHORT (8 s) schließt schon die erste Meldung ab (erste Meldung: bis 6 s = Dauer - 2 s).
export const watch = (c, n) => c.post('/api/progress', { module: n, pos: 8 });


export function summary() {
  console.log(`\n${passed} von ${passed + failed} Tests grün` + (failed ? `, ${failed} FEHLGESCHLAGEN:\n - ${failures.join('\n - ')}` : ''));
  return failed ? 1 : 0;
}

// Chef-Zugang sicherstellen (Ersteinrichtung oder Login) und Firmencode holen.
export async function chefBootstrap(chef) {
  const st = await chef.get('/api/chef/status');
  if (st.data.setupNeeded) await chef.post('/api/chef/setup', { setupToken: SETUP_TOKEN, ...CHEF });
  else await chef.post('/api/chef/login', { username: CHEF.username, password: CHEF.password });
  const set = await chef.get('/api/chef/settings');
  return set.data.companyCode;
}
