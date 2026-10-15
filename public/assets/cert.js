/* M&B Akademie – Zertifikat als PDF (A4 quer), erzeugt im Browser mit pdf-lib.
 *
 * window.MBCert = { build(data) -> Promise<Uint8Array>, download(data), share(data) }
 *
 * data = GET /api/certificate/:part
 *   { name, part, partTitle, modules:[{n,title}], minutes, issuedAt, code }
 *
 * Voraussetzungen (global): PDFLib, fontkit, qrcode. Fehlen sie, werden sie
 * von /assets/ nachgeladen. Schriften: /assets/pdf/*.ttf, Logo: /assets/logo.png.
 * Layout = design/Zertifikat-Teil1 (1123 x 794 px -> 842 x 595 pt).
 */
(function () {
  'use strict';

  var PAGE_W = 842, PAGE_H = 595;
  var S = PAGE_W / 1123; // Designpixel -> pt

  var INK = '#14181d', GREY = '#5b6570', LINE = '#d5d9de', LINE2 = '#e6e9ec', RED = '#d6001c';

  // Das Zertifikat ist immer deutsch, unabhaengig von der App-Sprache.
  var PART_DE = { 1: 'Bauteile', 2: 'Anlage & Hydraulik', 3: 'Betrieb & Kontrolle' };
  var MOD_DE = {
    0: 'Einführung in die Schulungsreihe',
    1: 'Membran-Ausdehnungsgefäß (MAG) Heizung',
    2: 'Trinkwasser-Ausdehnungsgefäß',
    3: 'Nachfülleinheit und Wasseraufbereitung',
    4: 'Sicherheitsgruppe Heizung',
    5: 'Sicherheitsgruppe Warmwasserspeicher',
    6: 'Schlammabscheider',
    7: 'Luftabscheider und Entlüfter',
    8: 'Warmwasserspeicher anschließen',
    9: 'Heizungsanlage anschließen',
    10: 'Wärmepumpen-Hydraulik',
    11: 'Umwälzpumpe und Rückschlagventile',
    12: 'Hydraulischer Abgleich',
    13: 'Mischerkreis',
    14: 'Heizungswasser: Magnetit und VDI 2035',
    15: 'Typische Montagefehler und Abschlusskontrolle'
  };

  var FONT_URLS = {
    reg: '/assets/pdf/SchibstedGrotesk_400Regular.ttf',
    semi: '/assets/pdf/SchibstedGrotesk_600SemiBold.ttf',
    bold: '/assets/pdf/SchibstedGrotesk_700Bold.ttf',
    serif: '/assets/pdf/CormorantGaramond_600_latin.ttf'
  };
  var LOGO_URL = '/assets/logo.png';

  var cache = {}; // heruntergeladene Bytes

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Skript nicht ladbar: ' + src)); };
      document.head.appendChild(s);
    });
  }

  function ensureLibs() {
    var p = Promise.resolve();
    if (!window.PDFLib) p = p.then(function () { return loadScript('/assets/pdf-lib.min.js'); });
    if (!window.fontkit) p = p.then(function () { return loadScript('/assets/fontkit.umd.min.js'); });
    if (!window.qrcode) p = p.then(function () { return loadScript('/assets/qrcode.js'); });
    return p;
  }

  function fetchBytes(url) {
    if (cache[url]) return Promise.resolve(cache[url]);
    return fetch(url, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('Datei nicht ladbar: ' + url);
      return r.arrayBuffer();
    }).then(function (b) { cache[url] = b; return b; });
  }

  function hex(c) {
    var n = parseInt(c.slice(1), 16);
    return PDFLib.rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
  }

  function toDate(v) {
    if (v instanceof Date) return v;
    var n = typeof v === 'string' && /^\d+(\.\d+)?$/.test(v) ? Number(v) : v;
    if (typeof n === 'number') return new Date(n < 1e12 ? n * 1000 : n);
    var d = new Date(n);
    return isNaN(d) ? new Date() : d;
  }

  function dateParts(v) {
    var d = toDate(v), out = { d: '', m: '', y: '' };
    try {
      new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric' })
        .formatToParts(d).forEach(function (p) {
          if (p.type === 'day') out.d = p.value;
          if (p.type === 'month') out.m = p.value;
          if (p.type === 'year') out.y = p.value;
        });
    } catch (e) { /* Fallback unten */ }
    if (!out.y) {
      out.d = String(d.getDate()).padStart(2, '0');
      out.m = String(d.getMonth() + 1).padStart(2, '0');
      out.y = String(d.getFullYear());
    }
    return out;
  }

  function safeName(s) {
    return String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'Mitarbeiter';
  }

  // ---------------------------------------------------------------- build
  async function build(data) {
    await ensureLibs();
    var PDFLib = window.PDFLib;
    var part = Number(data.part) || 1;
    var code = String(data.code || '');
    var name = String(data.name || '').replace(/\s+/g, ' ').trim();
    var partName = PART_DE[part] || data.partTitle || '';
    var dt = dateParts(data.issuedAt);
    var dateStr = dt.d + '.' + dt.m + '.' + dt.y;
    var mods = (data.modules || []).map(function (m) {
      return { n: Number(m.n), title: MOD_DE[Number(m.n)] || m.title || '' };
    });
    var minutes = Math.round(Number(data.minutes) || 0);

    var bytes = await Promise.all([
      fetchBytes(FONT_URLS.reg), fetchBytes(FONT_URLS.semi), fetchBytes(FONT_URLS.bold),
      fetchBytes(FONT_URLS.serif), fetchBytes(LOGO_URL)
    ]);

    var doc = await PDFLib.PDFDocument.create();
    doc.registerFontkit(window.fontkit);
    var F = {
      reg: await doc.embedFont(bytes[0], { subset: true }),
      semi: await doc.embedFont(bytes[1], { subset: true }),
      bold: await doc.embedFont(bytes[2], { subset: true }),
      serif: await doc.embedFont(bytes[3], { subset: true })
    };
    var logo = await doc.embedPng(bytes[4]);

    doc.setTitle('Zertifikat SHK-Grundlagen Teil ' + part + ' – ' + name);
    doc.setAuthor('M&B Gebäudetechnik');
    doc.setSubject('M&B Akademie · Interne Fachschulung · ' + code);
    doc.setCreator('M&B Akademie');
    doc.setProducer('M&B Akademie');
    doc.setCreationDate(toDate(data.issuedAt));
    doc.setModificationDate(toDate(data.issuedAt));

    var page = doc.addPage([PAGE_W, PAGE_H]);

    // --- Hilfsfunktionen (alle Koordinaten in Designpixeln, Ursprung links oben)
    var X = function (x) { return x * S; };
    var Y = function (y) { return PAGE_H - y * S; };

    function metrics(font) {
      var f = font.embedder && font.embedder.font;
      if (f && f.unitsPerEm) return { asc: f.ascent / f.unitsPerEm, desc: -f.descent / f.unitsPerEm };
      return { asc: 0.95, desc: 0.25 };
    }

    // Breite in Designpixeln (size = Designpixel)
    // Zeichenweise Positionen (px) mit Paar-Kerning; vermeidet Ligaturen (wie Chrome bei Letter-Spacing)
    function glyphRun(font, str, size, ls) {
      var chs = Array.from(str), xs = [], x = 0;
      for (var i = 0; i < chs.length; i++) {
        xs.push(x);
        var w = font.widthOfTextAtSize(chs[i], size * S) / S;
        var k = 0;
        if (i + 1 < chs.length) {
          var pair = font.widthOfTextAtSize(chs[i] + chs[i + 1], size * S) / S;
          var kk = pair - w - font.widthOfTextAtSize(chs[i + 1], size * S) / S;
          if (Math.abs(kk) < size * 0.12) k = kk;
        }
        x += w + k + ls;
      }
      return { chs: chs, xs: xs, w: x };
    }
    function textW(font, str, size, ls, per) {
      if (!str) return 0;
      if (!ls && !per) return font.widthOfTextAtSize(str, size * S) / S;
      return glyphRun(font, str, size, ls || 0).w;
    }

    // Text mit CSS-aehnlicher Zeilenbox: top = Oberkante der Zeile, lh = Zeilenhoehe (px)
    function text(str, o) {
      var font = o.font, size = o.size, lh = o.lh;
      var m = metrics(font);
      var base = o.top + (lh - (m.asc + m.desc) * size) / 2 + m.asc * size; // Baseline in px
      var color = hex(o.color || INK);
      var ls = o.ls || 0;
      var x = o.x;
      var per = !!o.per;
      if (o.align === 'right') x = o.x - textW(font, str, size, ls, per);
      if (ls || per) {
        var run = glyphRun(font, str, size, ls);
        run.chs.forEach(function (ch, i) {
          page.drawText(ch, { x: X(x + run.xs[i]), y: Y(base), size: size * S, font: font, color: color });
        });
      } else {
        page.drawText(str, { x: X(x), y: Y(base), size: size * S, font: font, color: color });
      }
    }

    function rect(x, y, w, h, color) {
      page.drawRectangle({ x: X(x), y: Y(y + h), width: w * S, height: h * S, color: hex(color) });
    }
    function frame(inset, color) {
      var x0 = inset + 0.5, y0 = inset + 0.5, w = 1123 - 2 * inset - 1, h = 794 - 2 * inset - 1;
      page.drawRectangle({
        x: X(x0), y: Y(y0 + h), width: w * S, height: h * S,
        borderColor: hex(color), borderWidth: 1 * S
      });
    }

    // Umbruch fuer gemischte Runs ([{t, f}]) in max. Breite (px)
    function wrap(runs, size, maxW) {
      var words = [];
      runs.forEach(function (r) {
        r.t.split(/\s+/).filter(Boolean).forEach(function (w) { words.push({ t: w, f: r.f }); });
      });
      var space = textW(F.reg, ' ', size);
      var lines = [], cur = [], curW = 0;
      words.forEach(function (w) {
        var ww = textW(w.f, w.t, size);
        if (cur.length && curW + space + ww > maxW) { lines.push(cur); cur = []; curW = 0; }
        curW += (cur.length ? space : 0) + ww;
        cur.push({ t: w.t, f: w.f, w: ww });
      });
      if (cur.length) lines.push(cur);
      return { lines: lines, space: space };
    }
    function drawWrapped(w, o) {
      w.lines.forEach(function (line, i) {
        var x = o.x;
        line.forEach(function (word, j) {
          text(word.t, { font: word.f, size: o.size, lh: o.lh, top: o.top + i * o.lh, x: x, color: o.color });
          x += word.w + w.space;
        });
      });
    }

    // ------------------------------------------------------------ Rahmen
    frame(28, LINE);
    frame(34, LINE2);

    // ------------------------------------------------------------ Kopf
    var logoH = 56, logoW = logoH * logo.width / logo.height;
    page.drawImage(logo, { x: X(72), y: Y(72 + logoH), width: logoW * S, height: logoH * S });

    text('ZERTIFIKAT-NR.', { font: F.reg, size: 10, lh: 14, top: 80, x: 1051, align: 'right', ls: 1.4, color: GREY });
    text(code, { font: F.semi, size: 13, lh: 18, top: 100, x: 1051, align: 'right', ls: 0.78, color: INK });

    // ------------------------------------------------------------ Linke Spalte
    var LX = 72;
    text('M&B AKADEMIE · INTERNE FACHSCHULUNG', { font: F.reg, size: 11, lh: 14, top: 152, x: LX, ls: 1.54, color: GREY });
    text('Zertifikat', { font: F.serif, size: 72, lh: 72, top: 186, x: LX, ls: -0.36, color: INK });
    rect(LX, 272, 48, 2, RED);
    text('Hiermit wird bestätigt, dass', { font: F.reg, size: 15, lh: 24, top: 302, x: LX, color: GREY });

    var nameSize = 48;
    while (nameSize > 28 && textW(F.serif, name, nameSize, 0, true) > 590) nameSize -= 1;
    text(name, { font: F.serif, size: nameSize, lh: 53, top: 336, x: LX, per: true, color: INK });
    rect(LX, 403, 590, 1, LINE);

    var chW = textW(F.reg, '0', 15);
    var para = wrap([
      { t: 'die Schulungsreihe ', f: F.reg },
      { t: 'SHK-Grundlagen · Teil ' + part + ': ' + partName, f: F.bold },
      { t: ' vollständig absolviert und die Wissenstests zu allen Modulen bestanden hat.', f: F.reg }
    ], 15, 52 * chW);
    drawWrapped(para, { x: LX, top: 424, size: 15, lh: 24, color: INK });

    // ------------------------------------------------------------ Trennlinie
    rect(702, 152, 1, 360, LINE);

    // ------------------------------------------------------------ Rechte Spalte
    var RX = 743, RW = 1051 - 743;
    text('INHALTE', { font: F.reg, size: 11, lh: 14, top: 152, x: RX, ls: 1.54, color: GREY });
    rect(RX, 180, RW, 1, LINE);
    var rowTop = 181;
    mods.forEach(function (m, i) {
      var top = rowTop + i * 24;
      var last = i === mods.length - 1;
      text(String(m.n).padStart(2, '0'), { font: F.semi, size: 13, lh: 20, top: top + 3, x: RX, color: GREY });
      var tsz = 13, avail = RW - 34;
      while (tsz > 10.5 && textW(F.reg, m.title, tsz) > avail) tsz -= 0.25;
      text(m.title, { font: F.reg, size: tsz, lh: 20, top: top + 3, x: RX + 34, color: INK });
      rect(RX, top + 23, RW, 1, last ? LINE : LINE2);
    });
    var afterList = rowTop + mods.length * 24;
    var umfTop = afterList + 22;
    text('UMFANG', { font: F.reg, size: 11, lh: 14, top: umfTop, x: RX, ls: 1.54, color: GREY });
    var umf = wrap([{
      t: mods.length + (mods.length === 1 ? ' Lehrvideo' : ' Lehrvideos') + ' · ' + minutes + ' Minuten · Wissenstest je Modul (Bestehensgrenze 80 %)',
      f: F.reg
    }], 13, RW);
    drawWrapped(umf, { x: RX, top: umfTop + 14 + 8, size: 13, lh: 20, color: INK });

    // ------------------------------------------------------------ Fusszone
    rect(72, 528, 979, 1, LINE);
    // Ort, Datum
    text('ORT, DATUM', { font: F.reg, size: 10, lh: 14, top: 576, x: 72, ls: 1.4, color: GREY });
    text('Treuchtlingen, ' + dateStr, { font: F.reg, size: 13, lh: 20, top: 600, x: 72, color: INK });
    rect(72, 626, 280, 1, INK);
    // Unterschrift (leer, zum handschriftlichen Unterzeichnen)
    rect(392, 626, 311, 1, INK);
    text('Miran Shala', { font: F.semi, size: 13, lh: 18, top: 627, x: 392, color: INK });
    var nw = textW(F.semi, 'Miran Shala', 13);
    text(' · Geschäftsführer', { font: F.reg, size: 13, lh: 18, top: 627, x: 392 + nw, color: GREY });

    // ------------------------------------------------------------ Siegel
    drawSeal(743 + 52, 541 + 52, 'TEIL ' + part, dt.y);

    function drawSeal(cx, cy, label, year) {
      var rot = -8 * Math.PI / 180; // Siegel ist -8 Grad gedreht (gegen den Uhrzeigersinn, Bildschirm)
      var col = hex(RED);
      page.drawCircle({ x: X(cx), y: Y(cy), size: 50.25 * S, borderColor: col, borderWidth: 1.5 * S });
      page.drawCircle({ x: X(cx), y: Y(cy), size: 34.5 * S, borderColor: col, borderWidth: 0.75 * S });

      // lokale Siegelkoordinaten (y nach unten, Ursprung = Mitte) -> Seite, inkl. Drehung
      function toPage(lx, ly) {
        var rx = lx * Math.cos(rot) - ly * Math.sin(rot);
        var ry = lx * Math.sin(rot) + ly * Math.cos(rot);
        return { x: X(cx + rx), y: Y(cy + ry) };
      }
      function put(str, font, size, lx, ly, screenCwDeg) {
        var p = toPage(lx, ly);
        page.drawText(str, {
          x: p.x, y: p.y, size: size * S, font: font, color: col,
          rotate: PDFLib.degrees(-(screenCwDeg + (rot * 180 / Math.PI)))
        });
      }

      // Umschrift: Kreis r=40.5, Start links (9 Uhr), im Uhrzeigersinn, Schrift steht aussen
      var ring = 'M&B GEBÄUDETECHNIK · AKADEMIE · TREUCHTLINGEN ·';
      var chars = Array.from(ring), fs = 9, R = 40.5, total = 253;
      var ws = chars.map(function (c) { return F.semi.widthOfTextAtSize(c, fs * S) / S; });
      var natural = ws.reduce(function (a, b) { return a + b; }, 0);
      var extra = (total - natural) / chars.length;
      var s0 = 0;
      chars.forEach(function (c, i) {
        var w = ws[i];
        if (c !== ' ') {
          var mid = s0 + w / 2;
          var phi = Math.PI + mid / R;                    // Bildschirmwinkel, 180 Grad = links
          var px = R * Math.cos(phi), py = R * Math.sin(phi);
          var tx = -Math.sin(phi), ty = Math.cos(phi);    // Tangente (im Uhrzeigersinn)
          var ox = px - tx * w / 2, oy = py - ty * w / 2; // Glyph-Ursprung
          put(c, F.semi, fs, ox, oy, phi * 180 / Math.PI + 90);
        }
        s0 += w + extra;
      });

      // Mitte
      function centered(str, font, size, ls, ly) {
        var w = 0, chs = Array.from(str);
        chs.forEach(function (c) { w += font.widthOfTextAtSize(c, size * S) / S + ls; });
        var x = -w / 2;
        chs.forEach(function (c) {
          put(c, font, size, x, ly, 0);
          x += font.widthOfTextAtSize(c, size * S) / S + ls;
        });
      }
      centered(label, F.bold, 13, 0.8, 1);
      centered(year, F.semi, 10, 1.2, 15);
    }

    // ------------------------------------------------------------ Echtheit + QR
    var verifyUrl = location.origin + '/pruefen/?code=' + encodeURIComponent(code);
    var note = wrap([{ t: 'Echtheit prüfen: Prüfcode ' + code + ' auf der Prüfseite der M&B Akademie eingeben oder QR-Code scannen.', f: F.reg }], 10, 330);
    var noteTop = 722 - note.lines.length * 15;
    drawWrapped(note, { x: 72, top: noteTop, size: 10, lh: 15, color: GREY });

    var qr = window.qrcode(0, 'M');
    qr.addData(verifyUrl);
    qr.make();
    var cnt = qr.getModuleCount();
    var qrSize = 64, qrX = 72 + 330 + 20, qrY = 722 - qrSize, mod = qrSize / cnt;
    var qcol = hex(INK);
    for (var r = 0; r < cnt; r++) {
      var c = 0;
      while (c < cnt) {
        if (!qr.isDark(r, c)) { c++; continue; }
        var start = c;
        while (c < cnt && qr.isDark(r, c)) c++;
        page.drawRectangle({
          x: X(qrX + start * mod), y: Y(qrY + (r + 1) * mod) - 0.01,
          width: (c - start) * mod * S, height: mod * S + 0.02, color: qcol
        });
      }
    }

    text('M&B Gebäudetechnik', { font: F.reg, size: 10, lh: 15, top: 692, x: 743, color: GREY });
    text('Heizung · Sanitär · Neue Energien · Treuchtlingen', { font: F.reg, size: 10, lh: 15, top: 707, x: 743, color: GREY });

    return doc.save();
  }

  // ---------------------------------------------------------------- Ausgabe
  function fileName(data) {
    var last = String(data.name || '').trim().split(/\s+/).pop();
    return 'Zertifikat-Teil' + (Number(data.part) || 1) + '-' + safeName(last) + '.pdf';
  }

  async function toFile(data) {
    var bytes = await build(data);
    return new File([bytes], fileName(data), { type: 'application/pdf' });
  }

  function saveFile(file) {
    var url = URL.createObjectURL(file);
    var a = document.createElement('a');
    a.href = url; a.download = file.name; a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 4000);
  }

  async function download(data) {
    var file = await toFile(data);
    saveFile(file);
    return file;
  }

  async function share(data) {
    var file = await toFile(data);
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: 'Zertifikat ' + (data.name || ''), text: 'M&B Akademie · Zertifikat ' + (data.code || '') });
        return file;
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return file; // Nutzer hat abgebrochen
    }
    saveFile(file);
    return file;
  }

  window.MBCert = { build: build, download: download, share: share };
})();
