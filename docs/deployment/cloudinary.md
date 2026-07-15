# 4. 建立 Cloudinary

Cloudinary 保存 Novae 的提案、公告、留言與頭像圖片。前端先壓縮，後端簽名上傳，webhook 驗證完成後才把圖片視為可用。

## 1. 建立 Product Environment

登入 [Cloudinary Console](https://console.cloudinary.com/)，建立或選擇一個專供 Novae 使用的 Product Environment。

## 2. 取得同一組憑證

| Cloudinary 值 | GitHub secret |
| --- | --- |
| Cloud name | `CLOUDINARY_CLOUD_NAME` |
| API key | `CLOUDINARY_API_KEY` |
| API secret | `CLOUDINARY_API_SECRET` |
| 同一 API secret | `CLOUDINARY_WEBHOOK_SECRET` |

目前程式的標準 Cloudinary HMAC callback 驗證使用 API secret；不要另外發明一個隨機 webhook secret，否則 callback 會驗證失敗。

## 3. 不要建立重複的全域 webhook

Novae 上傳流程會在簽名請求中指定 callback。除非你已閱讀並修改後端流程，不要再建立一個把所有資源事件送到同一路徑的全域 notification URL，避免重複事件與不必要流量。

## 4. 保持圖片為受控資源

不要為了排錯把 delivery 改成公開。Novae 會依分類權限取得短效簽名讀取網址；私密案件的附件也沿用相同授權邊界。

## 完成檢查

- [ ] 四個值來自同一 Product Environment。
- [ ] API secret 沒有進入前端或 Git commit。
- [ ] webhook secret 與 API secret 相同。
- [ ] 沒有額外建立重複的全域 webhook。

下一步：選擇是否[建立 Notion 副本](notion.md)。
