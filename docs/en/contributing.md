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

It starts local Supabase, Edge Functions, Firebase Auth Emulator, the Cloudflare gateway, and Vite, then reports Ready only after sign-in, custom-claim, platform-administrator, and Setup prerequisites pass. Create arbitrary `@integration.invalid` accounts in the Auth Emulator. `Ctrl+C` stops the whole stack. Local emulator debug logs are generated artifacts and must not be committed. Automatic integration runs also start isolated Upstash and external-provider receivers so FCM topic/token delivery, Cloudinary deletion, and retention cleanup can be asserted without production credentials. Prefer folding high-frequency cold-start reads into `getSessionBootstrap` or client caches instead of adding another Edge invocation on every app open.

## Verify

```bash
npm run verify:local
```

This entry point runs type and unused-declaration checks, bilingual and UI-primitive validation, lint, a production build, build budgets, Worker/Edge type checks, Vitest unit tests, architecture tests, and a full npm audit. Current production budgets allow at most 160 font files / 9.2 MiB of fonts, 1.3 MiB of JavaScript, and 550 KiB of CSS. A pull request may raise a budget only with a measured product reason; do not remove the gate.

For backend actions, permissions, RPCs, RLS, migrations, Edge Functions, or workers:

```bash
npm run verify:integration
```

Before merging a large change:

```bash
npm run verify:all
```

Run the real Chromium user-flow suite directly for permissions, categories, proposals, facilities, announcements, or feature switches:

```bash
npm run test:e2e:install
npm run test:e2e
```

The browser installation is needed only once. E2E rebuilds the isolated stack, completes Setup through the real UI, creates multiple accounts and two category scopes, then checks desktop and mobile button visibility, click results, cross-category isolation, grant/revoke recovery, category lifecycles, and all four proposal/facility switch combinations. Its sign-in bridge is restricted to development mode, a loopback Auth Emulator, and `@integration.invalid` accounts; production builds cannot expose it.

For the multi-user, multi-category, overlapping-permission stress matrix:

```bash
npm run verify:stress
```

It expands from the runtime catalog and covers every proposal and facility category, images, nested comments, support/affected reports, notifications, status, multiple managers, and category creation/deletion. Do not replace it with fixed category counts or a single test account.

PR CI runs three layers: local static/unit verification, backend integration, and real-browser E2E. On Windows, run the npm command from PowerShell; integration and E2E environment launchers enter WSL automatically. Windows requires WSL 2, Docker, and Supabase CLI plus Deno in the WSL `PATH`. Linux and CI do not need WSL.

The integration suite rebuilds an isolated local Supabase stack, applies every migration, runs database lint, and checks actions, permissions, RLS, idempotency, and worker lifecycles. Its external-provider receiver can inject a transient FCM failure; the test must assert that delivery remains durable, retries after backoff, succeeds, and clears its payload. `.env.local` is optional. Supabase URLs and keys are always replaced by local values, so the suite does not write remote application data.

Add integration assertions when introducing or changing:

- backend actions: successful behavior and relevant denial paths;
- roles or permissions: allowed and denied actors, plus in-scope and out-of-scope resources;
- access grants and revocations: allowed after grant, immediately denied after revoke, unrelated scopes preserved, and removal from the assignee list;
- RPCs, schemas, or migrations: real local-database results;
- RLS: anon, authenticated, and service-role access as applicable;
- idempotent writes: missing request ID, first execution, and replay;
- workers, outbox, or deletion jobs: claim, completion/failure, retry, and deduplication.
- composables, browser storage, or component interactions: successful and failure behavior in `tests/unit/`.
- permission-driven UI and feature switches: table-driven visible, hidden, disabled, and click/emit assertions covering ordinary users, owners, correct scope, wrong scope, platform administrators, and every switch combination.

Pure frontend layout work normally needs only `verify:local`. The action coverage guard rejects registered actions that are not referenced by a domain integration test. Do not bypass it with a call that has no assertion.

Do not duplicate authorization rules only inside components. Role, permission, and category-scope decisions use `src/lib/session-access.ts`; proposal/facility feature routing uses `src/lib/feature-access.ts`. Component behavior and backend integration tests must jointly protect presentation and real authorization so hiding a button never substitutes for denying the API, and a denied operation is not still offered by the UI.

Large suites use thin entry files that import domain-focused cases; shared accounts, fixtures, page objects, and emulator helpers belong in a sibling `support` or `helpers` module. Reassess responsibility as a test file approaches 400 lines. Do not keep adding unrelated permission domains, workers, RLS boundaries, and UI flows to a multi-thousand-line script.

## Reusable UI system

See the [UI design system](ui-design-system.md) for the complete Atomic Design layers, component mapping, elevation contract, and new-page checklist. This section keeps the boundaries every contribution must follow.

The main application treats `src/styles/primitives.css` and `src/components/ui/` as the single source of truth for visual primitives. Proposals, announcements, facilities, notifications, settings, and administration may keep domain-specific fields and states, but must not maintain parallel viewport, button, card, list, dropdown, shadow, or control systems.

| Need | Canonical entry point |
|---|---|
| Page gutters, safe areas, and content width | `AppShell` / `ViewportFrame` / `RoutePageFrame` |
| Three-domain desktop detail split and unified mobile feed | `DetailPageShell`; do not add an outer desktop card or restore mobile segmented tabs |
| Standard, icon, toolbar, primary, and secondary actions | `AppButton` or an existing `button-*` variant |
| Cards, controls, floating panels, and inset areas | `SurfacePanel` or `surface-control` / `surface-card` / `surface-floating` / `surface-inset` |
| Grouped lists and interactive rows | `list-surface`, `list-surface-row` |
| Page tabs, exclusive choices, and equal-width segments | Semantic `AppButton` tabs, `SelectionOptionButton`, and `PillSegmentedControl` with `adaptive` / `equal` layout |
| Dropdowns and menu items | `DropdownMenu` / `DropdownPanel`, `dropdown-item` |
| Composite fields and footers | `field`, `control-frame`, `control-footer` |
| Detail progress/actions/timeline, embedded comments, and unavailable state | `DetailActionGroup` summary, `OperationTimeList`, `CommentThreadPanel embedded`, `CommentComposer disabled/mobileDocked` |

Mobile detail body, actions, and discussion share the outer `DetailPageShell` scroll root; embedded infinite scroll must resolve that root rather than adding an inner comment overflow container. Desktop and mobile composers share one pill control. Docking must reuse Bottom Tab, safe-area, and viewport-gutter tokens; an opaque surface must block scrolling content behind the composer and reply context, and the reply excerpt stays single-line truncated. Facilities may use only the presentation-only `UnavailableCommentDiscussion`; do not add facility comment actions, services, Realtime, notifications, or tables as part of that shell.

Elevation has exactly three levels: `--shadow-control`, `--shadow-card`, and `--shadow-floating`. Do not add arbitrary shadows, page-level horizontal padding in route views, fixed left/right offsets that imitate safe areas, or manually assembled near-duplicate cards.

When structures differ only by strings, icons, states, slots, or callbacks, extend an existing primitive through props or slots. Add a new primitive only when it has at least two valid consumers and the existing contract cannot express it clearly; then update `structure.md`, architecture tests, and both language versions of this guide. `check:ui`, included in `npm run verify:local`, rejects known parallel styling patterns.

After changing `config/rate-limits.config.json` or `config/api-errors.config.json`, run `npm run generate:all` and commit source JSON plus every generated output. Categories are runtime data managed through migrations and controlled backend actions; there is no category codegen. API error codes must agree across the frontend, Cloudflare, and Edge. Never hand-edit generated files.

Locale catalogs are split by `src/i18n/messages/<locale>/<domain>.ts`, with the filename matching the first key segment. Keep Traditional Chinese and English keys identical and use short stable semantic names rather than sentences, hashes, or translated source text.

Persist background diagnostics only as native UUID `error_trace_id` values and keep full details in logs. Add a migration that removes the old column or RPC overload; never rewrite a deployed migration or retain two storage formats as a compatibility layer.
