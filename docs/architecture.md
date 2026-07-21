# 系統架構

本頁先用一條請求解釋系統，再列模組邊界。部署者不需要理解每個檔案；只有開發、資安審查或事故定位時才需要深入。

## 一次操作經過哪裡

```mermaid
flowchart LR
  U[瀏覽器 PWA] -->|Google 登入| F[Firebase Auth]
  U -->|Firebase token + action| CFW[Cloudflare Worker]
  CFW -->|來源、身分、原生 burst limit| RL[Cloudflare Rate Limiting]
  CFW -->|origin secret 轉送| E[隨機名稱 Supabase Edge Functions]
  E -->|精確業務配額／驗證快取| R[Upstash Redis]
  E -->|RPC／交易| P[Postgres + RLS]
  P -->|私有 Broadcast| U
  U -->|簽名圖片上傳| C[Cloudinary]
  C -->|簽章 callback| CFW
  P --> O[Outbox]
  O --> W[outboxWorker]
  W --> N[站內通知／FCM／Notion]
  G[GitHub Actions] --> CFW
  G --> E
  G --> V[Vercel 前端]
```

重要原則：瀏覽器不被信任；Cloudflare 先擋下 CORS、未登入、webhook 簽章與短時間刷取，Supabase Edge 再檢查精確業務配額，Postgres 仍重新授權並保存正式關係與計數。Cloudflare 不是唯一權限層。

## 前端層級

| 目錄 | 責任 |
| --- | --- |
| `views/` | 路由頁組裝與頁面級狀態，不直接存取資料 |
| `components/` | 應用 UI 與事件轉發 |
| `components/ui/` | 無業務資料、service、session 相依的共用 UI |
| `composables/` | Vue 狀態、生命週期與跨元件流程 |
| `services/` | `backendAction` 與 Supabase client 邊界 |
| `lib/` | 無 Vue 相依的純工具 |
| `types/` | 跨模組型別 |
| `generated/` | 由 API error、限流等 JSON config 產生、前端使用的型別化規則；分類不在此處 |

主要路由是提案列表／詳情、公告列表／詳情、通知、設定與管理 Dashboard。桌面與手機共用資料流，只切換 layout。

共用視覺契約位於 `src/styles/primitives.css` 與 `components/ui/`，並依 `atoms → molecules → organisms` 單向組合。`AppShell`／`ViewportFrame`／`RoutePageFrame` 統一管理 viewport gutter、safe area、內容寬度與 route page 骨架；button、card、list、dropdown、Dialog、control 由共用元件組合，陰影只分 control、card、floating 三階。列表 session 骨架與內容互斥；空列表用無 elevation 的 `EmptyStatePanel`，避免卸載後殘留卡片陰影。完整規範與新頁面清單見 [UI 設計系統](ui-design-system.md)。

手機底部導覽在已登入且角色 bootstrap 完成後的根頁與子頁持續顯示；登入過程中不提前露出底欄與側欄，避免半登入狀態。`AppShell` 讓頁面捲動視窗延伸到導覽背後，`RoutePageFrame` 與 `route-scroll-through` 再把 safe area、浮動間距及導覽高度放進內容尾端；內容可穿透導覽所在區域，捲到底時最後一項仍能完整露出。路由來源只負責返回目的地，不控制導覽列顯示；導覽 shell 與內容狀態保持分離。正式環境 Google 登入使用 Google Identity Services Token Client，再以 Firebase credential 建立 session；登入頁在使用者就緒後會等角色與分類目錄再導向預設提案分類，過程中登入按鈕維持 busy，避免重複送出。

## 本地化與錯誤契約

前端語系目錄使用 `src/i18n/messages/<locale>/<domain>.ts`，每個檔案只維護自己的功能領域，key 採短而穩定的語意名稱。繁中與英文必須擁有相同 key；前端只能用 key 查詢字串，不以中文原文反查翻譯。

`config/api-errors.config.json` 是公開 API 錯誤的單一來源，產生前端、Cloudflare Worker 與 Supabase Edge 使用的型別化契約。失敗回應只包含穩定 `code`、`requestId`，限流時另帶 `retryAfterSeconds`；後端不回傳中文、英文句子或供應商原始錯誤。前端依 `code` 對應目前語系，完整技術細節留在以 request ID／trace ID 索引的 log。

背景工作、刪除工作、Push delivery 與 maintenance 資料表只保存 `error_trace_id uuid`，不保存重複的錯誤句子。Dashboard 同樣傳回 `failed_task_codes` 與 `error_trace_id`，由前端負責顯示文字。

## 後端入口

| Function | 真實責任 |
| --- | --- |
| `n<namespace>-api` | 原始碼為 `backendAction`；角色、冪等、驗證與領域分派 |
| `n<namespace>-sync` | 原始碼為 `syncUser`；登入後同步允許網域使用者與角色 claim |
| `n<namespace>-media` | 原始碼為 `cloudinaryWebhook`；再次驗證 callback 並更新上傳狀態 |
| `n<namespace>-outbox` | 處理通知、FCM、選用的 Notion 同步與外部副作用 |
| `n<namespace>-delete` | 清除 Cloudinary 資源並同步刪除狀態 |
| `n<namespace>-maintenance` | 執行保留期、維護 RPC，並觸發 deletion/outbox workers |

公開路徑仍由 Cloudflare Worker 先驗證來源與粗限流，再轉送 Edge。每一次成功轉送都會計入 Supabase Edge Function invocation；因此冷啟動改以 `getSessionBootstrap` 一次讀取角色、分類目錄、內容版本與未讀提示，並可選擇合併平台造訪寫入。細項 action 仍保留給局部刷新與管理寫入。省用額度靠合併請求與前端快取，不把 domain 業務搬進 Worker。

## 分類設定如何生效

```mermaid
flowchart LR
  S[首次設定／系統設定] --> A[受控 backend actions]
  A --> D[(Postgres 功能開關、動態分類與指派)]
  D --> UI[前端 runtime catalog]
  D --> API[Edge 權限、流程與通知]
  API --> P[新案件規則快照]
```

分類、設備分類、平台功能開關與管理員指派以 Postgres 為單一來源。提案與設備看板都從同一 runtime catalog 選擇分類，建立與列表查詢都保存分類範圍；關閉的功能不會出現在導覽，但既有資料仍可管理。建立提案時會把隱私、留言、附議與期限規則快照到案件；分類日後調整只影響新案件。閱讀範圍與作者顯示由資料庫 trigger 鎖定，前端條件不承擔安全責任。

系統設定將功能開關與兩邊分類草稿一次寫入受控 backend action，避免只更新其中一部分。平台總管理員只由 `ADMIN_EMAILS` 產生；分類指派則是獨立的 scope 資料。新提案與新設備回報寫入個人通知給該分類明確負責人，不使用管理員廣播，因此平台總管理員不會因角色自動成為收件人。

內容與留言的作者顯示改以 UID 讀取使用者資料，避免前端另外保存可漂移的作者副本。

## 資料與副作用

Postgres 是 source of truth。需要通知、Push、Notion 或其他外部服務的交易，先在同一資料庫交易寫入 outbox，再由 worker 執行。這讓主要資料成功不依賴第三方當下是否在線，也讓失敗可以重試與追蹤。

保留期清理提案或設備時，若存在 Notion 對應頁面，會在刪除主資料的同一交易排入刪除同步事件；這類排程清理不會另發使用者通知，但仍會由正常 outbox 重試與追蹤。

圖片採兩段式流程：取得受權限控制的上傳簽名、上傳至 Cloudinary、驗證 callback、保存狀態；讀取時再依內容權限取得短效簽名 URL。

## 即時更新與驗證快取

內容、通知與通知已讀狀態透過 Supabase Realtime 的私有 Broadcast topics 傳送。topic 依校內、管理員或個別使用者分流，連線時由 `realtime.messages` RLS 驗證 Firebase 身分與角色；登入者不需要、也沒有權限直接查詢通知、通知狀態或即時事件私有資料表。Broadcast 只用來提示前端更新，Postgres 仍是 source of truth。

Edge 驗證 Firebase token 後，會將必要的使用者資料短暫保存在 Function instance 記憶體與 Upstash Redis。快取失效時才重新呼叫 Firebase，並保留過期與數量上限，減少重複外部請求而不改變每個 action 的授權檢查。

前端內容讀取會依帳號保存在記憶體與 IndexedDB，維持積極的長效快取以減少伺服器與外部服務用量。記憶體層使用有數量上限的 LRU，讀取命中會更新最近使用順序；持久層仍保留較長存活時間。每次請求攜帶 scope 與失效版本；若寫入、Realtime 或切換帳號已讓資料過期，較早完成的請求不能把舊內容重新寫回，持久層也只刪除同一寫入版本，避免誤刪後續新資料。

PWA 發現新版本後會要求 waiting Service Worker 立即接管，等待 `controllerchange` 後以版本化 URL 重新載入；watchdog 與每版本重載次數上限會終止失敗循環。更新流程不保留舊版相容分支，也不需要清除資料庫或關閉積極內容快取。

## 部署拓樸

- `main` → GitHub `production` Environment → Cloudflare Worker + Supabase production + Vercel production。
- `dev` → `development` Environment → 只有維護測試站時才建立的另一套資源。
- config 或 Supabase 變更會觸發後端；前端若同時變更會等待同 commit 後端成功。
- backend workflow 套 migration、由 GitHub secrets 自動設定 Cloudflare／Edge、部署隨機 Functions 與固定 Worker、健康檢查。
- frontend workflow 由 Vercel CLI build 並 deploy prebuilt artifacts。

完整檔案位置以主程式 repository 的 `structure.md` 為準。
