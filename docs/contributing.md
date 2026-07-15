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

## 4. 驗證順序

```bash
npm run typecheck
npm run lint
npm run build
npm run check:unused
```

若修改 Edge、migration、產生腳本或架構邊界，再執行：

```bash
npm run check:edge
npm run test:architecture
```

`npm run verify:local` 會串起完整驗證與離線 production dependency audit。

## 5. Config 變更

修改 `config/issue-categories.config.json` 或 `config/rate-limits.config.json` 後執行：

```bash
npm run generate:all
```

提交原始 JSON 與兩端產生檔。分類規則必須同時符合前端與 Edge；不要手改 `generated/`。

## 6. Pull request

PR 應說明問題、修改範圍、驗證結果、UI／資料／權限影響。schema 變更新增 migration，不修改已部署 migration；安全問題依 `SECURITY.md` 私下回報。
