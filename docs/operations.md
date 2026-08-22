# 上線後維運

維運的核心在於建立明確的例行檢查、自動化備份驗證與事故處理邊界，保障校園平台長期穩定運行。

## 每次部署後驗收

1. 確認 `Deploy Neon and Cloudflare Backend` 先成功，隨後的 `Deploy Frontend to Vercel` 亦順利完成。
2. 開啟正式網址重新登入，確認角色與分類載入無誤。
3. 建立一件測試提案，確認圖片 WebAssembly 壓縮、上傳、附議與討論區功能。
4. 使用管理員帳號執行一次審核或狀態更新，並在管理主控台查看審計日誌。
5. 檢查 Cloudflare Worker 與 Neon 資料庫日誌無異常錯誤。

## 例行檢查節奏

| 頻率 | 檢查項目 |
| --- | --- |
| 每日 | 檢視待審核／未回覆案件、管理主控台活動指標、Cloudflare Queue (`novae-jobs`) 佇列堆積與錯誤追蹤 |
| 每週 | 檢視資料保留清理排程狀態、推播送達重試次數、Cloudinary 與 Neon 儲存用量 |
| 每月 | 核對各雲端平台免費額度（Neon, Cloudflare, Firebase, Cloudinary, Vercel）與 Token 有效期限、確認每日加密備份產物正常產出 |
| 每學期 | 檢視校內允許網域、總管理員名單、分類規則、附議門檻與資料保留天數設定 |

## 自動化資料庫備份與災難復原

### 1. 自動化加密備份（Daily Backup）
專案內建 `.github/workflows/backup-database.yml` 工作流程：
- 每日定時檢查最新備份時間，超過 72 小時即自動觸發。
- 使用 `pg_dump` 導出完整 PostgreSQL 邏輯備份。
- 採用 **`age` 非對稱加密工具** 對導出資料進行高強度加密，明文資料絕不離開 GitHub Runner。
- 校驗 Checksum 後上傳為 GitHub Artifacts，並自動保留最新的 2 份備份。

#### 設定 `BACKUP_AGE_RECIPIENT` 加密公鑰
1. 在本機安裝 `age`（macOS: `brew install age`、Windows: `winget install FiloSottile.age`、Linux: `apt install age`）。
2. 執行指令產生公私鑰對：
   ```bash
   age-keygen -o key.txt
   ```
3. 檔案內容包含：
   - 公鑰（Public key / Recipient）：形如 `age1...`
   - 私鑰（Secret key）：形如 `AGE-SECRET-KEY-1...`
4. 將公鑰字串（`age1...`）填入 GitHub `production` Environment Variables（或 Secrets）的 `BACKUP_AGE_RECIPIENT`。
5. 將 `key.txt` 私鑰檔案安全離線保存於密碼管理器中，切勿提交至程式庫。
6. 日後需解密下載的備份 Artifact 時，執行：
   ```bash
   age --decrypt -i key.txt novae.dump.age > novae.dump
   ```

### 2. 受保護的手動災難重設（Disaster Reset）
專案提供手動緊急重設工作流程 `.github/workflows/reset-database-and-cloudinary.yml`：
- 具備防誤觸機制，必須在 `workflow_dispatch` 輸入精確的確認字串 `RESET_DATABASE_AND_CLOUDINARY` 才會執行。
- 清空資料表、重新按版本順序套用所有 Neon migrations。
- 自動修復最低權限 `novae_runtime` 資料庫角色與 Hyperdrive 連線。
- 清除 Cloudinary 資源並重新配置 `srp-secure-images` 上傳 preset。

## 事故處理五步驟

1. **界定影響範圍**：全體成員或特定帳號？全部分類或特定分類？讀取受阻或寫入失敗？
2. **定位失敗邊界**：
   - 瀏覽器端 / CSP Nonce
   - Cloudflare Turnstile 人機驗證
   - Firebase Authentication / App Check
   - Cloudflare Worker API 核心 / Hyperdrive 連線
   - Neon PostgreSQL 資料庫
   - Cloudflare Queues (`novae-jobs`) 佇列
   - Cloudinary / Notion 外部服務
3. **保留診斷證據**：記錄精確時間點、`requestId`、`error_trace_id`、HTTP 狀態碼與相關 Actions 執行日誌。
4. **降低損害**：暫停異常操作或問題發布，**切勿直接關閉身分驗證或資料庫角色安全邊界**。
5. **修復與驗收**：於正確層級修復問題，進行全流程測試驗證，並記錄原因與防範措施。

## 憑證輪替指引

每次只輪替一項服務憑證，遵循以下順序：
`產生新憑證 → 更新 GitHub production secret → 重新執行對應部署流程 → 完整功能驗收 → 撤銷舊憑證`。切勿同時輪替所有服務，以免難以定位配置問題。

若遇具體錯誤症狀，請參閱[一步一步排錯](troubleshooting.md)。
