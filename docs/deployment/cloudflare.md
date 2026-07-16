# 8. 建立 Cloudflare Worker

Cloudflare Worker 是瀏覽器看到的固定 API 入口。它會先檢查 CORS、Firebase token 與 Upstash 限流，只有通過的請求才轉送到隨機名稱的 Supabase Edge Functions。被 Upstash 擋下的 `429` 不會先進入 Supabase，因此不會消耗該次 Edge Function invocation。

## 1. 建立 Cloudflare 帳號與 workers.dev 子網域

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 開啟 `Workers & Pages`。
3. 第一次使用 Workers 時，依畫面註冊 `workers.dev` 子網域。
4. 子網域只能使用 Cloudflare 接受的格式，通常會轉成小寫。例如輸入 `NNKIEH` 時，實際會使用 `nnkieh.workers.dev`。

正式 Worker 名稱固定為 `novae-api`，所以公開 API URL 是：

```text
https://novae-api.<你的-workers.dev-子網域>.workers.dev
```

例如：

```text
https://novae-api.nnkieh.workers.dev
```

不要把這個固定 Worker 名稱改成隨機值。只有 Supabase Function 名稱會使用私密 namespace。

## 2. 取得 Cloudflare Account ID

在 Cloudflare Dashboard 選擇正確帳號。Account ID 可在帳號首頁、Workers 頁面右側或網址中找到，是 32 個十六進位字元。稍後存成：

```text
CLOUDFLARE_ACCOUNT_ID
```

不要填 zone ID，也不要填 Email 或帳號顯示名稱。

## 3. 建立 GitHub Actions 專用 API token

1. 進入 Cloudflare 的 `My Profile → API Tokens`。
2. 選擇 `Create Token`。
3. 使用 `Edit Cloudflare Workers` 範本，或建立具備 Workers Scripts Edit 權限的自訂 token。
4. Account Resources 只選這個 Novae Worker 所在帳號。
5. 建立後立即複製 token；離開頁面後通常無法再次查看。
6. 稍後將它存成 `CLOUDFLARE_API_TOKEN`。

不要把互動式 `wrangler login` 的本機 OAuth 資料貼到 GitHub，也不要給 token 不必要的其他帳號權限。

## 4. 決定固定 Worker URL

把完整網址記為：

```text
CLOUDFLARE_WORKER_URL=https://novae-api.<子網域>.workers.dev
```

這個值：

- 必須包含 `https://`。
- 結尾不要加 `/`。
- 不要加 `/v1/actions`；workflow 與前端會自行接上路徑。

## 5. 填寫 ALLOWED_ORIGINS

`ALLOWED_ORIGINS` 是允許呼叫 Worker 的前端 Origin。請填 Vercel 正式網域的完整 Origin，例如：

```text
https://你的-project.vercel.app
```

> **最容易踩坑的地方：最後絕對不能有 `/`。**  
> 正確：`https://你的-project.vercel.app`  
> 錯誤：`https://你的-project.vercel.app/`

同時注意：

- 必須包含 `https://`。
- 只能是 Origin，不可加 `/login`、`/issues` 或其他路徑。
- 不要加引號。
- 不要填 `*`。
- 多個 Origin 用半形逗號分隔，例如 `https://正式站.example.com,https://另一個正式站.example.com`。
- 逗號前後不要加入不必要的空白。

瀏覽器會把來源送成沒有尾斜線的 `https://host`。Worker 使用精確字串比對；多一個 `/` 就會讓預檢回 `403 origin-denied`，瀏覽器顯示缺少 `Access-Control-Allow-Origin`。

## 6. 產生 Edge namespace 與 origin secret

在自己信任的 PowerShell 執行：

```powershell
$namespaceBytes = New-Object byte[] 18
[Security.Cryptography.RandomNumberGenerator]::Fill($namespaceBytes)
$edgeNamespace = ([Convert]::ToHexString($namespaceBytes)).ToLower()

$secretBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
$edgeOriginSecret = [Convert]::ToBase64String($secretBytes)
```

將結果分別存成：

```text
EDGE_FUNCTION_NAMESPACE
EDGE_ORIGIN_SECRET
```

- namespace 保存在 GitHub secret，不要公開。
- Function 部署名稱會自動變成 `n<namespace>-api`、`-sync`、`-media`、`-outbox`、`-delete`、`-maintenance`。
- 前面的 `n` 保證名稱以英文字母開頭；即使 namespace 以數字開頭也能部署。
- namespace 不會每次部署自動更換。只有主動輪替 secret 並重新部署時，Function URL 才會改變。
- origin secret 是 Worker 與內部背景工作呼叫 Supabase Function 的第二道驗證，必須使用獨立隨機值。

## 7. 全部只填到 GitHub production

本頁取得的值全部放在 fork 的：

```text
Settings → Environments → production → Environment secrets
```

需要四個值：

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
CLOUDFLARE_WORKER_URL
ALLOWED_ORIGINS
EDGE_FUNCTION_NAMESPACE
EDGE_ORIGIN_SECRET
```

不用在 Cloudflare Worker Settings 或 Supabase Dashboard 再手動填一次。修改 GitHub secret 後，重新執行 `Deploy Supabase Backend`，Action 就會自動同步並部署。

## 完成檢查

- [ ] workers.dev 子網域已建立。
- [ ] 固定 Worker URL 是 `https://novae-api.<子網域>.workers.dev`。
- [ ] Account ID 來自正確 Cloudflare 帳號。
- [ ] API token 只授權需要的帳號與 Workers 部署。
- [ ] `ALLOWED_ORIGINS` 含 `https://`，且最後沒有 `/`。
- [ ] namespace 與 origin secret 是兩個獨立隨機值。

八項服務到此準備完成。下一步開啟[憑證填寫表](../environment-configuration.md)，一次核對並填入 GitHub `production` Environment secrets。
