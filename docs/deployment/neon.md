# 3. 建立 Neon 資料庫

Neon 是 Novae 的 Serverless PostgreSQL 17 資料庫平台。所有提案、設備回報、公告、留言、動態分類、使用者限制與審計日誌都保存在 Neon 中。瀏覽器不直接連線資料庫；所有操作由 Cloudflare Worker 透過 Cloudflare Hyperdrive 連線集區並以最低權限 `novae_runtime` 資料庫角色安全執行。

## 1. 建立 Neon Project

1. 登入 [Neon Console](https://console.neon.tech/)。
2. 點擊 **Create Project**。
3. 為專案命名（例如 `novae-school`），選擇 PostgreSQL 17 版本與最靠近學校的 Region。
4. 建立完成後，在 Dashboard 的 **Connection Details** 中複製完整連線字串（`postgres://...`）。

## 2. 記錄 GitHub Secrets

從 Neon Dashboard 取得並產生下列值，儲存至 GitHub `production` Environment secrets：

| 項目 | GitHub Secret | 說明 |
| --- | --- | --- |
| 連線字串 | `NEON_DATABASE_URL` | Neon Project 的完整 PostgreSQL 連線網址（含帳號、密碼與主機）。 |
| 執行期密碼 | `NEON_RUNTIME_PASSWORD` | 獨立隨機字串，供 `scripts/configure-database-runtime.mjs` 自動建立最低權限 `novae_runtime` 資料庫角色。 |

在 PowerShell 產生高強度 `NEON_RUNTIME_PASSWORD`：

```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

## 3. 自動化遷移與最低權限角色

你不需要手動連線資料庫執行 SQL 指令碼：

1. **自動執行遷移**：GitHub Actions 後端工作流程（`deploy-backend.yml`）會透過 `npm run db:migrate` 自動依序套用 `database/migrations/` 下所有 forward-only 遷移，並透過規範化 Checksum 保證遷移歷史一致。
2. **自動建立執行期角色**：工作流程隨後執行 `node scripts/configure-database-runtime.mjs`，在資料庫中自動建立／更新 `novae_runtime` 角色，僅授予必要的 DML（SELECT, INSERT, UPDATE, DELETE）、Sequence 使用與資料庫 Function 執行權限，不賦予任何 DDL 結構修改或角色管理權限。
3. **Hyperdrive 連線同步**：腳本驗證該角色的查詢能力後，將連線字串安全同步給 Cloudflare Hyperdrive。

## 完成檢查

- [ ] `NEON_DATABASE_URL` 已填入 GitHub `production` Environment secrets 且格式正確。
- [ ] `NEON_RUNTIME_PASSWORD` 已產生並填入獨立高強度隨機值。
- [ ] 沒有手動修改或手動貼入 migration SQL。

下一步：[建立 Cloudinary](cloudinary.md)。
