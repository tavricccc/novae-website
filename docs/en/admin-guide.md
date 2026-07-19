# Administrator workflows

Administrator status comes from backend `ADMIN_EMAILS`. Users must sign in again after the list changes.

## Daily order

1. Check notifications.
2. Filter proposals to Pending review and Awaiting response.
3. Review Dashboard errors, outbox backlog, and vendor failures.

## Review proposals

Open a pending proposal, verify category, privacy, personal data, content, and images, then use Review proposal. Approval makes reviewed content school-readable and starts support when enabled. Rejection requires a clear reason and retains author/admin-only access.

## Respond and close

Move Awaiting response to Processing with a useful update. Close as Completed with a verifiable result, or Infeasible with constraints and alternatives. A category response deadline starts at creation without support, or when support succeeds when enabled.

When a discussion needs to pause, close new comments from that proposal's management actions. Existing comments remain readable, and a manager for the category can reopen composition later.

## Announcements and deletion

Publish announcements from the global create menu. Published announcements are immutable; delete and republish only after checking impact. Proposal and announcement deletion uses a warning confirmation and the controlled deletion worker—never manually remove only the Cloudinary resource or only the database record.

## Handoff

Keep at least two trusted administrators, rotate access when roles change, review category goals and days each term, and never share personal passwords. Continue with [post-launch operations](operations.md).
