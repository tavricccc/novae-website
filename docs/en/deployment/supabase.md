# 3. Create Supabase

Supabase hosts Postgres, RLS, RPC, Realtime, Cron, and six Edge Functions.

1. Create a project in the [Supabase Dashboard](https://supabase.com/dashboard), choose an appropriate region, and save the database password.
2. Record Project URL as `VITE_SUPABASE_URL` and the publishable key as `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Record the project reference as `SUPABASE_PROJECT_REF`, database password as `SUPABASE_DB_PASSWORD`, legacy `service_role` as `SUPABASE_SERVICE_ROLE_KEY`, and an account access token as `SUPABASE_ACCESS_TOKEN`.
4. Never put the service role into a `VITE_*` value.
5. Do not paste migrations manually. The backend workflow links the project, runs `supabase db push`, configures secrets, and deploys all Functions.

Hosted Edge Functions provide `SUPABASE_URL`; no GitHub secret is needed. Supabase documents link, migration history, and remote push in the [official CLI reference](https://supabase.com/docs/reference/cli/supabase-db).

Next: [create Cloudinary](cloudinary.md).
