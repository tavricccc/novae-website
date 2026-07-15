# Credential worksheet

Create these as GitHub `production` Environment secrets. The backend workflow copies runtime values into Supabase Edge secrets. `VITE_*` values are browser-visible; every other credential stays server-side.

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
| `VITE_FIREBASE_APP_CHECK_ENABLED` | `false` initially; `true` after App Check setup |
| `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` | Required when App Check is enabled |
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key, never service role |
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
| `NOTION_TOKEN` | Optional internal integration secret |
| `NOTION_DATABASE_ID` | Optional original database shared with the integration |
| `NOTION_VERSION` | Optional API version; code defaults to `2022-06-28` |
| `UPSTASH_REDIS_REST_URL` | HTTPS REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Writable Standard REST token |

Hosted Edge Functions provide `SUPABASE_URL` automatically; do not create it as a GitHub secret. Local `.env` is only for contributors and is not part of production deployment.

## Final check

- [ ] Every value is an Environment secret in `production`, not a public variable.
- [ ] Firebase, Supabase, and Cloudinary values each come from one matching project/environment.
- [ ] No service role, service account, API secret, password, or token appears in Git.
- [ ] All administrator emails belong to the allowed domain.

`NOTION_TOKEN` and `NOTION_DATABASE_ID` must either both be set or both be omitted. When both are omitted, the workflow writes `NOTION_ENABLED=false` and Edge Functions safely skip Notion synchronization. A partial pair fails deployment with a clear error.
