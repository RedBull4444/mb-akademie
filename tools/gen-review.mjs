// Erzeugt review/quizfragen.html (Freigabe-Seite für Kaan und den albanischen Prüfer) aus content/quiz/*.json
import fs from 'node:fs';
import { MODS } from '../functions/_lib/content.js';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const L = ['A', 'B', 'C', 'D'];
const parts = { 1: 'Teil 1 · Bauteile', 2: 'Teil 2 · Anlage & Hydraulik', 3: 'Teil 3 · Betrieb & Kontrolle' };
let body = '', toc = '', lastPart = 0, total = 0;
for (let n = 1; n <= 15; n++) {
  const qs = JSON.parse(fs.readFileSync(new URL(`../content/quiz/M${String(n).padStart(2, '0')}.json`, import.meta.url), 'utf8'));
  const m = MODS[n];
  if (m.p !== lastPart) { body += `<h2 class="part">${esc(parts[m.p])}</h2>`; lastPart = m.p; }
  const nn = String(n).padStart(2, '0');
  toc += `<a href="#m${nn}">${nn}</a>`;
  body += `<section class="mod" id="m${nn}"><header><span class="no">Modul ${nn}</span><h3><span lang="de" class="de">${esc(m.de)}</span><span lang="sq" class="sq">${esc(m.sq)}</span></h3></header><ol class="qs">`;
  qs.forEach((q, i) => {
    total++;
    body += `<li class="q"><p class="qt"><span class="de">${esc(q.q.de)}</span><span class="sq" lang="sq">${esc(q.q.sq)}</span></p><ul class="ans">`;
    q.a.forEach((a, j) => {
      const ok = j === q.correct;
      body += `<li class="${ok ? 'ok' : ''}"><span class="l">${L[j]}</span><span class="t"><span class="de">${esc(a.de)}</span><span class="sq" lang="sq">${esc(a.sq)}</span></span>${ok ? '<span class="mark" aria-label="richtige Antwort">richtig</span>' : ''}</li>`;
    });
    body += `</ul><p class="why"><span class="de">${esc(q.why.de)}</span><span class="sq" lang="sq">${esc(q.why.sq)}</span></p><p class="ref">${nn}-${i + 1}</p></li>`;
  });
  body += `</ol></section>`;
}
const html = `<title>Quizfragen M&amp;B Akademie</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap">
<style>
/* Layout: eine ruhige Lesespalte, Module als Abschnitte, Antworten als schlichte Zeilen – Stil der App „A einfach“ */
:root{--bg:#ffffff;--fg:#0f1317;--muted:#5b6570;--line:#eceef1;--soft:#f4f5f7;--accent:#d6001c;--ok:#1b7a43;--okbg:#eaf6ef;
--sans:"Schibsted Grotesk",system-ui,-apple-system,"Segoe UI",sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#111417;--fg:#eef1f4;--muted:#a3adb7;--line:#262c33;--soft:#1a1f24;--accent:#ff4a5f;--ok:#4cc483;--okbg:#14291e;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#111417;--fg:#eef1f4;--muted:#a3adb7;--line:#262c33;--soft:#1a1f24;--accent:#ff4a5f;--ok:#4cc483;--okbg:#14291e;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:16px;line-height:1.5;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.wrap{max-width:720px;margin:0 auto;padding-block:32px 72px;display:grid;gap:28px}
h1{font-size:34px;line-height:1.1;font-weight:800;letter-spacing:-.02em;margin:0;text-wrap:balance}
.lead{color:var(--muted);margin:8px 0 0;max-width:62ch}
.bar{position:sticky;top:env(safe-area-inset-top,0px);background:var(--bg);border-bottom:1px solid var(--line);padding-block:10px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;z-index:2}
.seg{display:inline-flex;background:var(--soft);border-radius:12px;padding:3px}
.seg button{font:inherit;font-size:14px;font-weight:600;border:0;background:transparent;color:var(--muted);padding:8px 14px;border-radius:9px;cursor:pointer;min-height:40px}
.seg button[aria-pressed="true"]{background:var(--bg);color:var(--fg);box-shadow:0 1px 2px rgba(0,0,0,.12)}
.toc{display:flex;gap:4px;flex-wrap:wrap}
.toc a{font-size:13px;font-weight:600;color:var(--muted);text-decoration:none;padding:6px 8px;border-radius:8px;font-variant-numeric:tabular-nums}
.toc a:hover,.toc a:focus-visible{background:var(--soft);color:var(--fg)}
.notes{background:var(--soft);border-radius:14px;padding:16px 18px;display:grid;gap:8px}
.notes h2{font-size:15px;margin:0}
.notes ul{margin:0;padding-left:18px;color:var(--muted);display:grid;gap:4px}
.notes b{color:var(--fg)}
.part{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:16px 0 -8px;font-weight:700}
.mod{border-top:1px solid var(--line);padding-top:20px;display:grid;gap:14px;scroll-margin-top:64px}
.mod header{display:grid;gap:2px}
.no{font-size:13px;font-weight:700;color:var(--accent);font-variant-numeric:tabular-nums}
h3{font-size:22px;line-height:1.2;margin:0;font-weight:800;letter-spacing:-.01em;text-wrap:balance}
.qs{list-style:none;margin:0;padding:0;display:grid;gap:22px;counter-reset:q}
.q{display:grid;gap:8px;counter-increment:q;position:relative}
.qt{margin:0;font-weight:700;font-size:17px;display:flex;gap:10px}
.qt::before{content:counter(q);color:var(--muted);font-weight:600;min-width:14px;font-variant-numeric:tabular-nums}
.ans{list-style:none;margin:0 0 0 24px;padding:0;display:grid;gap:4px}
.ans li{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:10px;border:1px solid var(--line)}
.ans li.ok{border-color:var(--ok);background:var(--okbg)}
.l{font-size:13px;font-weight:700;color:var(--muted);min-width:14px;padding-top:1px}
.t{flex:1;min-width:0}
.mark{font-size:12px;font-weight:700;color:var(--ok);text-transform:uppercase;letter-spacing:.06em;padding-top:2px}
.why{margin:0 0 0 24px;color:var(--muted);font-size:15px}
.ref{position:absolute;right:0;top:0;margin:0;font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.qt{padding-right:44px}
body[data-lang="de"] .sq{display:none}
body[data-lang="sq"] .de{display:none}
body[data-lang="both"] .sq{display:block;color:var(--muted);font-weight:500;margin-top:2px}
body[data-lang="both"] .t .sq,body[data-lang="both"] h3 .sq{font-size:.92em}
h3 .de,h3 .sq{display:block}
body[data-lang="sq"] .sq{display:inline}
body[data-lang="sq"] h3 .sq{display:block}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
</style>
<div class="wrap">
<div>
<h1>Quizfragen zur Freigabe</h1>
<p class="lead">${total} Fragen für Modul 01–15 der Reihe SHK-Grundlagen, je 5 pro Modul, Bestehen ab 4 richtigen. Die richtige Antwort ist grün markiert, darunter steht die Erklärung, die der Mitarbeiter nach dem Antworten sieht. Änderungen einfach mit der Nummer rechts oben melden, zum Beispiel „09-3: Antwort C anders formulieren“.</p>
</div>
<div class="notes">
<h2>Hinweise aus den Sprechtexten</h2>
<ul>
<li><b>Modul 06:</b> Im Video heißt es „Was Magnetit genau ist, lernst du ausführlich in Modul 16“. Richtig wäre Modul 14.</li>
<li><b>Albanisch:</b> Fragen und Antworten sind übersetzt und müssen von einem Muttersprachler bei M&amp;B geprüft werden, besonders Vor-/Rücklauf (furnizim/kthim) und Wärmeerzeuger (pajisja e ngrohjes).</li>
</ul>
</div>
<div class="bar">
<div class="seg" role="group" aria-label="Sprache">
<button type="button" id="l-de" data-l="de" aria-pressed="true">Deutsch</button>
<button type="button" id="l-sq" data-l="sq" aria-pressed="false">Shqip</button>
<button type="button" id="l-both" data-l="both" aria-pressed="false">Beide</button>
</div>
<nav class="toc" aria-label="Module">${toc}</nav>
</div>
${body}
</div>
<script>
(function(){var b=document.body;function set(l){b.setAttribute('data-lang',l);document.querySelectorAll('.seg button').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.l===l))});try{localStorage.setItem('qlang',l)}catch(e){}}
var s='de';try{s=localStorage.getItem('qlang')||'de'}catch(e){}set(s);
document.querySelectorAll('.seg button').forEach(function(x){x.addEventListener('click',function(){set(x.dataset.l)})});})();
</script>`;
fs.writeFileSync(new URL('../review/quizfragen.html', import.meta.url), html);
console.log('ok', total);
