# 7. Create Vercel

This page only creates the frontend hosting project and collects three Vercel values. Do not add every secret or release the app yet; credentials are handled together in the next stage.

## 1. Import the Novae fork

Sign in to [Vercel](https://vercel.com/), choose `Add New → Project`, import the Novae GitHub fork created in step 1, and create the project.

The repository's `vercel.json` disables Git-based automatic deployment. GitHub Actions owns production release so Vercel and Actions do not deploy the same commit twice.

## 2. Create a Vercel token

Create a deployment token in Vercel Account Settings and store it as `VERCEL_TOKEN`. Limit its owner and lifetime, and rotate it during ownership changes.

## 3. Record organization and project IDs

Find these values in project settings or after linking with the Vercel CLI:

| Vercel value | GitHub secret used later |
| --- | --- |
| Account or team ID | `VERCEL_ORG_ID` |
| Project ID | `VERCEL_PROJECT_ID` |

Keep all three values in a password manager or protected worksheet. Never commit them to the repository.

## Completion check

- [ ] Vercel imported the correct Novae fork.
- [ ] The project exists and `vercel.json` disables Git-based automatic deployment.
- [ ] `VERCEL_TOKEN` is stored safely.
- [ ] `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are stored safely.
- [ ] No release was attempted before the remaining secrets were ready.

All seven service setups are now complete. Next, use the [credential worksheet](../environment-configuration.md) to verify and add GitHub `production` Environment secrets in one place.
