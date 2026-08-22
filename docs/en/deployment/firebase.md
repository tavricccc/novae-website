# 2. Create Firebase

Firebase provides Google sign-in, Web Push, App Check, and backend identity verification.

1. Create a Firebase project and Web App in the [Firebase Console](https://console.firebase.google.com/).
2. Record `apiKey`, `authDomain`, `projectId`, `appId`, and `messagingSenderId` for the matching `NEXT_PUBLIC_FIREBASE_*` secrets. Reuse `apiKey` as `FIREBASE_WEB_API_KEY` and `projectId` as `FIREBASE_PROJECT_ID`.
3. Enable the Google Authentication provider and add the Vercel/custom production domains to Firebase authorized domains. Production browser sign-in uses **Google Identity Services (Token Client)** then Firebase `signInWithCredential`; the Auth emulator / `npm run test:env` may still use Firebase popup without a real GIS client ID.
4. In [Google Cloud Console](https://console.cloud.google.com/) for the **same** GCP project, open **APIs & Services → Credentials**, copy the **Web** OAuth 2.0 Client ID (`….apps.googleusercontent.com`) into `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, and set **Authorized JavaScript origins** to production and local Next.js only (do not authorize every Vercel preview URL).
5. Create a Web Push certificate and record the public VAPID key as `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
6. Generate a service-account private key and store the entire downloaded JSON as `GOOGLE_SERVICE_ACCOUNT_JSON`.
7. **Configure Firebase App Check (reCAPTCHA Enterprise)**: Novae's backend Cloudflare Worker strictly validates App Check JWTs on all authenticated API requests. In [Google Cloud Console](https://console.cloud.google.com/) under the same GCP project, open **Security → reCAPTCHA Enterprise**, create a Website key with your production and `localhost` domains, and copy the Site Key to `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY`. In [Firebase Console](https://console.firebase.google.com/) under **App Check → Apps**, register reCAPTCHA Enterprise for your Web App with this Site Key. Set `NEXT_PUBLIC_FIREBASE_APP_CHECK_ENABLED=true`.

All values must come from the same Firebase project and Web App. `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is the public Web OAuth client ID, not the service-account JSON or API key. Use the [official Firebase documentation](https://firebase.google.com/docs) for current console labels.

## Checklist

- [ ] Five Web config values come from the same Web App.
- [ ] Google sign-in provider is enabled.
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is from the matching GCP Web OAuth client.
- [ ] Authorized JavaScript origins include production domain and localhost.
- [ ] VAPID public key is obtained.
- [ ] Service account JSON is securely stored.
- [ ] reCAPTCHA Enterprise site key is registered in Firebase App Check.
- [ ] `NEXT_PUBLIC_FIREBASE_APP_CHECK_ENABLED` is set to `true` and `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY` is provided.

Next: [create Neon database](neon.md).
