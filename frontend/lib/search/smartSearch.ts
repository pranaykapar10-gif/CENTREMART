import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';

export interface ProductRecord {
  id: string | number;
  name: string;
  category?: string;
  description?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  tags?: string[];
}

export interface SmartSearchResult {
  id: string | number;
  name: string;
  category?: string;
  image?: string;
  price?: number;
}

const SNAPSHOT_URL = '/data/products.json';
const MAX_RESULTS = 8;

let cachedSnapshot: ProductRecord[] | null = null;
let fuseInstance: Fuse<ProductRecord> | null = null;
let preloadPromise: Promise<ProductRecord[]> | null = null;

const fuseOptions: IFuseOptions<ProductRecord> = {
  includeScore: true,
  threshold: 0.38,
  ignoreLocation: true,
  keys: [
    { name: 'name', weight: 0.45 },
    { name: 'description', weight: 0.25 },
    { name: 'category', weight: 0.15 },
    { name: 'tags', weight: 0.15 },
  ],
};

async function fetchProductSnapshot(): Promise<ProductRecord[]> {
  if (cachedSnapshot) return cachedSnapshot;
  if (!preloadPromise) {
    preloadPromise = fetch(SNAPSHOT_URL, { cache: 'force-cache' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load product snapshot');
        }
        return response.json();
      })
      .then((data: ProductRecord[]) => {
        cachedSnapshot = data;
        return data;
      })
      .catch((error) => {
        console.error('[SmartSearch] Snapshot fetch failed', error);
        preloadPromise = null;
        throw error;
      });
  }
  return preloadPromise;
}

async function getFuseInstance(): Promise<Fuse<ProductRecord>> {
  if (fuseInstance) return fuseInstance;
  const dataset = await fetchProductSnapshot();
  fuseInstance = new Fuse(dataset, fuseOptions);
  return fuseInstance;
}

async function reloadSnapshotFromCdn() {
  try {
    const res = await fetch('/data/products.json', { cache: 'no-cache' });
    if (!res.ok) return;
    const data = await res.json();
    cachedSnapshot = data;
    // recreate fuse
    fuseInstance = new Fuse(cachedSnapshot, fuseOptions);
  } catch (e) {
    // ignore
  }
}

// Expose manual refresh
export async function refreshSnapshot() {
  await reloadSnapshotFromCdn();
}

// On client, listen for service worker messages to refresh snapshot
if (typeof window !== 'undefined' && 'navigator' in window && (navigator as any).serviceWorker) {
  navigator.serviceWorker.addEventListener('message', (event: any) => {
    try {
      if (event.data && event.data.type === 'products-updated') {
        // fetch latest merged snapshot and rebuild index
        reloadSnapshotFromCdn();
      }
    } catch (e) {
      // ignore
    }
  });
}

// ensure snapshot preloaded by default when module loads in browser
if (typeof window !== 'undefined') preloadSmartSearch();

export async function smartProductSearch(query: string): Promise<SmartSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const fuse = await getFuseInstance();
  const matches = fuse.search(trimmed, { limit: MAX_RESULTS });

  return matches.map((match) => ({
    id: match.item.id,
    name: match.item.name,
    category: match.item.category,
    image: match.item.image,
    price: match.item.price,
  }));
}

export async function getAllProducts(): Promise<ProductRecord[]> {
  return fetchProductSnapshot();
}
