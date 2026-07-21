# 憑證填寫表

正式部署時，請把下列值全部放進 **你自己的 GitHub fork** 的 `production` Environment secrets。這是部署者唯一需要填 secret 的地方；GitHub Action 會自動把執行時需要的值同步到 Cloudflare 與 Supabase，不要再到供應商後台手動重複填寫。

## 先理解可見性

- `VITE_*` 會進入瀏覽器 bundle，不能當成密碼。
- token、service role、service account、API secret、DB password 只放 GitHub Environment secrets。
- `SUPABASE_URL` 由 hosted Edge Functions 自動提供，不需要建立 GitHub secret。
- `VITE_API_BASE_URL` 不需要另外建立 GitHub secret；frontend workflow 會直接使用 `CLOUDFLARE_WORKER_URL`。
- 本機 `.env` 只供程式開發者使用，不是正式部署的一部分。

## 前端與 Vercel

| Secret | 必要 | 來源／填法 |
| --- | --- | --- |
| `VITE_SCHOOL_NAME` | 建議 | 要顯示的學校名稱 |
| `VITE_ALLOWED_DOMAIN` | 是 | 學校信箱網域，不含 `@` |
| `VITE_FIREBASE_API_KEY` | 是 | Firebase Web App `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | 是 | Firebase Web App `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | 是 | Firebase Web App `projectId` |
| `VITE_FIREBASE_APP_ID` | 是 | Firebase Web App `appId` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 是 | Firebase Web App `messagingSenderId` |
| `VITE_FIREBASE_VAPID_KEY` | 是 | Firebase Cloud Messaging Web Push public key |
| `VITE_GOOGLE_CLIENT_ID` | 是 | 同一 Firebase／GCP 專案的 **Web** OAuth 2.0 Client ID（`….apps.googleusercontent.com`）；瀏覽器可見，用於 Google Identity Services 登入 |
| `VITE_FIREBASE_APP_CHECK_ENABLED` | 否 | 初次部署填 `false`；完成 App Check 後改 `true` |
| `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` | 條件 | 啟用 App Check 時填入 |
| `VITE_SUPABASE_URL` | 是 | Supabase Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | 是 | Supabase publishable key，不是 service role |
| `CLOUDFLARE_WORKER_URL` | 是 | 固定 API 根網址，例如 `https://novae-api.school.workers.dev`；包含 `https://`，結尾不要 `/` |
| `VERCEL_TOKEN` | 是 | Vercel account token |
| `VERCEL_ORG_ID` | 是 | Vercel team／account ID |
| `VERCEL_PROJECT_ID` | 是 | Vercel project ID |

## 後端與部署

| Secret | 必要 | 來源／填法 |
| --- | --- | --- |
| `SUPABASE_ACCESS_TOKEN` | 是 | Supabase account access token |
| `SUPABASE_PROJECT_REF` | 是 | Supabase project reference ID |
| `SUPABASE_DB_PASSWORD` | 是 | 該 project 的 database password |
| `SUPABASE_SERVICE_ROLE_KEY` | 是 | Supabase legacy `service_role` key |
| `FIREBASE_PROJECT_ID` | 是 | 與 `VITE_FIREBASE_PROJECT_ID` 相同 |
| `FIREBASE_WEB_API_KEY` | 是 | 與 `VITE_FIREBASE_API_KEY` 相同 |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 是 | Firebase 下載檔的完整 JSON 內容，不是路徑 |
| `ALLOWED_DOMAIN` | 是 | 與 `VITE_ALLOWED_DOMAIN` 完全相同 |
| `ADMIN_EMAILS` | 是 | 完整 Email；多人以半形逗號分隔 |
| `CLOUDINARY_CLOUD_NAME` | 是 | Cloudinary product environment cloud name |
| `CLOUDINARY_API_KEY` | 是 | 同一 environment 的 API key |
| `CLOUDINARY_API_SECRET` | 是 | 同一 environment 的 API secret |
| `CLOUDINARY_WEBHOOK_SECRET` | 是 | 標準 Cloudinary HMAC 驗證時填同一 API secret |
| `WEBHOOK_SECRET` | 是 | 自行產生、獨立的 32-byte 隨機值 |
| `CLOUDFLARE_ACCOUNT_ID` | 是 | Cloudflare 帳號的 32 字元 Account ID，不是 zone ID |
| `CLOUDFLARE_API_TOKEN` | 是 | 限定正確帳號、具 Workers 部署權限的 API token |
| `ALLOWED_ORIGINS` | 是 | 前端完整 Origin，例如 `https://school-novae.vercel.app`；**最後絕對不能有 `/`** |
| `EDGE_FUNCTION_NAMESPACE` | 是 | 16–48 個小寫英數字的私密隨機值；workflow 會自動在 Function 名稱前加 `n` |
| `EDGE_ORIGIN_SECRET` | 是 | 獨立的高熵隨機值，供 Worker／內部工作呼叫 Edge Functions |
| `NOTION_TOKEN` | 選用 | 啟用 Notion 時的 internal integration secret |
| `NOTION_DATABASE_ID` | 選用 | 啟用 Notion 時、已分享給 integration 的原始 database ID |
| `NOTION_DATA_SOURCE_ID` | 條件 | 同一 database 有多個 data source 時，指定 Novae 使用的來源；單一來源自動探索 |
| `UPSTASH_REDIS_REST_URL` | 是 | Supabase 專用的 Upstash HTTPS REST URL；不會同步到 Cloudflare Worker |
| `UPSTASH_REDIS_REST_TOKEN` | 是 | Supabase 專用的 Upstash Standard REST token，不是 Read-only token |

## ALLOWED_ORIGINS 填寫規則

這是最容易讓部署成功、但網站完全無法呼叫 API 的欄位。請逐字遵守：

```text
ALLOWED_ORIGINS=https://你的正式網域.vercel.app
```

> **最後一個字元不能是 `/`。**

| 結果 | 值 |
| --- | --- |
| 正確 | `https://你的正式網域.vercel.app` |
| 錯誤：少協定 | `你的正式網域.vercel.app` |
| 錯誤：尾斜線 | `https://你的正式網域.vercel.app/` |
| 錯誤：包含路徑 | `https://你的正式網域.vercel.app/issues` |
| 錯誤：過度開放 | `*` |

需要多個 Origin 時，用半形逗號分隔：

```text
https://正式站.example.com,https://另一個正式站.example.com
```

不要加引號。Origin 必須與瀏覽器 Console 顯示的 `from origin 'https://…'` 完全相同。修改後必須重新執行 `Deploy Supabase Backend`，只改 GitHub secret 不會更新已部署 Worker。

## 產生三組獨立隨機值

可在自己信任的 PowerShell 執行：

```powershell
$webhookBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($webhookBytes)
$webhookSecret = [Convert]::ToBase64String($webhookBytes)

$namespaceBytes = New-Object byte[] 18
[Security.Cryptography.RandomNumberGenerator]::Fill($namespaceBytes)
$edgeFunctionNamespace = ([Convert]::ToHexString($namespaceBytes)).ToLower()

$originBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($originBytes)
$edgeOriginSecret = [Convert]::ToBase64String($originBytes)
```

對應填入：

```text
WEBHOOK_SECRET        = $webhookSecret
EDGE_FUNCTION_NAMESPACE = $edgeFunctionNamespace
EDGE_ORIGIN_SECRET    = $edgeOriginSecret
```

每個正式環境使用不同值，三者也不能互相共用。不要拿 Cloudinary、Firebase、Supabase 或 Cloudflare token 代替。

## Cloudflare 六項一次核對

| Secret | 範例形狀 | 常見錯誤 |
| --- | --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | `0123…cdef`，共 32 字元 | 填成 zone ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare 建立後只顯示一次的 token | 填成本機 OAuth 或 Global API Key |
| `CLOUDFLARE_WORKER_URL` | `https://novae-api.school.workers.dev` | 加上 `/v1/actions` 或尾斜線 |
| `ALLOWED_ORIGINS` | `https://school-novae.vercel.app` | **最後多一個 `/`** |
| `EDGE_FUNCTION_NAMESPACE` | 小寫英數字隨機字串 | 加空格、連字號或大寫 |
| `EDGE_ORIGIN_SECRET` | 獨立長隨機字串 | 與 webhook/token 共用 |

這六項和其他 secret 一樣，全部只建立在 GitHub `production` Environment。部署時 Action 會自動完成後續設定。

## 填完後核對

- [ ] 所有值都建在 `production` 的 Environment secrets，不是錯放到 Variables。
- [ ] secrets 建在實際執行 Actions 的 fork，不是只填到上游 repository 或另一個 GitHub 帳號。
- [ ] 沒有 secret 名稱拼錯或值前後多空白。
- [ ] 三組 Firebase 值來自同一個 Firebase project／Web App。
- [ ] 四組 Supabase 值屬於同一個 project。
- [ ] 四組 Cloudinary 值屬於同一個 product environment。
- [ ] `GOOGLE_SERVICE_ACCOUNT_JSON` 是完整 JSON，沒有只貼檔名。
- [ ] `ADMIN_EMAILS` 中每個帳號都屬於允許網域。
- [ ] `CLOUDFLARE_WORKER_URL` 與 `ALLOWED_ORIGINS` 都包含 `https://` 且結尾沒有 `/`。
- [ ] `ALLOWED_ORIGINS` 是前端 Vercel 網域，不是 Worker 自己的網址。
- [ ] `EDGE_FUNCTION_NAMESPACE` 與 `EDGE_ORIGIN_SECRET` 已分別產生。

Notion 的 token 與 database ID 必須「兩個都填」或「兩個都不填」。兩個都不填時，workflow 會寫入 `NOTION_ENABLED=false`，Edge Functions 會安全略過所有 Notion 同步；只填一個時部署會明確失敗。`NOTION_DATA_SOURCE_ID` 只能與這組設定一起使用，程式會驗證它屬於指定 database。Notion API 版本固定為 `2026-03-11`，不再使用 `NOTION_VERSION` secret。
