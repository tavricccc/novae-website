# Administrator workflows

Platform administrator permissions are derived solely from the backend `ADMIN_EMAILS` environment variable. The application has no grant or revoke controls for this role. Administrators must sign in again after changes to `ADMIN_EMAILS` to receive the updated role.

## 1. Daily Operational Routine

1. **Notifications**: Check assigned category notifications and comment updates.
2. **Proposals Feed**: Filter for "Pending review" and "Awaiting response" records.
3. **Admin Console**: Inspect overview metrics, audit logs, background queue health, and database connectivity.

## 2. Moderation and Proposal Workflows

1. **Review Proposals**:
   - Open pending proposals to verify visibility, personal data, content, and attached media.
   - Click "Review Proposal": approving opens the proposal to the school and begins the support countdown (if enabled); rejecting requires a specific reason and moves the record to "Review rejected" (author and admin visible only).
2. **Update Status & Respond**:
   - Transition "Awaiting response" records to "Processing" with actionable progress notes.
   - Close cases as "Completed" with concrete outcome statements, or "Infeasible" with clear justifications and alternative options.

## 3. Admin Console Features

Access the integrated **Admin Console** from the sidebar navigation:

### Overview & Activity Metrics
- Real-time aggregation of total proposals, facility reports, announcements, comments, and daily active participants.
- Visual breakdown of completed, processing, and pending ratios to monitor campus resolution velocity.

### User Management & Interaction Restrictions
- **Member Search**: Search registered users by name, school email, or UID.
- **Interaction Restrictions**: Apply granular restrictions on malicious or disruptive accounts:
  - **Mute Proposal Creation**
  - **Mute Commenting**
  - **Mute Reactions & Votes**
  - **Full Account Suspension**
- All restriction actions require a stated reason, take effect immediately, and are logged to the Audit Log.

### Audit Log
- Immutable records of all privileged administrative operations: proposal moderation, status changes, announcements, manager assignments, user restrictions, and platform settings updates.
- Filter by actor, target entity, or action type for governance and transparency.

## 4. Category Management & Scoped RBAC

- **Dynamic Categories**: Maintain proposal and facility categories under **System settings → Categories and workflows**, configuring default categories, support goals, and response deadlines.
- **Scoped Manager Assignment**: Assign managers per category under **System settings → People and management access**. Notifications are routed directly to assigned managers; platform administrators are not flooded with broadcast alerts.

## 5. Platform Settings (Media & Retention)

Under **System settings → Platform settings**:
- **Upload Limits**: Configure maximum photo attachments for proposals (default 2), facilities (default 2), announcements (default 10), and maximum file size (default 5 MB).
- **Retention Lifecycle**: Configure automated retention cleanup for closed records (default 180 days) and audit logs (default 365 days).

## 6. Announcements and Lifecycle Deletions

- Create campus announcements with optional images.
- Toggle global announcement comments or individual record overrides.
- Deletions trigger controlled cleanup of database records and Cloudinary media assets.

## 7. System Health and Continuity

- Regularly check Cloudflare Queue (`novae-jobs`) backlog.
- Maintain at least two trusted administrators in `ADMIN_EMAILS` to avoid single-operator lockouts.
- Rotate tokens and GitHub Environment secrets during role handoffs.

For technical recovery procedures, continue to [post-launch operations](operations.md).
