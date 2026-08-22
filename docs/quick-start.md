# 部署準備與服務設定

這不是本機開發教學。先決定校園規則，再依本頁順序建立部署需要的服務；分類與平台規則會在發布後由首位管理員首次登入時完成設定。

## 1. 決定校園規則

先確定以下項目：

- 學校顯示名稱（例如 `國立陽明交通大學`）。
- 允許登入的 Google 信箱網域，例如 `school.edu.tw`，不要包含 `@` 或 `https://`。
- 第一批管理員的完整 Email；多人用半形逗號分隔。
- 哪些分類要公開、先審核或保持私密。
- 每個分類是否顯示作者、是否開放附議、附議人數、附議天數與回應天數。

## 2. 依序建立服務

| 服務 | 用途 | 你最後會拿到 |
| --- | --- | --- |
| GitHub | 保存你的 fork、secrets 與自動部署工作流 | repository、`production` Environment |
| Firebase | Google 登入、App Check、Web Push | Web App config、Web OAuth Client ID（`NEXT_PUBLIC_GOOGLE_CLIENT_ID`）、VAPID key、service account JSON |
| Neon | Serverless PostgreSQL 17 資料庫 | `NEON_DATABASE_URL`、`NEON_RUNTIME_PASSWORD` |
| Cloudinary | 簽名圖片儲存與處理 | cloud name、API key、API secret |
| Notion（選用）| 選用的營運副本資料庫 | integration token、database ID、data source ID |
| Cloudflare | API 入口、Hyperdrive 加速、Queues 佇列、Turnstile 人機驗證、Durable Objects 限流與即時推送 | Account ID、API token、Hyperdrive ID、Turnstile keys、隨機密鑰 |
| Vercel | 發布 Next.js PWA 前端 | token、org ID、project ID |

Notion 是選用的營運副本。需要時才建立 integration 與 database；不需要就完全略過，不會影響提案、公告、通知或其他主要功能。

請照下列順序完成。每一頁都只處理該服務的建立與憑證取得，不會提前發布：

1. [準備 GitHub](deployment/github.md)
2. [建立 Firebase](deployment/firebase.md)
3. [建立 Neon 資料庫](deployment/neon.md)
4. [建立 Cloudinary](deployment/cloudinary.md)
5. [設定 Notion（選用）](deployment/notion.md)
6. [建立 Cloudflare Worker](deployment/cloudflare.md)
7. [建立 Vercel](deployment/vercel-github.md)

## 3. 確認你有權限

部署者需要能：

- 管理 GitHub repository 的 Settings、Actions 與 Environments。
- 建立 Firebase、Neon、Cloudinary、Cloudflare、Vercel 專案；Notion 只在選用時需要。
- 管理學校網域與首批管理員名單。
- 在正式上線前確認隱私告知、內容管理與資料保留責任。

## 4. 建立一份安全的暫存表

使用密碼管理器或安全的暫存文件記錄[憑證填寫表](environment-configuration.md)中的值。不要把 service account、API secret、資料庫密碼或 token 貼到 issue、聊天、試算表公開連結或 Git commit。

## 5. 完成條件

- [ ] 已確定學校網域與管理員 Email。
- [ ] 已決定分類與期限規則。
- [ ] 已完成 GitHub、Firebase、Neon、Cloudinary、Cloudflare 與 Vercel；需要時也已完成 Notion。
- [ ] 知道所有敏感值最後要放進 GitHub `production` Environment secrets。
- [ ] 知道本機 `.env` 不是正式部署必要步驟。

全部完成後，先開啟[憑證填寫表](environment-configuration.md)，集中核對並填入 GitHub `production` Environment secrets，再進入[最後發布與驗收](deployment-guide.md)。部署完成後依[分類與平台規則](configuration.md)完成首次登入引導。
