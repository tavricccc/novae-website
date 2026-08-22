# UI design system and reusable components

This document records the design system contracts and implementation standards for the Novae frontend (Next.js 16 App Router / React 19 / TypeScript 7 / Tailwind CSS 4).

## Single Source of Truth

| Capability | Repository Path |
| --- | --- |
| Colors, typography, radii, safe areas, viewports, three-tier elevation, and accent themes | `src/app/globals.css` |
| Timing, easing, page transitions, overlays, counter animations, and reduced motion | `src/styles/motion.css` |
| Business-free UI primitives (Radix UI / shadcn) | `src/components/ui/` |
| transitions.dev motion recipes (`LiquidTabs`, `ResizableCard`, etc.) | `src/components/motion/` |
| Directional history and transition indexing | `src/lib/navigation-memory.ts` |
| Architecture and UI primitive guards | `scripts/check-ui-primitives.mjs`, `tests/architecture/` |

## Visual & Theming Foundations

- **Typography Hierarchy**: Inter for Latin text, HarmonyOS Sans TC for Traditional Chinese, and Roboto Mono for system identifiers and audit logs.
- **Accent Themes**: Supports customizable accent palettes (Slate, Indigo, Emerald, Rose, Violet, etc.) paired with near-white stage background in light mode and layered charcoal in dark mode.
- **Three-tier Elevation**: Strict enforcement of `--shadow-control` (inputs/buttons), `--shadow-card` (cards/feeds), and `--shadow-floating` (sheets/dialogs). Custom arbitrary shadows are prohibited.
- **Global Safe Areas**: `AppShell` owns viewport gutters, mobile safe area insets, and bottom-dock spacing to guarantee end-of-list clearance.

## Reusable UI Primitives

| Scenario | Preferred Component |
| --- | --- |
| Standard, icon, primary, and secondary buttons | `Button` (with integrated spinner/check states) |
| Cards, inputs, and form fields | `Card`, `Input`, `Textarea`, `Label` |
| Dropdowns, selects, and segment pickers | `DropdownMenu`, `Select`, `Tabs`, `LiquidTabs` |
| Dialogs, confirmation alerts, and mobile sheets | `Dialog`, `AlertDialog`, `Sheet` |
| Badges, loading skeletons, and empty states | `StatusBadge`, `Skeleton`, `PageState`, Sonner toast |
| Discussions and comment composers | `CommentComposer` (docked with safe-area spacing and reply context), `DiscussionSurface` |
| Counters and gesture reactions | `AnimatedCounter`, `GestureReaction` |

## Motion & Interaction Guidelines

- **Named Recipes**: Arbitrary `transition-all` is prohibited; all state transitions use curated transitions.dev recipes.
- **Directional Navigation Memory (`navigation-memory`)**: Route transitions maintain monotonic history indices for organic slide transitions.
- **Adaptive Layout (`ResizableCard`)**: Transitions height smoothly when switching tabs or loading nested content.
- **Reactions & Feedback**: Support votes, facility "I also encountered this", and announcement likes trigger tailored particle feedback and animated counter ticks.
- **Reduced Motion**: Automatically simplifies transforms and particles while maintaining semantic state clarity under `prefers-reduced-motion`.

## Delivery Checklist

- [ ] All interactive components reuse `src/components/ui/` primitives.
- [ ] Pages and layouts do not import backend services directly; domain state is encapsulated in hooks.
- [ ] Mobile touch targets meet minimum 44×44px accessibility standards.
- [ ] Color contrast satisfies WCAG AA across light, dark, and custom accent themes.
- [ ] Traditional Chinese and English (`src/i18n/`) message catalogs are fully synchronized.
- [ ] Passes `npm run verify:local` with zero lint, type, or architectural errors.
