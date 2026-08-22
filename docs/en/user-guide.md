# User workflows

Novae provides a consistent and responsive experience across devices. Desktop uses a sidebar and multi-column layout; mobile uses an ergonomic floating bottom dock aligned with device safe areas.

## 1. Sign In and Authentication

1. Open your campus Novae deployment URL.
2. Click **Sign in with Google**; the system invokes Google Identity Services for account selection within the permitted school domain.
3. On first-time profile creation, an invisible **Cloudflare Turnstile** verification runs in the background for bot protection.
4. Upon authentication, user roles and category catalogs are loaded, redirecting to the default board.

Accounts outside the permitted domain are rejected by the backend.

## 2. Browse and Search Proposals

1. Switch between categories using the top/sidebar navigation, or open "My Proposals".
2. Use `LiquidTabs` to filter between "Active" and "Closed" records, or search by keyword.
3. Click a card to view details: desktop displays a clean two-column layout; mobile presents body, milestone timeline, and threaded comments in one continuous feed.
4. Private rights cases and pending-review proposals remain strictly visible only to their author and assigned managers.

## 3. Create a Proposal

1. Open Proposals and click "New Proposal".
2. Select a category, enter a title (max 30 characters), and write content (Markdown supported, max 1,000 visible characters).
3. Optionally attach photos; client-side WebAssembly (`@jsquash/webp`) automatically encodes images to WebP before signed upload.
4. Click "Publish"; the button displays a spinner and transitions to a checkmark confirmation.

## 4. Support, Gestures, and Comments

- **Proposal Support**: Click the support button in support-enabled categories. The action applies optimistic updates with rollback protection.
- **Facility "I Also Encountered This"**: Click the affected counter to report experiencing the same facility issue.
- **Announcement Likes**: Click the heart icon on announcements.
- **Threaded Discussions**:
  - The comment composer docks above the mobile bottom navigation and aligns avatars with submit controls.
  - Replying to a comment displays the target author name and excerpt quote.
  - When comments are disabled by policy or completion, an unavailable notice is displayed.

## 5. Understanding Statuses

| Status | Meaning |
| --- | --- |
| Pending review | Administrator has not yet approved public release |
| Review rejected | Publication was rejected; author retains access with reason |
| Awaiting response | Support goal met or direct processing awaiting first response |
| Processing | Management has begun working on the issue |
| Did not pass | Support window closed before reaching threshold |
| Completed | Closed with a concrete outcome description |
| Infeasible | Closed with constraints or alternative directions explained |

## 6. Appearance and Settings

Under **Settings**:
- **Accent Themes**: Select custom accent palettes (Slate, Indigo, Emerald, Rose, etc.) with seamless light/dark mode transitions.
- **Language**: Switch between Traditional Chinese and English.
- **PWA Installation**: Install the app to the home screen or desktop application list with platform-specific instructions.
- **Push Notifications**: Enable or disable Web Push notifications with a 7-day heartbeat throttle to manage device tokens.

## 7. Notification Routing

| Event | Recipients |
| --- | --- |
| New Announcement | All eligible campus users |
| Proposal / Announcement Comment | Parent comment author for replies, or content author (excluding actor) |
| Proposal Status Change | Author and all active supporters |
| Support Goal Met | Author and all active supporters |
| Facility Status Change | Author and all affected reporters |
| New Proposal Submission | Explicitly assigned managers for that category |
| New Facility Report | Assigned managers with report notices enabled |

If you experience unexpected behavior, report the issue to your administrator and consult [troubleshooting](troubleshooting.md).
