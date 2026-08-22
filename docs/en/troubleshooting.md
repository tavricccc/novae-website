# Step-by-step troubleshooting

Always isolate the first failing boundary before modifying multi-service configurations.

## 1. GitHub Actions Deployment Failures

1. Open the failed workflow run and inspect the earliest failing step.
2. **`Missing backend deployment values`**: Compare your repository's GitHub `production` Environment secrets with the [credential worksheet](environment-configuration.md).
3. **`Apply forward-only Neon migrations` fails**:
   - Verify `NEON_DATABASE_URL` is active and correct.
   - Confirm no out-of-order schema mutations were applied manually.
4. **`Configure the least-privilege Worker database role` fails**:
   - Ensure `NEON_RUNTIME_PASSWORD` is set.
   - Verify the admin database user has permission to configure roles and grant schema privileges.
5. **`Validate Hyperdrive binding` fails**:
   - Ensure `CLOUDFLARE_HYPERDRIVE_ID` is a 32-character hexadecimal string without whitespace.
6. **`Smoke test authentication and database health` fails**:
   - Inspect Worker logs under `Workers & Pages → novae-api → Logs` in the Cloudflare Dashboard.
   - Verify `HEALTHCHECK_SECRET` matches across workflow and Worker environment.

## 2. Authentication and Verification Failures

1. **Google Account Picker Does Not Open or Shows Errors**:
   - Confirm `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is from the matching GCP/Firebase project.
   - Confirm Google Cloud Console **Authorized JavaScript origins** includes the active production domain (with `https://`, no trailing slash).
   - Verify CSP headers do not block `https://accounts.google.com`.
2. **Cloudflare Turnstile Verification Fails**:
   - Verify `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` match.
   - Ensure your production domain and `localhost` are added to the Turnstile Widget allowed domains.
3. **"Domain mismatch" Notice**:
   - Verify the signed-in Google account domain matches `NEXT_PUBLIC_ALLOWED_DOMAIN` / `ALLOWED_DOMAIN` (e.g., `school.edu.tw` without `@`).

## 3. Browser API Requests and CORS Errors

If the browser Console displays:
```text
Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present
```

Verify:
1. `ALLOWED_ORIGINS` exactly matches the browser `from origin 'https://…'`.
2. **`ALLOWED_ORIGINS` must NOT have a trailing slash** (Correct: `https://school-novae.vercel.app`; Incorrect: `https://school-novae.vercel.app/`).
3. The value represents the frontend Vercel origin, not the Worker URL.
4. Rerun `Deploy Neon and Cloudflare Backend` after updating secrets.

## 4. Image Upload and Display Issues

1. **Upload Fails or Freezes in Browser**:
   - Ensure browser supports WebAssembly for client-side `@jsquash/webp` compression.
   - Verify image count and file sizes comply with **System settings → Platform settings**.
2. **Uploaded Images Cannot Be Displayed**:
   - Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
   - Ensure `srp-secure-images` preset was created successfully during backend deployment.
   - Verify `MEDIA_SIGNING_SECRET` is configured.

## 5. Realtime and Notification Issues

1. **Discussions Do Not Update Live**:
   - Confirm `REALTIME_TICKET_SECRET` is configured.
   - Verify Cloudflare Durable Objects binding (`RealtimeHub`) is deployed.
2. **Web Push Notifications Not Received**:
   - Confirm `NEXT_PUBLIC_FIREBASE_VAPID_KEY` is a valid FCM VAPID key.
   - Verify `GOOGLE_SERVICE_ACCOUNT_JSON` is full JSON text with FCM permissions.
   - Check device push registration status under user Settings.

## 6. Submitting Diagnostics

When reporting an issue, provide:
- Timestamp and timezone.
- User role, category, and target record ID.
- Network panel HTTP status code, `error.code`, and `error.requestId`.
- Link to relevant GitHub Actions workflow runs.
*(Never share raw secrets, passwords, or service-account keys).*
