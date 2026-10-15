# Albanisch (SQ) – Glossar und Korrekturliste

Stand: 15.10.2026 (2. Durchgang eingearbeitet: Befunde `review/befunde/M00–M15.md`, siehe Abschnitt „2. Durchgang“ unten). Geprüft: Quizfragen M01–M15, `public/assets/i18n.js`, `functions/_lib/util.js`, Modultitel/Lernziele/Kernpunkte in `functions/_lib/content.js` (+ Titel in `public/assets/chef.js`). `public/assets/cert.js` enthält keine SQ-Texte (Zertifikat-PDF ist rein deutsch). `tools/gen-content.mjs` enthält nur die Teil-Namen (unverändert); die Quelle `design/akademie-basis.txt` liegt nicht im Repo, deshalb wurde `content.js` direkt korrigiert – **wer `gen-content.mjs` neu laufen lässt, muss die Korrekturen auch in der Design-Basis nachziehen.**

Leitlinie: einfache Standardsprache (gjuha standarde), Du-Form (ti) wie in der App, keine Lehnübersetzungen aus dem Deutschen, ein Fachbegriff = ein albanisches Wort.

**Regel seit dem 2. Durchgang:** Quiz und Lernziele/Kernpunkte eines Moduls benutzen das Wort, das im **Video dieses Moduls** gesprochen bzw. gezeigt wird (das Video ist schwer änderbar). Ausnahme: Das Videowort ist falsch oder missverständlich – dann bleibt die App beim richtigen Wort und das Video steht in `review/VIDEO-KORREKTUREN.md`. Wo zwei Videos bewusst verschiedene Wörter nutzen, steht das unten in der Spalte „Video“.

## Glossar DE → SQ

| Deutsch | Albanisch (verwendet) | Hinweis / Video |
|---|---|---|
| Anlage / Heizungsanlage | sistemi / sistem ngrohjeje | |
| Anlagendruck | presioni i sistemit | |
| Vordruck (MAG) | presioni paraprak | |
| Membran-Ausdehnungsgefäß (MAG) | ena e zgjerimit me membranë (MAG); MAG-u, MAG-ut, MAG-un | wie im Video (maskulin; M04-Ton sagt „Em-A-Ge-ja“, feminin – KLEIN). Gemischtes Genus mit „valvula“ → „Asnjëri … tjetrin“ |
| Trinkwasser-Ausdehnungsgefäß / Trink-MAG | ena e zgjerimit për ujë të pijshëm | |
| Ausdehnungswasser | uji i zgjerimit | vorher gemischt „uji i zgjeruar“ |
| (Volumen) aufnehmen / ausgleichen | merr / kompenson | „balancim“ nur für hydr. Abgleich |
| Gaspolster | jastëku i gazit | |
| (Gas) wird komprimiert | (gazi) komprimohet | **geändert** (Quiz M01 vorher „ngjeshet“): so sagen die Videos M01 und M02 |
| Heizungswasser | uji i ngrohjes | wie im Video |
| Trinkwasser | uji i pijshëm | Videos M00, M02 (gemischt), M05, M08, M10, M11 sagen teils „ujë sanitar“ → bei Neurender angleichen (M02: VIDEO-KORREKTUREN) |
| Sicherheitsventil | valvula e sigurisë (unbest.: valvulë sigurie) | Schreibung jetzt einheitlich „valvulë“ |
| Absperrung / Absperrventil | valvulë mbyllëse | nicht „izolim“ / „mbyllje“; Videos schreiben „valvul“ ohne ë → VIDEO-KORREKTUREN |
| Kugelhahn | valvulë sferike | |
| Rückflussverhinderer (Trinkwasser, Sicherheitsgruppe) | penguesi i kthimit (unbest.: pengues kthimi) | **geändert** (vorher „valvula e kundërkthimit“): so sagen die Videos M02, M05, M08; Quiz M02/M05 und Kernpunkt M05 angeglichen |
| Rückschlagventil | valvula e kundërkthimit (unbest.: valvulë kundërkthimi) | Videos M03, M09, M11, M15. Immer mit „e“ (M11-Video sagt „valvulat kundërkthimit“ → VIDEO-KORREKTUREN) |
| Rückfluss / Rückströmung (Vorgang) | rrjedhja mbrapsht | NICHT „kthimi“ (= Rücklauf); Videos M09/M11 noch „kthim“ → VIDEO-KORREKTUREN |
| Überströmventil | valvula e bypass-it (unbest.: valvulë bypass-i) | **geändert** (vorher „valvula e tejrrjedhjes“): M10-Video (Ton „bajpasit“ = TTS-Schreibweise, Bild „bypass-it“); Quiz + Kernpunkte M10 angeglichen. M15-Video sagt nur „Bypass“ |
| Systemtrenner | ndarësi i sistemit | |
| Druckminderer | reduktuesi i presionit | |
| Manometer | manometri | |
| (automatischer) Entlüfter | ajruesi (automatik) | |
| entlüften | ajros | |
| Luftabscheider / Mikroblasenabscheider | ndarës ajri / ndarësi i mikroflluskave | Schreibung „flluskë“ (ll); Videos M07/M09 schreiben „mikrofluska“ → VIDEO-KORREKTUREN |
| Schlammabscheider | ndarësi i llumit | wie im Video |
| Magnetabscheider | ndarësi magnetik | |
| magnetische / nichtmagnetische Partikel | grimca magnetike / jomagnetike | wie im Video. M06 nennt nach dem Schnitt („Modul 16“) das Wort „Magnetit“ nicht mehr → Quiz/Kernpunkte M06 sagen „grimcat magnetike“; „magnetit“ erst ab M14 |
| Schmutzfänger | filtri me sitë | **geändert** (vorher „filtri i papastërtive“): so sagen die Videos M06 und M09; Quiz M06 angeglichen |
| Wärmetauscher | shkëmbyesi i nxehtësisë | wie im Video |
| Wärmepumpe | pompë nxehtësie | wie im Video |
| Kältemittel | gaz ftohës | **neu**: „ftohës“ allein = Kühler; M07-Video sagt noch „ftohës“ → VIDEO-KORREKTUREN |
| Wärmeerzeuger / Erzeuger(-kreis) | pajisja e ngrohjes / qarku i pajisjes së ngrohjes | NICHT „prodhuesi“ (= Hersteller). Videos M10/M13 sagen noch „prodhuesi“ → VIDEO-KORREKTUREN; M01/M02 „burimi i nxehtësisë“, M06 „gjeneratori i nxehtësisë“ (KLEIN) |
| Verbraucherkreis | qarku i konsumatorëve | |
| Hersteller(angaben) | (udhëzimet e) prodhuesit | |
| Vorlauf / Rücklauf | furnizimi / kthimi | Videos: M01 „linja e dërgimit“ (→ VIDEO-KORREKTUREN), M04 „tubi i dërgimit“, M06/M07 „vajtja“ (KLEIN, bei Neurender) |
| Umwälzpumpe | pompa qarkulluese | |
| Umlauf | qarkullimi | |
| Zirkulation (Trinkwasser) | riqarkullimi / tubi i riqarkullimit | **geändert** (vorher „qarkullimi“): Videos M08, M11, M15 sagen „riqarkullim“; Quiz M05/M08 und Kernpunkt M08 angeglichen. „qarkullimi“ nur noch für Umlauf |
| Volumenstrom / Durchfluss | prurja | |
| Mindestvolumenstrom | prurja minimale | |
| Differenzdruck | diferenca e presionit | M11-Video sagt im Ton „ndryshim presioni“ (= Druckänderung) → VIDEO-KORREKTUREN |
| Widerstand (Rohrnetz) | rezistenca (e rrjetit të tubave) | |
| Auslegung / auslegen | dimensionim / dimensionoj | vorher „projektim“ |
| Druckhaltung | mbajtja e presionit | |
| Überdruck (unzulässiger) | mbipresion (i palejuar) | Videos M01, M02, M04, M05, M08 sagen „presion i tepërt / tepër i lartë“ (KLEIN, App bleibt) |
| Warmwasserspeicher | depozita e ujit të ngrohtë | |
| Puffer(speicher) | depozitë akumuluese; Reihen-/Parallelpuffer = depozita në seri / depozita paralele | **geändert** (vorher „depozitë tampon“): so sagt das M10-Video; Quiz + Kernpunkte M10 angeglichen. Andere Videos: M09 „puferi“, M15 „depozita“ (KLEIN, bei Neurender auf „depozitë akumuluese“) |
| Speicherladung / Laderücklauf | ngrohja e depozitës / kthimi i ngrohjes së depozitës | vorher „ngarkim“. M08-Video sagt noch „ngarkim“ → VIDEO-KORREKTUREN |
| Abblaseleitung | tubi i shkarkimit | |
| Ablauf(trichter) unter der Abblaseleitung | hinkë shkarkimi | **geändert** (vorher „sifon“; ein Siphon steht unter Wasser): M05-Video sagt „hinka e shkarkimit“; Quiz M05 und Kernpunkt M05 (DE jetzt „Ablauftrichter“) angeglichen |
| Ablauf (am Systemtrenner) | dalja (e ndarësit të sistemit) | **geändert** (vorher „shkarkimi“): M03-Video sagt „dalja“; Quiz M03 angeglichen (Genus f.: „e lirë, e dukshme“) |
| Trichter | hinkë | vorher falsch „gyp“ (= Rohr) |
| Abwasserrohr | tubi i kanalizimit | |
| Rohrbogen | bërryl tubi | vorher „gjunjë“ (kein Wort) |
| Passstück | pjesë lidhëse | vorher „pjesë ngjitëse“ (= klebend) |
| Nachfülleinheit | njësia e rimbushjes | Videos M03/M09 sagen „njësia e mbushjes“; Nachfüllen in Videos M01/M03/M14 meist „mbush“ (KLEIN, bei Neurender auf „rimbush“). App bleibt bei „rimbush“ |
| Patrone | fisheku (maskulin!) | vorher falsch „fishekja“ |
| Enthärten / Entsalzen | zbutja / **M03: çkripëzimi (demineralizimi)** · **M14: demineralizimi** | Zwei Videos, zwei Wörter (bewusst): M03-Video sagt „çkripëzim“, M14-Video „demineralizim“. In M03 (Quiz Q3, Kernpunkt 3) steht deshalb „çkripëzimi (demineralizimi)“, in M14 nur „demineralizimi“ |
| Härte / Leitfähigkeit | fortësia / përçueshmëria | |
| Härtebildner | përbërësit e fortësisë | **geändert** (vorher „formuesit e fortësisë“): so sagt das M14-Video; Quiz M14 angeglichen |
| Korrosion / Magnetit / Kalk | korrozion / magnetit / gëlqere | |
| Ablagerungen | depozitime | nicht „depozita“ (= Speicher). Videos M03, M06, M14 sagen noch „depozita“ → VIDEO-KORREKTUREN |
| Heizfläche | sipërfaqe ngrohëse | |
| Heizkörper | radiator | vorher „ngrohës“ |
| Heizlast / Wärmebedarf | ngarkesa termike / nevoja për nxehtësi | |
| Hydraulischer Abgleich | balancimi hidraulik | |
| Voreinstellung | paracaktim | **geändert** (vorher „rregullim paraprak“, davor „parapozicionim“): M12-Video sagt durchgehend „paracaktim“; Quiz + Kernpunkte M12 angeglichen |
| Thermostatkopf | koka termostatike | |
| Mischer / Mischerkreis | përzierësi / qarku me përzierje | **geändert** (vorher „qarku me përzierës“): M13-Video (Titel und Ton) sagt „Qarku me përzierje“; Modultitel in `content.js` und `chef.js` angeglichen |
| Stellmotor | servomotori | vorher „motori aktivizues“. M15-Video „servomotor“; M13-Video sagt nur „motori“ (KLEIN, App bleibt bei „servomotori“) |
| Stellrichtung / Drehrichtung | drejtimi i rrotullimit | |
| Fühler / Vorlauffühler | sensori / sensori i furnizimit | |
| Regler / Regelung | rregullatori / rregullimi | NICHT „kontroll(uesi)“ (= Prüfung). Videos M08, M09, M13 sagen noch „kontrolli/kontrolluesi“ → VIDEO-KORREKTUREN |
| Schwerkraftbremse | frenuesi i qarkullimit natyror | **geändert** (vorher „frena e gravitetit“): so sagen die Videos M11 und M15; Quiz M11 angeglichen |
| Hydraulikschema | skema hidraulike | |
| Inbetriebnahme | vënia në punë | |
| Dichtheit prüfen | kontrollo nëse ka rrjedhje | NICHT „izolim“ (= Dämmung). Videos M03, M06, M08 → VIDEO-KORREKTUREN |
| Verbrühschutz | mbrojtja nga përvëlimi | vorher „djegia“ (= Verbrennung). M08-Video sagt noch „djegia“ → VIDEO-KORREKTUREN |
| Übergabe / Protokoll | dorëzimi / protokolli | |
| Soll- / Istwert | vlera e kërkuar / vlera reale | M12-Video sagt für Sollwert „vlera e synuar“ (beides korrekt, nur M12) |
| Sollvolumenstrom | prurja e synuar | **neu**: M12-Video; Quiz + Kernpunkt M12 angeglichen (vorher „prurja e kërkuar“) |
| zugelassen (für Trinkwasser) | i miratuar | |
| nach Gefühl | me hamendje | vorher „sipas ndjesisë“ |
| „Was gilt?“ | „Çfarë është e saktë?“ | vorher Lehnübersetzung „Çfarë vlen?“ |
| Übersicht (App) | pasqyra | vorher „përmbledhja“ (= Zusammenfassung) |

## Änderungen (Datei, vorher → nachher, Grund)

Kürzel: **B** = Bedeutung wich vom DE ab, **G** = Grammatik, **R** = Rechtschreibung, **F** = Fachbegriff/Konsistenz, **N** = natürlicher / Lehnübersetzung entfernt.

| Datei | Vorher | Nachher | Grund |
|---|---|---|---|
| content/quiz/M01.json | Uji i ngrohtë ka nevojë për më shumë vend, e shtyn membranën nga ana e gazit dhe e ngjesh jastëkun e gazit. | Uji i ngrohtë ka nevojë për më shumë vend, e shtyn membranën drejt anës së gazit dhe e ngjesh jastëkun e gazit. | B: „zur Gasseite“ = drejt anës së gazit (nicht „von der Gasseite“) |
| content/quiz/M01.json | MAG-u është i mbyllur. Çfarë pasoje ka kjo? | MAG-u është mbyllur me valvulë. Çfarë pasoje ka kjo? | B: „abgesperrt“ = mit Absperrung geschlossen, nicht „geschlossenes Gefäß“ |
| content/quiz/M01.json | Pranon më shumë ujë se zakonisht | Merr më shumë ujë se zakonisht | N: „aufnehmen“ = merr |
| content/quiz/M01.json | Është i ndarë nga sistemi dhe nuk mund të balancojë | Është i ndarë nga sistemi dhe nuk mund të kompensojë | F: ausgleichen = kompensoj (balancim reserviert für hydraulischen Abgleich) |
| content/quiz/M01.json | Për çfarë shërben valvula e sigurisë, kur MAG-u është montuar tashmë? | Për çfarë shërben valvula e sigurisë, nëse është montuar tashmë një MAG? | N: Satzbau |
| content/quiz/M01.json | E mbron sistemin nga presioni i palejuar i lartë | E mbron sistemin nga mbipresioni i palejuar | G/F: falsche Adjektivfolge; einheitlich „mbipresion i palejuar“ |
| content/quiz/M01.json | E pranon ujin e zgjeruar gjatë ngrohjes | E merr ujin e zgjerimit gjatë ngrohjes | F: Ausdehnungswasser = uji i zgjerimit |
| content/quiz/M01.json | MAG-u pranon ndryshimet normale të vëllimit, valvula e sigurisë ndërhyn kur ka mbipresion të palejuar. Asnjëra nuk e zëvendëson tjetrën. | MAG-u kompenson ndryshimet normale të vëllimit, valvula e sigurisë ndërhyn kur ka mbipresion të palejuar. Asnjëri nuk e zëvendëson tjetrin. | G: gemischtes Genus (MAG m. + valvula f.) → maskulin; N: kompenson |
| content/quiz/M01.json | E çlironi nga presioni ana e ujit, pastaj mat presionin e gazit | Çliron presionin në anën e ujit, pastaj mat presionin e gazit | G: Person (2. Pl. → 2. Sg.) und Satzbau falsch |
| content/quiz/M01.json | Presioni i sistemit dhe presioni paraprak nuk janë e njëjta gjë: së pari çlirohet ana e ujit, pastaj mbahet presioni i gazit sipas udhëzimeve të prodhuesit. | Presioni i sistemit dhe presioni paraprak nuk janë e njëjta gjë: së pari çlirohet presioni në anën e ujit, pastaj matet presioni paraprak i gazit sipas udhëzimeve të prodhuesit. | B: „mbahet“ (wird gehalten) statt „matet“ (wird gemessen) – Sinnfehler |
| content/quiz/M02.json | Pse nuk lejohet një MAG ngrohjeje në ujin e pijshëm? | Pse një MAG ngrohjeje nuk lejohet në instalimin e ujit të pijshëm? | N: klarer |
| content/quiz/M02.json | Nuk ka membranë në atë vend | Aty nuk ka membranë | N |
| content/quiz/M02.json | Nuk është i lejuar për ujë të pijshëm | Nuk është i miratuar për ujë të pijshëm | F: zugelassen = i miratuar (Zulassung), nicht nur „erlaubt“ |
| content/quiz/M02.json | Një enë në ujin e pijshëm duhet të jetë shprehimisht e përshtatshme për ujë të pijshëm, një MAG ngrohjeje nuk është. | Një enë në ujin e pijshëm duhet të jetë shprehimisht e përshtatshme për ujë të pijshëm, një MAG ngrohjeje nuk është i tillë. | G: unvollständiger Satz |
| content/quiz/M02.json | Ku lidhet ena e zgjerimit për ujë të pijshëm në depozitën e ujit të ngrohtë? | Ku lidhet ena e zgjerimit për ujë të pijshëm te depozita e ujit të ngrohtë? | N |
| content/quiz/M02.json | Ana e ujit të ftohtë, ana e depozitës së valvulës së kundërkthimit | Ana e ujit të ftohtë, ndërmjet valvulës së kundërkthimit dhe depozitës | N: unverständliche Genitivkette; Sinn = Speicherseite |
| content/quiz/M02.json | Vetëm në anën e depozitës të valvulës së kundërkthimit uji që zgjerohet mund të arrijë në enë. | Vetëm ndërmjet valvulës së kundërkthimit dhe depozitës uji që zgjerohet mund të mblidhet në enë. | B: „sich sammeln“ = mblidhet; Genitivkette aufgelöst |
| content/quiz/M02.json | Pse duhet që ena e zgjerimit për ujë të pijshëm të lidhet me rrjedhje? | Pse ena e zgjerimit për ujë të pijshëm duhet të lidhet që uji të rrjedhë nëpër të? | N: „me rrjedhje“ unklar (klingt nach „mit Leck“) |
| content/quiz/M02.json | Uji që qëndron është problem higjienik, prandaj shmangen tubat e vdekur pa rrjedhje. | Uji i ndenjur është problem higjienik, prandaj shmangen degët qorre të tubave ku uji nuk rrjedh. | N: „tubat e vdekur“ Lehnübersetzung von „tote Leitung“ |
| content/quiz/M02.json | Gjatë ngrohjes pikon valvula e sigurisë. Nuk ka enë zgjerimi. Çfarë vlen? | Gjatë ngrohjes pikon valvula e sigurisë. Nuk ka enë zgjerimi për ujë të pijshëm. Çfarë është e saktë? | B: „Trink-MAG“ fehlte; N: „Çfarë vlen?“ Lehnübersetzung von „Was gilt?“ |
| content/quiz/M02.json | Kjo mund të jetë normale, uji i zgjeruar shkarkohet | Kjo mund të jetë normale, uji i zgjerimit shkarkohet | F: uji i zgjerimit |
| content/quiz/M02.json | Valvula mbyllet menjëherë | Valvula mbyllet menjëherë me dorë | B: „wird zugedreht“ = Handlung, nicht „schließt sich“ |
| content/quiz/M02.json | Depozita është vendosur shumë e ftohtë | Depozita është rregulluar në temperaturë shumë të ulët | N: „vendosur e ftohtë“ Lehnübersetzung von „kalt eingestellt“ |
| content/quiz/M02.json | Pa enë uji i zgjeruar nuk mund të kthehet dhe del përmes valvulës së sigurisë, gjatë ngrohjes kjo nuk është automatikisht defekt. | Pa enë zgjerimi, uji i zgjerimit nuk mund të kthehet dhe del nga valvula e sigurisë; gjatë ngrohjes kjo nuk do të thotë automatikisht defekt. | F/N |
| content/quiz/M02.json | Ena pranon ndryshimet normale të vëllimit, valvula e sigurisë e mbron depozitën nga mbipresioni i palejuar. | Ena kompenson ndryshimet normale të vëllimit, valvula e sigurisë e mbron depozitën nga mbipresioni i palejuar. | N: aufnehmen = kompenson |
| content/quiz/M03.json | Ndarësi i sistemit e mbron ujin e pijshëm nga kthimi i ujit nga ngrohja. | Ndarësi i sistemit e mbron ujin e pijshëm nga rrjedhja mbrapsht e ujit të ngrohjes. | N: „kthimi“ = auch Rücklauf → missverständlich |
| content/quiz/M03.json | Shkarkimi i ndarësit të sistemit është i mbyllur. Çfarë është e saktë? | Shkarkimi i ndarësit të sistemit është i bllokuar. Çfarë është e saktë? | B: zugestopft = i bllokuar |
| content/quiz/M03.json | S'ka rëndësi, sa kohë presioni është në rregull | S'ka rëndësi, për sa kohë që presioni është në rregull | G |
| content/quiz/M03.json | Shkarkimi i ndarësit të sistemit duhet të mbetet i lirë, i dukshëm dhe i kullueshëm, dhe nuk lejohet të mbyllet. | Shkarkimi i ndarësit të sistemit duhet të mbetet i lirë, i dukshëm dhe të mund ta shkarkojë ujin, dhe nuk lejohet të mbyllet. | N: „i kullueshëm“ ungebräuchlich |
| content/quiz/M03.json | Cili është dallimi ndërmjet zbutjes dhe çkripëzimit? | Cili është dallimi ndërmjet zbutjes dhe demineralizimit? | F: Entsalzen = demineralizim (bekannter Fachbegriff, „ujë i demineralizuar“) |
| content/quiz/M03.json | Zbutja i heq të gjitha kripërat, çkripëzimi vetëm gëlqeren | Zbutja i heq të gjitha kripërat, demineralizimi vetëm gëlqeren | F |
| content/quiz/M03.json | Çkripëzimi i heq jonet gjerësisht, zbutja ul fortësinë | Demineralizimi i heq pothuajse të gjitha jonet, zbutja ul fortësinë | F; N: „gjerësisht“ = „breit“, nicht „weitgehend“ |
| content/quiz/M03.json | Çkripëzimi e bën ujin më të fortë | Demineralizimi e bën ujin më të fortë | F |
| content/quiz/M03.json | Gjatë zbutjes ulet kryesisht fortësia e ujit, gjatë çkripëzimit jonet e tretura hiqen gjerësisht dhe përçueshmëria ulet. | Gjatë zbutjes ulet kryesisht fortësia e ujit, gjatë demineralizimit jonet e tretura hiqen pothuajse plotësisht dhe përçueshmëria ulet. | F/N |
| content/quiz/M03.json | Kur ndërrohet fishekja e njësisë së rimbushjes? | Kur ndërrohet fisheku i njësisë së rimbushjes? | G: „fishek“ ist maskulin (fisheku) |
| content/quiz/M03.json | Kur duket e ndotur nga jashtë | Kur duket i ndotur nga jashtë | G: Genus (fishek m.) |
| content/quiz/M03.json | Fishekja nuk ndërrohet sipas pamjes ose afatit fiks, vendimtare janë kapaciteti, vlerat e matjes dhe udhëzimet e prodhuesit. | Fisheku nuk ndërrohet sipas pamjes ose sipas një afati fiks, vendimtare janë kapaciteti, vlerat e matjes dhe udhëzimet e prodhuesit. | G: Genus |
| content/quiz/M03.json | Çfarë bën gjatë ndërrimit të fishekës, para se ta hapësh? | Çfarë bën gjatë ndërrimit të fishekut, para se ta hapësh? | G: Genus |
| content/quiz/M03.json | E hap fishekën menjëherë nën presion | E hap fishekun menjëherë nën presion | G: Genus |
| content/quiz/M03.json | E ndalon mbushjen, e mbyll dhe e çliron presionin | Ndalon mbushjen, mbyll valvulat dhe çliron presionin | B: „e mbyll“ ohne Objekt = „schließt es“ (Patrone?) – gemeint: absperren |
| content/quiz/M03.json | Së pari ndalohet mbushja, mbyllet zona dhe çlirohet presioni, pastaj fishekja ndërrohet sipas udhëzimeve të prodhuesit. | Së pari ndalet mbushja, ajo pjesë mbyllet me valvula dhe çlirohet presioni, pastaj fisheku ndërrohet sipas udhëzimeve të prodhuesit. | G: Genus; N: „ndalohet“ = wird verboten |
| content/quiz/M04.json | Një gjunjë tubi | Një bërryl tubi | R/F: „gjunjë“ existiert nicht; Rohrbogen = bërryl |
| content/quiz/M04.json | Një valvul mbyllëse | Një valvulë mbyllëse | R: unbestimmte Form „valvulë“ |
| content/quiz/M04.json | Një pjesë ngjitëse | Një pjesë lidhëse | B: „ngjitëse“ = klebend; Passstück = pjesë lidhëse |
| content/quiz/M04.json | E pranon ujin e zgjeruar | E merr ujin e zgjerimit | F |
| content/quiz/M05.json | Çfarë ndodh në depozitë gjatë ngrohjes, nëse nuk ka enë zgjerimi? | Çfarë ndodh në depozitë gjatë ngrohjes, nëse nuk ka enë zgjerimi për ujë të pijshëm? | B: „Trinkwasser-MAG“ fehlte |
| content/quiz/M05.json | Uji i ngrohur nuk mund të kthehet, presioni ngrihet dhe valvula e sigurisë e shkarkon ujin e zgjeruar. | Uji i ngrohur nuk mund të kthehet, presioni ngrihet dhe valvula e sigurisë e shkarkon ujin e zgjerimit. | F |
| content/quiz/M05.json | E bën të dukshëm daljen e ujit te shkarkimi | E bën të dukshme daljen e ujit te shkarkimi | G: Kongruenz (dalja f.) |
| content/quiz/M05.json | I dukshëm mbi një kullues me dalje të lirë | I dukshëm mbi një sifon, me dalje të lirë | F: Ablauf = sifon (bekannt auf der Baustelle) |
| content/quiz/M05.json | I lidhur ngushtë me tubin e ujërave, pa gyp | I lidhur hermetikisht me tubin e kanalizimit, pa hinkë | B: „gyp“ = Rohr, Trichter = hinkë; Abwasserrohr = tubi i kanalizimit |
| content/quiz/M05.json | Dalja e ujit duhet të mbetet e dukshme dhe të rrjedhë lirisht, shkarkimi nuk lejohet të jetë i mbyllur ose nën ujë. | Dalja e ujit duhet të mbetet e dukshme dhe uji të rrjedhë lirisht, shkarkimi nuk lejohet të jetë i mbyllur ose të përfundojë nën ujë. | G/B |
| content/quiz/M05.json | E mbyll shkarkimin | E bllokon shkarkimin | B: zustopfen = bllokoj |
| content/quiz/M05.json | E vendos depozitën më të ftohtë dhe vazhdon | Ul temperaturën e depozitës dhe vazhdon | N: Lehnübersetzung „kälter stellen“ |
| content/quiz/M05.json | Një valvul sigurie që pikon nuk riparohet kurrë duke e mbyllur, kur uji del vazhdimisht duhet të hetohet shkaku. | Një valvulë sigurie që pikon nuk riparohet kurrë duke e mbyllur, kur uji del vazhdimisht duhet kërkuar shkaku. | R: valvulë; N: „hetohet“ = polizeilich ermitteln |
| content/quiz/M06.json | Grimcat depozitohen në pompa, valvula dhe zona të ngushta të shkëmbyesit dhe prishin funksionimin dhe rrjedhjen. | Grimcat depozitohen në pompa, valvula dhe në pjesët e ngushta të shkëmbyesve të nxehtësisë dhe pengojnë funksionimin dhe rrjedhjen. | F: Fachbegriff vollständig; N: stören = pengojnë |
| content/quiz/M06.json | Po e pastron një ndarës me magnet. Çfarë bën pjesë në punë? | Po e pastron një ndarës me magnet. Çfarë duhet bërë? | N |
| content/quiz/M06.json | Trupi hapet nën presion | Trupi i ndarësit hapet nën presion | N: klarer |
| content/quiz/M06.json | Magneti lirohet sipas udhëzimit, pastaj lëshohet kontrolluar | Magneti hiqet sipas udhëzimit, pastaj shkarkohet në mënyrë të kontrolluar | G/B: „lëshohet kontrolluar“ ohne Objekt und ungrammatisch |
| content/quiz/M06.json | Nëse magneti mbetet në pozicionin e kapjes, grimcat magnetike mbeten ngjitur. Procedura e saktë varet nga udhëzimi i prodhuesit. | Nëse magneti mbetet në pozicionin e kapjes, grimcat magnetike mbeten të kapura. Procedura e saktë varet nga udhëzimi i prodhuesit. | N |
| content/quiz/M06.json | Po, shpëlahet dhe ndahet, jo njëra ose tjetra | Po, duhen të dyja: shpëlarja dhe ndarësi | N: wörtliche Übersetzung von „nicht entweder oder“ unverständlich |
| content/quiz/M07.json | Pse duhet një ndarës i mikroflluskave? | Për çfarë shërben një ndarës i mikroflluskave? | N |
| content/quiz/M07.json | Thjesht të ajroset sa herë që duhet | Thjesht të ajroset përsëri e përsëri | B: „immer wieder“, nicht „so oft wie nötig“ (klang wie richtige Antwort) |
| content/quiz/M07.json | Pse duhet që një ndarës ajri të montohet në pozicionin e duhur? | Pse një ndarës ajri duhet të montohet në pozicionin e duhur? | N: Wortstellung |
| content/quiz/M08.json | Si i lidh saktë lidhjet në depozitë? | Si i identifikon saktë lidhjet e depozitës? | B: „zuordnen“ ≠ „anschließen“; Tautologie „lidh lidhjet“ |
| content/quiz/M08.json | Sipas ndjesisë së montuesit | Si t'i duket montuesit | N: „ndjesi“ = körperliche Empfindung |
| content/quiz/M08.json | Çfarë vlen për rrugën ndërmjet depozitës dhe valvulës së sigurisë? | Si duhet të jetë rruga ndërmjet depozitës dhe valvulës së sigurisë? | N: „Was gilt“-Lehnübersetzung |
| content/quiz/M08.json | Duhet të mbetet gjithmonë i lirë gjatë punës | Gjatë punës duhet të mbetet gjithmonë e lirë | G: Kongruenz (rruga f.) |
| content/quiz/M08.json | Mund të mbyllet me një valvul sferike | Mund të mbyllet me një valvulë sferike | R |
| content/quiz/M08.json | Mund të mbetet përgjithmonë i mbyllur pas mirëmbajtjes | Me rastin e mirëmbajtjes mund të mbetet përgjithmonë e mbyllur | G: Kongruenz; B: „bei Wartung“ ≠ „nach“ |
| content/quiz/M08.json | Është i rëndësishëm vetëm te depozitat e vogla | Është e rëndësishme vetëm te depozitat e vogla | G: Kongruenz |
| content/quiz/M08.json | Pse kthimi i ngarkimit nuk është qarkullimi? | Pse kthimi i ngrohjes së depozitës nuk është qarkullimi? | F: „ngarkim“ (Ladung) Lehnübersetzung |
| content/quiz/M08.json | Të dyja bartin ujë të pijshëm, vetëm me temperaturë tjetër | Në të dyja rrjedh ujë i pijshëm, vetëm me temperaturë tjetër | N: „bartin“ regional |
| content/quiz/M08.json | Kthimi i ngarkimit është tubi i ujit të ftohtë | Kthimi i ngrohjes së depozitës është tubi i ujit të ftohtë | F |
| content/quiz/M08.json | Janë dy sisteme uji krejtësisht të ndara | Janë dy sisteme uji të ndara | B: „krejtësisht“ steht nicht im DE |
| content/quiz/M08.json | Kthimi i ngarkimit i përket ujit të ngrohjes, qarkullimi ka rrugën e vet të kthimit për ujin e pijshëm. | Kthimi i ngrohjes së depozitës i përket ujit të ngrohjes, qarkullimi ka rrugën e vet të kthimit për ujin e pijshëm. | F |
| content/quiz/M08.json | Pse nuk e zgjedh vendin e sensorit sipas ndjesisë? | Pse nuk e zgjedh vendin e sensorit me hamendje? | N: nach Gefühl = me hamendje |
| content/quiz/M08.json | Aty ka nevojë për më pak vend në depozitë | Aty zë më pak vend në depozitë | N |
| content/quiz/M08.json | Depozita atëherë ngarkohet më qetë | Depozita atëherë ngrohet më pa zhurmë | F/N |
| content/quiz/M08.json | Një sensor i vendosur gabim jep vlera të gabuara dhe atëherë edhe ngarkimi i depozitës reagon gabim. | Një sensor i vendosur gabim jep vlera të gabuara dhe atëherë edhe ngrohja e depozitës reagon gabim. | F |
| content/quiz/M08.json | Ngrohet vetëm pasi është mbushur, ajrosur dhe kontrolluar për rrjedhje, rrugën e sigurisë dhe funksionin. | Ngrohja lejohet vetëm pasi depozita është mbushur, ajrosur dhe është kontrolluar nëse ka rrjedhje, si dhe rruga e sigurisë dhe funksionimi. | G: Objekte nach „kontrolluar për“ ungrammatisch |
| content/quiz/M09.json | Së pari skema, pastaj tubacioni – përndryshe ndërton sipas zakonit në vend të planit. | Së pari skema, pastaj tubacioni – përndryshe punon sipas zakonit dhe jo sipas planit. | N |
| content/quiz/M09.json | Pjesën e njëjtë e montosh edhe një herë për siguri | E monton edhe një herë të njëjtën pjesë, për siguri | G: Konjunktiv „montosh“ ohne „të“; Person einheitlich |
| content/quiz/M09.json | Gjithmonë shton një pjesë të dytë jashtë | Gjithmonë shton një pjesë të dytë jashtë pajisjes | N: klarer |
| content/quiz/M09.json | Kontrollon çfarë është e integruar dhe nuk montosh asgjë dy herë | Kontrollon çfarë është e integruar dhe nuk monton asgjë dy herë | G: Verbform |
| content/quiz/M09.json | Një pjesë e montuar nuk montohet automatikisht edhe një herë, prandaj kontrollon më parë çfarë përmban tashmë pajisja. | Një pjesë që është tashmë në pajisje nuk montohet automatikisht edhe një herë, prandaj kontrollon më parë çfarë përmban tashmë pajisja. | N |
| content/quiz/M09.json | Pajisja e ngrohjes ka një MAG të integruar. Çfarë vlen? | Pajisja e ngrohjes ka një MAG të integruar. Çfarë është e saktë? | N: „Was gilt“ |
| content/quiz/M09.json | Një MAG tjetër është atëherë i ndaluar | Një MAG tjetër atëherë është i ndaluar | N: Wortstellung |
| content/quiz/M09.json | Sipas llogaritjes ose kërkesës së këtij sistemi | Sipas llogaritjes ose vlerës së caktuar për këtë sistem | B: Vorgabe = vorgegebener Wert |
| content/quiz/M09.json | Sipas ndjesisë gjatë fryrjes | Me hamendje gjatë fryrjes | N |
| content/quiz/M09.json | Po, montimi i pastër do të thotë funksion i saktë | Po, montimi i pastër do të thotë funksionim i saktë | N |
| content/quiz/M09.json | Një sistem mund të duket i përsosur dhe prapë të punojë gabim hidraulikisht ose në rregullim. | Një sistem mund të duket i përsosur dhe prapë të punojë gabim hidraulikisht ose nga ana e rregullimit. | N |
| content/quiz/M10.json | Të dyja janë e njëjta gjë, vetëm matet ndryshe | Të dyja janë e njëjta gjë, vetëm maten ndryshe | G: Plural |
| content/quiz/M10.json | Po, pa tampon nuk punon kurrë efikasshëm | Po, pa tampon nuk punon kurrë në mënyrë efikase | R: „efikasshëm“ nicht standardsprachlich |
| content/quiz/M10.json | Jo, një tampon atje është gjithmonë i ndaluar | Jo, aty tamponi është gjithmonë i ndaluar | N |
| content/quiz/M10.json | Një sistem mund të punojë pa tampon nëse prodhuesi e lejon konceptin dhe kushtet e punës plotësohen. | Një sistem mund të punojë pa tampon nëse prodhuesi e miraton këtë koncept dhe plotësohen kushtet e punës. | F: freigeben = miratoj |
| content/quiz/M10.json | Të gjitha qarqet mbyllen. Çfarë sjell atëherë tamponi në seri? | Të gjitha qarqet e ngrohjes mbyllen. Çfarë sjell atëherë tamponi në seri? | B: „Heizkreise“ |
| content/quiz/M10.json | I ndan qarkun e prodhuesit dhe të konsumatorëve | I ndan qarkun e pajisjes së ngrohjes nga ai i konsumatorëve | F: „prodhuesi“ = auch Hersteller → missverständlich |
| content/quiz/M10.json | Tamponi në seri rrit kryesisht sasinë e ujit, por nuk krijon rrugë të hapur rrjedhjeje. | Tamponi në seri rrit kryesisht sasinë e ujit, por nuk krijon rrugë të hapur për rrjedhjen. | N |
| content/quiz/M10.json | Ku e çon valvula e tejrrjedhjes ujin kur qarqet mbyllen? | Ku e çon valvula e tejrrjedhjes ujin kur qarqet e ngrohjes mbyllen? | B: „Heizkreise“ |
| content/quiz/M10.json | Në rast mbipresioni jashtë, në kanalizim | Kur ka mbipresion, jashtë në kanalizim | N |
| content/quiz/M10.json | Valvula e tejrrjedhjes hap një rrugë të brendshme dhe nuk është valvul sigurie, sepse ajo e shkarkon ujin jashtë. | Valvula e tejrrjedhjes hap një rrugë të brendshme dhe nuk është valvulë sigurie, sepse valvula e sigurisë e shkarkon ujin jashtë. | B: „ajo“ war mehrdeutig (klang wie: das Überströmventil führt nach außen ab) |
| content/quiz/M10.json | Është montuar një valvul tejrrjedhjeje. A është prurja minimale e siguruar? | Është montuar një valvulë tejrrjedhjeje. A është e siguruar prurja minimale? | R; N |
| content/quiz/M10.json | Një bypass vetëm nuk garanton asgjë, ai duhet të përshtatet me pompën dhe hidraulikën dhe të rregullohet saktë. | Bypass-i vetëm për vete nuk garanton asgjë, ai duhet të përshtatet me pompën dhe hidraulikën dhe të rregullohet saktë. | B: „Një bypass vetëm“ = „nur ein Bypass“ |
| content/quiz/M11.json | Presionin që e ngre ujin në katin e fundit | Presionin që e ngre ujin në katin më të lartë | N: eindeutig „oberstes Stockwerk“ |
| content/quiz/M11.json | Pompa duhet t'i përshtatet prurjes së nevojshme dhe rezistencave, maksimumi nuk është projektim. | Pompa duhet t'i përshtatet prurjes së nevojshme dhe rezistencave, maksimumi nuk është dimensionim. | F: Auslegung = dimensionim |
| content/quiz/M11.json | Diferenca konstante e presionit nuk është prurje konstante kur ndryshojnë pozicioni i valvulave dhe rezistencat. | Diferenca konstante e presionit nuk do të thotë prurje konstante kur ndryshojnë pozicioni i valvulave dhe rezistencat. | N |
| content/quiz/M11.json | Çfarë vlen për një valvul kundërkthimi në ngrohje? | Çfarë është e saktë për një valvulë kundërkthimi në ngrohje? | R; N |
| content/quiz/M11.json | Montohet në drejtimin e duhur, nuk bllokon rrugët e mbrojtjes | Montohet në drejtimin e duhur, nuk bllokon rrugët e sigurisë | F: einheitlich „rruga e sigurisë“ |
| content/quiz/M11.json | Një valvul kundërkthimi ka presion hapjeje dhe rezistencë dhe nuk lejohet kurrë ta bllokojë rrugën drejt valvulës së sigurisë ose MAG-ut. | Një valvulë kundërkthimi ka presion hapjeje dhe rezistencë dhe nuk lejohet kurrë ta bllokojë rrugën drejt valvulës së sigurisë ose MAG-ut. | R |
| content/quiz/M12.json | Ngrohësit e poshtëm kanë gjithmonë nevojë për më shumë ujë | Radiatorët e poshtëm kanë gjithmonë nevojë për më shumë ujë | F: Heizkörper = radiator (auf der Baustelle üblich) |
| content/quiz/M12.json | Madhësia, sipërfaqet e jashtme dhe dritaret përcaktojnë nevojën për nxehtësi, prej andej del prurja e kërkuar për çdo sipërfaqe ngrohëse. | Madhësia, sipërfaqet e jashtme dhe dritaret përcaktojnë nevojën për nxehtësi, dhe nga kjo del prurja e kërkuar për çdo sipërfaqe ngrohëse. | N |
| content/quiz/M12.json | Të gjitha valvulat e ngrohësve kanë të njëjtin parapozicionim. A është balancim? | Të gjitha valvulat e radiatorëve kanë të njëjtin rregullim paraprak. A është kjo balancim? | F: Voreinstellung = rregullim paraprak („parapozicionim“ Kunstwort); Heizkörper = radiator |
| content/quiz/M12.json | Po, kështu çdo ngrohës merr njësoj ujë | Po, kështu çdo radiator merr njësoj ujë | F |
| content/quiz/M12.json | I njëjti parapozicionim kudo nuk është balancim hidraulik, sepse dhomat dhe rrugët janë të ndryshme. | I njëjti rregullim paraprak kudo nuk është balancim hidraulik, sepse dhomat dhe rrugët janë të ndryshme. | F |
| content/quiz/M12.json | Çfarë bën parapozicionimi në valvulën e ngrohësit? | Çfarë bën rregullimi paraprak në valvulën e radiatorit? | F |
| content/quiz/M12.json | E kufizon rrjedhjen e mundshme | E kufizon prurjen e mundshme | F: Durchfluss = prurje |
| content/quiz/M12.json | Parapozicionimi e kufizon rrjedhjen, ndërsa koka termostatike reagon ndaj temperaturës së dhomës. | Rregullimi paraprak e kufizon prurjen, ndërsa koka termostatike reagon ndaj temperaturës së dhomës. | F |
| content/quiz/M12.json | I hap edhe më shumë të gjitha valvulat e ngrohësve | I hap edhe më shumë të gjitha valvulat e radiatorëve | F |
| content/quiz/M12.json | Të gjitha parapozicionimet i vendos prapë njësoj | Të gjitha rregullimet paraprake i vendos prapë njësoj | F |
| content/quiz/M13.json | Përzien ujin e nxehtë nga prodhuesi me ujin më të ftohtë të kthimit | Përzien ujin e nxehtë nga pajisja e ngrohjes me ujin më të ftohtë të kthimit | F: „prodhuesi“ = auch Hersteller → missverständlich |
| content/quiz/M13.json | Para pikës së përzierjes, në ujin e nxehtë | Para pikës së përzierjes, në ujin e nxehtë të pajisjes | B: „Erzeugerwasser“ fehlte |
| content/quiz/M13.json | Drejtpërdrejt te motori aktivizues | Drejtpërdrejt te servomotori | F: Stellmotor = servomotor (gebräuchlich) |
| content/quiz/M13.json | Si e gjen drejtimin e lëvizjes për „më e ngrohtë“ te përzierësi? | Si e gjen drejtimin e rrotullimit për “më ngrohtë” te përzierësi? | G: „më ngrohtë“ (Adverb); F; albanische Anführungszeichen |
| content/quiz/M13.json | Nga e djathta është gjithmonë më e ngrohtë | Rrotullimi djathtas jep gjithmonë më ngrohtë | B: „rechts herum“ = Drehrichtung, nicht „von rechts“ |
| content/quiz/M13.json | Kthen majtas ose djathtas sipas ndjesisë | Rrotullon majtas ose djathtas me hamendje | N |
| content/quiz/M13.json | Cili drejtim do të thotë më e ngrohtë varet nga valvula dhe motori konkret dhe nuk hamendësohet. | Cili drejtim rrotullimi do të thotë më ngrohtë varet nga valvula dhe servomotori konkret dhe nuk hamendësohet. | F/G |
| content/quiz/M13.json | Pompa e nxehtësisë jep tashmë temperaturën e ulët të duhur. A nevojitet përzierës? | Pompa e nxehtësisë jep tashmë temperaturën e ulët të duhur të furnizimit. A nevojitet përzierës? | B: „Vorlauftemperatur“ fehlte |
| content/quiz/M14.json | Një shenjë për korrozion, por ende jo diagnozë | Një shenjë korrozioni, por ende jo diagnozë | N |
| content/quiz/M14.json | Pas kësaj duhet gjithmonë çkripëzim | Pas kësaj duhet gjithmonë demineralizim | F |
| content/quiz/M14.json | Nëse korrozioni ose hyrja e oksigjenit vazhdon, krijohen depozitime të reja. | Nëse korrozioni ose hyrja e oksigjenit vazhdojnë, krijohen depozitime të reja. | G: zwei Subjekte → Plural |
| content/quiz/M14.json | Cili është dallimi ndërmjet zbutjes dhe çkripëzimit? | Cili është dallimi ndërmjet zbutjes dhe demineralizimit? | F |
| content/quiz/M14.json | Zbutja heq të gjitha jonet, çkripëzimi vetëm gëlqeren | Zbutja heq të gjitha jonet, demineralizimi vetëm gëlqeren | F |
| content/quiz/M14.json | Zbutja këmbën formuesit e fortësisë, çkripëzimi heq jonet | Zbutja i shkëmben formuesit e fortësisë, demineralizimi heq jonet | R: „këmbën“ falsch geschrieben; F |
| content/quiz/M14.json | Zbutja ndryshon pH-në, çkripëzimi ngjyrën | Zbutja ndryshon pH-në, demineralizimi ngjyrën | F |
| content/quiz/M14.json | Hidhet një aditiv nga reklama | Shtohet një aditiv nga reklamat | N |
| content/quiz/M14.json | Matet vetëm pH-ja dhe mbaron | Matet vetëm pH-ja dhe kaq | N |
| content/quiz/M15.json | Vetëm një shikim i shkurtër nëse gjithçka është e shtrënguar | Vetëm një shikim i shpejtë nëse ka rrjedhje | B: dicht = pa rrjedhje, nicht „festgezogen“ |
| content/quiz/M15.json | Pamja nuk është e njëjtë me funksionin, një sistem që duket i përsosur mund të jetë i gabuar hidraulikisht ose në siguri. | Pamja nuk është e njëjtë me funksionin, një sistem që duket i përsosur mund të jetë i gabuar hidraulikisht ose nga ana e sigurisë. | N |
| content/quiz/M15.json | Një valvul mbyllëse e mbyllur ndërmjet sistemit të mbrojtur dhe valvulës së sigurisë e bën mbrojtjen të pavlefshme. | Një valvulë mbyllëse e mbyllur ndërmjet sistemit të mbrojtur dhe valvulës së sigurisë e bën mbrojtjen të pavlefshme. | R |
| content/quiz/M15.json | Një pompë është montuar pastër, por kundër drejtimit të rrjedhjes. Çfarë vlen? | Një pompë është montuar pastër, por kundër drejtimit të rrjedhjes. Çfarë është e saktë? | N: „Was gilt“ |
| content/quiz/M15.json | Transporton vetëm pak më pak ujë | Shtyn vetëm pak më pak ujë | N |
| content/quiz/M15.json | Kthehet vetë në drejtimin e duhur | Rrotullohet vetë në drejtimin e duhur | B: „dreht sich“ = rrotullohet |
| content/quiz/M15.json | Është njëlloj nëse është në maksimum | S'ka rëndësi, nëse është në maksimum | N |
| content/quiz/M15.json | Sensori i furnizimit tregon vlera të besueshme. A është vendi i tij i saktë? | Sensori i furnizimit tregon vlera të besueshme. A do të thotë kjo se vendi i tij është i saktë? | B: „damit“ fehlte |
| content/quiz/M15.json | Po, një sensor nuk mund të ulet kurrë gabim | Po, një sensor nuk mund të jetë kurrë i vendosur gabim | N: „ulet“ (sich hinsetzen) Lehnübersetzung von „sitzen“ |
| content/quiz/M15.json | Ajo që nuk dokumentohet vështirë kuptohet më vonë, edhe montuesi i radhës ka nevojë për shënime të qarta. | Ajo që nuk dokumentohet, më vonë mezi kuptohet, edhe montuesi i radhës ka nevojë për shënime të qarta. | N |
| functions/_lib/content.js | Ena e zgjerimit me membranë (MAG) – ngrohje | Ena e zgjerimit me membranë (MAG) për ngrohje | N: Titel natürlicher („për ngrohje“ statt Gedankenstrich) |
| functions/_lib/content.js | Si i balancon MAG-u ndryshimet e presionit në qarkun e mbyllur të ngrohjes dhe si dallohen gabimet. | Si i kompenson MAG-u ndryshimet e presionit në qarkun e mbyllur të ngrohjes dhe si dallohen gabimet. | F: ausgleichen = kompensoj |
| functions/_lib/content.js | Uji i ngrohjes zgjerohet kur ngrohet. MAG-u e pranon këtë vëllim. | Uji i ngrohjes zgjerohet kur ngrohet. MAG-u e merr këtë vëllim. | N |
| functions/_lib/content.js | MAG-u nuk e zëvendëson kurrë valvulën e sigurisë. Secila ka detyrën e vet. | MAG-u nuk e zëvendëson kurrë valvulën e sigurisë. Secili ka detyrën e vet. | G: gemischtes Genus → maskulin |
| functions/_lib/content.js | Ena e zgjerimit për ujë të pijshëm pranon zgjerimin e ujit të pijshëm të ngrohur. | Ena e zgjerimit për ujë të pijshëm e merr zgjerimin e ujit të pijshëm të ngrohur. | N |
| functions/_lib/content.js | Duhet të jetë e lejuar për ujë të pijshëm dhe e lidhur me rrjedhje, që uji të mos qëndrojë. | Duhet të jetë e miratuar për ujë të pijshëm dhe e lidhur që uji të rrjedhë nëpër të, që të mos mbetet ujë i ndenjur. | F: zugelassen = i miratuar; N: „me rrjedhje“ unklar |
| functions/_lib/content.js | Si rimbushet uji i ngrohjes në mënyrë të sigurt dhe pse uji i mbushjes trajtohet. | Si rimbushet uji i ngrohjes në mënyrë të sigurt dhe pse trajtohet uji i mbushjes. | N: Wortstellung |
| functions/_lib/content.js | Ndarësi i sistemit e mbron ujin e pijshëm nga kthimi i ujit nga ngrohja. | Ndarësi i sistemit e mbron ujin e pijshëm nga rrjedhja mbrapsht e ujit të ngrohjes. | N: wie Quiz M03 |
| functions/_lib/content.js | Zbutja dhe çkripëzimi janë dy procese të ndryshme. | Zbutja dhe demineralizimi janë dy procese të ndryshme. | F |
| functions/_lib/content.js | Kur ndërrohet fishekja varet nga kapaciteti i saj dhe nga udhëzimet e prodhuesit. | Kur ndërrohet fisheku varet nga kapaciteti i tij dhe nga udhëzimet e prodhuesit. | G: fishek m. |
| functions/_lib/content.js | Ndërmjet pajisjes së ngrohjes dhe valvulës së sigurisë nuk lejohet asnjë valvul mbyllëse. | Ndërmjet pajisjes së ngrohjes dhe valvulës së sigurisë nuk lejohet asnjë valvulë mbyllëse. | R |
| functions/_lib/content.js | Valvula mbyllëse, valvula e kundërkthimit dhe valvula e sigurisë vendosen në një renditje të caktuar. | Valvula mbyllëse, valvula e kundërkthimit dhe valvula e sigurisë vendosen në një renditje të përcaktuar. | N: fest = e përcaktuar |
| functions/_lib/content.js | Tubi i shkarkimit përfundon i dukshëm mbi një kullues me dalje të lirë. | Tubi i shkarkimit përfundon i dukshëm mbi një sifon, me dalje të lirë. | F: wie Quiz M05 |
| functions/_lib/content.js | Një valvul sigurie që pikon nuk „riparohet“ kurrë duke e mbyllur. | Një valvulë sigurie që pikon nuk “riparohet” kurrë duke e mbyllur. | R: valvulë; albanische Anführungszeichen |
| functions/_lib/content.js | Mbrojtja nga djegia dhe higjiena janë pjesë e planifikimit. | Mbrojtja nga përvëlimi dhe higjiena janë pjesë e planifikimit. | F: Verbrühschutz = përvëlim (Verbrühung), „djegie“ = Verbrennung |
| functions/_lib/content.js | Ana e ngrohjes: furnizimi dhe kthimi i ngarkimit të depozitës, sensori në pozicionin e duhur. | Ana e ngrohjes: furnizimi dhe kthimi për ngrohjen e depozitës, sensori në pozicionin e duhur. | F: Speicherladung = ngrohja e depozitës |
| functions/_lib/content.js | Para vënies në punë: shpëlaj, mbush, ajros dhe kontrollo për rrjedhje. | Para vënies në punë: shpëlaj, mbush, ajros dhe kontrollo nëse ka rrjedhje. | N |
| functions/_lib/content.js | Kur ka nevojë një pompë nxehtësie për depozitë tampon, bypass ose valvul tejrrjedhjeje dhe pse vëllimi i ujit dhe prurja janë dy gjëra të ndryshme. | Kur ka nevojë një pompë nxehtësie për depozitë tampon, bypass ose valvulë tejrrjedhjeje dhe pse vëllimi i ujit dhe prurja janë dy gjëra të ndryshme. | R |
| functions/_lib/content.js | Depozita tampon në seri rrit kryesisht sasinë e ujit. Depozita tampon paralele mund të ndajë edhe hidraulikisht qarkun e prodhuesit nga ai i konsumatorëve. | Depozita tampon në seri rrit kryesisht sasinë e ujit. Depozita tampon paralele mund të ndajë edhe hidraulikisht qarkun e pajisjes së ngrohjes nga ai i konsumatorëve. | F: „prodhuesi“ = auch Hersteller |
| functions/_lib/content.js | Valvula e tejrrjedhjes e çon ujin brenda sistemit nga furnizimi në kthim. Ajo nuk është valvul sigurie. | Valvula e tejrrjedhjes e çon ujin brenda sistemit nga furnizimi në kthim. Ajo nuk është valvulë sigurie. | R |
| functions/_lib/content.js | Një valvul tejrrjedhjeje e montuar nuk e garanton vetvetiu prurjen minimale. Bypass-i, pompa dhe hidraulika projektohen së bashku. | Një valvulë tejrrjedhjeje e montuar nuk e garanton vetvetiu prurjen minimale. Bypass-i, pompa dhe hidraulika dimensionohen së bashku. | R; F: auslegen = dimensionoj |
| functions/_lib/content.js | Si e lëviz pompa qarkulluese ujin, si rregullohet dhe ku valvulat e kundërkthimit pengojnë rrjedhjen e padëshiruar prapa. | Si e lëviz pompa qarkulluese ujin, si rregullohet dhe ku valvulat e kundërkthimit pengojnë rrjedhjen e padëshiruar mbrapsht. | N |
| functions/_lib/content.js | Zgjidhet sipas prurjes dhe rezistencës së rrjetit të tubave, jo sipas lartësisë së ndërtesës. Pompa në maksimum nuk është projektim. | Dimensionohet sipas prurjes dhe rezistencës së rrjetit të tubave, jo sipas lartësisë së ndërtesës. Pompa në maksimum nuk është dimensionim. | F: Auslegung = dimensionim |
| functions/_lib/content.js | Pse çdo sipërfaqe ngrohëse ka nevojë për prurjen e vet dhe si rregullohet e kontrollohet balancimi hap pas hapi. | Pse çdo sipërfaqe ngrohëse ka nevojë për prurjen e vet dhe si rregullohet dhe kontrollohet balancimi hap pas hapi. | G |
| functions/_lib/content.js | I njëjti parapozicionim kudo ose pompa në maksimum nuk është balancim. | I njëjti rregullim paraprak kudo ose pompa në maksimum nuk është balancim. | F: Voreinstellung = rregullim paraprak |
| functions/_lib/content.js | Koka termostatike dhe parapozicionimi kanë detyra të ndryshme. | Koka termostatike dhe rregullimi paraprak kanë detyra të ndryshme. | F |
| functions/_lib/content.js | Si i japin përzierësi, motori aktivizues, pompa, sensori dhe rregullatori një qarku ngrohjeje temperaturën e duhur të furnizimit. | Si i japin përzierësi, servomotori, pompa, sensori dhe rregullatori një qarku ngrohjeje temperaturën e duhur të furnizimit. | F: Stellmotor = servomotor |
| functions/_lib/content.js | Përzierësi kombinon ujin e nxehtë nga prodhuesi me ujin më të ftohtë të kthimit. | Përzierësi kombinon ujin e nxehtë nga pajisja e ngrohjes me ujin më të ftohtë të kthimit. | F: „prodhuesi“ missverständlich |
| functions/_lib/content.js | Lidhjet dhe drejtimi i lëvizjes lexohen nga skema e prodhuesit, nuk supozohen sipas pozicionit. | Lidhjet dhe drejtimi i rrotullimit lexohen nga skema e prodhuesit, nuk hamendësohen sipas pozicionit. | F/N: wie Quiz M13 |
| functions/_lib/content.js | Fortësia, përçueshmëria dhe vlera pH shihen veç e veç. Zbutja dhe çkripëzimi nuk janë e njëjta gjë. | Fortësia, përçueshmëria dhe vlera pH shihen veç e veç. Zbutja dhe demineralizimi nuk janë e njëjta gjë. | F |
| functions/_lib/content.js | Si kontrollohet sistematikisht në tetë grupe kontrolli një sistem i montuar, para se të dorëzohet. | Si kontrollohet sistematikisht një sistem i montuar, në tetë grupe kontrolli, para se të dorëzohet. | N: Wortstellung |
| public/assets/chef.js | Ena e zgjerimit me membranë (MAG) – ngrohje | Ena e zgjerimit me membranë (MAG) për ngrohje | Sync mit content.js |
| public/assets/i18n.js | Mbrapa | Kthehu | N: Button „Zurück“ |
| public/assets/i18n.js | Seria e trajnimit „Bazat e SHK“ nga M&B. | Seria e trajnimeve “Bazat e SHK” nga M&B. | F: einheitlich „seria e trajnimeve“; albanische Anführungszeichen |
| public/assets/i18n.js | Ruhen vetëm emri yt, gjuha jote dhe progresi yt i mësimit. | Ruhen vetëm emri yt, gjuha jote dhe përparimi yt në mësim. | N: „përparim“ statt Anglizismus |
| public/assets/i18n.js | Të lutem vendos një PIN me 4 shifra dhe përsëriti. | Të lutem vendos një PIN me 4 shifra dhe përsërite. | G: Imperativ+Klitikon „përsërite“ („përsëriti“ = er wiederholte) |
| public/assets/i18n.js | Dy PIN-et nuk janë njësoj. Të lutem provo nga e para. | Dy PIN-et nuk janë të njëjtë. Të lutem fillo përsëri nga e para. | N |
| public/assets/i18n.js | PIN: {n} nga 4 shifra të shkruara | PIN: {n} nga 4 shifra janë shkruar | G: vollständiger Satz |
| public/assets/i18n.js | PIN: 4 nga 4 shifra të shkruara, gabim | PIN: 4 nga 4 shifra janë shkruar, gabim | G |
| public/assets/i18n.js | Lajmërohu në zyrë. Aty PIN-i yt rivendoset. | Lajmërohu në zyrë. Atje ta rivendosin PIN-in. | N: Aktiv statt Passiv |
| public/assets/i18n.js | Përshëndetje {name} | Përshëndetje, {name} | R: Komma bei Anrede |
| public/assets/i18n.js | Vazhdo shikimin, {label} te {pos} nga {total} | Vazhdo shikimin, {label} në {pos} nga {total} | N |
| public/assets/i18n.js | Ende pa e parë · {b} | Ende pa u parë · {b} | G: Passiv („noch nicht angesehen“) |
| public/assets/i18n.js | Video u krye · kuizi është hapur | Videoja u krye · kuizi është i hapur | G: bestimmte Form „videoja“; „i hapur“ = offen |
| public/assets/i18n.js | E bëre! | Ia dole! | N: idiomatisch für „Geschafft!“ |
| public/assets/i18n.js | I ke parë të gjitha {total} videot dhe i ke kaluar të gjitha kuizet. | I ke parë të {total} videot dhe i ke kaluar të gjitha kuizet. | G: „të 16 videot“ |
| public/assets/i18n.js | Të gjitha {n} videot u kryen | Të {n} videot janë kryer | G |
| public/assets/i18n.js | Hap pjesën {k}, të gjitha {n} videot u kryen | Hap pjesën {k}, të {n} videot janë kryer | G |
| public/assets/i18n.js | Kuizi hapur | Kuizi i hapur | G |
| public/assets/i18n.js | Video u krye | Videoja u krye | G |
| public/assets/i18n.js | Çka është e rëndësishme | Çfarë ka rëndësi | N: „Çka“ regional (Gegisch) |
| public/assets/i18n.js | Pozita e videos | Pozicioni i videos | F: einheitlich „pozicion“ |
| public/assets/i18n.js | Pozita {t}, kalimi përpara është i bllokuar | Pozicioni {t}, kalimi përpara është i bllokuar | F |
| public/assets/i18n.js | Ky modul hapet kur ta kryesh atë të mëparshmin. | Ky modul hapet pasi të kryesh modulin e mëparshëm. | N/G |
| public/assets/i18n.js | Te përmbledhja | Te pasqyra | B: „përmbledhje“ = Zusammenfassung, Übersicht = pasqyrë (2x) |
| public/assets/i18n.js | Saktë. | E saktë. | N |
| public/assets/i18n.js | Kaluar | Kalove | N: Ergebnis-Überschrift in 2. Person |
| public/assets/i18n.js | Nuk kaloi | Nuk kalove | B: „Nuk kaloi“ = er/sie hat nicht bestanden |
| public/assets/i18n.js | E saktë ishte | E saktë do të ishte | G: Konditional „wäre“ |
| public/assets/i18n.js | Moduli {n} është hapur | Moduli {n} tani është i hapur | B: „jetzt frei“ |
| public/assets/i18n.js | Vërtetësia kontrollohet me kodin e kontrollit në certifikatë. | Vërtetësia mund të kontrollohet me kodin e verifikimit në certifikatë. | N: „prüfbar“; Doppelung kontroll-/kontrollit |
| public/assets/i18n.js | PDF-ja nuk u krijua. Të lutem provo përsëri. | Skedari PDF nuk u krijua. Të lutem provo përsëri. | N |
| public/assets/i18n.js | M&B AKADEMIA · TRAJNIM I BRENDSHËM | M&B AKADEMIA · TRAJNIM PROFESIONAL I BRENDSHËM | B: „Fachschulung“ |
| public/assets/i18n.js | e ka përfunduar plotësisht serinë e trajnimit „Bazat e SHK“ · Pjesa {k}: {title} dhe i ka kaluar testet e njohurive për të gjitha modulet. | e ka përfunduar plotësisht serinë e trajnimeve “Bazat e SHK” · Pjesa {k}: {title} dhe i ka kaluar testet e njohurive për të gjitha modulet. | F: einheitlich „seria e trajnimeve“; Anführungszeichen |
| public/assets/i18n.js | Llogaria e bllokuar | Llogaria është e bllokuar | G: vollständig |
| functions/_lib/util.js | Ju lutem hyni. | Të lutem hyr në llogari. | N: einheitlich Du-Form wie in der App |
| functions/_lib/util.js | Ky emër ekziston tashmë. Njofto zyrën. | Ky emër ekziston tashmë. Lajmërohu në zyrë. | B: „im Büro melden“ = lajmërohu (nicht „benachrichtige das Büro“), wie i18n |
| functions/_lib/util.js | Shumë përpjekje të gabuara. I bllokuar për ${t}. | Shumë përpjekje të gabuara. Llogaria u bllokua për ${t}. | G: Subjekt fehlte |
| functions/_lib/util.js | I bllokuar. Provo përsëri pas ${t}. | Llogaria është e bllokuar. Prit ${t} dhe provo përsëri. | G: „pas 15 minuta“ (Kasus) vermieden |
| functions/_lib/util.js | Llogaria është e bllokuar. Njofto zyrën. | Llogaria është e bllokuar. Lajmërohu në zyrë. | B: wie oben |
| functions/_lib/util.js | Ky modul nuk është çelur ende. | Ky modul nuk është hapur ende. | F: einheitlich „hap“ |
| functions/_lib/util.js | Ky kuiz ka skaduar ose është dorëzuar. Nise përsëri. | Ky kuiz ka skaduar ose është dorëzuar tashmë. Fillo përsëri. | B: „schon“; N |
| functions/_lib/util.js | Kësaj pyetjeje i është përgjigjur tashmë. | Kësaj pyetjeje i je përgjigjur tashmë. | N: Du-Form, natürlicher |
| functions/_lib/util.js | Shiko fillimisht videon. | Të lutem shiko së pari videon. | N |
| functions/_lib/util.js | Shkruaj emrin, emrin e përdoruesit (min. 3 shenja) dhe fjalëkalimin (min. 10 shenja). | Shkruaj emrin, emrin e përdoruesit (min. 3 karaktere) dhe fjalëkalimin (min. 10 karaktere). | F: Zeichen = karaktere |
| functions/api/[[path]].js | ${min} ${lang === 'sq' ? 'minuta' : 'Minuten'} | ${min} ${lang === 'sq' ? (min === 1 ? 'minutë' : 'minuta') : 'Minuten'} | G: Singular „1 minutë“ (nur SQ-Zweig geändert) |
| tests/e2e-app.cjs | Erwartung 'Kaluar' | 'Kalove' | Test an neue Ergebnis-Überschrift angepasst |

Zusätzlich neu erzeugt: `functions/_lib/quiz-data.js` (per `node tools/gen-quiz.mjs`).

## Unsicher – bitte von Muttersprachler prüfen

1. **„ajrues / ajros“ für Entlüfter / entlüften** – im Handel üblich („ajrues automatik“), „ajrim“ heißt aber auch „Belüften“. Alternative: „shfryrës“ / „shfryj“. Bisher beibehalten (auch im Video?).
2. **„fishek“ für Patrone** – grammatisch jetzt korrekt maskulin; ob Monteure eher „kartuşë/kartushë“ oder „filtër“ sagen, bitte bestätigen.
3. ~~„demineralizim“ statt „çkripëzim“~~ – **erledigt (2. Durchgang):** M03-Video sagt „çkripëzim“, M14-Video „demineralizim“; App folgt dem jeweiligen Video (M03 mit Klammer).
4. **„radiator“ statt „ngrohës“ für Heizkörper** – in Kosovo auch „kalorifer“ üblich.
5. ~~„rregullim paraprak“~~ – **erledigt (2. Durchgang):** jetzt „paracaktim“ wie im M12-Video (kollidiert nicht mit „rregullim“ = Einstellung/Regelung).
6. ~~„sifon“~~ – **erledigt (2. Durchgang):** jetzt „hinkë shkarkimi“ wie im M05-Video (DE „Ablauftrichter“).
7. ~~„frena e gravitetit“~~ – **erledigt (2. Durchgang):** jetzt „frenuesi i qarkullimit natyror“ wie in den Videos M11/M15. Ob Monteure ein kürzeres Wort kennen, bitte trotzdem bestätigen.
8. ~~„valvula e tejrrjedhjes“~~ – **erledigt (2. Durchgang):** jetzt „valvula e bypass-it“ wie im M10-Video.
9. **„kthimi i ngrohjes së depozitës“ für Laderücklauf** – ersetzt „kthimi i ngarkimit“; etwas lang, aber verständlicher.
10. **„pajisja e ngrohjes“ für Wärmeerzeuger** – einfache, sichere Lösung; Fachwort wäre „gjenerator nxehtësie“.
11. **„përzierës“ für Mischer** – Alternative „valvul përzierëse“ / „mikser“. Titel Modul 13 jetzt „Qarku me përzierje“ wie im Video (2. Durchgang).
12. **„jastëku i gazit“ für Gaspolster** – unverändert, verständlich, aber evtl. „mbushja me gaz“ üblicher.
13. **„Bazat e SHK“** – „SHK“ ist eine deutsche Abkürzung; prüfen, ob die Zielgruppe sie kennt (Alternative: „Bazat e instalimeve hidraulike dhe të ngrohjes“).
14. **Anführungszeichen** – SQ-Texte nutzen jetzt “…” statt der deutschen „…“. Albanisch üblich sind auch «…».
15. **Ergebnis-Überschrift „Kalove“ / „Nuk kalove“** (statt „Kaluar“ / „Nuk kaloi“) – E2E-Test `tests/e2e-app.cjs` wurde angepasst.
16. **Sperrzeit-Texte (util.js)** – „Llogaria u bllokua për 15 minuta“ / „Prit 15 minuta dhe provo përsëri“; für 1 Minute jetzt „1 minutë“ (kleine Code-Änderung im SQ-Zweig von `durText`, `functions/api/[[path]].js`). Der deutsche Zweig sagt weiterhin „1 Minuten“ (nicht angefasst).
17. **Gesamt-Hinweis**: Die Vorlagen in i18n.js/util.js tragen weiterhin den Kommentar „SQ: von Muttersprachler prüfen lassen“ – nach Abnahme entfernen.
18. **„penguesi i kthimit“ (Rückflussverhinderer) neben „valvula e kundërkthimit“ (Rückschlagventil)** – zwei Wörter, weil die Videos es so trennen (Trinkwasser-Module M02/M05/M08 vs. M03/M09/M11/M15). Fachlich sind es verwandte Bauteile; bitte bestätigen, dass Monteure beide Wörter verstehen.
19. **„dalja“ für den Ablauf am Systemtrenner (M03)** – kommt aus dem Video; „dalja“ heißt auch „Ausgang/Auslass“. Im Kontext („dalja e ndarësit të sistemit … e lirë, e dukshme“) eindeutig.

## 2. Durchgang (Befunde M00–M15) – Begriffs-Angleichung an die Videos

Grundlage: `review/befunde/Mxx.md`. Regel: Das Wort im Video des jeweiligen Moduls gewinnt (siehe oben). Videofehler stehen in `review/VIDEO-KORREKTUREN.md`, nicht hier.

| Begriff (DE) | vorher in App | jetzt in App | Video(s) | geändert in |
|---|---|---|---|---|
| Puffer | depozitë tampon / tampon | depozitë akumuluese, depozita në seri / paralele | M10 | Quiz M10 (Q2, Q3, Q5 – 1. Prüfer), content.js M10 g + k[0], k[1] |
| Überströmventil | valvula e tejrrjedhjes | valvula e bypass-it / valvulë bypass-i | M10 | Quiz M10 (Q4, Q5 – 1. Prüfer), content.js M10 g + k[2], k[3] |
| Voreinstellung | rregullim paraprak | paracaktim | M12 | Quiz M12 (1. Prüfer), content.js M12 k[1], k[2] |
| Sollvolumenstrom | prurja e kërkuar | prurja e synuar | M12 | Quiz M12 Q1 (1. Prüfer), content.js M12 k[0] |
| Zirkulation (Trinkwasser) | qarkullimi | riqarkullimi | M08, M11, M15 | Quiz M08 (1. Prüfer), Quiz M05 Q1, content.js M08 k[0] |
| Schwerkraftbremse | frena e gravitetit | frenuesi i qarkullimit natyror | M11, M15 | Quiz M11 Q5 (1. Prüfer) |
| Härtebildner | formuesit e fortësisë | përbërësit e fortësisë | M14 | Quiz M14 Q2, Q4 (1. Prüfer) |
| Ablauf unter Abblaseleitung | sifon | hinkë shkarkimi (DE: Ablauftrichter) | M05 | Quiz M05 Q4 (1. Prüfer), content.js M05 k[2] DE+SQ |
| Entsalzen (nur M03) | demineralizimi | çkripëzimi (demineralizimi) | M03 (M14 bleibt „demineralizim“) | Quiz M03 Q3 (1. Prüfer), content.js M03 k[2] |
| Rückflussverhinderer | valvula e kundërkthimit | penguesi i kthimit | M02, M05, M08 | Quiz M02 Q2, Quiz M05 Q2, content.js M05 k[0] |
| Ablauf am Systemtrenner | shkarkimi | dalja | M03 | Quiz M03 Q2, Q5 |
| Schmutzfänger | filtri i papastërtive | filtri me sitë | M06, M09 | Quiz M06 Q3 |
| (Gas) komprimiert | ngjeshet / e ngjesh | komprimohet / e komprimon | M01, M02 | Quiz M01 Q1 |
| Mischerkreis (Modultitel 13) | Qarku me përzierës | Qarku me përzierje | M13 | content.js Titel M13, `public/assets/chef.js` MODS |
| Magnetit (M06) | magnetiti | grimcat magnetike | M06 (nach Schnitt „Modul 16“) | Quiz M06 Q1 (1. Prüfer), content.js M06 g, k[0], k[2] |
| Fußbodenheizung | ngrohje dyshemeje | ngrohje në dysheme | M12, M13 | Quiz M13 Q5 (1. Prüfer), content.js M13 k[3] |

Weitere Korrekturen an `content.js` aus den Befunden (nicht Begriffe, sondern Inhalt/Grammatik): M00 g + k[2] (SQ), M01 Lernziel DE+SQ und neuer Kernpunkt „Verbindung offen, Absperrung gesichert (Kappenventil)“, M03 Lernziel + k[3] DE+SQ, M04 k[2] DE+SQ (Entlüfter nicht „am höchsten Punkt“), M06 k[1], k[2] DE+SQ, M07 k[0], k[3] DE+SQ, M08 k[3] DE+SQ, M09 Lernziel + k[2] DE+SQ, M11 k[0] SQ.

Geprüft per Skript (`grep` über `content/quiz/*.json` und `functions/_lib/content.js`): keine der alten Varianten (tampon, tejrrjedh, frena e gravitetit, rregullim paraprak, prurja e kërkuar, formues, sifon, qarku me përzierës, ngjesh, filtri i papastërtive, „valvul “) kommt noch vor; „demineraliz“ nur in M03 (Klammer) und M14; „kundërkthim“ nur noch in M11 (Rückschlagventil), „pengues“ nur in M02/M05.
