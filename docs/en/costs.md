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

Keep browser image compression and the controlled Cloudinary upload preset so format, size, and dimensions are rejected before further provider work. Retain layered ingress, action, and worker limits so invalid traffic stops before Firebase, Cloudinary, Notion, FCM, or expensive database work.

Keep the short-lived Firebase user cache and frontend content cache instead of forcing every navigation to refetch. Private Broadcast invalidation avoids private-table subscriptions and periodic polling, while the 10-device Push cap bounds FCM fan-out. Fix permanently failing outbox events, monitor Supabase egress, and create a development stack only when it is actually maintained.

These controls reduce repeated provider calls, Edge execution time, and notification fan-out, but they are not a global budget circuit breaker. Set usage alerts around 50%, 75%, and 90% of each relevant allowance and review bills regularly.
