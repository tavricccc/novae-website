# 7. 建立 Vercel

這一頁只建立前端託管專案並取得三個 Vercel 值，還不會填寫所有 secrets 或執行發布。完成後回到文件主線集中處理憑證。

## 1. 匯入 Novae fork

登入 [Vercel](https://vercel.com/)，選擇 `Add New → Project`，匯入你在第 1 步建立的 Novae GitHub fork，然後建立 project。

## 2. 取得 Vercel token

在 Vercel Account Settings 的 Tokens 建立一個 deployment token，記錄為 `VERCEL_TOKEN`。只授予部署需要的帳號與期限；交接或權限變更時應重新產生。

## 3. 取得 organization 與 project ID

在 project settings 或執行 Vercel CLI link 後取得：

| Vercel 值 | 稍後填入的 GitHub secret |
| --- | --- |
| Account／Team ID | `VERCEL_ORG_ID` |
| Project ID | `VERCEL_PROJECT_ID` |

這一頁先把三個值記在安全的密碼管理器或暫存表，不要提交到 repository。

## 完成檢查

- [ ] Vercel 已匯入正確的 Novae fork。
- [ ] 已安全保存 `VERCEL_TOKEN`。
- [ ] 已安全保存 `VERCEL_ORG_ID` 與 `VERCEL_PROJECT_ID`。
- [ ] 尚未因缺少其他 secrets 而嘗試發布。

七項服務到此準備完成。下一步開啟[憑證填寫表](../environment-configuration.md)，一次核對並填入 GitHub `production` Environment secrets。
