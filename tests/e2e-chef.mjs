// E2E gegen wrangler pages dev (Port 8791): Ersteinrichtung, Team, Detail, PIN, Sperren, Einstellungen.
import {createRequire} from 'node:module'; import {execSync} from 'node:child_process';
const require = createRequire('/tmp/claude-0/-home-claude/11c135d6-a206-58fa-85d9-899349f4e70c/scratchpad/render/');
const {chromium} = require('playwright');
const base = 'http://localhost:8791', out = 'tests/out/e2e';
const P = '/tmp/claude-0/-home-claude/11c135d6-a206-58fa-85d9-899349f4e70c/scratchpad/d1state';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx = await b.newContext({viewport:{width:1280,height:900}, deviceScaleFactor:2, acceptDownloads:true});
const p = await ctx.newPage();
p.on('console', m=>{ if(['error','warning'].includes(m.type())) console.log('console:', m.text()); });
p.on('pageerror', e=>console.log('pageerror:', e.message));
const shot = n => p.screenshot({path:`${out}-${n}.png`});
await p.goto(base+'/chef/'); await p.waitForSelector('form');
console.log('setup screen:', await p.textContent('h1'));
await p.fill('[name=setupToken]','falsch'); await p.fill('[name=name]','Miran Shala'); await p.fill('[name=username]','miran'); await p.fill('[name=password]','kurz');
await p.click('button[type=submit]'); await p.waitForTimeout(300); console.log('err short pw:', await p.textContent('#e'));
await p.fill('[name=password]','SehrSicher12345'); await p.click('button[type=submit]'); await p.waitForTimeout(800); console.log('err wrong token:', await p.textContent('#e'));
await p.fill('[name=setupToken]','test-setup-123'); await p.click('button[type=submit]'); await p.waitForSelector('.codebox'); 
const code = (await p.textContent('.codebox')).trim(); console.log('code', code);
await shot('settings');
// Mitarbeiter anlegen
const names = [['Arben','Krasniqi','de','7391'],['Besnik','Gashi','sq','2846'],['Ëndrit','Çelaj','sq','5920']];
for (const [f,l,lang,pin] of names) {
  const r = await ctx.request.post(base+'/api/register',{headers:{Origin:base},data:{code,first:f,last:l,lang,pin}});
  console.log('register', f, r.status(), (await r.text()).slice(0,80));
}
await ctx.clearCookies({name:'mb_s'});
// Fortschritt Arben: Modul 0 per API (eigener Kontext)
const emp = await b.newContext(); const ep = emp.request;
await ep.post(base+'/api/login',{headers:{Origin:base},data:{name:'Arben Krasniqi',pin:'7391'}});
await ep.post(base+'/api/progress',{headers:{Origin:base},data:{module:0,pos:5}});
const pr = await ep.post(base+'/api/progress',{headers:{Origin:base},data:{module:0,pos:8}}); console.log('progress', await pr.text());
execSync(`npx wrangler d1 execute akademie-db --local --persist-to ${P} --command "INSERT INTO certificates(emp_id,part,code,issued_at) VALUES (1,1,'MB-T1-7K4Q',${Math.floor(Date.now()/1000)})"`,{stdio:'ignore'});
await p.goto(base+'/chef/#/team'); await p.waitForSelector('table.team tbody tr[data-id]'); await p.waitForTimeout(600);
await shot('team');
await p.click('tr[data-id="1"]'); await p.waitForTimeout(700); await shot('team-detail');
// Zertifikat-PDF im Chef-Bereich
const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-cert="1"]')]);
console.log('download', dl.suggestedFilename()); await dl.saveAs('tests/out/e2e-cert-from-chef.pdf');
// PIN zurücksetzen
await p.click('[data-act="reset"]'); await p.click('dialog [data-a="yes"]'); await p.waitForSelector('.pinbig');
const pin = (await p.textContent('.pinbig')).trim(); console.log('neue PIN', pin);
await shot('pin'); await p.keyboard.press('Escape');
const lg = await ep.post(base+'/api/login',{headers:{Origin:base},data:{name:'Arben Krasniqi',pin}}); console.log('login mit neuer PIN', lg.status());
// Sperren
await p.click('[data-act="toggle"]'); await p.click('dialog [data-a="yes"]'); await p.waitForTimeout(800); await shot('locked');
const lg2 = await ep.post(base+'/api/login',{headers:{Origin:base},data:{name:'Arben Krasniqi',pin}}); console.log('login gesperrt', lg2.status(), (await lg2.text()).slice(0,90));
await p.click('[data-act="toggle"]'); await p.click('dialog [data-a="yes"]'); await p.waitForTimeout(800);
const lg3 = await ep.post(base+'/api/login',{headers:{Origin:base},data:{name:'Arben Krasniqi',pin}}); console.log('login entsperrt', lg3.status());
// Filter + Suche
await p.fill('#q','çel'); await p.waitForTimeout(200); console.log('Suche çel ->', await p.$$eval('table.team tbody tr[data-id]', r=>r.length));
await p.fill('#q',''); await p.click('[data-filter="finished"]'); console.log('fertig ->', await p.textContent('#rows'));
// Einstellungen: Code ändern, Admin hinzufügen/entfernen
await p.goto(base+'/chef/#/einstellungen'); await p.waitForSelector('.codebox');
await p.click('#rotate'); await p.click('dialog [data-a="yes"]'); await p.waitForTimeout(800); const code2=(await p.textContent('.codebox')).trim(); console.log('neuer Code', code2, code2!==code);
console.log('wa href', (await p.getAttribute('#wa','href')).slice(0,140));
await p.click('#addAdmin'); await p.fill('dialog [name=name]','Büro'); await p.fill('dialog [name=username]','buero'); await p.fill('dialog [name=password]','kurz'); await p.click('dialog [type=submit]'); console.log('err:', await p.textContent('#ae'));
await p.fill('dialog [name=password]','BueroPass12345'); await p.click('dialog [type=submit]'); await p.waitForTimeout(800); console.log('Zugänge:', await p.$$eval('.who .n', e=>e.map(x=>x.textContent)));
await shot('settings2');
const csv = await p.evaluate(async()=> (await fetch('/api/chef/export.csv')).text()); console.log('csv:', csv.slice(0,200).replace(/\n/g,'\\n'));
// Logout/Login
await p.click('#logout'); await p.waitForSelector('form'); console.log('nach Logout:', await p.textContent('h1'));
await p.fill('[name=username]','miran'); await p.fill('[name=password]','falsch1234567'); await p.click('button[type=submit]'); await p.waitForTimeout(600); console.log('falsches PW:', await p.textContent('#e'));
await p.fill('[name=password]','SehrSicher12345'); await p.click('button[type=submit]'); await p.waitForSelector('table.team'); console.log('Login ok');
// Handy
await p.click('[data-filter="all"]'); await p.setViewportSize({width:390,height:844}); await p.goto(base+'/chef/#/team'); await p.waitForSelector('.row'); await p.waitForTimeout(500); await shot('m-team');
await p.click('.row[data-id="1"]'); await p.waitForTimeout(700); await shot('m-emp');
await b.close();
