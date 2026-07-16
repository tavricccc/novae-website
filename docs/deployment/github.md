# 1. 準備 GitHub

這一步建立部署控制中心。完成後，你會有自己的 Novae fork、可執行的 Actions，以及一個 `production` Environment。

## 1. Fork 專案

登入 GitHub，打開 [Novae repository](https://github.com/tavricccc/novae)，選擇 Fork，建立在你能管理 Settings 的帳號或組織下。

## 2. 啟用 Actions

進入 fork 的 `Actions`。若 GitHub 顯示來自 fork 的 workflow 尚未啟用，確認你信任程式碼後啟用。不要刪除 `.github/workflows/` 內的部署檔。

## 3. 建立 production Environment

1. 進入 `Settings → Environments`。
2. 建立名稱完全是 `production` 的 Environment。
3. 之後所有正式憑證都加在這個 Environment 的 secrets。
4. 若多人共同維護，可加 required reviewers 與只允許 `main` 分支部署的保護規則。

GitHub Environment 會在 job 開始時提供該環境的 secrets；它也能限制分支與加上人工核准。參考 [GitHub 官方 Environment 文件](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)。

## 4. 不必先建立 development

目前 workflow 讓 `main` 對應 `production`、`dev` 對應 `development`。若你只要正式站，先只維護 `main` 與 `production`；需要獨立測試站時再建立 `dev` 分支、`development` Environment 與另一套服務憑證。

## 5. 上游更新後同步 fork

正式部署由你的 fork 執行，不是上游 repository。當上游發布修正時：

1. 打開你自己的 fork 首頁。
2. 選擇 `Sync fork`。
3. 選擇 `Update branch`。
4. 確認 fork 的 `main` 已出現最新 commit。
5. 再從 fork 的 `Actions` 執行 workflow。

不要在舊的失敗 run 直接按 Re-run，若它仍指向舊 commit，就不會包含新修正。production secrets 也必須填在實際執行 Actions 的 fork。

## 完成檢查

- [ ] fork 在你可管理的帳號或組織下。
- [ ] Actions 已啟用。
- [ ] `production` Environment 已建立。
- [ ] 你知道 secrets 要放 Environment secrets，不是公開 Variables。

下一步：[建立 Firebase](firebase.md)。
