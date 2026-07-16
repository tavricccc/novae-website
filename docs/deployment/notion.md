# 5. 選用：建立 Notion 副本

Novae 可以透過 outbox worker 把提案與公告同步成營運副本。這項功能完全選用；Supabase 才是主要資料來源，Notion 不是授權或交易資料庫。

## 不需要 Notion

直接略過本頁，不要在 GitHub 建立 `NOTION_TOKEN`、`NOTION_DATABASE_ID` 或 `NOTION_DATA_SOURCE_ID`。部署 workflow 會自動設定 `NOTION_ENABLED=false`，其他功能照常運作。

## 1. 建立 integration

在 [Notion integrations](https://www.notion.so/my-integrations) 建立 internal integration，限制在專用 workspace，複製 secret 到 `NOTION_TOKEN`。

## 2. 建立原始 database

在 Notion 建立一個完整頁面的 database，專供 Novae 同步。將該 database 分享給剛才的 integration；只建立 token 但沒有分享頁面，API 仍看不到資料庫。

## 3. 取得 database 與 data source ID

從 database URL 取出識別碼，填入 `NOTION_DATABASE_ID`。請使用原始 database 的 ID，不是某個 view 的名稱或分享頁標題。

若 database 只有一個 data source，程式會透過 Notion API 自動探索並快取其 ID，不必建立額外 secret。若同一 database 有多個 data source，請在 database 的 `Manage data sources` 複製 Novae 要使用的 ID，填入 `NOTION_DATA_SOURCE_ID`；未指定時同步會停止並回報明確錯誤，避免寫入錯誤來源。

## 4. API 版本

程式固定使用 Notion API `2026-03-11`，schema 由 data source API 管理，建立頁面也以 `data_source_id` 為 parent。不要建立 `NOTION_VERSION` secret；版本需與程式資料模型一起更新。

## 完成檢查

- [ ] integration 是 internal integration。
- [ ] 原始 database 已分享給 integration。
- [ ] token 與 database ID 屬於同一 workspace。
- [ ] 多 data source database 已設定正確的 `NOTION_DATA_SOURCE_ID`；單一來源則可省略。
- [ ] 了解 Notion 是營運副本，不能取代 Supabase 備份。

若啟用，`NOTION_TOKEN` 與 `NOTION_DATABASE_ID` 必須一起填；只填其中一個會被 workflow 拒絕。`NOTION_DATA_SOURCE_ID` 只能在這兩者都存在時設定，程式也會驗證它確實屬於指定 database。

下一步：[建立 Upstash](upstash.md)。
