import { createClient } from '@supabase/supabase-js';

// Environment variables (set in Supabase Edge Function or Vercel envs)
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SNAPSHOT_BUCKET = process.env.SNAPSHOT_BUCKET || 'github copilot';
const DIFF_THRESHOLD = parseInt(process.env.DIFF_THRESHOLD || '100');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  global: { headers: { "x-supabase-admin": 'true' } }
});

export async function buildSnapshot(forceFull = false) {
  const start = Date.now();

  // 1) read unprocessed queue
  const { data: queueRows, error: queueErr } = await supabase
    .from('products_changes_queue')
    .select('*')
    .eq('processed', false)
    .limit(1000);

  if (queueErr) throw queueErr;

  const diffCount = (queueRows && queueRows.length) || 0;

  // 2) Decide whether to generate diffs or full snapshot
  const shouldFull = forceFull || diffCount === 0 || diffCount > DIFF_THRESHOLD;

  // get current version
  const { data: snapRow } = await supabase
    .from('products_snapshot')
    .select('version')
    .eq('id', 1)
    .single();

  let currentVersion = snapRow?.version || 0;
  const newVersion = Date.now();

  // Helper: fetch product rows by ids
  async function fetchProductsByIds(ids: string[]) {
    if (ids.length === 0) return [];
    const { data } = await supabase
      .from('products')
      .select('*')
      .in('id', ids);
    return data || [];
  }

  // 3) If full snapshot
  if (shouldFull) {
    const { data: allProducts } = await supabase.from('products').select('*');
    const snapshotJson = JSON.stringify(allProducts || []);

    // upload full snapshot
    await uploadToBucket(`products-${newVersion}.json`, snapshotJson);
    await uploadToBucket('products.json', snapshotJson, true);

    // update products_snapshot table
    await supabase.from('products_snapshot').upsert({ id: 1, snapshot_json: JSON.parse(snapshotJson), version: newVersion, updated_at: new Date().toISOString() });

    // mark processed
    if (diffCount > 0) {
      await supabase.from('products_changes_queue').update({ processed: true }).eq('processed', false);
    }

    // write manifest
    const manifest = { currentVersion: newVersion, diffs: [] };
    await uploadToBucket('manifest.json', JSON.stringify(manifest), true);

    const ms = Date.now() - start;
    await supabase.from('snapshot_metrics').insert({ version: newVersion, product_count: (allProducts || []).length, build_ms: ms, diff_count: diffCount });

    return { type: 'full', version: newVersion, ms };
  }

  // 4) Build diffs (collect changed product rows)
  const ids = (queueRows || []).map((r: any) => r.product_id);
  const changedProducts = await fetchProductsByIds(ids);
  const diffJson = JSON.stringify(changedProducts || []);

  const diffPath = `diff/${newVersion}.json`;
  await uploadToBucket(diffPath, diffJson);

  // update manifest - append to diffs
  const { data: currentManifest } = await supabase.storage.from(SNAPSHOT_BUCKET).download('manifest.json').catch(() => ({ data: null }));
  let manifest = { currentVersion: currentVersion, diffs: [] as string[] };
  if (currentManifest && (currentManifest as any).arrayBuffer) {
    try {
      const buf = await (currentManifest as any).arrayBuffer();
      const txt = new TextDecoder().decode(buf);
      manifest = JSON.parse(txt);
    } catch (e) {
      // ignore
    }
  }

  manifest.currentVersion = newVersion;
  manifest.diffs = [...(manifest.diffs || []), diffPath];

  // push manifest
  await uploadToBucket('manifest.json', JSON.stringify(manifest), true);

  // mark queue processed
  await supabase.from('products_changes_queue').update({ processed: true }).eq('processed', false);

  const ms = Date.now() - start;
  await supabase.from('snapshot_metrics').insert({ version: newVersion, product_count: (changedProducts || []).length, build_ms: ms, diff_count: diffCount });

  return { type: 'diff', version: newVersion, ms, diffCount };
}

async function uploadToBucket(path: string, body: string, publicDirect = false) {
  // Supabase storage upload
  const bucket = SNAPSHOT_BUCKET;
  const res = await supabase.storage.from(bucket).upload(path, new Blob([body]), { upsert: true });
  if (res.error) {
    // If upload failed when trying to write public 'products.json', try put via from().upload again
    throw res.error;
  }
  // set public URL if required (Supabase storage urls are accessible via public bucket or signed urls)
}

// Exported handler for Edge Function
export default async function handler(event: any) {
  const url = new URL(event.request.url);
  const force = url.searchParams.get('force') === '1';

  try {
    const result = await buildSnapshot(force);
    return new Response(JSON.stringify({ ok: true, result }), { status: 200 });
  } catch (err: any) {
    console.error('Snapshot builder failed', err);
    return new Response(JSON.stringify({ ok: false, error: err.message || String(err) }), { status: 500 });
  }
}
