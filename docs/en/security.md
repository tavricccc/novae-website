# Security and privacy

Novae employs a Defense-in-Depth security architecture. The browser client, user input, and the public internet are treated as untrusted. Authentication is only the initial layer; every backend operation, data read/write, and media transfer is independently authorized and validated.

## Pre-Launch Security Checklist

1. **Domain Restriction**: Match client and backend allowed domains (`NEXT_PUBLIC_ALLOWED_DOMAIN` = `ALLOWED_DOMAIN`).
2. **Administrator Scope**: Keep `ADMIN_EMAILS` minimal.
3. **Secret Isolation**: Store credentials only in GitHub `production` Environment secrets and runtime containers. Never leak service-account JSON, database passwords, or API secrets to client bundles or Git.
4. **Bot & Client Verification**:
   - Enable **Cloudflare Turnstile** for single-use bot protection during user onboarding.
   - Enable **Firebase App Check** (reCAPTCHA Enterprise) to protect public API endpoints.
5. **Permission Boundaries**: Test school, reviewed-school, and private owner/admin categories for read, image, and comment access.
6. **Institutional Governance**: Publish campus privacy notices, moderation guidelines, and data retention windows.

## System Trust Boundaries

| Boundary Layer | Security Controls |
| --- | --- |
| Browser Client | Strict Nonce-based CSP, WebAssembly (`@jsquash/webp`) encoding, zero sensitive credentials |
| Bot Protection | Cloudflare Turnstile invisible verification (single-use token consumption), Firebase App Check JWT validation |
| Authentication | Firebase Google OAuth (GIS), domain allowlist verification, JWT signature checks |
| Backend API (Worker) | Strict CORS origin matching, native rate limiters, Durable Objects business quotas, typed action registry |
| Database Pooling | Cloudflare Hyperdrive credential isolation and query acceleration |
| Database (Neon PostgreSQL) | Least-privilege `novae_runtime` role (no DDL privileges), private schemas, transactional consistency, monotonic versioning stamps |
| Media Storage (Cloudinary) | Backend-signed uploads, provisioned upload presets, Worker Media Gateway HMAC token delivery |
| Asynchronous Queues | Cloudflare Queues (`novae-jobs`) worker leases, exponential backoff, failure isolation, and lifecycle purges |
| Backup & Recovery | Daily `pg_dump` logical backups encrypted with `age` asymmetric encryption stored in GitHub Artifacts |

## Category Visibility and Anonymity

- `school`: Accessible to authenticated users in the allowed school domain.
- `reviewed-school`: Visible only to author and managers until approved.
- `owner-admin`: Visible only to author and assigned managers (private rights cases).
- `authorVisible: false`: Anonymizes author in the frontend feed while preserving audit linkage in the backend.

## Abuse Prevention and Interaction Restrictions

- **Multi-tiered Rate Limiting**: Cloudflare native bindings stop high-frequency bursts; Durable Objects manage per-UID quotas for creation, comments, and votes.
- **Admin Interaction Restrictions**: Administrators can enforce granular restrictions on abusive accounts (mute proposals, mute comments, mute votes, full freeze), immediately logged to the Audit Log.
- **Data Retention Lifecycle**: Background tasks automatically purge closed records (default 180 days), expired audit logs (default 365 days), and inactive user PII.

## Reporting Vulnerabilities

Do not post exploitable vulnerability details in public issues. Report privately following the instructions in `SECURITY.md`.
