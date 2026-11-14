# Standalone Cloudflare deployment status

Work is isolated on `cloudflare-backend`; GitHub Pages and the default branch are unchanged.

## Provisioned
- Cloudflare account: a018d05a961f4c8e0293cd139ec781eb
- EU D1 database: matematika-be-streso-db
- Database ID: 9678cab8-96b3-463b-9bc2-0ac8f89884dc
- All eight application tables and two indexes are initialized; the tasks.kind migration is included.
- No students, login codes, assignments, or other sample data were added.

## Build settings
- Repository: AndrejSpilevoj/HappyEverAfter
- Branch: cloudflare-backend (do not point this deployment at main)
- Root: matematika-be-streso/source/full-app
- Node: 22
- Build: npx vite build && node scripts/prepare-cloudflare.mjs
- Deploy: npx wrangler deploy --config dist/server/wrangler.json
- Worker name: matematika-be-streso

The preparation script overwrites starter database placeholders with the provisioned EU D1 database. It deliberately omits R2 until account activation and sets DEPLOYMENT_TARGET=cloudflare. The Worker then strips externally supplied Sites identity headers, preserves student session cookies, and returns 503 on unsupported Sites teacher sign-in routes.

## Required before launch
1. Approve deployment authorization. Cloudflare's repository deployment form currently offers only creation of a user API token. Its displayed scope includes editing Workers, KV, R2, D1, Vectorize, Queues, Basin Pipelines, Containers, Cloudchamber, AI Search and Workers Routes for all account zones, plus account/user metadata and Connectivity Directory read/bind. This token has NOT been created.
2. Activate R2 billing explicitly in the account. The displayed subscription is $0 now with monthly free allowances and usage charges beyond them; it automatically renews. This subscription has NOT been activated. Then create a private bucket, add its BUCKET binding to the deployment preparation script, and keep public access disabled.
3. Implement and verify standalone teacher authentication. Sites headers cannot be trusted on a directly exposed Worker. Teacher sign-in is intentionally unavailable until this is done. Do not remove the header-stripping boundary to make sign-in appear to work.
4. Configure Resend credentials and a verified EMAIL_FROM if email notifications are required. No secrets are committed.
5. Deploy the verified branch, check anonymous/teacher/student behavior and private attachments, then connect the public site's private-area links. Do not move or delete the GitHub Pages files.

## Verification
The isolated GitHub Actions workflow checks TypeScript, the existing real API tests, the standalone header boundary, production compilation and Wrangler dry-run packaging. It never deploys and has read-only repository permissions.

No success email should be sent until a live deployment and the complete private workflow are verified.
