# 貢獻指南

本頁是唯一以本機開發為主的文件。只想部署 Novae 的人不需要執行這些指令，請從[部署準備與服務設定](quick-start.md)開始。

## 1. 準備本機

需要 Git、Node.js 24 與 npm。涉及 Edge Function 型別時，專案依賴會提供 Deno；涉及本機 Supabase 才需要 Docker。

```bash
git clone https://github.com/<your-account>/novae.git
cd novae
npm ci
```

只有要連接開發服務時才複製 `.env.example` 為未追蹤的 `.env`。不得提交真實值。

## 2. 修改前

1. 讀主 repository 的 `AGENTS.md` 與 `structure.md`。
2. 確認工作樹已有的變更，不覆蓋無關內容。
3. 依 `views → components → composables → services/lib` 邊界修改，不另起平行 API。
4. 新增、刪除、搬移或拆分檔案時同步更新 `structure.md`。

## 3. 本機執行

```bash
npm run dev
```

需要完整且不連正式服務的互動測試環境時，使用單一入口：

```bash
npm run test:env
```

它會啟動隔離的 Supabase、Edge Functions、Firebase Auth Emulator、Cloudflare gateway 與 Vite，並在登入、custom claims、平台總管理員與 Setup 前置檢查成功後顯示 Ready。可在 Auth Emulator 建立任意 `@integration.invalid` 測試帳號；按 `Ctrl+C` 會關閉整組服務。本機 emulator debug log 是產物，不應提交。自動整合驗證另會啟動隔離的 Upstash 與外部服務收件器，用來檢查 FCM topic／token 推播、Cloudinary 刪除與保留期清理，不連正式 provider。新增高頻讀取時優先考慮併入 `getSessionBootstrap` 或前端快取，避免冷啟動再多一次 Edge invocation。

只有要驗證 migration 與本機 Supabase 時才使用：

```bash
npm run db:start
npm run db:reset:local
npm run db:lint:local
```

## 4. 驗證

```bash
npm run verify:local
```

這個入口會依序執行型別與未使用宣告檢查、雙語與 UI primitive 規則、lint、production build、建置體積預算、Worker／Edge 型別、Vitest 單元測試、架構測試與完整 npm audit。建置預算目前限制 production 字型最多 160 個／9.2 MiB、JavaScript 1.3 MiB、CSS 550 KiB；若確實需要調高，PR 必須說明產品理由與量測結果，不可直接移除門檻。

若修改後端 action、權限、RPC、RLS、migration、Edge Function 或 worker：

```bash
npm run verify:integration
```

大型變更或合併前執行：

```bash
npm run verify:all
```

權限、分類、提案、設備、公告或功能開關的使用者流程，可單獨執行真實 Chromium E2E：

```bash
npm run test:e2e:install
npm run test:e2e
```

第一次只需安裝一次瀏覽器。E2E 會自動重建隔離環境，透過真實 UI 完成 Setup、建立多個測試帳號與兩組分類，並在桌面及手機 viewport 驗證按鈕顯示／隱藏、實際點擊結果、跨分類隔離、權限撤銷／恢復、分類生命週期與提案／設備四種開關組合。測試登入橋接只允許開發模式、loopback Auth Emulator 與 `@integration.invalid` 帳號，production build 不會開放。

多人、多分類、多權限與完整內容流程的壓力矩陣使用：

```bash
npm run verify:stress
```

預設會從實際 runtime catalog 展開多名使用者與重疊權限，涵蓋每個提案／設備分類、圖片、巢狀留言、附議／我也遇到、通知、狀態、多人管理與分類新增／刪除，不以固定分類數或單一帳號代替壓測。

PR CI 會自動執行本機靜態／單元、後端整合與真實瀏覽器 E2E 三層驗證。Windows 直接在 PowerShell 執行 npm 指令即可；整合與 E2E 環境會自動轉入 WSL。Windows 需要 WSL 2、Docker，以及 WSL `PATH` 內的 Supabase CLI 與 Deno；Linux 與 CI 不需要 WSL。

整合驗證會重建隔離的本地 Supabase、套用全部 migration、執行 database lint，再檢查 action、權限、RLS、冪等與 worker lifecycle。外部服務測試器可注入 FCM 暫時失敗，必須實際斷言 delivery 留在持久化佇列、退避後重試成功且 payload 清除。`.env.local` 可省略；即使存在，Supabase 網址與金鑰也會強制換成本地值，不會寫入遠端資料。

### 何時補整合測試

| 修改 | 必須補的案例 |
|---|---|
| 新 backend action | 成功行為與相關拒絕行為；漏掉 action 時 coverage guard 會失敗 |
| 新角色／權限 | allowed、denied；有 scope 時再測 scope 內與 scope 外 |
| 權限授予／撤銷 | grant 後允許、revoke 後立即拒絕讀寫、其他 scope 不受影響、負責人列表同步移除 |
| RPC／schema／migration | 對真實本地資料庫的結果 assertion |
| RLS | 依適用範圍測 anon、authenticated、service role |
| 冪等寫入 | 缺少 request ID、首次執行、相同 ID replay |
| worker／outbox／刪除工作 | claim、完成或失敗、retry／deduplication |
| composable／瀏覽器儲存／元件互動 | 在 `tests/unit/` 補 Vitest 成功與失敗情境 |
| 權限型 UI／功能開關 | 以表格化矩陣測 visible、hidden、disabled 與 click／emit；至少涵蓋一般人、owner、正確 scope、錯誤 scope、平台管理員及所有開關組合 |
| 純前端版面 | 通常不需補整合測試，跑 `verify:local` |

不得只加入沒有 assertion 的 action 呼叫來通過 coverage guard。新增案例放進 `tests/integration/` 最接近的領域檔案；若建立新領域檔，也要加入 `action-coverage.test.ts` 的掃描清單。

權限判斷不得只在元件內複製。角色／permission／分類 scope 使用 `src/lib/session-access.ts`，提案／設備開關與路由使用 `src/lib/feature-access.ts`；元件行為測試與後端整合測試必須同時保護 UI 呈現與真正授權，避免只藏按鈕卻仍可呼叫 API，或後端已拒絕但畫面仍提供操作。

大型測試檔使用薄入口依領域匯入案例，共用帳號、fixture、page object 與 emulator helper 集中在同層 `support`／`helpers`。單一檔案接近 400 行時檢查責任，不能讓不同權限領域、worker、RLS 與 UI 流程繼續堆進同一支數千行腳本。

## 5. 共用 UI 規範

完整的 Atomic Design 層級、元件對照、陰影契約與新頁面清單見 [UI 設計系統](ui-design-system.md)。本節只保留貢獻時必須遵守的邊界。

主程式的視覺 primitive 以 `src/styles/primitives.css` 與 `src/components/ui/` 為單一來源。提案、公告、設備、通知、我的與管理頁可以保留資料欄位和狀態差異，但不得各自維護近似的 viewport、button、card、list、dropdown、shadow 或 control。

| 需求 | 規範入口 |
|---|---|
| 頁面左右留白、safe area、內容最大寬度 | `AppShell`／`ViewportFrame`／`RoutePageFrame` |
| 三領域詳情桌面雙欄與手機單一內容流 | `DetailPageShell`；桌面不得再包外層卡片，手機不得恢復 segmented tabs |
| 一般按鈕、icon、toolbar、主要與次要動作 | `AppButton` 或既有 `button-*` variant |
| 卡片、控制表面、浮動層、內嵌區塊 | `SurfacePanel` 或 `surface-control`／`surface-card`／`surface-floating`／`surface-inset` |
| 群組列表與可互動列 | `list-surface`、`list-surface-row` |
| 頁面 Tabs、互斥選項與等寬分段控制 | `AppButton` 語意化 Tabs、`SelectionOptionButton`、`PillSegmentedControl` 的 `adaptive`／`equal` layout |
| dropdown 與項目 | `DropdownMenu`／`DropdownPanel`、`dropdown-item` |
| 複合輸入與 footer | `field`、`control-frame`、`control-footer` |
| 詳情進度／操作／時間、embedded 留言與關閉態 | `DetailActionGroup` summary、`OperationTimeList`、`CommentThreadPanel embedded`、`CommentComposer disabled/mobileDocked` |

手機詳情的正文、actions 與討論串共用 `DetailPageShell` 外層 scroll root；infinite scroll 在 embedded 模式解析該外層，不得新增留言內層 overflow。桌機與手機 Composer 共用同一個 pill control；dock 必須沿用 Bottom Tab、safe-area 與 viewport gutter tokens，composer／回覆提示後方必須以不透明 surface 阻擋捲動內容，回覆摘要維持單行截斷。設備只允許純展示的 `UnavailableCommentDiscussion`，不得因此加入設備留言 action、service、Realtime、通知或資料表。

陰影只有 control、card、floating 三階，分別使用 `--shadow-control`、`--shadow-card`、`--shadow-floating`。不得加入 arbitrary shadow、在 route view 自行加頁面級左右 padding、用固定 `left-*`／`right-*` 模擬 safe area，或手組另一個近似卡片。

相同結構若只差字串、icon、狀態、slot 或 callback，先擴充既有 primitive 的 props／slots。只有至少兩個合理使用點、且現有 primitive 無法清楚表達時才新增；新增後必須同步 `structure.md`、架構測試與本頁雙語文件。`npm run verify:local` 內的 `check:ui` 會阻止已知的平行樣式重新出現。

## 6. Config 變更

修改 `config/rate-limits.config.json` 或 `config/api-errors.config.json` 後執行：

```bash
npm run generate:all
```

提交原始 JSON 與所有產生檔。分類是 migration 與受控 backend action 管理的 runtime 資料，不再有分類 codegen。API error code 必須同時符合前端、Cloudflare 與 Edge；精確業務限流由 JSON 產生給 Supabase，Cloudflare 原生 burst limit 則由 `wrangler.toml` 維護。不要手改 `generated/`。

語系 catalog 依 `src/i18n/messages/<locale>/<domain>.ts` 拆分；檔名就是 key 的第一段 domain。新增或搬移 key 時必須同步繁中與英文，key 使用短而穩定的語意名稱，不用完整句子、hash 或中文原文作 key。

背景錯誤若需落地，只保存原生 `uuid` 型別的 `error_trace_id`，完整內容寫入 log。schema 變更以新 migration 搬移並移除舊欄位／RPC overload，不修改已部署 migration，也不保留雙格式相容層。

## 7. Pull request

PR 應說明問題、修改範圍、驗證結果、UI／資料／權限影響。schema 變更新增 migration，不修改已部署 migration；安全問題依 `SECURITY.md` 私下回報。
