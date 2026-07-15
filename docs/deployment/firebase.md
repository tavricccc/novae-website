# 2. 建立 Firebase

Firebase 在 Novae 中負責 Google 登入、Firebase Cloud Messaging Web Push、App Check 與後端身分驗證。

## 1. 建立 project 與 Web App

在 [Firebase Console](https://console.firebase.google.com/) 建立 project，再新增一個 Web App。記錄 Web config 中的：

| Web config | GitHub secret |
| --- | --- |
| `apiKey` | `VITE_FIREBASE_API_KEY`、`FIREBASE_WEB_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID`、`FIREBASE_PROJECT_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |

同一列重複使用的是同一個值，不要另外產生。

## 2. 啟用 Google 登入

在 Authentication 的 Sign-in method 啟用 Google provider，選定支援 Email。把 Vercel 正式網域與自訂網域加入 authorized domains。Novae 後端仍會再檢查 `ALLOWED_DOMAIN`，所以啟用 Google 不代表任何 Google 帳號都能使用。

## 3. 建立 Web Push key

在 Cloud Messaging 的 Web configuration 建立或使用 Web Push certificate，複製 public VAPID key 到 `VITE_FIREBASE_VAPID_KEY`。這是公開金鑰，不是 service account private key。

## 4. 下載 service account JSON

從 Project settings 的 Service accounts 產生新的 private key。下載後，把檔案的完整 JSON 內容安全保存，稍後填入 `GOOGLE_SERVICE_ACCOUNT_JSON`。不要提交檔案，也不要只填路徑。

## 5. App Check 先關後開

第一次部署先設定：

```text
VITE_FIREBASE_APP_CHECK_ENABLED=false
```

待正式網域、登入與 API 都驗收完成，再建立 reCAPTCHA Enterprise site key、填 `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`，最後改成 `true` 重新部署。這可避免還沒允許正式網域就把所有請求擋掉。

Firebase Web Google 登入、FCM 與 App Check 的最新操作請以 [Firebase 官方文件](https://firebase.google.com/docs)為準。

## 完成檢查

- [ ] 五個 Web config 值來自同一 Web App。
- [ ] Google provider 已啟用。
- [ ] VAPID public key 已取得。
- [ ] service account JSON 已安全保存。
- [ ] 初次部署的 App Check flag 是 `false`。

下一步：[建立 Supabase](supabase.md)。
