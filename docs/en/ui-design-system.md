# UI design system and reusable components

This is the implementation contract for new Novae frontend pages, components, and visual styles. New pages should primarily compose existing capabilities, while desktop and mobile share data flow, interaction state, and visual language.

## Sources of truth

| Capability | Main application location |
| --- | --- |
| Color, radius, motion, and shadow tokens | `src/styles/base.css` |
| Surfaces, viewport, lists, dropdowns, dialogs, editors, and skeletons | `src/styles/primitives.css` |
| Buttons, fields, and controls | `src/styles/controls.css` |
| Business-free UI components | `src/components/ui/` |
| Component locations and responsibilities | `structure.md` |
| Regression guards | `scripts/check-ui-primitives.mjs`, `tests/architecture.test.mjs` |

Domain components must not create parallel cards, buttons, shadows, dropdowns, dialogs, or viewport styles. If a primitive lacks a valid capability, extend its props, slots, or callbacks first.

## Atomic Design layers

Dependencies flow in one direction:

```text
atoms → molecules → organisms → domain components / views
```

- `atoms/`: minimal visual or interactive units such as `AppButton`, `AppIcon`, `TagBadge`, `SwitchIndicator`, `SkeletonBlock`, `InlineAlert`, and `SelectionMark`.
- `molecules/`: reusable local compositions such as `SurfacePanel`, `ListSurfaceRow`, `LabeledListSection`, `SectionHeader`, `DropdownMenu`, `DialogHeading`, and `DialogActionRow`.
- `organisms/`: complete blocks that accept route or domain data and slots, such as `RoutePageFrame`, `DialogShell`, `ContentListState`, `DetailPageShell`, `ContentCardSkeleton`, and `EntryComposerShell`.

Lower layers must not import higher layers, and molecules must not depend on organisms. UI layers never read services, sessions, or business data.

## New-page composition order

1. Use `RoutePageFrame` for flow/fill layout, vertical padding, and bottom safe area.
2. Look for an organism covering list, detail, dialog, composer, or loading behavior.
3. Compose sections with molecules such as `SurfacePanel`, `SectionHeader`, and `LabeledListSection`.
4. Add atoms for buttons, icons, badges, messages, and skeletons last.
5. Keep route composition and page state in `views/`, workflows in composables, and data boundaries in services.

Route views must not add another page-level `px-*`, `left-*`, `right-*`, safe-area calculation, or max-width. `AppShell`, `ViewportFrame`, and `RoutePageFrame` own those contracts.

## Common needs

| Need | Prefer |
| --- | --- |
| Page frame, gutters, and safe areas | `RoutePageFrame`, `ViewportFrame` |
| Standard, icon, toolbar, primary, and secondary buttons | `AppButton` |
| Cards, controls, floating panels, insets, and list shells | `SurfacePanel` |
| Grouped lists and settings rows | `ListSurfaceRow`, `IconListRow`, `LabeledListSection` |
| Dropdowns and items | `DropdownMenu`, `DropdownPanel`, `dropdown-item` |
| Dialogs | `DialogShell`, `DialogHeading`, `DialogActionRow` |
| List loading, empty, error, and pagination states | `ContentListState`, `EmptyStatePanel`, `PageLoadFailure` |
| Card and detail skeletons | `ContentCardSkeleton`, `SkeletonDetail`, `SkeletonBlock` |
| Length-limited inputs | `CountedTextField`, `CountedTextareaField` |

Structures that differ only by strings, icons, states, slots, or callbacks must share one component.

Route-level session skeletons and live list content must be exclusive (`v-if` / `v-else-if` on one chain). Never mount both the skeleton and boards such as `IssueBoard` at once. Empty lists that use `EmptyStatePanel` keep the icon tile at `elevation="none"` so a vacant board does not look like a leftover card. `.skeleton-card` enter animations may use opacity only—no transform—so unmount does not leave composite shadows.

## Surfaces and shadows

Elevation has exactly three levels:

| Token / class | Use |
| --- | --- |
| `--shadow-control` / `shadow-control` | Buttons, fields, icon tiles, and small interactive controls |
| `--shadow-card` / `shadow-card` | Content cards and large stable surfaces |
| `--shadow-floating` / `shadow-floating` | Dropdowns, toasts, floating navigation, and top-layer surfaces |

Arbitrary shadows, a fourth elevation name, and domain-level `rounded + border + background + shadow` card assembly are forbidden. Use the semantic `control`, `card`, `floating`, `inset`, and `list` variants of `SurfacePanel`. Empty-state and descriptive icons must not use card elevation.

## Dialogs, forms, and feedback

- `DialogShell` owns overlays, focus trapping, body scroll lock, ARIA, dismissal, and persistent behavior.
- Use counted fields for length limits and `BusyButtonContent` for asynchronous actions.
- Use `InlineAlert` for framed messages and `InlineMessage` for compact field-adjacent status.
- All visible copy uses i18n keys, with identical Traditional Chinese and English key structures.
- Dropdown triggers retain `aria-haspopup` and `aria-expanded`; options use the appropriate menu/listbox role and selection state.

## Adding a primitive

Add one only when existing components cannot express the contract clearly and there are at least two valid consumers. Then:

1. Place it in the correct atomic layer and preserve one-way dependencies.
2. Put general styling in an existing shared stylesheet, not domain-scoped CSS.
3. Migrate at least two consumers and remove old APIs, CSS, and compatibility residue.
4. Update the main application's `structure.md`, this page, and both languages.
5. Add `check:ui` or architecture guards that reject a hand-built regression.
6. Run `npm run verify:local`, plus integration verification when backend boundaries change.

## New UI delivery checklist

- [ ] Existing `src/components/ui/` components were checked first.
- [ ] The atomic layer and dependency direction are correct.
- [ ] The page uses `RoutePageFrame` and does not create its own viewport gutter.
- [ ] Surfaces, buttons, lists, dropdowns, dialogs, forms, and skeletons reuse primitives.
- [ ] Shadows use only control, card, or floating elevation.
- [ ] Mobile and desktop share data flow and interaction state.
- [ ] i18n, ARIA, labels, alt text, focus, and keyboard behavior are complete.
- [ ] A new primitive has at least two consumers, synchronized docs, and regression guards.
- [ ] Old APIs, CSS, and unused declarations are removed.
- [ ] `npm run verify:local` passes.
