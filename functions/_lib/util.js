// Allgemeine Helfer: Antworten, Header, Cookies, Validierung, Texte.

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
};

export const now = () => Math.floor(Date.now() / 1000);

// Eigene Fehlerklasse: wird im Router in { error } + Status übersetzt.
export class HttpError extends Error {
  constructor(status, message, extra) {
    super(message);
    this.status = status;
    this.extra = extra || {};
  }
}

// JSON-Antwort mit Security-Headern und no-store (alle /api/*-Antworten).
export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...SECURITY_HEADERS,
      ...headers,
    },
  });
}

// ---------- Texte (Fehlermeldungen in der Sprache des Nutzers, Default DE) ----------
// SQ: Muttersprachler prüfen
const T = {
  bad_request: { de: 'Ungültige Anfrage.', sq: 'Kërkesë e pavlefshme.' },
  forbidden_origin: { de: 'Anfrage nicht erlaubt.', sq: 'Kërkesa nuk lejohet.' },
  not_found: { de: 'Nicht gefunden.', sq: 'Nuk u gjet.' },
  method: { de: 'Methode nicht erlaubt.', sq: 'Metoda nuk lejohet.' },
  server: { de: 'Serverfehler. Bitte später nochmal.', sq: 'Gabim në server. Provo përsëri më vonë.' },
  login_required: { de: 'Bitte anmelden.', sq: 'Të lutem hyr në llogari.' },
  code_wrong: { de: 'Der Firmencode stimmt nicht.', sq: 'Kodi i kompanisë nuk është i saktë.' },
  too_many: { de: 'Zu viele Versuche. Bitte später nochmal.', sq: 'Shumë përpjekje. Provo përsëri më vonë.' },
  name_invalid: { de: 'Bitte Vor- und Nachnamen eintragen (nur Buchstaben).', sq: 'Shkruaj emrin dhe mbiemrin (vetëm shkronja).' },
  name_taken: { de: 'Diesen Namen gibt es schon. Bitte im Büro melden.', sq: 'Ky emër ekziston tashmë. Lajmërohu në zyrë.' },
  lang_invalid: { de: 'Sprache ungültig.', sq: 'Gjuha është e pavlefshme.' },
  pin_format: { de: 'Die PIN muss aus genau 4 Ziffern bestehen.', sq: 'PIN-i duhet të ketë saktësisht 4 shifra.' },
  pin_trivial: { de: 'Diese PIN ist zu einfach. Bitte eine andere wählen.', sq: 'Ky PIN është shumë i thjeshtë. Zgjidh një tjetër.' },
  login_wrong: { de: 'Name oder PIN stimmt nicht.', sq: 'Emri ose PIN-i nuk është i saktë.' },
  tries_left: { de: (n) => `Name oder PIN stimmt nicht. Noch ${n} Versuche.`, sq: (n) => `Emri ose PIN-i nuk është i saktë. Edhe ${n} përpjekje.` },
  tries_left_1: { de: 'Name oder PIN stimmt nicht. Noch 1 Versuch.', sq: 'Emri ose PIN-i nuk është i saktë. Edhe 1 përpjekje.' },
  // Argument = Dauer als Text, z. B. "15 Minuten" / "24 Stunden"
  locked_now: { de: (t) => `Zu viele Fehlversuche. Gesperrt für ${t}.`, sq: (t) => `Shumë përpjekje të gabuara. Llogaria u bllokua për ${t}.` },
  locked: { de: (t) => `Gesperrt. Bitte in ${t} nochmal versuchen.`, sq: (t) => `Llogaria është e bllokuar. Prit ${t} dhe provo përsëri.` },
  account_locked: { de: 'Konto gesperrt. Bitte im Büro melden.', sq: 'Llogaria është e bllokuar. Lajmërohu në zyrë.' },
  module_locked: { de: 'Dieses Modul ist noch nicht freigeschaltet.', sq: 'Ky modul nuk është hapur ende.' },
  module_invalid: { de: 'Modul ungültig.', sq: 'Moduli është i pavlefshëm.' },
  run_over: { de: 'Dieses Quiz ist abgelaufen oder schon abgegeben. Bitte neu starten.', sq: 'Ky kuiz ka skaduar ose është dorëzuar tashmë. Fillo përsëri.' },
  already_answered: { de: 'Diese Frage wurde schon beantwortet.', sq: 'Kësaj pyetjeje i je përgjigjur tashmë.' },
  video_first: { de: 'Bitte zuerst das Video ansehen.', sq: 'Të lutem shiko së pari videon.' },
  no_quiz: { de: 'Für dieses Modul gibt es kein Quiz.', sq: 'Ky modul nuk ka kuiz.' },
  quiz_answers: { de: 'Bitte alle 5 Fragen beantworten.', sq: 'Përgjigju të 5 pyetjeve.' },
  cert_none: { de: 'Kein Zertifikat vorhanden.', sq: 'Nuk ka certifikatë.' },
  admin_bad: { de: 'Benutzername oder Passwort stimmt nicht.', sq: 'Emri i përdoruesit ose fjalëkalimi nuk është i saktë.' },
  setup_token: { de: 'Der Einrichtungs-Code stimmt nicht.', sq: 'Kodi i konfigurimit nuk është i saktë.' },
  setup_done: { de: 'Die Einrichtung ist bereits abgeschlossen.', sq: 'Konfigurimi është kryer tashmë.' },
  admin_fields: { de: 'Bitte Name, Benutzername (mind. 3 Zeichen) und Passwort (mind. 10 Zeichen) eintragen.', sq: 'Shkruaj emrin, emrin e përdoruesit (min. 3 karaktere) dhe fjalëkalimin (min. 10 karaktere).' },
  admin_taken: { de: 'Diesen Benutzernamen gibt es schon.', sq: 'Ky emër përdoruesi ekziston tashmë.' },
  owner_only: { de: 'Nur der Inhaber darf das.', sq: 'Vetëm pronari mund ta bëjë këtë.' },
  self_delete: { de: 'Du kannst dich nicht selbst löschen.', sq: 'Nuk mund ta fshish veten.' },
  last_owner: { de: 'Der letzte Hauptadmin kann nicht entfernt oder zurückgestuft werden.', sq: 'Administratori kryesor i fundit nuk mund të hiqet ose të ulet.' },
  role_invalid: { de: 'Rolle ungültig.', sq: 'Roli është i pavlefshëm.' },
};

export function msg(key, lang, arg) {
  const e = T[key] || T.server;
  const v = e[lang === 'sq' ? 'sq' : 'de'];
  return typeof v === 'function' ? v(arg) : v;
}

// Sprache für öffentliche Routen: body.lang > X-Lang-Header > Accept-Language > de.
export function pickLang(request, body) {
  const cand = (body && body.lang) || request.headers.get('X-Lang') || (request.headers.get('Accept-Language') || '').slice(0, 2);
  return cand === 'sq' ? 'sq' : 'de';
}

// ---------- Request-Helfer ----------
export function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 'local';
}

// CSRF-Schutz: Origin muss gleich der eigenen Origin sein.
export function originOk(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  return origin === new URL(request.url).origin;
}

// JSON-Body lesen (leer → {}). Größe begrenzt.
export async function readJson(request) {
  const text = await request.text();
  if (text.length > 20000) throw new HttpError(413, 'Anfrage zu groß.');
  if (!text.trim()) return {};
  try {
    const v = JSON.parse(text);
    if (v === null || typeof v !== 'object' || Array.isArray(v)) throw new Error('kein Objekt');
    return v;
  } catch {
    throw new HttpError(400, 'Ungültige Anfrage.');
  }
}

export function parseCookies(request) {
  const out = {};
  for (const part of (request.headers.get('Cookie') || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}

export function cookieHeader(name, value, maxAge) {
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

// ---------- Validierung ----------
// Name bereinigen: Unicode-NFKC, typografische Apostrophe vereinheitlichen, Leerzeichen zusammenfassen.
export function cleanName(s) {
  return String(s == null ? '' : s)
    .normalize('NFKC')
    .replace(/[\u2018\u2019\u02bc\u0060\u00b4]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Name: nur Buchstaben des lateinischen Alphabets (inkl. ë, ç, ğ, ş, ı …) sowie Leerzeichen,
// Bindestrich und Apostroph; 2–40 Zeichen, beginnt und endet mit einem Buchstaben.
const isLatinLetter = (c) => /\p{L}/u.test(c) && /\p{Script=Latin}/u.test(c);
export function validNamePart(s) {
  const chars = [...s];
  if (chars.length < 2 || chars.length > 40) return false;
  if (!isLatinLetter(chars[0]) || !isLatinLetter(chars[chars.length - 1])) return false;
  return chars.every((c) => isLatinLetter(c) || c === ' ' || c === '-' || c === "'");
}

// Schlüssel für Namensvergleiche (Registrierung UND Login): kleingeschrieben ohne Locale-Tücken
// (türkisches İ/ı), ohne Mehrfach-Leerzeichen. Gleiche Funktion für Vor-/Nachname und eingegebenen Namen.
export function nameKeyOf(full) {
  return cleanName(full)
    .toLocaleLowerCase('en')
    .replace(/\u0307/g, '')
    .replace(/\u0131/g, 'i')
    .replace(/\s+/g, ' ');
}

// name_key = lower(first + ' ' + last)
export function nameKey(first, last) {
  return nameKeyOf(cleanName(first) + ' ' + cleanName(last));
}

export function validPinFormat(pin) {
  return typeof pin === 'string' && /^\d{4}$/.test(pin);
}

// Triviale PINs: gleiche Ziffern, auf-/absteigende Folgen, ABAB/AABB sowie ein paar Klassiker.
const COMMON_PINS = new Set(['2580', '1004', '2000', '6969', '1337', '0852', '1379', '2001', '1990', '2024', '2025', '2026']);
export function isTrivialPin(pin) {
  const d = pin.split('').map(Number);
  if (d.every((x) => x === d[0])) return true;
  const step = d[1] - d[0];
  if ((step === 1 || step === -1) && d[2] - d[1] === step && d[3] - d[2] === step) return true;
  if (d[0] === d[2] && d[1] === d[3]) return true; // ABAB
  if (d[0] === d[1] && d[2] === d[3]) return true; // AABB
  return COMMON_PINS.has(pin);
}

// Datum für CSV/Anzeige: TT.MM.JJJJ HH:MM (Europe/Berlin)
export function fmtDateTime(sec) {
  if (!sec) return '';
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(sec * 1000)).replace(',', '');
}
