# Google Drive uploads and teacher sign-in

The standalone Cloudflare app uses the owner's Google account for private Drive uploads and teacher sign-in. Student codes remain unchanged; students do not need Google accounts.

## Configuration
- Google Cloud project: matematika-be-streso (640040081927).
- Drive API: verified enabled.
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

## Current setup gate
Google Auth Platform branding is filled in and paused before accepting the Google API Services User Data Policy. No OAuth client or runtime Google credentials have been created. Uploads are not connected until owner authorization is complete.
