# Preparation and service setup

This is not a local-development tutorial, and it does not release the app yet. Decide campus policy first, then create each service in order. Only after all eight steps should you enter credentials, configure categories, and run the final release.

## 1. Decide campus policy

Write down the school display name, allowed Google email domain, initial administrator emails, categories, visibility, author display, support goals, support windows, and response deadlines.

## 2. Create the eight service setups in order

| Service | Purpose |
| --- | --- |
| GitHub | Fork, production secrets, and deployment workflows |
| Firebase | Google sign-in, App Check, and Web Push |
| Supabase | Database, RLS, Realtime, and Edge Functions |
| Cloudinary | Signed image storage and delivery |
| Upstash | Distributed rate limiting |
| Cloudflare | Stable API gateway, CORS, and pre-Supabase limits |
| Vercel | Production PWA hosting |

Notion is an optional operations copy. Create it only when needed; omitting it does not affect proposals, announcements, notifications, or other core features.

Complete these pages in order. Each page only creates that service and collects its credentials:

1. [Create the GitHub fork and production Environment](deployment/github.md)
2. [Create Firebase](deployment/firebase.md)
3. [Create Supabase](deployment/supabase.md)
4. [Create Cloudinary](deployment/cloudinary.md)
5. [Configure optional Notion](deployment/notion.md)
6. [Create Upstash](deployment/upstash.md)
7. [Create Vercel](deployment/vercel-github.md)
8. [Create Cloudflare Worker](deployment/cloudflare.md)

## 3. Confirm ownership

You need permission to manage GitHub Settings and Actions, create each vendor project, manage the school domain and administrator list, and own the institution's privacy, moderation, retention, and incident-response decisions.

## 4. Store values safely

Use a password manager or protected worksheet based on the [credential worksheet](environment-configuration.md). Never put service roles, service accounts, API secrets, database passwords, or tokens in Git, public issues, or shared chat.

## Ready when

- [ ] The school domain and administrator emails are final.
- [ ] Category and deadline rules are decided.
- [ ] GitHub, Firebase, Supabase, Cloudinary, Upstash, Cloudflare, and Vercel are ready; optional Notion is ready when needed.
- [ ] You understand that production values belong in GitHub `production` Environment secrets.
- [ ] You understand that local `.env` setup is not required for deployment.

Next, complete the [credential worksheet](environment-configuration.md), then define [category and platform policy](configuration.md). Only after both are complete should you follow [final release and acceptance](deployment-guide.md).
