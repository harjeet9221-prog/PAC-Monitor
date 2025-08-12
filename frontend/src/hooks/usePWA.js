import { useState, useEffect, useCallback } from 'react';

export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [swRegistration, setSwRegistration] = useState(null);

  // Check if app is installed
  useEffect(() => {
    const checkInstallation = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
      }
    };

    checkInstallation();
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    
    return () => window.removeEventListener('appinstalled', () => setIsInstalled(true));
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Capture install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Register service worker
  useEffect(() => {
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js');
          setSwRegistration(registration);
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
                if (confirm('Nuova versione disponibile! Ricarica la pagina?')) {
                  window.location.reload();
                }
              }
            });
          });

          // Handle service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'PORTFOLIO_SYNC') {
              console.log(event.data.message);
              // You can show a toast notification here
            }
          });

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerSW();
  }, []);

  // Install app
  const installApp = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('App installata con successo');
        setDeferredPrompt(null);
      }
    }
  }, [deferredPrompt]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Send push notification
  const sendNotification = useCallback((title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/logo192.png',
        badge: '/logo192.png',
        ...options
      });
    }
  }, []);

  // Sync data when back online
  const syncData = useCallback(async () => {
    if (swRegistration && 'sync' in window) {
      try {
        await swRegistration.sync.register('portfolio-sync');
        console.log('Sincronizzazione programmata');
      } catch (error) {
        console.error('Errore nella sincronizzazione:', error);
      }
    }
  }, [swRegistration]);

  // Check for updates
  const checkForUpdates = useCallback(async () => {
    if (swRegistration) {
      await swRegistration.update();
    }
  }, [swRegistration]);

  // Get cache status
  const getCacheStatus = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const cacheStatus = {};
      
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        cacheStatus[name] = keys.length;
      }
      
      return cacheStatus;
    }
    return {};
  }, []);

  // Clear cache
  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
      console.log('Cache pulita');
    }
  }, []);

  return {
    isInstalled,
    isOnline,
    canInstall: !!deferredPrompt,
    installApp,
    requestNotificationPermission,
    sendNotification,
    syncData,
    checkForUpdates,
    getCacheStatus,
    clearCache,
    swRegistration
  };
};