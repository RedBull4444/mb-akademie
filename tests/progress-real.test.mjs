// Tests mit ECHTEN Video-Dauern (DEV_SHORT=0): Vorspul-Schutz und Pepper-Pflicht.
//
// Eigener Dev-Server mit eigener Datenbank (damit die 8-s-Tests in api.test.mjs unberührt bleiben):
//   npx wrangler d1 execute akademie-db --local --persist-to .wrangler/state-real --file=schema.sql
//   npx wrangler pages dev public --port 8789 --persist-to .wrangler/state-real --binding DEV_SHORT=0
//   BASE_URL=http://localhost:8789 PERSIST_TO=.wrangler/state-real node tests/progress-real.test.mjs
// Zweiter Lauf OHNE Pepper (muss Registrierung/Login verweigern, "fail closed"):
//   ... pages dev ... --binding DEV_SHORT=0 --binding PIN_PEPPER=   und   NO_PEPPER=1 node tests/progress-real.test.mjs
import { Client, cap, chefBootstrap, ok, rnd, section, sleep, sql, summary } from './lib.mjs';

const NO_PEPPER = process.env.NO_PEPPER === '1';

async function main() {
  const chef = new Client();
  const CODE = await chefBootstrap(chef);

  if (NO_PEPPER) {
    section('Pepper fehlt (DEV_SHORT=0): alles mit PIN wird verweigert');
    const c = new Client();
    const r = await c.post('/api/register', { code: CODE, first: 'Pepper', last: 'Test' + cap(rnd()), lang: 'de', pin: '5839' });
    ok(r.status === 500 && !c.jar.mb_s, 'Registrierung ohne PIN_PEPPER -> 500, kein Cookie', r);
    const l = await new Client().post('/api/login', { name: 'Pepper Test', pin: '5839' });
    ok(l.status === 500, 'Login ohne PIN_PEPPER -> 500', l);
    const team = (await chef.get('/api/chef/team')).data.employees;
    if (team.length) {
      const rp = await chef.post(`/api/chef/employee/${team[0].id}/reset-pin`);
      ok(rp.status === 500, 'PIN-Reset ohne PIN_PEPPER -> 500', rp);
    } else ok(true, '(kein Mitarbeiter für PIN-Reset-Test vorhanden)');
    process.exit(summary());
  }

  const dur0 = (await (async () => {
    const c = new Client();
    await c.post('/api/register', { code: CODE, first: 'Real', last: 'Dauer' + cap(rnd()), lang: 'de', pin: '5839' });
    return c.get('/api/me');
  })()).data.modules[1].duration;
  ok(dur0 === 298.4, 'Server läuft mit echten Dauern (Modul 1 = 298,4 s)', dur0);

  section('Vorspul-Schutz mit echter Dauer (Modul 1 = 298,4 s)');
  const emp = new Client();
  const last = 'Real' + cap(rnd());
  await emp.post('/api/register', { code: CODE, first: 'Arben', last, lang: 'de', pin: '5839' });
  const id = (await chef.get('/api/chef/team')).data.employees.find((e) => e.name === `Arben ${last}`).id;
  // Modul 0 als erledigt eintragen (sonst wären 40 s Echtzeit nötig), damit Modul 1 freigeschaltet ist.
  sql(`INSERT INTO progress (emp_id, module, max_pos, last_report, completed_at) VALUES (${id}, 0, 39.5, 0, CAST(strftime('%s','now') AS INTEGER))`);
  ok((await emp.get('/api/me')).data.modules[1].unlocked, 'Modul 1 ist freigeschaltet');

  const t0 = Date.now();
  const first = await emp.post('/api/progress', { module: 1, pos: 99999 });
  ok(first.data.maxPos <= 6 && first.data.completed === false, 'Erste Meldung: höchstens 6 s Guthaben', first.data);
  const burst = [];
  for (let i = 0; i < 200; i++) burst.push(emp.post('/api/progress', { module: 1, pos: 99999 }));
  const res = await Promise.all(burst);
  let more = null;
  for (let i = 0; i < 200; i++) more = await emp.post('/api/progress', { module: 1, pos: 99999 }); // + 200 nacheinander
  const elapsed = (Date.now() - t0) / 1000;
  const me = (await emp.get('/api/me')).data.modules[1];
  ok(!res.some((r) => r.data.completed) && more.data.completed === false && me.completed === false, '400 schnelle Anfragen (pos=99999) schließen das Modul NICHT ab', { elapsed, maxPos: me.maxPos });
  ok(me.maxPos <= 6 + 1.25 * (elapsed + 1) + 0.01, `Fortschritt wächst höchstens mit 1,25 x vergangener Zeit (maxPos ${me.maxPos.toFixed(1)} nach ${elapsed.toFixed(1)} s)`, { maxPos: me.maxPos, elapsed });
  const before = me.maxPos;
  await sleep(2200);
  const after = await emp.post('/api/progress', { module: 1, pos: 99999 });
  ok(after.data.maxPos > before && after.data.maxPos <= before + 1.25 * 3 + 6.3 && after.data.completed === false, 'Nach >= 2 s Pause gibt es wieder Guthaben (1,25 x Zeit)', { before, after: after.data });
  const noRise = await emp.post('/api/progress', { module: 1, pos: 99999 });
  ok(noRise.data.maxPos === after.data.maxPos, 'Direkt danach (< 2 s) wieder kein Guthaben', noRise.data);

  section('Parallele Anfragen: Update ist atomar');
  const emp2 = new Client();
  const last2 = 'Real' + cap(rnd());
  await emp2.post('/api/register', { code: CODE, first: 'Paral', last: last2, lang: 'de', pin: '5839' });
  const id2 = (await chef.get('/api/chef/team')).data.employees.find((e) => e.name === `Paral ${last2}`).id;
  sql(`INSERT INTO progress (emp_id, module, max_pos, last_report, completed_at) VALUES (${id2}, 0, 39.5, 0, CAST(strftime('%s','now') AS INTEGER))`);
  const f2 = await emp2.post('/api/progress', { module: 1, pos: 1 });
  await sleep(2100);
  const par = await Promise.all(Array.from({ length: 40 }, () => emp2.post('/api/progress', { module: 1, pos: 99999 })));
  const mx = Math.max(...par.map((r) => r.data.maxPos));
  ok(mx <= 1 + 1.25 * 3.5, 'Auch 40 gleichzeitige Meldungen nach 2 s Pause bringen nur EIN Guthaben', { mx });

  console.log('\n(Der 5-Sekunden-Takt bis zum Abschluss wird in api.test.mjs mit DEV_SHORT=1 geprüft.)');
  process.exit(summary());
}
main().catch((e) => { console.error('Testabbruch:', e); process.exit(2); });
