# 2. 建立 Firebase

Firebase 在 Novae 中負責 Google 登入、Firebase Cloud Messaging Web Push、App Check 與後端身分驗證。

## 1. 建立 project 與 Web App

在 [Firebase Console](https://console.firebase.google.com/) 建立 project，再新增一個 Web App。記錄 Web config 中的：

| Web config | GitHub secret |
| --- | --- |
| `apiKey` | `NEXT_PUBLIC_FIREBASE_API_KEY`、`FIREBASE_WEB_API_KEY` |
| `authDomain` | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`、`FIREBASE_PROJECT_ID` |
| `appId` | `NEXT_PUBLIC_FIREBASE_APP_ID` |
| `messagingSenderId` | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |

同一列重複使用的是同一個值，不要另外產生。

## 2. 啟用 Google 登入

在 Authentication 的 Sign-in method 啟用 Google provider，選定支援 Email。把 Vercel 正式網域與自訂網域加入 Firebase authorized domains。Novae 後端仍會再檢查 `ALLOWED_DOMAIN`，所以啟用 Google 不代表任何 Google 帳號都能使用。

正式環境的瀏覽器 Google 登入 UI 使用 **Google Identity Services（Token Client）**，再交給 Firebase `signInWithCredential` 建立 session。本機 Auth Emulator／`npm run test:env` 仍可用 Firebase popup，不需真實 GIS client ID。

## 3. 取得 Web OAuth Client ID（`NEXT_PUBLIC_GOOGLE_CLIENT_ID`）

1. 開啟 [Google Cloud Console](https://console.cloud.google.com/)，選擇**與 Firebase 相同的 GCP 專案**。
2. 進入 **APIs & Services → Credentials**。
3. 在 **OAuth 2.0 Client IDs** 找到類型為 **Web client** 的項目（常見名稱含 `Web client (auto created by Google Service)`，或啟用 Firebase Google 登入後自動建立的 client）。
4. 複製 **Client ID**（形狀為 `….apps.googleusercontent.com`）填入 GitHub secret `NEXT_PUBLIC_GOOGLE_CLIENT_ID`。
5. 在同一 Web client 的 **Authorized JavaScript origins** 加入：
   - 正式站 origin（例如 `https://school-novae.vercel.app` 或自訂網域；含 `https://`，不要尾隨 `/`）
   - 本機 Next.js origin（例如 `http://localhost:3000`）
6. **不要**為每個 Vercel preview URL 逐一授權；preview 可能無法完成真實 GIS 登入。正式與本機即可。

此值是公開的 OAuth client ID，不是 service account JSON，也不是 `NEXT_PUBLIC_FIREBASE_API_KEY`。缺少此 secret 時，非 emulator 建置會在部署驗證失敗或登入時 fail closed。

## 4. 建立 Web Push key

在 Cloud Messaging 的 Web configuration 建立或使用 Web Push certificate，複製 public VAPID key 到 `NEXT_PUBLIC_FIREBASE_VAPID_KEY`。這是公開金鑰，不是 service account private key。

## 5. 下載 service account JSON

從 Project settings 的 Service accounts 產生新的 private key。下載後，把檔案的完整 JSON 內容安全保存，稍後填入 `GOOGLE_SERVICE_ACCOUNT_JSON`。不要提交檔案，也不要只填路徑。

## 6. 配置 Firebase App Check（reCAPTCHA Enterprise）

Novae 後端 Cloudflare Worker 對所有認證 API 請求（`/v1/actions`、`/v1/auth/sync` 等）均強制校驗 App Check JWT。因此在正式部署時必須完整配置並啟用 App Check：

1. **建立 reCAPTCHA Enterprise Key**：
   - 開啟 [Google Cloud Console](https://console.cloud.google.com/)，切換至與 Firebase 相同的專案。
   - 進入 **Security → reCAPTCHA Enterprise**（若未啟用請先啟用 API）。
   - 點擊 **Create Key**：
     - **Display name**：填入 `Novae Web`。
     - **Platform type**：選擇 **Website**。
     - **Domain list**：加入你的正式站網域（如 `school-novae.vercel.app`、自訂網域）以及本機開發用的 `localhost`。
     - **Integration type**：選擇 **Score-based (no challenge)** 或 **Check challenge**（一般推薦 score-based）。
   - 建立完成後複製 **Key ID / Site Key**，填入 GitHub secret `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY`。

2. **在 Firebase 註冊 App Check 提供者**：
   - 開啟 [Firebase Console](https://console.firebase.google.com/)，進入 **App Check → Apps**。
   - 在清單中找到剛建立的 Web App，點擊 **Register**（或 **Manage**）。
   - 選擇 **reCAPTCHA Enterprise**，貼上剛建立的 reCAPTCHA Enterprise Site Key 並儲存。
   - （可選）Token TTL 保持預設即可。

3. **設定 Environment Secret**：
   - `NEXT_PUBLIC_FIREBASE_APP_CHECK_ENABLED`：填入 `true`。
   - `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY`：填入剛才取得的 Site Key。

Firebase Web Google 登入、FCM 與 App Check 的最新操作請以 [Firebase 官方文件](https://firebase.google.com/docs)為準。

## 完成檢查

- [ ] 五個 Web config 值來自同一 Web App。
- [ ] Google provider 已啟用。
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 來自同一專案的 Web OAuth client。
- [ ] OAuth Web client 的 Authorized JavaScript origins 已含正式站與本機。
- [ ] VAPID public key 已取得。
- [ ] service account JSON 已安全保存。
- [ ] reCAPTCHA Enterprise Site Key 已建立並在 Firebase App Check 註冊。
- [ ] `NEXT_PUBLIC_FIREBASE_APP_CHECK_ENABLED` 設為 `true` 且 `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY` 已填入。

下一步：[建立 Neon 資料庫](neon.md)。
