# 分類與平台規則

Novae 有兩份人工維護的 JSON 設定。建置前會產生前端與 Edge 共用的 TypeScript 檔，部署 workflow 也會確認產生結果已提交且一致。

| 來源 | 控制內容 |
| --- | --- |
| `config/issue-categories.config.json` | 分類、閱讀範圍、作者、附議門檻、附議天數、回應天數 |
| `config/rate-limits.config.json` | 操作限流、圖片數量與瀏覽器壓縮 |

## 一步一步建立分類

1. 打開[分類設定產生器](../category-builder.html)。
2. 每個分類先填永久且唯一的 `id`，再填使用者看到的 `label`。
3. 選擇誰能讀：校內、審核後校內、或只有作者與管理員。
4. 選擇是否顯示作者。`owner-admin` 會固定顯示作者，供管理端聯繫。
5. 選擇是否開放附議。
6. 若開啟附議，分別填「需要多少人」與「開放幾天」。這兩個值不是寫死的，而且每個分類可以不同。
7. 填回應天數，或留空表示不設期限。
8. 下載並覆蓋 `config/issue-categories.config.json`。

## 真實 schema

```json
{
  "categories": [
    {
      "id": "public-issues",
      "label": "公共議題",
      "readAccess": "reviewed-school",
      "authorVisible": false,
      "support": {
        "enabled": true,
        "goal": 50,
        "deadlineDays": 14
      },
      "responseDeadlineDays": 7
    }
  ]
}
```

| 欄位 | 規則與實際效果 |
| --- | --- |
| `id` | 小寫英數與連字號；不可重複；上線後不要改名重用 |
| `label` | 介面顯示名稱 |
| `readAccess` | `school`、`reviewed-school`、`owner-admin` |
| `authorVisible` | 是否向有閱讀權的人顯示作者；私密分類會被正規化成 `true` |
| `support.enabled` | 是否啟用附議 |
| `support.goal` | 啟用時必填正整數；達到這個人數即成功 |
| `support.deadlineDays` | 啟用時必填正整數；期限內未達標會自動成為「未通過」 |
| `responseDeadlineDays` | 正整數或 `null`；有附議時從達標開始，無附議時從建立開始 |

系統會依上述欄位自動推導附件與留言可見性、留言何時開放、作者儲存位置與附議未達標自動結束，不需要再填第二套規則。

## 目前專案範例的三個分類

| 分類 | 閱讀 | 作者 | 附議 | 回應 |
| --- | --- | --- | --- | --- |
| 公共議題 | 審核後校內 | 隱藏 | 50 人／14 天 | 達標後 7 天 |
| 學生權益 | 作者與管理員 | 顯示 | 不開放 | 建立後 7 天 |
| 設備 | 校內 | 顯示 | 不開放 | 建立後 7 天 |

這些只是 repository 現值，可以改成學校自己的制度。

## 移除或改名分類

不要直接刪除已經有資料的 `id`，也不要把舊 `id` 改給另一個用途。先決定舊資料要保留、遷移或封存，再新增 migration；已部署 migration 不可回頭修改。

## 限流與圖片

`config/rate-limits.config.json` 的現值包含：每天 30 件提案、每小時 200 則留言、每天 200 次圖片上傳、提案與公告各 5 張圖片、留言 1 張；圖片來源上限 20 MB，目標壓縮到 800 KB、最長邊 2000 px、WebP 初始品質 0.82。

除此之外還有登入同步、附議、公告按讚、Push token、一般讀寫、敏感寫入、管理寫入、圖片解析、健康檢查、webhook 與 worker 的小時／分鐘及突發限流。調低前先確認真實流量；過低會讓正常操作被拒絕，過高會削弱濫用與成本保護。

## 發布設定變更

1. 修改或用產生器下載兩份 config。
2. 提交到 fork 的 `main`。
3. config 變更會同時觸發後端與前端 workflow。
4. 前端會等待同 commit 的後端成功後才發布。
5. 發布後實際建立一件各分類提案，驗證可見性、附議與期限。

程式開發者可執行 `npm run generate:all` 檢查產生檔；一般部署者不需要在本機做這一步，workflow 會代為驗證。
