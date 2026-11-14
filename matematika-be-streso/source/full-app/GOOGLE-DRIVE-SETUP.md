# Google Drive uploads, teacher sign-in and Gmail notifications

The standalone Cloudflare app uses the owner's Google account for private Drive uploads and teacher sign-in. Student codes remain unchanged; students do not need Google accounts.

## Configuration
- Google Cloud project: matematika-be-streso (640040081927).
- Drive and Gmail APIs: verified enabled.
- Create an OAuth web application client.
- Authorized redirect URI: https://matematika-be-streso.andrej-spilevoj.workers.dev/api/google/callback
- Required runtime settings: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.
- Store GOOGLE_CLIENT_SECRET only as a Cloudflare runtime secret. Never put it in source, build variables, a URL or chat.
- Owner account: andrej.spilevoj@gmail.com (TEACHER_EMAIL can explicitly override).
- Optional PUBLIC_ORIGIN must exactly match the deployed HTTPS origin and Google redirect registration.
- OAuth scope: openid email https://www.googleapis.com/auth/drive.file. The Drive scope is limited to files created/opened by this app, not the whole Drive.
- Add the owner as an OAuth test user while the app is in Testing. External Testing refresh tokens with Drive scopes expire after seven days; production configuration is needed for persistent unattended use.
- Do not enable billing or R2 for this integration.

## First connection
Open the footer teacher lock, select the owner account, and approve the app's file access. Only a verified Google identity for the configured owner is accepted. The app creates a private "Matematika be streso – private uploads" folder. It never creates public sharing permissions.

The owner authorizes Drive once; the server can refresh its access afterward to accept student uploads. Signing out ends the teacher browser session but intentionally keeps the storage connection working for students. Revoking Google authorization stops uploads until reconnection.

## Security and storage
- OAuth state is random, bound to a Secure/HttpOnly/SameSite cookie, expires after ten minutes, and is atomically consumed.
- Uses PKCE, nonce, Google's RS256 signature, issuer, audience, verified email and owner checks.
- Teacher sessions use random server-side tokens stored only as hashes, expire after seven days and are revoked on logout.
- Refresh credentials are AES-GCM encrypted in D1 using a key derived from the runtime client secret. Rotating that secret requires reconnecting Drive.
- Files are uploaded to private Drive storage and mapped to opaque app attachment IDs.
- All downloads pass the existing task/student authorization checks before contacting Google; provider IDs and access tokens stay on the server.
- Audio/video byte ranges are forwarded without exposing Drive URLs.
- Failed uploads are cleaned up into Drive Trash where possible.
- Runtime Google settings survive future deployments via keep_vars; Cloudflare secrets remain outside source.
- The Google-specific schema is drizzle/0002_google_drive.sql; its four tables and two indexes have been applied to production D1.

## Validation
The isolated CI branch checks TypeScript, existing teacher/student workflows, the standalone header boundary, Google signatures/claims, OAuth CSRF and replay, encryption, refresh caching, private file upload/download, byte ranges, logout and failures. Network calls are mocked in automated checks; the final owner consent and a live file upload must still be verified.

## Gmail notifications
The teacher connects Gmail separately from the notification settings, using only openid, email and https://www.googleapis.com/auth/gmail.send. A teacher session is required to start this connection. Its encrypted refresh credential is stored separately from Drive; it cannot replace the working storage connection. The backend never requests inbox read or delete access.

Cloudflare notifications use the authenticated owner's Gmail as sender. Student submissions notify andrej.spilevoj@gmail.com; assignments and teacher replies notify the student's saved email address. Messages contain a task link, not login codes or attachments. Sites/local deployments retain the optional Resend configuration.

Delivery atomically claims a pending/failed message before contacting Gmail. Known rejected requests can be retried up to five attempts. If the connection drops during a send, status becomes unknown and is excluded from automatic retry to avoid duplicate mail. A Worker interruption may similarly leave status sending; inspect Sent before manually requeueing either status. Gmail acceptance does not prove delivery to an external recipient's inbox.

## Live setup status
Cloudflare runtime OAuth credentials are configured, and the owner has authorized both Drive and Gmail. The owner reports successful website/file testing. The two initial queued notifications were accepted by Gmail on 2026-11-14, and the owner's incoming notification was verified in the inbox.

Google Auth Platform is In production rather than Testing, which removes the Testing-only seven-day grant limit for new authorization. To renew Drive explicitly, open /api/google/start?reconnect=1 while using the live origin. To renew Gmail, use notification settings. Google can still revoke or expire authorization under its normal policies. Only the configured owner can obtain a teacher session.

## Website passwords and help points
Teacher-created usernames and passwords are supported for both student cohorts. Username matching is Unicode-normalized and case-insensitive. Student passwords require 8–128 characters; teacher passwords require 12–128. Passwords use salted PBKDF2-SHA256 with the Worker-supported 100,000 iterations and an HMAC pepper from the existing runtime Google client secret. Rotating that secret requires resetting website passwords as well as reconnecting Google. Authentication is throttled by IP and account; credential updates revoke old sessions. Password hashes are never returned to the client.

The authenticated owner initializes a website password from the teacher workspace. No default teacher password is committed or seeded. Subsequent password changes require the current password and revoke existing teacher sessions. Google owner sign-in remains available for the established Google connection. Migration: drizzle/0004_password_logins.sql (nullable username/hash fields; existing sessions and data remain intact). Existing students can be assigned credentials through Edit; legacy codes remain compatible through the API only until a password is set.

Remote accounts use four-point cycles. Each new homework thread contributes one point; a new-topic thread contributes two. Follow-up messages do not create a new thread or consume points. The total is derived from immutable thread kinds; 4/4 is shown at the end of a cycle, then the next point starts 1/4. This is a usage counter, not payment collection or automatic charging.

The home page includes original public descriptions for all 20 videos, imported from the owner's YouTube pages on 2026-11-14. Descriptions are stored with the source and change with the selected video; no API key or request-time scraping is required.
