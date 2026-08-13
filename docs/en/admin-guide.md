# Administrator workflows

Platform-administrator status comes only from backend `ADMIN_EMAILS`; the application cannot grant or revoke it. Users must sign in again after the environment value changes.

## Daily order

1. Check notifications for categories explicitly assigned to you; platform administrators do not automatically receive every new record.
2. Filter proposals to Pending review and Awaiting response.
3. Review Dashboard errors, outbox backlog, and vendor failures.

## Review proposals

Open a pending proposal, verify category, privacy, personal data, content, and images, then use Review proposal. Approval makes reviewed content school-readable and starts support when enabled. Rejection requires a clear reason and retains author/admin-only access.

## Respond and close

Move Awaiting response to Processing with a useful update. Close as Completed with a verifiable result, or Infeasible with constraints and alternatives. A category response deadline starts at creation without support, or when support succeeds when enabled.

Comments have category and record-level controls. Turning comments off for a category is a live constraint for every existing and new proposal in that category: existing comments remain readable, but new comments and replies are blocked. When the category is enabled again, only proposals that follow the category and are not completed reopen automatically. A proposal closed manually, or closed because it became completed, stays closed; completed proposals can never be reopened. An explicit record-level enable still cannot bypass the category switch.

## Announcements and deletion

Publish announcements with New announcement on the announcement list. Published announcements are immutable; delete and republish only after checking impact. **System settings → Categories and workflows → Announcements** includes the comment switch shared by every announcement. Turning it off blocks new comments and replies on every existing and new announcement, and a record-level switch cannot bypass it. When the global switch is restored, announcements that follow it reopen while manually closed announcements stay closed. Announcement details retain the record-level switch, and existing comments remain readable in every closed state. Proposal and announcement deletion uses a warning confirmation and the controlled deletion worker—never manually remove only the Cloudinary resource or only the database record.

## Category managers

In **System settings → People and management access**, choose a proposal, facility, or announcement responsibility first; for proposals or facilities, choose the category next. The page lists only current assignees for that scope, then looks up a signed-in member by full email or UID to grant or revoke access. It does not list every platform user at once. One category can have several managers, and category access never promotes someone to platform administrator.

New proposals notify only explicit managers of their proposal category. New facility reports notify only managers of their facility category whose assignment enables them. Authors are excluded, and an unassigned platform administrator is not a recipient. See the complete event matrix in [user workflows](user-guide.md#notification-recipients).

## Handoff

Keep at least two trusted administrators, rotate access when roles change, review category goals and days each term, and never share personal passwords. Continue with [post-launch operations](operations.md).
