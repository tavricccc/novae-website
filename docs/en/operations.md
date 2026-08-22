# Post-launch operations

Operational excellence relies on routine health audits, automated backup validation, and structured incident response boundaries to ensure platform longevity.

## Verification After Every Release

1. Verify backend workflow success (`Deploy Neon and Cloudflare Backend`) followed by frontend success (`Deploy Frontend to Vercel`).
2. Sign in to the production URL to ensure user role and category hydration.
3. Submit a test proposal to test WebAssembly image compression, upload, support, and discussion feeds.
4. Execute one administrative moderation or status change and verify the Audit Log in the Admin Console.
5. Confirm Cloudflare Worker metrics and Neon database connection health.

## Routine Cadence

| Frequency | Review Items |
| --- | --- |
| Daily | Moderation queues ("Pending review" / "Awaiting response"), Admin Console activity metrics, Cloudflare Queue (`novae-jobs`) backlog, and error traces |
| Weekly | Data retention purge jobs, push notification delivery retries, Cloudinary and Neon storage usage |
| Monthly | Free-tier billing quotas (Neon, Cloudflare, Firebase, Cloudinary, Vercel), token expiration dates, and backup artifact validation |
| Each Term | Allowed school domain, administrator list in `ADMIN_EMAILS`, dynamic category policy, and retention thresholds |

## Automated Database Backups and Disaster Recovery

### 1. Automated Encrypted Backups
The project includes `.github/workflows/backup-database.yml`:
- Evaluates backup age and executes automatically when the newest backup is at least 72 hours old.
- Exports a complete PostgreSQL logical dump using `pg_dump`.
- Encrypts the dump with **`age` asymmetric encryption** before leaving the runner.
- Uploads checksum-validated artifacts to GitHub and automatically prunes older backups to retain the latest 2.

#### Configuring `BACKUP_AGE_RECIPIENT` Encryption Key
1. Install `age` locally (macOS: `brew install age`, Windows: `winget install FiloSottile.age`, Linux: `apt install age`).
2. Run `age-keygen` to generate a key pair:
   ```bash
   age-keygen -o key.txt
   ```
3. The generated file contains:
   - Public key / Recipient: `age1...`
   - Private key: `AGE-SECRET-KEY-1...`
4. Set the public key string (`age1...`) in GitHub `production` Environment Variables (or Secrets) as `BACKUP_AGE_RECIPIENT`.
5. Safely store the private `key.txt` offline in a password manager (never commit to Git).
6. To decrypt a downloaded backup artifact in the future:
   ```bash
   age --decrypt -i key.txt novae.dump.age > novae.dump
   ```

### 2. Protected Disaster Recovery Reset
The project includes `.github/workflows/reset-database-and-cloudinary.yml`:
- Guarded by an explicit confirmation string requirement: `RESET_DATABASE_AND_CLOUDINARY`.
- Resets application schemas and sequentially reapplies all forward-only Neon migrations.
- Configures and verifies the least-privilege `novae_runtime` role for Hyperdrive.
- Cleans and reprovisions the Cloudinary `srp-secure-images` preset.

## Incident Response Steps

1. **Scope the Impact**: All users or specific accounts? Specific category or global? Read or write operations?
2. **Identify the Failing Boundary**:
   - Browser client / Nonce CSP
   - Cloudflare Turnstile bot verification
   - Firebase Auth / App Check
   - Cloudflare Worker API / Hyperdrive pooling
   - Neon PostgreSQL database
   - Cloudflare Queues (`novae-jobs`)
   - Cloudinary or Notion integrations
3. **Preserve Diagnostic Evidence**: Save timestamps, `requestId`, `error_trace_id`, HTTP status codes, and workflow execution logs.
4. **Mitigate Impact**: Pause suspect workflows; **never disable authentication or database role boundaries in production**.
5. **Fix and Validate**: Resolve at the correct layer, run end-to-end acceptance checks, and record incident learnings.

## Credential Rotation

Rotate one credential at a time following this flow:
`Generate new secret → Update GitHub production secret → Rerun deployment workflow → Acceptance test → Revoke legacy secret`.

For technical issues, consult [troubleshooting](troubleshooting.md).
