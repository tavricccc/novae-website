# Costs

Novae can start on free tiers, but pricing and quotas change. Always use current official pricing pages rather than old numbers in documentation.

Estimate monthly active users, daily active users, proposals/comments/support actions, compressed image count and size, image views, Edge requests, Realtime messages and peak connections, Push/Notion sync, and retry overhead.

| Service | Main cost drivers |
| --- | --- |
| Vercel | Builds and frontend transfer |
| Supabase | Database, egress, Edge invocations, Realtime, backups |
| Firebase | Authentication and App Check/reCAPTCHA-related usage |
| Cloudinary | Storage, transformations, and delivery bandwidth/credits |
| Upstash | Redis commands, storage, and transfer |
| Notion | Workspace plan and API constraints |

Keep image compression and limits, retain distributed rate limits, fix permanently failing outbox events, monitor Supabase egress, and create a development stack only when it is actually maintained. Set usage alerts around 50%, 75%, and 90% of each relevant allowance.
