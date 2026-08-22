# Contributing

This document is the local-development guide for contributors. Operators who simply want to deploy Novae should refer to [preparation and service setup](quick-start.md).

## 1. Local Environment Setup

Requires Git, Node.js 24, and npm. Running local database integration tests requires Docker (Windows uses WSL 2 + Docker Desktop).

```bash
git clone https://github.com/<your-account>/novae.git
cd novae
npm ci
```

Copy `.env.example` to `.env` only when connecting to local development services. Never commit secrets.

## 2. Before Making Changes

1. Review `AGENTS.md`, `PRODUCT.md`, and `structure.md` in the main repository.
2. Respect the layered architecture: `app → components → hooks → services/lib`.
3. Update `structure.md` whenever adding, moving, or removing files.

## 3. Local Development & Test Environments

```bash
npm run dev
```

Launch a fully isolated local test stack (Local PostgreSQL, Firebase Auth Emulator, Cloudflare Worker proxy, and Next.js):

```bash
npm run test:env
```

Manage local database containers and schema migrations:

```bash
npm run db:start        # Start local PostgreSQL container
npm run db:migrate      # Apply all checksummed migrations
npm run db:reset:local  # Reset local database and reapply migrations
```

## 4. Verification Commands

```bash
npm run verify:local
```

Executes:
- TypeScript type checking and unused variable validation
- UI primitives and i18n message parity checks
- ESLint rules
- Next.js 16 production build and bundle size budgeting
- Cloudflare Worker type & boundary validation
- Vitest unit tests and architectural tests
- npm audit security audit

Run integration tests after modifying backend actions, permissions, migrations, or Worker logic:

```bash
npm run verify:integration
```

Before opening a pull request:

```bash
npm run verify:all
```

Run Playwright Chromium end-to-end browser tests:

```bash
npm run test:e2e:install  # Install browser binaries once
npm run test:e2e          # Run E2E test suite
```

## 5. Configuration & Code Generation

After editing `config/rate-limits.config.json` or `config/api-errors.config.json`, run:

```bash
npm run generate:all
```

Commit the source JSON files and all generated TypeScript types. Categories are runtime data and do not use codegen.

## 6. Pull Request Guidelines

- Detail the problem, solution, validation steps, and any UI/permission implications in your PR.
- Database changes must introduce a new, numbered migration file; never mutate existing applied migrations.
- Report security issues privately following `SECURITY.md`.
