// Läuft vor JEDER Anfrage: schützt alle Video-Pfade, egal in welcher Schreibweise
// (//videos/…, %2F, %76ideos, /VIDEOS/, Backslash, /./ und /../ …). Der Pfad wird erst normalisiert,
// dann geprüft – so kann die Zugangskontrolle nicht über einen Umweg an den statischen Dateien vorbei.
import { isVideoPath, normalizePath, serveVideo } from './_lib/video.js';

export async function onRequest(context) {
  const { request, env } = context;
  const raw = new URL(request.url).pathname;
  const norm = normalizePath(raw);

  if (norm === null) {
    // Kaputte Kodierung: bei Video-Verdacht sicherheitshalber 404, sonst normal weiter.
    if (/video|mp4/i.test(raw)) return new Response('Nicht gefunden.', { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return context.next();
  }
  if (isVideoPath(norm)) return serveVideo(request, env, norm);
  return context.next();
}
