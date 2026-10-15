// Erzeugt public/assets/chapters.json (Kapitel für „Nachschlagen“) aus den Videoprojekten.
// Läuft dort, wo die Projekte liegen (Render-Server): node tools/gen-chapters.cjs <projektliste.json> > public/assets/chapters.json
// projektliste.json: { "1": "/pfad/M01/src", ... }  – je Modul der src-Ordner des Videoprojekts.
const fs = require('fs'), P = require('path');
function chapters(dir) {
  const sc = require(P.join(dir, 'scenes'));
  for (const f of ['scenes2', 'scenesA', 'scenesB']) { try { require(P.join(dir, f)); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; } }
  const tx = require(P.join(dir, 'texts'));
  const timing = JSON.parse(fs.readFileSync(P.join(dir, '..', 'timing.json'), 'utf8'));
  const ks = Object.keys(timing).filter((k) => /^s\d+$/.test(k)).sort();
  const order = ['intro', ...ks, 'outro'].filter((k) => timing[k] && sc.D[k]);
  const tl = sc.buildTimeline(timing, order, sc.D);
  const look = (k) => { if (tx[k] && tx[k].de) return tx[k]; for (const v of Object.values(tx)) if (v && typeof v === 'object' && v[k] && v[k].de) return v[k]; return null; };
  const out = [];
  for (const s of tl.scenes) { if (!s.head) continue; const h = typeof s.head === 'object' ? s.head : look(s.head); if (h) out.push({ t: Math.round((s.t0 + 0.2) * 10) / 10, de: h.de, sq: h.sq }); }
  return out;
}
const list = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const res = {};
for (const [n, dir] of Object.entries(list)) res[n] = chapters(dir);
process.stdout.write(JSON.stringify(res));
