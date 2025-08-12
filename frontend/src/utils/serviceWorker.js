// Service Worker Registration for PWA
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          // Registration successful
          console.log('SW registered: ', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content available
                  console.log('New content is available; please refresh.');
                  // You can show a notification to the user here
                  showUpdateNotification();
                } else {
                  // Content cached for offline use
                  console.log('Content is cached for offline use.');
                }
              }
            };
          });
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

// Unregister service worker
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Show update notification
function showUpdateNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('PAC Monitor', {
      body: 'È disponibile un aggiornamento. Ricarica la pagina per applicarlo.',
      icon: '/logo192.png',
      tag: 'update-available'
    });
  }
}

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }
}

// Check if app is installed
export function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Install prompt handling
export function handleInstallPrompt() {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button or prompt
    showInstallPrompt();
  });

  return deferredPrompt;
}

// Show install prompt
function showInstallPrompt() {
  // You can implement a custom install button here
  console.log('Install prompt available');
}

// Background sync registration
export function registerBackgroundSync(tag) {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.sync.register(tag);
    });
  }
}