# M01 MAG Heizung – Notizen

Chat: https://claude.ai/chat/15665fdd-071b-42f6-953f-b1d43140be06 (Titel "M&B Modul 1 Final", früher "Test"; V2, 8 Turns, 05.10.2026). Nur dieser Chat verwendet (V1-Chats nicht nötig).

## Quellen (Turn = Nummerierung von read_conversation)
- vo_script.json: Turn 1, Write nach /home/claude/m01v2/vo_script.json (17 Szenen: intro, s01-s15, outro) + 1 Edit direkt danach: SQ s13 "këtu me valvul mbyllëse" -> "këtu me valvulë mbyllëse" (in M01_vo.json bereits angewendet). Maschinell aus der kompakten Kopie vo.json (Turn 5, Sandbox-Heredoc) extrahiert, identisch mit Write+Edit.
- DE-TTS (was gesprochen wurde): Turn 1, generate_audio_batch (Bram, voice_id 549ff70a-3ee7-4f04-a4d9-89a24fab7709). Bei allen Szenen ist der Prompt gleich dem vo_script-de, nur "MAG" -> "M-A-G" (in M01_vo.json maschinell so abgeleitet und gegen die gelesenen Prompt-Strings geprüft; Prompts selbst wurden gelesen, nicht per Skript kopiert).
- Intro-DE neu: Turn 3 (nach User-Feedback Turn 2 "auf deutsch sagt er SHK auf englisch"): Variante 1 "Es-Ha-Ka-Grundlagen. Modul 1: das Membran-Ausdehnungsgefäß." wurde regeneriert und vom User bestätigt (Turn 4 "ja passt die 1. version nicht die alternative"). Ursprünglicher Intro-Prompt war "S-H-K-Grundlagen. ...". Alternative (nicht genommen): "Ess Haa Kaa Grundlagen. ...". In Turn 5 wurde das neue intro.mp3 (job cdf78a58...) in vo/de/ eingesetzt.
- SQ: Turn 1, edge-tts sq-AL-IlirNeural rate -6 %, Text = vo_script sq (nach Edit).
- Bildschirmtexte: texts.js. Basis Write in Turn 5 (Intro + Szenen 1,4,5,6), Turn 7 Python-Patch mit allen restlichen Einträgen, Endstand = Sandbox-Heredoc "texts.js" in Turn 7 (Zeile ~1256 der Ausgabe), maschinell extrahiert und per node als JSON ausgegeben -> M01_screen.json (102 Einträge).

## Spätere Änderungen
- Nur SHK-Intro-Fix (s.o.) und der eine SQ-Edit (valvulë). Keine weiteren Edits an vo_script.json oder texts.js nach Turn 7 gefunden; keine weiteren regenerierten Audio-Clips (keine generate_audio_batch-Aufrufe in Turn 5/7).

## Zu beachten / Lücken
- Zusätzlich zu texts.js stehen im Szenencode (scenes.js/scenes2.js) hart codierte Bildschirmtexte, nicht in T: u.a. 'MAG' (Beschriftung am Bauteil), '≠' (in "MAG ≠ Sicherheitsventil"), '?'. Nicht einzeln erfasst.
- Outro-Credit (CREDIT in render.js, nicht in texts.js): "Foto MAG: „The RedBurn“, Wikimedia Commons, CC BY-SA 4.0" (immer so, auch bei SQ).
- Es gibt keine SQ-Aussprache-Anpassung im sq-Text ("MAG" bleibt "MAG"; wird von Ilir gesprochen).
- Einträge mit `term: true` in screen.json: bei SQ erscheint der deutsche Fachbegriff (de) klein darunter; `termDe` überschreibt den Untertitel.
- Chat-Hinweis: Albanische Sätze in Szene 1-3, 8, 10-13, 15 und SQ-Bildschirmtexte (z. B. "Linja e dërgimit") stammen von Claude, kein Muttersprachler-Review im Chat.
- Szenen-Reihenfolge Video: intro, s01..s15, outro.
