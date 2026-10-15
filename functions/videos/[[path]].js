// Zugangsprüfung für /videos/*. Die eigentliche Arbeit steckt in _lib/video.js (gemeinsam mit
// functions/_middleware.js, die zusätzlich alle ungewöhnlichen Schreibweisen abfängt).
import { normalizePath, serveVideo } from '../_lib/video.js';

export const onRequest = ({ request, env }) => serveVideo(request, env, normalizePath(new URL(request.url).pathname));
