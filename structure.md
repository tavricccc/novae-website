# Website Structure

修改前先依此結構找檔案；新增、刪除、搬移或拆分檔案時同步更新。

## 內容

- `content/landing/zh.json` / `en.json`：首頁雙語文案，兩邊資料結構必須一致。
- `content/docs-navigation.mjs`：文件側邊欄、順序、上一頁／下一頁與部署教學清單。
- `content/changelog.md`：網站顯示的產品更新紀錄。
- `docs/` / `docs/en/`：繁中與英文 Markdown 文件來源；`deployment/cloudflare.md` 說明 Worker、workers.dev、API token 與 CORS 設定。

## 頁面與互動

- `index.html`：產品首頁結構；文案優先改語系 JSON。
- `category-builder.html`：分類設定產生器結構。
- `src/main.js` / `src/category-builder.js` / `src/main-docs.js`：三個頁面入口。
- `src/config/site.js`：GitHub、授權與文件網址的單一設定來源。
- `src/modules/`：首頁語系、內容渲染、示意介面、規則互動與章節導覽。
- `src/styles/`：`index.js` 統一載入全站字體與共用樣式，另含首頁區塊、章節導覽、示意介面、文件與設定產生器樣式。
- `public/assets/`：Landing 專用透明陶瓷／壓克力裝置與低飽和圖片頭像。

## 建置與驗證

- `scripts/build-docs.mjs`：將 Markdown 轉成文件頁。
- `scripts/validate-content.mjs`：檢查雙語結構、文件導覽與網址鍵。
- `scripts/check-built-links.mjs`：檢查建置結果的內部連結。
- `vite.config.js`：首頁、設定產生器與文件頁的多頁建置。
- `.github/workflows/verify-pr.yml`：PR 靜態驗證。
- `.github/workflows/deploy-pages.yml`：驗證後發布 GitHub Pages。
