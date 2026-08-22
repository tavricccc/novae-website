# 一步一步排錯

排錯的關鍵是先鎖定「第一個失敗的邊界」，不要同時修改多個服務的設定。

## 1. GitHub Actions 部署工作流程失敗

1. 打開失敗的 workflow run，定位第一個紅色的步驟。
2. **`Missing backend deployment values`**：回到 GitHub fork 的 `Settings → Environments → production`，對照[憑證填寫表](environment-configuration.md)補齊缺少的 secret。
3. **`Apply forward-only Neon migrations` 失敗**：
   - 檢查 `NEON_DATABASE_URL` 是否正確且 Neon Project 處於 Active 狀態。
   - 確認沒有手動修改過資料庫結構或破壞 Checksum 雜湊。
4. **`Configure the least-privilege Worker database role` 失敗**：
   - 檢查 `NEON_RUNTIME_PASSWORD` 是否為有效隨機密碼。
   - 確認 Neon 資料庫使用者具備建立角色的權限。
5. **`Validate Hyperdrive binding` 失敗**：
   - 確認 `CLOUDFLARE_HYPERDRIVE_ID` 為 32 字元的十六進位 ID（不含空格或額外字元）。
6. **`Smoke test authentication and database health` 失敗**：
   - 檢查 Cloudflare Dashboard 中的 `Workers & Pages → novae-api → Logs`。
   - 確認 `HEALTHCHECK_SECRET` 已正確設定。

## 2. 登入問題與人機驗證

1. **Google 帳號選擇器未跳出或報錯**：
   - 確認 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 來自與 Firebase 相同的 GCP 專案。
   - 確認 Google Cloud Console 中 Web OAuth Client 的 **Authorized JavaScript origins** 包含目前訪問的完整網域（含 `https://`，結尾無 `/`）。
   - 確認 CSP 未阻擋 `https://accounts.google.com`。
2. **Cloudflare Turnstile 驗證失敗**：
   - 確認 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 與 `TURNSTILE_SECRET_KEY` 成對且正確。
   - 確認 Turnstile Widget 的允許網域清單包含正式站網域與 `localhost`。
3. **登入提示「網域不符」**：
   - 確認登入的 Google 信箱後綴與 `NEXT_PUBLIC_ALLOWED_DOMAIN` / `ALLOWED_DOMAIN` 完全一致（例如 `school.edu.tw`，不可帶 `@`）。

## 3. 瀏覽器 API 請求與 CORS 錯誤

若瀏覽器 Console 出現：
```text
Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present
```

請依序檢查：
1. `ALLOWED_ORIGINS` 必須與 Console 顯示的 `from origin 'https://…'` 完全一致。
2. **`ALLOWED_ORIGINS` 結尾絕對不能有 `/`**（正確：`https://school-novae.vercel.app`；錯誤：`https://school-novae.vercel.app/`）。
3. 確認填入的是前端 Vercel 網域，而不是 Worker 本身的 URL。
4. 修改 GitHub secret 後，必須**重新執行一次後端部署**以更新 Worker 執行期設定。

## 4. 圖片上傳或顯示異常

1. **上傳時瀏覽器卡住或報錯**：
   - 確認瀏覽器支援 WebAssembly（用於 `@jsquash/webp` 客戶端壓縮）。
   - 檢查上傳張數是否超過「系統設定 → 平台設定」中所設定的上限。
2. **圖片上傳後無法顯示**：
   - 確認 `CLOUDINARY_CLOUD_NAME`、`CLOUDINARY_API_KEY`、`CLOUDINARY_API_SECRET` 正確。
   - 確認後端部署時 `srp-secure-images` preset 已由 `configure-cloudinary.mjs` 自動建立成功。
   - 確認 `MEDIA_SIGNING_SECRET` 已設定且前後端版本一致。

## 5. 即時更新與通知異常

1. **討論區或狀態沒有即時連線**：
   - 確認 `REALTIME_TICKET_SECRET` 已設定。
   - 檢查 Cloudflare Worker 是否已正確綁定 Durable Objects（`RealtimeHub`）。
2. **Web Push 推播無法送達**：
   - 確認 `NEXT_PUBLIC_FIREBASE_VAPID_KEY` 為有效的 FCM VAPID Public Key。
   - 確認 `GOOGLE_SERVICE_ACCOUNT_JSON` 為完整 JSON 內容且具備 Firebase Cloud Messaging 發送權限。
   - 檢查使用者的推播裝置 Token 是否在「設定」中正常啟用。

## 6. 提供除錯資訊

向維護團隊提報問題時，請附上：
- 發生時間與時區
- 操作的使用者角色、案件分類與目標 ID
- 瀏覽器 Network 面板中的 HTTP 狀態碼與回應中的 `error.code`、`error.requestId`
- 相關 GitHub Actions Workflow Run 連結
*(注意：提供日誌前請移除所有密鑰、Token、密碼與 Service Account 敏感內容)*
