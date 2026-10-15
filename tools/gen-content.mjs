// Erzeugt functions/_lib/content.js aus design/akademie-basis.txt.
// Aufruf: node tools/gen-content.mjs
// Die Texte werden NICHT abgetippt, sondern aus dem Array MODS der Design-Basis gelesen.
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync(new URL('../design/akademie-basis.txt', import.meta.url), 'utf8');

// Array-Literal "const MODS=[ ... ];" per Klammer-Zählung herausschneiden (string-sicher).
const start = src.indexOf('const MODS=[');
if (start < 0) throw new Error('MODS nicht gefunden');
let i = src.indexOf('[', start), depth = 0, quote = null, esc = false, end = -1;
for (; i < src.length; i++) {
  const c = src[i];
  if (quote) {
    if (esc) esc = false;
    else if (c === '\\') esc = true;
    else if (c === quote) quote = null;
    continue;
  }
  if (c === '"' || c === "'" || c === '`') quote = c;
  else if (c === '[') depth++;
  else if (c === ']' && --depth === 0) { end = i; break; }
}
if (end < 0) throw new Error('MODS-Ende nicht gefunden');
const mods = vm.runInNewContext('(' + src.slice(src.indexOf('[', start), end + 1) + ')');

// Dauern in Sekunden laut SPEC (exakt).
const DUR = [39.5, 300.0, 339.4, 451.9, 347.7, 407.0, 440.3, 428.2, 401.1, 499.2, 423.1, 524.8, 415.2, 393.6, 432.8, 385.5];
if (mods.length !== 16) throw new Error('Erwarte 16 Module, gefunden: ' + mods.length);

const out = mods.map((m, idx) => {
  if (m.n !== idx) throw new Error('Reihenfolge der Module stimmt nicht bei ' + idx);
  const part = idx <= 7 ? 1 : idx <= 11 ? 2 : 3;
  if (m.p !== part) throw new Error(`Teil von Modul ${idx} weicht von der SPEC ab`);
  return { n: m.n, p: m.p, duration: DUR[idx], de: m.de, sq: m.sq, g: m.g, k: m.k };
});

const body = `// AUTOMATISCH ERZEUGT von tools/gen-content.mjs aus design/akademie-basis.txt – nicht von Hand ändern.
// Module n = 0..15. Teil 1 = 0–7, Teil 2 = 8–11, Teil 3 = 12–15.
// Felder: n = Nummer, p = Teil, duration = Länge in Sekunden, de/sq = Titel,
// g = Lernziel {de,sq}, k = Kernpunkte {de:[], sq:[]}.

export const MODS = ${JSON.stringify(out, null, 2)};

// Teil-Namen (SQ später vom Muttersprachler prüfen lassen).
export const PARTS = {
  1: { de: 'Bauteile', sq: 'Pjesët' },
  2: { de: 'Anlage & Hydraulik', sq: 'Sistemi & hidraulika' },
  3: { de: 'Betrieb & Kontrolle', sq: 'Funksionimi & kontrolli' },
};

// Alle Modul-Nummern eines Teils.
export function modulesOfPart(k) {
  return MODS.filter((m) => m.p === k).map((m) => m.n);
}

// Dauer eines Moduls in Sekunden. Mit DEV_SHORT=1 (nur lokal) sind alle Module 8 s lang.
export function durationOf(n, env) {
  if (env && String(env.DEV_SHORT) === '1') return 8;
  const m = MODS[n];
  return m ? m.duration : 0;
}
`;
writeFileSync(new URL('../functions/_lib/content.js', import.meta.url), body);
console.log('content.js geschrieben:', out.length, 'Module');
