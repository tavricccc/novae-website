# 4. Create Cloudinary

1. Create or select a Novae-only Product Environment in the [Cloudinary Console](https://console.cloudinary.com/).
2. Record cloud name, API key, and API secret as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
3. For the current standard HMAC callback flow, set `CLOUDINARY_WEBHOOK_SECRET` to the same API secret. Do not invent a separate random value.
4. Do not add a duplicate global notification URL; the signed upload flow supplies its callback.
5. Let the backend healthcheck create or update the `srp-secure-images` upload preset with the same API credentials. It enforces authenticated WebP, an 800 KB maximum, a 2,000 px long edge, and no overwrites. Do not create a second preset, make it unsigned, or loosen these limits. The webhook validates uploaded assets again and schedules non-compliant resources for deletion.
6. Keep resources permission controlled. Novae resolves short-lived signed delivery URLs after checking content access.

All four values must belong to the same Product Environment, and the backend workflow healthcheck must complete successfully so the controlled preset is verified. Next: decide whether to [create the optional Notion copy](notion.md).
