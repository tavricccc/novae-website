# 成本指南

Novae 可以從各服務免費層起步，但不能保證永遠免費。雲端方案、額度與價格會改變；部署前應直接查看 Cloudflare、Vercel、Supabase、Firebase、Cloudinary、Upstash、Notion 的官方定價頁，不要把文件中的舊數字當合約。

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
| Cloudflare | Worker requests、CPU time、logs／observability |
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

## 本地資料庫容量基準

2026-07-18 在 WSL 以全新本地 Supabase 套用全部 migration 後產生一學年資料；不啟動 Edge Function，也不呼叫 Firebase、FCM、Cloudinary 或 Notion API。

| 項目 | 500 人 | 1000 人 |
| --- | ---: | ---: |
| 提案／公告／設備 | 375／500／250 | 750／500／500 |
| 提案／公告留言 | 45,000／60,000 | 90,000／60,000 |
| 附議／公告讚／我也遇到 | 935／30,000／750 | 3,750／60,000／2,500 |
| FCM token／圖片 metadata／Notion mapping | 450／513／1,125 | 900／775／1,750 |
| 7 天通知／1 天 outbox／24 小時冪等資料 | 1,482／291／377 | 2,224／416／596 |

模型算式：提案 `ceil(人數 × 75%)`、設備 `ceil(人數 × 50%)`、公告固定 500；每則提案與公告有 `20 × (1 + 5) = 120` 筆留言。標題、正文、留言分別填到上限的 75%（23／750／53 字），50% 提案與公告、30% 設備附圖片 URL；附議、公告讚與「我也遇到」分別採 `max(5, ceil(人數 × 1%))`、`ceil(人數 × 12%)`、`max(3, ceil(人數 × 0.5%))`。

| 結果 | 500 人 | 1000 人 |
| --- | ---: | ---: |
| `VACUUM FULL` 後整庫活資料 | 87 MB | 125 MB |
| 一般 `VACUUM` 後物理快照 | 212 MB | 164 MB |
| 建議規劃值（活資料 × 1.5） | **131 MB** | **187 MB** |

物理快照會受 autovacuum 時機影響，因此不一定隨人數單調增加；容量規劃採可重現的活資料再加 50%。Firebase 帳號、Cloudinary 圖片檔、Notion 頁面正文、WAL、備份與 PITR 不在上述 database size 內。

## 先做的節省措施

- 保留瀏覽器 WebP 壓縮、圖片張數與來源大小上限。
- 保留 Cloudinary 受控 upload preset，讓格式、檔案大小與尺寸在供應商開始後續處理前就被限制。
- 不要把私密圖片改成公開或建立重複 Cloudinary webhook。
- 維持 Cloudflare 原生 ingress／action burst limits，讓短時間刷取在產生 Supabase Edge invocation 前停止；Supabase 再以 Upstash 執行精確業務配額、驗證快取與背景 worker 限制。
- 保留 Firebase 使用者短效快取與前端內容快取；不要為追求即時感把每次切頁都改成強制重抓。
- 維持私有 Broadcast invalidation；不要改回讓每個 client 訂閱私有資料表變更或週期性輪詢。
- 維持每位使用者 10 個 Push 裝置上限，避免單一帳號無限放大 FCM fan-out。
- 修正失敗的 outbox 事件，不讓永久錯誤無限重試。
- 監控 Supabase egress 與不必要的列表重抓。
- development 測試站只在真的需要時建立，避免維護兩套閒置資源。

每月把供應商帳單、Dashboard、Functions 用量與實際參與量一起看，才能判斷成本是成長、濫用、錯誤重試還是設定造成。

這些保護會降低正常重複操作的外部請求、Edge 執行時間與通知 fan-out，但不等於全域預算熔斷器。仍應在各供應商設定用量提醒並定期核對帳單。
