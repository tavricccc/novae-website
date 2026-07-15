# Step-by-step troubleshooting

Always start with the first failed stage. Do not reset Firebase, Supabase, and Vercel at the same time.

## Workflow failure

1. Open the run and the first red step.
2. Missing secrets: compare `production` Environment secrets with the [credential worksheet](environment-configuration.md).
3. Link or database push: ensure token, project ref, and password belong to one Supabase project.
4. Generated config diff: validate the JSON against the [actual schema](configuration.md#actual-schema) and commit generated outputs.
5. Fix the cause and rerun that workflow.

## Sign-in failure

Check the Google provider, authorized production domain, matching `VITE_ALLOWED_DOMAIN`/`ALLOWED_DOMAIN`, one matching Firebase project, and App Check site-key domain. An administrator who was just added must sign in again.

## API or permission failure

- All 401/403: inspect Firebase token, domain, service account, and fresh sign-in.
- Admin-only 403: inspect `ADMIN_EMAILS` and refresh the session.
- One category missing: compare `readAccess`, status, author, and role; it may be correct privacy behavior.
- 429: inspect Upstash and rate-limit config before increasing limits.

## Wrong support goal or days

1. Inspect the deployed commit's `config/issue-categories.config.json`.
2. Check that category's `support.enabled`, `support.goal`, and `support.deadlineDays`.
3. Confirm both backend and frontend workflows succeeded for that config commit.
4. Runtime config is authoritative; landing mockups and documentation examples are not.

## Images, notifications, and Notion

For images, verify one Cloudinary environment, matching API/webhook secret, webhook logs, file limits, and quotas. For notifications or Notion, inspect the outbox backlog and worker logs, then verify FCM/VAPID/service-account values or Notion database sharing. Avoid unlimited manual retries.

When opening an issue, include commit, time zone, role, category, state, steps, first error, HTTP status, request ID, and checks already completed. Remove all credentials and personal data.
