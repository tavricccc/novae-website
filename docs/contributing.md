# 貢獻指南

本頁為開發者本機開發與貢獻指引。若您只是要部署 Novae，請直接參考[部署準備與服務設定](quick-start.md)。

## 1. 準備本機環境

需要 Git、Node.js 24 與 npm。若需執行本機資料庫與整合測試，需要 Docker（Windows 使用 WSL 2 + Docker Desktop）。

```bash
git clone https://github.com/<your-account>/novae.git
cd novae
npm ci
```

只有在需要連接自訂開發環境時才複製 `.env.example` 為 `.env`。切勿提交任何真實密鑰。

## 2. 修改前須知

1. 閱讀主程式庫的 `AGENTS.md`、`PRODUCT.md` 與 `structure.md`。
2. 遵守 `app → components → hooks → services/lib` 架構分層，不隨意建立平行 API。
3. 新增、刪除或拆分檔案時同步更新 `structure.md`。

## 3. 本機執行與測試環境

```bash
npm run dev
```

啟動完整隔離的本機測試環境（含本地 PostgreSQL、Firebase Auth Emulator、Cloudflare Worker 代理與 Next.js）：

```bash
npm run test:env
```

管理本地資料庫容器與遷移：

```bash
npm run db:start        # 啟動本地 PostgreSQL 容器
npm run db:migrate      # 套用全部 Checksummed 遷移
npm run db:reset:local  # 重設本地資料庫並重新套用遷移
```

## 4. 驗證指令

```bash
npm run verify:local
```

該指令會依序執行：
- TypeScript 型別檢查與未宣告變數檢查
- UI Primitives 與雙語（i18n）規則檢查
- ESLint 語法檢查
- Next.js 16 Production Build 與 Bundle Size 體積預算校驗
- Cloudflare Worker 型別與邊界驗證
- Vitest 單元測試與架構測試
- npm audit 安全稽核

修改後端 Action、權限、資料庫遷移或 Worker 邏輯後執行整合驗證：

```bash
npm run verify:integration
```

大型變更或發送 PR 前執行完整驗證：

```bash
npm run verify:all
```

執行 Chromium E2E 瀏覽器端對端測試：

```bash
npm run test:e2e:install  # 首次安裝 Playwright 瀏覽器
npm run test:e2e          # 執行 E2E 測試
```

## 5. 設定變更與程式碼生成

修改 `config/rate-limits.config.json` 或 `config/api-errors.config.json` 後執行：

```bash
npm run generate:all
```

提交原始 JSON 與自動產生的對應型別檔。分類為執行期動態資料，不再依賴 codegen。

## 6. Pull Request 規範

- PR 應詳細說明問題背景、修改範圍、驗證結果與 UI/權限影響。
- 資料庫結構變更必須新增全新的 migration 檔案，不可修改已發布的 migration。
- 安全性漏洞請依 `SECURITY.md` 管道私下通報。
