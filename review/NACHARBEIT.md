# Nachrunde (aus den Doppelkontrollen)

Ziel: Jeder Punkt hier wird umgesetzt, das Modul neu gerendert (nur die betroffene(n) Sprache(n), wenn sich die Zeitleiste nicht ändert – sonst beide), dann gezielt nachgeprüft.

## M06 (Freigabe, nur Schönheit)
- SQ s18 Karte `c3` „Kontrollo presionin e sistemit“ – Manometer verdeckt das letzte „t“ → Text kürzen auf „Kontrollo presionin“ ODER Karte/Manometer verschieben. Nur SQ neu.

## M07
- K1 MITTEL: SQ s20 Label `a_gas` „Zona e grumbullimit të ajrit (brenda, sipër)“ läuft rechts aus dem Bild → „Zona e ajrit (brenda, sipër)“ (Layout prüfen). Nur SQ neu.
- K2: s19 Chip `claim1` (DE+SQ): rotes X verdeckt das Ende der durchgestrichenen Behauptung → X versetzen oder Text kürzen, so dass das Ende lesbar bleibt. DE+SQ neu.

## M11 (Freigabe, optional)
- SQ Bild `c21ok` „rruga e kthimit e mbyllur“ → „rruga mbrapsht e mbyllur“ (kthimi = auch Rücklauf).

## M12 (Freigabe, optional)
- DE Bild `c09b` „Alle Ventile gleiche Voreinstellung“ → „Alle Ventile mit gleicher Voreinstellung“.

## M13
- K1 MITTEL: DE s26 „Regelreaktion“ klingt wie „Rege Reaktion“ → neu mit Bram, TTS-Text „Regel-Reaktion“, erst übernehmen, wenn whisper medium „Regelreaktion“ erkennt; Timing s26 DE neu; DE-Startversatz so, dass die letzte Karte höchstens ca. 2 s nach dem Sprechen erscheint.

## M15
- MITTEL: Bildtext `closedv` → DE „Absperrung im Sicherheitsweg“, SQ „Valvulë mbyllëse në rrugën e sigurisë“, termDe „Absperrung im Sicherheitsweg“; Etikett in src/scenesA.js (ca. Z. 287) auf `bv[0] + 40` versetzen (längerer Text) – Standbild s05 (~81 s) DE+SQ prüfen.
- KLEIN: `outro_line` DE „M&B Gebäudetechnik · SHK-Grundlagen“ (Bindestrich) – Outro (~384 s) prüfen.
- DE+SQ neu rendern (kein Ton).

## M04/M05: freigegeben (Ventil-Animation „kurz offen, dann rot“ und Chip-Überstand M04 s07 bewusst belassen – lesbar, fachlich nicht falsch).

## M03 (nur SQ-Bild; s02, s07, s22) – Details review/kontrolle/M03.md
- K1: SQ s02 „depozitime të mundshme gëlqereje“ läuft ins Korrosions-Symbol, „probleme … korrozioni“ ragt über Kartenrand → im SQ beide Elemente nach links, Schrift 24 px.
- K2: SQ s07 Rohr verdeckt termDe „Füll-/Sicherungseinheit“ → CI.pipe-Start `l.sub ? 335 : 300`.
- K3: SQ s22 Fehlerkarte 2: Untertitel auf Kartenrand → bei Umbruch enger setzen.

## M08 – Details review/kontrolle/M08.md
- K1 KRITISCH: s08-Animation: Hahn im Sicherheitsweg von Anfang an als Fehler (rot, offen), keine Schließ-Animation, grünes Badge „Dieser Weg bleibt frei.“ vorher ausblenden; X an den Hahn (nicht auf den Ablauftrichter). (circuit.js valve() Parameter err; system8.js Z.144; scenesA.js D.s08.draw). DE+SQ s08.

## M09 – Details review/kontrolle/M09.md
- K1: s08-Animation wie M08 (system9.js Z.179), X an den Hahn (nicht auf die Sicherheitsgruppe).
- K2: s04 DE+SQ: Etikett „Heizflächen“ überdeckt Zeile → Endpunkt `Q(TR4, 1650, 200)` (scenesA.js Z.204).
- K3: SQ s25 „Njësia e jashtme“ links abgeschnitten → `side:'right'` für SQ (scenesB.js Z.295).
- K4: s15 Chips „Entleeren“/„Füllen“ überlappen → ±45 px auseinander.
- K5: DE s18 Etikett „Systemtrenner“ berührt linken Rand → etwas nach rechts.
- K6: Chip `path_ok` „Schutzweg“ → „Sicherheitsweg“ (SQ entsprechend prüfen); s28 Bildtext „Sicherheitsweg abgesperrt“ → „Absperrung im Sicherheitsweg“ (SQ analog).
- K7: s29 Chip „Rregullimi“ liegt auf dem Reglergehäuse → versetzen.
- Da Szenen über das ganze Video verteilt: DE+SQ komplett neu rendern (Ton unverändert).
