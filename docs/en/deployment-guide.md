# Final release and acceptance

Use this page only after all seven service setups, production secrets, and category policy are complete. It does not create services; it performs the final checks, releases backend and frontend in order, and verifies production. You do not need to run Novae locally first.

## Prerequisites

- [ ] [Preparation and service setup](quick-start.md) is complete for GitHub, Firebase, Supabase, Cloudinary, Upstash, and Vercel; optional Notion is ready when needed.
- [ ] Every required value from the [credential worksheet](environment-configuration.md) is in GitHub `production` Environment secrets.
- [ ] The [category builder](../../category-builder.html) output replaced `config/issue-categories.config.json` and was committed and pushed to the fork's `main` branch.
- [ ] The campus domain and initial administrator emails are final.

If any item is incomplete, return to that page instead of running a deployment workflow early.

## 1. Verify production secrets

Open `Settings → Environments → production` in the GitHub fork and compare every entry with the [credential worksheet](environment-configuration.md). Use Environment secrets, not repository Variables, and remove accidental whitespace.

These pairs must match:

- `VITE_ALLOWED_DOMAIN` = `ALLOWED_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID` = `FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_API_KEY` = `FIREBASE_WEB_API_KEY`
- Standard Cloudinary HMAC flow: `CLOUDINARY_WEBHOOK_SECRET` = `CLOUDINARY_API_SECRET`

Notion secrets are not required when Notion is disabled; the workflow releases with that optional integration turned off.

## 2. Release the Supabase backend

In GitHub `Actions`, choose `Deploy Supabase Backend` and run it for `main`. Wait for generated configuration, Edge type and architecture checks, project linking, migration push, Edge secret setup, Function deployment, healthcheck, and maintenance cleanup to succeed.

Stop at the first failed step. Do not run the frontend yet; use [step-by-step troubleshooting](troubleshooting.md), fix the cause, and rerun the backend workflow.

## 3. Release the Vercel frontend

Only after backend success, run `Deploy Frontend to Vercel`. The workflow validates secrets, reads the Vercel project settings, builds `.vercel/output`, and publishes a prebuilt deployment.

Later pushes to `main` trigger the relevant workflow automatically. When the same commit changes backend or configuration, frontend release waits for backend success.

## 4. Add the production domain

After the deployment URL opens successfully, connect the production domain in Vercel and add it to Firebase Authentication authorized domains. When App Check is enabled, allow the domain in the reCAPTCHA Enterprise site key as well.

## 5. Production acceptance test

- [ ] Allowed-domain Google sign-in works; another domain is rejected.
- [ ] An administrator can see the Dashboard and moderation actions after signing in again.
- [ ] Public, reviewed, and private categories have the correct visibility.
- [ ] Support goal and days match `issue-categories.config.json`.
- [ ] Images survive reload and remain permission controlled.
- [ ] Review, status updates, announcements, notifications, and Web Push work.
- [ ] If Notion is enabled, its operations copy is created; otherwise the app works normally without treating Notion as a failure.

Announce the site only after acceptance passes. Then follow [post-launch operations](operations.md); use [step-by-step troubleshooting](troubleshooting.md) when something fails.
