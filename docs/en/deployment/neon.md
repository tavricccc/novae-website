# 3. Create Neon database

Neon is Novae's Serverless PostgreSQL 17 database platform. All proposals, facility reports, announcements, comments, dynamic categories, user restrictions, and audit logs are stored in Neon. Browsers never connect to the database directly; all operations are executed by the Cloudflare Worker via Cloudflare Hyperdrive connection pooling using a least-privilege `novae_runtime` database role.

## 1. Create a Neon Project

1. Sign in to the [Neon Console](https://console.neon.tech/).
2. Click **Create Project**.
3. Name your project (e.g., `novae-school`), select PostgreSQL 17, and choose the region closest to your campus.
4. Once created, copy the full connection string (`postgres://...`) from the **Connection Details** pane on the Dashboard.

## 2. Record GitHub Secrets

Obtain and generate the following values and save them to your GitHub `production` Environment secrets:

| Item | GitHub Secret | Description |
| --- | --- | --- |
| Connection String | `NEON_DATABASE_URL` | Full PostgreSQL connection string for the Neon project. |
| Runtime Password | `NEON_RUNTIME_PASSWORD` | Independent high-entropy random string used by `scripts/configure-database-runtime.mjs` to configure the `novae_runtime` role. |

Generate a secure `NEON_RUNTIME_PASSWORD` in PowerShell:

```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

## 3. Automated Migrations and Runtime Role

You do not need to connect manually or run SQL scripts:

1. **Automated Migrations**: The GitHub Actions backend workflow (`deploy-backend.yml`) runs `npm run db:migrate` to apply all forward-only migrations under `database/migrations/` sequentially with canonical checksum verification.
2. **Automated Runtime Role**: The workflow then executes `node scripts/configure-database-runtime.mjs` to create or update the `novae_runtime` role with least-privilege permissions (DML operations, sequences, and functions only; no DDL or role management capabilities).
3. **Hyperdrive Synchronization**: The script verifies query capabilities with the runtime role and synchronizes the connection string to Cloudflare Hyperdrive.

## Checklist

- [ ] `NEON_DATABASE_URL` is set in GitHub `production` Environment secrets.
- [ ] `NEON_RUNTIME_PASSWORD` is generated and saved as an independent secret.
- [ ] No manual migration SQL was pasted into the database.

Next step: [Create Cloudinary](cloudinary.md).
