# M03 Nachfülleinheit und Wasseraufbereitung – Notizen

Chat: https://claude.ai/chat/da1676a7-a222-425b-841b-6b25bffaf7a4 ("M&B Modul 3 Final", 6 Turns, 07.10.2026). Nur dieser Chat verwendet. Alle Texte maschinell aus dem Chat-Dump extrahiert (kein Abtippen).

## Quellen (Turn-Nummern wie von read_conversation)
- vo_script.json: Turn 3, Write nach /home/claude/M03_Projekt/vo_script.json (26 Szenen: intro, s01-s24, outro).
- Spätere Änderungen an vo_script.json (alle Turn 3, direkt nach dem Write, vor der Sprachgenerierung; in M03_vo.json angewendet):
  1. SQ s18: "izolimi i njësisë" -> "hermeticiteti i njësisë"; SQ s24: "matjet, izolimi dhe" -> "matjet, hermeticiteti dhe".
  2. s22 (de + sq) komplett durch eine gekürzte Fassung ersetzt ("Typische Fehler. Der Trinkwasserschutz fehlt. Ein einfacher Rückschlag ...").
- DE-TTS (was gesprochen wurde, Bram 549ff70a-3ee7-4f04-a4d9-89a24fab7709): Turn 3, generate_audio_batch, Indizes 0-25 = intro, s01-s24, outro (idx 4, 8, 15 wurden wegen Rate-Limit zweimal gesendet, gleicher Text). Alle 26 TTS-Prompts sind textgleich zum aktualisierten vo_script-de (kein "de_script"-Feld nötig). Phonetik steht schon im Script: "Es-Ha-Ka", "Modul drei", "Systemtrenner Typ Be-A".
- Nutzer-Freigabe Turn 4: "voiceover passen" -> keine Änderung/Neuaufnahme danach (Turn 5 enthält keine generate_audio-Aufrufe).
- SQ: Turn 3, sq.json im Sandbox-Heredoc, edge-tts sq-AL-IlirNeural rate -6 %. Maschinell mit dem vo_script-sq (nach Edits) verglichen: identisch (26/26).
- Bildschirmtexte: Turn 5, Write /home/claude/M03_Projekt/src/texts.js (190 Einträge), maschinell extrahiert und per node als JSON ausgegeben.

## Spätere Änderungen an texts.js (Turn 5, nach Faktencheck durch Subagent; in M03_screen.json angewendet)
- s01_ves: { de 'mit Aufbereitungspatrone' -> 'Variante mit Aufbereitungspatrone'; sq 'me fishek trajtimi' -> 'Variant me fishek trajtimi'; termDe 'mit Aufbereitungspatrone' -> 'Variante mit Aufbereitungspatrone' }
- gauge_p sq: "Manometri tregon presionin – jo rrjedhjen" -> "Manometri tregon presionin – jo debitin"
- Keine weiteren Edits an texts.js gefunden. Das gerenderte Video (7:32 DE und SQ) wurde nach diesen Änderungen neu gerendert.

## Zu beachten / Lücken
- Hart codierte Texte im Szenencode (nicht in texts.js) und Fotocredits aus photo.json ("Foto: Buderus (Logafix Nachfüllkombination)" bzw. "... mit VES Kit)") + Musik-Credit im Outro wurden nicht in screen.json aufgenommen. Im Bild steht außerdem "Beispiel: Logafix Nachfüllkombination (Buderus)" (Key s01_ex in texts.js).
- Einträge mit `term: true`: bei SQ steht der deutsche Begriff klein darunter; `termDe` überschreibt.
- Chat-Hinweis: Die albanischen Bildschirmtexte außerhalb des Briefings stammen von Claude (kein Muttersprachler-Review im Chat).
- Szenen-Reihenfolge Video: intro, s01..s24, outro.
