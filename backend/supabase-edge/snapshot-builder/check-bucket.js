import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { global: { headers: { 'x-supabase-admin': 'true' } } });

(async () => {
  try {
    const { data, error } = await s.storage.from(process.env.SNAPSHOT_BUCKET || 'github copilot').list('');
    if (error) throw error;
    console.log('Bucket files:', data);
  } catch (err) {
    console.error('Bucket check failed:', err);
    process.exit(1);
  }
})();
