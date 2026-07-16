# Step-by-step troubleshooting

Always start with the first failed stage. Do not reset Firebase, Supabase, and Vercel at the same time.

## Workflow failure

1. Open the run and the first red step.
2. Missing secrets: compare `production` Environment secrets with the [credential worksheet](environment-configuration.md).
3. Link or database push: ensure token, project ref, and password belong to one Supabase project.
4. Generated config diff: validate the JSON against the [actual schema](configuration.md#actual-schema) and commit generated outputs.
5. If upstream contains a fix, use `Sync fork → Update branch`, confirm the new commit, and start a new run instead of rerunning an old commit.
6. Fix the cause and rerun that workflow.

## Cloudflare deployment errors

- `Invalid Function name`: sync the latest workflow. Current deployments automatically use `n<EDGE_FUNCTION_NAMESPACE>-api` and related names so the first character is always a letter.
- `500` / Cloudflare `1101`: inspect `Workers & Pages → novae-api → Logs`. The current workflow redeploys after secret synchronization and retries transient propagation failures.
- `403 origin-denied`: make `ALLOWED_ORIGINS` exactly match the browser's Vercel origin. Include `https://`, remove paths and quotes, and **remove the final `/`**.
- Browser CORS / `net::ERR_FAILED`: this is commonly the same origin mismatch. After editing GitHub production, rerun `Deploy Supabase Backend`.
- `502`: verify that all six random-name Supabase Functions deployed under the same namespace.
- `503 rate-limit-provider-unavailable`: verify writable Upstash REST credentials. The gateway fails closed instead of bypassing limits.

A correct preflight returns `204` and an `Access-Control-Allow-Origin` equal to the Vercel origin. An unauthenticated smoke POST should return `401`.

## Sign-in failure

Check the Google provider, authorized production domain, matching `VITE_ALLOWED_DOMAIN`/`ALLOWED_DOMAIN`, one matching Firebase project, and App Check site-key domain. An administrator who was just added must sign in again. If a blocked popup falls back to redirect and the return shows a recovery timeout or initialization error, reload once, then verify the authorized domain and Web App configuration.

## API or permission failure

- All 401/403 after CORS passes: inspect Firebase token, domain, service account, and fresh sign-in.
- Admin-only 403: inspect `ADMIN_EMAILS` and refresh the session.
- One category missing: compare `readAccess`, status, author, and role; it may be correct privacy behavior.
- 429: inspect Upstash and rate-limit config before increasing limits.

## Wrong support goal or days

1. Inspect the deployed commit's `config/issue-categories.config.json`.
2. Check that category's `support.enabled`, `support.goal`, and `support.deadlineDays`.
3. Confirm both backend and frontend workflows succeeded for that config commit.
4. Runtime config is authoritative; landing mockups and documentation examples are not.

## Images, notifications, and Notion

For images, verify one Cloudinary environment, matching API/webhook secret, webhook logs, file limits, and quotas. For notifications or Notion, inspect the outbox backlog and worker logs, then verify FCM/VAPID/service-account values or Notion database sharing. A multi-source Notion database also requires a `NOTION_DATA_SOURCE_ID` that belongs to the configured database. Avoid unlimited manual retries.

When opening an issue, include commit, time zone, role, category, state, steps, first error, HTTP status, request ID, and checks already completed. Remove all credentials and personal data.
