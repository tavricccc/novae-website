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

When a discussion needs to pause, close new comments from that proposal's management actions. Existing comments remain readable, and a manager for the category can reopen composition later.

## Announcements and deletion

Publish announcements from the global create menu. Published announcements are immutable; delete and republish only after checking impact. Proposal and announcement deletion uses a warning confirmation and the controlled deletion worker—never manually remove only the Cloudinary resource or only the database record.

## Category managers

In **System settings → People and management access**, select a proposal or facility category first. The page lists every current manager; search signed-in users by name, email, or UID to add them, change facility new-report notices, or revoke access. One category can have several managers, and category access never promotes someone to platform administrator.

New proposals notify only explicit managers of their proposal category. New facility reports notify only managers of their facility category whose assignment enables them. Authors are excluded, and an unassigned platform administrator is not a recipient. See the complete event matrix in [user workflows](user-guide.md#notification-recipients).

## Handoff

Keep at least two trusted administrators, rotate access when roles change, review category goals and days each term, and never share personal passwords. Continue with [post-launch operations](operations.md).
