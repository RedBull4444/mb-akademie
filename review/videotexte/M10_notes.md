# M10 Wärmepumpen-Hydraulik – Notizen

Chat: https://claude.ai/chat/3a4b2765-1cf9-447a-80b2-4730977a6857 ("M&B Modul 10", 28 Turns, 09.-11.10.2026)

## Quellen
- vo_script.json: im Chat per Python-Heredocs aufgebaut; ich habe die Skripte nachgespielt: (1) Bash-Call "vo10.py" (zweite Fassung, Briefing-nah, nach der AskUserQuestion), (2) Bash-Call mit Dict `U` (Straffung auf ca. 6 Min, überschreibt de/sq vieler Szenen), (3) Bash-Call "Präzisiert Szene 20 im Skript" (s20 de+sq). Ergebnis: 31 Schlüssel (intro, s01-s29, outro).
- Deutsch ("de"): Prompts der generate_audio_batch-Calls in Turn 3 (Index 0-11, [3,5,10,12,13,14], [13,15-18], [16,19-21], [22-25], [26-29], [30]; Wiederholungen identisch). Alle zeichengleich zur nachgespielten vo_script (kein de_script nötig). Der s20-Prompt enthält die präzisierte Fassung (Edit lag vor dem Batch).
- Albanisch ("sq"): vo_script-sq; bestätigt durch das in Turn 25 an edge-tts (sq-AL-IlirNeural, +0 %) übergebene SQ-JSON (12 Szenen stichprobenartig zeichengleich geprüft: intro, s01, s05, s09, s13, s16, s20, s21, s26, s27, s28, s29). Hinweis: im SQ-Sprechtext steht "bajpas/bajpasi" (Aussprache), im Bild "bypass".
- Bildschirmtexte: Write /home/claude/M10_Projekt_editierbar/src/texts.js (Turn 3), 188 Einträge.

## Spätere Änderungen an texts.js, eingearbeitet
- Turn 3: sed `termDe: 'Reihenpuffer ≠ Entkopplung'` -> `'Reihe statt Entkopplung'`.
- Turn 5 (nach Fachcheck): pump2 -> de 'eigene Pumpe im Verbraucherkreis' / sq 'pompë e veçantë në qarkun e konsumatorëve' / termDe 'Pumpe Verbraucherkreis'; kb_d -> 'Wasservolumen + Bypass oder andere freigegebene Lösung' / 'vëllim uji + bypass ose zgjidhje tjetër e lejuar' / termDe 'Wasservolumen + gesicherter Weg'; c28a -> 'Heizungswasser / zusätzliches Wasservolumen' etc.; fin -> 'Wasservolumen · Volumenstrom · Hydraulik – nur gemeinsam' / 'Vëllimi i ujit · prurja · hidraulika – vetëm së bashku' / termDe 'nur gemeinsam'; ex_buf: '(Buderus)' vorübergehend entfernt.
- Turn 27: sed setzt ex_buf wieder auf 'Beispiel: Pufferspeicher (Buderus)' / 'Shembull: depozitë akumuluese (Buderus)' und ex_ov auf 'Beispiel: Differenzdruck-Überströmventil (Caleffi)' / 'Shembull: valvul bypass-i (Caleffi)' (nach Foto-Einbau). M10_screen.json enthält diesen Endstand. Alle 7 Replacements/Seds ließen sich exakt anwenden.
- Turn 5 hat außerdem Szenen-Code geändert (Farben, Layout), aber keine Sprechtexte.

## Hinweise / Unsicherheiten
- Turn 5 und Turn 25/27 waren kurz genug, um inline gelesen zu werden; deren Texte (Replace-Dict, sed) habe ich daraus abgetippt, nicht automatisch extrahiert. Die Anwendung scheiterte nirgends (alle Such-Strings fanden Treffer im ursprünglichen texts.js).
- Das Briefing-Original ist nicht Teil dieser Ausgabe; vo_script ist die gestraffte Fassung (Nutzerwahl "Mittelweg ca. 6 Min"). Endvideo 7:01.
- Bildnachweis (photo.json credits: "Fotos: Buderus Logalux P120–P300 (Bosch Thermotechnik GmbH), Caleffi Serie 519 (Caleffi S.p.A.) – Beispiele") steht nicht in screen.json.
