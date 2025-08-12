const CACHE_NAME = 'portfolio-monitor-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/styles/main.css',
    '/js/app.js',
    '/js/portfolio.js',
    '/js/markets.js',
    '/js/calculator.js',
    '/js/charts.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/index.min.js'
];

// API endpoints to cache dynamically
const API_CACHE_PATTERNS = [
    /^https:\/\/api\..*$/,
    /^https:\/\/.*\.api\..*$/,
    /market-data/,
    /stock-prices/,
    /crypto-prices/
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Old caches cleaned up');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests that we don't want to cache
    if (url.origin !== location.origin && !shouldCacheExternalRequest(request)) {
        return;
    }

    // Handle different types of requests
    if (request.method === 'GET') {
        if (isStaticAsset(request)) {
            event.respondWith(cacheFirst(request));
        } else if (isAPIRequest(request)) {
            event.respondWith(networkFirst(request));
        } else {
            event.respondWith(staleWhileRevalidate(request));
        }
    }
});

// Cache strategies
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline fallback for API requests
        return new Response(JSON.stringify({
            error: 'Offline',
            message: 'Dati non disponibili offline',
            cached: false
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff2?)$/) ||
           STATIC_FILES.includes(url.pathname) ||
           url.hostname === 'fonts.googleapis.com' ||
           url.hostname === 'fonts.gstatic.com';
}

function isAPIRequest(request) {
    const url = new URL(request.url);
    return API_CACHE_PATTERNS.some(pattern => pattern.test(request.url)) ||
           url.pathname.includes('/api/') ||
           url.pathname.includes('/data/');
}

function shouldCacheExternalRequest(request) {
    const url = new URL(request.url);
    return url.hostname === 'fonts.googleapis.com' ||
           url.hostname === 'fonts.gstatic.com' ||
           url.hostname === 'cdn.jsdelivr.net' ||
           API_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'portfolio-sync') {
        event.waitUntil(syncPortfolioData());
    } else if (event.tag === 'price-alerts') {
        event.waitUntil(syncPriceAlerts());
    }
});

async function syncPortfolioData() {
    try {
        // Get pending portfolio updates from IndexedDB
        const pendingUpdates = await getPendingPortfolioUpdates();
        
        for (const update of pendingUpdates) {
            try {
                const response = await fetch('/api/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(update)
                });
                
                if (response.ok) {
                    await removePendingUpdate(update.id);
                    console.log('Portfolio update synced:', update.id);
                }
            } catch (error) {
                console.error('Failed to sync portfolio update:', error);
            }
        }
    } catch (error) {
        console.error('Portfolio sync failed:', error);
    }
}

async function syncPriceAlerts() {
    try {
        // Implementation for syncing price alerts
        console.log('Syncing price alerts...');
    } catch (error) {
        console.error('Price alerts sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', event => {
    console.log('Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Aggiornamento portafoglio disponibile',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        vibrate: [200, 100, 200],
        data: event.data ? JSON.parse(event.data.text()) : {},
        actions: [
            {
                action: 'view',
                title: 'Visualizza',
                icon: '/icons/icon-192x192.png'
            },
            {
                action: 'dismiss',
                title: 'Ignora'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Portfolio Monitor', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/#dashboard')
        );
    }
});

// Placeholder functions for IndexedDB operations
async function getPendingPortfolioUpdates() {
    // Implementation would use IndexedDB to get pending updates
    return [];
}

async function removePendingUpdate(id) {
    // Implementation would remove the update from IndexedDB
    console.log('Removing pending update:', id);
}

// Error handling
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker unhandled rejection:', event.reason);
});