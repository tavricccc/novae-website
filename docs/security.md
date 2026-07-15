# 安全與隱私

Novae 的安全模型是假設瀏覽器、使用者輸入與公開網路都不可信。登入只是第一關；每個 action 與資料讀寫仍由後端與資料庫重新授權。

## 上線前逐步確認

1. 只允許學校控制的 Google 網域，且 `VITE_ALLOWED_DOMAIN` 與 `ALLOWED_DOMAIN` 相同。
2. `ADMIN_EMAILS` 只列出確實需要管理權限的人。
3. 所有敏感值只在 GitHub `production` Environment secrets 與供應商 secret store。
4. service role、service account、API secret、DB password、token 沒有進瀏覽器或 Git。
5. Firebase authorized domains 只有實際使用的網域。
6. 正式站驗收完成後啟用 App Check。
7. 逐分類確認公開、審核後公開與私密案件的讀取、附件與留言權限。
8. 學校已提供隱私告知、內容申訴、資料保留與刪除窗口。

## 信任邊界

| 邊界 | 控制 |
| --- | --- |
| 瀏覽器 | 只持有公開 config；內容清理、CSP、無敏感憑證 |
| Firebase | token signature、project/audience、verified Email、允許網域 |
| Edge Functions | action allowlist、角色、schema、限流、冪等與 request ID |
| Postgres | RLS、私有 schema、RPC、constraints、交易 |
| Cloudinary | 簽名上傳、受控 preset、簽章 callback、短效簽名讀取 |
| 第三方服務 | 專用 integration、最小權限、失敗隔離與 outbox |
| GitHub Actions | Environment secrets、分支／review 保護、固定工具版本 |

## 分類與隱私

- `school` 代表允許網域的已登入者可讀，不等於公開網際網路。
- `reviewed-school` 在審核前只供作者與管理員讀，通過後才校內可讀。
- `owner-admin` 只供作者與管理員讀；附件與留言也維持私密。
- `authorVisible: false` 只隱藏一般內容畫面的作者，不代表系統完全不保存作者關聯。

## 濫用與成本邊界

- 登入同步與 Cloudinary webhook 會先依請求來源執行短時間與固定窗口限流，再進入 Firebase、簽章驗證或資料庫工作。
- 一般 JSON 與 webhook request body 上限為 64 KB，避免大型無效內容消耗解析記憶體與執行時間。
- `backendAction` 依讀取、一般寫入、敏感寫入、管理寫入與圖片解析分組限流；提案、留言、附議、按讚與圖片上傳另有領域上限。
- 每位使用者最多保留 10 個 Push 裝置；既有裝置可以更新 token，但新裝置不能無限增加通知 fan-out。
- Realtime 只允許訂閱經 RLS 授權的私有 Broadcast topics，登入者不能直接讀取通知與即時事件私有表。
- Cloudinary preset 在供應商端強制 authenticated WebP、800 KB 與最長邊 2000 px；webhook 仍會再次驗證結果並排程刪除不合規資源。

## Secret 處理

GitHub secrets 會在 workflow 中注入，但日誌遮罩不是萬無一失。不要 `echo` 結構化 service account JSON；輪替時建立新值、更新 Environment、部署與驗收後再撤銷舊值。人員交接時同時檢查 GitHub、Vercel、Supabase、Firebase、Cloudinary、Notion、Upstash 權限。

## 已知責任

開源程式不會替學校自動完成個資法評估、資料處理協議、事件通報、備份政策或內容治理。部署單位必須依所在法域、學生年齡與校內制度決定保留期限、管理責任與告知內容。

## 回報漏洞

不要在公開 issue 貼可利用細節或真實資料。請依主 repository 的 `SECURITY.md` 私下回報，附版本、影響、重現條件與建議修法；移除所有學生資料與憑證。
