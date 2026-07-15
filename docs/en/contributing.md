# Contributing

This is the only local-development-first document. Deployment operators should begin with [preparation and service setup](quick-start.md) instead.

## Setup

Install Git, Node.js 24, and npm, then:

```bash
git clone https://github.com/<your-account>/novae.git
cd novae
npm ci
npm run dev
```

Copy `.env.example` only when connecting to development services, and never commit real values. Read `AGENTS.md` and `structure.md` before editing; preserve architecture boundaries and update `structure.md` when files move, split, appear, or disappear.

## Verify

```bash
npm run typecheck
npm run lint
npm run build
npm run check:unused
```

For Edge, migration, generator, or architecture changes also run:

```bash
npm run check:edge
npm run test:architecture
```

After config changes, run `npm run generate:all` and commit source JSON plus generated outputs. Never hand-edit generated files or rewrite deployed migrations.
