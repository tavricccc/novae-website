# 成本與免費額度

以下數字在 **2026-07-23** 依各平台官方文件核對。免費方案會調整，這份估算是容量規劃，不是供應商承諾。

## 先看結論

| 使用模式 | 每位 MAU／月 | 免費層建議容量 | 主要瓶頸 |
| --- | ---: | ---: | --- |
| 輕度 | 約 60 次後端操作、1.2 MB Supabase egress | 約 2,000 MAU | Realtime 同時連線、Cloudinary 長期累積 |
| 典型校園 | 約 120 次後端操作、4.8 MB Supabase egress | **約 800–1,000 MAU** | Supabase 5 GB egress、200 條 Realtime 尖峰連線 |
| 重度 | 約 240 次後端操作、14.4 MB Supabase egress | 約 300–350 MAU | Supabase egress |

典型的 1,000 人部署可以先按 **160–200 人同時在線、兩個完整學年** 規劃。500 人部署約可保存三個完整學年。流量額度會每日或每月重置，真正會隨時間累積的是 Supabase database 與 Cloudinary 圖片。

## 估算模型

典型 MAU 假設每月活躍 12 天，每個活躍日產生 8 次登入後操作，再加 25% 的預抓、重連與 retry，合計 `12 × 8 × 1.25 = 120` 次 Cloudflare Worker／Supabase Edge 請求。平均回應以 40 KB 規劃，因此每位 MAU 每月約使用 `120 × 40 KB = 4.8 MB` Supabase egress。

媒體模型採每人每學年 5 張圖片、壓縮後平均 350 KB、每張圖片每月被讀取 4 次。圖片列先載 320×240 縮圖，完整圖只在正文或燈箱使用；Cloudflare 依「原圖＋固定 variant」計算 unique transformation，Cloudinary delivery 則只發生在 Worker edge cache 首次未命中時。

容量採免費額度的 80% 作為可營運上限，避免 retry、活動日尖峰和供應商統計差異直接造成停機。

## 各平台逐一核對

### Supabase

[Free 方案](https://supabase.com/docs/guides/platform/billing-on-supabase)包含每 project 500 MB database、每月 5 GB uncached egress、5 GB cached egress、500,000 次 Edge Function invocation、2,000,000 則 Realtime message、200 條 Realtime peak connection，並提供 50,000 MAU。

- Edge：`500,000 ÷ 120 ≈ 4,166 MAU`，不是典型情境的第一瓶頸。
- Egress：`5,120 MB ÷ 4.8 MB ≈ 1,066 MAU`；保留 20% 餘裕後約 **850 MAU**。
- Realtime：若每位 MAU 每月接收 240 則訊息，約可支援 8,333 MAU；但 200 條同時連線使尖峰更早成為限制。按 20% MAU 同時在線，約等於 1,000 MAU。
- Database：本專案可重現的一學年資料模型為 500 人 131 MB、1,000 人 187 MB（已含 50% 規劃餘裕）。因此 1,000 人保守按兩學年、500 人按三學年規劃。

Free project [連續一週沒有活動可能被暫停](https://supabase.com/pricing)，但額度本身沒有「使用幾個月後到期」的期限；持續有正式流量就不屬於閒置情況。

### Cloudflare Workers

[Workers Free](https://developers.cloudflare.com/workers/platform/limits/)提供每日 100,000 requests、每次 10 ms CPU、128 MB memory。API 與每次圖片讀取都會計入 Worker request；圖片快取命中仍算 request，但不再向 Cloudinary 回源。Worker 不執行資料庫工作。

[Cloudflare Images Free](https://developers.cloudflare.com/images/pricing/)每月包含 5,000 個 unique transformations。Novae 只使用 320×240 thumbnail 與 96×96 avatar 兩種固定變體；同一張原圖與同一組參數在同月重複讀取不重複計算。

典型每日每人 10 次請求時，理論上約 10,000 DAU；保留餘裕後約 8,000 DAU。它明顯高於 Supabase egress 上限。正式環境 observability 已改為 10% head sampling，避免每個正常 request 都產生日誌。

### Firebase

[Firebase Spark](https://firebase.google.com/pricing)的 Google／Email 等非電話 Authentication 與 FCM 為 no-cost；升級 Identity Platform 前後的 no-cost Authentication 指標皆為 50,000 MAU。[Spark instrumentless limit](https://firebase.google.com/docs/auth/limits)另列 3,000 DAU。

Novae 不使用 Phone Auth，因此簡訊費用不適用。FCM 本身不是容量瓶頸。Web App Check 使用 reCAPTCHA Enterprise，官方提供[每月 10,000 次免費 assessment](https://firebase.google.com/docs/app-check)；本專案只在通知設定／token 維護時初始化，不會為每次後端 API 呼叫做 assessment。若每位開啟推播的使用者每月初始化兩次，約可涵蓋 5,000 位推播使用者。

### Cloudinary

[Free 方案](https://cloudinary.com/documentation/billing_and_plans)每個 rolling 30-day window 有 25 credits。1 credit 等於 1,000 transformations、1 GB storage 或 1 GB image bandwidth，三者會相加。

依本文件媒體模型，1,000 人第一學年約使用：

- 1.75 GB storage = 1.75 credits。
- 每月 7 GB delivery = 7 credits。
- 約 417 次每月平均 transformation = 0.42 credits。
- 若把每次瀏覽都視為 Cloudflare 新節點首次回源，合計上限仍約 9.2 credits；實際 Worker cache hit 會降低 Cloudinary delivery bandwidth。即使以同樣保守方式把第二學年的舊圖片視為同樣熱門，上限約 18.4 credits。

因此 1,000 人約可安全支援兩學年。實際舊內容閱讀通常會下降，壽命可能更長；相反地，如果平均圖片接近 800 KB 上限或每張每月讀取超過 10 次，Cloudinary 可能提前成為瓶頸。

### Upstash Redis

[Free Redis](https://upstash.com/pricing/redis)提供 256 MB、每月 500,000 commands、10 GB bandwidth。Novae 只用它保存短效 Firebase 使用者驗證快取及寫入操作的精確業務配額，不存正式內容。

以最保守的「每次後端操作都造成一次 auth cache command，再加 10% 寫入配額」計算，典型每位 MAU 約 132 commands，約可支援 3,787 MAU。實際 Edge warm isolate 現在會在記憶體重用最多 5 分鐘、且不超過 Redis 15 分鐘的絕對驗證期限，因此通常會比這個估算低很多。

### Vercel

[Hobby](https://vercel.com/docs/plans)提供每月 100 GB Fast Data Transfer；Novae 前端是靜態 PWA，不使用 Vercel Functions。即使一次完整冷啟動傳輸按 2 MB 計算，也約有 50,000 次冷啟動／月，遠高於典型校園使用量。

Hobby 僅允許[個人或非商業用途](https://vercel.com/legal/terms)。無營利的校園部署通常符合「非商業」方向，但若部署涉及付費承包、營利或不確定的機構使用，應由部署單位確認條款或改用 Pro／其他靜態主機。

### GitHub 與 GitHub Pages

公開 repository 使用標準 GitHub-hosted runner 時，[GitHub Actions 不計費](https://docs.github.com/en/billing/concepts/product-billing/github-actions)。官方文件網站使用 GitHub Pages，其[每月 soft bandwidth limit 為 100 GB](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)，不影響 PWA 使用者容量。

若文件站單次完整傳輸為 1 MB，約等於 100,000 次完整瀏覽／月。Actions 與 Pages 沒有「幾個月後到期」，但應維持公開 repository 並遵守 Pages 用途限制。

### Notion（選用）

[Notion API](https://developers.notion.com/guides/get-started/quick-start)平均限制為每秒 3 requests；Free workspace 對個人使用為 unlimited pages／blocks，檔案上限為[每個 5 MB](https://www.notion.com/pricing)。Novae 圖片上限為 800 KB，符合單檔限制。

Notion 沒有公開的月 API request 配額；限制是吞吐量而不是人數。即使一次同步保守按 6 個 API requests，3 requests/s 理論上仍可處理約 43,000 個同步事件／日。它是選用營運副本，關閉後不影響任何核心流程，也是最直接的零成本與零維護選項。

## 已落實的成本控制

- 登入 bootstrap 合併角色、分類、版本、未讀提示與每日一次的 visit 紀錄；已刪除重複的 `recordPlatformVisit` action。
- Visit 最多每日寫入一次，不再每 6 小時更新 `last_seen_at`。
- Firebase 使用者 Redis cache 在 warm Edge isolate 內最多重用 5 分鐘，並保存絕對建立時間，避免延長 15 分鐘的撤銷檢查窗口。
- Cloudflare 正式環境只抽樣 10% observability traces；錯誤仍由應用程式明確記錄。
- 提案、設備與公告列表在 Firebase 驗證後，以 UID、Origin 與完整 request digest 隔離 30 秒 Cloudflare POP cache；命中時不呼叫 Supabase Edge，瀏覽器端仍是 `no-store`，不會跨帳號共用個人狀態。
- 列表、詳情、留言與通知有 account-scoped persistent cache、coalesced request 與 Realtime invalidation；圖片網址由 Edge 批次簽發，實際圖片內容由 Worker edge cache 共用。
- 作者公開資料以 50 筆批次讀取並保存 24 小時 IndexedDB cache；重按目前導覽 20 秒內合併，桌面詳情預抓需停留 180ms，省流／2G／背景頁與手機不做 hover 預抓。
- Outbox 只保存通知與同步需要的識別欄位，不複製完整正文；留言正文只在 Worker 實際處理該事件時依 ID 精準補讀。
- 圖片在瀏覽器先轉 WebP，限制 800 KB、2,000 px 與每種內容張數；Cloudinary preset 只保留格式與檔案大小限制，不再套用重複的 incoming resize transformation。
- Notion 內容 hash 不變時不重送，outbox、通知與刪除工作皆有 bounded retry。
- 已結案提案與設備保留完整資料 180 天，之後連同留言、個人關聯與 Cloudinary 圖片永久刪除；Notion 頁面保留作人工長期紀錄。公告永久保留，不納入這項清理。

這套策略不會依 70%／80%／90% 等額度門檻自動停用功能。供應商警示只用於通知管理員，避免流量波動自行改變前台行為。

## 何時升級

以供應商 dashboard 的實際數字為準，在 50%、75%、90% 設提醒。典型 1,000 MAU 部署最先看 Supabase uncached egress、Realtime peak connection、database size，以及 Cloudinary bandwidth／storage。只要其中一項持續兩週高於 75%，就應先找出異常重抓、圖片流量或 retry，再決定升級。
