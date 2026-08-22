# 憑證填寫表

正式部署時，請把下列值全部放進 **你自己的 GitHub fork** 的 `production` Environment secrets。這是部署者唯一需要填寫 secret 的地方；GitHub Actions 會在部署時自動將執行期需要的值注入 Vercel 前端與 Cloudflare Worker，不要再到供應商後台手動重複填寫。

## 先理解可見性

- `NEXT_PUBLIC_*` 會編譯進瀏覽器 JavaScript bundle，屬於公開設定，不能當成密碼。
- 資料庫密碼、service account JSON、API secret、Token 與隨機密鑰只放 GitHub Environment secrets，瀏覽器完全無法讀取。
- `NEXT_PUBLIC_API_BASE_URL` 不需要額外建立；frontend workflow 會自動使用 `CLOUDFLARE_WORKER_URL`。
- 本機 `.env` 只供程式開發者本機除錯使用，不是正式部署的一部分。

## 前端與 Vercel

| Secret | 必要 | 來源／填法 |
| --- | --- | --- |
| `NEXT_PUBLIC_SCHOOL_NAME` | 建議 | 欲顯示的學校或組織名稱（例如 `國立陽明交通大學`） |
| `NEXT_PUBLIC_ALLOWED_DOMAIN` | 是 | 允許登入的信箱網域（例如 `nycu.edu.tw`，不含 `@`） |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | 是 | Firebase Web App `apiKey` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | 是 | Firebase Web App `authDomain` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | 是 | Firebase Web App `projectId` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | 是 | Firebase Web App `appId` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | 是 | Firebase Web App `messagingSenderId` |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | 是 | Firebase Cloud Messaging Web Push public key (VAPID) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | 是 | 同一 Firebase／GCP 專案的 **Web** OAuth 2.0 Client ID（形如 `….apps.googleusercontent.com`），供 Google Identity Services 登入 |
| `NEXT_PUBLIC_FIREBASE_APP_CHECK_ENABLED` | 是 | 正式環境填 `true` |
| `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY` | 是 | Google Cloud reCAPTCHA Enterprise Site Key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | 是 | Cloudflare Turnstile Widget Site Key（亦可填入 `TURNSTILE_SITE_KEY`） |
| `CLOUDFLARE_WORKER_URL` | 是 | 固定 API 根網址，例如 `https://novae-api.school.workers.dev`；包含 `https://`，結尾不可有 `/` |
| `VERCEL_TOKEN` | 是 | Vercel Account Deployment Token |
| `VERCEL_ORG_ID` | 是 | Vercel Account／Team ID |
| `VERCEL_PROJECT_ID` | 是 | Vercel Project ID |

## 後端與部署

| Secret | 必要 | 來源／填法 |
| --- | --- | --- |
| `ADMIN_EMAILS` | 是 | 平台總管理員 Email；多人以半形逗號分隔（例如 `admin1@school.edu.tw,admin2@school.edu.tw`） |
| `ALLOWED_DOMAIN` | 是 | 與 `NEXT_PUBLIC_ALLOWED_DOMAIN` 完全相同 |
| `ALLOWED_ORIGINS` | 是 | 前端正式 Origin（例如 `https://school-novae.vercel.app`；**最後絕對不能有 `/`**） |
| `CLOUDFLARE_ACCOUNT_ID` | 是 | Cloudflare 帳號的 32 字元 Account ID |
| `CLOUDFLARE_API_TOKEN` | 是 | 具備 Workers、Hyperdrive、Queues 編輯權限的 API Token |
| `CLOUDFLARE_HYPERDRIVE_ID` | 是 | Cloudflare Hyperdrive 的 32 字元十六進位 ID |
| `CLOUDFLARE_WORKER_URL` | 是 | 與前端共用，Worker 公開根網址 |
| `CLOUDINARY_CLOUD_NAME` | 是 | Cloudinary Product Environment Cloud Name |
| `CLOUDINARY_API_KEY` | 是 | 同一 Environment 的 API Key |
| `CLOUDINARY_API_SECRET` | 是 | 同一 Environment 的 API Secret（Webhook 簽章驗證亦直接使用此 Secret） |
| `FIREBASE_PROJECT_ID` | 是 | 與 `NEXT_PUBLIC_FIREBASE_PROJECT_ID` 相同 |
| `FIREBASE_PROJECT_NUMBER` | 是 | 與 `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` 相同 |
| `FIREBASE_APP_IDS` | 是 | 與 `NEXT_PUBLIC_FIREBASE_APP_ID` 相同 |
| `FIREBASE_WEB_API_KEY` | 是 | 與 `NEXT_PUBLIC_FIREBASE_API_KEY` 相同，供後端驗證與 Smoke Test 使用 |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 是 | Firebase Admin SDK 產生的 Service Account JSON 完整內容（非路徑） |
| `NEON_DATABASE_URL` | 是 | Neon Project 的完整 PostgreSQL 連線字串 |
| `NEON_RUNTIME_PASSWORD` | 是 | 獨立隨機密碼，供建立最低權限 `novae_runtime` 資料庫角色 |
| `HEALTHCHECK_SECRET` | 是 | 獨立 32-byte 隨機密鑰，供後端健康檢查 Smoke Test 呼叫 |
| `MEDIA_SIGNING_SECRET` | 是 | 獨立 32-byte 隨機密鑰，供 Media Gateway 產生與驗證圖片 HMAC 簽名 |
| `REALTIME_TICKET_SECRET` | 是 | 獨立 32-byte 隨機密鑰，供 WebSocket 即時連線 Ticket 簽發與驗證 |
| `TURNSTILE_SECRET_KEY` | 是 | Cloudflare Turnstile Widget Secret Key |
| `BACKUP_AGE_RECIPIENT` | 是 (變數) | `age` 加密公鑰（格式為 `age1...`），供每日資料庫備份加密（放於 GitHub Variables 或 Secrets） |
| `NOTION_TOKEN` | 選用 | 啟用 Notion 同步時的 Internal Integration Secret |
| `NOTION_DATABASE_ID` | 選用 | 啟用 Notion 同步時的專用 Database ID |
| `NOTION_DATA_SOURCE_ID` | 條件 | 多 Data Source 時指定，單一來源自動探索 |

## 選用之自訂名稱（GitHub Variables）

若需要自訂 Cloudflare 服務名稱，可在 GitHub `production` Environment Variables（或 Repository Variables）中設定：

| Variable | 預設值 | 說明 |
| --- | --- | --- |
| `CLOUDFLARE_WORKER_NAME` | `novae-api` | 自訂 Cloudflare Worker 名稱 |
| `CLOUDFLARE_QUEUE_NAME` | `novae-jobs` | 自訂 Cloudflare Queue 佇列名稱 |

## ALLOWED_ORIGINS 填寫規則

這是最容易讓部署成功但前台無法連線 API 的設定：

```text
ALLOWED_ORIGINS=https://你的正式網域.vercel.app
```

> **最後一個字元絕對不能是 `/`。**

| 結果 | 值 |
| --- | --- |
| 正確 | `https://你的正式網域.vercel.app` |
| 錯誤：缺少協定 | `你的正式網域.vercel.app` |
| 錯誤：尾斜線 | `https://你的正式網域.vercel.app/` |
| 錯誤：包含路徑 | `https://你的正式網域.vercel.app/issues` |
| 錯誤：過度開放 | `*` |

多個 Origin 用半形逗號分隔：`https://app.school.edu.tw,https://school-novae.vercel.app`。

## 產生後端專用隨機密鑰

可在 PowerShell 執行以下腳本，一次產生四組高強度隨機密鑰：

```powershell
function New-RandomSecret {
    $bytes = New-Object byte[] 32
    [Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    [Convert]::ToBase64String($bytes)
}

Write-Host "NEON_RUNTIME_PASSWORD  = $(New-RandomSecret)"
Write-Host "HEALTHCHECK_SECRET     = $(New-RandomSecret)"
Write-Host "MEDIA_SIGNING_SECRET   = $(New-RandomSecret)"
Write-Host "REALTIME_TICKET_SECRET = $(New-RandomSecret)"
```

四組密鑰必須各自獨立，不要互相共用或使用供應商 Token 替代。

## 填完後核對

- [ ] 所有值都建在 `production` 的 Environment secrets，不是放在公開 Variables。
- [ ] secrets 建在實際執行 Actions 的 fork 專案中。
- [ ] 沒有 secret 名稱拼錯或值前後帶有非預期空白。
- [ ] `GOOGLE_SERVICE_ACCOUNT_JSON` 是完整 JSON 內容，沒有只填檔名。
- [ ] `ADMIN_EMAILS` 中所有帳號都屬於 `ALLOWED_DOMAIN` 網域。
- [ ] `CLOUDFLARE_WORKER_URL` 與 `ALLOWED_ORIGINS` 都包含 `https://` 且結尾無 `/`。
- [ ] `NEON_DATABASE_URL` 與 `NEON_RUNTIME_PASSWORD` 已正確填入。
- [ ] `CLOUDFLARE_HYPERDRIVE_ID`、`TURNSTILE_SECRET_KEY`、`NEXT_PUBLIC_TURNSTILE_SITE_KEY` 已設定。
- [ ] `BACKUP_AGE_RECIPIENT` 已填入 `age1...` 公鑰，以支援自動化加密備份。

Notion 的 `NOTION_TOKEN` 與 `NOTION_DATABASE_ID` 必須同時填入或同時留空。留空時 workflow 會自動略過 Notion 同步。

下一步：[分類與平台規則](configuration.md)。
