# UI 設計系統與可復用元件

本頁是 Novae 前端新增頁面、元件與視覺樣式的實作規範。目標是讓新頁面以組裝為主，並讓桌面與手機共用資料流、互動狀態與視覺語言。

## 單一來源

| 能力 | 主程式位置 |
| --- | --- |
| 色彩、圓角、動效與陰影 token | `src/styles/base.css` |
| surface、viewport、list、dropdown、Dialog、editor、skeleton | `src/styles/primitives.css` |
| 按鈕、欄位與控制項 | `src/styles/controls.css` |
| 無業務 UI 元件 | `src/components/ui/` |
| 元件位置與責任 | `structure.md` |
| 防回歸規則 | `scripts/check-ui-primitives.mjs`、`tests/architecture.test.mjs` |

領域元件不得另建近似的卡片、按鈕、陰影、dropdown、Dialog 或 viewport 樣式。既有 primitive 缺少合理能力時，先擴充原元件的 props、slots 或 callbacks。

## Atomic Design 分層

依賴方向固定為：

```text
atoms → molecules → organisms → domain components / views
```

- `atoms/`：最小視覺或互動單位，例如 `AppButton`、`AppIcon`、`TagBadge`、`SwitchIndicator`、`SkeletonBlock`、`InlineAlert`、`SelectionMark`。
- `molecules/`：可獨立復用的局部組合，例如 `SurfacePanel`、`ListSurfaceRow`、`LabeledListSection`、`SectionHeader`、`DropdownMenu`、`DialogHeading`、`DialogActionRow`。
- `organisms/`：可直接供 route view 或領域元件填資料與 slots 的完整區塊，例如 `RoutePageFrame`、`DialogShell`、`ContentListState`、`DetailPageShell`、`ContentCardSkeleton`、`EntryComposerShell`。

低層不得 import 高層；molecule 不得依賴 organism。所有 UI 層都不得讀取 service、session 或業務資料。

## 新頁面組裝順序

1. 使用 `RoutePageFrame` 決定 flow/fill、垂直 padding 與 bottom safe area。
2. 先找涵蓋列表、詳情、Dialog、Composer 或 loading state 的 organism。
3. 用 `SurfacePanel`、`SectionHeader`、`LabeledListSection` 等 molecule 組成區塊。
4. 最後才以 atom 補上按鈕、icon、標籤、訊息與 skeleton。
5. route 組裝與頁面級狀態留在 `views/`，流程進 composable，資料邊界只經 service。

Route view 不得自行增加另一套頁面級 `px-*`、`left-*`、`right-*`、safe-area 計算或 max-width。這些由 `AppShell`、`ViewportFrame` 與 `RoutePageFrame` 統一負責。

## 常見需求對照

| 需求 | 優先使用 |
| --- | --- |
| 頁面骨架、左右留白與安全區 | `RoutePageFrame`、`ViewportFrame` |
| 一般、icon、toolbar、主要與次要按鈕 | `AppButton` |
| 卡片、控制框、浮動層、內嵌區、列表外殼 | `SurfacePanel` |
| grouped list 與設定列 | `ListSurfaceRow`、`IconListRow`、`LabeledListSection` |
| dropdown 與項目 | `DropdownMenu`、`DropdownPanel`、`dropdown-item` |
| Dialog | `DialogShell`、`DialogHeading`、`DialogActionRow` |
| 列表載入、空白、錯誤與更多內容 | `ContentListState`、`EmptyStatePanel`、`PageLoadFailure` |
| 卡片與詳情骨架 | `ContentCardSkeleton`、`SkeletonDetail`、`SkeletonBlock` |
| 字數限制輸入 | `CountedTextField`、`CountedTextareaField` |

相同結構若只差字串、icon、狀態、slot 或 callback，必須共用；不要複製近似元件。

路由頁的 session 骨架與實際列表必須互斥（`v-if` / `v-else-if` 同一鏈），不得在 skeleton 仍掛載時同時渲染 `IssueBoard` 等內容。空列表使用 `EmptyStatePanel` 時 icon tile 預設 `elevation="none"`，避免空白頁看起來像殘留卡片。列表初次載入與向下載入更多都使用 skeleton；`.skeleton-card`／`.skeleton-enter` 進場只允許 opacity，不對 skeleton 使用 transform，以免卸載後留下合成陰影。系統設定的分類流程與人員權限載入中也改為 skeleton，不使用純文字「載入中」。

## Surface 與陰影

陰影只有三階：

| Token / class | 用途 |
| --- | --- |
| `--shadow-control` / `shadow-control` | 按鈕、欄位、icon tile、小型互動控制 |
| `--shadow-card` / `shadow-card` | 內容卡片與大型穩定表面 |
| `--shadow-floating` / `shadow-floating` | Dropdown、toast、浮動導覽與最上層浮動表面 |

禁止 arbitrary shadow、第四套 elevation 名稱，以及在領域元件重複拼出 `rounded + border + background + shadow` 的卡片。`SurfacePanel` 的 `control`、`card`、`floating`、`inset`、`list` variant 應表達表面的語意。空白狀態與說明性 icon 不應使用 card elevation。

## Dialog、表單與回饋

- Dialog 統一由 `DialogShell` 管理 overlay、focus trap、body scroll lock、ARIA、dismiss 與 persistent 行為。
- 有最大字數的輸入使用 counted field；非同步按鈕內容使用 `BusyButtonContent`。
- 有框線背景的訊息使用 `InlineAlert`；欄位附近的精簡狀態使用 `InlineMessage`。
- 可見文字一律使用 i18n key，繁中與英文 key 結構必須一致。
- dropdown trigger 保留 `aria-haspopup`、`aria-expanded`；選項使用合適的 menu/listbox role 與選取狀態。

## 何時新增 primitive

只有在現有元件無法清楚表達，且至少有兩個合理使用點時才新增。完成時必須：

1. 放入正確的 atomic tier，並維持單向依賴。
2. 通用樣式進既有 shared stylesheet，不放在領域 scoped CSS。
3. 遷移至少兩個使用點並刪除舊 API、CSS 與相容殘留。
4. 更新主程式 `structure.md`、本文件與雙語文件。
5. 補 `check:ui`／架構測試規則，阻止手刻版本回歸。
6. 執行 `npm run verify:local`；若涉及後端邊界再執行整合驗證。

## 新 UI 交付檢查表

- [ ] 已先搜尋 `src/components/ui/`，沒有重複既有元件。
- [ ] Atomic tier 與依賴方向正確。
- [ ] 頁面使用 `RoutePageFrame`，沒有自行建立 viewport gutter。
- [ ] Surface、按鈕、列表、dropdown、Dialog、表單與 skeleton 使用既有元件。
- [ ] 陰影只使用 control、card、floating。
- [ ] 手機與桌面共用資料流與互動狀態。
- [ ] i18n、ARIA、label、alt、focus 與 keyboard 行為完整。
- [ ] 新 primitive 有至少兩個使用點，文件與架構規則已同步。
- [ ] 已清除舊 API、CSS 與未使用宣告。
- [ ] `npm run verify:local` 通過。
