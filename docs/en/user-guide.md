# User workflows

Desktop uses the sidebar; mobile uses the floating bottom navigation, where the central create action is an icon-only plus. Announcements, notifications, and settings are separate pages.

## Sign in and browse

1. Sign in with a Google account in the allowed school domain. The control shows a busy spinner and stays disabled while sign-in is in progress.
2. Google always shows the account picker. Closing it, a blocked popup, or an in-app browser shows an error only; production does not fall back to a full-page Firebase redirect.
3. After role and category bootstrap, the app leaves the sign-in page for the default proposal category; mobile bottom navigation and the desktop sidebar appear only then.
4. Browse a proposal category or My proposals, then search, filter, and sort cards before opening a detail page.
5. Pending-review and private proposals remain visible only to their author and administrators.

On an unconfigured installation, the first platform administrator confirms language, chooses whether proposals and facility reports are enabled, and then creates categories only for the enabled features. The browser or operating system's first preferred language is the default. If completion is interrupted, refresh or retry; the app recognizes setup that already committed.

## Create a proposal

1. Open the global create action.
2. Choose Proposal and a category.
3. Add a title of at most 30 characters, up to 1,000 visible content characters, and optional images.
4. Publish and wait for the inline busy state plus bottom feedback result.

Category policy determines whether the proposal is immediately school-readable, awaits review, or stays owner/admin-only; whether the author is visible; and whether support is required.

## Support and comments

Support-enabled categories show the configured goal and remaining days. Meeting `support.goal` succeeds early; missing it after `support.deadlineDays` produces the did-not-pass status. Comment visibility follows category access, and reviewed categories do not open school-wide comments before approval.

Comments support replies and plain-text input only. Markdown is not rendered and there is no preview mode. Each comment accepts at most 70 visible characters and may still include one image under the current `rate-limits.config.json` setting. On mobile, the comment count appears directly in the content/comments segmented control instead of being repeated inside the comment panel.

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

## Facility reports

The facility board, like proposals, starts with a category. The selection remains in the URL and carries into creation. Reports can include content and images; their detail page supports comments, “I have this issue too,” and status tracking. Only a manager assigned to that facility category or a platform administrator may manage the report, and each assignment controls whether it receives new-report notices.

## Announcements, notifications, and settings

Announcements have separate list and detail pages with likes and comments. New announcements use the same 30-character title and 1,000-visible-character content limits. The notification page groups items inside one card and synchronizes read state; it does not show per-item time or a per-item mark-read button. Settings controls Push and app preferences. Language uses a dropdown that shows the active locale and all available options, so future locales join the same list. Sign-out is one standalone action.

### Notification recipients

| Event | Recipients |
| --- | --- |
| New announcement | All signed-in school users eligible for broadcast notifications |
| Announcement comment | Parent-comment author for a reply, otherwise announcement author; actor excluded |
| New proposal | Explicit managers of that proposal category, excluding the author; platform administrators are not implicit recipients |
| Proposal comment | Parent-comment author for a reply, otherwise proposal author; actor excluded |
| Proposal status change | Proposal author and current supporters; actor excluded |
| Support goal met | Proposal author and all supporters |
| Proposal deleted | Proposal author and the pre-deletion supporter snapshot; actor excluded |
| New facility report | Managers in that facility category with new-report notices enabled, excluding the author; platform administrators are not implicit recipients |
| Facility status change | Report author and everyone who marked “I have this issue too” |

In-app and Web Push delivery share this recipient logic. Disabling device notifications stops Push only; it does not alter authorization or storage for in-app notifications.
