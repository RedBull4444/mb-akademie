// Erzeugt functions/_lib/quiz-data.js aus content/quiz/MNN.json (Quelle der Wahrheit für Quizfragen).
// Aufruf: node tools/gen-quiz.mjs
import fs from 'node:fs';
const dir = new URL('../content/quiz/', import.meta.url);
const out = {};
for (const f of fs.readdirSync(dir).filter((f) => /^M\d\d\.json$/.test(f)).sort()) {
  const n = parseInt(f.slice(1, 3), 10);
  const qs = JSON.parse(fs.readFileSync(new URL(f, dir), 'utf8'));
  if (!Array.isArray(qs) || qs.length !== 5) throw new Error(f + ': genau 5 Fragen erwartet');
  for (const q of qs) {
    if (!q.q?.de || !q.q?.sq || !q.why?.de || !q.why?.sq) throw new Error(f + ': Text fehlt');
    if (!Array.isArray(q.a) || q.a.length !== 4 || q.a.some((a) => !a.de || !a.sq)) throw new Error(f + ': 4 Antworten DE/SQ erwartet');
    if (![0, 1, 2, 3].includes(q.correct)) throw new Error(f + ': correct 0..3');
  }
  out[n] = qs;
}
fs.writeFileSync(new URL('../functions/_lib/quiz-data.js', import.meta.url),
  '// AUTOMATISCH ERZEUGT aus content/quiz/*.json – nicht von Hand ändern. (node tools/gen-quiz.mjs)\nexport const QUIZ_DATA = ' + JSON.stringify(out, null, 1) + ';\n');
console.log('Module mit echten Fragen:', Object.keys(out).join(', '));
