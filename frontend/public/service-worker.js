/* Advanced PWA service worker for portfolio monitoring app */

const CACHE_NAME = "portfolio-pro-cache-v2";
const STATIC_CACHE = "portfolio-pro-static-v2";
const DYNAMIC_CACHE = "portfolio-pro-dynamic-v2";

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/static/js/bundle.js",
  "/static/css/main.css"
];

const STATIC_ASSETS = [
  "/static/js/",
  "/static/css/",
  "/static/media/",
  "/logo192.png",
  "/logo512.png"
];

// Install event - precache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
      caches.open(DYNAMIC_CACHE)
    ]).then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
      
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })()
  );
});

// Fetch event - handle different types of requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle navigation requests (SPA routes)
  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle API requests with network-first strategy
  if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Default: network-first for other requests
  event.respondWith(handleDefaultRequest(request));
});

function isNavigationRequest(request) {
  return request.mode === "navigate" || 
         (request.method === "GET" && request.headers.get("accept")?.includes("text/html"));
}

function isApiRequest(request) {
  return request.url.includes("/api/") || 
         request.url.includes("financial") ||
         request.url.includes("market-data");
}

function isStaticAsset(request) {
  return STATIC_ASSETS.some(asset => request.url.includes(asset)) ||
         request.destination === "style" ||
         request.destination === "script" ||
         request.destination === "image";
}

async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const response = await fetch(request);
    if (response.ok) {
      // Cache the successful response
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.log("Navigation request failed, trying cache");
  }

  // Fallback to cached version
  const cached = await caches.match("/index.html");
  return cached || new Response("Offline - Portfolio Pro", {
    status: 503,
    statusText: "Service Unavailable",
    headers: { "Content-Type": "text/html" }
  });
}

async function handleApiRequest(request) {
  try {
    // Network first for API requests
    const response = await fetch(request);
    if (response.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.log("API request failed, trying cache");
  }

  // Return cached response if available
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  // Return offline response for API requests
  return new Response(JSON.stringify({ 
    error: "Offline", 
    message: "I dati non sono disponibili offline" 
  }), {
    status: 503,
    headers: { "Content-Type": "application/json" }
  });
}

async function handleStaticAsset(request) {
  // Cache first for static assets
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response("Asset not available offline", { status: 404 });
  }
}

async function handleDefaultRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || new Response("Offline", { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "portfolio-sync") {
    event.waitUntil(syncPortfolioData());
  }
});

async function syncPortfolioData() {
  // Sync portfolio changes when back online
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: "PORTFOLIO_SYNC",
      message: "Sincronizzazione portafoglio completata"
    });
  });
}

// Push notifications for market alerts
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Nuova notifica dal tuo Portfolio Pro",
    icon: "/logo192.png",
    badge: "/logo192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: "explore",
        title: "Visualizza",
        icon: "/logo192.png"
      },
      {
        action: "close",
        title: "Chiudi",
        icon: "/logo192.png"
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification("Portfolio Pro", options)
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(
      clients.openWindow("/")
    );
  }
});