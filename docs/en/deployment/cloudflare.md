# 8. Create Cloudflare Worker

Cloudflare Worker is the stable public API entry point. It checks CORS, Firebase identity, and native Cloudflare Rate Limiting bindings before forwarding accepted requests to randomly named Supabase Edge Functions. Edge burst protection returns `429` before Supabase; precise daily and hourly business quotas are checked by Supabase through Upstash.

## 1. Register workers.dev

1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Open `Workers & Pages`.
3. Register a `workers.dev` subdomain when prompted.
4. Cloudflare normalizes accepted subdomains to lowercase.

The production Worker name remains `novae-api`, producing:

```text
https://novae-api.<workers-subdomain>.workers.dev
```

Do not randomize the Worker name. Only the private Supabase Function names use the secret namespace.

## 2. Collect account and token values

Copy the 32-character Cloudflare Account ID as `CLOUDFLARE_ACCOUNT_ID`; do not use a zone ID. Under `My Profile → API Tokens`, create a token from the `Edit Cloudflare Workers` template, restrict it to the Novae account, and save it as `CLOUDFLARE_API_TOKEN`.

Save the stable URL as:

```text
CLOUDFLARE_WORKER_URL=https://novae-api.<workers-subdomain>.workers.dev
```

Include `https://`, omit a trailing slash, and do not append `/v1/actions`.

## 3. Set ALLOWED_ORIGINS exactly

Use the complete Vercel production origin:

```text
https://your-project.vercel.app
```

> **Do not add a trailing slash.**  
> Correct: `https://your-project.vercel.app`  
> Wrong: `https://your-project.vercel.app/`

The value must include `https://`, contain no path or quotes, and must not be `*`. Separate multiple origins with ASCII commas. Browsers send origins without a trailing slash; the Worker uses exact matching, so an extra `/` causes `403 origin-denied` and a browser CORS error.

## 4. Generate the private Edge values

In trusted PowerShell:

```powershell
$namespaceBytes = New-Object byte[] 18
[Security.Cryptography.RandomNumberGenerator]::Fill($namespaceBytes)
$edgeNamespace = ([Convert]::ToHexString($namespaceBytes)).ToLower()

$secretBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
$edgeOriginSecret = [Convert]::ToBase64String($secretBytes)
```

Store them as `EDGE_FUNCTION_NAMESPACE` and `EDGE_ORIGIN_SECRET`. Deployed Functions become `n<namespace>-api`, `-sync`, `-media`, `-outbox`, `-delete`, and `-maintenance`. The fixed `n` guarantees a valid leading letter. Names change only when you deliberately rotate the namespace and redeploy.

## 5. Put everything in GitHub production only

Add these to the fork's `Settings → Environments → production → Environment secrets`:

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
CLOUDFLARE_WORKER_URL
ALLOWED_ORIGINS
EDGE_FUNCTION_NAMESPACE
EDGE_ORIGIN_SECRET
```

Do not duplicate these values manually in Cloudflare Worker Settings or Supabase. After changing a GitHub secret, rerun `Deploy Supabase Backend`; Actions synchronizes and deploys everything automatically.

Rate Limiting bindings and their `namespace_id` values are declared in the application repository's `cloudflare/wrangler.toml`. Worker deployment creates them automatically: there is no separate Dashboard service to register and no additional secret. Production and development use separate namespaces so test traffic cannot consume production counters.

All eight service setups are now complete. Next, use the [credential worksheet](../environment-configuration.md) to add every value to GitHub `production` Environment secrets.
