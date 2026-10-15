# Anleitung: Video-Korrekturen umsetzen (je Modul)

Alles läuft im **Higgsfield-Sandbox** über `mcp__Higgsfield__sandbox_exec` (Linux, 8 Kerne, ffmpeg, node, python3 mit faster-whisper, edge-tts installierbar per pip).
WICHTIG Sandbox-Verhalten: Prozesse laufen NUR, solange gerade ein sandbox_exec-Befehl aktiv ist; ein Vordergrundbefehl darf max. ~55 s dauern (sonst 502).
Lange Jobs deshalb: `nohup … > log 2>&1 &` starten und dann mit `sleep 50; tail log` (timeout_seconds 60) wiederholt abfragen, bis fertig. Nie `sleep` > 55.

## Quellen
- Korrekturliste: `~/site/review/VIDEO-KORREKTUREN.md` (vorher `cd ~/site && git pull -q origin main`). Abschnitt A = modulübergreifend (Outro-Satz SQ „Moduli … përfundoi.“, Intro-Kicker „BAZAT E SHK-SË“/„SHK-GRUNDLAGEN“, „valvulë“), Abschnitt B = je Modul. Befund-Details: `~/site/review/befunde/Mxx.md`.
- Projekt: `~/proj/Mxx/` (darin ggf. Unterordner `Mxx_Projekt` / `Mxx_Projekt_editierbar`). README.md / LIESMICH_STAND.txt / src/README.md lesen: dort stehen Build-Schritte, Timing-Werkzeug (z. B. vo_timing_sil.py, tools/mess_pausen.py, sil.json → timing.json), Edge-TTS-Tempo und Reihenfolge.
- Wahrheit für den aktuellen Text ist die Projektdatei (vo_script.json / timing.json / texts.js), nicht die Liste – Ersetzungen immer gegen den Projekttext prüfen. Wenn ein „Jetzt“-Zitat nicht exakt passt (Abtippfehler, v. a. M02), die gemeinte Stelle sinngemäß finden; im Zweifel melden.

## Ablauf je Modul
1. Backup: `cp -a <projekt> <projekt>_orig` (einmalig).
2. **Bildtexte**: in `src/texts.js` die Bild-Korrekturen (DE/SQ) einsetzen. Danach `node -e "require('./src/texts.js')"` o. ä. bzw. Render-Info laufen lassen, um Syntaxfehler auszuschließen.
3. **Sprechtexte**: `vo_script.json` anpassen (falls vorhanden; sonst Sprechtext-Datei des Projekts).
4. **Neue Sprachaufnahmen NUR für geänderte Szenen**:
   - SQ: `pip install --break-system-packages edge-tts` (falls fehlt), Stimme `sq-AL-IlirNeural`, Tempo wie im Projekt dokumentiert (M01–M07 meist `-6%`, ab M08 `+0%` – im README/Skript nachsehen). Ausgabe im selben Format/Dateinamen wie die vorhandenen Clips (mp3 oder opus – siehe vo/sq/). Kostenlos.
   - DE: Stimme „Bram“: `mcp__Higgsfield__generate_audio_batch` mit params `{model:'text2speech_v2', variant:'elevenlabs', voice_id:'549ff70a-3ee7-4f04-a4d9-89a24fab7709', voice_type:'preset', prompt:<kompletter Szenentext>}`; danach `mcp__Higgsfield__jobs_wait` (timeout 15, wiederholen), Ergebnis-URL im Sandbox mit curl laden und ins Projektformat konvertieren (ffmpeg). Kostet ~0,6 Credits pro Clip – nur wirklich geänderte DE-Szenen, keine Testläufe.
   - Lautschrift-Konventionen beibehalten (Es-Ha-Ka, Em-A-Ge, Fau-Deh-I, Zahlen als Wörter). Originalclip vorher als `<name>.orig.<ext>` sichern.
   - Pegel: neue Clips werden in audio.py ohnehin auf −16 LUFS normalisiert (Gesamtspur); trotzdem prüfen, dass der neue Clip ähnlich laut ist (ffmpeg loudnorm-Messung) und am Anfang/Ende keine langen Stillen hat (an Original angleichen).
5. **Timing neu**: mit dem Projektwerkzeug die Satz-Zeitpunkte der geänderten Clips neu messen und timing.json aktualisieren (Struktur exakt beibehalten). Bei M01/M02 ohne Werkzeug: Satzanfänge per Stille-Erkennung bzw. faster-whisper (word_timestamps) bestimmen, `dur`, `starts`, `end`, `txt` wie im vorhandenen Eintrag füllen. Prüfen: Anzahl `starts` = Anzahl Sätze/Cues, die die Szene erwartet (Szenencode ansehen).
6. **Rendern** (DE und SQ, komplett): Build-Skript des Projekts bzw. `node render.js info …` + `node render.js video <lang> <order|all> out.mp4`, `python3 audio.py …`, mux – genau wie im Projekt. `cd src && npm install` falls node_modules fehlt. DE und SQ können parallel laufen (nohup).
7. **Web-Kodierung** (Cloudflare-Limit 25 MiB pro Datei!): `ffmpeg -i <mux.mp4> -c:v libx264 -preset medium -b:v <rate> -maxrate <2×rate> -bufsize <4×rate> -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -movflags +faststart ~/out/Mxx_DE.mp4` – Rate so wählen, dass die Datei ≤ 24,5 MB wird (Ziel ≈ 23,5 MB: rate_kbit ≈ 23.5e6*8/dauer/1000 − 128). Ebenso `~/out/Mxx_SQ.mp4`.
8. **Prüfen** (Pflicht):
   - Dauer beider Dateien (ffprobe) notieren; Größe < 25 MiB.
   - Für jede geänderte Szene: 2–3 Standbilder aus dem fertigen Video ziehen (ffmpeg -ss … -frames:v 1, scale=960) und mit `image_paths` ANSEHEN – Text korrekt, nichts abgeschnitten/überlappend, Layout ok.
   - Neue DE-Clips mit faster-whisper (Modell small oder medium, language=de) abhören: stimmt der Wortlaut, keine falsche Aussprache (z. B. „Waudi“).
   - Ton/Bild synchron an den geänderten Stellen (Satzanfang ↔ Einblendung grob prüfen per Standbild zum Satzzeitpunkt).
   - Stichprobe: Anfang, Mitte, Ende des Videos je ein Standbild.
9. Nicht deployen, nichts unter `~/site/public/videos` ändern.

## Bericht (an den Auftraggeber, Deutsch, knapp)
Je Modul: welche Szenen (Ton DE/SQ) und Bildtexte geändert wurden, alte → neue Videodauer (Sekunden, 1 Nachkommastelle) DE und SQ, Dateigrößen, Prüfergebnis, verbrauchte DE-Clips, alles was nicht umgesetzt werden konnte oder unsicher ist.
