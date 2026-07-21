# Credential worksheet

Put every value below in the deploying fork's GitHub `production` Environment secrets. This is the only secret store a deployer must fill. GitHub Actions automatically synchronizes runtime values to Cloudflare and Supabase; do not duplicate them manually in vendor dashboards. `VITE_*` values are browser-visible; every other credential stays server-side.

## Frontend and Vercel

| Secret | Source |
| --- | --- |
| `VITE_SCHOOL_NAME` | School display name; recommended |
| `VITE_ALLOWED_DOMAIN` | Email domain without `@` |
| `VITE_FIREBASE_API_KEY` | Firebase Web App `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase `projectId` |
| `VITE_FIREBASE_APP_ID` | Firebase `appId` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase `messagingSenderId` |
| `VITE_FIREBASE_VAPID_KEY` | FCM Web Push public VAPID key |
| `VITE_GOOGLE_CLIENT_ID` | Same Firebase/GCP project **Web** OAuth 2.0 Client ID (`….apps.googleusercontent.com`); browser-visible; used by Google Identity Services sign-in |
| `VITE_FIREBASE_APP_CHECK_ENABLED` | `false` initially; `true` after App Check setup |
| `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` | Required when App Check is enabled |
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key, never service role |
| `CLOUDFLARE_WORKER_URL` | Stable API root such as `https://novae-api.school.workers.dev`; no trailing slash |
| `VERCEL_TOKEN` | Vercel account token |
| `VERCEL_ORG_ID` | Vercel team/account ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

## Backend and deployment

| Secret | Source |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Supabase account access token |
| `SUPABASE_PROJECT_REF` | Project reference ID |
| `SUPABASE_DB_PASSWORD` | Project database password |
| `SUPABASE_SERVICE_ROLE_KEY` | Legacy `service_role` key |
| `FIREBASE_PROJECT_ID` | Same as `VITE_FIREBASE_PROJECT_ID` |
| `FIREBASE_WEB_API_KEY` | Same as `VITE_FIREBASE_API_KEY` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Entire Firebase service-account JSON, not a file path |
| `ALLOWED_DOMAIN` | Exactly the same as `VITE_ALLOWED_DOMAIN` |
| `ADMIN_EMAILS` | Full emails separated by ASCII commas |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary product environment |
| `CLOUDINARY_API_KEY` | Same environment API key |
| `CLOUDINARY_API_SECRET` | Same environment API secret |
| `CLOUDINARY_WEBHOOK_SECRET` | Same API secret for the standard HMAC flow |
| `WEBHOOK_SECRET` | Independently generated random 32-byte value |
| `CLOUDFLARE_ACCOUNT_ID` | 32-character Cloudflare Account ID, not zone ID |
| `CLOUDFLARE_API_TOKEN` | Account-scoped token with Workers deployment permission |
| `ALLOWED_ORIGINS` | Exact frontend origin such as `https://school-novae.vercel.app`; **never add a trailing slash** |
| `EDGE_FUNCTION_NAMESPACE` | Private 16–48 character lowercase alphanumeric random value |
| `EDGE_ORIGIN_SECRET` | Independent high-entropy secret for Worker/internal Edge calls |
| `NOTION_TOKEN` | Optional internal integration secret |
| `NOTION_DATABASE_ID` | Optional original database shared with the integration |
| `NOTION_DATA_SOURCE_ID` | Required for a multi-source database; auto-discovered when only one source exists |
| `UPSTASH_REDIS_REST_URL` | Upstash HTTPS REST URL used only by Supabase, never synchronized to the Cloudflare Worker |
| `UPSTASH_REDIS_REST_TOKEN` | Writable Standard REST token used only by Supabase |

Hosted Edge Functions provide `SUPABASE_URL` automatically; do not create it as a GitHub secret. `VITE_API_BASE_URL` is also not a separate GitHub secret: the frontend workflow uses `CLOUDFLARE_WORKER_URL`. Local `.env` is only for contributors.

## ALLOWED_ORIGINS: exact format

```text
https://your-production-domain.vercel.app
```

> **The final character must not be `/`.**

Include `https://`, omit paths and quotes, and never use `*`. Multiple origins use ASCII commas. The value must exactly match the browser's `from origin 'https://…'` message. After changing it, rerun `Deploy Supabase Backend`; editing GitHub alone does not update the running Worker.

## Generate independent private values

```powershell
$webhookBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($webhookBytes)
$webhookSecret = [Convert]::ToBase64String($webhookBytes)

$namespaceBytes = New-Object byte[] 18
[Security.Cryptography.RandomNumberGenerator]::Fill($namespaceBytes)
$edgeFunctionNamespace = ([Convert]::ToHexString($namespaceBytes)).ToLower()

$originBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($originBytes)
$edgeOriginSecret = [Convert]::ToBase64String($originBytes)
```

Use these for `WEBHOOK_SECRET`, `EDGE_FUNCTION_NAMESPACE`, and `EDGE_ORIGIN_SECRET`. Never reuse provider tokens or reuse one value for multiple roles.

## Final check

- [ ] Every value is an Environment secret in `production`, not a public variable.
- [ ] The secrets are in the fork that actually runs Actions, not only in upstream or another GitHub account.
- [ ] Firebase, Supabase, and Cloudinary values each come from one matching project/environment.
- [ ] No service role, service account, API secret, password, or token appears in Git.
- [ ] All administrator emails belong to the allowed domain.
- [ ] Worker URL and allowed origins include `https://` and have no trailing slash.
- [ ] `ALLOWED_ORIGINS` contains the frontend Vercel origin, not the Worker URL.

`NOTION_TOKEN` and `NOTION_DATABASE_ID` must either both be set or both be omitted. When both are omitted, the workflow writes `NOTION_ENABLED=false` and Edge Functions safely skip Notion synchronization. A partial pair fails deployment with a clear error. `NOTION_DATA_SOURCE_ID` may only accompany that pair and is checked against the configured database. The API is pinned to `2026-03-11`; there is no `NOTION_VERSION` secret.
