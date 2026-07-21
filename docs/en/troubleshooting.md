# Step-by-step troubleshooting

Always start with the first failed stage. Do not reset Firebase, Supabase, and Vercel at the same time.

## Workflow failure

1. Open the run and the first red step.
2. Missing secrets: compare `production` Environment secrets with the [credential worksheet](environment-configuration.md).
3. Link or database push: ensure token, project ref, and password belong to one Supabase project.
4. Generated config diff: inspect only API error, rate-limit, and retention sources that still use codegen; categories no longer do.
5. If upstream contains a fix, use `Sync fork → Update branch`, confirm the new commit, and start a new run instead of rerunning an old commit.
6. Fix the cause and rerun that workflow.

## Cloudflare deployment errors

- `Invalid Function name`: sync the latest workflow. Current deployments automatically use `n<EDGE_FUNCTION_NAMESPACE>-api` and related names so the first character is always a letter.
- `500` / Cloudflare `1101`: inspect `Workers & Pages → novae-api → Logs`. The current workflow redeploys after secret synchronization and retries transient propagation failures.
- `403 origin-denied`: make `ALLOWED_ORIGINS` exactly match the browser's Vercel origin. Include `https://`, remove paths and quotes, and **remove the final `/`**.
- Browser CORS / `net::ERR_FAILED`: this is commonly the same origin mismatch. After editing GitHub production, rerun `Deploy Supabase Backend`.
- `502`: verify that all six random-name Supabase Functions deployed under the same namespace.
- `503 rate-limit-provider-unavailable`: verify the writable Upstash REST credentials used by Supabase. Precise business quotas fail closed; native Cloudflare burst protection remains independent.

A correct preflight returns `204` and an `Access-Control-Allow-Origin` equal to the Vercel origin. An unauthenticated smoke POST should return `401`.

## Sign-in failure

Check the Google provider, authorized production domain, matching `VITE_ALLOWED_DOMAIN`/`ALLOWED_DOMAIN`, one matching Firebase project, and App Check site-key domain. An administrator who was just added must sign in again. If a blocked popup falls back to redirect and the return shows a recovery timeout or initialization error, reload once, then verify the authorized domain and Web App configuration.

## API or permission failure

- All 401/403 after CORS passes: inspect Firebase token, domain, service account, and fresh sign-in.
- Admin-only 403: inspect `ADMIN_EMAILS` and refresh the session.
- One category missing: compare `readAccess`, status, author, and role; it may be correct privacy behavior.
- 429: inspect the response code. For rapid bursts, review native bindings in `cloudflare/wrangler.toml`; for accumulated business quotas, review Upstash and `rate-limits.config.json`.

API error bodies are machine-readable: `error.code` is the stable contract value, `error.requestId` indexes logs, and a 429 also provides `error.retryAfterSeconds`. Backend responses do not contain localized explanations or complete provider errors; the frontend renders the code through its locale catalog. Report the code, request ID, and occurrence time instead of exposing raw exceptions to the browser.

If an installed PWA still shows an old version, keep it open long enough for the new Service Worker to take control. The app reloads through a versioned URL and caps retries automatically. Manually reload once only after the update watchdog reports failure; do not start by clearing site data, content caches, or databases.

Guided setup first confirms the browser or operating system's first preferred language, then the platform feature switches, and finally categories for enabled features only. If completion briefly fails and retry says setup is already complete, the first request may have committed before its response was interrupted; the current client refreshes platform state and continues. If it remains on Setup, verify that every enabled feature has at least one category, the latest migration is applied, and capture the request ID.

## Wrong support goal or days

1. Inspect the category in **System settings → Categories and workflows**.
2. Check when the proposal was created. Existing proposals keep their creation-time snapshot and do not follow later category edits.
3. Postgres runtime categories and proposal snapshots are authoritative; landing mockups and documentation examples are not.

## Images, notifications, and Notion

For images, verify one Cloudinary environment, matching API/webhook secret, webhook logs, file limits, and quotas. For notifications or Notion, inspect the outbox backlog and worker logs, then verify FCM/VAPID/service-account values or Notion database sharing. A multi-source Notion database also requires a `NOTION_DATA_SOURCE_ID` that belongs to the configured database. Avoid unlimited manual retries.

When opening an issue, include commit, time zone, role, category, state, steps, first error, HTTP status, request ID, and checks already completed. Remove all credentials and personal data.
