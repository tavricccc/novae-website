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

For a complete interactive environment isolated from production services, use the single supported entry point:

```bash
npm run test:env
```

It starts local Supabase, Edge Functions, Firebase Auth Emulator, the Cloudflare gateway, and Vite, then reports Ready only after sign-in, custom-claim, platform-administrator, and Setup prerequisites pass. Create arbitrary `@integration.invalid` accounts in the Auth Emulator. `Ctrl+C` stops the whole stack. Local emulator debug logs are generated artifacts and must not be committed.

## Verify

```bash
npm run verify:local
```

For backend actions, permissions, RPCs, RLS, migrations, Edge Functions, or workers:

```bash
npm run verify:integration
```

Before merging a large change:

```bash
npm run verify:all
```

For the multi-user, multi-category, overlapping-permission stress matrix:

```bash
npm run verify:stress
```

It expands from the runtime catalog and covers every proposal and facility category, images, nested comments, support/affected reports, notifications, status, multiple managers, and category creation/deletion. Do not replace it with fixed category counts or a single test account.

PR CI runs both suites. On Windows, run the npm command from PowerShell; the integration launcher enters WSL automatically. Windows requires WSL 2, Docker, and Supabase CLI plus Deno in the WSL `PATH`. Linux and CI do not need WSL.

The integration suite rebuilds an isolated local Supabase stack, applies every migration, runs database lint, and checks actions, permissions, RLS, idempotency, and worker lifecycles. `.env.local` is optional. Supabase URLs and keys are always replaced by local values, so the suite does not write remote application data.

Add integration assertions when introducing or changing:

- backend actions: successful behavior and relevant denial paths;
- roles or permissions: allowed and denied actors, plus in-scope and out-of-scope resources;
- RPCs, schemas, or migrations: real local-database results;
- RLS: anon, authenticated, and service-role access as applicable;
- idempotent writes: missing request ID, first execution, and replay;
- workers, outbox, or deletion jobs: claim, completion/failure, retry, and deduplication.

Pure frontend layout work normally needs only `verify:local`. The action coverage guard rejects registered actions that are not referenced by a domain integration test. Do not bypass it with a call that has no assertion.

## Reusable UI system

See the [UI design system](ui-design-system.md) for the complete Atomic Design layers, component mapping, elevation contract, and new-page checklist. This section keeps the boundaries every contribution must follow.

The main application treats `src/styles/primitives.css` and `src/components/ui/` as the single source of truth for visual primitives. Proposals, announcements, facilities, notifications, settings, and administration may keep domain-specific fields and states, but must not maintain parallel viewport, button, card, list, dropdown, shadow, or control systems.

| Need | Canonical entry point |
|---|---|
| Page gutters, safe areas, and content width | `AppShell` / `ViewportFrame` / `RoutePageFrame` |
| Standard, icon, toolbar, primary, and secondary actions | `AppButton` or an existing `button-*` variant |
| Cards, controls, floating panels, and inset areas | `SurfacePanel` or `surface-control` / `surface-card` / `surface-floating` / `surface-inset` |
| Grouped lists and interactive rows | `list-surface`, `list-surface-row` |
| Dropdowns and menu items | `DropdownMenu` / `DropdownPanel`, `dropdown-item` |
| Composite fields and footers | `field`, `control-frame`, `control-footer` |

Elevation has exactly three levels: `--shadow-control`, `--shadow-card`, and `--shadow-floating`. Do not add arbitrary shadows, page-level horizontal padding in route views, fixed left/right offsets that imitate safe areas, or manually assembled near-duplicate cards.

When structures differ only by strings, icons, states, slots, or callbacks, extend an existing primitive through props or slots. Add a new primitive only when it has at least two valid consumers and the existing contract cannot express it clearly; then update `structure.md`, architecture tests, and both language versions of this guide. `check:ui`, included in `npm run verify:local`, rejects known parallel styling patterns.

After changing `config/rate-limits.config.json` or `config/api-errors.config.json`, run `npm run generate:all` and commit source JSON plus every generated output. Categories are runtime data managed through migrations and controlled backend actions; there is no category codegen. API error codes must agree across the frontend, Cloudflare, and Edge. Never hand-edit generated files.

Locale catalogs are split by `src/i18n/messages/<locale>/<domain>.ts`, with the filename matching the first key segment. Keep Traditional Chinese and English keys identical and use short stable semantic names rather than sentences, hashes, or translated source text.

Persist background diagnostics only as native UUID `error_trace_id` values and keep full details in logs. Add a migration that removes the old column or RPC overload; never rewrite a deployed migration or retain two storage formats as a compatibility layer.
