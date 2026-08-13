# UI 設計系統與共用元件

本頁記錄 Novae Next.js／React 前端的實作契約。完整視覺方向位於主程式 `DESIGN.md`；新頁面必須組合既有 token 與 primitive，不得建立領域專用的平行設計系統。

## 單一來源

| 能力 | 主程式位置 |
| --- | --- |
| 色彩、字體、圓角、safe area、viewport、surface 與三階陰影 | `src/app/globals.css` |
| timing、easing、route、overlay、數字、反應、載入與 reduced-motion | `src/styles/motion.css` |
| 無業務資料的 shadcn／Radix 元件 | `src/components/ui/` |
| 可復用的數字、文字、清單與反應動效 | `src/components/motion/` |
| 元件位置與責任 | `structure.md` |
| 回歸防線 | `scripts/check-ui-primitives.mjs`、`tests/architecture/` |

頁面與領域元件不得自行建立另一套 button、card、field、dropdown、dialog、navigation、shadow 或 motion。primitive 缺少合理能力時，先擴充既有 props、children 或 callback。

## 架構邊界

- `src/app/` 只組裝 App Router 頁面與 layout，不直接存取 service。
- `src/components/` 顯示領域資料並轉發事件；流程與非同步狀態進 `src/hooks/`。
- `src/components/ui/` 不 import service、session 或領域 hook。
- `src/lib/` 保持無 React 相依，`src/services/` 是 API、Supabase 與 Edge 邊界。
- 手機與桌面共用同一份資料流與互動狀態，只切換 layout。

## 視覺契約

- 英數使用 Inter，繁中使用 HarmonyOS Sans TC，識別碼與營運資料才使用 Roboto Mono。
- 淺色使用近白 stage 與白色 surface；深色使用分層 charcoal。Logo 在淺色為白底黑字，深色相反。
- 陰影只有 `--shadow-control`、`--shadow-card`、`--shadow-floating` 三階。禁止 arbitrary shadow 或在領域元件手組近似卡片。
- 圓角依控制、卡片與浮動層分級；pill 只用於分段控制、導覽與確實需要的緊湊控制。
- viewport 左右留白與 safe area 由 `AppShell` 和全域 token 統一提供；route page 不再增加另一套頁面 gutter。
- 全域隱藏捲動條只改視覺，不能移除 wheel、touch、keyboard 或程式捲動能力。

## 共用元件

| 需求 | 優先使用 |
| --- | --- |
| 一般、icon、主要與次要按鈕 | `Button` 的既有 variant／size |
| 卡片、欄位與文字輸入 | `Card`、`Input`、`Textarea`、`Label` |
| 下拉、選擇與分段控制 | `DropdownMenu`、`Select`、`Tabs`、`LiquidTabs` |
| 對話框與手機浮層 | `Dialog`、`AlertDialog`、`Sheet` |
| 狀態、載入、空白與錯誤 | `StatusBadge`、`Skeleton`、`PageState`、Sonner toast |
| Markdown、圖片與留言 | 共用 composer fields、content renderer、discussion surface |
| 數字、文字、反應與清單變化 | `components/motion/` 既有 wrapper |

結構只差字串、icon、狀態或 callback 時必須共用同一元件。列表卡片只有在整張可點擊時才有克制的 hover；不可點擊卡片不位移、不上浮。

## 響應式與觸控

- Desktop 顯示完整側欄，寬度足夠的列表可使用兩欄；mobile 使用單欄與底部導覽。
- 手機以目前頁面標題作為 header 脈絡，不建立重複的第二列標題或通知入口。
- 主要手機控制至少 44×44px，包含返回、分享、更多操作、反應與底部導覽。
- Hover 必須位於 `(hover: hover) and (pointer: fine)`；觸控使用 active feedback，不能依賴 hover 才能發現功能。
- 使用 `100dvh`、`viewport-fit=cover` 與 safe-area token；固定或 sticky 控制不得遮住最後一筆內容。
- 字串在 320px、英文長文與放大文字時仍須完整容納，不以 viewport 寬度縮放字級。

## 內容與互動

- 功能名稱與狀態文字由 i18n key 統一；繁中與英文 key 結構一致，不在不同頁面使用不同稱呼。
- 提案附議與設備「我也遇到」使用手勢反應；公告按讚使用愛心。啟用時播放各自粒子與數字動畫，不插入通用 spinner/check 取代 icon。
- 留言是一個連續討論區，不將每則留言做成獨立卡片；composer 放在實際回覆位置並顯示 reply context。
- 作者只在目前使用者有權限讀取時顯示；可見時頭像與姓名放在時間前方。
- 一般 mutation 原地更新 React state，不用整頁 reload 表達成功。

## 動效

- 動效只傳達狀態、層級或內容變化，使用命名 recipe，不使用 `transition-all`。
- 非互動 surface 保持靜止；方向箭頭可輕微位移，hover 底色只改一個克制層級。
- Route 只動畫內容區，App shell 保持固定；選取、數字、載入、成功、dialog、dropdown 與 toast 使用各自 recipe。
- `prefers-reduced-motion` 必須保留狀態清晰度，同時移除非必要 transform、blur 與粒子位移。

## 新 UI 交付檢查表

- [ ] 已先搜尋 `src/components/ui/` 與 `src/components/motion/`，沒有重複現有能力。
- [ ] 頁面沒有直接 import service，流程位於 hook。
- [ ] viewport、surface、按鈕、列表、dropdown、dialog 與表單沿用共用 primitive。
- [ ] 陰影只使用 control、card、floating。
- [ ] 手機 44px 觸控、safe area、無橫向溢位與 touch hover 已驗證。
- [ ] i18n、ARIA、label、alt、focus 與 keyboard 行為完整。
- [ ] 新 primitive 有至少兩個使用點，文件、`structure.md` 與架構規則同步。
- [ ] 已清除舊 API、CSS 與未使用宣告。
- [ ] `npm run verify:local` 通過；大型交付再跑 `npm run verify:all`。
