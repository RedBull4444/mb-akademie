/* M&B Akademie – Zertifikat prüfen. Liest ?code=, ruft GET /api/verify. */
(function () {
  'use strict';
  var f = document.getElementById('f'), input = document.getElementById('code'), out = document.getElementById('out'), btn = document.getElementById('go');
  var CHECK = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtDate(ts) {
    var n = Number(ts); if (!n) return '';
    try { return new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(n < 1e12 ? n * 1000 : n)); }
    catch (e) { return ''; }
  }
  function clean(v) { return String(v || '').toUpperCase().replace(/\s+/g, '').replace(/[–—]/g, '-'); }
  function show(html) { out.innerHTML = html; }

  async function check(raw) {
    var code = clean(raw);
    if (!code) { show('<div class="result bad"><p style="margin:0">Bitte einen Prüfcode eingeben.</p></div>'); input.focus(); return; }
    btn.disabled = true; btn.textContent = 'Prüfe …';
    try {
      var res = await fetch('/api/verify?code=' + encodeURIComponent(code), { cache: 'no-store', credentials: 'same-origin' });
      var data = null; try { data = await res.json(); } catch (e) { /* kein JSON */ }
      if (res.ok && data && data.valid) {
        show('<div class="result ok"><div class="h">' + CHECK + 'Gültig</div><p><b>' + esc(data.name) + '</b> hat Teil ' + esc(data.part) +
          (data.partTitle ? ' · ' + esc(data.partTitle) : '') + ' am ' + esc(fmtDate(data.issuedAt)) + ' abgeschlossen.</p>' +
          '<p class="meta2">Prüfcode ' + esc(code) + ' · SHK-Grundlagen, M&amp;B Akademie</p></div>');
      } else if (res.ok) {
        show('<div class="result bad"><div class="h">Nicht gefunden</div><p>Kein Zertifikat mit diesem Code gefunden.</p><p class="meta2">Bitte den Code noch einmal prüfen und erneut eingeben.</p></div>');
      } else {
        show('<div class="result bad"><p style="margin:0">' + esc((data && data.error) || 'Das hat nicht geklappt. Bitte später nochmal.') + '</p></div>');
      }
    } catch (e) {
      show('<div class="result bad"><p style="margin:0">Keine Verbindung. Bitte später nochmal.</p></div>');
    }
    btn.disabled = false; btn.textContent = 'Prüfen';
  }

  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var code = clean(input.value); input.value = code;
    try { history.replaceState(null, '', code ? '?code=' + encodeURIComponent(code) : location.pathname); } catch (e) { /* egal */ }
    check(code);
  });

  var q = new URLSearchParams(location.search).get('code');
  if (q) { input.value = clean(q); check(q); } else { input.focus(); }
})();
