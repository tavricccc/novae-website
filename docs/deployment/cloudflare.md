# 6. 建立 Cloudflare Worker

Cloudflare Worker 是 Novae 的完整後端執行環境與公開 API 入口。它直接處理業務 Actions、認證同步、Media Gateway 圖片快取、Cloudflare Queues 非同步任務（通知、Notion 同步、清理排程），並透過 Cloudflare Durable Objects 提供 WebSocket Hibernation 即時推送與原生物理限流。

## 1. 建立 Cloudflare 帳號與 workers.dev 子網域

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 開啟 `Workers & Pages`。
3. 第一次使用 Workers 時，依畫面註冊 `workers.dev` 子網域（例如 `school`）。

正式 Worker 名稱預設為 `novae-api`，公開 API URL 是：

```text
https://novae-api.<你的-workers.dev-子網域>.workers.dev
```

例如：`https://novae-api.school.workers.dev`。

## 2. 取得 Account ID 與 API Token

1. **Account ID**：在 Cloudflare Dashboard 右側或網址中複製 32 個十六進位字元的 Account ID，儲存為 `CLOUDFLARE_ACCOUNT_ID`。
2. **API Token**：進入 `My Profile → API Tokens`，選擇 `Create Token`，使用 `Edit Cloudflare Workers` 範本（或給予 Workers Scripts Edit、Hyperdrive Edit、Queues Edit 權限），Account Resources 選擇 Novae 所在帳號。儲存為 `CLOUDFLARE_API_TOKEN`。

## 3. 建立 Cloudflare Hyperdrive

Hyperdrive 能將 Cloudflare Workers 與 Neon PostgreSQL 之間的連線池化並就近加速：

1. 在 Cloudflare Dashboard 進入 `Workers & Pages → Hyperdrive`（或透過 Wrangler CLI 建立）。
2. 建立一個 Hyperdrive 設定，填入暫時的資料庫連線資訊（後續 GitHub Actions 部署時會自動將驗證後的 `novae_runtime` 角色連線字串同步至此）。
3. 複製 32 字元的 Hyperdrive ID，儲存為 GitHub secret：
   ```text
   CLOUDFLARE_HYPERDRIVE_ID
   ```

## 4. 建立 Cloudflare Turnstile 人機驗證

Novae 整合 Turnstile 作為首次註冊與資料安全邊界防護：

1. 在 Cloudflare Dashboard 進入 `Turnstile`，點擊 **Add Site**。
2. Site Name 命名為 `Novae`，Domain 填入 Vercel 正式網域（及本機 `localhost`），Widget Mode 選擇 **Invisible** 或 **Managed**。
3. 取得兩組金鑰：
   - **Site Key** → 儲存為前端 secret `NEXT_PUBLIC_TURNSTILE_SITE_KEY`（或 `VITE_TURNSTILE_SITE_KEY`）。
   - **Secret Key** → 儲存為後端 secret `TURNSTILE_SECRET_KEY`。

## 5. 產生後端專用隨機密鑰

在 PowerShell 產生三組獨立的高強度隨機字串：

```powershell
$healthBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($healthBytes)
$healthSecret = [Convert]::ToBase64String($healthBytes)

$mediaBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($mediaBytes)
$mediaSecret = [Convert]::ToBase64String($mediaBytes)

$ticketBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($ticketBytes)
$realtimeSecret = [Convert]::ToBase64String($ticketBytes)
```

分別儲存至 GitHub `production` Environment secrets：

```text
HEALTHCHECK_SECRET     = $healthSecret
MEDIA_SIGNING_SECRET   = $mediaSecret
REALTIME_TICKET_SECRET = $realtimeSecret
```

## 6. 填寫 ALLOWED_ORIGINS 與 CLOUDFLARE_WORKER_URL

- `CLOUDFLARE_WORKER_URL`：填入完整 Worker 根網址（例如 `https://novae-api.school.workers.dev`；必須包含 `https://`，結尾不可有 `/`）。
- `ALLOWED_ORIGINS`：填入允許存取 API 的前端 Origin（例如 `https://school-novae.vercel.app`；**結尾絕對不能加 `/`**）。

## 7. 選用：自訂 Worker 與 Queue 名稱

若需要自訂 Cloudflare 資源名稱，可在 GitHub `production` Environment Variables（或 Repository Variables）中設定（不填則使用預設值）：
- `CLOUDFLARE_WORKER_NAME`：預設為 `novae-api`（正式環境）或 `novae-api-<env>`（開發環境）。
- `CLOUDFLARE_QUEUE_NAME`：預設為 `novae-jobs`（正式環境）或 `novae-jobs-<env>`（開發環境）。

## 完成檢查

- [ ] `CLOUDFLARE_ACCOUNT_ID` 與 `CLOUDFLARE_API_TOKEN` 已填入。
- [ ] `CLOUDFLARE_HYPERDRIVE_ID` 為 32 位十六進位字串。
- [ ] `TURNSTILE_SECRET_KEY` 與 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 已建立。
- [ ] `HEALTHCHECK_SECRET`、`MEDIA_SIGNING_SECRET`、`REALTIME_TICKET_SECRET` 已獨立產生並填入。
- [ ] `ALLOWED_ORIGINS` 格式正確無尾斜線。

下一步：[建立 Vercel](vercel-github.md)。
