Deploy instructions

1) Run SQL migration (open Supabase SQL editor and run):
   - backend/migrations/001_create_snapshot_tables.sql
   - backend/migrations/002_add_pg_cron_job.sql (optional)

2) Set environment variables in your Edge Function runtime or Vercel envs:
   - SUPABASE_URL=https://<project>.supabase.co
   - SUPABASE_SERVICE_ROLE_KEY=<service role key>
   - SNAPSHOT_BUCKET=github copilot
   - DIFF_THRESHOLD=100
   - ADMIN_FORCE_TOKEN=<random-secret-token>
   - SNAPSHOT_EDGE_URL=<edge function public url>

3) Install dependencies and deploy Edge Function

```
cd backend/supabase-edge/snapshot-builder
npm install
# deploy using supabase CLI (example)
supabase functions deploy snapshot-builder --project-ref <your-ref>
```

4) Set up an external cron (recommended) or pg_cron to call the Edge Function:
   - Example: every minute call `POST https://<edge-url>?force=1` with Authorization header set to your service role key (if needed for auth)

5) Verify uploads
  - After run, confirm that your bucket contains `products.json`, `diff/<version>.json` and `manifest.json`.
  - Visit `https://<your-site>/data/products.json` to confirm snapshot is served by CDN.

6) Configure frontend envs
  - Set `NEXT_PUBLIC_ADMIN_FORCE_TOKEN` (if you keep client-side admin button) and server `ADMIN_FORCE_TOKEN` (server only) in Vercel envs

## Automated builds with GitHub Actions

A workflow is included at `.github/workflows/snapshot-builder.yml` which will run the snapshot builder on a schedule (every 5 minutes) and on manual dispatch. To enable it:

- Add the following repository secrets in GitHub: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and optionally `SNAPSHOT_BUCKET` (default: `github copilot`) and `DIFF_THRESHOLD`.
- The workflow will install dependencies and run `ci-run.js` from this folder to build full snapshots or diffs.

If you prefer deploying to Supabase Edge Functions instead, keep `index.ts` as-is and deploy using the Supabase CLI (requires a Supabase access token and `supabase login`).

## Add GitHub Repository Secrets (required for automation)

1. Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret.
2. Add these secrets (case sensitive):
   - SUPABASE_URL = `https://<your-project>.supabase.co`
   - SUPABASE_SERVICE_ROLE_KEY = `<your service role key (sb_secret_...)>`
   - SNAPSHOT_BUCKET = `github copilot` (optional; defaults to `github copilot`)
   - DIFF_THRESHOLD = `100` (optional)

## Verify the workflow manually

1. After adding secrets, go to **Actions → Snapshot Builder → Run workflow → Run workflow** to dispatch manually.
2. Check the workflow logs and confirm the job ran successfully and printed the manifest content.
3. Verify your Supabase Storage bucket contains `products.json`, `manifest.json`, and `diff/<version>.json` files.

## Quick local validation (optional)

You can validate secrets on your machine before adding to GitHub by running from the snapshot builder folder:

```powershell
$env:SUPABASE_URL='https://tmbyvapcqseqhtqxmejr.supabase.co'
$env:SUPABASE_SERVICE_ROLE_KEY='sb_secret_...'
$env:SNAPSHOT_BUCKET='github copilot'
node verify-secrets.js
node ci-run.js # runs full/diff builder
```

If `verify-secrets.js` fails, it will exit with an error and the CI will also fail; fix missing secrets and re-run.

Security note
- Rotate service role key after initial setup. Use least-privilege keys when possible.
