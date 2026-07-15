# 5. 選用：建立 Notion 副本

Novae 可以透過 outbox worker 把提案與公告同步成營運副本。這項功能完全選用；Supabase 才是主要資料來源，Notion 不是授權或交易資料庫。

## 不需要 Notion

直接略過本頁，不要在 GitHub 建立 `NOTION_TOKEN`、`NOTION_DATABASE_ID` 或 `NOTION_VERSION`。部署 workflow 會自動設定 `NOTION_ENABLED=false`，其他功能照常運作。

## 1. 建立 integration

在 [Notion integrations](https://www.notion.so/my-integrations) 建立 internal integration，限制在專用 workspace，複製 secret 到 `NOTION_TOKEN`。

## 2. 建立原始 database

在 Notion 建立一個完整頁面的 database，專供 Novae 同步。將該 database 分享給剛才的 integration；只建立 token 但沒有分享頁面，API 仍看不到資料庫。

## 3. 取得 database ID

從 database URL 取出識別碼，填入 `NOTION_DATABASE_ID`。請使用原始 database 的 ID，不是某個 view 的名稱或分享頁標題。

## 4. API 版本

`NOTION_VERSION` 可不建立；workflow 會使用目前程式鎖定的 `2022-06-28`。只有在程式與資料模型一起升級後才調整版本。

## 完成檢查

- [ ] integration 是 internal integration。
- [ ] 原始 database 已分享給 integration。
- [ ] token 與 database ID 屬於同一 workspace。
- [ ] 了解 Notion 是營運副本，不能取代 Supabase 備份。

若啟用，`NOTION_TOKEN` 與 `NOTION_DATABASE_ID` 必須一起填；只填其中一個會被 workflow 拒絕。

下一步：[建立 Upstash](upstash.md)。
