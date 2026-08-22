# Costs and free-tier capacity

The figures below were checked against official provider documentation for **2026**. Novae uses an optimized serverless architecture that operates entirely on standard free tiers for typical campus deployments.

## Executive Capacity Summary

| Usage Profile | Per MAU / Month | Recommended Free Capacity | Primary Resource Focus |
| --- | ---: | ---: | --- |
| Light | ~60 API requests, 0.5 MB egress | ~3,000 MAU | Long-term media storage |
| Typical Campus | ~120 API requests, 1.5 MB egress | **~1,000–1,500 MAU** | Neon 512 MB database, Cloudinary 25 credits |
| Heavy | ~240 API requests, 4.0 MB egress | ~600–800 MAU | Image upload frequency & bandwidth |

A typical 1,000-user deployment operates comfortably for **2–3 full school years** within free quotas. The automated 180-day retention cleanup prevents database and media exhaustion over time.

## Provider-by-Provider Breakdown

### 1. Neon (Serverless PostgreSQL 17)
- **Free Quota**: 0.5 GiB (512 MB) storage, 100 Compute Unit (CU) hours per month.
- **Capacity**: Normalized database schema consumes ~80–120 MB per school year for 1,000 active members.
- **Retention Protection**: Automated cleanup of 180-day closed cases and 365-day audit logs ensures bounded storage growth.

### 2. Cloudflare (Workers, Hyperdrive, Queues, Durable Objects, Turnstile)
- **Workers**: 100,000 free requests per day (~3,000,000/month), exceeding typical 1,000-user needs (120,000–200,000 API requests/month).
- **Hyperdrive**: Included with Workers free tier for PostgreSQL connection pooling.
- **Queues (`novae-jobs`)**: 1,000,000 operations/month for async notifications and retention jobs.
- **Durable Objects**: Manages WebSocket Hibernation for realtime updates and per-UID rate limits.
- **Turnstile**: Unlimited free bot verification assessments.

### 3. Firebase (Google Auth, App Check, Cloud Messaging)
- **Firebase Auth**: Spark plan includes 50,000 free MAU for Google sign-in.
- **Firebase Cloud Messaging (FCM)**: Unlimited free Web Push notifications.
- **Firebase App Check**: 10,000 free assessments per month via reCAPTCHA Enterprise.

### 4. Cloudinary (Media Hosting)
- **Free Quota**: 25 credits per rolling 30-day window (1 credit = 1 GB storage, 1 GB bandwidth, or 1,000 transformations).
- **Capacity**: Client-side WASM WebP compression (150–300 KB per photo) and Worker Media Gateway caching allow 1,000 users to consume only ~3–6 credits per month.

### 5. Vercel (Next.js Frontend Hosting)
- **Hobby Plan**: 100 GB Fast Data Transfer per month for prebuilt PWA bundles and static assets.

### 6. GitHub Actions
- Free unlimited runner minutes for public open-source repositories, covering CI/CD and daily encrypted database backups.

### 7. Optional Notion Copy
- Notion API free tier allows 3 requests/second, ample for background operational synchronization.

## Implemented Cost Control Mechanisms

1. **Connection Pooling & Single API Backend**: Cloudflare Hyperdrive pools database connections; unified Worker API eliminates cross-vendor proxy overhead.
2. **Coalesced Bootstrap Requests**: Login bootstrap merges user roles, categories, content versions, and unread badges into one access check.
3. **Client-side WebAssembly Compression**: Images are compressed to WebP directly in the browser via `@jsquash/webp`.
4. **Edge Media Gateway**: Workers cache transformed images, dramatically reducing origin hits to Cloudinary.
5. **Data Retention Lifecycle**: Automatic purges for 180-day expired closed records, 365-day audit logs, and stale device tokens.
