# Website Development Guide

1. 修改前先讀 `structure.md`，沿用現有內容與樣式責任，不建立平行實作。
2. 不讀取或搜尋 `node_modules/`、`dist/`、`docs-site/` 等產物。
3. 首頁文案改 `content/landing/*.json`；文件內容改 `docs/`；導覽順序改 `content/docs-navigation.mjs`。
4. 網址集中在 `src/config/site.js`，不要在語系內容重複維護。
5. 中英文內容結構必須一致；允許文字不同，不允許任意缺少欄位或卡片。
6. 新增文件時同步加入文件導覽；刪除文件時同步移除導覽。
7. 新增、刪除、搬移或拆分檔案時更新 `structure.md`。
8. 樣式優先沿用現有 token、按鈕、表面與間距，不另起近似設計系統。
9. 保留必要的 `label`、`aria-label`、焦點狀態與替代文字。
10. 每次變更在 `content/changelog.md` 最前方新增產品向紀錄，只讀與 patch 最前 20 行。
11. 完成後執行 `npm run check`；不以人工預覽取代內容、連結與建置驗證。
