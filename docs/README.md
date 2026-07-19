# Novae 文件

這份文件以「把 Novae 正式部署給一所學校使用」為主線。你不需要先懂 Vue、資料庫或雲端平台；照順序完成帳號、憑證、平台規則與發布即可。

## 第一次部署的閱讀順序

1. 先讀[產品與流程](project-overview.md)，確認 Novae 適合你的校園情境。
2. 按[部署準備與服務設定](quick-start.md)依序建立 GitHub、Firebase、Supabase、Cloudinary、Upstash、Cloudflare 與 Vercel；需要營運副本時再加 Notion。
3. 用[憑證填寫表](environment-configuration.md)逐項核對 GitHub `production` Environment secrets。
4. 執行[最後發布與驗收](deployment-guide.md)，再由 `ADMIN_EMAILS` 管理員首次登入完成[分類與平台規則](configuration.md)。
5. 發布後照[使用者流程](user-guide.md)與[管理員流程](admin-guide.md)完成操作驗收。
6. 上線後依[維運手冊](operations.md)定期檢查，出錯時從[一步一步排錯](troubleshooting.md)開始。

## 只想找一件事

| 需求 | 前往 |
| --- | --- |
| 看懂提案從送出到結案的生命週期 | [產品與流程](project-overview.md) |
| 從零開始部署 | [部署準備與服務設定](quick-start.md) |
| 前置工作完成，準備發布 | [最後發布與驗收](deployment-guide.md) |
| 查一個 secret 從哪裡來 | [憑證填寫表](environment-configuration.md) |
| 調整附議人數或天數 | [分類與平台規則](configuration.md) |
| 學會操作 App | [使用者流程](user-guide.md) |
| 審核、回覆、公告與 Dashboard | [管理員流程](admin-guide.md) |
| 了解資料與服務怎麼流動 | [系統架構](architecture.md) |
| 本機開發或送 PR | [貢獻指南](contributing.md) |

> 本機開發不是部署的前置步驟。只有要修改程式或深入除錯時，才需要安裝 Node.js 並執行本機指令。
