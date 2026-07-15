# Security and privacy

Novae treats the browser, user input, and public network as untrusted. Authentication is only the first gate; Edge Functions and Postgres re-authorize every important operation.

## Pre-launch order

1. Match client and backend allowed domains.
2. Keep `ADMIN_EMAILS` minimal.
3. Store sensitive values only in GitHub `production` Environment secrets and vendor secret stores.
4. Keep service roles, service accounts, API secrets, passwords, and tokens out of browser bundles and Git.
5. Restrict Firebase authorized domains.
6. Enable App Check after the production domain passes acceptance tests.
7. Test school, reviewed-school, and owner/admin read, image, and comment access.
8. Publish institutional privacy, moderation, retention, deletion, and incident contacts.

`school` means authenticated users in the allowed domain, not the public Internet. `reviewed-school` remains author/admin-only before approval. `owner-admin` keeps content, images, and comments private. Hidden author display does not mean the system stores no author relationship.

Rotate one provider at a time: create a new value, update production, deploy, verify, then revoke the old value. Never publish vulnerability details or real student data; use the main repository's private process in `SECURITY.md`.
