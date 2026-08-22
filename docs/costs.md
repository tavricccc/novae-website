# 成本與免費額度

以下數字依據 2026 年各平台最新官方計費文件核對。Novae 採用高度最佳化的輕量無伺服器架構，典型校園在完整免費額度下即可穩定營運數個學年。

## 免費層容量總覽

| 使用情境 | 每位 MAU 負載預估 | 免費層建議承載容量 | 主要考量指標 |
| --- | ---: | ---: | --- |
| 輕度校園 | 約 60 次 API 請求、0.5 MB 資料流量 | 約 3,000 MAU | Cloudinary 圖片累積 |
| 典型校園 | 約 120 次 API 請求、1.5 MB 資料流量 | **約 1,000–1,500 MAU** | Neon 512 MB 儲存空間、Cloudinary 25 Credits |
| 重度活躍 | 約 240 次 API 請求、4.0 MB 資料流量 | 約 600–800 MAU | 圖片上傳頻率與頻寬 |

以一所 1,000 位活躍學生的典型學校為例，免費方案可完整支援 **2–3 個完整學年** 的運作；配合 180 天結案自動清理排程，儲存空間可長期維持在安全水位。

## 各雲端服務免費額度逐一核對

### 1. Neon (Serverless PostgreSQL 17)
- **免費配額**：0.5 GiB (512 MB) 儲存空間、每月 100 Compute Unit (CU) hours。
- **容量分析**：Novae 的資料庫 Schema 經過高度正規化與索引精簡，一學年 1,000 位活躍學生的資料量（提案、設備、留言、審計日誌）約使用 80–120 MB。
- **生命週期保護**：內建的 180 天已結案排程清理與 365 天審計日誌輪替，確保資料庫不會隨時間無限制膨脹。

### 2. Cloudflare (Workers, Hyperdrive, Queues, Durable Objects, Turnstile)
- **Workers**：每日 100,000 次請求免費（每月約 3,000,000 次），遠高於千人校園每月約 120,000–200,000 次 API 請求。
- **Hyperdrive**：目前包含於 Workers 免費方案中，提供與 Neon 之間的連線池化與查詢快取。
- **Queues (`novae-jobs`)**：每月 1,000,000 次操作免費，負責處理非同步通知與清理排程。
- **Durable Objects**：提供 WebSocket 即時中繼與原生物理限流。
- **Turnstile**：提供免費無限制人機驗證請求。

### 3. Firebase (Google Auth, App Check, Cloud Messaging)
- **Firebase Auth**：Spark 方案提供每月 50,000 MAU 免費 Google 登入。
- **Firebase Cloud Messaging (FCM)**：Web Push 推播完全免費，無訊息數量限制。
- **Firebase App Check**：reCAPTCHA Enterprise 每月提供 10,000 次免費評估。

### 4. Cloudinary (圖片託管與處理)
- **免費配額**：每月滾動 25 Credits（1 Credit = 1 GB 儲存 或 1 GB 頻寬 或 1,000 次 Transformation）。
- **容量分析**：
  - 客戶端在瀏覽器端透過 WASM 壓縮為 WebP（平均單圖約 150–300 KB）。
  - Cloudflare Worker Media Gateway 提供邊緣快取，重複訪問同一圖片不消耗 Cloudinary 下載頻寬。
  - 1,000 人校園每月約消耗 3–6 Credits，安全支援多個學年。

### 5. Vercel (Next.js PWA 前端)
- **Hobby 方案**：每月 100 GB Fast Data Transfer。Novae 前端為預編譯 PWA 靜態 Bundle 與 Service Worker 快取，千人校園每月靜態傳輸量小於 10 GB。

### 6. GitHub Actions
- 公開開源 Repository 享有免費的標準 GitHub-hosted Runner 執行時間，每日資料庫加密備份與 CI/CD 流程無額外費用。

### 7. Notion（選用營運副本）
- Notion API 免費方案提供每秒 3 次請求，檔案大小上限 5 MB，完全滿足選用之營運副本同步需求。

## 已落實的成本控制設計

1. **連線池化與單一後端**：Cloudflare Hyperdrive 池化連線避免 Postgres 連線耗盡；收斂至 Worker API 消除多餘跨服務跳轉。
2. **冷啟動合併讀取**：登入 bootstrap 合併角色、分類、內容版本與未讀提示，單次請求完成全部初始化。
3. **客戶端 WebAssembly 壓縮**：圖片在瀏覽器端預先完成 WebP 轉換，大幅降低上傳流量與雲端儲存消耗。
4. **Media Gateway 邊緣快取**：Worker 代理圖片傳送並啟用公開/私有邊緣快取，極大化降低 Cloudinary 回源次數。
5. **資料保留與自動清理 (Data Retention Lifecycle)**：自動清理 180 天過期結案案件、過期審計日誌與無效推播 Token，保持儲存容量精簡。
