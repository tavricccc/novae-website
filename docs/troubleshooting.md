# 一步一步排錯

先找「第一個失敗的階段」。不要看到網頁錯誤就同時重設 Firebase、Supabase 與 Vercel；那會讓問題更難追。

## 1. GitHub workflow 失敗

1. 打開該 run。
2. 找第一個紅色 step，不要只看最後的 cancelled step。
3. 若訊息是 `Missing deployment secrets` 或 `Missing Supabase backend secrets`，回到 `production` Environment 對照[憑證填寫表](environment-configuration.md)。
4. 若是 Supabase link／db push，確認 token、project ref、DB password 屬於同一 project。
5. 若是 generated config diff，確認 JSON 符合[真實 schema](configuration.md#真實-schema)，並提交產生檔。
6. 若上游已發布修正，先在 fork 按 `Sync fork → Update branch`，確認最新 commit 已出現，再執行新 run；不要只重跑舊 commit。
7. 修正後重新執行失敗的 workflow。

### `Invalid Function name`

先確認 fork 已同步包含 Function 名稱正規化的最新版。現行 workflow 會自動部署 `n<EDGE_FUNCTION_NAMESPACE>-api` 等名稱，固定的 `n` 確保第一個字元是英文字母。不要自行把 namespace 加上空白、連字號或大寫，也不要手動建立六個 Function 名稱。

### Cloudflare smoke test `500`／`1101`

`1101` 代表 Worker 執行時發生例外，不是一般 CORS 拒絕。

1. 確認八個 Worker 執行值都已由最新版 backend workflow 同步。
2. 打開 Cloudflare `Workers & Pages → novae-api → Logs` 查看第一個 exception。
3. 第一次建立 Worker或剛更新 secret 時，Cloudflare 節點可能短暫讀到舊版本；最新版 workflow 會重新部署並對暫時性錯誤重試。
4. 若持續發生，記錄 exception、時間與 request ID，不要公開 token。

### Cloudflare smoke test `403 origin-denied`

1. 打開 fork 的 `Settings → Environments → production`。
2. 找 `ALLOWED_ORIGINS`。
3. 確認它與瀏覽器 Console 顯示的 `from origin 'https://…'` 完全相同。
4. **刪掉最後一個 `/`**。正確是 `https://school-novae.vercel.app`，不是 `https://school-novae.vercel.app/`。
5. 確認沒有引號、路徑或多餘空白。
6. 重新執行 `Deploy Supabase Backend`；只更新 GitHub secret 不會改變已部署 Worker。

Cloudflare secret 更新可能有短暫傳播時間；最新版 workflow 對暫時性的 `403 origin-denied` 會重試。如果 run 最後仍為 403，通常就是值本身不完全相同。

## 2. 網頁打不開或空白

1. 確認 frontend workflow 成功並取得 deployment URL。
2. 檢查 Vercel project、org ID、project ID 是否相符。
3. 檢查 build log 是否缺少必要 `VITE_*`。
4. 若自訂路徑重新整理 404，確認 repository 的 `vercel.json` rewrites 沒被移除。
5. 若只有舊畫面，先保持頁面開啟等待 Service Worker 接管；更新流程會自動以版本化 URL 重載且限制重試。只有 watchdog 明確失敗時才手動重新整理一次，不要先清除網站資料、內容快取或任何資料庫。

## 3. 無法登入

1. Firebase Google provider 是否啟用。
2. 正式網域是否加入 authorized domains。
3. `VITE_ALLOWED_DOMAIN` 與 `ALLOWED_DOMAIN` 是否完全相同。
4. Web App config、`FIREBASE_PROJECT_ID`、`FIREBASE_WEB_API_KEY`、service account 是否來自同一 project。
5. 若剛啟用 App Check，暫時確認 site key 與網域是否正確；不要用關閉所有後端驗證當永久修法。
6. 若 popup 被瀏覽器阻擋，系統會改用 redirect；回到站內後若顯示「登入回復逾時」或「登入元件初始化失敗」，先重新整理一次，再檢查 Firebase authorized domain 與 Web App config。

## 4. 登入成功但資料操作失敗

1. 先看 Network 中 `https://novae-api.<子網域>.workers.dev/v1/actions` 的 HTTP status 與 request ID。
2. 全部 401／403：檢查 Firebase token、允許網域、service account 與使用者是否重新登入。
3. 只有管理操作 403：檢查 `ADMIN_EMAILS` 並重新登入刷新角色。
4. 只有特定分類看不到：比對 `readAccess`、狀態與使用者是否作者；這可能是正確權限。
5. 429：查看 Upstash 與 `rate-limits.config.json`，先判斷是正常保護還是設定過低。

API 錯誤 body 使用機器可讀契約：`error.code` 是穩定錯誤碼、`error.requestId` 是查 log 的追蹤值，429 另有 `error.retryAfterSeconds`。後端不會回傳中文說明或完整供應商錯誤；畫面文字由前端語系目錄產生。回報問題時請提供 code、request ID 與發生時間，不要要求把原始 exception 暴露到瀏覽器。

### 瀏覽器顯示 CORS／`net::ERR_FAILED`

若 Console 顯示：

```text
Response to preflight request doesn't pass access control check
No 'Access-Control-Allow-Origin' header
```

依序檢查：

1. Console 的 `from origin` 是否就是 `ALLOWED_ORIGINS`。
2. `ALLOWED_ORIGINS` 是否包含 `https://`。
3. **最後是否多了一個 `/`；有就刪掉。**
4. 是否誤填成 Worker URL，而不是 Vercel 前端 Origin。
5. 更新 GitHub production secret 後，是否重新執行 backend workflow。

正確預檢應回 `204`，`Access-Control-Allow-Origin` 應等於 Vercel Origin。

### API `502` 或 `503`

- `502`：Worker 無法完成 Supabase origin 請求。確認 backend workflow 已成功部署同一個 namespace 的六個 Functions。
- `503 rate-limit-provider-unavailable`：Upstash REST URL／token 錯誤或 Upstash 暫時無法使用。系統會 fail closed，不會略過限流直接進 Supabase。

## 5. 附議人數或天數不對

1. 打開目前部署 commit 的 `config/issue-categories.config.json`。
2. 確認該分類的 `support.enabled`、`support.goal`、`support.deadlineDays`。
3. 確認 config commit 同時觸發且成功完成 backend 與 frontend workflow。
4. 不要把 landing mockup 或文件範例值當成執行時設定；真正來源只有 config。
5. 既有提案若在規則變更前建立，先查資料與 migration 設計，不要直接改歷史資料。

## 6. 圖片卡住

1. 確認四個 Cloudinary 值來自同一 Product Environment。
2. `CLOUDINARY_WEBHOOK_SECRET` 是否等於 API secret。
3. 檢查 `cloudinaryWebhook` log 是否簽章失敗。
4. 檢查圖片是否超過來源大小、張數或每日限額。
5. 不要為了測試把私密資源改成公開。

## 7. 通知或 Notion 沒有更新

1. 先確認站內通知資料是否已建立。
2. 查看 outbox backlog 與最舊事件。
3. 檢查 `outboxWorker` log。
4. Push：確認 VAPID key、瀏覽器權限、FCM token 與 service account。
5. Notion：確認 database 已分享給 integration，token 與 database ID 同 workspace；若 database 有多個 data source，確認 `NOTION_DATA_SOURCE_ID` 已設定且確實屬於該 database。
6. 修正後讓 worker 重試；不要手動重送大量事件造成重複副作用。

## 8. 還是無法解決

建立 GitHub issue 時附上：部署 commit、發生時間與時區、角色、分類、狀態、操作步驟、第一個錯誤、HTTP status、request ID、已檢查項目。移除所有 token、Email、service account、資料庫內容與 private URL。
