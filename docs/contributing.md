# 貢獻指南

本頁是唯一以本機開發為主的文件。只想部署 Novae 的人不需要執行這些指令，請從[部署準備與服務設定](quick-start.md)開始。

## 1. 準備本機

需要 Git、Node.js 24 與 npm。涉及 Edge Function 型別時，專案依賴會提供 Deno；涉及本機 Supabase 才需要 Docker。

```bash
git clone https://github.com/<your-account>/novae.git
cd novae
npm ci
```

只有要連接開發服務時才複製 `.env.example` 為未追蹤的 `.env`。不得提交真實值。

## 2. 修改前

1. 讀主 repository 的 `AGENTS.md` 與 `structure.md`。
2. 確認工作樹已有的變更，不覆蓋無關內容。
3. 依 `views → components → composables → services/lib` 邊界修改，不另起平行 API。
4. 新增、刪除、搬移或拆分檔案時同步更新 `structure.md`。

## 3. 本機執行

```bash
npm run dev
```

只有要驗證 migration 與本機 Supabase 時才使用：

```bash
npm run db:start
npm run db:reset:local
npm run db:lint:local
```

## 4. 驗證

```bash
npm run verify:local
```

若修改後端 action、權限、RPC、RLS、migration、Edge Function 或 worker：

```bash
npm run verify:integration
```

大型變更或合併前執行：

```bash
npm run verify:all
```

PR CI 會自動執行兩套驗證。Windows 直接在 PowerShell 執行 npm 指令即可；整合驗證會自動轉入 WSL。Windows 需要 WSL 2、Docker，以及 WSL `PATH` 內的 Supabase CLI 與 Deno；Linux 與 CI 不需要 WSL。

整合驗證會重建隔離的本地 Supabase、套用全部 migration、執行 database lint，再檢查 action、權限、RLS、冪等與 worker lifecycle。`.env.local` 可省略；即使存在，Supabase 網址與金鑰也會強制換成本地值，不會寫入遠端資料。

### 何時補整合測試

| 修改 | 必須補的案例 |
|---|---|
| 新 backend action | 成功行為與相關拒絕行為；漏掉 action 時 coverage guard 會失敗 |
| 新角色／權限 | allowed、denied；有 scope 時再測 scope 內與 scope 外 |
| RPC／schema／migration | 對真實本地資料庫的結果 assertion |
| RLS | 依適用範圍測 anon、authenticated、service role |
| 冪等寫入 | 缺少 request ID、首次執行、相同 ID replay |
| worker／outbox／刪除工作 | claim、完成或失敗、retry／deduplication |
| 純前端版面 | 通常不需補整合測試，跑 `verify:local` |

不得只加入沒有 assertion 的 action 呼叫來通過 coverage guard。新增案例放進 `tests/integration/` 最接近的領域檔案；若建立新領域檔，也要加入 `action-coverage.test.ts` 的掃描清單。

## 5. Config 變更

修改 `config/issue-categories.config.json` 或 `config/rate-limits.config.json` 後執行：

```bash
npm run generate:all
```

提交原始 JSON 與兩端產生檔。分類規則必須同時符合前端與 Edge；不要手改 `generated/`。

## 6. Pull request

PR 應說明問題、修改範圍、驗證結果、UI／資料／權限影響。schema 變更新增 migration，不修改已部署 migration；安全問題依 `SECURITY.md` 私下回報。
