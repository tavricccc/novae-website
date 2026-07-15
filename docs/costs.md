# 成本指南

Novae 可以從各服務免費層起步，但不能保證永遠免費。雲端方案、額度與價格會改變；部署前應直接查看 Vercel、Supabase、Firebase、Cloudinary、Upstash、Notion 的官方定價頁，不要把文件中的舊數字當合約。

## 先估六個量

1. 每月登入使用者與每日活躍使用者。
2. 每月提案、公告、留言、附議與按讚次數。
3. 每月上傳圖片張數與壓縮後平均大小。
4. 每月圖片瀏覽流量。
5. Edge Function 請求、Realtime 訊息與尖峰連線。
6. Push、Notion 同步、outbox retry 與維護工作的額外請求。

## 成本落在哪裡

| 服務 | 主要成本驅動 |
| --- | --- |
| Vercel | 建置時間、前端流量、Functions（本專案主要後端不在 Vercel） |
| Supabase | database size、egress、Edge invocation、Realtime、備份／PITR |
| Firebase | Authentication MAU、App Check／reCAPTCHA 相關用量；FCM 本身通常不是主要費用 |
| Cloudinary | 儲存、轉換、delivery bandwidth／credits |
| Upstash | Redis commands、儲存、egress |
| Notion | workspace 方案與 API 使用限制；同步失敗重試也會增加請求 |

## 一步一步估算

1. 從一個月的實際校園人數與預估參與率開始，不要直接拿全校人數當每日活躍。
2. 將每個使用動作乘上可能的 API 讀寫次數，並預留 30% retry 與尖峰空間。
3. 圖片以「壓縮後大小 × 上傳張數」估儲存，以「大小 × 平均瀏覽次數」估流量。
4. 對照每個供應商當下的免費額度與超額價格。
5. 設定 50%、75%、90% 用量提醒；不要等超額才看帳單。

## 先做的節省措施

- 保留瀏覽器 WebP 壓縮、圖片張數與來源大小上限。
- 不要把私密圖片改成公開或建立重複 Cloudinary webhook。
- 維持 Upstash 限流，避免濫用把免費額度快速耗盡。
- 修正失敗的 outbox 事件，不讓永久錯誤無限重試。
- 監控 Supabase egress 與不必要的列表重抓。
- development 測試站只在真的需要時建立，避免維護兩套閒置資源。

每月把供應商帳單、Dashboard、Functions 用量與實際參與量一起看，才能判斷成本是成長、濫用、錯誤重試還是設定造成。
