# 6. Create Upstash

Novae uses this Redis database only from Supabase for precise daily and hourly business quotas, short-lived Firebase user caching, and backend worker protection. Cloudflare burst protection uses native Rate Limiting bindings and does not receive Upstash credentials.

1. Create a Redis database in the [Upstash Console](https://console.upstash.com/), preferably near the Supabase region.
2. Copy the HTTPS REST URL to `UPSTASH_REDIS_REST_URL`.
3. Copy the writable Standard REST token to `UPSTASH_REDIS_REST_TOKEN`; a read-only token cannot update counters.
4. Use a separate database if you later create a development deployment, so tests do not consume production limits.

Next: [create Vercel](vercel-github.md).
