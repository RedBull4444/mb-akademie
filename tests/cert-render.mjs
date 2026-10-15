// Erzeugt Test-PDFs mit cert.js in Chromium und legt sie unter tests/out/ ab.
import {createRequire} from 'node:module'; import fs from 'node:fs';
const require = createRequire('/tmp/claude-0/-home-claude/11c135d6-a206-58fa-85d9-899349f4e70c/scratchpad/render/');
const {chromium} = require('playwright');
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p = await b.newPage();
p.on('console', m=>console.log('console:', m.text())); p.on('pageerror', e=>console.log('pageerror:', e.message));
await p.goto('http://localhost:8899/tests/cert-test.html');
for (const k of ['t1','t2','t3']) {
  const b64 = await p.evaluate(async k => { const u = await MBCert.build(SAMPLES[k]); let s=''; for (const x of u) s+=String.fromCharCode(x); return btoa(s); }, k);
  fs.writeFileSync(new URL(`./out/cert-${k}.pdf`, import.meta.url), Buffer.from(b64,'base64'));
  console.log(k, 'ok');
}
await b.close();
