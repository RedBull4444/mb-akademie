# M00 Einführung – Notizen

Chat: https://claude.ai/chat/7343aff4-54e1-4921-9325-ea85d7b9f263 ("M&B Einführung", 22 Turns, 12.10.2026). Nur dieser Chat verwendet.

## Quellen
- vo_script.json: Turn 11 (Bash heredoc `cat > vo_script.json`, Neufassung nach User-Feedback; die erste, informative 12-Szenen-Fassung wurde verworfen, nicht verwendet). Danach in Turn 13/15/17/19/21 nur gelesen, nie mehr geändert.
- DE-TTS-Prompts: Turn 11, generate_audio_batch (Bram idx 0-6, Andre idx 10-16). Prompt-Strings für Andre sind identisch mit dem vo_script-de-Text (Es-Ha-Ka / Emmundbeh bereits im Script phonetisch). Final gewählt: Andre (voice_id f1e8226e-2248-4d5f-b43c-0a79e9949dbf), Turn 12 "wir nehmen andre". Bram-Prompts identisch im Text.
- SQ: Turn 19, sq.json im Sandbox-Heredoc (edge-tts sq-AL-IlirNeural, rate +0%); Text identisch mit vo_script sq.
- texts.js (Bildschirmtexte): Turn 13 (Write nach src/texts.js). Danach keine Änderung gefunden.

## Spätere Änderungen
- Keine Textänderungen nach Turn 11/13. Nur Timing/Layout (Pausen von Ilir gekürzt, Logo-Position, Kartenanimation) - ohne Textwirkung.
- In vo_script.json steht "Los geht's" mit geradem Apostroph; in texts.js (Bildschirm) 'Los geht’s!' mit typografischem Apostroph.
- Aussprache-Schreibweisen im Script: "Es-Ha-Ka" (= SHK), "Emmundbeh" (= M&B), "fünfzehn", "Modul eins" (Zahl als Wort). In SQ bleibt "Es-Ha-Ka" so stehen.
- Im Video erscheint nie "Modul 0".

## Besonderheiten / Lücken
- Die Intro-Szene "intro" in vo_script gesprochen: "Willkommen beim Es-Ha-Ka Lehrgang von Emmundbeh Gebäudetechnik!" - auf dem Bildschirm steht aber nur "Willkommen!" + "SHK-LEHRGANG" (kein M&B-Text auf Screen).
- Verworfene V1 (informativ, 12 Szenen s01-s12) NICHT erfasst; ihr Text steht nur in den Turns davor (Turn 1-10).
- Hinweis aus dem Chat: albanischer Text noch nicht von Muttersprachler geprüft.
- Screen-Einträge `modules` ("module") wird als Zähler-Suffix hinter einer Zahl 1-15 angezeigt.
