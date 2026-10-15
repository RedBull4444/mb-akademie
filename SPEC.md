# M&B Akademie – technische Spezifikation (verbindlich)

Lernplattform für ca. 30 Monteure von M&B Gebäudetechnik (Treuchtlingen). Videoreihe „SHK-Grundlagen“: Einführung (Modul 0) + 15 Module, je Deutsch (DE) und Albanisch (SQ). Handy zuerst. Feste Reihenfolge, Vorspul-Schutz, Quiz je Modul, Zertifikat je Teil, Chef-Bereich.

Design ist final und abgenommen: siehe `design/` (Screenshots `*.jpg` und HTML-Quellen `*.dc.html`). Umsetzung muss diesen Screens so nah wie möglich kommen (Schibsted Grotesk, Weiß, Linien #eceef1, Schwarz #0f1317, Grau #5b6570, Rot #d6001c nur Hauptaktion/Fortschritt, Grün #1b7a43 nur erledigt/richtig, Radien 14–24px, große Touch-Ziele ≥ 44px, ruhig, ein Fokus pro Screen).

## Stack
- Cloudflare Pages (statisch aus `public/`) + Pages Functions (`functions/`) + D1 (Binding `DB`). Kein Build-Schritt, kein Framework: Vanilla JS (ES-Module), HTML, CSS.
- Lokal testen: `npx wrangler pages dev public --d1 DB=akademie-db` (wrangler 4, `--local`). Schema: `schema.sql`, anwenden mit `npx wrangler d1 execute akademie-db --local --file=schema.sql`.
- Schriften selbst gehostet (DSGVO, KEIN Google-Fonts-Abruf): `public/assets/fonts/` (Schibsted Grotesk 400/500/600/700/800 woff2, Cormorant Garamond 600 woff2; für PDF zusätzlich TTF).
- Logo: `public/assets/logo.webp` (420×156).
- Alle Seiten: `<meta name="robots" content="noindex,nofollow">`, `lang` passend.

## Dateistruktur
```
wrangler.toml            name="mb-akademie", pages_build_output_dir="public", [[d1_databases]] binding="DB" database_name="akademie-db" database_id="LOCAL"
schema.sql
functions/
  api/[[path]].js        EIN Router für alle /api/*-Routen
  videos/[[path]].js     Zugangsprüfung für /videos/*, dann env.ASSETS.fetch(request)
  _lib/content.js        MODULES (Titel DE/SQ, Teil, Dauer in Sekunden), PARTS
  _lib/quiz.js           QUIZ[modul] = [{q:{de,sq}, a:[{de,sq}×4], correct:0..3, why:{de,sq}}×5]  (Lösungen NUR serverseitig)
  _lib/auth.js, _lib/crypto.js, _lib/db.js, _lib/util.js
public/
  index.html             Mitarbeiter-App (SPA, Hash-Routing)
  chef/index.html        Chef-Bereich (SPA)
  pruefen/index.html     öffentliche Zertifikats-Prüfseite (?code=MB-T1-XXXX)
  datenschutz/index.html kurzer Datenschutzhinweis (Platzhalter-Text mit [VERANTWORTLICHER: M&B Gebäudetechnik, Adresse])
  assets/app.css, app.js, i18n.js, chef.js, chef.css, cert.js (PDF), pdf-lib.min.js, fontkit.umd.min.js, fonts/, logo.webp
  videos/M00_DE.mp4 … M15_SQ.mp4   (kommen erst beim Deploy; lokal Testdateien)
```

## Inhalte (functions/_lib/content.js)
Module n=0..15, Teil: 1 = 0–7, 2 = 8–11, 3 = 12–15. Dauern (Sekunden, exakt): 0:39.5, 1:300.0, 2:339.4, 3:451.9, 4:347.7, 5:407.0, 6:440.3, 7:428.2, 8:401.1, 9:499.2, 10:423.1, 11:524.8, 12:415.2, 13:393.6, 14:432.8, 15:385.5.
Titel DE/SQ: aus `design/akademie-basis.txt` (Array MODS, Felder de/sq, g = Lernziel, k = Kernpunkte) übernehmen – dort stehen alle Texte inkl. Albanisch.
Teil-Namen: 1 „Bauteile“ / „Pjesët“, 2 „Anlage & Hydraulik“ / „Sistemi & hidraulika“, 3 „Betrieb & Kontrolle“ / „Funksionimi & kontrolli“ (SQ später vom Muttersprachler geprüft).
Modul 0 (Einführung) hat KEIN Quiz. Module 1–15 je 5 Fragen. Bestehen: mind. 4 von 5 richtig. Wiederholen unbegrenzt.

## Datenbank (schema.sql, SQLite/D1)
```
settings(key TEXT PRIMARY KEY, value TEXT)          -- 'company_code' (z. B. 'MB-7Q4K')
employees(id INTEGER PK, first TEXT, last TEXT, name_key TEXT UNIQUE, lang TEXT CHECK(lang IN ('de','sq')),
          pin_hash TEXT, pin_salt TEXT, active INTEGER DEFAULT 1, failed INTEGER DEFAULT 0, locked_until INTEGER,
          created_at INTEGER, last_seen INTEGER)      -- name_key = lower(trim(first)+' '+trim(last)) ohne Mehrfach-Leerzeichen
admins(id INTEGER PK, name TEXT, username TEXT UNIQUE, pass_hash TEXT, pass_salt TEXT, role TEXT CHECK(role IN ('owner','admin')),
       failed INTEGER DEFAULT 0, locked_until INTEGER, created_at INTEGER)
sessions(token_hash TEXT PK, kind TEXT CHECK(kind IN ('emp','admin')), subject_id INTEGER, created_at INTEGER, expires_at INTEGER)
progress(emp_id INTEGER, module INTEGER, max_pos REAL DEFAULT 0, last_report INTEGER, completed_at INTEGER, PRIMARY KEY(emp_id,module))
quiz_attempts(id INTEGER PK, emp_id INTEGER, module INTEGER, score INTEGER, passed INTEGER, answers TEXT, at INTEGER)
certificates(id INTEGER PK, emp_id INTEGER, part INTEGER, code TEXT UNIQUE, issued_at INTEGER, UNIQUE(emp_id,part))
rate(key TEXT PK, count INTEGER, window_start INTEGER)  -- einfache Rate-Limits (z. B. 'reg:'+ip, 'login:'+ip)
```
Zeiten = Unix-Sekunden. Indizes auf progress(emp_id), quiz_attempts(emp_id,module), sessions(expires_at).

## Sicherheit
- PIN/Passwort: PBKDF2-SHA256 via WebCrypto, 100 000 Iterationen, 16-Byte-Salt, Base64. Vergleich zeitkonstant.
- Session: 32 zufällige Bytes → Cookie (`mb_s` für Mitarbeiter, Path=/, Max-Age 180 Tage; `mb_a` für Chef, Path=/, Max-Age 12 h), HttpOnly, Secure, SameSite=Lax. In DB nur SHA-256-Hash. Abmelden löscht Session.
- Mitarbeiter-Login: 5 Fehlversuche → `locked_until = now+15 min`. Antwort nennt Restversuche („Noch 4 Versuche“). Gesperrt (active=0) → klare Meldung „Konto gesperrt. Bitte im Büro melden.“
- Registrierung: Firmencode-Prüfung mit Rate-Limit pro IP (10 Versuche/Stunde, IP aus `CF-Connecting-IP`). Name schon vorhanden → Fehler „Diesen Namen gibt es schon. Bitte im Büro melden.“ PIN genau 4 Ziffern; triviale PINs (0000, 1111, 1234, 4321 …) ablehnen.
- Chef-Login: Benutzername + Passwort (mind. 10 Zeichen), 5 Fehlversuche → 15 min Sperre.
- Erst-Einrichtung: Wenn `admins` leer ist, zeigt `/chef/` „Ersteinrichtung“: Name, Benutzername, Passwort + Feld „Einrichtungs-Code“, der mit Umgebungsvariable `SETUP_TOKEN` übereinstimmen muss → legt Owner an und erzeugt Firmencode. Danach ist die Route tot.
- Alle schreibenden API-Routen nur POST mit JSON; prüfe `Origin`-Header gleich eigener Origin (CSRF-Schutz zusätzlich zu SameSite).
- Antworten: `Cache-Control: no-store` für /api/*. Security-Header auf allen Antworten aus Functions (`X-Content-Type-Options: nosniff`, `Referrer-Policy: same-origin`, `X-Frame-Options: DENY`). Zusätzlich `public/_headers` für statische Dateien mit denselben Headern + CSP `default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'`.

## Video-Schutz
Client (public/assets/app.js):
- Eigener Player (`<video playsinline preload="metadata" controlslist="nodownload noplaybackrate" disablepictureinpicture>` ohne native controls), eigene Leiste.
- `maxPos` = vom Server geladen. Seeking über maxPos+1 s wird auf maxPos zurückgesetzt + Toast „Vorspulen ist gesperrt. Zurückspulen geht.“ Zurückspulen erlaubt.
- `playbackRate` fest 1 (bei `ratechange` zurücksetzen). Tastatur-Pfeil-rechts blockiert.
- `visibilitychange` → hidden: pausieren, Overlay „Pausiert, weil die App im Hintergrund war“.
- Heartbeat: alle 5 s während Wiedergabe und bei Pause/Ende `POST /api/progress {module, pos}` (pos = currentTime). Antwort `{maxPos, completed}` übernimmt Client.
- Bei Ende (Server sagt completed) → Zustand „Video geschafft“, Button „Zum Quiz“ aktiv (Modul 0: „Weiter“ zum nächsten Modul).
Server (POST /api/progress):
- Modul muss freigeschaltet sein (sonst 403).
- `elapsed = now - last_report` (bei erster Meldung 5). Erlaubter Zuwachs = `elapsed * 1.25 + 3` Sekunden. `newMax = min(pos, max_pos + erlaubt, dauer)`; nur größer übernehmen. `last_report = now`.
- completed, wenn `newMax >= dauer - 2`. Dann `completed_at` setzen (einmalig).
Videos (functions/videos/[[path]].js):
- Datei `/videos/MNN_LL.mp4`. Zugriff nur mit gültiger Mitarbeiter-Session UND Modul freigeschaltet (oder gültige Chef-Session = alles). Sonst 403. Dann `return env.ASSETS.fetch(request)` (Range-Requests durchreichen). Header `Cache-Control: private, no-store`.

## Freischaltung
Modul n frei, wenn n = 0, oder Modul n-1 completed UND (n-1 = 0 ODER Quiz n-1 bestanden).
Teil k abgeschlossen, wenn alle Module des Teils completed und (außer Modul 0) Quiz bestanden → Zertifikat wird automatisch erstellt (Code `MB-T{k}-XXXX`, XXXX aus Alphabet `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, eindeutig), `issued_at = now`.

## API (alle JSON; Fehler: `{error:"text"}` mit passendem Status; Texte in Sprache des Nutzers, Default DE)
Öffentlich:
- `POST /api/register {code, first, last, lang, pin}` → setzt Cookie, `{ok:true}`
- `POST /api/login {name, pin}` → Cookie / `{error, remaining}`
- `POST /api/logout`
- `GET /api/verify?code=` → `{valid:true, name, part, partTitle, issuedAt}` oder `{valid:false}` (Rate-Limit 60/h pro IP)
Mitarbeiter (Cookie mb_s):
- `GET /api/me` → `{id, first, last, lang, modules:[{n, part, title, goal, points[], duration, maxPos, completed, quizPassed, quizBest, unlocked}], parts:[{k, title, done, total, certificate:{code, issuedAt}|null}], totals:{done, total, remainingSec}}` (Titel in Nutzersprache) – aktualisiert last_seen
- `POST /api/lang {lang}`
- `POST /api/progress {module, pos}` → `{maxPos, completed}`
- `GET /api/quiz/:n` → nur wenn Video completed: `{questions:[{q, a:[4]}]}` (Reihenfolge der Antworten pro Abruf gemischt; Server merkt Mapping NICHT – stattdessen Antworten als Text-IDs: jede Antwort hat `id` = Index im Original; Client sendet ids)
- `POST /api/quiz/:n/check {q, a}` → `{correct:bool, correctId, why}` (für Sofort-Feedback pro Frage)
- `POST /api/quiz/:n/submit {answers:[id×5]}` → `{score, passed, results:[bool×5], unlockedNext:{n,title,duration}|null, certificate:{part, code}|null}`
- `GET /api/certificate/:part` → Daten fürs PDF `{name, part, partTitle, modules:[{n,title}], minutes, issuedAt, code}`
Chef (Cookie mb_a):
- `GET /api/chef/status` → `{setupNeeded:bool, loggedIn:bool, me?}`
- `POST /api/chef/setup {setupToken, name, username, password}`
- `POST /api/chef/login {username, password}`, `POST /api/chef/logout`
- `GET /api/chef/team` → `{summary:{registered, cert1, finished, inactive7}, employees:[{id, name, lang, done, total, current:{n,title}|null, finished, certs:[1,2,3 bool], quizAvg, lastSeen, active}]}`
- `GET /api/chef/employee/:id` → Detail inkl. modules[{n,title,completed,completedAt,maxPos,quizBest,attempts}], certificates
- `POST /api/chef/employee/:id/reset-pin` → `{pin:"4821"}` (neue zufällige PIN, einmalig angezeigt; failed/locked zurücksetzen; alle Sessions des Mitarbeiters löschen)
- `POST /api/chef/employee/:id/active {active:bool}` (bei Sperren Sessions löschen)
- `GET /api/chef/settings` → `{companyCode, admins:[{id,name,username,role}]}`
- `POST /api/chef/company-code/rotate` → `{companyCode}` (neu zufällig `MB-XXXX`)
- `POST /api/chef/admins {name, username, password}` (nur owner), `POST /api/chef/admins/:id/delete` (nur owner, nicht sich selbst, nie den letzten Hauptadmin)
- `POST /api/chef/admins/:id/role {role:'owner'|'admin'}` (nur owner): Admin zum Hauptadmin machen bzw. zurückstufen; der letzte Hauptadmin bleibt Hauptadmin (400). Mehrere Hauptadmins möglich.
- `POST /api/chef/employee/:id/delete` (nur owner): Mitarbeiter endgültig löschen inkl. progress, quiz_attempts, quiz_runs, sessions, certificates (Prüfseite: „nicht gefunden“).
- `GET /api/chef/export.csv` → CSV (Semikolon, UTF-8 mit BOM, für Excel): Name;Sprache;Videos erledigt;von;Aktuelles Modul;Zertifikat Teil 1;Teil 2;Teil 3;Quiz-Durchschnitt;Zuletzt aktiv;Status

## Mitarbeiter-App (public/index.html + assets/app.js, i18n.js)
Screens (Hash-Routing): `#/willkommen` (L1), `#/registrieren` (L2), `#/anmelden` (L3), `#/start` (1), `#/video/:n` (2 + Schutz-Zustände S1–S3), `#/quiz/:n` (3 + 5 Ergebnis), `#/module` (4), `#/zertifikate` (6). Tab-Bar: Start, Module, Zertifikate; ab dem ersten geschafften Video zusätzlich „Nachschlagen“ (`#/nachschlagen`, SQ „Kërko / Rishiko“): Liste der geschafften Module mit Kernpunkten + Suche (Groß/klein, Umlaute tolerant), `#/nachschlagen/:n` = freier Player (Vorspulen erlaubt, kein Tracking, kein Quiz-Zwang), optionale Kapitel aus `/assets/chapters.json` (`{ "1": [{ "t": 12.4, "de": "…", "sq": "…" }] }`; fehlt die Datei: keine Kapitel). Sprache DE/SQ umschaltbar (oben rechts „DE | SQ“), alle UI-Texte in `i18n.js` (SQ-Texte als Entwurf, Markierung `// SQ: Muttersprachler prüfen`).
- Erster Start ohne Session → L1 (Sprache + Firmencode) → L2 (Vorname, Nachname, PIN mit eigenem Ziffernblock, Bestätigung durch zweite Eingabe) → Start.
- `#/start`: genau wie Design Screen 1 (Hallo Vorname, Fortschrittszeile + Balken, rote Weiter-Karte fürs aktuelle Modul, „Als Nächstes“). Wenn alles fertig: Glückwunsch-Zustand.
- Quiz: eine Frage pro Screen, Antwort tippen → sofort `check` → richtig/falsch-Darstellung + Erklärung → „Weiter“. Nach 5 Fragen `submit` → Ergebnis-Screen (bestanden / nicht bestanden mit „Video nochmal ansehen“ und „Quiz wiederholen“).
- Zertifikate: Liste + „PDF herunterladen“ (assets/cert.js erzeugt PDF im Browser mit pdf-lib, Layout = design/Zertifikat-Teil1 (A4 quer), Schriften Cormorant Garamond + Schibsted Grotesk eingebettet, Logo eingebettet) + „Teilen“ (Web Share API mit PDF-Datei, Fallback Download).
- Offline/Fehler: freundliche Meldung „Keine Verbindung. Bitte später nochmal.“

## Chef-Bereich (public/chef/)
Responsive (Handy + PC) nach Design Admin-Handy / Admin-PC: Login, Ersteinrichtung, Team (Filter Alle / Nicht aktiv / Fertig, Suche), Mitarbeiter-Detail (PIN zurücksetzen mit Anzeige der neuen PIN, Sperren/Entsperren), Einstellungen (Firmencode groß, „Per WhatsApp teilen“ = `https://wa.me/?text=` mit fertigem Text inkl. Link zur App und Code, Kopieren, Code ändern mit Bestätigung, Export CSV, Zugänge verwalten, Abmelden). Mitarbeiter löschen (nur Hauptadmin, Dialog mit Namenseingabe) in der Detailansicht; Zugänge: Rolle sichtbar, Rollenwechsel/Entfernen nur für Hauptadmins. Zusätzlich „Vorführen“: alle Videos frei abspielbar mit normalen Controls (für Schulungen am Beamer).

## Prüfseite (public/pruefen/)
Eingabefeld Prüfcode + Ergebnis: „Gültig – Arben Krasniqi hat Teil 1 · Bauteile am 08.10.2026 abgeschlossen.“ oder „Kein Zertifikat mit diesem Code gefunden.“ Liest `?code=` aus der URL. QR-Code im PDF zeigt auf `<origin>/pruefen/?code=CODE`.

## Entwicklungs-Hinweise (Stand Projekt-Ordner)
- Projektordner: /home/claude/akademie. Abhängigkeiten installiert (`npx wrangler` v4). `.dev.vars` enthält `SETUP_TOKEN=test-setup-123` und `DEV_SHORT=1`.
- `DEV_SHORT=1` (nur lokal): alle Modul-Dauern serverseitig = 8 Sekunden (Testvideos in `public/videos/` sind 8 s lang, WebM-Inhalt unter .mp4-Namen, weil Playwright-Chromium kein H.264 abspielt). In Produktion `DEV_SHORT=0` → echte Dauern.
- PDF-Ressourcen: `public/assets/pdf-lib.min.js` (global `PDFLib`), `public/assets/fontkit.umd.min.js` (global `fontkit`), `public/assets/qrcode.js` (global `qrcode`, Lib „qrcode-generator“), TTFs in `public/assets/pdf/` (SchibstedGrotesk_400Regular.ttf, _600SemiBold.ttf, _700Bold.ttf, CormorantGaramond_600SemiBold.ttf), Logo als PNG `public/assets/logo.png` (pdf-lib kann kein WebP).
- Web-Schriften: `public/assets/fonts/schibsted-grotesk-latin-{400..800}-normal.woff2` (+ latin-ext), `cormorant-garamond-latin-600-normal.woff2`.
- Lokaler Start: `npx wrangler d1 execute akademie-db --local --file=schema.sql` und `npx wrangler pages dev public --port 8788` (D1-Binding kommt aus wrangler.toml). Chromium für Tests: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (Playwright ist unter /tmp/claude-0/-home-claude/11c135d6-a206-58fa-85d9-899349f4e70c/scratchpad/render/node_modules installiert; alternativ `npm i -D playwright` im Projekt, KEIN `playwright install`).
