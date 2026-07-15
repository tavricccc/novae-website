# User workflows

Desktop uses the sidebar; mobile uses the floating bottom navigation, where the central create action is an icon-only plus. Announcements, notifications, and settings are separate pages.

## Sign in and browse

1. Sign in with a Google account in the allowed school domain.
2. Choose a proposal category or My proposals.
3. Search, filter, and sort cards, then open a detail page.
4. Pending-review and private proposals remain visible only to their author and administrators.

## Create a proposal

1. Open the global create action.
2. Choose Proposal and a category.
3. Add title, content, and optional images.
4. Publish and wait for the inline busy state plus bottom feedback result.

Category policy determines whether the proposal is immediately school-readable, awaits review, or stays owner/admin-only; whether the author is visible; and whether support is required.

## Support and comments

Support-enabled categories show the configured goal and remaining days. Meeting `support.goal` succeeds early; missing it after `support.deadlineDays` produces the did-not-pass status. Comment visibility follows category access, and reviewed categories do not open school-wide comments before approval.

## Status meanings

| Status | Meaning |
| --- | --- |
| Pending review | An administrator has not decided publication |
| Review rejected | Publication was rejected; author/admin retain access |
| Awaiting response | The proposal entered the response stage but has no response yet |
| Processing | Work has started |
| Did not pass | The support window ended below its goal |
| Completed | Closed with an outcome |
| Infeasible | Closed with constraints or alternatives explained |

## Announcements, notifications, and settings

Announcements have separate list and detail pages with likes and comments. The notification page groups items inside one card and synchronizes read state; it does not show per-item time or a per-item mark-read button. Settings controls Push and app preferences, and sign-out is one standalone action.
