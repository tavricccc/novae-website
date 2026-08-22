# Preparation and service setup

This is not a local-development tutorial, and it does not release the app yet. Decide campus policy first, then create each service in order. After preparing all services, complete the credential worksheet, review category policy, and execute the final release.

## 1. Decide Campus Policy

Write down the school display name, allowed Google email domain, initial administrator emails, categories, visibility, author display, support goals, support windows, and response deadlines.

## 2. Create the Services in Order

| Service | Purpose |
| --- | --- |
| GitHub | Fork, production secrets, and automated deployment workflows |
| Firebase | Google sign-in (GIS Token Client + Firebase session), App Check, and Web Push |
| Neon | Serverless PostgreSQL 17 database (`NEON_DATABASE_URL`, `NEON_RUNTIME_PASSWORD`) |
| Cloudinary | Signed image storage and delivery |
| Notion (Optional) | Optional operations copy database |
| Cloudflare | API gateway, Hyperdrive acceleration, Queues, Turnstile verification, and Durable Objects realtime & rate limits |
| Vercel | Production Next.js PWA hosting |

Notion is an optional operations copy. Create it only when needed; omitting it does not affect proposals, announcements, notifications, or other core features.

Complete these pages in order. Each page only creates that service and collects its credentials:

1. [Create the GitHub fork and production Environment](deployment/github.md)
2. [Create Firebase](deployment/firebase.md)
3. [Create Neon database](deployment/neon.md)
4. [Create Cloudinary](deployment/cloudinary.md)
5. [Configure optional Notion](deployment/notion.md)
6. [Create Cloudflare Worker](deployment/cloudflare.md)
7. [Create Vercel](deployment/vercel-github.md)

## 3. Confirm Ownership

You need permission to manage GitHub Settings and Actions, create each vendor project, manage the school domain and administrator list, and own the institution's privacy, moderation, retention, and incident-response decisions.

## 4. Store Values Safely

Use a password manager or protected worksheet based on the [credential worksheet](environment-configuration.md). Never put service roles, service accounts, API secrets, database passwords, or tokens in Git, public issues, or shared chat.

## Checklist

- [ ] School domain and administrator emails are final.
- [ ] Category and deadline rules are decided.
- [ ] GitHub, Firebase, Neon, Cloudinary, Cloudflare, and Vercel are ready; optional Notion is ready if needed.
- [ ] You understand that production values belong in GitHub `production` Environment secrets.
- [ ] You understand that local `.env` setup is not required for deployment.

Next, complete the [credential worksheet](environment-configuration.md), then define [category and platform policy](configuration.md). Only after both are complete should you follow [final release and acceptance](deployment-guide.md).
