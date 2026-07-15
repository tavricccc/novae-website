# Post-launch operations

## After every release

1. Confirm backend success before frontend success.
2. Sign in on the production URL.
3. Read proposal, announcement, notification, and settings pages.
4. Create a test proposal and verify images, support, comments, and feedback.
5. Complete one admin review or status update.
6. Check Dashboard and Supabase Function logs for new errors.

## Routine cadence

| Frequency | Review |
| --- | --- |
| Daily | Pending review, awaiting response, Dashboard errors, outbox backlog, Function failures |
| Weekly | Pending/deletion images, Notion/FCM failures, Redis and database usage |
| Monthly | Vendor billing, tokens, backups, and restore exercise |
| Each term | Domain, admins, categories, support goals/days, response deadlines, privacy notice |

## Incident method

1. Scope affected users, categories, states, and operations.
2. Find the first failing boundary: browser, Firebase, Edge, Postgres, Cloudinary, Notion, Upstash, or Vercel.
3. Preserve time, request ID, HTTP status, first error, and workflow run.
4. Reduce impact without disabling authentication or RLS.
5. Fix one layer, rerun the full workflow, and record prevention.

Supabase is the source of truth; Notion is only an operations copy. Images live in Cloudinary with database references and state. Never edit deployed migrations or manually delete one side of a cross-service record.

For symptoms, use [step-by-step troubleshooting](troubleshooting.md).
