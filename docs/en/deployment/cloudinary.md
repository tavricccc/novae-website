# 4. Create Cloudinary

1. Create or select a Novae-only Product Environment in the [Cloudinary Console](https://console.cloudinary.com/).
2. Record cloud name, API key, and API secret as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
3. For the current standard HMAC callback flow, set `CLOUDINARY_WEBHOOK_SECRET` to the same API secret. Do not invent a separate random value.
4. Do not add a duplicate global notification URL; the signed upload flow supplies its callback.
5. Keep resources permission controlled. Novae resolves short-lived signed delivery URLs after checking content access.

All four values must belong to the same Product Environment. Next: decide whether to [create the optional Notion copy](notion.md).
