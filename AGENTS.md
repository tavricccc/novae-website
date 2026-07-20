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
12. 主程式本地驗證與測試增補規則集中維護於 `docs/contributing.md` 與 `docs/en/contributing.md`；兩語結構同步，主程式 repo 只保留短版命令入口。
13. 主程式 UI 規範以 `novae/src/styles/primitives.css` 與 `novae/src/components/ui/` 為單一來源；本網站只負責同步說明，不另行定義另一套主程式元件契約。
14. 主程式新增或調整 viewport、button、card、list、dropdown、shadow、control primitive 時，同步更新雙語 contributing／architecture 文件與產品更新紀錄。
15. 分類是 Postgres runtime 資料；提案與設備文件必須維持相同的動態分類、瀏覽、建立與分類管理語意，不得再描述硬編碼分類或分類 codegen。
16. 平台總管理員只由 `ADMIN_EMAILS` 決定；文件不得描述任何 UI 指派方式。分類管理權限一律描述為先選分類，再查看、新增、修改或撤銷該分類負責人。
17. 通知收件人異動時，同步更新雙語 configuration、user guide、admin guide、security 與 operations；新提案／設備回報只通知明確指派的分類負責人，平台總管理員不因身分自動收件。
18. 本地完整環境與壓測的正式入口分別是 `npm run test:env` 與 `npm run verify:stress`；文件不另維護手動拼裝服務的平行流程。
