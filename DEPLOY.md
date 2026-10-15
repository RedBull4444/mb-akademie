# M&B Akademie – Online stellen (Cloudflare Pages)

Voraussetzung: Cloudflare-Konto von M&B, API-Token mit „Cloudflare Pages: Edit“ + „D1: Edit“, Account-ID.

1. `npm install`
2. Videos (32 × MP4, je < 25 MiB) nach `public/videos/` (M00_DE.mp4 … M15_SQ.mp4). Testvideos vorher löschen.
3. `export CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=…`
4. Datenbank: `npx wrangler d1 create akademie-db` → ausgegebene database_id in wrangler.toml eintragen,
   dann `npx wrangler d1 execute akademie-db --remote --file=schema.sql`
5. Projekt: `npx wrangler pages project create mb-akademie --production-branch main`
6. Secrets (NIE wieder ändern nach dem ersten Mitarbeiter: PIN_PEPPER):
   `npx wrangler pages secret put PIN_PEPPER --project-name mb-akademie` (langer Zufallswert)
   `npx wrangler pages secret put SETUP_TOKEN --project-name mb-akademie` (Einmal-Code für die Chef-Ersteinrichtung)
7. Entwicklungsdateien raus: `public/assets/mock.js`, `public/assets/chef-mock.js`
8. `npx wrangler pages deploy public --project-name mb-akademie --branch main`
9. Danach prüfen: /chef/ Ersteinrichtung, Video auf iPhone (Range/206), Vorspulen gesperrt, Quiz, Zertifikat, /pruefen/.

Quizfragen ändern: content/quiz/MNN.json bearbeiten → `node tools/gen-quiz.mjs` → neu deployen.

## Kapitel für „Nachschlagen“ (chapters.json)
Die Datei `public/assets/chapters.json` wird auf dem Render-Server aus den Videoprojekten erzeugt (nicht im Repo gepflegt):
`node tools/gen-chapters.cjs projekte.json > public/assets/chapters.json` – danach deployen. Nach Video-Änderungen neu erzeugen.
Im Repo liegt nur ein leeres `{}` (App zeigt dann keine Kapitel).
