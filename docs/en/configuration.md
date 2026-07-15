# Categories and product rules

Novae has two hand-edited JSON sources. Build scripts generate matching frontend and Edge TypeScript rules from them.

| Source | Controls |
| --- | --- |
| `config/issue-categories.config.json` | Categories, visibility, author display, support goal, support days, response days |
| `config/rate-limits.config.json` | Action limits, image counts, and browser compression |

## Configure one category at a time

1. Open the [category builder](../../category-builder.html).
2. Set a permanent lowercase-and-hyphen `id` and a user-facing `label`.
3. Choose school-wide, reviewed school-wide, or owner/admin-only access.
4. Decide whether authorized readers see the author.
5. Decide whether support is enabled.
6. If enabled, independently set the required number of supporters and the number of open days.
7. Set response days, or leave them empty for no deadline.
8. Download and replace `config/issue-categories.config.json`.

## Actual schema

```json
{
  "categories": [{
    "id": "public-issues",
    "label": "公共議題",
    "readAccess": "reviewed-school",
    "authorVisible": false,
    "support": { "enabled": true, "goal": 50, "deadlineDays": 14 },
    "responseDeadlineDays": 7
  }]
}
```

`readAccess` accepts `school`, `reviewed-school`, or `owner-admin`. Enabled support requires positive integer `goal` and `deadlineDays`. `responseDeadlineDays` is a positive integer or `null`; it starts at support completion when support is enabled, otherwise at creation. Owner/admin categories normalize author display to true.

The generator derives author storage, upload and comment visibility, when comments open, automatic failure when support expires, and the response-deadline start. There is no second policy file to edit.

## Repository example values

- Public issues: reviewed school-wide, hidden author, 50 supporters in 14 days, 7 response days after support succeeds.
- Student rights: owner/admin, visible author, no support, 7 response days after creation.
- Facilities: school-wide, visible author, no support, 7 response days after creation.

These are examples and may be replaced with institutional policy.

## Rate limits and images

The current config allows 30 proposals per day, 200 comments per hour, 200 image uploads per day, 5 proposal images, 5 announcement images, and 1 comment image. Browser compression targets 800 KB, accepts sources up to 20 MB, limits the long edge to 2000 px, and starts WebP quality at 0.82. It also contains separate read, write, sensitive, admin, upload, healthcheck, webhook, and worker burst limits.

Config commits trigger both backend and frontend deployment. Verify each category after both workflows succeed.
