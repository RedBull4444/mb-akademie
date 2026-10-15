# Video-Korrekturen (Ton und Bild) – M&B Akademie, Module M00–M15

Stand: 15.10.2026. Quelle: Prüfberichte `review/befunde/M00.md` … `M15.md`, Texte aus `review/videotexte/Mxx_vo.json` / `Mxx_screen.json`.
Die App-Seite (Quiz, Lernziele, Kernpunkte) ist bereits korrigiert und an die Videobegriffe angeglichen (siehe `review/sq-glossar.md`, Abschnitt „2. Durchgang“). Diese Liste enthält **nur Änderungen an Ton und Bild der Videos**.

**Aufgenommen:** alle KRITISCH- und MITTEL-Befunde, die Ton oder Bild betreffen; KLEIN nur, wenn etwas hör- oder sichtbar falsch ist (Rechtschreibung/Grammatik im Bild, falsche Wortbedeutung, hörbarer Grammatik-/Logikfehler). Reine Stil- und Einheitlichkeitswünsche (KLEIN) sind nicht aufgenommen.

**So lesen:**
- **Ton DE** – „Neu“ ist der komplette Text der Szene, so wie er an die deutsche TTS-Stimme geht (Feld `de` in `Mxx_vo.json`, Lautschrift wie „Es-Ha-Ka“, „Em-A-Ge“, „M-A-G“, „Fau-Deh-I“, Zahlen als Wörter beibehalten). Die ganze Szene neu erzeugen und gegen den alten Clip schneiden.
- **Ton SQ** – „Neu“ ist der komplette Szenentext für edge-tts `sq-AL-IlirNeural` (rate −6 %). In neu zu vertonenden SQ-Szenen ist „valvul“ gleich mit zu „valvulë“ korrigiert (Endungs-ë ist stumm, kein eigener Grund).
- **Ton „Jetzt“** zitiert nur die geänderten Stellen; „Neu“ ist immer die ganze Szene. Änderungen sind so klein wie möglich gehalten.
- **Bild** – Schlüssel aus `Mxx_screen.json`. *Bild DE* erscheint im deutschen Video; steht beim Eintrag `term: true`, erscheint der DE-Text zusätzlich klein im SQ-Video. *Bild SQ (termDe)* = kleiner deutscher Untertitel im SQ-Video. Bei längeren neuen Texten das Layout prüfen.
- Nicht mehr aufgeführt: M06 „Modul 16“ (Ton DE+SQ und Bildtext `m16` sind bereits aus dem Video geschnitten).
- M02: Die SQ-Sprechtexte wurden aus dem Chat abgetippt – vor der Neuvertonung den alten Ton gegen den Text abhören (Abtippfehler möglich).

## A. Modulübergreifende Punkte

### A1. Albanischer Outro-Satz „Moduli … përfunduar“ (Ton SQ) und Bild „MODULI n PËRFUNDUAR“

Ein Partizip ohne „u“/„i“ ist kein albanischer Satz. M01 spricht schon richtig „Moduli 1 përfundoi.“ – nur sein Bildtext ist falsch. Betroffen: Ton SQ M02–M15, Bild SQ M01–M15 (`outro_done`), dazu M15 `outro_all`.

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| A1.1 | MITTEL | Bild SQ | M01 scr:outro_done | „MODULI 1 PËRFUNDUAR“ | MODULI 1 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.2 | MITTEL | Bild SQ | M02 scr:outro_done | „MODULI 2 PËRFUNDUAR“ | MODULI 2 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.3 | MITTEL | Ton SQ | M02 vo:outro | „Moduli 2 përfunduar.“ | Moduli 2 përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.4 | MITTEL | Bild SQ | M03 scr:outro_done | „MODULI 3 PËRFUNDUAR“ | MODULI 3 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.5 | MITTEL | Ton SQ | M03 vo:outro | „Moduli tre përfunduar.“ | Moduli tre përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.6 | MITTEL | Bild SQ | M04 scr:outro_done | „MODULI 4 PËRFUNDUAR“ | MODULI 4 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.7 | MITTEL | Ton SQ | M04 vo:outro | „Moduli katër përfunduar.“ | Moduli katër përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.8 | MITTEL | Bild SQ | M05 scr:outro_done | „MODULI 5 PËRFUNDUAR“ | MODULI 5 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.9 | MITTEL | Ton SQ | M05 vo:outro | „Moduli pesë përfunduar.“ | Moduli pesë përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.10 | MITTEL | Bild SQ | M06 scr:outro_done | „MODULI 6 PËRFUNDUAR“ | MODULI 6 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.11 | MITTEL | Ton SQ | M06 vo:outro | „Moduli gjashtë përfunduar.“ | Moduli gjashtë përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.12 | MITTEL | Bild SQ | M07 scr:outro_done | „MODULI 7 PËRFUNDUAR“ | MODULI 7 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.13 | MITTEL | Ton SQ | M07 vo:outro | „Moduli shtatë përfunduar.“ | Moduli shtatë përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.14 | MITTEL | Bild SQ | M08 scr:outro_done | „MODULI 8 PËRFUNDUAR“ | MODULI 8 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.15 | MITTEL | Ton SQ | M08 vo:outro | „Moduli tetë përfunduar.“ | Moduli tetë përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.16 | MITTEL | Bild SQ | M09 scr:outro_done | „MODULI 9 PËRFUNDUAR“ | MODULI 9 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.17 | MITTEL | Ton SQ | M09 vo:outro | „Moduli nëntë përfunduar.“ | Moduli nëntë përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.18 | MITTEL | Bild SQ | M10 scr:outro_done | „MODULI 10 PËRFUNDUAR“ | MODULI 10 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.19 | MITTEL | Ton SQ | M10 vo:outro | „Moduli dhjetë përfunduar.“ | Moduli dhjetë përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.20 | MITTEL | Bild SQ | M11 scr:outro_done | „MODULI 11 PËRFUNDUAR“ | MODULI 11 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.21 | MITTEL | Ton SQ | M11 vo:outro | „Moduli njëmbëdhjetë përfunduar.“ | Moduli njëmbëdhjetë përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.22 | MITTEL | Bild SQ | M12 scr:outro_done | „MODULI 12 PËRFUNDUAR“ | MODULI 12 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.23 | MITTEL | Ton SQ | M12 vo:outro | „Moduli dymbëdhjetë përfunduar.“ | Moduli dymbëdhjetë përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.24 | MITTEL | Bild SQ | M13 scr:outro_done | „MODULI 13 PËRFUNDUAR“ | MODULI 13 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.25 | MITTEL | Ton SQ | M13 vo:outro | „Moduli trembëdhjetë përfunduar.“ | Moduli trembëdhjetë përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.26 | MITTEL | Bild SQ | M14 scr:outro_done | „MODULI 14 PËRFUNDUAR“ | MODULI 14 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.27 | MITTEL | Ton SQ | M14 vo:outro | „Moduli katërmbëdhjetë përfunduar.“ | Moduli katërmbëdhjetë përfundoi. | wie M01 („Moduli 1 përfundoi.“). |
| A1.28 | MITTEL | Bild SQ | M15 scr:outro_done | „MODULI 15 PËRFUNDUAR“ | MODULI 15 PËRFUNDOI | Partizip ohne „u“/„i“ ist kein albanischer Satz. |
| A1.29 | MITTEL | Ton SQ | M15 vo:outro | „Moduli pesëmbëdhjetë përfunduar. Modulet një deri në pesëmbëdhjetë të përfunduara.“ | Moduli pesëmbëdhjetë përfundoi. Modulet një deri në pesëmbëdhjetë u përfunduan. | wie M01 („Moduli 1 përfundoi.“). |
| A1.30 | MITTEL | Bild SQ | M15 scr:outro_all | „MODULET 1–15 TË PËRFUNDUARA“ | MODULET 1–15 U PËRFUNDUAN | wie outro_done. |

### A2. Intro-Kicker „SHK GRUNDLAGEN“ / „BAZAT E SHK-së“ (Bild)

DE: Zusammensetzung mit Abkürzung braucht Bindestrich (M01–M15). SQ: Kleinbuchstaben „-së“ in einer Versalzeile (M02–M15; M01 zeigt „SHK – BAZAT“, korrekt). Der gesprochene SQ-Intro „Bazat e SHK-së“ kommt nur in M02 vor (dort Ton-Korrektur in der Modultabelle).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| A2.1 | KLEIN | Bild DE (+ Untertitel im SQ-Video) | M01 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.2 | KLEIN | Bild DE | M02 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.3 | KLEIN | Bild SQ | M02 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.4 | KLEIN | Bild DE | M03 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.5 | KLEIN | Bild SQ | M03 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.6 | KLEIN | Bild DE | M04 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.7 | KLEIN | Bild SQ | M04 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.8 | KLEIN | Bild DE | M05 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.9 | KLEIN | Bild SQ | M05 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.10 | KLEIN | Bild DE | M06 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.11 | KLEIN | Bild SQ | M06 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.12 | KLEIN | Bild DE | M07 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.13 | KLEIN | Bild SQ | M07 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.14 | KLEIN | Bild DE | M08 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.15 | KLEIN | Bild SQ | M08 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.16 | KLEIN | Bild DE | M09 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.17 | KLEIN | Bild SQ | M09 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.18 | KLEIN | Bild DE | M10 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.19 | KLEIN | Bild SQ | M10 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.20 | KLEIN | Bild DE | M11 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.21 | KLEIN | Bild SQ | M11 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.22 | KLEIN | Bild DE | M12 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.23 | KLEIN | Bild SQ | M12 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.24 | KLEIN | Bild DE | M13 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.25 | KLEIN | Bild SQ | M13 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.26 | KLEIN | Bild DE | M14 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.27 | KLEIN | Bild SQ | M14 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |
| A2.28 | KLEIN | Bild DE | M15 scr:intro_kicker | „SHK GRUNDLAGEN“ | SHK-GRUNDLAGEN | Durchkopplung mit Bindestrich. |
| A2.29 | KLEIN | Bild SQ | M15 scr:intro_kicker | „BAZAT E SHK-së“ | BAZAT E SHK-SË | Kleinbuchstaben in einer Versalzeile. |

### A3. „valvul“ ohne ë im Bild (SQ)

Unbestimmte Form heißt standardsprachlich „valvulë“ (Glossar, Quiz, App). Im Bild sichtbar. Weitere Bildtexte mit „valvul“, die ohnehin geändert werden: M03 `e2` und M08 `e4` (siehe Modultabellen). Im **Ton** kommt „valvul“ in diesen Szenen vor: M03 s07, s22 · M04 s02, s07, s18 · M05 s03, s08, s09, s19 · M08 s08, s14, s24 · M09 s08 · M10 s21, s25, s29 · M11 s19, s26, s29 · M12 s14, s19 · M13 s15 – dort ist es kaum hörbar; **nur** deshalb wird keine Szene neu vertont. Wo eine dieser Szenen aus anderem Grund neu vertont wird, ist „valvulë“ im neuen Text schon enthalten.

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| A3.1 | MITTEL | Bild SQ | M03 scr:hose_rv | „Zorrë + valvul e thjeshtë kundërkthimi“ | Zorrë + valvulë e thjeshtë kundërkthimi | Schreibung „valvulë“. |
| A3.2 | MITTEL | Bild SQ | M04 scr:h05 | „Jo valvul rregullimi“ | Nuk është valvulë rregullimi | Schreibung „valvulë“; dazu Verb ergänzt („Jo valvul…“ wirkte abgehackt, M04 Befund #2). |
| A3.3 | MITTEL | Bild SQ | M04 scr:h14 | „Ajruesi nuk është valvul sigurie“ | Ajruesi nuk është valvulë sigurie | Schreibung „valvulë“. |
| A3.4 | MITTEL | Bild SQ | M04 scr:e1 | „Valvul mbyllëse në rrugën e sigurisë“ | Valvulë mbyllëse në rrugën e sigurisë | Schreibung „valvulë“. |
| A3.5 | MITTEL | Bild SQ | M04 scr:e3 | „Valvul sigurie e gabuar / presion hapjeje i gabuar“ | Valvulë sigurie e gabuar / presion hapjeje i gabuar | Schreibung „valvulë“. |
| A3.6 | MITTEL | Bild SQ | M04 scr:e5 | „Ajruesi kuptohet si valvul sigurie“ | Ajruesi kuptohet si valvulë sigurie | Schreibung „valvulë“. |
| A3.7 | MITTEL | Bild SQ | M05 scr:e2 | „Valvul mbyllëse midis depozitës dhe valvulës së sigurisë“ | Valvulë mbyllëse midis depozitës dhe valvulës së sigurisë | Schreibung „valvulë“. |
| A3.8 | MITTEL | Bild SQ | M05 scr:e6 | „Valvul sigurie e papërshtatshme“ | Valvulë sigurie e papërshtatshme | Schreibung „valvulë“. |
| A3.9 | MITTEL | Bild SQ | M09 scr:path_bad | „Valvul mbyllëse në rrugën e sigurisë“ | Valvulë mbyllëse në rrugën e sigurisë | Schreibung „valvulë“. |
| A3.10 | MITTEL | Bild SQ | M10 scr:h21 | „Nuk është valvul sigurie“ | Nuk është valvulë sigurie | Schreibung „valvulë“. |
| A3.11 | MITTEL | Bild SQ | M10 scr:ex_ov | „Shembull: valvul bypass-i (Caleffi)“ | Shembull: valvulë bypass-i (Caleffi) | Schreibung „valvulë“. |
| A3.12 | MITTEL | Bild SQ | M11 scr:c21w | „pa valvul: mbrapsht nëpër qarkun B“ | pa valvulë: mbrapsht nëpër qarkun B | Schreibung „valvulë“. |
| A3.13 | MITTEL | Bild SQ | M11 scr:c21ok | „me valvul: rruga e kthimit e mbyllur“ | me valvulë: rruga e kthimit e mbyllur | Schreibung „valvulë“. |
| A3.14 | MITTEL | Bild SQ | M11 scr:rv_hz | „valvul kundërkthimi ngrohjeje“ | valvulë kundërkthimi ngrohjeje | Schreibung „valvulë“. |
| A3.15 | MITTEL | Bild SQ | M11 scr:e13 | „Valvul shtesë edhe pse ka funksion të integruar“ | Valvulë shtesë edhe pse ka funksion të integruar | Schreibung „valvulë“. |
| A3.16 | MITTEL | Bild SQ | M12 scr:ex_valve | „Valvul radiatori me paracaktim“ | Valvulë radiatori me paracaktim | Schreibung „valvulë“. |
| A3.17 | MITTEL | Bild SQ | M12 scr:h14 | „Radiatori: valvul me paracaktim“ | Radiatori: valvulë me paracaktim | Schreibung „valvulë“. |
| A3.18 | MITTEL | Bild SQ | M12 scr:f19c | „Valvul e bllokuar“ | Valvulë e bllokuar | Schreibung „valvulë“. |

### A4. Querschnittsthemen (Korrekturen stehen in den Modultabellen)

| Thema | Betroffene Module / Schlüssel |
|---|---|
| **Absperrung im Sicherheitsweg** (KRITISCH): Zwischen Wärmeerzeuger bzw. Speicher und Sicherheitsventil ist **gar keine** Absperrung zulässig – nicht nur „keine geschlossene“ / „nicht im Betrieb“ | M04 vo:s07, vo:s18, scr:absperr · M05 vo:s09, vo:s19, scr:f1 · M08 vo:s08, scr:closed, scr:e4 · M09 vo:s08 · M15 vo:s05, scr:noclose |
| „mikrofluska“ → „mikroflluska“ (hörbar) | M07 (9 Szenen, 9 Bildtexte) · M09 vo:s13, scr:las, scr:las_d |
| Regler/Regelung als „kontroll(uesi)“ → „rregullatori/rregullimi“ | M08 · M09 · M13 |
| Wärmeerzeuger als „prodhuesi“ (= Hersteller) → „pajisja e ngrohjes“ | M10 · M13 |
| „izolim“ (= Dämmung) für Absperren/Dichtheit | M03 · M06 · M08 |
| „depozita“ (= Speicher) für Ablagerungen → „depozitime“ | M03 · M06 · M14 |
| „kthim“ (= Rücklauf) für Rückfluss → „rrjedhje mbrapsht“ | M09 · M11 |

## B. Korrekturen je Modul

### M00 – Einführung

Keine Ton- oder Bildkorrektur nötig (nur KLEIN-Stilhinweise im Bericht; kein Kicker/Outro im Video).

### M01 – MAG Heizung

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | KRITISCH | Ton DE | vo:s08 | „Der Vordruck ist der Druck auf der Gasseite des M-A-G.“ | Zwei Begriffe sind wichtig. Der Anlagendruck ist der Druck auf der Wasserseite, also im Heizsystem. Der Vordruck ist der Gasdruck im M-A-G, wenn die Wasserseite drucklos ist. Anlagendruck und Vordruck sind nicht dasselbe. | Befund #1: Im Betrieb ist der Druck auf der Gasseite gleich dem Anlagendruck. Der Vordruck ist nur bei druckloser Wasserseite definiert – sonst misst ein Anfänger im Betrieb am Gasventil den Anlagendruck. |
| 2 | KRITISCH | Ton SQ | vo:s08 | „Presioni paraprak është presioni në anën e gazit të MAG-ut.“ | Dy nocione janë të rëndësishme. Presioni i sistemit është presioni në anën e ujit, pra në sistemin e ngrohjes. Presioni paraprak është presioni i gazit në MAG, kur ana e ujit është pa presion. Presioni i sistemit dhe presioni paraprak nuk janë e njëjta gjë. | Befund #1, wie DE. |
| 3 | KRITISCH | Bild DE | scr:vd_s | „Gasseite des MAG“ | Gasseite · Wasserseite drucklos | Befund #1, Bild passend zum neuen Ton. |
| 4 | KRITISCH | Bild SQ | scr:vd_s | „Ana e gazit e MAG-ut“ | Ana e gazit · ana e ujit pa presion | Befund #1. |
| 5 | MITTEL | Ton SQ | vo:s14 | „Asnjëra nuk e zëvendëson tjetrën.“ | MAG-u dhe valvula e sigurisë kanë detyra të ndryshme. MAG-u përballon ndryshimet normale të vëllimit. Valvula e sigurisë e mbron sistemin nga presioni i tepërt. Asnjëri nuk e zëvendëson tjetrin. | Befund #2: gemischtes Genus (MAG m. + valvula f.) → männliche Form (wie Quiz/App). |
| 6 | MITTEL | Bild SQ | scr:none_rep | „Asnjëra nuk e zëvendëson tjetrën“ | Asnjëri nuk e zëvendëson tjetrin | Befund #2. |
| 7 | MITTEL | Ton SQ | vo:s02 | „përmes linjës së dërgimit“ | Uji i ngrohjes rrjedh nga burimi i nxehtësisë, përmes linjës së furnizimit te radiatorët, dhe kthehet përmes linjës së kthimit. Një sistem ngrohjeje është një sistem i mbyllur. Kur uji nxehet, vëllimi i tij rritet. Ai ka nevojë për më shumë hapësirë. Por sistemi është i mbyllur, dhe ky vëllim shtesë duhet të merret diku. | Befund #3: „dërgim“ für Vorlauf ist nicht gebräuchlich; Glossar/Quiz: „furnizimi“. |
| 8 | MITTEL | Bild SQ | scr:vl | „Linja e dërgimit“ | Linja e furnizimit | Befund #3. |
| 9 | KLEIN | Ton DE | vo:s11 | „entsprechend Wartungsprozedur und Herstellervorgaben“ | Vor der Prüfung muss klar sein, in welchem Zustand sich die Anlage befindet. Der Vordruck wird entsprechend der Wartungsanleitung und den Herstellervorgaben geprüft. Dazu wird die Wasserseite druckentlastet. Erst dann wird der Gasvordruck gemessen. | Befund #13: Artikel fehlen (hörbarer Grammatikfehler). |

### M02 – Trinkwasser-Ausdehnungsgefäß

Hinweis: SQ-Sprechtexte abgetippt – vor der Neuvertonung mit dem alten Ton abgleichen.

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | MITTEL | Ton SQ | vo:intro | „Bazat e SHK-së.“ … „Ena e zgjerimit për ujin sanitar.“ | Bazat e Es-Ha-Ka-së. Moduli 2. Ena e zgjerimit për ujë të pijshëm. | Befund #9: edge-tts liest „SH“ als [ʃ]; M03–M15 schreiben „Es-Ha-Ka“. Befund #4: Titel wie App/Quiz „për ujë të pijshëm“. |
| 2 | MITTEL | Ton SQ | vo:s01 | „pjesë e instalimit të ujit sanitar“ | Në modulin e parë mësuam enën e zgjerimit të sistemit të ngrohjes. Ky komponent punon sipas një parimi të ngjashëm, por është pjesë e instalimit të ujit të pijshëm. Prandaj këto dy lloje enësh nuk duhet të ngatërrohen. | Befund #4: einheitlich „ujë i pijshëm“ für Trinkwasser. |
| 3 | MITTEL | Ton SQ | vo:s02 | „Ena e ujit sanitar është në kontakt“ | Të dyja enët kanë në parim një anë uji dhe një anë gazi, të ndara nga një membranë. Dallimi kryesor është përdorimi. MAG-u i ngrohjes punon me ujë ngrohjeje. Ena e zgjerimit për ujë të pijshëm është në kontakt me ujin e pijshëm dhe duhet të jetë e përshtatshme posaçërisht për këtë përdorim. | Befund #3: „Ena e ujit sanitar“ = Behälter des Brauchwassers (klingt nach Speicher), „zgjerim“ fehlt. |
| 4 | MITTEL | Ton SQ | vo:s03 | „Uji i ngrohjes dhe uji sanitar mbeten“ | Tani shohim një depozitë të ujit të ngrohtë sanitar. Uji i ftohtë hyn në depozitë dhe ngrohet. Uji i ngrohjes dhe uji i pijshëm mbeten të ndarë nga njëri-tjetri. | Befund #4 („ujë i ngrohtë sanitar“ für Trinkwarmwasser bleibt). |
| 5 | MITTEL | Ton SQ | vo:s04 | „Edhe uji sanitar zgjerohet“ | Edhe uji i pijshëm zgjerohet kur nxehet. Kur uji në depozitë ngrohet, ai kërkon pak më shumë hapësirë. | Befund #4. |
| 6 | MITTEL | Ton SQ | vo:s05 | „në instalimin e mëparshëm të ujit.“ | Në furnizimin me ujë të ftohtë ndodhet një pengues kthimi. Ai lejon që uji të rrjedhë drejt depozitës, por pengon kthimin e tij në instalimin e ujit të pijshëm para tij. | Befund #6: „i mëparshëm“ = früher (zeitlich), nicht „vorgeschaltet“. |
| 7 | MITTEL | Ton SQ | vo:s07 | „enë zgjerimi për ujin sanitar“ | Nëse nuk është parashikuar një enë zgjerimi për ujë të pijshëm, uji shtesë nga zgjerimi mund të shkarkohet gjatë ngrohjes përmes valvulës së sigurisë. Prandaj dalja e ujit gjatë ngrohjes nuk do të thotë automatikisht se valvula është me defekt. | Befund #4. |
| 8 | MITTEL | Ton SQ | vo:s08 | „enë e përshtatshme zgjerimi për ujin sanitar“ | Kur përdoret një enë e përshtatshme zgjerimi për ujë të pijshëm, ajo lidhet në anën e depozitës pas penguesit të kthimit, në tubin e ujit të ftohtë. Kështu uji që zgjerohet mund të arrijë enën. | Befund #4. |
| 9 | MITTEL | Ton SQ | vo:s11 | „qarkullimi i parashikuar i ujit është pjesë“ | Prandaj, te enët e përshtatshme për ujë të pijshëm, rrjedhja e ujit nëpër enë është pjesë e lidhjes higjienike. Duhet të shmangen degë të panevojshme ku uji mund të qëndrojë për një kohë të gjatë. | Befund #7: „qarkullim“ ist die Trinkwasser-Zirkulation – gemeint ist Durchströmung. |
| 10 | MITTEL | Ton SQ | vo:s12 | „Trinkwasser-MAG ndodhet“ | Për shembullin tonë të depozitës mbaj mend: Ena e zgjerimit për ujë të pijshëm ndodhet në anën e ujit të ftohtë të depozitës dhe duhet të jetë hidraulikisht në anën e duhur të penguesit të kthimit. | Befund #1: deutsches Wort im albanischen Ton, edge-tts liest es unverständlich. |
| 11 | MITTEL | Ton SQ | vo:s14 | „Një enë zgjerimi për ujin sanitar“ | Një enë zgjerimi për ujë të pijshëm nuk është automatikisht pjesë e çdo instalimi. Nëse përdoret dhe si dimensionohet, varet nga projekti konkret, komponentët dhe udhëzimet e prodhuesit. | Befund #4. |
| 12 | MITTEL | Ton SQ | vo:s15 | „Edhe te Trinkwasser-MAG,“ | Edhe te ena e zgjerimit për ujë të pijshëm, madhësia dhe presioni paraprak i gazit duhet t’i përshtaten instalimit konkret. Vlerat nuk kopjohen thjesht nga një sistem tjetër. | Befund #1. |
| 13 | MITTEL | Ton SQ | vo:s17 | „në instalimin e ujit sanitar:“ … „Një degë pa qarkullim në vend“ | Gabime tipike nga praktika. Një MAG ngrohjeje në instalimin e ujit të pijshëm: jo çdo MAG është i përshtatshëm për ujë të pijshëm. Ena në anën e gabuar të penguesit të kthimit. Një degë qorre ku uji nuk rrjedh, në vend të një lidhjeje higjienike. Valvula e sigurisë e hequr, sepse gjoja ka një MAG. Presioni paraprak i pakontrolluar: ai duhet të përputhet me vlerën e kërkuar të sistemit. Dhe një enë e montuar aq keq, sa mirëmbajtja është pothuajse e pamundur. | Befund #4 und #7. |
| 14 | MITTEL | Ton SQ | vo:s18 | „enë zgjerimi për ujin sanitar në praktikë“ … „ashtu edhe nga funksioni i tij.“ | Kështu duket një enë zgjerimi për ujë të pijshëm në praktikë: nga jashtë trupi i enës dhe lidhja e ujit, nga brenda ana e ujit, membrana dhe jastëku i gazit. Tani e njeh këtë komponent si nga jashtë ashtu edhe nga brenda. | Befund #10: DE „von außen und von innen“. Befund #4. |
| 15 | MITTEL | Ton SQ | vo:s19 | „Mbaje mend kështu: uji sanitar nxehet“ | Mbaje mend kështu: uji i pijshëm nxehet në depozitë dhe zgjerohet. Për shkak të penguesit të kthimit, vëllimi shtesë nuk mund të kthehet thjesht mbrapsht. Një enë e përshtatshme zgjerimi mund ta marrë këtë vëllim. Ajo lidhet siç duhet në anën e ujit të ftohtë dhe duhet të jetë e përshtatshme higjienikisht për ujë të pijshëm. Dhe më e rëndësishmja: MAG-u nuk e zëvendëson kurrë valvulën e sigurisë. | Befund #4. |
| 16 | MITTEL | Bild SQ | scr:intro_title | „Ena e zgjerimit për ujin sanitar“ | Ena e zgjerimit për ujë të pijshëm | Befund #4: wie App-Titel. |
| 17 | MITTEL | Bild SQ | scr:s01_title | „Ena e zgjerimit për ujin sanitar“ | Ena e zgjerimit për ujë të pijshëm | Befund #4. |
| 18 | MITTEL | Bild SQ | scr:mag_tw | „Ena e ujit sanitar“ | Ena e zgjerimit për ujë të pijshëm | Befund #3. |
| 19 | MITTEL | Bild SQ | scr:tw_in | „Ujë sanitar në depozitë“ | Ujë i pijshëm në depozitë | Befund #4. |
| 20 | MITTEL | Bild SQ | scr:s01_small | „Trinkwasser-MAG“ | MAG për ujë të pijshëm | Befund #2: deutscher Text im SQ-Bild. |
| 21 | MITTEL | Bild SQ | scr:h02 | „MAG-u i ngrohjes dhe Trinkwasser-MAG“ | MAG-u i ngrohjes dhe MAG-u për ujë të pijshëm | Befund #2. |
| 22 | MITTEL | Bild SQ | scr:h07 | „Pa Trinkwasser-MAG“ | Pa MAG për ujë të pijshëm | Befund #2. |
| 23 | MITTEL | Bild SQ | scr:h08 | „Trinkwasser-MAG në sistem“ | MAG-u për ujë të pijshëm në sistem | Befund #2 (bestimmte Form fehlte). |
| 24 | MITTEL | Bild SQ | scr:h09 | „Si punon Trinkwasser-MAG“ | Si punon MAG-u për ujë të pijshëm | Befund #2 (bestimmte Form fehlte). |
| 25 | MITTEL | Bild SQ | scr:merk | „Trinkwasser-MAG → ana e ujit të ftohtë të depozitës“ | MAG-u për ujë të pijshëm → ana e ujit të ftohtë të depozitës | Befund #2. |
| 26 | MITTEL | Bild SQ | scr:h14 | „Jo çdo instalim ka Trinkwasser-MAG“ | Jo çdo instalim ka MAG për ujë të pijshëm | Befund #2. |
| 27 | MITTEL | Bild SQ | scr:sysA | „Sistemi A: me Trinkwasser-MAG“ | Sistemi A: me MAG për ujë të pijshëm | Befund #2. |
| 28 | MITTEL | Bild SQ | scr:sysB | „Sistemi B: pa Trinkwasser-MAG“ | Sistemi B: pa MAG për ujë të pijshëm | Befund #2. |
| 29 | MITTEL | Bild SQ | scr:f6 | „Vëllimi shtesë në Trinkwasser-MAG“ | Vëllimi shtesë në MAG-un për ujë të pijshëm | Befund #2. |
| 30 | MITTEL | Bild SQ | scr:h18 | „Trinkwasser-MAG i vërtetë“ | MAG-u i vërtetë për ujë të pijshëm | Befund #2 (bestimmte Form fehlte). |
| 31 | MITTEL | Bild SQ | scr:flow_through | „Qarkullimi i ujit“ | Rrjedhja e ujit nëpër enë | Befund #7: nicht „qarkullim“ (= Zirkulation). |
| 32 | MITTEL | Bild SQ | scr:h11 | „Qarkullim në vend të degës pa rrjedhje“ | Rrjedhje nëpër enë në vend të degës qorre | Befund #7. |
| 33 | MITTEL | Bild SQ | scr:w_sub | „Degë e gjatë pa qarkullim“ | Degë e gjatë qorre ku uji nuk rrjedh | Befund #7. |
| 34 | MITTEL | Bild SQ | scr:e3 | „Degë pa qarkullim“ | Degë qorre ku uji nuk rrjedh | Befund #7. |
| 35 | MITTEL | Bild SQ | scr:know | „Tani e njeh këtë komponent si nga jashtë ashtu edhe nga funksioni i tij.“ | Tani e njeh këtë komponent si nga jashtë ashtu edhe nga brenda. | Befund #10. |
| 36 | KLEIN | Bild SQ | scr:m1 | „E montuar e arritshme“ | E montuar në vend të arritshëm | Befund #12: ungrammatisch. |
| 37 | KLEIN | Bild DE | scr:f5 | „Rückweg ist begrenzt“ | Rückweg ist gesperrt | Befund #16: Der Rückflussverhinderer sperrt, er begrenzt nicht (vgl. „Zurück: gesperrt“). |
| 38 | KLEIN | Bild SQ | scr:f5 | „Kthimi është i kufizuar“ | Kthimi është i bllokuar | Befund #16. |
| 39 | KLEIN | Bild DE | scr:k1 | „Gaspolster dehnt sich“ | Gaspolster dehnt sich aus | Befund #17: „sich dehnen“ ohne „aus“ ist hier falsch. |
| 40 | KLEIN | Bild SQ | scr:mag_ne_sv | „MAG ≠ Valvula e sigurisë“ | MAG ≠ valvula e sigurisë | Befund #29: Großbuchstabe mitten in der Zeile. |

### M03 – Nachfülleinheit und Wasseraufbereitung

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker), A3 (valvul).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | KRITISCH | Ton DE | vo:s07 | „ist deshalb nicht automatisch ein gleichwertiger Ersatz für die erforderliche Sicherungseinrichtung.“ | Ein Füllschlauch mit einem einfachen Rückschlagventil ist deshalb kein Ersatz für die erforderliche Sicherungseinrichtung. Auch eine nur vorübergehend angeschlossene Füllverbindung muss passend abgesichert sein. | Befund #1: Ein einfacher Rückflussverhinderer sichert nur bis Kategorie 2; beim Befüllen einer Heizung reicht er nie. Bild sagt „FALSCH“, Ton „nicht automatisch“. |
| 2 | KRITISCH | Ton SQ | vo:s07 | „me një valvul të thjeshtë kundërkthimi nuk është automatikisht zëvendësim i barabartë për pajisjen e nevojshme të sigurisë.“ | Prandaj një zorrë mbushjeje me një valvulë të thjeshtë kundërkthimi nuk e zëvendëson pajisjen e nevojshme të sigurisë. Edhe një lidhje vetëm e përkohshme duhet të ketë mbrojtjen e duhur. | Befund #1 (dazu Schreibung „valvulë“). |
| 3 | MITTEL | Ton DE | vo:s22 | „Ein einfacher Rückschlag statt der erforderlichen Sicherung.“ … „Ein Messwert von einer anderen Anlage übernommen.“ | Typische Fehler. Der Trinkwasserschutz fehlt. Ein einfaches Rückschlagventil statt der erforderlichen Sicherungseinrichtung. Der Ablauf des Systemtrenners ist blockiert. Enthärtung und Entsalzung verwechselt. Die Patrone ist erschöpft und wird trotzdem weiter benutzt. Ein Sollwert von einer anderen Anlage übernommen. Richtig ist der Sollwert der konkreten Anlage. Die Patrone unter Druck geöffnet. Richtig ist: erst absperren und druckentlasten. Und ständig Wasser nachfüllen, statt die Ursache zu prüfen. | Befund #2: „Rückschlag“ ist kein Bauteil. Befund #14 (KLEIN): übernommen wird ein Sollwert, kein Messwert (Folgesatz sagt „Sollwert“). |
| 4 | MITTEL | Ton SQ | vo:s22 | „Një valvul e thjeshtë kundërkthimi në vend të sigurisë së nevojshme.“ … „por përdoret përsëri.“ … „fillimisht izolo dhe shkarko presionin.“ | Gabime tipike. Mungon mbrojtja e ujit të pijshëm. Një valvulë e thjeshtë kundërkthimi në vend të pajisjes së nevojshme të sigurisë. Dalja e ndarësit të sistemit është e bllokuar. Zbutja dhe çkripëzimi ngatërrohen. Fisheku është i shteruar, por përdoret ende. Një vlerë merret nga një sistem tjetër. E saktë është vlera e kërkuar e sistemit konkret. Fisheku hapet nën presion. E saktë është: fillimisht mbyll valvulat dhe çliro presionin. Dhe shtimi i vazhdueshëm i ujit, në vend që të kontrollohet shkaku. | Befund #4: „izoloj“ = dämmen; Quiz sagt „mbyll valvulat“. Befund #22/#11: gemeint ist das Bauteil. Befund #21: „përsëri“ = wieder, DE „weiter“. |
| 5 | MITTEL | Bild DE | scr:e2 | „Einfacher Rückschlag statt erforderlicher Sicherung“ | Einfaches Rückschlagventil statt Sicherungseinrichtung | Befund #2. |
| 6 | MITTEL | Bild SQ | scr:e2 | „Valvul e thjeshtë kundërkthimi në vend të sigurisë“ | Valvulë e thjeshtë kundërkthimi në vend të pajisjes së sigurisë | Befund #6 (valvulë) und #22 (Bauteil, nicht „siguria“). |
| 7 | MITTEL | Ton SQ | vo:s02 | „formimin e depozitave“ | Një sistem ngrohjeje nuk mbushet thjesht me çfarëdo uji. Uji i papërshtatshëm mund të favorizojë formimin e gurit të gëlqeres dhe korrozionin. Përveç kësaj, duhet parandaluar kthimi i ujit të ngrohjes në instalimin e ujit të pijshëm. | Befund #3: „depozita“ = Speicher; Ablagerungen = „depozitime“. |
| 8 | MITTEL | Bild SQ | scr:scale | „depozita të mundshme gëlqereje“ | depozitime të mundshme gëlqereje | Befund #3. |
| 9 | MITTEL | Ton SQ | vo:s15 | „pjesa që do të hapet izolohet“ | Gjatë ndërrimit të fishekut, fillimisht ndalet procesi i mbushjes. Pastaj pjesa që do të hapet mbyllet me valvula dhe shkarkohet nga presioni sipas armaturës konkrete. Vetëm më pas fisheku hapet ose ndërrohet sipas udhëzimit të prodhuesit. | Befund #4: „izoloj“ heißt dämmen. |
| 10 | MITTEL | Bild SQ | scr:c2 | „Izolo pjesën e parashikuar“ | Mbyll pjesën e parashikuar me valvula | Befund #4. |
| 11 | MITTEL | Bild SQ | scr:first_rel | „Fillimisht izolo + shkarko presionin“ | Fillimisht mbyll valvulat + çliro presionin | Befund #4. |
| 12 | MITTEL | Ton SQ | vo:s11 | „që uji është çkripëzuar plotësisht.“ | Gjatë zbutjes zvogëlohen kryesisht kalciumi dhe magnezi, duke u zëvendësuar gjatë shkëmbimit të joneve me natrium. Kështu ulet fortësia e ujit. Por kjo nuk do të thotë që uji është çkripëzuar. | Befund #5: „plotësisht“ unterstellt teilweise Entsalzung; Enthärtung entsalzt gar nicht. |
| 13 | MITTEL | Bild SQ | scr:looks | „„duket e ndotur““ | “duket i ndotur” | Befund #7: Bezug „fisheku“ (m.); albanische Anführungszeichen. |
| 14 | MITTEL | Bild SQ | scr:a1 | „Shpëla sipas udhëzimit“ | Shpëlaj sipas udhëzimit | Befund #8: „shpëla“ = ich spülte; Imperativ „shpëlaj“. |
| 15 | MITTEL | Bild SQ | scr:empty | „Kapaciteti në fund“ | Kapaciteti i shteruar | Befund #10: wörtlich „Kapazität am Schluss“. |
| 16 | MITTEL | Bild SQ | scr:f2 | „Siguria mbron rrjetin e ujit të pijshëm“ | Pajisja e sigurisë mbron rrjetin e ujit të pijshëm | Befund #11: „siguria“ = Sicherheit (abstrakt), gemeint ist das Bauteil. |
| 17 | KLEIN | Bild SQ | scr:a2 | „Ajro“ | Ajros | Befund #24: Imperativ von „ajros“ (vom Muttersprachler bestätigen lassen). |
| 18 | KLEIN | Bild SQ | scr:e5 | „Fisheku i shteruar, por përdoret përsëri“ | Fisheku i shteruar, por përdoret ende | Befund #21: „përsëri“ = wieder. |
| 19 | KLEIN | Bild DE | scr:e6 | „Universellen Messwert kopiert“ | Sollwert von anderer Anlage kopiert | Befund #14: kopiert wird ein Sollwert, kein „universeller Messwert“. |
| 20 | KLEIN | Bild SQ | scr:e6 | „Vlera e matjes e kopjuar“ | Vlera e kërkuar e kopjuar nga një sistem tjetër | Befund #14. |

### M04 – Sicherheitsgruppe Heizung

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker), A3 (valvul).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | KRITISCH | Ton DE | vo:s07 | „Der Weg vom zu schützenden Wärmeerzeuger zu seinem Sicherheitsventil darf im Betrieb nicht durch eine Absperrung unterbrochen werden.“ | Dieser Weg muss frei bleiben. Zwischen dem zu schützenden Wärmeerzeuger und seinem Sicherheitsventil darf keine Absperrung eingebaut sein. Sonst kann das Ventil die Anlage im entscheidenden Moment nicht schützen. | Befund #1: DIN EN 12828 – dort ist überhaupt keine Absperrung zulässig; „im Betrieb“ legt nahe, ein offener Kugelhahn sei ok. Widerspricht Kernpunkt 4 und Quiz Q3. |
| 2 | KRITISCH | Ton SQ | vo:s07 | „Rruga nga pajisja që duhet mbrojtur deri te valvula e saj e sigurisë nuk duhet të ndërpritet gjatë punës nga një valvul mbyllëse.“ | Kjo rrugë duhet të mbetet e lirë. Ndërmjet pajisjes që duhet mbrojtur dhe valvulës së saj të sigurisë nuk lejohet të montohet asnjë valvulë mbyllëse. Përndryshe valvula nuk mund ta mbrojë sistemin në momentin kur nevojitet. | Befund #1. |
| 3 | KRITISCH | Ton DE | vo:s18 | „Eine geschlossene Absperrung im Sicherheitsweg.“ | Jetzt die typischen Fehler. Eine Absperrung im Sicherheitsweg. Ein verschlossener Ablauf am Sicherheitsventil. Ein Sicherheitsventil, das nicht zur Anlage passt. Das Manometer wird mit einer Sicherheitseinrichtung verwechselt. Der Entlüfter wird für ein Sicherheitsventil gehalten. Das Em-A-Ge wird als Teil der Gruppe angesehen. Und Wasser, das unkontrolliert in den Raum spritzt. | Befund #1: Fehler ist jede Absperrung im Sicherheitsweg, nicht nur eine geschlossene. |
| 4 | KRITISCH | Ton SQ | vo:s18 | „Një valvul mbyllëse e mbyllur në rrugën e sigurisë.“ … „Një valvul sigurie që nuk“ … „si valvul sigurie.“ | Tani gabimet tipike. Një valvulë mbyllëse në rrugën e sigurisë. Dalja e valvulës së sigurisë e mbyllur. Një valvulë sigurie që nuk i përshtatet instalimit. Manometri ngatërrohet me një pajisje sigurie. Ajruesi konsiderohet si valvulë sigurie. Em-A-Ge-ja konsiderohet pjesë e grupit. Dhe uji që spërkat pa kontroll në dhomë. | Befund #1 (dazu Schreibung „valvulë“). |
| 5 | KRITISCH | Bild DE | scr:absperr | „Absperrung geschlossen“ | Absperrung im Sicherheitsweg | Befund #1. Grafik prüfen: darf nicht so wirken, als sei eine offene Absperrung dort zulässig. |
| 6 | KRITISCH | Bild SQ | scr:absperr | „Valvula mbyllëse e mbyllur“ | Valvulë mbyllëse në rrugën e sigurisë | Befund #1. |
| 7 | KRITISCH | Bild SQ (termDe) | scr:absperr | „Absperrung“ | Absperrung im Sicherheitsweg | Befund #1. |
| 8 | MITTEL | Bild SQ | scr:x7 | „shkarko sigurt dhe në mënyrë të kontrollueshme“ | shkarko në mënyrë të sigurt dhe të kontrollueshme | Befund #4: „sigurt“ allein ist kein korrektes Adverb. |
| 9 | KLEIN | Bild SQ | scr:e7 | „Dalja e valvulës së sigurisë e drejtuar pa siguri“ | Dalja e valvulës së sigurisë e drejtuar në mënyrë jo të sigurt | Befund #14: „pa siguri“ = ohne Gewissheit. |

### M05 – Sicherheitsgruppe Warmwasserspeicher

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker), A3 (valvul).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | KRITISCH | Ton DE | vo:s09 | „Im normalen Betrieb darf sie den Speicher nicht von seinem Sicherheitsventil trennen.“ | Eine Absperrung wird trotzdem für Wartungsarbeiten benötigt. Entscheidend ist ihre Position: Sie darf nie zwischen Speicher und Sicherheitsventil sitzen. Deshalb muss die konkrete Sicherheitsgruppe so montiert werden, wie es ihre Konstruktion und die Herstellerangaben vorsehen. | Befund #1: DIN EN 806-2 / DIN 1988-200 – zwischen Speicher und Sicherheitsventil keine Absperrung, auch nicht „im Betrieb offen“. Widerspricht Bildtext never_sep. (Kürzer als der Vorschlag im Befund, gleiche Aussage.) |
| 2 | KRITISCH | Ton SQ | vo:s09 | „Një valvul mbyllëse nevojitet“ … „gjatë punës normale ajo nuk duhet ta ndajë depozitën nga valvula e sigurisë.“ | Një valvulë mbyllëse nevojitet megjithatë për punët e mirëmbajtjes. Vendimtare është pozita e saj: ajo nuk lejohet kurrë të jetë midis depozitës dhe valvulës së sigurisë. Prandaj grupi konkret duhet të montohet sipas ndërtimit dhe udhëzimeve të prodhuesit. | Befund #1. |
| 3 | KRITISCH | Ton DE | vo:s19 | „Eine geschlossene Absperrung zwischen Speicher und Sicherheitsventil“ … „Richtig ist, die Ursache zu prüfen, aber niemals zu verschließen.“ | Jetzt die typischen Fehler. Eine Heizungs-Sicherheitsgruppe am Trinkwasserspeicher ist die falsche Sicherheitsgruppe. Eine Absperrung zwischen Speicher und Sicherheitsventil blockiert den Sicherheitsweg. Der Ablauf wird zugestopft, dabei darf er niemals verschlossen werden. Die Abblaseleitung endet unter Wasser. Der Druckminderer soll Überdruck abblasen, obwohl er eine andere Aufgabe hat. Das Sicherheitsventil passt nicht zum Speicher, deshalb immer die Speicher- und Herstellervorgaben prüfen. Und ein tropfendes Ventil wird einfach verschlossen. Richtig ist, die Ursache zu prüfen und das Ventil niemals zu verschließen. | Befund #1; Befund #24 (KLEIN): „aber“ unlogisch, Objekt fehlte. |
| 4 | KRITISCH | Ton SQ | vo:s19 | „Një valvul mbyllëse e mbyllur midis“ … „Dhe një valvul që pikon“ … „shkaku, por kurrë të mos mbyllet.“ | Tani gabimet tipike. Një grup sigurie i ngrohjes te depozita e ujit sanitar është grupi i gabuar i sigurisë. Një valvulë mbyllëse midis depozitës dhe valvulës së sigurisë bllokon rrugën e sigurisë. Shkarkimi mbyllet me tapë, ndërsa ai nuk duhet të mbyllet kurrë. Tubi i shkarkimit përfundon i zhytur në ujë. Reduktuesi i presionit pritet të shkarkojë presionin e tepërt, edhe pse ai ka një detyrë tjetër. Valvula e sigurisë nuk i përshtatet depozitës, prandaj kontrollo gjithmonë kërkesat e depozitës dhe të prodhuesit. Dhe një valvulë që pikon thjesht mbyllet. E sakta është të kontrollohet shkaku dhe valvula të mos mbyllet kurrë. | Befund #1 und #24. |
| 5 | KRITISCH | Bild DE | scr:f1 | „Absperrung geschlossen“ | Absperrung im Sicherheitsweg | Befund #1. |
| 6 | KRITISCH | Bild SQ | scr:f1 | „Valvula mbyllëse e mbyllur“ | Valvulë mbyllëse në rrugën e sigurisë | Befund #1. |
| 7 | KRITISCH | Bild SQ (termDe) | scr:f1 | „Absperrung geschlossen“ | Absperrung im Sicherheitsweg | Befund #1. |
| 8 | MITTEL | Ton SQ | vo:s05 | „në instalimin e mëparshëm të ujit të ftohtë.“ | Penguesi i kthimit lejon që uji të rrjedhë drejt depozitës, por pengon kthimin e tij në instalimin e ujit të ftohtë para tij. | Befund #2: „i mëparshëm“ = früher, nicht „vorgeschaltet“. |
| 9 | MITTEL | Ton SQ | vo:s14 | „As ngrirja ose një tubacion i papërshtatshëm nuk duhet ta bllokojë shkarkimin.“ | Shkarkimi nuk duhet të mbyllet dhe nuk duhet të përfundojë i zhytur në ujë. As ngrirja, as një tubacion i papërshtatshëm nuk duhet ta bllokojnë shkarkimin. | Befund #3: „as … as“, zwei Subjekte → Plural. |
| 10 | MITTEL | Bild SQ | scr:fn_first | „E rëndësishme është funksioni i secilit komponent“ | I rëndësishëm është funksioni i secilit komponent | Befund #4: Kongruenz („funksioni“ m.). |
| 11 | KLEIN | Bild SQ | scr:heats | „Depozita ngroh – uji zgjerohet“ | Depozita ngrohet – uji zgjerohet | Befund #19: intransitiv. |
| 12 | KLEIN | Bild SQ | scr:x1 | „Grup i gabuar sigurie“ | Grup sigurie i gabuar | Befund #20: Wortstellung. |
| 13 | KLEIN | Bild DE | scr:m6 | „Tropfen beim Aufheizen ≠ Defekt – Dauertropfen prüfen“ | Tropfen beim Aufheizen ≠ automatisch Defekt – Dauertropfen prüfen | Befund #22: wie Ton („nicht automatisch“). |
| 14 | KLEIN | Bild SQ | scr:m6 | „Pikim gjatë ngrohjes ≠ defekt – pikimin e vazhdueshëm kontrolloje“ | Pikim gjatë ngrohjes ≠ automatikisht defekt – pikimin e vazhdueshëm kontrolloje | Befund #22. |

### M06 – Schlammabscheider

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | MITTEL | Ton SQ | vo:s02 | „depozitat e vjetra“ | Në ujin e ngrohjes mund të ndodhen grimca të ndryshme. Ato mund të vijnë, për shembull, nga punimet e montimit, depozitimet e vjetra ose proceset e korrozionit. Jo çdo papastërti është magnetike dhe jo çdo ndotje e errët është e njëjtë. Çfarë është saktësisht magnetiti, do ta mësosh në modulin gjashtëmbëdhjetë. | Befund #2: „depozita“ = Speicher; Ablagerungen = „depozitime“. (Neuer Text ohne den bereits geschnittenen Modul-16-Satz.) |
| 2 | MITTEL | Bild SQ | scr:src2 | „Depozitat e vjetra“ | Depozitimet e vjetra | Befund #2. |
| 3 | MITTEL | Ton SQ | vo:s20 | „Pra: shpëlarje dhe ndarje, jo njëra ose tjetra.“ | Një ndarës llumi nuk e zëvendëson shpëlarjen e duhur fillestare të instalimit. Mbetjet e montimit nuk lihen thjesht në sistem vetëm sepse më vonë është montuar një ndarës. Pra: duhen të dyja – shpëlarja dhe ndarësi. | Befund #3: wörtlich übersetztes „nicht entweder oder“ ist unverständlich (Quiz schon so korrigiert). |
| 4 | MITTEL | Ton SQ | vo:s18 | „Më pas kontrollohen presioni i sistemit dhe izolimi ndaj rrjedhjeve.“ | Pas pastrimit, valvula e shkarkimit mbyllet dhe magneti vendoset përsëri në pozicionin e punës. Më pas kontrollohet presioni i sistemit dhe nëse ka rrjedhje. | Befund #4: „izolim“ = Dämmung. |
| 5 | MITTEL | Bild SQ | scr:e4 | „Magneti mbetet në pozicionin e kapjes“ | Magneti mbetet në pozicionin e kapjes gjatë pastrimit | Befund #5: ohne „beim Reinigen“ beschreibt der Text den normalen Betrieb. |
| 6 | KLEIN | Ton SQ | vo:s22 | „Shkarkimi është i bllokuar pas tubave“ | Tani gabimet tipike. Trupi i ndarësit nuk ndodhet në pozicionin e parashikuar të montimit. Drejtimi i rrjedhës merret si i mirëqenë, pa kontrolluar shenjat dhe udhëzimin. Shkarkimi është i fshehur pas tubave dhe nuk arrihet. Gjatë pastrimit magneti lihet në pozicionin e kapjes, dhe grimcat magnetike mbeten të kapura. Trupi hapet ndërsa është nën presion. Mendohet se një kalim i vetëm i pastron të gjitha. Filtri me sitë hiqet, edhe pse prodhuesi kërkon të dyja. Dhe ndarësi zbrazet vazhdimisht, pa u kontrolluar shkaku. | Befund #14: „i bllokuar“ klingt nach verstopft; DE „verbaut“. |
| 7 | KLEIN | Bild SQ | scr:blocked | „Shkarkimi i bllokuar“ | Shkarkimi i paarritshëm | Befund #14. |
| 8 | KLEIN | Bild SQ | scr:c4 | „Kontrollo rrjedhjet“ | Kontrollo nëse ka rrjedhje | Befund #17: „rrjedhjet“ unterstellt vorhandene Lecks. |

### M07 – Luftabscheider und Entlüfter

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | MITTEL | Ton SQ | vo:s03 | „mikrofluska“ | Për ta kuptuar më mirë, dallojmë tri gjendje: grumbullime më të mëdha ajri të lirë, mikroflluska të vogla që lëvizin me ujin dhe gaze që janë ende të tretura në ujë. Gazi i tretur nuk duhet të paraqitet sikur në ujë të ketë tashmë flluska të dukshme. | Befund #1: Rechtschreibung „flluskë“ (ll); l/ll sind verschiedene Laute → hörbar. |
| 2 | MITTEL | Ton SQ | vo:s07 | „mikrofluskat“ | Te flluskat shumë të vogla situata është ndryshe. Ato mund të transportohen bashkë me rrjedhën e ujit. Prandaj një ajrues i vetëm diku në sistem nuk i ndan automatikisht të gjitha mikroflluskat nga uji i ngrohjes. | Befund #1. |
| 3 | MITTEL | Ton SQ | vo:s08 | „mikrofluskash“ | Një ndarës mikroflluskash ndihmon pikërisht në këtë proces. Brenda tij, flluskat e vogla ndahen nga rrjedha dhe mund të bashkohen në flluska më të mëdha. Ato ngrihen drejt ajruesit dhe largohen nga sistemi. | Befund #1. |
| 4 | MITTEL | Ton SQ | vo:s09 | „mikrofluskave“ | Kështu dallimi bëhet i qartë: ajruesi automatik largon ajrin që arrin tek ai. Ndarësi i mikroflluskave ndihmon gjithashtu që flluskat e vogla që lëvizin me ujin të ndahen nga rrjedha. | Befund #1. |
| 5 | MITTEL | Ton SQ | vo:s10 | „mikrofluskave“ | Ndarësit e mikroflluskave vendosen shpesh në furnizimin e ngrohtë pas pajisjes së ngrohjes. Aty kushtet për ndarjen mund të jenë të favorshme. Por pozicioni i saktë varet nga temperatura, presioni, pozicioni i pompës dhe koncepti konkret i sistemit. | Befund #1. |
| 6 | MITTEL | Ton SQ | vo:s12 | „mikrofluskash“ | Te një ndarës real mikroflluskash shpesh dallohen dy zona funksionale: në trup flluskat ndahen nga rrjedha e ujit, ndërsa sipër një ajrues largon ajrin e grumbulluar nga sistemi. | Befund #1. |
| 7 | MITTEL | Ton SQ | vo:s19 | „mikrofluskave“ … „mikrofluskat“ | Tani gabimet tipike. Ajruesi dhe ndarësi i mikroflluskave konsiderohen si e njëjta gjë – por një ajrues i vetëm nuk i largon të gjitha mikroflluskat në të gjithë sistemin. Ndarësi i ajrit montohet i rrotulluar gabim. Dalja e ajrit është e mbyllur dhe ajri nuk mund të dalë. Kapaku lihet gjithmonë plotësisht i hapur ose gjithmonë plotësisht i mbyllur, në vend që të ndiqet udhëzimi i prodhuesit. Ndarësi i mikroflluskave montohet diku rastësisht, pa marrë parasysh hidraulikën. Gazi i tretur imagjinohet si flluska të dukshme – por flluskat krijohen vetëm kur gazi del nga tretësira. Kur ka vazhdimisht ajër, montohen gjithnjë e më shumë ajrues, në vend që të kontrollohet shkaku. Një ajrues që pikon vazhdimisht injorohet. Dhe kur pompa e nxehtësisë jep alarm gazi, ajrimi bëhet gjithsesi si rutinë – këtu vlen procedura e sigurisë e prodhuesit. | Befund #1. |
| 8 | MITTEL | Ton SQ | vo:s20 | „mikrofluskave“ | Kur i sheh këta komponentë në kantier, tani duhet t'i dallosh: ajruesi automatik largon ajrin e grumbulluar. Ndarësi i mikroflluskave ndihmon gjithashtu që flluskat e vogla të ndahen nga uji që qarkullon. | Befund #1. |
| 9 | MITTEL | Ton SQ | vo:s21 | „mikrofluskave“ | Mbaje mend dallimin kështu: ajruesi automatik largon ajrin e lirë që grumbullohet në vendin ku është montuar. Ndarësi i mikroflluskave ndan gjithashtu flluskat e vogla nga uji që qarkullon dhe i çon drejt ajruesit. Gazet e tretura nuk janë ende flluska të dukshme. Vendi dhe pozicioni i montimit varen nga instalimi konkret. Dhe nëse vazhdimisht krijohet ajër i ri, nuk vazhdojmë vetëm me ajrim – kërkojmë shkakun. | Befund #1. |
| 10 | MITTEL | Bild SQ | scr:sep | „Ndarësi i mikrofluskave“ | Ndarësi i mikroflluskave | Befund #1. |
| 11 | MITTEL | Bild SQ | scr:micro | „Mikrofluska“ | Mikroflluska | Befund #1. |
| 12 | MITTEL | Bild SQ | scr:stB | „Mikrofluska“ | Mikroflluska | Befund #1. |
| 13 | MITTEL | Bild SQ | scr:h07 | „Problemi me mikrofluskat“ | Problemi me mikroflluskat | Befund #1. |
| 14 | MITTEL | Bild SQ | scr:not_all | „një ajrues nuk i ndan të gjitha mikrofluskat“ | një ajrues nuk i ndan të gjitha mikroflluskat | Befund #1. |
| 15 | MITTEL | Bild SQ | scr:h08 | „Ndarësi i mikrofluskave“ | Ndarësi i mikroflluskave | Befund #1. |
| 16 | MITTEL | Bild SQ | scr:big09b | „Ndarësi: mikrofluska nga rrjedha“ | Ndarësi: mikroflluska nga rrjedha | Befund #1. |
| 17 | MITTEL | Bild SQ | scr:claim1 | „„Largon të gjitha mikrofluskat në sistem““ | „Largon të gjitha mikroflluskat në sistem“ | Befund #1. |
| 18 | MITTEL | Bild SQ | scr:m2 | „ndarësi: mikrofluska nga uji → ajruesi“ | ndarësi: mikroflluska nga uji → ajruesi | Befund #1. |
| 19 | MITTEL | Ton SQ | vo:s18 | „me ftohës të ndezshëm“ … „dyshim se ftohësi ka hyrë“ | Te disa pompa nxehtësie me gaz ftohës të ndezshëm mund të ketë rregulla të veçanta sigurie për raste defekti. Nëse ka alarm gazi ose dyshim se gazi ftohës ka hyrë në qarkun e ngrohjes, nuk duhet të vazhdohet thjesht me ajrim normal. Në këtë rast ndiqet vetëm procedura e sigurisë së pajisjes konkrete. | Befund #2: „ftohës“ allein = Kühler; in der Sicherheitsszene muss „Kältemittel“ eindeutig sein. |
| 20 | MITTEL | Bild SQ | scr:h18 | „Rast i veçantë: ftohës i ndezshëm“ | Rast i veçantë: gaz ftohës i ndezshëm | Befund #2. |
| 21 | MITTEL | Bild SQ | scr:r290 | „R290 · ftohës i ndezshëm“ | R290 · gaz ftohës i ndezshëm | Befund #2. |
| 22 | MITTEL | Bild SQ | scr:fault_d | „Alarm gazi / dyshim për hyrje ftohësi“ | Alarm gazi / dyshim për hyrje gazi ftohës | Befund #2. |
| 23 | MITTEL | Bild SQ | scr:e9 | „Defekti i pompës injorohet“ | Defekti i pompës së nxehtësisë injorohet | Befund #3: „pompë“ allein = Umwälzpumpe. |
| 24 | KLEIN | Bild SQ | scr:x6 | „i qartë → gazi del → pastaj flluska“ | ujë i kthjellët → gazi del → pastaj flluska | Befund #10: „i qartë“ = verständlich; klares Wasser = „i kthjellët“. |
| 25 | KLEIN | Bild DE | scr:elem | „Abscheideelement (neutral)“ | Abscheideelement | Befund #8: „(neutral)“ ist eine sichtbare Produktionsnotiz. |
| 26 | KLEIN | Bild SQ | scr:elem | „Elementi ndarës (neutral)“ | Elementi ndarës | Befund #8. |

### M08 – Warmwasserspeicher anschließen

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | KRITISCH | Ton DE | vo:s23 | „typischerweise etwa sechzig Grad am Austritt“ | Bei größeren zentralen Trinkwarmwassersystemen gelten klare Temperaturanforderungen: mindestens sechzig Grad am Austritt des Trinkwassererwärmers und mindestens fünfundfünfzig Grad im Zirkulationssystem. Diese Werte gelten nicht ungeprüft für jede andere Anlagenart. | Befund #1: DVGW W 551 / DIN 1988-200 fordern ≥ 60 °C am Austritt; „etwa/typischerweise“ erlaubt sinngemäß 57 °C – Legionellenrisiko. |
| 2 | KRITISCH | Ton SQ | vo:s23 | „zakonisht rreth gjashtëdhjetë gradë“ | Në sistemet më të mëdha qendrore të ujit të ngrohtë sanitar ka kërkesa të qarta për temperaturën: të paktën gjashtëdhjetë gradë në dalje të ngrohësit të ujit dhe të paktën pesëdhjetë e pesë gradë në sistemin e riqarkullimit. Këto vlera nuk vlejnë pa kontroll për çdo lloj tjetër instalimi. | Befund #1. |
| 3 | KRITISCH | Bild DE | scr:t60 | „ca. 60 °C“ | mind. 60 °C | Befund #1. |
| 4 | KRITISCH | Bild SQ | scr:t60 | „rreth 60 °C“ | të paktën 60 °C | Befund #1. |
| 5 | KRITISCH | Bild SQ (termDe) | scr:t60 | „ca. 60 °C“ | mind. 60 °C | Befund #1. |
| 6 | KRITISCH | Bild DE | scr:typ | „typisch gefordert“ | gefordert | Befund #1. |
| 7 | KRITISCH | Bild SQ | scr:typ | „zakonisht kërkohet“ | kërkohet | Befund #1. |
| 8 | KRITISCH | Bild SQ (termDe) | scr:typ | „typisch gefordert“ | gefordert | Befund #1. |
| 9 | KRITISCH | Bild DE | scr:e4 | „Absperrung vor dem Sicherheitsventil“ | Absperrung zwischen Speicher und Sicherheitsventil | Befund #2: Die vorgeschriebene Absperrung sitzt VOR dem Sicherheitsventil (M05); verboten ist sie nur zwischen Speicher und Sicherheitsventil. Bild widerspricht Ton s24. |
| 10 | KRITISCH | Bild SQ | scr:e4 | „Valvul mbyllëse para valvulës së sigurisë“ | Valvulë mbyllëse midis depozitës dhe valvulës së sigurisë | Befund #2 (dazu „valvulë“, Befund #9). |
| 11 | KRITISCH | Bild SQ (termDe) | scr:e4 | „Absperrung vor dem Sicherheitsventil“ | Absperrung zwischen Speicher und Sicherheitsventil | Befund #2. |
| 12 | KRITISCH | Ton DE | vo:s08 | „Eine Absperrung darf ihn im Betrieb nicht unterbrechen.“ | Besonders wichtig: Der Sicherheitsweg zwischen Speicher und Sicherheitsventil bleibt frei. Dort darf keine Absperrung eingebaut sein. | Befund #3: „im Betrieb“ legt nahe, ein offener Kugelhahn sei erlaubt. |
| 13 | KRITISCH | Ton SQ | vo:s08 | „Një valvul mbyllëse nuk duhet ta ndërpresë gjatë funksionimit.“ | Shumë e rëndësishme: rruga e sigurisë midis depozitës dhe valvulës së sigurisë mbetet e lirë. Aty nuk lejohet asnjë valvulë mbyllëse. | Befund #3. |
| 14 | KRITISCH | Bild DE | scr:closed | „Absperrung zu“ | Absperrung im Sicherheitsweg | Befund #3: Etikett „zu“ legt nahe, offen sei erlaubt. |
| 15 | KRITISCH | Bild SQ | scr:closed | „Valvula e mbyllur“ | Valvulë mbyllëse në rrugën e sigurisë | Befund #3. |
| 16 | KRITISCH | Bild SQ (termDe) | scr:closed | „Absperrung zu“ | Absperrung im Sicherheitsweg | Befund #3. |
| 17 | MITTEL | Ton SQ | vo:s12 | „Furnizimi i ngarkimit sjell ujin e ngrohur nga pajisja e ngrohjes“ | Tani ana e ngrohjes. Furnizimi për ngrohjen e depozitës e çon ujin e nxehtë të ngrohjes nga pajisja e ngrohjes drejt serpentinës në depozitë. | Befund #4: DE sagt „Heizungswasser“; „uji i ngrohur“ ist in s10 das erwärmte Trinkwasser. Befund #5: „ngarkim“ (Lehnübersetzung). |
| 18 | MITTEL | Ton SQ | vo:s13 | „përmes kthimit të ngarkimit.“ | Në serpentinë, uji i ngrohjes ia jep nxehtësinë ujit sanitar. Më pas kthehet drejt pajisjes së ngrohjes përmes kthimit për ngrohjen e depozitës. | Befund #5: wie Quiz/Kernpunkte „ngrohja e depozitës“. |
| 19 | MITTEL | Ton SQ | vo:s14 | „një pompë ngarkimi ose një valvul devijuese kujdeset për ngarkimin e depozitës.“ | Në varësi të hidraulikës, për shembull një pompë e ngrohjes së depozitës ose një valvulë devijuese kujdeset për ngrohjen e depozitës. Zgjidhjen e përcakton skema e instalimit. | Befund #5. |
| 20 | MITTEL | Ton SQ | vo:s19 | „hyrjen e duhur të kontrolluesit.“ | Sensori i temperaturës vendoset plotësisht në pozicionin e parashikuar dhe lidhet me hyrjen e duhur të rregullatorit. | Befund #6: „kontroll“ = Prüfung; Regler = „rregullatori“. |
| 21 | MITTEL | Ton SQ | vo:s20 | „t’i japë kontrolluesit“ … „në ngarkimin e depozitës.“ | Një sensor në vendin e gabuar mund t’i japë rregullatorit një temperaturë të gabuar. Kjo mund të ndikojë edhe në ngrohjen e depozitës. Prandaj pozicioni i sensorit nuk zgjidhet me hamendje. | Befund #5 und #6. |
| 22 | MITTEL | Ton SQ | vo:s22 | „Pastaj kontrollohen izolimi ndaj rrjedhjeve, rruga e sigurisë, kontrolli dhe funksionet.“ | Pas lidhjes, sistemi mbushet dhe ajroset sipas udhëzimit të pajisjes. Pastaj kontrollohet nëse ka rrjedhje, si dhe rruga e sigurisë, rregullimi dhe funksionet. Vetëm pas kësaj fillon ngrohja. | Befund #7: „izolim“ = Dämmung. Befund #6: „kontrolli“ für Regelung („Prüfung der Prüfung“). |
| 23 | MITTEL | Ton SQ | vo:s24 | „Valvul mbyllëse midis“ … „Furnizimi dhe kthimi i ngarkimit të përcaktuar me hamendje.“ | Gabime tipike: uji i ftohtë dhe i ngrohtë të ngatërruar. Uji i ngrohjes i lidhur me ujin sanitar. Grupi i sigurisë i montuar gabim. Valvulë mbyllëse midis depozitës dhe valvulës së sigurisë. Ena e zgjerimit në anën e gabuar. Furnizimi dhe kthimi për ngrohjen e depozitës të përcaktuar me hamendje. Riqarkullimi i ngatërruar me kthimin e ngrohjes. Pompë e papërshtatshme për riqarkullim. Degë e gjatë te lidhja e papërdorur. Sensori në pozicion të gabuar. Mirëmbajtja e pamundur. Dhe: ngrohja nis para mbushjes dhe kontrollit. | Befund #5 (dazu „valvulë“). |
| 24 | MITTEL | Ton SQ | vo:s25 | „e lidh çdo pikë me sistemin përkatës“ … „riqarkullim ose kontroll.“ | Kur qëndron para një depozite reale, nuk i përcakton tubat sipas pozicionit. Kontrollon shenjat dhe ia cakton çdo lidhje sistemit përkatës: ujë sanitar, ujë ngrohjeje, riqarkullim ose rregullim. | Befund #6; Befund #22 (KLEIN): „lidh“ = anschließen, DE „zuordnen“. |
| 25 | MITTEL | Ton SQ | vo:s26 | „përmes furnizimit të ngarkimit në serpentinë“ … „përmes kthimit të ngarkimit.“ … „Sensori i jep kontrolluesit“ | Mbaje mend ndërtimin kështu: uji i ftohtë sanitar hyn në depozitë përmes grupit të sigurisë dhe del i ngrohur nga lidhja e ujit të ngrohtë. Uji i ngrohjes kalon përmes furnizimit për ngrohjen e depozitës në serpentinë, jep nxehtësinë dhe kthehet përmes kthimit për ngrohjen e depozitës. Riqarkullimi, nëse është parashikuar, ka rrugën e vet të kthimit të ujit sanitar. Sensori i jep rregullatorit temperaturën e depozitës. Lidhjet bëhen sipas shenjave dhe skemës hidraulike. Pastaj sistemi mbushet, ajroset dhe kontrollohet – dhe vetëm pastaj fillon ngrohja. | Befund #5 und #6. |
| 26 | MITTEL | Ton SQ | vo:s11 | „mbrojtja nga djegia“ | Në anën e ujit të ngrohtë, higjiena dhe mbrojtja nga përvëlimi shkojnë së bashku. Temperaturat dhe zgjidhja e mbrojtjes varen nga lloji i instalimit, projekti dhe rregullat teknike. | Befund #8: „djegie“ = Verbrennung; Verbrühschutz = „përvëlim“ (wie Kernpunkt). |
| 27 | MITTEL | Ton DE | vo:s18 | „entsteht daraus keine lange Stichleitung.“ | Wird ein Zirkulationsanschluss nicht genutzt, darf daraus keine lange Stichleitung entstehen. Der Anschluss wird nach Speicher- und Planungsvorgabe fachgerecht verschlossen. | Befund #14: gemeint ist ein Verbot, keine Tatsache. |
| 28 | MITTEL | Ton SQ | vo:s18 | „nuk krijohet një degë e gjatë e panevojshme.“ | Nëse lidhja e riqarkullimit nuk përdoret, nuk lejohet të krijohet një degë e gjatë. Lidhja mbyllet siç duhet sipas udhëzimit të depozitës dhe projektit. | Befund #14: „e panevojshme“ stand nicht im DE. |
| 29 | MITTEL | Bild SQ | scr:lvl | „Furnizimi i ngarkimit“ | Furnizimi për ngrohjen e depozitës | Befund #5 (Länge im Layout prüfen). |
| 30 | MITTEL | Bild SQ | scr:lrl | „Kthimi i ngarkimit“ | Kthimi për ngrohjen e depozitës | Befund #5. |
| 31 | MITTEL | Bild SQ | scr:lpump | „Pompa e ngarkimit“ | Pompa e ngrohjes së depozitës | Befund #5. |
| 32 | MITTEL | Bild SQ | scr:h12 | „3. Ana e ngrohjes: furnizimi i ngarkimit“ | 3. Ana e ngrohjes: furnizimi për ngrohjen e depozitës | Befund #5. |
| 33 | MITTEL | Bild SQ | scr:h13 | „Kthimi i ngarkimit“ | Kthimi për ngrohjen e depozitës | Befund #5. |
| 34 | MITTEL | Bild SQ | scr:h14 | „Pompa e ngarkimit ose valvula devijuese“ | Pompa e ngrohjes së depozitës ose valvula devijuese | Befund #5. |
| 35 | MITTEL | Bild SQ | scr:sys_h | „qarku i ngrohjes / ngarkimi“ | qarku i ngrohjes / ngrohja e depozitës | Befund #5: „ngarkimi“ allein unverständlich. |
| 36 | MITTEL | Bild SQ | scr:e6 | „Furnizimi/kthimi i ngarkimit me hamendje“ | Furnizimi/kthimi për ngrohjen e depozitës me hamendje | Befund #5. |
| 37 | MITTEL | Bild SQ | scr:b5 | „Furnizimi i ngarkimit“ | Furnizimi për ngrohjen e depozitës | Befund #5. |
| 38 | MITTEL | Bild SQ | scr:b7 | „Kthimi i ngarkimit“ | Kthimi për ngrohjen e depozitës | Befund #5. |
| 39 | MITTEL | Bild SQ | scr:ctrl | „Kontrolli“ | Rregullimi | Befund #6. |
| 40 | MITTEL | Bild SQ | scr:g_ctrl | „Kontroll“ | Rregullimi | Befund #6. |
| 41 | MITTEL | Bild SQ | scr:c5 | „Kontrolli i sensorit / kontrollit“ | Kontrolli i sensorit / rregullimit | Befund #6. |
| 42 | MITTEL | Bild SQ | scr:input | „hyrja e duhur e kontrolluesit“ | hyrja e duhur e rregullatorit | Befund #6. |
| 43 | MITTEL | Bild SQ | scr:h11 | „Higjiena dhe mbrojtja nga djegia“ | Higjiena dhe mbrojtja nga përvëlimi | Befund #8. |
| 44 | MITTEL | Bild SQ | scr:scald | „MBROJTJA NGA DJEGIA“ | MBROJTJA NGA PËRVËLIMI | Befund #8. |
| 45 | MITTEL | Bild SQ | scr:dead | „degë e gjatë pa rrjedhje“ | degë e gjatë ku uji nuk rrjedh | Befund #10: „pa rrjedhje“ heißt auch „ohne Leck“. |
| 46 | MITTEL | Bild SQ | scr:flowthru | „armaturë lidhëse me rrjedhje“ | armaturë lidhëse ku uji rrjedh nëpër të | Befund #11: „me rrjedhje“ klingt nach „mit Leck“. |
| 47 | MITTEL | Bild SQ | scr:mag_side | „ana e depozitës e penguesit të kthimit“ | ndërmjet penguesit të kthimit dhe depozitës | Befund #12: Genitivkette kaum verständlich. |
| 48 | MITTEL | Bild SQ | scr:x2 | „Mediat mbeten të ndara“ | Të dy llojet e ujit mbeten të ndara | Befund #13: „mediat“ = Massenmedien. |
| 49 | KLEIN | Bild DE | scr:e7 | „Zirkulation = Heizungsrücklauf verwechselt“ | Zirkulation mit Heizungsrücklauf verwechselt | Befund #24: „=“ plus „verwechselt“ ist grammatisch schief. |
| 50 | KLEIN | Bild SQ | scr:h15 | „Ngatërresë e rëndësishme“ | Ngatërrim i rëndësishëm | Befund #25: „ngatërresë“ = Ärger/Intrige. |
| 51 | KLEIN | Bild SQ | scr:pocketS | „Gypi i sensorit“ | Këllëfi i sensorit | Befund #26: „gyp“ = Rohr. |
| 52 | KLEIN | Bild SQ | scr:cn4 | „Gypi i sensorit“ | Këllëfi i sensorit | Befund #26. |

### M09 – Heizungsanlage anschließen

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker), A3 (valvul).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | KRITISCH | Ton DE | vo:s08 | „Entscheidend bleibt der freie Schutzweg zum Sicherheitsventil. Eine geschlossene Absperrung darf diesen Weg während des Betriebs nicht unterbrechen.“ | Entscheidend bleibt der freie Sicherheitsweg zum Sicherheitsventil. Zwischen Wärmeerzeuger und Sicherheitsventil darf keine Absperrung eingebaut sein. | Befund #1: DIN EN 12828 – nicht absperrbar; „geschlossene“ erlaubt sinngemäß eine offene Absperrung. DE und SQ wichen zudem voneinander ab. |
| 2 | KRITISCH | Ton SQ | vo:s08 | „Vendimtare mbetet rruga e lirë drejt valvulës së sigurisë. Një valvul mbyllëse nuk duhet ta ndërpresë këtë rrugë gjatë punës.“ | Vendimtare mbetet rruga e lirë e sigurisë drejt valvulës së sigurisë. Midis pajisjes së ngrohjes dhe valvulës së sigurisë nuk lejohet asnjë valvulë mbyllëse. | Befund #1. |
| 3 | MITTEL | Ton SQ | vo:s02 | „nuk montojmë vetëm sipas zakonit“ | Para se të lidhim tubacionet, na duhet skema hidraulike e miratuar. Në varësi të instalimit, ndërtimi mund të jetë i ndryshëm. Prandaj nuk montojmë sipas zakonit, por sipas sistemit të parashikuar. | Befund #2: „vetëm“ = nur – schwächt die Kernaussage ab. |
| 4 | MITTEL | Ton SQ | vo:s18 | „të mbrojtur kundër kthimit.“ | Më pas sistemi mbushet përmes një linje të përshtatshme mbushjeje, të mbrojtur kundër rrjedhjes mbrapsht. Nëse instalimi kërkon ujë të trajtuar, përdoret trajtimi i parashikuar. | Befund #3: „kthimi“ ist im selben Video der Rücklauf. |
| 5 | MITTEL | Bild SQ | scr:f_ba | „Ndarësi i sistemit – kundër kthimit“ | Ndarësi i sistemit – kundër rrjedhjes mbrapsht | Befund #3. |
| 6 | MITTEL | Ton SQ | vo:s13 | „mikrofluskave“ | Edhe ndarja e ajrit planifikohet sipas skemës hidraulike. Ndarësi i mikroflluskave dhe ajruesit automatikë kanë detyra të ndryshme, siç pamë në modulin shtatë. | Befund #4: „flluskë“ mit ll (hörbar). |
| 7 | MITTEL | Bild SQ | scr:las | „Ndarësi i mikrofluskave“ | Ndarësi i mikroflluskave | Befund #4. |
| 8 | MITTEL | Bild SQ | scr:las_d | „largon mikrofluskat gjatë qarkullimit“ | largon mikroflluskat gjatë qarkullimit | Befund #4. |
| 9 | MITTEL | Ton SQ | vo:s21 | „sensorët dhe kontrolli.“ | Para funksionimit normal kontrollohen pompa, valvulat devijuese ose rregulluese, sensorët dhe rregullimi. Një sensor i lidhur gabim mund ta drejtojë gabim edhe një sistem që nga ana hidraulike është ndërtuar saktë. | Befund #5: Regelung = „rregullimi“ („kontrollohen … kontrolli“ = Prüfung der Prüfung). |
| 10 | MITTEL | Ton SQ | vo:s29 | „sensorët dhe kontrollin.“ | Tani i bashkojmë të gjitha: furnizimin dhe kthimin, pompën, grupin e sigurisë dhe enën e zgjerimit. Filtrin me sitë, ndarësin e llumit dhe ndarësin e ajrit. Pikat e mbushjes, shpëlarjes dhe zbrazjes. Pastaj sipërfaqet ngrohëse – dhe në fund sensorët dhe rregullimin. | Befund #5. |
| 11 | MITTEL | Bild SQ | scr:ctrl | „Kontrolli“ | Rregullimi | Befund #5. |
| 12 | MITTEL | Bild SQ | scr:h21 | „Pompa, valvulat, sensorët, kontrolli“ | Pompa, valvulat, sensorët, rregullimi | Befund #5. |
| 13 | MITTEL | Bild SQ | scr:f_reg | „Kontrolli reagon“ | Rregullatori reagon | Befund #5. |
| 14 | MITTEL | Bild SQ | scr:wrong_ctrl | „Hidraulika saktë – kontrolli prapë gabim“ | Hidraulika në rregull – rregullimi prapë gabim | Befund #5; Befund #14 (KLEIN): „saktë“ ohne Artikel. |
| 15 | MITTEL | Bild SQ | scr:b11 | „Sensorët / kontrolli“ | Sensorët / rregullimi | Befund #5. |
| 16 | MITTEL | Bild SQ | scr:l10 | „Pompa / valvulat / sensorët / kontrolli“ | Pompa / valvulat / sensorët / rregullimi | Befund #5. |
| 17 | MITTEL | Bild SQ | scr:gg_ctrl | „Kontrolli“ | Rregullimi | Befund #5. |
| 18 | MITTEL | Bild SQ | scr:e11 | „Prurja minimale e PN e pakontrolluar“ | Prurja minimale e pompës së nxehtësisë e pakontrolluar | Befund #7: „PN“ ist keine bekannte Abkürzung. |
| 19 | MITTEL | Bild SQ | scr:l8 | „mbush i mbrojtur me ujë të përshtatshëm“ | mbush përmes linjës së mbrojtur me ujë të përshtatshëm | Befund #8: „i mbrojtur“ bezog sich auf „du“. |
| 20 | KLEIN | Ton SQ | vo:s15 | „të mbushet, shpëlahet dhe zbrazet“ | Për montimin dhe mirëmbajtjen parashikohen gjithashtu pika të përshtatshme për mbushje, shpëlarje dhe zbrazje. Pozicioni i tyre duhet të lejojë që sistemi të mbushet, të shpëlahet dhe të zbrazet në mënyrë të kontrolluar. | Befund #11: Konjunktiv braucht „të“ vor jedem Verb. |
| 21 | KLEIN | Ton DE | vo:s22 | „Diese werden nicht einfach durch maximale Pumpenleistung ersetzt,“ | Jetzt muss die Anlage auch hydraulisch funktionieren. Die Heizkreise benötigen die vorgesehenen Volumenströme. Diese werden nicht einfach mit maximaler Pumpenleistung erzwungen, sondern entsprechend der Planung eingestellt. | Befund #12: Volumenströme werden nicht „ersetzt“ (Logikfehler). |
| 22 | KLEIN | Ton SQ | vo:s22 | „Këto nuk zëvendësohen thjesht“ | Tani sistemi duhet të funksionojë edhe nga ana hidraulike. Qarqet e ngrohjes kanë nevojë për prurjet e parashikuara. Këto nuk arrihen thjesht duke vendosur pompën në maksimum, por rregullohen sipas projektit. | Befund #12: derselbe Logikfehler im SQ („zëvendësohen“ = werden ersetzt). |
| 23 | KLEIN | Ton SQ | vo:s30 | „Grupi i sigurisë dhe MAG-u mbrojnë presionin dhe ndryshimin e vëllimit.“ … „një sistem i montuar bukur“ | Mbaje mend kështu: fillimisht kemi skemën hidraulike të miratuar. Pastaj identifikohen furnizimi, kthimi dhe komponentët që janë tashmë të integruar. Grupi i sigurisë dhe MAG-u e sigurojnë sistemin ndaj presionit dhe ndryshimit të vëllimit. Filtri, ndarësi i llumit dhe ndarësi i ajrit mbrojnë sistemin sipas kërkesave të pajisjes. Përmes pikave të përshtatshme të mbushjes, shpëlarjes dhe zbrazjes, sistemi përgatitet, shpëlahet dhe kontrollohet. Më pas mbushet përmes një lidhjeje të mbrojtur me ujë të përshtatshëm dhe ajroset. Kontrollohen pompa, valvulat, sensorët dhe rregullimi dhe sigurohen prurjet e nevojshme. Në fund kontrollojmë sistemin si në gjendje të ftohtë ashtu edhe të ngrohtë. Sepse një sistem i montuar pastër është i përfunduar vetëm kur funksionon siç është planifikuar. | Befund #13: „den Druck schützen“ ist sinnwidrig; „bukur“ = schön, DE „sauber“. |
| 24 | KLEIN | Bild SQ | scr:e12 | „duket e pastër → funksioni pa kontroll“ | duket i pastër → funksioni pa kontroll | Befund #14: Genus (sistemi m.). |

### M10 – Wärmepumpen-Hydraulik

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker), A3 (valvul).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | MITTEL | Ton SQ | vo:s07 | „qarkun e prodhuesit nga ai“ | Sipas sistemit, ajo mund të sigurojë vëllim shtesë uji, të mbështesë kushtet e punës ose – me lidhjen e duhur – të ndajë hidraulikisht qarkun e pajisjes së ngrohjes nga ai i konsumatorëve. | Befund #4: „prodhuesi“ heißt im selben Video „Hersteller“. |
| 2 | MITTEL | Ton SQ | vo:s10 | „qarku i prodhuesit dhe qarku“ | Me një depozitë të lidhur paralelisht, qarku i pajisjes së ngrohjes dhe qarku i konsumatorëve mund të ndahen hidraulikisht nga njëri-tjetri. | Befund #4. |
| 3 | MITTEL | Bild SQ | scr:gkreis | „Qarku i prodhuesit“ | Qarku i pajisjes së ngrohjes | Befund #4. |
| 4 | MITTEL | Bild SQ | scr:kc_d | „ndarje hidraulike, qark i vetë prodhuesit“ | ndarje hidraulike, qark i veçantë i pajisjes së ngrohjes | Befund #4: „qark i vetë prodhuesit“ = Kreis des Herstellers. |
| 5 | MITTEL | Ton SQ | vo:s03 | „Shkëmbyesi i nxehtësisë i pompës ka nevojë“ | Shkëmbyesi i nxehtësisë i pompës së nxehtësisë ka nevojë, sipas pajisjes, për një qarkullim të caktuar uji. Nëse ky kufizohet shumë, pajisja nuk punon më në kushtet e parashikuara. | Befund #5: „pompa“ allein ist hier mehrdeutig (Umwälzpumpe/Wärmepumpe). |
| 6 | MITTEL | Ton SQ | vo:s29 | „nuk është valvul sigurie“ … „plotësojnë kërkesat e pompës.“ | Mbaje mend: vëllimi i ujit dhe prurja janë dy gjëra të ndryshme. Depozita në seri sjell vëllim uji, por nuk ndan automatikisht. Depozita paralele mund të sigurojë edhe ndarje. Nëse nevojitet depozitë, e përcakton hidraulika konkrete e pompës së nxehtësisë. Kur konsumatorët mbyllen, valvula e bajpasit mund të hapë një rrugë nga furnizimi te kthimi – por nuk është valvulë sigurie dhe pa dimensionim të saktë nuk garanton prurjen minimale. Vendimtare nuk është një pajisje e vetme, por që vëllimi, prurja dhe hidraulika së bashku plotësojnë kërkesat e pompës së nxehtësisë. | Befund #5 (dazu „valvulë“). |
| 7 | MITTEL | Bild SQ | scr:h03 | „Pompa ka nevojë për qarkullim“ | Pompa e nxehtësisë ka nevojë për qarkullim | Befund #5. |
| 8 | MITTEL | Bild SQ | scr:seq8 | „Pompa → qarqet → depozita → kthim“ | Pompa e nxehtësisë → qarqet → depozita → kthim | Befund #5. |
| 9 | MITTEL | Bild SQ | scr:minvs_s | „Prurja përmes pompës“ | Prurja përmes pompës së nxehtësisë | Befund #5. |
| 10 | MITTEL | Bild SQ | scr:sys_dec | „vendos sistemi konkret i pompës“ | vendos sistemi konkret i pompës së nxehtësisë | Befund #5. |
| 11 | MITTEL | Bild SQ | scr:l1 | „pompa ka kushte sipas pajisjes“ | pompa e nxehtësisë ka kushte sipas pajisjes | Befund #5. |
| 12 | MITTEL | Ton SQ | vo:s22 | „hapet shumë herët ose shumë,“ … „Krijohet një shkurtim hidraulik i padëshiruar.“ | Nëse valvula hapet shumë herët ose tepër shumë, një sasi e panevojshme uji kalon direkt nga furnizimi në kthim. Krijohet një qark i shkurtër hidraulik i padëshiruar. | Befund #6: „shkurtim“ = Kürzung; Kurzschluss = „qark i shkurtër“. Befund #14 (KLEIN): „ose shumë“ unvollständig. |
| 13 | MITTEL | Bild SQ | scr:short | „shkurtim hidraulik“ | qark i shkurtër hidraulik | Befund #6. |
| 14 | MITTEL | Bild SQ | scr:l2 | „kontrollo veç prurjen + vëllimin“ | kontrollo veç e veç prurjen dhe vëllimin | Befund #8: „veç“ allein liest sich als „nur“. |
| 15 | KLEIN | Ton SQ | vo:s25 | „një valvul bajpasi e montuar“ … „duhet të dimensionohen dhe rregullohen së bashku.“ | Pra, një valvulë bajpasi e montuar nuk garanton ende prurjen minimale. Bajpasi, pompa dhe hidraulika duhet të dimensionohen dhe të rregullohen së bashku. | Befund #15: Konjunktiv – „të“ wiederholen (dazu „valvulë“). |
| 16 | KLEIN | Ton SQ | vo:s27 | „gjoja prurja minimale është e sigurt.“ | Gabime tipike: çdo pompë ka nevojë për depozitë. Pa depozitë gjithmonë më efikase. Depozita në seri ngatërrohet me ndarjen. Litrat nominalë barazohen me prurjen minimale. Depozitë e madhe pa dimensionim. Depozitë shumë e nxehtë. Valvula e bajpasit ngatërrohet me valvulën e sigurisë, shumë e hapur, tepër e mbyllur ose e rregulluar sipas presionit të mbushjes. Ka bajpas – gjoja prurja minimale është e siguruar. Dhe: shkrirja vlerësohet vetëm nga litrat. | Befund #16: „e sigurt“ = ungefährlich, gemeint „sichergestellt“. |
| 17 | KLEIN | Bild SQ | scr:e3 | „Seria ngatërrohet me ndarjen“ | Depozita në seri ngatërrohet me ndarjen hidraulike | Befund #20: „Seria“ allein unverständlich. |
| 18 | KLEIN | Bild SQ | scr:e12 | „Shkrirja pretendohet vetëm nga vëllimi“ | Aftësia për shkrirje vlerësohet vetëm nga vëllimi | Befund #20: „Shkrirja pretendohet“ ist sinnlos. |

### M11 – Umwälzpumpe und Rückschlagventile

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker), A3 (valvul).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | MITTEL | Ton SQ | vo:intro | „valvulat kundërkthimit:“ | Bazat e Es-Ha-Ka-së. Moduli njëmbëdhjetë. Pompa qarkulluese dhe valvulat e kundërkthimit: diferenca e presionit, rregullimi, drejtimi i rrjedhës. | Befund #1: Genitiv braucht „e“ (hörbar). |
| 2 | MITTEL | Ton SQ | vo:s01 | „Valvulat kundërkthimit parandalojnë kthimin e padëshiruar“ | Këta dy komponentë ndikojnë drejtpërdrejt në mënyrën si qarkullon uji në sistemin e ngrohjes. Pompa qarkulluese krijon lëvizjen e ujit. Valvulat e kundërkthimit parandalojnë rrjedhjen e padëshiruar të ujit në drejtimin e kundërt. | Befund #1; Befund #4: „kthimi“ ist im Video der Rücklauf. |
| 3 | MITTEL | Ton SQ | vo:s03 | „Pompa krijon një ndryshim presioni“ … „Ky ndryshim presioni e shtyn“ | Pompa krijon një diferencë presioni midis anës hyrëse dhe asaj dalëse. Kjo diferencë presioni e shtyn ujin përmes tubave, valvulave dhe sipërfaqeve të ngrohjes. | Befund #3: „ndryshim“ = Änderung; gerade hier irreführend. |
| 4 | MITTEL | Ton SQ | vo:s04 | „Ky ndryshim presioni i pompës nuk është i njëjtë“ | Kjo diferencë presioni e pompës nuk është e njëjtë me presionin statik të sistemit. Mbajtja e presionit është një detyrë tjetër, ku ndër të tjera MAG-u ka një rol të rëndësishëm. | Befund #3. |
| 5 | MITTEL | Ton SQ | vo:s09 | „një ndryshim të caktuar presioni“ | Në një rregullim me diferencë konstante presioni, shpesh të quajtur Delta-p-c, pompa përpiqet të mbajë një diferencë të caktuar presioni brenda zonës së saj të punës. | Befund #3. |
| 6 | MITTEL | Ton SQ | vo:s21 | „valvulat kundërkthimit mund“ | Në sisteme me disa qarqe, valvulat e kundërkthimit mund të pengojnë që një pompë në punë ta shtyjë ujin mbrapsht nëpër një qark tjetër. | Befund #1. |
| 7 | MITTEL | Ton SQ | vo:s24 | „funksioni kundërkthim është“ | Në disa grupe pompash ose armatura, funksioni i kundërkthimit është tashmë i integruar. Prandaj para montimit kontrollohet se cilat funksione janë tashmë të pranishme. | Befund #2: Genitiv fehlt. |
| 8 | MITTEL | Ton SQ | vo:s27 | „Edhe valvulat kundërkthimit“ | Edhe valvulat e kundërkthimit nuk duhet të bllokojnë një lidhje që duhet të mbetet funksionale për valvulën e sigurisë, MAG-un ose një funksion tjetër mbrojtës. | Befund #1. |
| 9 | MITTEL | Ton SQ | vo:s29 | „Valvula kundërkthimit montohet“ … „Valvul shtesë, edhe pse funksioni kundërkthim“ … „Valvula kundërkthimit përdoret“ | Gabime tipike: pompa zgjidhet sipas lartësisë së ndërtesës. Pompa thjesht në maksimum. Presioni i pompës ngatërrohet me presionin e sistemit. Delta-p-c kuptohet si prurje gjithmonë e njëjtë. Pompa e integruar e pompës së nxehtësisë ndryshohet sipas dëshirës. Pompa montohet së prapthi. Pozicion i gabuar montimi. Punë pa ujë. Pompë ngrohjeje si pompë riqarkullimi për ujë sanitar. Valvula e kundërkthimit montohet së prapthi. Lloj i gabuar valvule. Frenuesi lihet i hapur pas mirëmbajtjes. Valvulë shtesë, edhe pse funksioni i kundërkthimit është tashmë i integruar. Valvula e kundërkthimit përdoret si ndarës sistemi. Dhe: rruga e MAG-ut ose e sigurisë bllokohet. | Befund #1, #2 (dazu „valvulë“). |
| 10 | MITTEL | Ton SQ | vo:s30 | „Te valvula kundërkthimit“ | Në kantier, te pompa kontrollon fillimisht drejtimin e rrjedhës, llojin, pozicionin e montimit dhe mënyrën e parashikuar të rregullimit. Te valvula e kundërkthimit kontrollon drejtimin, përdorimin dhe nëse ky funksion është parashikuar hidraulikisht në atë vend. | Befund #1. |
| 11 | MITTEL | Ton SQ | vo:s31 | „Valvulat kundërkthimit hapen“ … „pengojnë kthimin e padëshiruar.“ | Mbaje mend modulin njëmbëdhjetë kështu: pompa qarkulluese krijon diferencën e presionit që lëviz ujin e ngrohjes kundër rezistencave të rrjetit. Ajo nuk zëvendëson presionin statik të sistemit dhe as MAG-un. Në një qark të mbyllur dhe të mbushur, pompa nuk zgjidhet thjesht sipas lartësisë së ndërtesës dhe nuk vendoset pa arsye në maksimum. Drejtimi i rrjedhës, pozicioni dhe mënyra e rregullimit duhet t'i përshtaten sistemit konkret. Valvulat e kundërkthimit hapen në drejtimin e parashikuar dhe pengojnë rrjedhjen e padëshiruar mbrapsht. Frenues të posaçëm mund të kufizojnë edhe qarkullimin natyror. Por edhe këto valvula krijojnë rezistencë, duhet të montohen në drejtimin e duhur dhe nuk duhet të bllokojnë rrugë të nevojshme sigurie ose zgjerimi. Vendimtare është gjithmonë funksionimi i të gjithë hidraulikës. | Befund #1 und #4. |
| 12 | MITTEL | Bild SQ | scr:intro_title | „Pompa qarkulluese & valvulat kundërkthimit“ | Pompa qarkulluese & valvulat e kundërkthimit | Befund #1. |
| 13 | MITTEL | Bild SQ | scr:rv | „Valvula kundërkthimit“ | Valvula e kundërkthimit | Befund #1. |
| 14 | MITTEL | Bild SQ | scr:ex_rv | „Valvula kundërkthimit“ | Valvula e kundërkthimit | Befund #1. |
| 15 | MITTEL | Bild SQ | scr:h19 | „Valvula kundërkthimit: parimi“ | Valvula e kundërkthimit: parimi | Befund #1. |
| 16 | MITTEL | Bild SQ | scr:h26 | „Valvula kundërkthimit nuk është ndarës sistemi“ | Valvula e kundërkthimit nuk është ndarës sistemi | Befund #1. |
| 17 | MITTEL | Bild SQ | scr:e10 | „Valvula montuar së prapthi“ | Valvula e montuar së prapthi | Befund #1 (Zusatz): Artikel fehlt. |
| 18 | MITTEL | Bild SQ | scr:h24 | „Funksioni kundërkthim mund të jetë i integruar“ | Funksioni i kundërkthimit mund të jetë i integruar | Befund #2. |
| 19 | MITTEL | Bild SQ | scr:integ | „funksion kundërkthim i integruar“ | funksion kundërkthimi i integruar | Befund #2. |
| 20 | MITTEL | Bild SQ | scr:c01b | „pengon kthimin e ujit“ | pengon rrjedhjen mbrapsht të ujit | Befund #4. |
| 21 | MITTEL | Bild SQ | scr:bwd | „kthim: mbyllet“ | rrjedhje mbrapsht: mbyllet | Befund #4. |
| 22 | MITTEL | Bild SQ | scr:h21 | „Pse duhet penguar kthimi?“ | Pse duhet penguar rrjedhja mbrapsht? | Befund #4. |
| 23 | MITTEL | Bild SQ | scr:l5 | „valvula hapet përpara, mbyllet kundër kthimit“ | valvula hapet përpara, mbyllet kundër rrjedhjes mbrapsht | Befund #4. |
| 24 | MITTEL | Bild SQ | scr:h10 | „Presion konstant ≠ prurje konstante“ | Diferencë konstante presioni ≠ prurje konstante | Befund #5: „Differenz“ fehlte. |
| 25 | MITTEL | Bild SQ | scr:h12 | „Cila mënyrë rregullimi është e duhura?“ | Cila mënyrë rregullimi është e duhur? | Befund #6: prädikativ unbestimmt. |
| 26 | MITTEL | Bild SQ | scr:c05eq | „i mbushur + i mbyllur: balancohet“ | i mbushur + i mbyllur: kompensohet | Befund #7: „balancim“ nur für hydraulischen Abgleich. |
| 27 | KLEIN | Bild SQ | scr:h05 | „Lartësia e ndërtesës nuk është lartësia e pompës“ | Lartësia e ndërtesës nuk është lartësia e ngritjes së pompës | Befund #19: „lartësia e pompës“ = Einbauhöhe. |
| 28 | KLEIN | Bild SQ | scr:l2 | „nuk zëvendëson presionin e sistemit as MAG-un“ | nuk zëvendëson as presionin e sistemit, as MAG-un | Befund #21: „as … as“. |
| 29 | KLEIN | Bild SQ | scr:e15 | „Rruga e MAG-ut ose sigurisë bllokuar“ | Rruga e MAG-ut ose e sigurisë e bllokuar | Befund #21: Artikel fehlten. |

### M12 – Hydraulischer Abgleich

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker), A3 (valvul).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | MITTEL | Bild SQ | scr:c17a | „rregulluar me ndjenjë“ | rregulluar me hamendje | Befund #3: „me ndjenjë“ = mit Gefühl/Emotion. |
| 2 | MITTEL | Ton SQ | vo:s27 | „vjen nga llogaritja, jo nga ndjenja.“ | Në kantier, balancimin e njeh aty ku rregullohen rrugët e ujit: te shpërndarësi ose te valvulat e radiatorëve me paracaktim. Por vlera e duhur vjen nga dimensionimi, jo nga hamendja. | Befund #4: DE „aus der Auslegung, nicht aus dem Gefühl“. |
| 3 | MITTEL | Bild SQ | scr:c27a | „vlera nga llogaritja – jo nga ndjenja“ | vlera nga dimensionimi – jo me hamendje | Befund #4. |
| 4 | MITTEL | Bild SQ | scr:l8 | „kontrollo synimin / gjendjen“ | kontrollo vlerën e synuar / vlerën reale | Befund #5: „synim/gjendje“ ist als Soll/Ist unverständlich. |
| 5 | KLEIN | Bild DE | scr:e2 | „Alle Heizkörper gleiche Voreinstellung“ | Alle Heizkörper mit gleicher Voreinstellung | Befund #15: Präposition fehlt. |
| 6 | KLEIN | Bild SQ | scr:c18a | „Valvulat të paracaktuara“ | Valvulat e paracaktuara | Befund #16: nach bestimmtem Substantiv Artikel „e“. |

### M13 – Mischerkreis

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | KRITISCH | Ton SQ | vo:s16 | „kontrollohet skema e valvulës nga prodhuesi.“ | Edhe lidhjet nuk përcaktohen sipas pozicionit majtas, djathtas, lart ose poshtë. Para montimit kontrollohet skema e valvulës sipas udhëzimeve të prodhuesit. | Befund #1: Passiv + „nga prodhuesi“ = „wird vom Hersteller geprüft“ – Sinnfehler. |
| 2 | KRITISCH | Ton DE | vo:s26 | „Und ein Sollwert für jeden Mischer.“ | Typische Fehler: Anschlüsse nach links und rechts geraten. Mischen und Verteilen verwechselt. Stellmotor fährt falsch herum. Fühler vor dem Mischpunkt. Fühler schlecht befestigt. Mischer falsch dimensioniert. Pumpe und Mischer gleichgesetzt. Jeder Fußbodenheizung einen Mischer gegeben. Wärmepumpe unnötig hoch gefahren. Regelreaktion nicht geprüft. Ventilstellung nach Optik beurteilt. Und derselbe Sollwert für alle Mischer. | Befund #2: „ein Sollwert für jeden Mischer“ ist richtig, kein Fehler; gemeint ist „überall derselbe Sollwert“ (so SQ und termDe). |
| 3 | KRITISCH | Bild DE | scr:e12 | „ein Sollwert für jeden Mischer“ | derselbe Sollwert für alle Mischer | Befund #2. |
| 4 | MITTEL | Ton SQ | vo:s26 | „Reagimi i rregullimit i pakontrolluar.“ | Gabime tipike: lidhjet të hamendësuara majtas dhe djathtas. Përzierja dhe shpërndarja të ngatërruara. Motori lëviz në drejtimin e gabuar. Sensori para pikës së përzierjes. Sensori i fiksuar keq. Përzierësi me madhësi të gabuar. Pompa dhe përzierësi të barazuara. Përzierës në çdo ngrohje në dysheme. Pompa e nxehtësisë pa nevojë në temperaturë të lartë. Reagimi i rregullimit nuk është kontrolluar. Pozicioni i valvulës sipas pamjes. Dhe e njëjta vlerë për çdo përzierës. | Befund #5: „i pakontrolluar“ = außer Kontrolle. |
| 5 | MITTEL | Bild SQ | scr:e10 | „reagimi i rregullimit i pakontrolluar“ | reagimi i rregullimit pa u kontrolluar | Befund #5. |
| 6 | MITTEL | Ton SQ | vo:s03 | „nga ana e prodhuesit“ | Përzierësi kombinon ujë më të ngrohtë nga ana e pajisjes së ngrohjes me ujë më të ftohtë që kthehet nga qarku i ngrohjes. | Befund #3: „prodhuesi“ = auch Hersteller (im selben Video so benutzt). |
| 7 | MITTEL | Ton SQ | vo:s07 | „ujë të nxehtë nga prodhuesi.“ | Nëse qarku ka nevojë për temperaturë më të lartë, përzierësi lejon më shumë ujë të nxehtë nga pajisja e ngrohjes. | Befund #3. |
| 8 | MITTEL | Ton SQ | vo:s28 | „uji më i ngrohtë nga prodhuesi“ … „Kontrolli krahason“ | Mbaje mend: uji më i ngrohtë nga pajisja e ngrohjes dhe uji më i ftohtë i kthimit përzihen në mënyrë të kontrolluar. Kështu krijohet temperatura e përshtatshme e furnizimit. Pompa siguron qarkullimin, sensori mat pas pikës së përzierjes. Rregullatori krahason vlerën e kërkuar me atë reale dhe përmes motorit lëviz përzierësin. Kontrollo funksionin e lidhjeve, drejtimin e motorit dhe pozicionin e sensorit. Dhe: përzierësi vendoset vetëm aty ku koncepti hidraulik e kërkon. | Befund #3 und #4. |
| 9 | MITTEL | Bild SQ | scr:erzeuger | „Prodhuesi i nxehtësisë“ | Pajisja e ngrohjes | Befund #3. |
| 10 | MITTEL | Bild SQ | scr:hot | „ujë më i ngrohtë · nga prodhuesi“ | ujë më i ngrohtë · nga pajisja e ngrohjes | Befund #3. |
| 11 | MITTEL | Bild SQ | scr:c07 | „më shumë ujë i nxehtë nga prodhuesi“ | më shumë ujë i nxehtë nga pajisja e ngrohjes | Befund #3. |
| 12 | MITTEL | Bild SQ | scr:l1 | „ujë më i ngrohtë nga prodhuesi“ | ujë më i ngrohtë nga pajisja e ngrohjes | Befund #3. |
| 13 | MITTEL | Ton SQ | vo:intro | „sensori, kontrolli.“ | Bazat e Es-Ha-Ka-së. Moduli trembëdhjetë. Qarku me përzierje: përzierësi, pompa, sensori, rregullimi. | Befund #4: Regelung = „rregullimi“; „kontroll“ = Prüfung. |
| 14 | MITTEL | Ton SQ | vo:s01 | „sensori dhe kontrolli.“ | Një qark me përzierje i jep një qarku ngrohjeje temperaturën e vet të përshtatshme të furnizimit. Për këtë punojnë së bashku përzierësi, motori, pompa e qarkut, sensori dhe rregullimi. | Befund #4. |
| 15 | MITTEL | Ton SQ | vo:s10 | „Kontrolli duhet të dijë“ | Rregullimi duhet të dijë se çfarë temperature shkon realisht drejt qarkut. Prandaj sensori i furnizimit vendoset në vendin e parashikuar, pas pikës së përzierjes. | Befund #4. |
| 16 | MITTEL | Ton SQ | vo:s11 | „kontrolli krahason“ | Kështu krijohet një qark rregullimi: rregullatori krahason vlerën e kërkuar me vlerën reale dhe, nëse ka ndryshim, lëviz motorin. Përzierësi ndryshon raportin e përzierjes dhe sensori raporton temperaturën e re. | Befund #4 (DE „Regler“). |
| 17 | MITTEL | Ton SQ | vo:s12 | „kontrolli reagon“ | Nëse furnizimi i përzier është shumë i ftohtë, rregullatori reagon në drejtimin që sjell më shumë nxehtësi në qark. | Befund #4 (DE „Regler“). |
| 18 | MITTEL | Ton SQ | vo:s22 | „Kur kontrolli kërkon“ | Pas montimit kontrollohet edhe reagimi i rregullimit. Kur rregullatori kërkon më shumë nxehtësi, përzierësi nuk duhet të lëvizë në drejtimin e gabuar. | Befund #4 (DE „Regler“). |
| 19 | MITTEL | Bild SQ | scr:intro_sub | „Përzierësi · Pompa · Sensori · Kontrolli“ | Përzierësi · Pompa · Sensori · Rregullimi | Befund #4. |
| 20 | MITTEL | Bild SQ | scr:regelung | „Kontrolli“ | Rregullimi | Befund #4. |
| 21 | MITTEL | Bild SQ | scr:regler | „Kontrolli“ | Rregullatori | Befund #4. |
| 22 | MITTEL | Bild SQ | scr:c22b | „kontrolli kërkon më shumë nxehtësi“ | rregullatori kërkon më shumë nxehtësi | Befund #4. |
| 23 | MITTEL | Bild SQ | scr:l7 | „kontrolli: e kërkuar / reale → motori → përzierësi“ | rregullatori: e kërkuar / reale → motori → përzierësi | Befund #4. |
| 24 | MITTEL | Bild SQ | scr:e9 | „pompa e nxehtësisë pa nevojë shumë e lartë“ | pompa e nxehtësisë me temperaturë pa nevojë të lartë | Befund #6: liest sich „die Wärmepumpe ist unnötig sehr hoch“. |
| 25 | MITTEL | Ton SQ | vo:s15 | „Një valvul me tri rrugë“ … „Mos i ngatërroni!“ | Një valvulë me tri rrugë mund të përziejë ose të shpërndajë, sipas ndërtimit dhe lidhjes. Përzierje do të thotë: dy hyrje, një dalje. Shpërndarje do të thotë: një hyrje, dy dalje. Mos i ngatërro! | Befund #7: 2. Person Plural, sonst überall „ti“ (dazu „valvulë“, Befund #22). |
| 26 | MITTEL | Bild SQ | scr:b15 | „MOS I NGATËRRONI“ | MOS I NGATËRRO | Befund #7. |
| 27 | KLEIN | Bild SQ | scr:c16b | „kontrollo skemën e valvulës nga prodhuesi“ | kontrollo skemën e valvulës sipas prodhuesit | Befund #18: wie #1. |

### M14 – Heizungswasser: Magnetit und VDI 2035

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | MITTEL | Ton DE | vo:s30 | „Vau-De-I gleich immer vollentsalzen.“ | Typische Fehler: Schwarzes Wasser gleich sicher Magnetit. Magnetit gleich Kalk. Magnetabscheider reinigt alles. Abscheider gereinigt, Ursache ignoriert. Ständig nachgefüllt, ohne Ursachensuche. Fau-Deh-I gleich immer vollentsalzen. Härte und Leitfähigkeit verwechselt. Niedrige Härte gleich niedrige Leitfähigkeit. Niedrige Leitfähigkeit gleich alles perfekt. Peh-Ha vergessen. Additiv nach Werbung eingefüllt. Füllmengen nicht dokumentiert. Keine Nachkontrolle. Und: gute Wasserwerte, aber Druckhaltung ignoriert. | Befund #2: „Vau-De-I“ wird nachweislich als „Waudi“ gesprochen; intro/s14 wurden schon auf „Fau-Deh-I“ umgestellt, s30 vergessen. Neuen Clip abhören. |
| 2 | MITTEL | Ton SQ | vo:s04 | „të ashtuquajturin gëlqere.“ | Magnetiti nuk është e njëjta gjë me formimin e gurit, të ashtuquajturën gëlqere. Procese të tjera, substanca të tjera. | Befund #1: „gëlqere“ ist feminin → „të ashtuquajturën“. |
| 3 | MITTEL | Ton SQ | vo:s12 | „mund të krijohen depozita të reja.“ | Dhe një ndarës i pastruar nuk e eliminon shkakun. Nëse korrozioni ose hyrja e oksigjenit vazhdon, mund të krijohen depozitime të reja. | Befund #3: „depozitë“ = Speicher; Ablagerungen = „depozitime“. |
| 4 | MITTEL | Ton SQ | vo:s13 | „rrjedhjet, depozitat dhe“ | Prandaj shohim gjithë sistemin: gjendjen e ujit, historikun e instalimit, sasitë e shtuara, mbajtjen e presionit, hyrjen e ajrit ose oksigjenit, rrjedhjet, depozitimet dhe kërkesat e prodhuesit. | Befund #3. |
| 5 | MITTEL | Bild SQ | scr:c08 | „depozitat ndikojnë në funksionim“ | depozitimet ndikojnë në funksionim | Befund #3. |
| 6 | MITTEL | Bild SQ | scr:ex_sludge | „Shembull: depozitë në magnet“ | Shembull: depozitim në magnet | Befund #3. |
| 7 | MITTEL | Bild SQ | scr:neue_abl | „depozita të reja“ | depozitime të reja | Befund #3. |
| 8 | MITTEL | Bild SQ | scr:u7 | „Depozitat“ | Depozitimet | Befund #3. |
| 9 | MITTEL | Bild SQ | scr:ents_d | „jonet e tretura largohen pjesa më e madhe“ | pjesa më e madhe e joneve të tretura largohet | Befund #4: ungrammatisch. |
| 10 | MITTEL | Ton SQ | vo:s02 | „çfarë përmban uji dhe nga vjen.“ | Por ngjyra është vetëm një tregues, jo një diagnozë. Ajo nuk tregon çfarë përmban uji dhe nga vijnë këto substanca. | Befund #5: „nga vjen“ bezieht sich auf „uji“ (woher das Wasser kommt). |
| 11 | MITTEL | Bild SQ | scr:q_woher | „nga vjen?“ | nga vijnë? | Befund #5. |
| 12 | KLEIN | Ton SQ | vo:s28 | „Pas mbushjes dhe vënies në punë nuk ka mbaruar.“ | Pas mbushjes dhe vënies në punë puna nuk ka mbaruar. Sipas metodës dhe kërkesave të prodhuesit vijojnë kontrolli pasues dhe mirëmbajtja. | Befund #18: Subjekt fehlt (hörbar). |
| 13 | KLEIN | Bild SQ | scr:h23 | „Demineralizuar nuk do të thotë gati“ | Uji i demineralizuar nuk është automatikisht gati | Befund #19: Partizip ohne Bezugswort. |

### M15 – Typische Montagefehler und Abschlusskontrolle

Zusätzlich modulübergreifend: A1 (Outro), A2 (Kicker).

| Nr | Schwere | Typ | Szene bzw. Bildtext-Schlüssel | Jetzt (Zitat) | Neu (exakter Ersatztext) | Grund |
|---|---|---|---|---|---|---|
| 1 | KRITISCH | Ton DE | vo:s05 | „darf keine geschlossene Absperrung den Schutz unwirksam machen.“ | Danach die Sicherheitswege. Zwischen dem zu schützenden System und seinem Sicherheitsventil darf keine Absperrung sitzen. Eine geschlossene Absperrung macht den Schutz unwirksam. | Befund #1: „keine geschlossene Absperrung“ lässt eine offene im Sicherheitsweg zu (DIN EN 12828, DIN 1988-200). Widerspricht Bildtext noclose und M04. |
| 2 | KRITISCH | Ton SQ | vo:s05 | „nuk duhet të ketë asnjë mbyllje që e bën mbrojtjen joefektive.“ | Më pas, rrugët e sigurisë. Midis sistemit që duhet mbrojtur dhe valvulës së tij të sigurisë nuk lejohet asnjë valvulë mbyllëse. Një valvulë mbyllëse e mbyllur e bën mbrojtjen të pavlefshme. | Befund #1. |
| 3 | MITTEL | Ton SQ | vo:s11 | „montuar bukur.“ … „Po ashtu valvulat kundërkthimit“ … „duhet të jenë të sakta.“ | Te pompat dhe armaturat që varen nga drejtimi kontrollojmë shigjetat. Një pompë kundër drejtimit të rrjedhjes nuk punon siç duhet, edhe nëse është montuar pastër. Po ashtu valvulat e kundërkthimit dhe frenuesit e qarkullimit natyror: drejtimi dhe pozicioni i punës duhet të jenë të saktë. | Befund #2: „e“ fehlt; Befund #3: „drejtimi/pozicioni“ m. → „të saktë“; Befund #9 (KLEIN): „bukur“ = schön. |
| 4 | MITTEL | Ton SQ | vo:s23 | „Funksionimi: ftohtë, ngrohtë, ndryshimet e punës.“ | Kontrolli përfundimtar në tetë grupe. Hidraulika: lidhjet dhe rrugët e rrjedhjes. Siguria: valvulat e sigurisë dhe rrugët mbrojtëse. Mbajtja e presionit: MAG-u dhe presioni i sistemit. Uji: linja e mbushjes, trajtimi, dokumentimi. Rrjedhja: pompat, valvulat, filtrat, ajrimi, balancimi. Rregullimi: sensorët dhe servomotorët. Funksionimi: në të ftohtë, në të ngrohtë, kalimet ndërmjet mënyrave të punës. Dorëzimi: qasja për servis, shënimet, protokolli. | Befund #4: „ndryshimet e punës“ klingt nach Jobwechsel; im selben Video s19 richtig. |
| 5 | MITTEL | Bild SQ | scr:g7s | „ftohtë · ngrohtë · ndryshimet e punës“ | në të ftohtë · në të ngrohtë · kalimet e mënyrave të punës | Befund #4. |
| 6 | MITTEL | Ton SQ | vo:s18 | „presionin, rrjedhjet, pozicionet“ | Kontrolli bëhet në të ftohtë dhe në të ngrohtë. Edhe në të ftohtë kontrollojmë presionin, nëse ka rrjedhje, pozicionet e valvulave, sensorët dhe mbushjen. | Befund #5: „Rrjedhja“ ist im selben Video die Prüfgruppe Strömung. |
| 7 | MITTEL | Bild SQ | scr:c_dicht | „Rrjedhjet“ | Pa rrjedhje? | Befund #5. |
| 8 | KLEIN | Bild SQ | scr:noclose | „asnjë mbyllje në mes“ | asnjë valvulë mbyllëse në mes | Befund #14: „mbyllje“ = Verschluss; passend zum neuen Ton s05. |
| 9 | KLEIN | Bild SQ | scr:h24 | „E përfunduar – dhe funksionale“ | I përfunduar – dhe funksional | Befund #17: Bezug „sistemi“ (m.). |

## C. Durch Angleichung der App erledigt – keine Videoänderung nötig

Hier wich das Videowort von Quiz/Lernzielen ab, das Videowort ist aber korrekt. Nach der Regel „Video gewinnt“ wurde die App angepasst:
- Rückflussverhinderer „penguesi i kthimit“ (Videos M02, M05, M08) – M02 Befund #5, M05 #10, M08 #20 · Rückschlagventil bleibt „valvula e kundërkthimit“ (M03, M09, M11, M15).
- Puffer „depozitë akumuluese“, Überströmventil „valvula e bypass-it“ (M10 #1–#3).
- Schwerkraftbremse „frenuesi i qarkullimit natyror“ (M11 #10, M15).
- Voreinstellung „paracaktim“, Sollvolumenstrom „prurja e synuar“ (M12 #2, #6).
- Härtebildner „përbërësit e fortësisë“ (M14 #8) · Entsalzen M03 „çkripëzim“ (M03 #31) · Ablauftrichter „hinkë shkarkimi“ (M05 #7/#8).
- Ablauf am Systemtrenner „dalja“ (M03 #16) · Schmutzfänger „filtri me sitë“ (M06 #11) · „komprimohet“ (M01 #22) · Zirkulation „riqarkullim“ (M08 #16/#17).
- Modultitel 13 „Qarku me përzierje“ (M13 #9) – App-Titel in `content.js` und `chef.js` angepasst.

## D. Bewusst nicht aufgenommen (KLEIN, nur bei einem späteren Neurender)
Einheitlichkeit/Stil, nicht falsch: „ujë sanitar“ neben „ujë i pijshëm“ (M05, M08, M10, M11), „mbush“ statt „rimbush“ (M01, M03, M14), „Njësia e mbushjes“ (M03/M09), Vorlauf „vajtja/tubi i dërgimit“ (M04, M06, M07), „burimi/gjeneratori i nxehtësisë“ (M01, M02, M06), „presion i tepërt“ statt „mbipresion i palejuar“ (M01, M02, M04, M05, M08), „motori“ statt „servomotori“ (M13), MAG feminin „Em-A-Ge-ja“ (M04), „ihr“ statt „du“ (M01 DE), „instalim“ statt „sistem“ (mehrere), deutsche Anführungszeichen „…“ in SQ-Bildtexten, fehlende Wörter ohne Sinnfehler. Details in den Berichten.

## E. Zusammenfassung (Anzahl zu ändernder Ton-Szenen bzw. Bildtext-Schlüssel je Modul, inkl. Abschnitt A)

| Modul | Ton DE | Ton SQ | Bildtexte DE | Bildtexte SQ | davon mit KRITISCH-Befund |
|---|---|---|---|---|---|
| M00 | 0 | 0 | 0 | 0 | 0 |
| M01 | 2 | 3 | 2 | 4 | 4 |
| M02 | 0 | 16 | 3 | 25 | 0 |
| M03 | 2 | 6 | 3 | 14 | 2 |
| M04 | 2 | 3 | 2 | 10 | 6 |
| M05 | 2 | 5 | 3 | 9 | 6 |
| M06 | 0 | 5 | 1 | 6 | 0 |
| M07 | 0 | 11 | 2 | 17 | 0 |
| M08 | 3 | 14 | 6 | 29 | 12 |
| M09 | 2 | 10 | 1 | 16 | 2 |
| M10 | 0 | 8 | 1 | 15 | 0 |
| M11 | 0 | 12 | 1 | 24 | 0 |
| M12 | 0 | 2 | 2 | 9 | 0 |
| M13 | 1 | 13 | 2 | 15 | 3 |
| M14 | 1 | 6 | 1 | 9 | 0 |
| M15 | 1 | 5 | 1 | 7 | 2 |
| **Summe** | **16** | **119** | **31** | **209** | **37** |

„Bildtexte SQ“ zählt je Schlüssel einmal, auch wenn dort SQ-Text und `termDe` geändert werden. „davon mit KRITISCH-Befund“ zählt Szenen/Schlüssel (Ton und Bild zusammen).
