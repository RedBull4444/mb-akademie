# M08 Warmwasserspeicher anschließen – Notizen

Chat: https://claude.ai/chat/4eba9d13-71f0-4ccb-bbea-a5dddcfa119e ("M&B Modul 8", 8 Turns, 08./09.10.2026)

## Quellen (alles aus Turn 3 des Chats)
- vo_script.json: Write-Call nach /home/claude/M08/vo_script.json (28 Schlüssel: intro, s01-s26, outro).
- Deutsche TTS-Prompts: mcp__Higgsfield__generate_audio_batch (4 Batches: Index 0-11, 12-23, 24-27, Retry [5, 20]), voice_id 549ff70a-... (Bram), elevenlabs/text2speech_v2. Alle Prompts sind zeichengleich zum vo_script-"de" (also kein de_script-Feld nötig). Die Retry-Prompts für s05 und s20 sind identisch zu den Erst-Prompts.
- Albanisch: sq.json im Higgsfield-Sandbox-Befehl (edge-tts sq-AL-IlirNeural) ist zeichengleich zum vo_script-"sq". Ilir lief mit normalem Tempo (Turn 5: "±0 %", nicht -6 %).
- Bildschirmtexte: Write-Call /home/claude/M08/src/texts.js (const T = {...}, 192 Einträge). Feld "term: true" heißt: im SQ-Video steht der deutsche Text (de) klein unter dem albanischen. Wurde in der JSON als "term": true übernommen.

## Spätere Änderungen, eingearbeitet
- texts.js, Eintrag `chk`: sq 'Kontroll para funksionimit' -> 'Kontroll para nisjes' (Python-replace in Turn 3, nach dem Write). In M08_screen.json ist bereits die geänderte Fassung.
- Keine Edit-Tool-Calls, kein Neu-Generieren von Clips mit geändertem Text; kein Änderungswunsch des Nutzers an Sprechtexten. Turn 7 (Rendern) ändert keine Texte.

## Hinweise / Unsicherheiten
- Szene s24 (typische Fehler) hatte im Briefing keinen Text; Claude hat DE+SQ selbst geschrieben (laut Chat vom Nutzer/Muttersprachler zu prüfen).
- Das Briefing wurde laut Chat um ca. 15 % gekürzt (Füllwörter); vo_script ist die gekürzte Fassung.
- Ob die Szenen Strings außerhalb von texts.js hartcodiert enthalten, wurde stichprobenartig per Regex geprüft (nichts gefunden). Nicht in screen.json: Bildnachweis/Credit im Abspann (render.js CREDIT, nicht sichtbar im Chat).
