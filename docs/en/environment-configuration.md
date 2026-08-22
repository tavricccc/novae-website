# Credential worksheet

Put every value below in your GitHub fork's `production` Environment secrets. This is the only secret store a deployer must fill. GitHub Actions automatically injects runtime values into the Vercel frontend and Cloudflare Worker during deployment. `NEXT_PUBLIC_*` values are browser-visible; every other credential stays strictly server-side.

## Visibility and Scope

- `NEXT_PUBLIC_*` values are compiled into the client-side JavaScript bundle and are publicly visible.
- Database passwords, service-account JSON, API secrets, tokens, and random signing keys stay only in GitHub Environment secrets.
- `NEXT_PUBLIC_API_BASE_URL` is automatically mapped from `CLOUDFLARE_WORKER_URL` by the deployment workflow.
- Local `.env` is only for local debugging by contributors.

## Frontend and Vercel

| Secret | Required | Source |
| --- | --- | --- |
| `NEXT_PUBLIC_SCHOOL_NAME` | Recommended | School or organization display name (e.g., `National Yang Ming Chiao Tung University`) |
| `NEXT_PUBLIC_ALLOWED_DOMAIN` | Yes | Allowed Google email domain without `@` (e.g., `nycu.edu.tw`) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase Web App `apiKey` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Web App `authDomain` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase Web App `projectId` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase Web App `appId` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase Web App `messagingSenderId` |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Yes | FCM Web Push public key (VAPID) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes | Same Firebase/GCP project **Web** OAuth 2.0 Client ID (`….apps.googleusercontent.com`) |
| `NEXT_PUBLIC_FIREBASE_APP_CHECK_ENABLED` | Yes | `true` in deployed environments |
| `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY` | Yes | Google Cloud reCAPTCHA Enterprise Site Key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes | Cloudflare Turnstile Site Key (or `TURNSTILE_SITE_KEY`) |
| `CLOUDFLARE_WORKER_URL` | Yes | Stable API root such as `https://novae-api.school.workers.dev` (no trailing slash) |
| `VERCEL_TOKEN` | Yes | Vercel account deployment token |
| `VERCEL_ORG_ID` | Yes | Vercel team/account ID |
| `VERCEL_PROJECT_ID` | Yes | Vercel project ID |

## Backend and Deployment

| Secret | Required | Source |
| --- | --- | --- |
| `ADMIN_EMAILS` | Yes | Platform administrator emails separated by ASCII commas |
| `ALLOWED_DOMAIN` | Yes | Exactly the same as `NEXT_PUBLIC_ALLOWED_DOMAIN` |
| `ALLOWED_ORIGINS` | Yes | Exact frontend origin (e.g., `https://school-novae.vercel.app`; **never add a trailing slash**) |
| `CLOUDFLARE_ACCOUNT_ID` | Yes | 32-character Cloudflare Account ID |
| `CLOUDFLARE_API_TOKEN` | Yes | Account-scoped token with Workers, Hyperdrive, and Queues edit permissions |
| `CLOUDFLARE_HYPERDRIVE_ID` | Yes | 32-character hexadecimal Cloudflare Hyperdrive ID |
| `CLOUDFLARE_WORKER_URL` | Yes | Public Worker API root URL |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary product environment cloud name |
| `CLOUDINARY_API_KEY` | Yes | Same environment API key |
| `CLOUDINARY_API_SECRET` | Yes | Same environment API secret (Webhook signature verification uses this secret directly) |
| `FIREBASE_PROJECT_ID` | Yes | Same as `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| `FIREBASE_PROJECT_NUMBER` | Yes | Same as `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| `FIREBASE_APP_IDS` | Yes | Same as `NEXT_PUBLIC_FIREBASE_APP_ID` |
| `FIREBASE_WEB_API_KEY` | Yes | Same as `NEXT_PUBLIC_FIREBASE_API_KEY`, used for backend validation and smoke tests |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Yes | Entire Firebase service-account JSON content (not a path) |
| `NEON_DATABASE_URL` | Yes | Full PostgreSQL connection string for the Neon project |
| `NEON_RUNTIME_PASSWORD` | Yes | High-entropy random password to configure the least-privilege `novae_runtime` role |
| `HEALTHCHECK_SECRET` | Yes | Independent 32-byte base64 secret for smoke testing |
| `MEDIA_SIGNING_SECRET` | Yes | Independent 32-byte base64 secret for Media Gateway HMAC tokens |
| `REALTIME_TICKET_SECRET` | Yes | Independent 32-byte base64 secret for WebSocket ticket signing |
| `TURNSTILE_SECRET_KEY` | Yes | Cloudflare Turnstile secret key |
| `BACKUP_AGE_RECIPIENT` | Yes (Var) | `age` public key (`age1...`) for encrypting daily database backups (put in GitHub Variables or Secrets) |
| `NOTION_TOKEN` | Optional | Internal integration secret |
| `NOTION_DATABASE_ID` | Optional | Dedicated database ID shared with the integration |
| `NOTION_DATA_SOURCE_ID` | Conditional | Data source ID when using multiple sources |

## Optional Custom Service Names (GitHub Variables)

If you wish to customize Cloudflare service names, set them in GitHub `production` Environment Variables (or Repository Variables):

| Variable | Default | Description |
| --- | --- | --- |
| `CLOUDFLARE_WORKER_NAME` | `novae-api` | Custom Cloudflare Worker name |
| `CLOUDFLARE_QUEUE_NAME` | `novae-jobs` | Custom Cloudflare Queue name |

## ALLOWED_ORIGINS: Exact Format

```text
ALLOWED_ORIGINS=https://your-production-domain.vercel.app
```

> **The final character must not be `/`.**

| Result | Value |
| --- | --- |
| Valid | `https://your-production-domain.vercel.app` |
| Invalid: Missing scheme | `your-production-domain.vercel.app` |
| Invalid: Trailing slash | `https://your-production-domain.vercel.app/` |
| Invalid: Path included | `https://your-production-domain.vercel.app/issues` |
| Invalid: Overly permissive | `*` |

Multiple origins are separated by ASCII commas: `https://app.school.edu.tw,https://school-novae.vercel.app`.

## Generate Independent Random Backend Secrets

Run the following in PowerShell to generate the four required high-entropy secrets:

```powershell
function New-RandomSecret {
    $bytes = New-Object byte[] 32
    [Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    [Convert]::ToBase64String($bytes)
}

Write-Host "NEON_RUNTIME_PASSWORD  = $(New-RandomSecret)"
Write-Host "HEALTHCHECK_SECRET     = $(New-RandomSecret)"
Write-Host "MEDIA_SIGNING_SECRET   = $(New-RandomSecret)"
Write-Host "REALTIME_TICKET_SECRET = $(New-RandomSecret)"
```

## Checklist

- [ ] All values are Environment secrets in `production`, not public variables.
- [ ] Secrets are in the fork repository that actually runs Actions.
- [ ] No secret values contain leading/trailing whitespaces or typo names.
- [ ] `GOOGLE_SERVICE_ACCOUNT_JSON` is full JSON text.
- [ ] All administrator emails belong to the allowed domain.
- [ ] `CLOUDFLARE_WORKER_URL` and `ALLOWED_ORIGINS` include `https://` and have no trailing slash.
- [ ] `NEON_DATABASE_URL` and `NEON_RUNTIME_PASSWORD` are configured.
- [ ] `CLOUDFLARE_HYPERDRIVE_ID`, `TURNSTILE_SECRET_KEY`, and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` are set.
- [ ] `BACKUP_AGE_RECIPIENT` is configured with an `age1...` public key for automated encrypted backups.

Next: [Categories and product rules](configuration.md).
