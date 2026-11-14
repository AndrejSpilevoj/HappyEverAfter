# Matematika be streso

Public mathematics lesson website owned by Andrej Spilevoj, published from this repository with GitHub Pages.

Website: https://AndrejSpilevoj.github.io/HappyEverAfter/matematika-be-streso/

## Public website

- `index.html`, `app.js`, `styles.css`: the complete public site, already built. No ChatGPT hosting or login is used by these pages.
- `logo.webp`, `favicon.svg`: the selected Einstein branding and site icon.
- `source/public-site/`: editable React source and a small build script. To rebuild, run `npm install` then `npm run build` inside this directory; commit the updated public files too.
- Change the lesson list in `source/public-site/src/lessons.ts`, then rebuild.
- Edit the approved biography in `source/public-site/src/PublicSite.tsx`, then rebuild.
- Styles are in the top-level `styles.css`.

All 20 long-form lessons are embedded directly from the supplied YouTube channel. The lesson player loads on click; videos are not uploaded to GitHub. The layout works under this subdirectory and uses relative asset links.

## Private student area

This GitHub Pages edition contains the public lessons and biography. Its student-area button clearly explains that private access has not yet been connected. It does not simulate secure authentication, store private work in public files, or send users to a ChatGPT-hosted site.

The complete original application code is preserved in `source/full-app/`, including student accounts, assignments, photo responses, teacher voice/video replies, database migrations and email notification integration. It requires a backend hosting account with a database and object storage. GitHub Pages alone cannot execute it. The old Site identity and all local/runtime data are excluded. That app's teacher authentication currently uses Sites identity headers and must be replaced before deploying independently. Follow its README for the rest of the backend and email setup.

No student names, login codes, uploaded work, database records, API keys, or credentials are committed here.
