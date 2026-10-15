// Gemeinsame Zugangsprüfung für Videos. Wird von functions/_middleware.js (alle Pfade) und
// functions/videos/[[path]].js verwendet, damit es keinen Umweg über ungewöhnliche Schreibweisen gibt.
import { currentAdmin, currentEmployee } from './auth.js';
import { isUnlocked } from './db.js';
import { MODS } from './content.js';
import { SECURITY_HEADERS } from './util.js';

const deny = (status, text) =>
  new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY_HEADERS },
  });

// Pfad vereinheitlichen: mehrfach URL-dekodieren (bis stabil), Backslash -> Slash, Mehrfach-Slashes
// zusammenfassen, "." und ".." auflösen, klein schreiben. Rückgabe: Pfad oder null bei kaputter Kodierung.
export function normalizePath(pathname) {
  let p = pathname;
  let stable = false;
  for (let i = 0; i < 8; i++) {
    let d;
    try { d = decodeURIComponent(p); } catch { return null; }
    if (d === p) { stable = true; break; }
    p = d;
  }
  if (!stable) return null;
  const segs = [];
  for (const s of p.replace(/\0/g, '').replace(/\\/g, '/').split('/')) {
    if (s === '' || s === '.') continue;
    if (s === '..') segs.pop();
    else segs.push(s.trim());
  }
  return '/' + segs.join('/').toLowerCase();
}

// Betrifft der (normalisierte) Pfad die Videos? Alles unter /videos und alles auf .mp4.
export const isVideoPath = (norm) => norm === '/videos' || norm.startsWith('/videos/') || norm.endsWith('.mp4');

// Video ausliefern, falls erlaubt. `norm` = normalisierter Pfad.
export async function serveVideo(request, env, norm) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return deny(405, 'Methode nicht erlaubt.');

  const m = norm && norm.match(/^\/videos\/m(\d{2})_(de|sq)\.mp4$/);
  if (!m || Number(m[1]) >= MODS.length) return deny(404, 'Nicht gefunden.');
  const n = Number(m[1]);

  // Chef sieht alles, Mitarbeiter nur freigeschaltete Module.
  let allowed = !!(await currentAdmin(request, env));
  if (!allowed) {
    const emp = await currentEmployee(request, env);
    allowed = !!emp && (await isUnlocked(env, emp.id, n));
  }
  if (!allowed) return deny(403, 'Kein Zugriff.');

  // Immer die kanonische Datei holen (nie den ursprünglichen, evtl. verbogenen Pfad).
  const canonical = new URL(`/videos/M${m[1]}_${m[2].toUpperCase()}.mp4`, request.url);
  const asset = new Request(canonical, request); // übernimmt Methode und Range-Header
  const res = await env.ASSETS.fetch(asset);
  const range = request.headers.get('Range');
  // Fallback: Liefert der Asset-Server bei Range trotzdem die ganze Datei (200), schneiden wir selbst zu.
  // Wichtig für iPhone/Safari, das Videos nur mit 206-Antworten abspielt.
  if (range && res.status === 200) return sliceRange(res, range, request.method === 'HEAD');
  const out = new Response(res.body, res);
  finish(out.headers);
  return out;
}

function finish(h) {
  h.set('Cache-Control', 'private, no-store');
  h.set('Accept-Ranges', 'bytes');
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) h.set(k, v);
}

async function sliceRange(res, range, headOnly) {
  const buf = await res.arrayBuffer(); // Dateien sind ≤ 25 MiB
  const size = buf.byteLength;
  const m = range.match(/^bytes=(\d*)-(\d*)$/);
  let start, end;
  if (m && m[1] !== '') { start = +m[1]; end = m[2] !== '' ? Math.min(+m[2], size - 1) : size - 1; }
  else if (m && m[2] !== '') { start = Math.max(0, size - +m[2]); end = size - 1; } // bytes=-N
  if (!m || start === undefined || start > end || start >= size) {
    const h = new Headers({ 'Content-Range': `bytes */${size}` }); finish(h);
    return new Response(null, { status: 416, headers: h });
  }
  const h = new Headers({
    'Content-Type': res.headers.get('Content-Type') || 'video/mp4',
    'Content-Range': `bytes ${start}-${end}/${size}`,
    'Content-Length': String(end - start + 1),
  });
  finish(h);
  return new Response(headOnly ? null : buf.slice(start, end + 1), { status: 206, headers: h });
}
