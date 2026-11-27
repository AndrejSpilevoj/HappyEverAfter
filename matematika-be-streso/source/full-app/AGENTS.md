# Matematika be streso — project instructions

Updated: 20 November 2026. This is the working reference for future website changes.
The user's latest explicit instruction takes precedence. Verify current source and deployment state before changing anything; this document records decisions, not a guarantee that every feature is healthy.

## Purpose and language

A Lithuanian mathematics teaching website with public video lessons, paid remote help, and private teacher/student workspaces. Students typically solve tasks on paper and upload photos. Use natural Lithuanian for interface text, including correct diacritics. Discuss changes with the owner in their chosen language.

## Source and production

- Production: https://matematikabestreso.lt/
- Cloudflare fallback: https://matematika-be-streso.andrej-spilevoj.workers.dev/
- GitHub repository: AndrejSpilevoj/HappyEverAfter
- Website branch: cloudflare-backend
- App directory: matematika-be-streso/source/full-app/
- Cloudflare Worker: matematika-be-streso
- Branch commits trigger Cloudflare builds. Check build results before saying a change is live.
- Do not merge into main or edit the older GitHub Pages copy unless requested.
- Read README.md, CLOUDFLARE-DEPLOYMENT.md and GOOGLE-DRIVE-SETUP.md when relevant. Keep credentials, tokens, passwords and personal student data out of documentation and commits.
- Domain registration is with IV.lt. Changing DNS does not transfer ownership. Verify actual DNS configuration before changing it.

## Design and writing

- Minimal, calm blue design with pale mathematics illustrations and translucent Apple Glass-style panels.
- Use the existing tattooed Einstein logo. Preserve its proportions.
- Keep text readable: interface labels generally at least 18px; body text around 20px. Compact layouts by reducing unnecessary content and padding, not by making text tiny.
- Maintain clear contrast, consistent alignment, visible gaps and mobile wrapping. Avoid dimmed text, squeezed rows and oversized empty cards.
- Write concise, useful copy. Avoid slogans, explanations of internal implementation and repeated descriptive paragraphs.
- Statistics should be compact. Do not restore the removed "Kaip skaičiuojama?" section, metric descriptions or decorative introduction.
- The permanent "Pranešimų nustatymai" button was removed. Keep email sending operational; retain reconnection/recovery controls when a connection actually needs attention.

## Public pages and content decisions

- Lesson heading: "8 KLASĖ 1 DALIS". A separate label already identifies video lessons.
- Opening video: "Matematika: 10 auksinių patarimų!".
- YouTube channel: @MatematikaBeStreso.
- Desktop shows the video description. Mobile order: video, title, collapsed "Apie video" disclosure, then other lessons. Keep the description collapsed initially on mobile.
- Services live under "Paslaugos". Preserve the current detailed package copy when making unrelated changes.
- Remote help: 20 € buys four help points; a solution check costs one point and a topic explanation costs two. Points do not expire; preserve existing follow-up terms.
- Emphasize: "Patikrinsiu sprendimą ir paaiškinsiu klaidas." and "Paaiškinsiu tai, ko dar nesupranti."
- Do not restore the removed introductory sentence "Už 20 € įsigyji keturis pagalbos taškus. Atsakymus gausi vaizdo įrašu."
- Footer: one "Apie mane" link to the existing LinkedIn account. Do not restore "Matematika be streso · Tavo tempu."
- Social sharing uses a dedicated image rather than the raw logo. Current asset: /social-preview-v2.png, 1200×630, centered logo approximately 75% of the image width. Preserve safe margins and update Open Graph/Twitter metadata together if changing it.

## Private workspaces

- Username/password login; teacher creates accounts. Students must only access their own work.
- Preserve password reset and account deletion. The user prefers deleting stale accounts to a disable-only action.
- Teacher manages separate regular-student and remote-help groups.
- Preserve "Užduotys", "Mokiniai" and "Klausimai". Student question action: "Paklausk mokytojo".
- Questions support an attached screenshot/photo and text explaining the difficulty, with teacher replies.
- Teacher can assign text and/or images to one or several students; students send solution photos.
- Task trash actions currently hide tasks from the teacher's list with Undo, preserving student work and stored files. Do not silently turn this into permanent deletion.
- Google Drive uploads use a dedicated folder for each task/test. Student uploads should carry the student's name; preserve the existing naming implementation.
- Email notifications go to the relevant teacher/student. Removing a settings button must not disable notifications or change notification recipients.

## Printing

- Print tasks as clean A4 worksheets with logo, website, task title, readable instructions and restrained image sizes.
- Exclude navigation, dialogs, interface buttons and conversation clutter.
- Preserve space for student name/date and paper working.
- Predominantly black monochrome screenshots are converted to dark writing on white for printing only. White-background images should remain normal. Do not indiscriminately invert every image or change the screen original.
- Check print pagination and image readability when modifying print styles.

## Analytics

- Statistics are private to the teacher: /?area=teacher&view=statistics.
- Include teacher and student visits as well as other visitors. The latest instruction was "Don't exclude anyone"; do not reintroduce role-based exclusions.
- Preserve the visitor's existing analytics choice. Collection currently requires their permission; do not remove that control as a side effect of simplifying the dashboard.
- Unique visitors represent browser identifiers, not verified individual people. Another device or cleared storage can count separately.
- A new session follows 30 minutes of inactivity. Refreshing within the same session should not inflate visits.
- Available views: visits, unique/returning visitors, return rate, daily trend, devices, approximate cities/countries and referral sources; date filters and CSV export.
- No raw IP storage. Approximate location comes from Cloudflare request metadata; geography can be inaccurate.
- Retention: up to 365 days. Historical visits from before collection cannot be reconstructed from this tracker.
- Age and gender are not available from normal website requests. Do not invent these values or infer them from names, photos or browsing behavior. No demographic collection has been requested or implemented.

## Code map

Paths are relative to the app directory:

| File | Responsibility |
| --- | --- |
| app/MathSite.tsx | Main interface and teacher/student workspaces |
| app/globals.css | Shared responsive and print styles |
| app/VisitorStats.tsx | Private dashboard and public VisitorCounting component |
| lib/visitor-analytics.ts | Analytics storage and aggregation |
| lib/server.ts | API dispatch and server operations |
| worker/index.ts | Cloudflare entry point and trusted request geography |
| app/privacy/page.tsx | Privacy information |

## Workflow for future changes

1. Inspect current branch, relevant files and any newer instructions; preserve unrelated work.
2. Carry out requested changes through to deployment when website updates are authorized. Do not stop after a plan.
3. Keep changes scoped; preserve authentication, authorization, uploads, notifications and consent behavior.
4. Verify the affected desktop/mobile layout or behavior. For print changes, inspect print output; for data changes, check access boundaries and counting logic.
5. Run relevant repository checks. A successful Cloudflare deployment does not imply TypeScript verification passed.
6. As of 20 November 2026, both the previous commit and the compact-dashboard commit had a failing GitHub "verify" check at "npx tsc --noEmit", while Cloudflare builds succeeded. The exact errors were not diagnosed. Recheck current results; do not assume new failures are pre-existing.
7. Report what changed, deployment status and material verification limits honestly. Do not claim private-page inspection without authenticated access.
8. Update this reference when the owner changes a lasting preference or architecture decision.
