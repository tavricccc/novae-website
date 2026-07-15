# 6. Create Upstash

1. Create a Redis database in the [Upstash Console](https://console.upstash.com/), preferably near the Supabase region.
2. Copy the HTTPS REST URL to `UPSTASH_REDIS_REST_URL`.
3. Copy the writable Standard REST token to `UPSTASH_REDIS_REST_TOKEN`; a read-only token cannot update counters.
4. Use a separate database if you later create a development deployment, so tests do not consume production limits.

Next: [create Vercel](vercel-github.md).
