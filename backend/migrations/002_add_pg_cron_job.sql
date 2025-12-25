-- Optional: Create a pg_cron job to call the snapshot builder every minute
-- Requires pg_cron extension to be installed and configured by the DB admin

-- Example: call an Edge Function or internal trigger function via HTTP using curl inside a psql environment that supports it.
-- If you prefer an internal runner, create a cron that calls a stored procedure that triggers a NOTIFY which an external worker can listen to.

-- This is an example only; adjust to your environment and how you host the Edge Function.

-- Example external call using pg_cron via curl (only possible if you have a helper function to call HTTP from the DB):
-- SELECT cron.schedule('snapshot_rebuild_every_min', '*/1 * * * *', $$
--   PERFORM http_post('https://<EDGE_FUNCTION_URL>?force=1');
-- $$);

-- Alternative: use external scheduler (recommended) e.g. GitHub Actions cron, Vercel/Mercury cron, or any serverless cron to POST to the Edge Function.
