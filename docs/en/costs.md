# Costs

Novae can start on free tiers, but pricing and quotas change. Always use current official pricing pages rather than old numbers in documentation.

Estimate monthly active users, daily active users, proposals/comments/support actions, compressed image count and size, image views, Edge requests, Realtime messages and peak connections, Push/Notion sync, and retry overhead.

| Service | Main cost drivers |
| --- | --- |
| Vercel | Builds and frontend transfer |
| Cloudflare | Worker requests, CPU time, and observability |
| Supabase | Database, egress, Edge invocations, Realtime, backups |
| Firebase | Authentication and App Check/reCAPTCHA-related usage |
| Cloudinary | Storage, transformations, and delivery bandwidth/credits |
| Upstash | Redis commands, storage, and transfer |
| Notion | Workspace plan and API constraints |

## Local database capacity benchmark

On 2026-07-18, a fresh local Supabase instance in WSL applied every migration and generated one school year of data. Edge Functions and remote Firebase, FCM, Cloudinary, and Notion APIs remained disabled.

| Item | 500 users | 1,000 users |
| --- | ---: | ---: |
| Proposals / announcements / facilities | 375 / 500 / 250 | 750 / 500 / 500 |
| Proposal / announcement comments | 45,000 / 60,000 | 90,000 / 60,000 |
| Supports / announcement likes / affected users | 935 / 30,000 / 750 | 3,750 / 60,000 / 2,500 |
| FCM tokens / image metadata / Notion mappings | 450 / 513 / 1,125 | 900 / 775 / 1,750 |
| 7-day notifications / 1-day outbox / 24-hour idempotency rows | 1,482 / 291 / 377 | 2,224 / 416 / 596 |

Model: proposals are `ceil(users × 75%)`, facilities are `ceil(users × 50%)`, and announcements are fixed at 500. Every proposal and announcement has `20 × (1 + 5) = 120` comments. Titles, bodies, and comments use 75% of their limits (23 / 750 / 53 characters); 50% of proposals and announcements and 30% of facilities include an image URL. Supports, announcement likes, and affected-user rows use `max(5, ceil(users × 1%))`, `ceil(users × 12%)`, and `max(3, ceil(users × 0.5%))` respectively.

| Result | 500 users | 1,000 users |
| --- | ---: | ---: |
| Live database after `VACUUM FULL` | 87 MB | 125 MB |
| Physical snapshot after normal `VACUUM` | 212 MB | 164 MB |
| Planning value (live data × 1.5) | **131 MB** | **187 MB** |

The physical snapshot depends on autovacuum timing and may not increase monotonically. Planning therefore uses reproducible live data plus 50%. Firebase accounts, Cloudinary image binaries, Notion page bodies, WAL, backups, and PITR are outside this database-size result.

Keep browser image compression and the controlled Cloudinary upload preset. Native Cloudflare burst limits stop abusive traffic before Supabase Edge invocations; Supabase uses Upstash for precise business quotas, authentication caching, and backend worker protection.

Keep the short-lived Firebase user cache and frontend content cache instead of forcing every navigation to refetch. Private Broadcast invalidation avoids private-table subscriptions and periodic polling, while the 10-device Push cap bounds FCM fan-out. Fix permanently failing outbox events, monitor Supabase egress, and create a development stack only when it is actually maintained.

These controls reduce repeated provider calls, Edge execution time, and notification fan-out, but they are not a global budget circuit breaker. Set usage alerts around 50%, 75%, and 90% of each relevant allowance and review bills regularly.
