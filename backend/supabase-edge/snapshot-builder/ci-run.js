import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SNAPSHOT_BUCKET = process.env.SNAPSHOT_BUCKET || 'github copilot';
const DIFF_THRESHOLD = parseInt(process.env.DIFF_THRESHOLD || '100', 10);
const FORCE_FULL = process.env.FORCE === '1';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { global: { headers: { 'x-supabase-admin': 'true' } } });

async function uploadToBucket(path, body, upsert = true) {
  const { error } = await supabase.storage.from(SNAPSHOT_BUCKET).upload(path, Buffer.from(body), { upsert });
  if (error) {
    throw error;
  }
}

async function downloadManifest() {
  try {
    const { data, error } = await supabase.storage.from(SNAPSHOT_BUCKET).download('manifest.json');
    if (error || !data) return { currentVersion: 0, diffs: [] };
    const buf = await data.arrayBuffer();
    const txt = new TextDecoder().decode(buf);
    return JSON.parse(txt);
  } catch (e) {
    return { currentVersion: 0, diffs: [] };
  }
}

async function buildSnapshot(forceFull = false) {
  const start = Date.now();

  const { data: queueRows, error: queueErr } = await supabase.from('products_changes_queue').select('*').eq('processed', false).limit(1000);
  if (queueErr) throw queueErr;
  const diffCount = (queueRows && queueRows.length) || 0;

  const shouldFull = forceFull || diffCount === 0 || diffCount > DIFF_THRESHOLD;

  // current snapshot version
  const { data: snapRow } = await supabase.from('products_snapshot').select('version').eq('id', 1).single();
  const currentVersion = snapRow?.version || 0;
  const newVersion = Date.now();

  if (shouldFull) {
    const { data: allProducts, error: allErr } = await supabase.from('products').select('*, categories(name)');
    if (allErr) throw allErr;
    // Transform to flatten category
    const flatProducts = (allProducts || []).map(p => ({
      ...p,
      category: p.categories?.name || 'Uncategorized',
      image: p.image_url,
      reviewCount: p.review_count
    }));
    const snapshotJson = JSON.stringify(flatProducts);
    await uploadToBucket(`products-${newVersion}.json`, snapshotJson, true);
    await uploadToBucket('products.json', snapshotJson, true);
    await supabase.from('products_snapshot').upsert({ id: 1, snapshot_json: JSON.parse(snapshotJson), version: newVersion, updated_at: new Date().toISOString() });
    if (diffCount > 0) {
      await supabase.from('products_changes_queue').update({ processed: true }).eq('processed', false);
    }
    const manifest = { currentVersion: newVersion, diffs: [] };
    await uploadToBucket('manifest.json', JSON.stringify(manifest), true);
    const ms = Date.now() - start;
    await supabase.from('snapshot_metrics').insert({ version: newVersion, product_count: (allProducts || []).length, build_ms: ms, diff_count: diffCount });
    console.log('Built full snapshot', { version: newVersion, ms });
    return { type: 'full', version: newVersion };
  }

  // diffs path
  const ids = (queueRows || []).map(r => r.product_id);
  const { data: changedProducts, error: cpErr } = await supabase.from('products').select('*, categories(name)').in('id', ids);
  if (cpErr) throw cpErr;
  
  const flatChanged = (changedProducts || []).map(p => ({
      ...p,
      category: p.categories?.name || 'Uncategorized',
      image: p.image_url,
      reviewCount: p.review_count
  }));

  const diffJson = JSON.stringify(flatChanged);
  const diffPath = `diff/${newVersion}.json`;
  await uploadToBucket(diffPath, diffJson, true);

  const manifest = await downloadManifest();
  manifest.currentVersion = newVersion;
  manifest.diffs = [...(manifest.diffs || []), diffPath];
  await uploadToBucket('manifest.json', JSON.stringify(manifest), true);

  await supabase.from('products_changes_queue').update({ processed: true }).eq('processed', false);
  const ms = Date.now() - start;
  await supabase.from('snapshot_metrics').insert({ version: newVersion, product_count: (changedProducts || []).length, build_ms: ms, diff_count: diffCount });
  console.log('Built diff snapshot', { version: newVersion, ms, diffCount });
  return { type: 'diff', version: newVersion };
}

(async () => {
  try {
    const res = await buildSnapshot(FORCE_FULL || FORCE_FULL === 'true' || FORCE_FULL === true);
    console.log('Snapshot runner finished:', res);
  } catch (err) {
    console.error('Snapshot runner failed:', err);
    process.exit(2);
  }
})();
