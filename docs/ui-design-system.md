# UI 設計系統與共用元件

本頁記錄 Novae 前端（Next.js 16 App Router / React 19 / TypeScript 7 / Tailwind CSS 4）的設計系統規範與實作契約。

## 單一來源契約

| 能力 | 程式庫位置 |
| --- | --- |
| 色彩、字體、圓角、Safe Area、Viewport、三階陰影與 Accent Themes | `src/app/globals.css` |
| Timing、Easing、頁面轉場、Overlay、數字跳動與 Reduced-Motion | `src/styles/motion.css` |
| 無業務資料的基礎 UI 元件 (Radix UI / shadcn) | `src/components/ui/` |
| transitions.dev 動態配方 (`LiquidTabs`、`ResizableCard` 等) | `src/components/motion/` |
| 導覽記憶深度躍遷管理 | `src/lib/navigation-memory.ts` |
| 架構邊界與回歸檢查 | `scripts/check-ui-primitives.mjs`、`tests/architecture/` |

## 視覺與主題系統

- **字體層次**：英數字使用 Inter，繁體中文使用 HarmonyOS Sans TC，識別碼與技術日誌使用 Roboto Mono。
- **強調色主題 (Accent Themes)**：支援 Slate、Indigo、Emerald、Rose、Violet 等主題色，搭配淺色近白 Stage 與深色分層 Charcoal。
- **三階陰影規範**：嚴格限定 `--shadow-control`（控制項）、`--shadow-card`（內容卡片）、`--shadow-floating`（浮層/對話框）三階，禁止任意自訂陰影。
- **全域安全區域 (Safe Area)**：由 `AppShell` 統一管理 Viewport Gutter、手機 Safe Area 與底部導覽安全間距，內容最末項保證可完整捲出。

## 共用 UI Primitives

| 需求場景 | 優先使用元件 |
| --- | --- |
| 一般、圖標、主要與次要按鈕 | `Button`（支援 Spinner 轉圈與 Check 成功狀態） |
| 卡片、欄位與文字輸入 | `Card`、`Input`、`Textarea`、`Label` |
| 下拉選單、選擇器與分段標籤 | `DropdownMenu`、`Select`、`Tabs`、`LiquidTabs` |
| 對話框、警示彈窗與抽屜 | `Dialog`、`AlertDialog`、`Sheet` |
| 狀態徽章、載入骨架屏與空白頁 | `StatusBadge`、`Skeleton`、`PageState`、Sonner Toast |
| 討論區與留言輸入 | `CommentComposer`（支援安全底欄停靠與回覆引文）、`DiscussionSurface` |
| 數字跳動與手勢回饋 | `AnimatedCounter`、`GestureReaction` |

## 互動與動效規範

- **命名 Recipe 原則**：禁止使用粗糙的 `transition-all`，所有動效均使用命名的 Transitions 配方。
- **導覽深度記憶 (`navigation-memory`)**：為頁面切換賦予方向性（前進向左滑入、後退向右滑出），提升 App 原生質感。
- **自適應卡片 (`ResizableCard`)**：在分頁或內容切換時流暢過渡高度，消除生硬的佈局跳動。
- **手勢與即時反饋**：附議、設備回報「我也遇到」與公告按讚使用專屬手勢反饋動畫與即時數字滾動。
- **無障礙動效 (`prefers-reduced-motion`)**：當系統開啟減少動效時，自動移除非必要位移與粒子，但完整保留狀態切換的語意與清晰度。

## 交付前檢查表

- [ ] 所有按鈕、表單輸入、卡片與對話框均引用 `src/components/ui/` 共用 Primitive。
- [ ] 頁面與佈局不直接存取後端 Service，業務狀態封裝於 Hook。
- [ ] 手機版主要可點擊區域均達到 44×44px 觸控標準。
- [ ] 支援淺色、深色與不同 Accent Themes 的色彩對比無障礙要求。
- [ ] 繁體中文與英文（`src/i18n/`）字典鍵值對齊且無硬編碼文字。
- [ ] 執行 `npm run verify:local` 無任何型別或架構違規。
