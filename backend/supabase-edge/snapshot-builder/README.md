Snapshot Builder Edge Function

Overview
- Builds product snapshot JSON and incremental diffs based on queues in Postgres.
- Uploads `products.json` (full snapshot) and `diff/<version>.json` to Supabase Storage bucket.
- Updates `manifest.json` in the bucket containing `currentVersion` and `diffs` array.
- Logs metrics to `snapshot_metrics` table.

Environment variables (set in Supabase Edge or hosting env):
- SUPABASE_URL (https://your-project.supabase.co)
- SUPABASE_SERVICE_ROLE_KEY (service role key with DB and storage privileges)
- SNAPSHOT_BUCKET (e.g., "github copilot")
- DIFF_THRESHOLD (default 100)

Deployment
1. Install dependencies inside the Edge function folder and deploy using Supabase CLI or upload to your Edge runtime.

```
cd backend/supabase-edge/snapshot-builder
npm install
# then deploy using your preferred method (supabase functions deploy or upload to edge runtime)
```

SQL Migration (run in Supabase SQL editor or with psql)
- run `backend/migrations/001_create_snapshot_tables.sql`

How it works
1. Triggers insert changed rows into `products_changes_queue`.
2. Cron job or manual trigger calls the Edge Function.
3. Edge Function reads queue and either builds a full snapshot or incremental diffs, uploads artifacts, updates manifest and metrics.
4. Frontend service worker polls `manifest.json` and merges diffs into local snapshot.

Admin Force Refresh Endpoint
- The repo includes a Next.js API route at `/api/admin/force-rebuild` which calls the Edge Function with `?force=1`.
- Protect it with an admin token via env `ADMIN_FORCE_TOKEN` and pass `x-admin-token` header on requests.

Security and admin endpoint
- Set `ADMIN_FORCE_TOKEN` in your Next.js / Vercel environment. This token will be validated by the `/api/admin/force-rebuild` endpoint.
- For client-side admin tools, set `NEXT_PUBLIC_ADMIN_FORCE_TOKEN` if you want to allow an admin button to call the endpoint from the browser (not recommended in public sites; prefer server-side admin auth).

Cron notes
- If you have `pg_cron` available, schedule a job to call the Edge Function (or call the Edge Function from an external scheduler) every 60s or a cadence that fits your write volume.
- Example cron call (run via scheduler or cron job):
  - curl -X POST "https://<EDGE_FUNCTION_URL>?force=1" -H "Authorization: Bearer <SERVICE_ROLE_KEY>"

Security notes
- Use the Supabase service role key only in server/Edge environments. Do not publish it.
- Rotate the service role key after initial setup.
