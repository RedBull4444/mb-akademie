// Quiz-Fragen. NUR serverseitig – Lösungen (correct) verlassen den Server nie.
// Struktur je Modul 1–15 (Modul 0 hat kein Quiz):
//   [{ q:{de,sq}, a:[{de,sq} x4], correct:0..3, why:{de,sq} } x5]
// Aktuell Platzhalter-Fragen; echte Fragen ersetzen einfach die Einträge in ECHT bzw. die Platzhalter.
import { MODS } from './content.js';
import { QUIZ_DATA } from './quiz-data.js';

// Deterministische Verteilung der richtigen Antwort (0..3), damit sie nicht immer gleich liegt.
const PLATZHALTER_LOESUNG = [2, 0, 3, 1, 2, 3, 1, 0, 2, 1, 3, 0, 1, 2, 0, 3, 1, 0, 2, 3];

// SQ-Entwurf = DE mit Präfix (Muttersprachler ersetzt später)
const sq = (text) => '[SQ] ' + text;
const both = (de) => ({ de, sq: sq(de) });

// Echte Fragen, die einen Platzhalter ersetzen: ECHT[modul][fragenIndex]
const ECHT = {
  9: {
    1: {
      q: both('Womit beginnst du beim Anschließen einer Heizungsanlage?'),
      a: [
        both('Rohrleitung so verlegen, wie man es gewohnt ist'),
        both('Das Hydraulikschema prüfen'),
        both('Die Anlage befüllen und entlüften'),
        both('Die Einstellungen dokumentieren'),
      ],
      correct: 1,
      why: both('Erst das Schema, dann die Leitung – sonst baust du nach Gewohnheit statt nach Plan.'),
    },
  },
};

function platzhalter(n, i) {
  const titel = MODS[n].de;
  const correct = PLATZHALTER_LOESUNG[(n * 5 + i) % PLATZHALTER_LOESUNG.length];
  const buchstaben = ['A', 'B', 'C', 'D'];
  return {
    q: both(`[Platzhalter] Frage ${i + 1} zu ${titel}`),
    a: buchstaben.map((b) => both(`[Platzhalter] Antwort ${b}`)),
    correct,
    why: both(`[Platzhalter] Erklärung zu Frage ${i + 1}.`),
  };
}

export const QUIZ = {};
for (let n = 1; n <= 15; n++) {
  QUIZ[n] = QUIZ_DATA[n] || [0, 1, 2, 3, 4].map((i) => (ECHT[n] && ECHT[n][i]) || platzhalter(n, i));
}

export const QUESTIONS_PER_QUIZ = 5;
export const PASS_MIN = 4; // mind. 4 von 5 richtig
