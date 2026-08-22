# 安全與隱私

Novae 採用縱深防禦（Defense-in-Depth）安全模型：假設瀏覽器客戶端、使用者輸入與公開網路皆不可完全信任。身分驗證只是第一道防線，所有業務操作、資料讀寫與媒體傳輸皆由後端與資料庫獨立進行多層授權與約束。

## 上線前安全檢查

1. **網域鎖定**：嚴格限定學校控制的 Google Workspace 網域，確認 `NEXT_PUBLIC_ALLOWED_DOMAIN` 與 `ALLOWED_DOMAIN` 相同。
2. **最高管理員邊界**：`ADMIN_EMAILS` 只列出實際需要全站管理權限的人員。
3. **金鑰隔離**：所有機密憑證（資料庫密碼、Service Account JSON、API Secret）只保存在 GitHub `production` Environment secrets 與執行期容器環境中，絕不出現在瀏覽器或 Git 歷史。
4. **人機驗證與防護**：
   - 啟用 **Cloudflare Turnstile** 阻擋自動化註冊與爬蟲。
   - 啟用 **Firebase App Check**（reCAPTCHA Enterprise）保護公開 API 端點。
5. **分類權限核對**：逐一確認公開、審核後公開與私密案件的閱讀範圍、附件與留言授權。
6. **合規與告知**：校方已提供完整的個人資料保護告知、內容申訴機制與資料保留政策。

## 系統信任邊界

| 邊界層級 | 安全控制機制 |
| --- | --- |
| 瀏覽器客戶端 | 嚴格 Nonce-based CSP、WebAssembly (`@jsquash/webp`) 安全編碼、無敏感金鑰 |
| 人機防護 | Cloudflare Turnstile 隱形驗證（單次 Token 消耗）、Firebase App Check JWT 驗證 |
| 驗證與身分 | Firebase Google OAuth (GIS)、允許網域比對、JWT Signature 校驗 |
| 後端 API (Cloudflare Worker) | 嚴格 CORS Origin 比對、原生速率限制、Durable Objects 業務配額、Action 註冊表分派 |
| 資料庫連線 (Hyperdrive) | Cloudflare Hyperdrive 憑證隔離與查詢加速 |
| 資料庫 (Neon PostgreSQL) | 最低權限 `novae_runtime` 資料庫角色（無 DDL 結構修改權限）、Functions 邊界、交易原子性、單調版本戳記 |
| 媒體儲存 (Cloudinary) | 後端簽章上傳、受控 Upload Preset、Worker Media Gateway 短效 HMAC 簽章讀取 |
| 非同步佇列 (Cloudflare Queues) | `novae-jobs` 任務租約、指數退避重試、失敗隔離與資料生命週期清理 |
| 備份與災難復原 | 每日 `pg_dump` 邏輯導出經 `age` 非對稱加密後保存至 GitHub Artifacts |

## 分類與隱私範圍

- `school`（校內可讀）：僅限同校已登入使用者，非公開網際網路可直接爬取。
- `reviewed-school`（審核後校內可讀）：審核前僅作者與管理員可見，通過後才進入校內列表。
- `owner-admin`（作者與管理員）：僅供作者與該分類指派之負責人處理；附件與討論維持私密。
- `authorVisible: false`：僅在前端隱藏作者名稱與頭像，後端仍保留權限校驗與案件處理關聯。

平台總管理員名單僅由後端環境變數 `ADMIN_EMAILS` 決定；分類負責人則透過範圍指派，權限完全由後端與資料庫函數校驗，前端條件不承擔安全責任。

## 濫用防護與成員互動限制

- **多層速率限制**：Cloudflare 原生 Limiter 阻擋短時間高頻攻擊，Durable Objects 依使用者 UID 限制每日提案、留言、附議等業務額度。
- **管理員互動限制 (Interaction Restrictions)**：針對濫用行為，管理員可施加限制提案、限制留言、限制按讚/附議或全面凍結帳號，所有操作即時生效並記錄至審計日誌。
- **資料生命週期排程 (Data Retention Lifecycle)**：自動定期清除已結案逾期案件（預設 180 天）、過期審計日誌、未活躍個資與無效推播 Token。

## 漏洞通報

請勿在公開 Issue 發表可利用的漏洞細節或真實使用者資料。請依專案 `SECURITY.md` 進行負責任的私下通報。
