# M09 Heizungsanlage anschließen – Notizen

Chat: https://claude.ai/chat/eb543a7b-d410-4b2d-9752-2b7ce43c04c8 ("M&B Modul 9", 10 Turns, 09.10.2026)

## Quellen (Turn 3, Tool-Calls)
- vo_script.json wurde NICHT mit Write geschrieben, sondern per Python-Bash (Call "Write M09 VO script DE/SQ"): s01-s27 und s30 per Regex aus dem hochgeladenen Briefing (Textdatei), intro/s28/s29/outro direkt im Skript; danach Ersetzung `\bMAG\b` -> `Em-A-Ge` im DE-Text. Das Briefing selbst ist im Chat nicht sichtbar.
- Deutsch (Feld "de"): exakt die Prompts der generate_audio_batch-Calls (Index 0-11, 5/7/12-17, 15/18-23, 24-31, Retry [26, 29, 31]) plus Einzel-Call für s13 (siehe unten). Bram, elevenlabs.
- Albanisch (Feld "sq"): vollständiges sq.json im Higgsfield-sandbox_exec-Befehl (edge-tts sq-AL-IlirNeural, Tempo +0 %). Das ist die an edge-tts übergebene Fassung (Quelle für s01-s30 + intro/outro).
- Bildschirmtexte: Write /home/claude/M09/M09_Projekt/src/texts.js (239 Einträge), danach Änderungen (unten).
- de_script-Feld: nicht vorhanden. Die TTS-Prompts wurden direkt aus vo_script.json erzeugt (Print -> Batch), also Deckungsgleichheit anzunehmen; vo_script selbst ist nie ausgegeben worden (Tool-Ergebnisse stehen nicht im Chat).

## Spätere Änderungen, eingearbeitet
1. s13 (Voiceover): "wie wir im letzten Modul gesehen haben" -> "wie wir in Modul sieben gesehen haben" (DE, per generate_audio neu erzeugt) und SQ "siç pamë në modulin e kaluar" -> "siç pamë në modulin shtatë" (edge-tts neu). M09_vo.json enthält die korrigierte Fassung. Die erste Zip hatte noch die alte Fassung; die zweite Zip (b6fdcdb9...) die neue.
2. texts.js nach Fachprüfung (Subagent-QA), 1 Sed + 9 Replacements:
   - `sq: 'Rradha – hap pas hapi'` -> `'Radha – hap pas hapi'`
   - w3: 'Rrjedhja' -> 'Rrjedha'
   - cC: 'C · Parallelpuffer / entkoppelt' -> 'C · Parallelpuffer – entkoppelt'
   - h14: 'Flussrichtungen prüfen' -> 'Fließrichtungen prüfen'
   - sq 'Ndarës llumi në vend të sitës së kërkuar' -> 'Ndarës llumi në vend të filtrit me sitë'
   - req_both sq: 'Sitë + ndarës llumi' -> 'Filtër me sitë + ndarës llumi'
   - gg_cons sq: 'Konsumatorët' -> 'Qarqet e ngrohjes'
   - sq 'ndoshta depozitë / pufer' -> 'nëse ka: depozitë / pufer'
   - ice sq: 'Akull në shkëmbyes' -> 'Akull në shkëmbyesin e nxehtësisë'
   - v_pipe sq: 'Rrjeti i tubave' -> 'Tubacionet'
   (alle in M09_screen.json angewendet)
- Keine weiteren Text-Edits nach den Turns 4-9 (Foto-Fragen, kein Textwunsch).

## Hinweise
- Szene 13, 28, 29 und die SQ-Bildschirmtexte hat Claude laut Chat selbst geschrieben (Nutzer-Hinweis im Chat: "më i ftohtë" für "kühler" aus dem Briefing, eher "kälter").
- Die Prinzipdarstellung-Beschriftung steht als Eintrag `principle` in texts.js.
- Credit/Bildnachweis (Bosch Thermotechnik GmbH) steht in photo.json/render.js, nicht in screen.json.
