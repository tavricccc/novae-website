# Categories and product rules

Proposal and facility-report categories are runtime data created after installation, not hard-coded repository JSON. After the first deployment, the initial platform administrator listed in `ADMIN_EMAILS` signs in and completes guided setup. Later changes live under **My → System settings**.

## Initial setup

1. Deploy the backend and frontend.
2. Sign in with an account listed in `ADMIN_EMAILS`.
3. Step 1: confirm the interface language. The browser or operating system's first preferred language is preselected, and it can be changed before continuing.
4. Step 2: choose which platform features to enable. Proposals and facility reports are enabled by default; either may be turned off, or both may be left off when only announcements are needed.
5. Step 3: create at least one category for every enabled feature, each with a permanent unique ID and display name.
6. For proposals, choose read access, author visibility, comments, support goal/window, and response days.
7. After setup, open **System settings → People and management access**, choose a proposal or facility category, and add registered people responsible for it.

Disabled features do not require categories. They can be reopened later under **System settings → Categories and workflows**. Manager assignment is intentionally optional during setup because other administrators may not have registered yet. Setup completion is safe to retry: if data committed but the response was interrupted, refreshing or submitting again reads the completed state instead of creating another setup.

## Platform feature switches

| Feature | When turned off |
| --- | --- |
| Proposals | Hidden from desktop and mobile navigation; existing proposals, categories, and assignments remain |
| Facility reports | Hidden from desktop and mobile navigation; existing reports, categories, and assignments remain |

Announcements are unaffected. Feature switches and category drafts are saved together in System settings so a partial write cannot leave only one side applied.

## What can change later

| Rule | After creation | Scope |
| --- | --- | --- |
| Category ID | Locked | Protects URLs, relationships, and notifications |
| Read access | Permanently locked | Prevents an edit from exposing existing content |
| Author visibility | Permanently locked | Preserves the original anonymity promise |
| Comments | Editable | Future proposals only; existing comments remain |
| Support and deadlines | Editable | Future proposals only |
| Name | Editable | Updates category display immediately |
| Active or archived | Editable | Archived categories reject new records but preserve old ones |
| Platform feature switches | Editable | Navigation and new entry points only; existing data remains |

Each proposal snapshots privacy, comments, support, and deadline rules when it is created. Turning comments off for a category never deletes old comments or retroactively disables comments on existing proposals. A category manager can still close or reopen new comments on an individual proposal; previously posted comments remain readable while composition is closed.

## Read access

- `school`: any signed-in user from the allowed campus domain may read.
- `reviewed-school`: only the author and managers may read before approval; approved content enters the school list.
- `owner-admin`: only the author and assigned category managers may read; the author remains visible to managers.

Backend authorization and database rules enforce these boundaries.

## Category managers and notifications

**System settings → People and management access** starts with a proposal or facility category and lists everyone who already has access. From there, search registered users to add them, change notification preferences, or revoke access quickly. One person may manage multiple categories, and one category may have multiple managers. Search accepts name, email, or UID.

Proposal-category managers receive new-proposal notifications. Facility-category managers receive new-report notifications only when that assignment enables them. Both exclude the author. Platform administrators can operate across all categories but do not receive new-proposal or new-report notifications merely because they are platform administrators; assign them explicitly when they should receive a category's events. Platform-administrator status can only be changed through the deployment environment's `ADMIN_EMAILS`; the application has no grant or revoke control.

If a campus email or UID cannot be found, ask that person to sign in once before assigning access.

## Upgrading an existing installation

The migration converts existing proposal categories, assignments, and facility reports to runtime records automatically and supplies default platform feature switches. Existing proposals receive privacy, comment, support, and deadline snapshots from their previous rules. Facility reports enter a compatible default category. Never rewrite an already deployed migration.

## Rate limits and images

`config/rate-limits.config.json` still controls action quotas, image counts, and browser compression. It is not a category source. Follow the repository codegen and verification workflow when changing it. Native Cloudflare burst limits remain in `cloudflare/wrangler.toml`.

## Acceptance checks

1. Create test proposals in public, reviewed, and private categories.
2. Verify what a general user, author, and category manager can see.
3. Confirm comments and support use the proposal-time snapshot, and that closing new comments on one proposal preserves its existing thread.
4. Create a proposal and facility report in every category. Verify that only explicitly assigned managers whose notification setting applies receive creation notices, and that an unassigned platform administrator does not.
5. Verify the facility board switches categories, creation preserves the active category, and the correct manager can comment, update status, and delete.
6. Archive a test category and confirm old records remain readable while new records cannot select it.
7. Turn a feature off and on again; navigation should hide and restore while existing records and categories remain manageable.
