# UI design system and reusable components

This page records the implementation contract for the Novae Next.js/React frontend. The complete visual direction lives in the main application's `DESIGN.md`. New pages compose existing tokens and primitives instead of creating domain-specific parallel systems.

## Sources of truth

| Capability | Main application location |
| --- | --- |
| Colors, type, radii, safe areas, viewport, surfaces, and three elevation levels | `src/app/globals.css` |
| Timing, easing, routes, overlays, numbers, reactions, loading, and reduced motion | `src/styles/motion.css` |
| Business-free shadcn/Radix components | `src/components/ui/` |
| Reusable number, text, list, and reaction motion | `src/components/motion/` |
| Component locations and responsibilities | `structure.md` |
| Regression guards | `scripts/check-ui-primitives.mjs`, `tests/architecture/` |

Pages and domain components must not create parallel buttons, cards, fields, dropdowns, dialogs, navigation, shadows, or motion. When a primitive lacks a valid capability, extend existing props, children, or callbacks first.

## Architecture boundaries

- `src/app/` only composes App Router pages and layouts; it does not access services directly.
- `src/components/` renders domain data and forwards events; workflows and asynchronous state belong in `src/hooks/`.
- `src/components/ui/` never imports services, sessions, or domain hooks.
- `src/lib/` remains React-free, while `src/services/` owns API, Supabase, and Edge boundaries.
- Mobile and desktop share one data flow and interaction state, changing only layout.

## Visual contract

- Inter is used for Latin text, HarmonyOS Sans TC for Traditional Chinese, and Roboto Mono only for identifiers and operational data.
- Light mode uses a near-white stage and white surfaces; dark mode uses layered charcoal. The logo is black on white in light mode and reversed in dark mode.
- Elevation has exactly three levels: `--shadow-control`, `--shadow-card`, and `--shadow-floating`. Arbitrary shadows and domain-level hand-built cards are forbidden.
- Radii scale across controls, cards, and floating layers. Pills are reserved for segmented controls, navigation, and genuinely compact controls.
- `AppShell` and global tokens own viewport gutters and safe areas. Route pages do not add a second page-gutter system.
- Scrollbars are hidden globally as a visual choice only; wheel, touch, keyboard, and programmatic scrolling remain available.

## Shared components

| Need | Prefer |
| --- | --- |
| Standard, icon, primary, and secondary actions | Existing `Button` variants and sizes |
| Cards, fields, and text entry | `Card`, `Input`, `Textarea`, `Label` |
| Menus, choices, and segments | `DropdownMenu`, `Select`, `Tabs`, `LiquidTabs` |
| Dialogs and mobile layers | `Dialog`, `AlertDialog`, `Sheet` |
| Status, loading, empty, and error states | `StatusBadge`, `Skeleton`, `PageState`, Sonner toast |
| Markdown, media, and discussion | Shared composer fields, content renderer, and discussion surface |
| Number, text, reaction, and list changes | Existing wrappers in `components/motion/` |

Structures that differ only by strings, icons, state, or callbacks share one component. A list card receives restrained hover feedback only when the entire card is interactive; non-interactive cards do not move or lift.

## Responsive and touch behavior

- Desktop shows the complete sidebar and may use two-column feeds when space allows; mobile uses one column and bottom navigation.
- On mobile, the current page title provides header context. Do not add a duplicate title row or notification entry.
- Primary mobile controls remain at least 44x44px, including back, share, more actions, reactions, and bottom navigation.
- Hover belongs inside `(hover: hover) and (pointer: fine)`. Touch uses active feedback, and no capability may depend on hover discovery.
- Use `100dvh`, `viewport-fit=cover`, and safe-area tokens. Fixed or sticky controls must not cover the final content item.
- Copy must fit at 320px, with long English strings and enlarged text; do not scale type with viewport width.

## Content and interaction

- Functional names and status text come from shared i18n keys. Traditional Chinese and English expose identical key structures, and one function keeps one name across routes.
- Proposal support and facility affected actions use the hand reaction; announcement likes use the heart. Activation plays the matching particles and number transition without replacing the icon with a generic spinner/check.
- Comments form one continuous discussion region instead of one card per comment. The composer appears at the actual reply location with reply context.
- Authors render only when the current user may read them. When visible, avatar and name precede the timestamp.
- Normal mutations patch React state in place rather than using a full-document reload as success feedback.

## Motion

- Motion communicates state, hierarchy, or content change through named recipes; do not use `transition-all`.
- Non-interactive surfaces remain still. Directional arrows may shift slightly, while hover changes only one restrained surface level.
- Route motion applies to the content region while the app shell remains stable. Selection, numbers, loading, success, dialogs, dropdowns, and toasts use their own recipes.
- `prefers-reduced-motion` preserves clear state changes while removing nonessential transforms, blur, and particle travel.

## New UI delivery checklist

- [ ] Existing `src/components/ui/` and `src/components/motion/` capabilities were checked first.
- [ ] Pages do not import services directly; workflows live in hooks.
- [ ] Viewport, surfaces, buttons, lists, dropdowns, dialogs, and forms reuse shared primitives.
- [ ] Shadows use only control, card, or floating elevation.
- [ ] Mobile 44px targets, safe areas, horizontal overflow, and touch hover were verified.
- [ ] i18n, ARIA, labels, alt text, focus, and keyboard behavior are complete.
- [ ] A new primitive has at least two consumers plus synchronized docs, `structure.md`, and architecture guards.
- [ ] Old APIs, CSS, and unused declarations were removed.
- [ ] `npm run verify:local` passes; large deliveries also run `npm run verify:all`.
