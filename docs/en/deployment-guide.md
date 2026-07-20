# Final release and acceptance

Use this page after all eight service setups and production secrets are complete. The first administrator configures categories in the app after deployment.

## Prerequisites

- [ ] GitHub, Firebase, Supabase, Cloudinary, Upstash, Cloudflare, and Vercel are ready; optional Notion is ready when needed.
- [ ] Every required value from the [credential worksheet](environment-configuration.md) is in GitHub `production` Environment secrets.
- [ ] The campus domain and first administrator in `ADMIN_EMAILS` are final.
- [ ] Proposal and facility-report rules are ready to enter during guided first sign-in.

If any item is incomplete, return to that page instead of running a deployment workflow early.

## 1. Verify production secrets

Open `Settings → Environments → production` in the GitHub fork and compare every entry with the [credential worksheet](environment-configuration.md). Use Environment secrets, not repository Variables, and remove accidental whitespace.

These pairs must match:

- `VITE_ALLOWED_DOMAIN` = `ALLOWED_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID` = `FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_API_KEY` = `FIREBASE_WEB_API_KEY`
- Standard Cloudinary HMAC flow: `CLOUDINARY_WEBHOOK_SECRET` = `CLOUDINARY_API_SECRET`
- Worker URL and allowed origins include `https://` and have no trailing slash.
- `ALLOWED_ORIGINS` is the Vercel frontend origin, not the Worker URL.

Notion secrets are not required when Notion is disabled; the workflow releases with that optional integration turned off.

## 2. Release the Supabase backend

In GitHub `Actions`, choose `Deploy Supabase Backend` and run it for `main`. It deploys random-name Supabase Functions, the stable Cloudflare Worker, synchronizes secrets automatically, runs a Worker smoke test, then completes origin health and maintenance checks.

Stop at the first failed step. Do not run the frontend yet; use [step-by-step troubleshooting](troubleshooting.md), fix the cause, and rerun the backend workflow.

## 3. Release the Vercel frontend

Only after backend success, run `Deploy Frontend to Vercel`. It uses `CLOUDFLARE_WORKER_URL` as the frontend API root and removes legacy fixed Supabase Function entries after successful cutover.

Later pushes to `main` trigger the relevant workflow automatically. When the same commit changes backend or configuration, frontend release waits for backend success.

## 4. Add the production domain

After the deployment URL opens successfully, connect the production domain in Vercel and add it to Firebase Authentication authorized domains. When App Check is enabled, allow the domain in the reCAPTCHA Enterprise site key as well.

## 5. Production acceptance test

- [ ] Allowed-domain Google sign-in works; another domain is rejected.
- [ ] Browser API requests go to Cloudflare Worker, not directly to a Supabase Function.
- [ ] CORS preflight returns `204` with the exact Vercel origin.
- [ ] An administrator can see the Dashboard and moderation actions after signing in again.
- [ ] The first platform administrator in `ADMIN_EMAILS` confirms language, then completes proposal and facility category setup; retrying completion does not duplicate setup.
- [ ] Public, reviewed, and private categories have the correct visibility.
- [ ] Support goal and days match in-app category settings, while older proposals retain their creation-time snapshot.
- [ ] Proposal and facility boards both browse and create within dynamic categories; scoped managers can comment, update status, and delete.
- [ ] New proposals notify only proposal-category managers, new reports notify only facility-category managers whose setting is enabled, and an unassigned platform administrator receives neither.
- [ ] Images survive reload and remain permission controlled.
- [ ] Review, status updates, announcements, notifications, and Web Push work.
- [ ] If Notion is enabled, its operations copy is created; otherwise the app works normally without treating Notion as a failure.

Announce the site only after acceptance passes. Then follow [post-launch operations](operations.md); use [step-by-step troubleshooting](troubleshooting.md) when something fails.
