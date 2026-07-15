# 5. Optional: create the Notion operations copy

This entire service is optional. Supabase remains the source of truth, and omitting Notion does not disable any core Novae workflow.

## Skip Notion

Do not create `NOTION_TOKEN`, `NOTION_DATABASE_ID`, or `NOTION_VERSION` in GitHub. The workflow sets `NOTION_ENABLED=false`, and the Edge Functions safely skip every Notion operation.

## Enable Notion

1. Create an internal integration at [Notion integrations](https://www.notion.so/my-integrations) and store its secret as `NOTION_TOKEN`.
2. Create a dedicated full-page database for Novae operations.
3. Share the original database with the integration; a token alone cannot access it.
4. Copy the original database ID from its URL into `NOTION_DATABASE_ID`.
5. `NOTION_VERSION` is optional; the workflow defaults to `2022-06-28`.

Supabase remains the source of truth. Notion is an operations copy, not an authorization database or backup replacement.

`NOTION_TOKEN` and `NOTION_DATABASE_ID` must be supplied together. A partial pair is rejected during deployment.

Next: [create Upstash](upstash.md).
