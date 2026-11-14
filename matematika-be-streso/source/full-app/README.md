# Matematika be streso

Lithuanian, responsive private tutoring site. Built with React/Vinext and hosted as a Cloudflare Worker through Sites, with D1 records and private R2 uploads. The repository is portable; GitHub Pages alone cannot run the private accounts, database, uploads or email delivery.

## Owner workflow

1. Open the small lock icon in the footer (or `/?area=teacher`) and sign in with the ChatGPT account `andrej.spilevoj@gmail.com`.
2. In **Mokiniai**, add a name and optionally the student's or parent's email address. Copy the generated access code; it is shown once. Share it with that student privately.
3. In **Užduotys → Nauja užduotis**, enter text and/or attach photos. Select one or more students or **Visiems mokiniams**, then **Paskirti užduotį**.
4. Open an assigned task and select a student to see that student's private submission. Reply in text, add media, or record audio/video directly with browser permission.
5. Renew a student's code to invalidate the old code and all remembered sessions; turn off access to revoke entry without deleting work.

Students can also use **Užduoti klausimą** to start a private text/photo conversation about another problem, even before receiving an assignment. The teacher receives a queued email notification.

Student codes have 80 bits of entropy. The server stores only SHA-256 hashes. A remembered session uses an opaque random, hashed server-side token and a Secure, HttpOnly, SameSite cookie, expiring in 90 days. Student authorization is checked on every task, thread and attachment request. The student login is rate-limited. Teacher identity comes from trusted Sites authentication headers, never a client-supplied role.

## Email setup — required before notifications can be sent

Configure production secrets through Sites:

- `RESEND_API_KEY`: key from the owner's Resend account.
- `EMAIL_FROM`: verified sender, e.g. `Matematika be streso <pamokos@your-verified-domain>`.
- `TEACHER_EMAIL`: optional; defaults to `andrej.spilevoj@gmail.com`. This controls the authenticated teacher identity. The notification destination is the email the user requested.

Keys must never be committed. Email notifications are queued in D1, then sent via Resend when configured, with a provider idempotency key. If unavailable or rejected, the assignment/reply stays saved and the notification remains pending/failed. The teacher's notification information panel can retry up to 20 queued notifications per click. Assignment emails contain a link, not login codes or solution photos. A new teacher reply also notifies a student who has an email address.

## Files and recording

- Up to 5 attachments, total 25 MB per submission.
- Assignment/student photos: JPG, PNG, WebP or GIF, maximum 10 MB each. HEIC must be converted to JPG before upload.
- Teacher replies also accept MP4, WebM, MP3, Ogg and M4A; maximum 25 MB each.
- Browser recording limits: audio 2 minutes, video 1 minute. Upload a prerecorded file if recording is unsupported.
- Files are served only through authorized API routes. R2 objects have opaque IDs and no public bucket URLs.

## Lessons and branding

`lib/lessons.ts` contains the 20 long-form videos identified on the supplied YouTube channel: 19 numbered 8th-grade lessons and one tips video. Video bytes stay on YouTube; the site loads a single privacy-enhanced embed after a click. Add future lessons to the same list. `public/logo.webp` (original in `assets/logo-source.png`) is the selected Einstein logo with the white, black-outlined wordmark. The approved Lithuanian introduction is in `app/MathSite.tsx`.

## Development and checks

Use Node >=22.13.0 and npm. Follow the Sites plugin's installer and build helper.

- `npm run dev` — local development preview on port 5173.
- `npx tsc --noEmit` — type check.
- `node scripts/check-workflow.mjs` — isolated real API implementation tests with in-memory SQLite and private object storage. Use Node >=22.16 with `node:sqlite` support.
- `npm run db:generate` — generate a new migration after schema changes.
- `npm run build` — production build.

Apply pending local D1 SQL before using the preview database:

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_powerful_yellow_claw.sql
```

Local preview and production data are separate. Test accounts are created only in local preview and are not seeded into production. The starter's mock teacher sign-in is development-only. Production relies on Sites identity and access policies. New Sites begin owner-private for review; changing the audience is a separate hosting setting, while the application's student/private-file checks always remain in place.
