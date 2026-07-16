# 憑證填寫表

正式部署時，請把下列值放進 GitHub repository 的 `production` Environment secrets。workflow 只會從這裡讀取；後端 workflow 會再把執行時需要的值同步到 Supabase Edge secrets。

## 先理解可見性

- `VITE_*` 會進入瀏覽器 bundle，不能當成密碼。
- token、service role、service account、API secret、DB password 只放 GitHub Environment secrets。
- `SUPABASE_URL` 由 hosted Edge Functions 自動提供，不需要建立 GitHub secret。
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
| `VITE_FIREBASE_APP_CHECK_ENABLED` | 否 | 初次部署填 `false`；完成 App Check 後改 `true` |
| `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` | 條件 | 啟用 App Check 時填入 |
| `VITE_SUPABASE_URL` | 是 | Supabase Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | 是 | Supabase publishable key，不是 service role |
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
| `NOTION_TOKEN` | 選用 | 啟用 Notion 時的 internal integration secret |
| `NOTION_DATABASE_ID` | 選用 | 啟用 Notion 時、已分享給 integration 的原始 database ID |
| `NOTION_DATA_SOURCE_ID` | 條件 | 同一 database 有多個 data source 時，指定 Novae 使用的來源；單一來源自動探索 |
| `UPSTASH_REDIS_REST_URL` | 是 | Upstash HTTPS REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | 是 | Upstash Standard REST token，不是 Read-only token |

## 產生 WEBHOOK_SECRET

可在自己信任的 PowerShell 執行：

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

每個正式環境使用不同值。不要拿 Cloudinary、Firebase 或 Supabase 的既有 secret 代替。

## 填完後核對

- [ ] 所有值都建在 `production` 的 Environment secrets，不是錯放到 Variables。
- [ ] 沒有 secret 名稱拼錯或值前後多空白。
- [ ] 三組 Firebase 值來自同一個 Firebase project／Web App。
- [ ] 四組 Supabase 值屬於同一個 project。
- [ ] 四組 Cloudinary 值屬於同一個 product environment。
- [ ] `GOOGLE_SERVICE_ACCOUNT_JSON` 是完整 JSON，沒有只貼檔名。
- [ ] `ADMIN_EMAILS` 中每個帳號都屬於允許網域。

Notion 的 token 與 database ID 必須「兩個都填」或「兩個都不填」。兩個都不填時，workflow 會寫入 `NOTION_ENABLED=false`，Edge Functions 會安全略過所有 Notion 同步；只填一個時部署會明確失敗。`NOTION_DATA_SOURCE_ID` 只能與這組設定一起使用，程式會驗證它屬於指定 database。Notion API 版本固定為 `2026-03-11`，不再使用 `NOTION_VERSION` secret。
