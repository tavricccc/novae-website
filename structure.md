# Website Structure

修改前先依此結構找檔案；新增、刪除、搬移或拆分檔案時同步更新。

## 內容

- `content/landing/zh.json` / `en.json`：首頁雙語文案，兩邊資料結構必須一致。
- `content/docs-navigation.mjs`：文件側邊欄、順序、上一頁／下一頁與部署教學清單。
- `content/changelog.md`：網站顯示的產品更新紀錄。
- `docs/` / `docs/en/`：繁中與英文 Markdown 文件來源；`configuration.md`、`admin-guide.md` 與 `user-guide.md` 維護語言優先 Setup、動態提案／設備分類、分類優先授權與通知收件矩陣；`ui-design-system.md` 定義 Atomic Design、可復用元件、三階陰影與新 UI 交付清單；`contributing.md` 集中 `test:env`、`verify:stress` 與一般驗證規則；`architecture.md` 說明前端邊界；`deployment/cloudflare.md` 說明 Worker、workers.dev、API token 與 CORS 設定。

## 頁面與互動

- `index.html`：產品首頁結構；文案優先改語系 JSON。
- `category-builder.html`：程式內動態分類設定的相容入口與升級說明。
- `src/main.js` / `src/main-docs.js`：首頁與文件頁入口。
- `src/config/site.js`：GitHub、授權與文件網址的單一設定來源。
- `src/modules/`：首頁語系、內容渲染、示意介面、規則互動與章節導覽。
- `src/styles/`：`index.js` 統一載入全站字體與共用樣式，另含首頁區塊、章節導覽、示意介面與文件樣式。
- `public/assets/`：Landing 專用透明陶瓷／壓克力裝置與低飽和圖片頭像。

## 建置與驗證

- `scripts/build-docs.mjs`：將 Markdown 轉成文件頁。
- `scripts/validate-content.mjs`：檢查雙語結構、文件導覽與網址鍵。
- `scripts/check-built-links.mjs`：檢查建置結果的內部連結。
- `vite.config.js`：首頁、分類設定相容說明與文件頁的多頁建置。
- `.github/workflows/verify-pr.yml`：PR 靜態驗證。
- `.github/workflows/deploy-pages.yml`：以 Node.js 24 世代的最新版 GitHub Actions 驗證後發布 GitHub Pages。
- `.gitignore`：排除網站建置產物、依賴、作業系統檔案與本地 `.code-review-graph/` 快取。
