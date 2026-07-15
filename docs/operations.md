# 上線後維運

維運的目標不是每天手動修資料，而是及早發現「登入、資料、圖片、通知、外部同步、部署」哪一層出問題，再在正確邊界處理。

## 每次部署後

1. 確認 backend workflow 先成功，frontend workflow 後成功。
2. 開正式網址並重新登入。
3. 讀取提案、公告、通知與設定頁。
4. 建立一件測試提案，確認圖片、附議、留言與回饋列。
5. 用管理員完成一次審核或狀態更新。
6. 檢查 Dashboard 與 Supabase Function logs 沒有新錯誤。

## 固定節奏

| 頻率 | 依序檢查 |
| --- | --- |
| 每日 | 待審核、未回覆、Dashboard 錯誤、outbox backlog、Functions 失敗 |
| 每週 | 圖片 pending／刪除工作、Notion／FCM 失敗、Redis 與資料庫用量 |
| 每月 | GitHub/Vercel/Supabase/Firebase/Cloudinary/Upstash/Notion 帳單與 token、備份還原演練 |
| 每學期 | 網域、管理員、分類、附議人數與天數、回應期限、隱私告知 |

## 事故處理五步

1. **界定範圍**：全部使用者還是單一帳號？全部分類還是單一分類？讀取還是寫入？
2. **找第一個失敗邊界**：瀏覽器、Firebase、Edge Function、Postgres、Cloudinary、Notion、Upstash 或 Vercel。
3. **保留證據**：時間、request ID、HTTP status、第一個錯誤、相關 workflow run。
4. **降低影響**：暫停有問題的發布或管理操作，不要直接關閉驗證或 RLS。
5. **修正與驗收**：只改出錯層，重新跑完整使用流程，記錄原因與防止再發方式。

## 資料與備份

- Supabase Postgres 是主要資料來源；Notion 只是營運副本。
- 使用 Supabase 的正式備份／PITR 能力時，先確認方案與保留期。
- 圖片在 Cloudinary；資料庫保存受控識別與狀態。復原要一起驗證兩邊的一致性。
- 刪除經 deletion job 處理；不要手動刪 Cloudinary 後留下資料庫引用。
- 已部署 migration 不回改；schema 變更新增後續 migration。

## 變更分類前

1. 用[分類設定產生器](../category-builder.html)載入現有 JSON。
2. 確認是否已有資料使用要移除或改名的 `id`。
3. 記錄新門檻與天數何時生效，以及既有提案是否沿用舊值。
4. 提交 config，等待後端與前端同一 commit 部署成功。
5. 逐分類建立測試提案驗收。

## 憑證輪替

每次只換一組服務，依「建立新值 → 更新 production secret → 部署 → 驗收 → 撤銷舊值」進行。若同時輪替全部服務，發生錯誤時很難定位。

遇到具體症狀，接著使用[一步一步排錯](troubleshooting.md)。
