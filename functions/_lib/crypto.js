// Kryptografie-Helfer (nur WebCrypto der Workers-Runtime).

const enc = new TextEncoder();

// Cloudflare Workers erlaubt für PBKDF2 maximal 100 000 Iterationen – genau der SPEC-Wert.
export const PBKDF2_ITERATIONS = 100000;

export function toBase64(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

export function fromBase64(str) {
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function toHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function randomBytes(n) {
  return crypto.getRandomValues(new Uint8Array(n));
}

// Zufallszahl 0..max-1 ohne Modulo-Verzerrung (Rejection Sampling).
export function randomInt(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
  return buf[0] % max;
}

// Zufälliger Code aus einem Alphabet, z. B. 'MB-XXXX'-Teil.
export function randomCode(alphabet, len) {
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[randomInt(alphabet.length)];
  return out;
}

// Zeitkonstanter Vergleich zweier Strings/Byte-Arrays: es wird immer über die
// volle Länge des längeren Wertes verglichen, ohne vorzeitigen Abbruch.
export function timingSafeEqual(a, b) {
  const x = typeof a === 'string' ? enc.encode(a) : a;
  const y = typeof b === 'string' ? enc.encode(b) : b;
  const len = Math.max(x.length, y.length);
  let diff = x.length ^ y.length;
  for (let i = 0; i < len; i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

async function pbkdf2(secret, saltBytes) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: PBKDF2_ITERATIONS },
    key,
    256,
  );
  return new Uint8Array(bits);
}

// Neuen Hash samt Salt erzeugen (PIN oder Passwort). Rückgabe: { hash, salt } jeweils Base64.
export async function hashSecret(secret) {
  const salt = randomBytes(16);
  const hash = await pbkdf2(secret, salt);
  return { hash: toBase64(hash), salt: toBase64(salt) };
}

// Prüfen gegen gespeicherten Hash (zeitkonstant).
export async function verifySecret(secret, hashB64, saltB64) {
  const hash = await pbkdf2(secret, fromBase64(saltB64));
  return timingSafeEqual(hash, fromBase64(hashB64));
}

// Dummy-Prüfung für unbekannte Benutzer: gleiche Rechenzeit, damit man Konten nicht per Timing erraten kann.
const DUMMY_SALT = toBase64(new Uint8Array(16));
export async function dummyVerify(secret) {
  await pbkdf2(secret, fromBase64(DUMMY_SALT));
  return false;
}

export async function sha256Hex(text) {
  const d = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return toHex(new Uint8Array(d));
}

// Session-Token: 32 Zufallsbytes, URL-sicher kodiert.
export function newToken() {
  return toBase64(randomBytes(32)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
