-- M&B Akademie – Datenbankschema (SQLite / Cloudflare D1)
-- Idempotent: kann beliebig oft angewendet werden. Alle Zeiten sind Unix-Sekunden.

-- Einstellungen, z. B. 'company_code' (Firmencode für die Registrierung)
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

-- Mitarbeiter. name_key = kleingeschriebener "vorname nachname" ohne Mehrfach-Leerzeichen.
CREATE TABLE IF NOT EXISTS employees (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  first        TEXT NOT NULL,
  last         TEXT NOT NULL,
  name_key     TEXT NOT NULL UNIQUE,
  lang         TEXT NOT NULL DEFAULT 'de' CHECK (lang IN ('de', 'sq')),
  pin_hash     TEXT NOT NULL,
  pin_salt     TEXT NOT NULL,
  active       INTEGER NOT NULL DEFAULT 1,
  failed       INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER,
  created_at   INTEGER,
  last_seen    INTEGER
);

-- Chef-Zugänge (Owner legt weitere Admins an)
CREATE TABLE IF NOT EXISTS admins (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL,
  username     TEXT NOT NULL UNIQUE,
  pass_hash    TEXT NOT NULL,
  pass_salt    TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin')),
  failed       INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER,
  created_at   INTEGER
);

-- Sitzungen: in der DB liegt nur der SHA-256-Hash des Cookie-Tokens
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  kind       TEXT NOT NULL CHECK (kind IN ('emp', 'admin')),
  subject_id INTEGER NOT NULL,
  created_at INTEGER,
  expires_at INTEGER
);

-- Video-Fortschritt je Mitarbeiter und Modul (max_pos = weiteste gesehene Stelle in Sekunden,
-- last_report = Zeitpunkt der letzten ANGERECHNETEN Meldung in Millisekunden, completed_at in Sekunden)
CREATE TABLE IF NOT EXISTS progress (
  emp_id       INTEGER NOT NULL,
  module       INTEGER NOT NULL,
  max_pos      REAL NOT NULL DEFAULT 0,
  last_report  INTEGER,
  completed_at INTEGER,
  PRIMARY KEY (emp_id, module)
);

-- Quiz-Versuche (answers = JSON-Array der gewählten Antwort-IDs)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  emp_id  INTEGER NOT NULL,
  module  INTEGER NOT NULL,
  score   INTEGER NOT NULL,
  passed  INTEGER NOT NULL,
  answers TEXT,
  at      INTEGER
);

-- Zertifikate je Teil (code = MB-T{teil}-XXXX)
CREATE TABLE IF NOT EXISTS certificates (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  emp_id    INTEGER NOT NULL,
  part      INTEGER NOT NULL,
  code      TEXT NOT NULL UNIQUE,
  issued_at INTEGER,
  UNIQUE (emp_id, part)
);

-- Einfache Rate-Limits, z. B. 'reg:'+ip, 'login:'+ip
CREATE TABLE IF NOT EXISTS rate (
  key          TEXT PRIMARY KEY,
  count        INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_progress_emp  ON progress (emp_id);
CREATE INDEX IF NOT EXISTS idx_quiz_emp_mod  ON quiz_attempts (emp_id, module);
CREATE INDEX IF NOT EXISTS idx_sessions_exp  ON sessions (expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_subj ON sessions (kind, subject_id);

-- Serverseitige Quiz-Läufe: pro Abruf von GET /api/quiz/:n ein Lauf, je Frage genau EINE Antwort.
-- answers = JSON-Objekt {"q0":antwortId,...}; finished = 1 nach submit.
CREATE TABLE IF NOT EXISTS quiz_runs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  emp_id     INTEGER NOT NULL,
  module     INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  answers    TEXT NOT NULL DEFAULT '{}',
  finished   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_quiz_runs_emp ON quiz_runs (emp_id, module);

-- Anmelde-Fehlversuche je Name bzw. (Chef-Benutzername + IP): eskalierende Sperren.
-- Auch für UNBEKANNTE Namen geführt, damit Antworten für bekannte/unbekannte Konten gleich aussehen.
-- count = Fehlversuche seit letztem Erfolg, locked_until = gesperrt bis, prev_locked = Sperre VOR dem letzten Zählen.
CREATE TABLE IF NOT EXISTS login_guard (
  key         TEXT PRIMARY KEY,
  count        INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER NOT NULL DEFAULT 0,
  prev_locked  INTEGER NOT NULL DEFAULT 0,
  updated_at   INTEGER NOT NULL
);
