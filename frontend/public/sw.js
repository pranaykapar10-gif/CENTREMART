// Service Worker for PWA functionality
// Install event - cache assets
self.addEventListener('install', (event: ExtendableEvent) => {
    const installEvent = event as any;
    installEvent.waitUntil(
        (async() => {
            const cache = await caches.open('techstore-v1');
            await cache.addAll([
                '/',
                '/products',
                '/cart',
                '/account',
            ]);
        })()
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
    const activateEvent = event as any;
    activateEvent.waitUntil(
        (async() => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames
                .filter((cacheName) => cacheName.startsWith('techstore-') && cacheName !== 'techstore-v1')
                .map((cacheName) => caches.delete(cacheName))
            );
        })()
    );
    self.clients.claim();

    // start manifest polling loop
    (async function pollLoop() {
        try {
            await checkAndApplyManifest();
        } catch (e) {
            // ignore errors
        }
        setTimeout(pollLoop, POLL_INTERVAL);
    })();
});

// Snapshot polling constants
const SNAPSHOT_KEY = '/data/products.json';
const MANIFEST_KEY = '/data/manifest.json';
const POLL_INTERVAL = 60 * 1000; // 60s

// Check manifest and apply diffs to snapshot cache
async function checkAndApplyManifest() {
    const manifestRes = await fetch(MANIFEST_KEY, { cache: 'no-cache' }).catch(() => null);
    if (!manifestRes || !manifestRes.ok) return;
    const manifest = await manifestRes.json();
    const cache = await caches.open('techstore-v1');

    // get cached manifest
    const cachedManifestRes = await cache.match(MANIFEST_KEY);
    let cachedVersion = 0;
    if (cachedManifestRes) {
        try {
            const txt = await cachedManifestRes.text();
            const obj = JSON.parse(txt);
            cachedVersion = obj.currentVersion || 0;
        } catch (e) { /* ignore */ }
    }

    if ((manifest.currentVersion || 0) <= cachedVersion) {
        await cache.put(MANIFEST_KEY, new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/json' } }));
        return;
    }

    // Fetch base snapshot
    let products = [];
    const productRes = await cache.match(SNAPSHOT_KEY);
    if (productRes) {
        try { products = await productRes.json(); } catch (e) { products = []; }
    } else {
        const baseRes = await fetch(SNAPSHOT_KEY, { cache: 'no-cache' }).catch(() => null);
        if (baseRes && baseRes.ok) {
            products = await baseRes.json();
        }
    }

    const map = new Map((products || []).map(p => [p.id, p]));

    const diffs = manifest.diffs || [];
    for (const diffPath of diffs) {
        try {
            const dres = await fetch(`/data/${diffPath}`, { cache: 'no-cache' });
            if (!dres || !dres.ok) continue;
            const items = await dres.json();
            for (const item of items) {
                map.set(item.id, item);
            }
        } catch (e) {
            // ignore single diff error
        }
    }

    const merged = Array.from(map.values());
    const mergedTxt = JSON.stringify(merged);

    await cache.put(SNAPSHOT_KEY, new Response(mergedTxt, { headers: { 'Content-Type': 'application/json' } }));
    await cache.put(MANIFEST_KEY, new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/json' } }));

    const clientsList = await self.clients.matchAll();
    for (const client of clientsList) {
        client.postMessage({ type: 'products-updated', version: manifest.currentVersion });
    }
}

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event: FetchEvent) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        (async() => {
            try {
                // Try network first for API calls
                if (request.url.includes('/api/')) {
                    try {
                        const networkResponse = await fetch(request);
                        if (networkResponse.ok) {
                            const cache = await caches.open('techstore-api-v1');
                            cache.put(request, networkResponse.clone());
                            return networkResponse;
                        }
                    } catch {
                        const cachedResponse = await caches.match(request);
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                    }
                }

                // Try cache first for other requests
                const cachedResponse = await caches.match(request);
                if (cachedResponse) {
                    return cachedResponse;
                }

                const networkResponse = await fetch(request);

                // Cache successful responses
                if (networkResponse.ok && request.method === 'GET') {
                    const cache = await caches.open('techstore-v1');
                    cache.put(request, networkResponse.clone());
                }

                return networkResponse;
            } catch (error) {
                // Return offline page if available
                const cachedResponse = await caches.match('/offline.html');
                if (cachedResponse) {
                    return cachedResponse;
                }

                return new Response('Offline - Please check your connection', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain',
                    }),
                });
            }
        })()
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event: any) => {
    if (event.tag === 'sync-cart') {
        event.waitUntil(syncCart());
    }
    if (event.tag === 'sync-orders') {
        event.waitUntil(syncOrders());
    }
});

async function syncCart() {
    try {
        const cache = await caches.open('techstore-sync');
        const requests = await cache.keys();

        for (const request of requests) {
            if (request.url.includes('/cart')) {
                try {
                    const response = await fetch(request.clone());
                    if (response.ok) {
                        await cache.delete(request);
                    }
                } catch {
                    // Will retry on next sync
                }
            }
        }
    } catch (error) {
        console.error('Cart sync failed:', error);
    }
}

async function syncOrders() {
    try {
        const cache = await caches.open('techstore-sync');
        const requests = await cache.keys();

        for (const request of requests) {
            if (request.url.includes('/orders')) {
                try {
                    const response = await fetch(request.clone());
                    if (response.ok) {
                        await cache.delete(request);
                    }
                } catch {
                    // Will retry on next sync
                }
            }
        }
    } catch (error) {
        console.error('Order sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', (event: any) => {
    let data = {};
    try {
        if (event.data) data = event.data.json();
    } catch (e) {
        data = {};
    }
    const title = data.title || 'Notification';
    const options = {
        body: data.body || 'You have a new notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: data.tag || 'notification',
        requireInteraction: data.requireInteraction || false,
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', (event: any) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return (client as any).focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});