# Prüfauftrag je Modul (Video + Quiz + Lernziele, DE + SQ)

Kontext: M&B Akademie – interne SHK-Schulung (Heizung/Sanitär, Wärmepumpen; M&B verbaut Buderus, Bosch, iDM) für ca. 30 Monteure von M&B Gebäudetechnik. Viele sprechen Albanisch (Kosovo/Albanien) bei einfachem Leseniveau. Am Ende gibt es ein Zertifikat – alles muss fachlich und sprachlich 100 % korrekt sein. Sei streng; ein erster Durchgang hat schon stattgefunden und Dinge übersehen.

Modulliste (für Querverweise wie „in Modul X“):
0 Einführung · 1 MAG Heizung · 2 Trinkwasser-Ausdehnungsgefäß · 3 Nachfülleinheit und Wasseraufbereitung · 4 Sicherheitsgruppe Heizung · 5 Sicherheitsgruppe Warmwasserspeicher · 6 Schlammabscheider · 7 Luftabscheider und Entlüfter · 8 Warmwasserspeicher anschließen · 9 Heizungsanlage anschließen · 10 Wärmepumpen-Hydraulik · 11 Umwälzpumpe und Rückschlagventile · 12 Hydraulischer Abgleich · 13 Mischerkreis · 14 Heizungswasser: Magnetit und VDI 2035 · 15 Typische Montagefehler und Abschlusskontrolle
(Bekannt und schon behoben: M06 verwies auf „Modul 16“ – Satz wurde aus dem Video geschnitten.)

## Eingaben je Modul Mxx (alle in /home/claude/mb-akademie)
- review/videotexte/Mxx_vo.json – gesprochener Text je Szene: `de` (exakt so an die deutsche TTS-Stimme geschickt; Lautschrift wie „Es-Ha-Ka“, „Em-A-Ge“ ist ABSICHT, kein Fehler), `sq` (exakt so an edge-tts sq-AL-IlirNeural).
- review/videotexte/Mxx_screen.json – Texte im Bild (`de`, `sq`, `termDe` = kleiner deutscher Fachbegriff unter dem Albanischen).
- review/videotexte/Mxx_notes.md (falls vorhanden) – Herkunft/Hinweise.
- content/quiz/Mxx.json – 5 Quizfragen DE+SQ (nicht bei M00).
- functions/_lib/content.js – Eintrag des Moduls (Titel, Lernziele/Kernpunkte DE+SQ).
- review/sq-glossar.md – Begriffsliste des ersten Durchgangs (Begriffe einheitlich halten, außer sie sind falsch).

## Prüfen
A. **Fachlich** (wichtigste Prüfung): Stimmt jede Aussage nach Stand der Technik in Deutschland (DIN EN 12828, DIN 1988/DIN EN 806, DIN 4753, VDI 2035, Herstellerpraxis)? Nichts Falsches, nichts gefährlich Vereinfachtes, keine erfundenen Zahlen, keine Widersprüche zwischen Szenen, zwischen Video und Quiz, oder zu anderen Modulen. Querverweise auf Modulnummern prüfen.
B. **Deutsch**: Rechtschreibung, Grammatik, Zeichensetzung, verständlich. Im Gesprochenen: würde die deutsche TTS etwas falsch aussprechen (Abkürzungen, Ziffern, Symbole wie Δp, °C, DN, %)?
C. **Albanisch**: korrekte Standardsprache, ë/ç, Grammatik (Genus, Kasus, bestimmte Form), natürlich statt wörtlich übersetzt, inhaltlich GLEICH wie DE (nichts fehlt, nichts dazu), Fachbegriffe einheitlich und für Monteure verständlich. Im Gesprochenen: Dinge, die edge-tts falsch liest (deutsche Wörter, Abkürzungen, Ziffern/Symbole).
D. **Quiz**: Ist jede Frage aus dem Video beantwortbar? Ist die richtige Antwort wirklich richtig und eindeutig? Sind die falschen Antworten eindeutig falsch? Passt alles zu dem, was im Video gesagt wird? DE und SQ gleichwertig?
E. **Lernziele/Kernpunkte** in content.js: stimmen sie mit dem Video überein, sprachlich korrekt DE+SQ?

## Ändern / Berichten
- Quiz-JSON deiner Module darfst du direkt korrigieren (Struktur, IDs, Reihenfolge und welche Option richtig ist NICHT ändern – außer die richtige Antwort ist fachlich falsch; dann melden, nicht selbst umbauen). Danach `node -e` JSON.parse prüfen.
- content.js, Videos, i18n etc. NICHT ändern – Korrekturen dafür nur im Bericht vorschlagen.
- Schreibe review/befunde/Mxx.md je Modul: Tabelle aller Befunde mit Schwere **KRITISCH** (fachlich falsch / Sinnfehler / irreführend), **MITTEL** (hör- oder sichtbarer Sprachfehler), **KLEIN** (Stil). Je Befund: Ort (vo:Szenenschlüssel / screen:Schlüssel / quiz:Fragen-ID / content.js), Zitat, Korrektur DE und/oder SQ, Begründung. Dazu Liste der Quiz-Änderungen, die du vorgenommen hast. Falls nichts zu beanstanden: ausdrücklich so schreiben.
- Antwort an mich (Deutsch, knapp): je Modul Anzahl KRITISCH/MITTEL/KLEIN und alle KRITISCH-Befunde in einem Satz.
