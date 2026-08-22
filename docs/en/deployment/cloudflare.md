# 6. Create Cloudflare Worker

Cloudflare Worker serves as Novae's sole public API and backend runtime. It executes business Actions, authentication synchronization, Media Gateway caching, Cloudflare Queues asynchronous jobs (notifications, Notion sync, retention cleanup), and WebSocket Hibernation realtime updates via Cloudflare Durable Objects.

## 1. Create Cloudflare Account and workers.dev Subdomain

1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages**.
3. Register a `workers.dev` subdomain (e.g., `school`) if using Workers for the first time.

The production Worker name defaults to `novae-api`, making the public API URL:

```text
https://novae-api.<your-subdomain>.workers.dev
```

Example: `https://novae-api.school.workers.dev`.

## 2. Obtain Account ID and API Token

1. **Account ID**: Copy the 32-character hexadecimal Account ID from the Dashboard and save it as `CLOUDFLARE_ACCOUNT_ID`.
2. **API Token**: Under **My Profile → API Tokens**, click **Create Token**, use the **Edit Cloudflare Workers** template (with Workers Scripts Edit, Hyperdrive Edit, and Queues Edit permissions), select the target account, and save the token as `CLOUDFLARE_API_TOKEN`.

## 3. Create Cloudflare Hyperdrive

Hyperdrive provides connection pooling and query acceleration between Cloudflare Workers and Neon PostgreSQL:

1. In the Cloudflare Dashboard, go to **Workers & Pages → Hyperdrive** (or create via Wrangler CLI).
2. Create a Hyperdrive configuration. GitHub Actions will automatically synchronize the verified `novae_runtime` connection string during deployment.
3. Save the 32-character Hyperdrive ID as:
   ```text
   CLOUDFLARE_HYPERDRIVE_ID
   ```

## 4. Create Cloudflare Turnstile Verification

Novae integrates Turnstile bot protection for profile creation and authentication boundaries:

1. Go to **Turnstile** in the Cloudflare Dashboard and click **Add Site**.
2. Name the site `Novae`, enter your production Vercel domain and `localhost`, and select **Invisible** or **Managed** mode.
3. Record the keys:
   - **Site Key** → Save as frontend secret `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
   - **Secret Key** → Save as backend secret `TURNSTILE_SECRET_KEY`.

## 5. Generate Random Backend Secrets

Run the following in PowerShell to generate three independent random secrets:

```powershell
$healthBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($healthBytes)
$healthSecret = [Convert]::ToBase64String($healthBytes)

$mediaBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($mediaBytes)
$mediaSecret = [Convert]::ToBase64String($mediaBytes)

$ticketBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($ticketBytes)
$realtimeSecret = [Convert]::ToBase64String($ticketBytes)
```

Save them to GitHub `production` Environment secrets:

```text
HEALTHCHECK_SECRET     = $healthSecret
MEDIA_SIGNING_SECRET   = $mediaSecret
REALTIME_TICKET_SECRET = $realtimeSecret
```

## 6. Configure ALLOWED_ORIGINS and CLOUDFLARE_WORKER_URL

- `CLOUDFLARE_WORKER_URL`: Public API root URL (e.g., `https://novae-api.school.workers.dev`; must include `https://`, no trailing slash).
- `ALLOWED_ORIGINS`: Allowed frontend Origin (e.g., `https://school-novae.vercel.app`; **must NOT have a trailing slash**).

## 7. Optional: Custom Worker and Queue Names

If you want to customize Cloudflare resource names, configure these in GitHub `production` Environment Variables (or Repository Variables):
- `CLOUDFLARE_WORKER_NAME`: Defaults to `novae-api` (production) or `novae-api-<env>` (development).
- `CLOUDFLARE_QUEUE_NAME`: Defaults to `novae-jobs` (production) or `novae-jobs-<env>` (development).

## Checklist

- [ ] `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are recorded.
- [ ] `CLOUDFLARE_HYPERDRIVE_ID` is a 32-character hexadecimal string.
- [ ] `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` are created.
- [ ] `HEALTHCHECK_SECRET`, `MEDIA_SIGNING_SECRET`, and `REALTIME_TICKET_SECRET` are generated independently.
- [ ] `ALLOWED_ORIGINS` is configured without trailing slashes.

Next step: [Create Vercel](vercel-github.md).
