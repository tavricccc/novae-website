# 6. 建立 Upstash

Novae 使用 Upstash Redis REST 做跨 Edge Function 執行個體的限流，保護登入同步、讀寫、圖片、附議、公告互動、健康檢查與背景 worker。

## 1. 建立 Redis database

登入 [Upstash Console](https://console.upstash.com/)，建立一個專供 Novae production 使用的 Redis database，region 優先靠近 Supabase project。

## 2. 複製 REST 憑證

| Upstash 值 | GitHub secret |
| --- | --- |
| HTTPS REST URL | `UPSTASH_REDIS_REST_URL` |
| Standard REST token | `UPSTASH_REDIS_REST_TOKEN` |

不要使用 Read-only token，因為限流需要寫入計數。

## 3. 不要共用正式與測試計數器

第一次只做 production 時，一個 database 即可。未來若建立 development 測試站，另外建立 database 與 token，避免測試操作消耗正式限流額度。

## 完成檢查

- [ ] URL 使用 HTTPS。
- [ ] token 是 Standard／可寫入版本。
- [ ] database region 與 Supabase 合理接近。
- [ ] production 不與其他應用共用同一組計數器。

下一步：[建立 Vercel](vercel-github.md)。
