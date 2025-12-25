import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const pathArray = (await params).path; // params is a promise in recent Next.js versions
  const path = pathArray.join('/');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const bucket = process.env.SNAPSHOT_BUCKET || 'github copilot';

  if (!supabaseUrl) {
    return NextResponse.json({ error: 'SUPABASE_URL not configured' }, { status: 500 });
  }

  const encodedBucket = encodeURIComponent(bucket);
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const url = `${supabaseUrl}/storage/v1/object/public/${encodedBucket}/${encodedPath}`;

  try {
    const upstream = await fetch(url, { cache: 'no-store' });
    
    if (!upstream.ok) {
      if (upstream.status === 404) {
         return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Upstream error' }, { status: upstream.status });
    }

    const contentType = upstream.headers.get('content-type') || 'application/json';
    const blob = await upstream.blob();
    
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    });
  } catch (err) {
    console.error('Proxy fetch failed', err);
    return NextResponse.json({ error: 'Failed to fetch from storage' }, { status: 502 });
  }
}
