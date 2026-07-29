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
| Weekly | Pending/deletion images, Notion reservations, Push-delivery retries, Redis and database usage |
| Monthly | Vendor billing, tokens, backups, and restore exercise |
| Each term | Domain, admins, categories, support goals/days, response deadlines, privacy notice |

## Incident method

1. Scope affected users, categories, states, and operations.
2. Find the first failing boundary: browser, Cloudflare Worker, Firebase, Edge, Postgres, Cloudinary, Notion, Upstash, or Vercel.
3. Preserve time, request ID, HTTP status, first error, and workflow run.
4. Reduce impact without disabling authentication or RLS.
5. Fix one layer, rerun the full workflow, and record prevention.

Supabase is the source of truth; Notion is only an operations copy. Images live in Cloudinary with database references and state. Never edit deployed migrations or manually delete one side of a cross-service record. Retention cleanup queues deletion markers for mapped Notion pages without sending ordinary user deletion notifications; verify completion in maintenance details and the outbox.

A transient Push failure should retain its payload, increment attempts, and schedule a later run; a successful delivery is `sent` with its payload cleared. Do not manually mark a failed row sent—trace the `error_trace_id` through FCM and worker logs. A Notion mapping may briefly contain `pending:<uuid>` while reserved. Let the worker retry and reclaim stale reservations through the stable `Novae ID`; do not create a replacement page manually.

Before changing categories, inspect existing proposals, facility reports, and assignments in **System settings → Categories and workflows**. Feature switches plus proposal/facility category creations, edits, and deletions save in one transaction, so confirm which features should stay enabled and that every enabled feature still has usable categories. A reported failure must leave the whole draft unapplied; refresh before retrying. Afterward, create several records per category and verify category-filtered lists, comments, status, and deletion. Confirm new proposals notify only assigned proposal-category managers, new facility reports notify only assigned managers whose setting is enabled, and an unassigned platform administrator receives neither. The category-first access page must also list current managers and support multi-manager assignment, notification edits, and revocation by name, email, or UID.

For symptoms, use [step-by-step troubleshooting](troubleshooting.md).
