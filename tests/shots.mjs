// Usage: node tests/shots.mjs <baseUrl> <outPrefix> [query]  – Screenshots des Chef-Bereichs (Handy + PC)
import {createRequire} from 'node:module';
const require = createRequire('/tmp/claude-0/-home-claude/11c135d6-a206-58fa-85d9-899349f4e70c/scratchpad/render/');
const {chromium} = require('playwright');
const base = process.argv[2] || 'http://localhost:8899', out = process.argv[3] || 'tests/out/chef', qs = process.argv[4] || '?mock=1';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
async function run(name, vp, steps) {
  const ctx = await b.newContext({viewport:vp, deviceScaleFactor:2, acceptDownloads:true});
  const p = await ctx.newPage();
  p.on('console', m=>{ if(m.type()==='error'||m.type()==='warning') console.log(name,'console:', m.text()); });
  p.on('pageerror', e=>console.log(name,'pageerror:', e.message));
  p.on('requestfailed', r=>console.log(name,'reqfail:', r.url()));
  await p.goto(base+'/chef/'+qs+'#/team'); await p.waitForTimeout(700);
  await steps(p);
  await ctx.close();
}
const shot = (p, n) => p.screenshot({path:`${out}-${n}.png`});
await run('m', {width:390,height:844}, async p => {
  await shot(p,'m-team');
  await p.click('.row[data-id="1"]'); await p.waitForTimeout(500); await shot(p,'m-emp');
  await p.goto(base+'/chef/'+qs+'#/einstellungen'); await p.waitForTimeout(500); await shot(p,'m-set');
  await p.click('#rotate'); await p.waitForTimeout(300); await shot(p,'m-rotate');
  await p.keyboard.press('Escape');
  await p.goto(base+'/chef/'+qs+'#/vorfuehren'); await p.waitForTimeout(400); await shot(p,'m-demo');
  await p.goto(base+'/chef/'+qs+'#/vorfuehren/3'); await p.waitForTimeout(500); await shot(p,'m-demo3');
});
await run('d', {width:1280,height:900}, async p => {
  await shot(p,'d-team');
  await p.click('tr[data-id="3"]'); await p.waitForTimeout(400);
  await p.click('[data-act="reset"]'); await p.waitForTimeout(300); await shot(p,'d-confirm');
  await p.click('dialog [data-a="yes"]'); await p.waitForTimeout(500); await shot(p,'d-pin');
  await p.keyboard.press('Escape');
  await p.goto(base+'/chef/'+qs+'#/einstellungen'); await p.waitForTimeout(500); await shot(p,'d-set');
  await p.goto(base+'/chef/'+qs+'#/vorfuehren/9'); await p.waitForTimeout(500); await shot(p,'d-demo');
});
await run('login', {width:390,height:844}, async p => { await p.goto(base+'/chef/'+qs+'&state=login'); await p.waitForTimeout(500); await shot(p,'m-login'); await p.goto(base+'/chef/'+qs+'&state=setup'); await p.waitForTimeout(500); await shot(p,'m-setup'); });
await b.close();
