# Costs and free-tier capacity

The figures below were checked against official provider documentation on **2026-07-23**. Free plans change; this is a planning model, not a provider guarantee.

## Executive estimate

| Usage profile | Per MAU / month | Recommended free capacity | First constraint |
| --- | ---: | ---: | --- |
| Light | About 60 backend actions and 1.2 MB Supabase egress | About 2,000 MAU | Realtime concurrency and long-term media growth |
| Typical campus | About 120 backend actions and 4.8 MB Supabase egress | **About 800–1,000 MAU** | Supabase 5 GB egress and 200 peak Realtime connections |
| Heavy | About 240 backend actions and 14.4 MB Supabase egress | About 300–350 MAU | Supabase egress |

A typical 1,000-user deployment should plan for **160–200 concurrent users and two complete school years** on the free tiers. A 500-user deployment can conservatively retain about three school years. Traffic quotas reset daily or monthly; Supabase database size and Cloudinary media are the resources that accumulate over time.

## Model

A typical MAU is active on 12 days per month and performs eight signed-in actions per active day. Adding 25% for prefetching, reconnects, and retries gives `12 × 8 × 1.25 = 120` Cloudflare Worker and Supabase Edge requests. At a planned average response of 40 KB, one MAU consumes about `120 × 40 KB = 4.8 MB` of Supabase egress per month.

The media model uses five new images per user per school year, 350 KB after compression, and four views per stored image per month. Image strips first load a 320×240 thumbnail and fetch the full image only for document display or the lightbox. Cloudflare counts each original plus fixed variant as a unique transformation; Cloudinary delivery occurs only when the Worker edge cache misses.

## Provider-by-provider calculation

### Supabase

The [Free plan](https://supabase.com/docs/guides/platform/billing-on-supabase) includes a 500 MB database per project, 5 GB uncached plus 5 GB cached monthly egress, 500,000 Edge Function invocations, two million Realtime messages, 200 peak Realtime connections, and 50,000 MAU.

- Edge: `500,000 ÷ 120 ≈ 4,166 MAU`, so invocations are not the first typical constraint.
- Egress: `5,120 MB ÷ 4.8 MB ≈ 1,066 MAU`; after 20% headroom, about **850 MAU**.
- Realtime messages: at 240 messages per MAU, about 8,333 MAU. Peak connections are earlier: at 20% simultaneous use, 200 connections map to about 1,000 MAU.
- Database: the reproducible one-school-year benchmark is 131 MB for 500 users and 187 MB for 1,000 users, including 50% planning headroom. Plan for two years at 1,000 users or three years at 500 users.

A free project [may pause after one week of inactivity](https://supabase.com/pricing), but its allowance does not expire after a fixed number of months.

### Cloudflare Workers

[Workers Free](https://developers.cloudflare.com/workers/platform/limits/) includes 100,000 requests per day, 10 ms CPU per invocation, and 128 MB memory. API actions and every media request count as Worker requests; a media cache hit still counts as a request but avoids a Cloudinary origin fetch. The Worker does not perform database work.

[Cloudflare Images Free](https://developers.cloudflare.com/images/pricing/) includes 5,000 unique transformations per month. Novae uses only a fixed 320×240 thumbnail and 96×96 avatar variant; repeat reads of the same original and parameters in the same month do not count again.

At ten typical daily requests per user, the theoretical ceiling is about 10,000 DAU, or 8,000 with headroom. Production observability now samples 10% of traces instead of logging every normal request.

### Firebase

[Firebase Spark](https://firebase.google.com/pricing) provides no-cost non-phone Authentication and FCM; the no-cost Authentication measure is 50,000 MAU. The [Spark instrumentless limit](https://firebase.google.com/docs/auth/limits) also lists 3,000 DAU.

Novae does not use Phone Auth. Web App Check uses reCAPTCHA Enterprise, which includes [10,000 assessments per month](https://firebase.google.com/docs/app-check). App Check is initialized only for notification settings and token maintenance, not for every backend action. At two initializations per push user per month, it covers about 5,000 push users.

### Cloudinary

The [Free plan](https://cloudinary.com/documentation/billing_and_plans) supplies 25 credits in a rolling 30-day window. One credit is 1,000 transformations, 1 GB storage, or 1 GB image bandwidth, and all three are added together.

If every view is conservatively treated as a first request from a new Cloudflare location, 1,000 users in the first school year still cap at about 9.2 Cloudinary credits. Real Worker cache hits reduce Cloudinary delivery bandwidth. Treating second-year archived images as equally popular leaves the same conservative ceiling of about 18.4 credits.

### Upstash Redis

[Free Redis](https://upstash.com/pricing/redis) includes 256 MB, 500,000 monthly commands, and 10 GB bandwidth. Novae stores only short-lived Firebase verification data and precise write quotas there.

The pessimistic assumption of one auth-cache command per backend action plus 10% write-limit commands is 132 commands per MAU, or about 3,787 MAU. Warm Edge isolates now reuse verified users in memory for up to five minutes without exceeding the Redis record's absolute 15-minute validity, so normal use should be lower.

### Vercel

[Hobby](https://vercel.com/docs/plans) includes 100 GB Fast Data Transfer. Novae is a static PWA and does not use Vercel Functions. At a two-megabyte complete cold load, the allowance is about 50,000 cold loads per month.

Hobby is limited to [personal or non-commercial use](https://vercel.com/legal/terms). A non-profit campus deployment generally points in the non-commercial direction, but institutions involving paid contracting or uncertain usage should confirm the terms or choose Pro or another static host.

### GitHub and GitHub Pages

Standard GitHub-hosted runners are [free for public repositories](https://docs.github.com/en/billing/concepts/product-billing/github-actions). The documentation site uses GitHub Pages, which has a [100 GB monthly soft bandwidth limit](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). At one megabyte per complete docs visit, that is roughly 100,000 visits per month and does not affect PWA capacity.

### Optional Notion copy

The [Notion API](https://developers.notion.com/guides/get-started/quick-start) averages three requests per second. An individual Free workspace has unlimited pages and blocks, with a [5 MB per-file limit](https://www.notion.com/pricing); Novae images are capped at 800 KB.

Notion publishes no monthly API request quota, so throughput—not user count—is the constraint. Even at six API requests per sync event, three requests per second is roughly 43,000 events per day. Notion is optional; disabling it removes this cost and maintenance surface without changing any core workflow.

## Cost controls already implemented

- Session bootstrap combines access, categories, revisions, unread status, and a once-daily visit write; the obsolete `recordPlatformVisit` action is removed.
- Visit writes now occur at most daily instead of every six hours.
- The Firebase Redis record keeps an absolute creation time while warm Edge isolates reuse it for up to five minutes, preserving the 15-minute revocation window.
- Production Cloudflare observability samples 10% of traces.
- After Firebase authentication, issue, facility, and announcement lists use a 30-second Cloudflare POP cache isolated by UID, Origin, and the complete request digest. Hits skip Supabase Edge while browser responses remain `no-store`.
- Lists, details, comments, and notifications use account-scoped persistent caching, request coalescing, and Realtime invalidation. Edge signs media URLs in batches, while the Worker shares cached image bytes.
- Public author profiles are fetched in batches of 50 and kept in IndexedDB for 24 hours. Re-tapping active navigation is coalesced for 20 seconds, while desktop detail prefetch requires a 180 ms dwell and is disabled for data saver, 2G, background tabs, and mobile pointers.
- Outbox rows retain identifiers required for delivery and synchronization instead of duplicating full content. Comment text is fetched by ID only when a worker processes that event.
- Browser WebP compression caps images at 800 KB and 2,000 px. The Cloudinary preset retains format and file-size validation without a duplicate incoming resize transformation.
- Unchanged Notion content hashes are skipped, while outbox, notification, and deletion retries remain bounded.
- Closed issues and facility reports retain their full data for 180 days from closure, then their comments, per-user relations, database rows, and Cloudinary images are permanently deleted. Notion pages remain as a manual long-term record. Announcements are retained indefinitely.

This design does not automatically disable features at 70%, 80%, 90%, or any other quota threshold. Provider alerts notify administrators without silently changing product behavior.

## Upgrade signal

Set alerts at 50%, 75%, and 90%. For a typical 1,000-MAU deployment, watch Supabase uncached egress, Realtime peak connections, database size, and Cloudinary bandwidth/storage first. If a metric remains above 75% for two weeks, investigate duplicate reads, image traffic, and retries before upgrading.
