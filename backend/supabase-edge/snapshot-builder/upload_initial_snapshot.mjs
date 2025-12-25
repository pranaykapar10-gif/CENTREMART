import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SNAPSHOT_BUCKET = process.env.SNAPSHOT_BUCKET || 'github copilot';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { global: { headers: { 'x-supabase-admin': 'true' } } });

async function ensureBucket(name) {
  try {
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    if (listErr) {
      console.warn('listBuckets returned error:', listErr.message || listErr);
    }
    const found = buckets && buckets.find(b => b.name === name);
    if (found) return name;

    const sanitized = name.replace(/\s+/g, '-').toLowerCase();
    console.log(`Bucket '${name}' not found; creating '${sanitized}' instead.`);
    const { error: createErr } = await supabase.storage.createBucket(sanitized, { public: true });
    if (createErr) {
      console.error('createBucket failed:', createErr.message || createErr);
      throw createErr;
    }
    return sanitized;
  } catch (err) {
    console.error('Bucket check/create failed:', err && err.message ? err.message : err);
    throw err;
  }
}

async function uploadFile(bucket, key, body) {
  // delete if exists
  try {
    await supabase.storage.from(bucket).remove([key]);
  } catch (e) { /* ignore */ }
  const { error } = await supabase.storage.from(bucket).upload(key, Buffer.from(body), { upsert: true });
  if (error) throw error;
  return true;
}

// Resolve snapshot path reliably in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const snapshotPath = path.resolve(__dirname, '..', '..', '..', 'frontend', 'public', 'data', 'products-snapshot.json');

console.log('Using snapshot path:', snapshotPath);

(async () => {
  try {
    const bucketName = await ensureBucket(SNAPSHOT_BUCKET);
    if (!fs.existsSync(snapshotPath)) {
      throw new Error(`Snapshot file not found at ${snapshotPath}`);
    }
    const snapshot = fs.readFileSync(snapshotPath, 'utf8');
    const version = Date.now();

    // upload full snapshot as versioned and current
    await uploadFile(bucketName, `products-${version}.json`, snapshot);
    await uploadFile(bucketName, 'products.json', snapshot);

    // manifest
    const manifest = { currentVersion: version, diffs: [] };
    await uploadFile(bucketName, 'manifest.json', JSON.stringify(manifest));

    console.log('Uploaded snapshot and manifest to bucket:', bucketName, 'version:', version);
  } catch (err) {
    console.error('Initial upload failed:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
