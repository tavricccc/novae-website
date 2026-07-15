# 3. 建立 Supabase

Supabase 是 Novae 的資料與後端平台：Postgres、RLS、RPC、Realtime、Cron 與六個 Edge Functions 都部署在同一 project。

## 1. 建立 project

在 [Supabase Dashboard](https://supabase.com/dashboard) 建立 project。選擇適合學校的 region，設定強 database password，並安全保存；workflow 需要它套用 migration。

## 2. 記錄瀏覽器使用的值

從 project 的 Connect／API 設定取得：

| Supabase 值 | GitHub secret |
| --- | --- |
| Project URL | `VITE_SUPABASE_URL` |
| Publishable key | `VITE_SUPABASE_PUBLISHABLE_KEY` |

publishable key 會出現在瀏覽器；真正授權由 Firebase token、Edge 驗證與 RLS 負責。不要把 service role 填到 `VITE_*`。

## 3. 記錄部署用值

- Project reference ID → `SUPABASE_PROJECT_REF`
- 建立 project 時的 database password → `SUPABASE_DB_PASSWORD`
- Legacy API keys 中的 `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
- Supabase account access token → `SUPABASE_ACCESS_TOKEN`

這些值都只放 GitHub Environment secrets。

## 4. 不要手動先貼 SQL

第一次發布時，`Deploy Supabase Backend` 會執行 `supabase link` 與 `supabase db push`，按版本順序套用 `supabase/migrations/`。也會設定 Edge secrets並部署 `syncUser`、`backendAction`、`cloudinaryWebhook`、`outboxWorker`、`processDeletionJobs`、`maintenanceCleanup`。

Supabase 官方說明：遠端 `db push` 需要先 link，已套用的 migration 會記在 migration history，後續不會重跑；見 [Supabase CLI 文件](https://supabase.com/docs/reference/cli/supabase-db)。

## 5. SUPABASE_URL 不用建立

Hosted Edge Functions 會自動提供 `SUPABASE_URL`。不要為它建立 GitHub secret；workflow 也不會要求。

## 完成檢查

- [ ] URL、publishable key、project ref、DB password、service role 都來自同一 project。
- [ ] access token 屬於有權部署此 project 的帳號。
- [ ] 沒有把 service role 放進任何 `VITE_*`。
- [ ] 沒有手動改寫已存在的 migration。

下一步：[建立 Cloudinary](cloudinary.md)。
