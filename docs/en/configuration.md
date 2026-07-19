# Categories and product rules

Proposal and facility-report categories are runtime data created after installation, not hard-coded repository JSON. After the first deployment, the initial platform administrator listed in `ADMIN_EMAILS` signs in and completes guided setup. Later changes live under **My → Platform management center**.

## Initial setup

1. Deploy the backend and frontend.
2. Sign in with an account listed in `ADMIN_EMAILS`.
3. Create at least one proposal category and one facility-report category.
4. Give each category a permanent unique ID, display name, and description.
5. For proposals, choose read access, author visibility, comments, support goal/window, and response days.
6. After setup, open **Platform management center → People and management access** to assign registered users by campus email or UID.

Manager assignment is intentionally optional during setup because other administrators may not have registered yet.

## What can change later

| Rule | After creation | Scope |
| --- | --- | --- |
| Category ID | Locked | Protects URLs, relationships, and notifications |
| Read access | Permanently locked | Prevents an edit from exposing existing content |
| Author visibility | Permanently locked | Preserves the original anonymity promise |
| Comments | Editable | Future proposals only; existing comments remain |
| Support and deadlines | Editable | Future proposals only |
| Name and description | Editable | Updates category display immediately |
| Active or archived | Editable | Archived categories reject new records but preserve old ones |

Each proposal snapshots privacy, comments, support, and deadline rules when it is created. Turning comments off for a category never deletes old comments or retroactively disables comments on existing proposals. A category manager can still close or reopen new comments on an individual proposal; previously posted comments remain readable while composition is closed.

## Read access

- `school`: any signed-in user from the allowed campus domain may read.
- `reviewed-school`: only the author and managers may read before approval; approved content enters the school list.
- `owner-admin`: only the author and assigned category managers may read; the author remains visible to managers.

Backend authorization and database rules enforce these boundaries.

## Category managers and notifications

**Platform management center → People and management access** assigns proposal and facility responsibilities independently. Facility-category managers receive notifications for new reports in their categories and may reply, update status, or delete those reports. Platform administrators retain access to every category.

If a campus email or UID cannot be found, ask that person to sign in once before assigning access.

## Upgrading an existing installation

The migration converts existing proposal categories, assignments, and facility reports to runtime records automatically. Existing proposals receive privacy, comment, support, and deadline snapshots from their previous rules. Facility reports enter a compatible default category. Never rewrite an already deployed migration.

## Rate limits and images

`config/rate-limits.config.json` still controls action quotas, image counts, and browser compression. It is not a category source. Follow the repository codegen and verification workflow when changing it. Native Cloudflare burst limits remain in `cloudflare/wrangler.toml`.

## Acceptance checks

1. Create test proposals in public, reviewed, and private categories.
2. Verify what a general user, author, and category manager can see.
3. Confirm comments and support use the proposal-time snapshot, and that closing new comments on one proposal preserves its existing thread.
4. Create one facility report per category and verify the assigned manager receives a notification and can update status.
5. Archive a test category and confirm old records remain readable while new records cannot select it.
