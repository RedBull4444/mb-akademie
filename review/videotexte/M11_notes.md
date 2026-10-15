# M11 Umwälzpumpe und Rückschlagventile – Notizen

Chat: https://claude.ai/chat/08d5f4b5-ae75-4519-9477-948931a5b88f ("M&B Modul 11", 6 Turns, 11.10.2026)

## Quellen (Turn 3)
- vo_script.json: Write /home/claude/M11/vo_script.json (33 Schlüssel: intro, s01-s31, outro). Briefing-Text vollständig übernommen (Nutzer wählte "Texte komplett ~8 Min"). Fehlerszene (15 Fehler) hatte im Briefing keinen Sprechtext und wurde von Claude ergänzt.
- Deutsch ("de"): Prompts der generate_audio_batch-Calls (Teil 1: 0-11, Teil 2: 12-23, Teil 3: 24-32, Nachreichung [7, 9, 22, 24], identische Prompts). Alle zeichengleich zu vo_script-"de". Aussprache-Konventionen im DE-Text: "Es-Ha-Ka", "Em-A-Ge", Δp-c = "Delta-Pe-Ze", Δp-v = "Delta-Pe-Vau".
- Albanisch ("sq"): sq.json im Higgsfield-sandbox_exec-Befehl (edge-tts sq-AL-IlirNeural, +0 %) zeichengleich zu vo_script-"sq" (maschinell geprüft).
- Bildschirmtexte: Write /home/claude/M11/src/texts.js (193 Einträge; enthalten gezeichnetes Δ in den Bildern, Strings als Text hier mit Δ-Symbolen wie im Quelltext).

## Spätere Änderungen
- Keine gefunden: kein Edit auf vo_script.json oder texts.js nach dem Write, keine neu erzeugten Einzelclips mit anderem Text. Turn 4 (Nutzer: nur ZIP-Upload) und Turn 5 (Rendern, Mischen, Produktionsübersicht) ändern keine Texte.

## Hinweise
- Der Nutzer lud die Audio-Zip (Turn 4) hoch; im Chat ist keine Textkorrektur danach sichtbar.
- Bildnachweise/Fotoquellen (KlimaWorld, alternative-haustechnik.de) stehen in photo.json, nicht in screen.json.
- Nicht verifiziert: ob die Szenen-Dateien (scenesA/B.js) irgendwo hartcodierte Texte enthalten (Regex-Stichprobe: nichts).
