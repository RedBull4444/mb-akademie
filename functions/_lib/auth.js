// Sessions und Zugriffsprüfung. In der DB liegt nur der SHA-256-Hash des Cookie-Tokens.
import { first, run } from './db.js';
import { newToken, sha256Hex } from './crypto.js';
import { HttpError, cookieHeader, msg, now, parseCookies } from './util.js';

const KINDS = {
  emp: { cookie: 'mb_s', maxAge: 180 * 24 * 3600 }, // Mitarbeiter: 180 Tage
  admin: { cookie: 'mb_a', maxAge: 12 * 3600 }, // Chef: 12 Stunden
};

// Neue Session anlegen. Rückgabe: Set-Cookie-Wert.
export async function createSession(env, kind, subjectId) {
  const { cookie, maxAge } = KINDS[kind];
  const token = newToken();
  const t = now();
  await run(
    env,
    'INSERT INTO sessions (token_hash, kind, subject_id, created_at, expires_at) VALUES (?, ?, ?, ?, ?)',
    await sha256Hex(token), kind, subjectId, t, t + maxAge,
  );
  return cookieHeader(cookie, token, maxAge);
}

// Cookie löschen (Abmelden)
export const clearCookie = (kind) => cookieHeader(KINDS[kind].cookie, '', 0);

// Session löschen (Abmelden). Fehlt der Cookie, passiert nichts.
export async function destroySession(request, env, kind) {
  const token = parseCookies(request)[KINDS[kind].cookie];
  if (token) await run(env, 'DELETE FROM sessions WHERE token_hash = ? AND kind = ?', await sha256Hex(token), kind);
}

// Alle Sessions eines Nutzers löschen (PIN-Reset, Sperren).
export const destroySessionsOf = (env, kind, subjectId) =>
  run(env, 'DELETE FROM sessions WHERE kind = ? AND subject_id = ?', kind, subjectId);

// Eingeloggten Mitarbeiter laden (nur aktive Konten), sonst null.
export async function currentEmployee(request, env) {
  const token = parseCookies(request)[KINDS.emp.cookie];
  if (!token) return null;
  return first(
    env,
    `SELECT e.* FROM sessions s JOIN employees e ON e.id = s.subject_id
     WHERE s.token_hash = ? AND s.kind = 'emp' AND s.expires_at > ? AND e.active = 1`,
    await sha256Hex(token), now(),
  );
}

// Eingeloggten Chef laden, sonst null.
export async function currentAdmin(request, env) {
  const token = parseCookies(request)[KINDS.admin.cookie];
  if (!token) return null;
  return first(
    env,
    `SELECT a.* FROM sessions s JOIN admins a ON a.id = s.subject_id
     WHERE s.token_hash = ? AND s.kind = 'admin' AND s.expires_at > ?`,
    await sha256Hex(token), now(),
  );
}

export async function requireEmployee(request, env) {
  const emp = await currentEmployee(request, env);
  if (!emp) throw new HttpError(401, msg('login_required', 'de'));
  return emp;
}

export async function requireAdmin(request, env) {
  const admin = await currentAdmin(request, env);
  if (!admin) throw new HttpError(401, msg('login_required', 'de'));
  return admin;
}
