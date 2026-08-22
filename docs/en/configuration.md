# Categories and product rules

Proposal and facility-report categories are runtime data created after installation, not hard-coded repository JSON. After the initial deployment, the platform administrator listed in `ADMIN_EMAILS` signs in and completes guided setup. Later changes are maintained under **System settings**.

## Initial Setup

1. Deploy the backend and frontend.
2. Sign in with an account listed in `ADMIN_EMAILS`.
3. **Step 1**: Confirm interface language (preselected from browser preferences, changeable at any time).
4. **Step 2**: Choose which platform features to enable in the proposal/facility switcher (both enabled by default).
5. **Step 3**: Create at least one category for every enabled feature using the category editor, with a permanent unique ID, display name, and designated default category.
6. For proposals, configure read access, author visibility, support goals/windows, and response deadlines.
7. Finish setup (manager assignment is skipped initially until relevant users complete their first sign-in).

## Platform Feature Switches

| Feature | When turned off |
| --- | --- |
| Proposals | Hidden from navigation; existing proposals, categories, and assignments remain |
| Facility reports | Hidden from navigation; existing reports, categories, and assignments remain |
| Announcement comments | New comments and replies stop on every announcement; announcements and existing comments remain readable |

Switches and category drafts are saved together atomically in System Settings so a partial write cannot occur.

## What Can Change Later

| Rule | After creation | Scope |
| --- | --- | --- |
| Category ID | Locked | Protects URLs, relations, and notifications |
| Read access | Permanently locked | Prevents accidental data exposure |
| Author visibility | Permanently locked | Preserves the original anonymity promise |
| Proposal comments | Editable | Constrains proposals immediately |
| Announcement comment switch | Editable | Constrains every announcement immediately |
| Support and deadlines | Editable | Future proposals only |
| Name and label | Editable | Updates category display immediately |
| Platform feature switches | Editable | Navigation and new entry points only |

## Read Access Levels

- `school`: Any signed-in user from the allowed campus domain may read.
- `reviewed-school`: Only the author and managers may read before approval; approved content enters the school feed.
- `owner-admin`: Only the author and assigned category managers may read (private rights cases).

## Category Managers and Notifications

Under **System settings → People and management access**:
1. Select a proposal category, facility category, or announcement scope.
2. View the list of currently assigned managers.
3. Search registered users by name, email, or UID to assign or revoke permissions.
4. Proposal/facility creation notices are sent only to explicitly assigned managers (excluding the author). Platform administrators come from `ADMIN_EMAILS`.

## Platform Settings (Media Limits & Data Retention)

Platform administrators can configure global media and retention policies under **System settings → Platform settings**:

### 1. Media Upload Limits
- **Proposals**: Default max 2 images.
- **Facility Reports**: Default max 2 images.
- **Announcements**: Default max 10 images.
- **File Size Limit**: Default 5 MB per file; client-side WebAssembly WebP compression is applied automatically before upload.

### 2. Data Retention Lifecycle
- **Closed Case Retention**: Default 180 days. Expired closed proposals and facilities along with their comments, votes, and Cloudinary media assets are permanently purged by scheduled background queue jobs. Announcements are kept permanently.
- **Audit Log Retention**: Default 365 days; expired audit logs are automatically pruned.
- **Inactive Profile & Push Device Cleanup**: Long-inactive profiles and dead push notification tokens are regularly cleaned up by background jobs.

## Acceptance Checklist

1. Create test proposals in public, reviewed, and private categories to verify access isolation.
2. Disable proposal/announcement comments and verify immediate enforcement.
3. Assign managers and verify notifications reach only explicitly assigned users.
4. Update upload limits in Platform Settings and verify frontend validation immediately reflects new limits.
5. Delete a test category and verify records and media are completely pruned.
