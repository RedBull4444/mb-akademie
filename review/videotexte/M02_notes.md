# M02 Trinkwasser-MAG (Trinkwasser-Ausdehnungsgefäß) – Notizen

Chat: https://claude.ai/chat/4c5a28d0-4c2f-4efe-b8b5-cc082178b780 ("M&B Modul 2 Final", 16 Turns, 05.10.2026). Nur dieser Chat verwendet.

## Quellen (Turn-Nummern wie von read_conversation)
- vo_script.json: Turn 7, Write nach /home/claude/m2/vo_script.json (intro, s01-s19, outro = 21 Szenen).
- Spätere Änderung an vo_script.json: Turn 9, Python-Skript ersetzt s17 und s18 (de + sq) durch gekürzte Fassungen ("Szene 17/18 verkürzt"). In M02_vo.json ist bereits die gekürzte Fassung enthalten (nicht die ursprünglich geschriebene längere s17-Aufzählung "Erstens ... Sechstens" und nicht das ursprüngliche s18).
- DE-TTS (was gesprochen wurde, Bram voice_id 549ff70a-3ee7-4f04-a4d9-89a24fab7709):
  - intro, s02, s03, s04: Turn 9 (generate_audio_batch idx 0,2,3,4; Credits liefen aus, s01 und s05+ brachen ab).
  - s01, s05-s19, outro: Turn 11 (generate_audio_batch idx 0-16; s09 wurde zweimal mit identischem Text gesendet). Maschinell aus dem Chat-Dump extrahiert.
  - TTS-Prompts sind textgleich zum (aktualisierten) vo_script-de; "M-A-G" steht bereits im vo_script-de selbst (s02, s12, s13, s15, s17, s19), daher kein separates "de_script"-Feld.
  - Nutzer-Feedback Turn 12: "deutsche stimme passt perfekt albanische auch" - keine Neuaufnahmen danach.
- SQ (edge-tts sq-AL-IlirNeural, rate -6 %): Turn 9, sq.json Sandbox-Heredoc (Text = vo_script sq; s17/s18 danach mit neuem Text neu erzeugt).
- Bildschirmtexte: Turn 9 Write /home/claude/m2/src/texts.js; Endstand = Sandbox-Heredoc `cat > texts.js <<'EOF_TX'` in Turn 13 (Übertragung des lokalen Files; 125 Einträge), maschinell extrahiert und per node als JSON ausgegeben. Keine späteren Edits an texts.js gefunden.

## Zu beachten / Lücken
- M02_vo.json SQ-Texte (und DE für intro/s02/s03/s04) wurden von mir aus dem inline gelesenen Chatinhalt (Turn 7/9) per Hand übernommen, nicht maschinell extrahiert (diese Turns waren nicht als Datei gespeichert). DE für s01/s05-outro sowie die kompletten Bildschirmtexte sind maschinell extrahiert. Stichprobenprüfung empfohlen für SQ.
- Hart codierte Bildschirmtexte im Szenencode (nicht in texts.js) wurden nicht erfasst; Outro-Credit (render.js, Foto): "Tony Webster, Wikimedia Commons, CC BY 2.0" + Musik "Rest Now" (Eugenio Mininni, Mixkit) - genauer Wortlaut des CREDIT-Strings nicht geprüft.
- Eintrag `s01_small` hat sq 'Trinkwasser-MAG' (unübersetzt, wie im File).
- Intro-DE-Prompt: "Es-Ha-Ka Grundlagen. Modul 2. Das Trinkwasser-Ausdehnungsgefäß." (vo_script de ist identisch).
- Chat-Hinweis: Szenen 17/18 und einige SQ-Bildschirmtexte stammen von Claude (nicht im Briefing); kein Muttersprachler-Review im Chat.
- Szenen-Reihenfolge Video: intro, s01..s19, outro.
