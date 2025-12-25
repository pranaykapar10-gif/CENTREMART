import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));
  const token = req.headers.get('x-admin-token') || body.adminToken || process.env.ADMIN_FORCE_TOKEN;

  if (!token || token !== process.env.ADMIN_FORCE_TOKEN) {
    return new NextResponse(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 401 });
  }

  // Call the Supabase Edge Function (configured URL in env)
  const edgeUrl = process.env.SNAPSHOT_EDGE_URL;
  if (!edgeUrl) {
    return new NextResponse(JSON.stringify({ ok: false, error: 'snapshot edge url not configured' }), { status: 500 });
  }

  try {
    const res = await fetch(`${edgeUrl}?force=1`, { method: 'POST' });
    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ ok: false, error: err.message || String(err) }), { status: 500 });
  }
}
