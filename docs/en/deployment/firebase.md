# 2. Create Firebase

Firebase provides Google sign-in, Web Push, App Check, and backend identity verification.

1. Create a Firebase project and Web App in the [Firebase Console](https://console.firebase.google.com/).
2. Record `apiKey`, `authDomain`, `projectId`, `appId`, and `messagingSenderId` for the matching `VITE_FIREBASE_*` secrets. Reuse `apiKey` as `FIREBASE_WEB_API_KEY` and `projectId` as `FIREBASE_PROJECT_ID`.
3. Enable the Google Authentication provider and add the Vercel/custom production domains to authorized domains.
4. Create a Web Push certificate and record the public VAPID key as `VITE_FIREBASE_VAPID_KEY`.
5. Generate a service-account private key and store the entire downloaded JSON as `GOOGLE_SERVICE_ACCOUNT_JSON`.
6. Set `VITE_FIREBASE_APP_CHECK_ENABLED=false` for the first deployment. After the production domain works, configure reCAPTCHA Enterprise, set the site key, enable the flag, and redeploy.

All values must come from the same Firebase project and Web App. Use the [official Firebase documentation](https://firebase.google.com/docs) for current console labels.

Next: [create Supabase](supabase.md).
