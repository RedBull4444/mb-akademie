# Doppelkontrolle je neu erstelltem Modul (unabhängig vom Ersteller)

Du hast das Video NICHT selbst korrigiert – prüfe kritisch, als ob Fehler drin sind. Ziel: Danach darf an diesem Modul nichts mehr geändert werden müssen.

Umgebung: Higgsfield-Sandbox (`mcp__Higgsfield__sandbox_exec`). Prozesse laufen nur während eines aktiven Befehls; Vordergrund max. ~55 s; lange Jobs mit nohup starten und abfragen. Der Sandbox ist oft „busy“ (andere Agenten rendern) – dann 30–60 s warten und erneut versuchen. Wenige, große Befehle senden. Eigener Arbeitsordner: `~/check/mXX/`. Keine base64-Dumps aus dem Sandbox.

## Eingaben
- Fertige Videos: `~/out/Mxx_DE.mp4`, `~/out/Mxx_SQ.mp4`
- Projekt (korrigiert): `~/proj/Mxx/…` (texts.js, vo_script.json bzw. timing.json, vo/), Original-Backup daneben (`*_orig`)
- Soll-Korrekturen: `~/site/review/VIDEO-KORREKTUREN.md` (vorher `cd ~/site && git pull -q origin main`), Befunde `~/site/review/befunde/Mxx.md`
- Lokal lesbar: /home/claude/mb-akademie/review/… (gleiche Dateien), Glossar review/sq-glossar.md, Quiz content/quiz/Mxx.json

## Prüfen
1. **Alle Korrekturen umgesetzt?** Jede Zeile der Liste für Mxx (inkl. Abschnitt A) abhaken – im Projekttext UND im fertigen Video (Standbild bzw. Ton).
2. **Kompletter Sprechtext DE** (vo_script bzw. neue Clip-Texte): Rechtschreibung, Grammatik, fachliche Richtigkeit (DIN EN 12828, DIN 1988/EN 806, DIN 4753, VDI 2035, DVGW W 551), keine Widersprüche zu Bildtexten/Quiz.
3. **Kompletter Sprechtext SQ**: Grammatik, Diakritika, gleicher Inhalt wie DE, Begriffe wie Glossar/Quiz.
4. **Alle Bildtexte (texts.js) DE + SQ**: wie 2./3.
5. **Ton prüfen**: das fertige DE-Video komplett mit faster-whisper `medium` (language=de) transkribieren und gegen den Soll-Text abgleichen – Abweichungen anhören (Ausschnitt erneut mit medium) und bewerten (Aussprache, fehlende/doppelte Wörter, abgeschnittene Sätze an den neuen Clips). SQ: an den neu vertonten Szenen prüfen, dass Clip-Länge/Pausen stimmen und nichts abgeschnitten ist (Stille-Analyse an Anfang/Ende der Szene).
6. **Bild prüfen**: für BEIDE Sprachen je Szene mind. 1 Standbild (zur Mitte der Szene, Szenenzeiten aus `node render.js info …` bzw. tl.json) ziehen, mit ImageMagick `montage -tile 3x3 -geometry 640x360+4+4` zu Übersichten packen und mit `image_paths` ANSEHEN (≤ 512 KiB pro Aufruf). Achte auf: falsche/alte Texte, abgeschnittene oder überlappende Schrift, falsche Sprache im Bild, leere Stellen.
7. **Technik**: Dauer DE = SQ (ffprobe), Größe < 25 MiB, H.264/AAC, faststart, keine Ton-Aussetzer an den Schnittstellen der neuen Clips.

## Ergebnis
- Wenn du eindeutige Fehler findest, die nur Bildtext/SQ-TTS betreffen: NICHT selbst rendern, sondern exakt beschreiben (Ort, jetzt, richtig).
- Schreibe `/home/claude/mb-akademie/review/kontrolle/Mxx.md`: Checkliste der Korrekturen (✓/✗), alle Befunde mit Schwere (KRITISCH/MITTEL/KLEIN), Fazit „FREIGABE“ oder „NACHARBEIT NÖTIG“.
- Antwort an mich (Deutsch, knapp): Fazit + jeder Befund in einer Zeile.
