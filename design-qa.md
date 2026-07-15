# Design QA

- Source screenshots:
  - `C:/Users/tavri/AppData/Local/Temp/codex-clipboard-c4513806-e25d-4b2b-a3ab-daeb4061840d.png`
  - `C:/Users/tavri/AppData/Local/Temp/codex-clipboard-ec897f47-45dc-4a59-abf0-9b7f47e34d0f.png`
  - `C:/Users/tavri/AppData/Local/Temp/codex-clipboard-78644094-afb0-45af-a56d-b57eb4f8f58b.png`
- Product source of truth: current `novae` app components for proposal cards, announcement cards, detail shells, action footers, sidebar create entry, and mobile navigation.
- Implementation screenshots:
  - `C:/Users/tavri/AppData/Local/Temp/novae-landing-final-214.jpg`
  - `C:/Users/tavri/AppData/Local/Temp/novae-cards-final-214.jpg`
- Side-by-side comparisons:
  - `C:/Users/tavri/AppData/Local/Temp/novae-landing-compare-214.png`
  - `C:/Users/tavri/AppData/Local/Temp/novae-cards-compare-214.png`
- Viewport: 1280 × 720, Traditional Chinese.

## Comparison results

1. Removed both pencil-character illustrations and the two circled Hero color planes. The ceramic/acrylic sculpture remains as the only restrained decorative object.
2. Replaced the Hero proposal strips with the same vertical card structure used by the desktop proposal board. Both cards remain fully inside the viewport.
3. Removed the fixed title height that introduced a false blank line between proposal title and author.
4. Matched proposal cards to the app hierarchy: status/date/menu header, avatar/title/author, inset support panel, and bottom comment/support actions.
5. Matched announcements to the app's independent announcement page and removed the invented page-level publish button; creation remains in the global sidebar entry.
6. Matched the proposal detail footer to the app's support progress, action row, danger text action, and multi-item operation timeline. The comment composer remains the app's flat bottom input.
7. Rebuilt `06 / 實際介面` as a clean desktop/mobile grid with no overlap, no crop, and no 3D-compositor background artifacts.
8. Removed the left chapter rail and restored the Novae naming story as its own spacious section.
9. Replaced the sculpture with a verified RGBA asset whose transparent pixels surround the object, so its shadow follows the ceramic silhouette instead of the former rectangular canvas.
10. Replaced mock-interface letter avatars with low-saturation image portraits and changed every website BrandMark asset to warm black.
11. Static source matching now reflects the app's icon-only mobile create action, notification icon mapping, narrower announcement-card grid, and detail-page action hierarchy.
12. Hero transforms that caused composited text and image softening were removed; the ceramic asset now sits at the right behind the proposal cards.

## Result

final result: blocked — the latest visual comparison was intentionally skipped at the user's request; static checks remain available and the user will inspect the rendered result.
