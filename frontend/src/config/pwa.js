// PWA Configuration
export const PWA_CONFIG = {
  name: 'PAC Monitor - Gestione Investimenti AI',
  shortName: 'PAC Monitor',
  description: 'Monitora i tuoi investimenti con l\'aiuto dell\'intelligenza artificiale',
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  display: 'standalone',
  orientation: 'portrait-primary',
  scope: '/',
  startUrl: '/',
  categories: ['finance', 'productivity', 'business'],
  
  // Icons configuration
  icons: {
    favicon: '/favicon.ico',
    favicon16: '/favicon-16x16.png',
    favicon32: '/favicon-32x32.png',
    appleTouch: '/logo192.png',
    logo192: '/logo192.png',
    logo512: '/logo512.png'
  },
  
  // Screenshots for app stores
  screenshots: [
    {
      src: '/screenshot1.png',
      type: 'image/png',
      sizes: '540x720'
    }
  ],
  
  // App shortcuts
  shortcuts: [
    {
      name: 'Mercato',
      shortName: 'Mercato',
      description: 'Visualizza andamento mercati',
      url: '/',
      icons: [{ src: '/logo192.png', sizes: '192x192' }]
    },
    {
      name: 'Portafoglio',
      shortName: 'Portfolio',
      description: 'Gestisci il tuo portafoglio',
      url: '/portfolio',
      icons: [{ src: '/logo192.png', sizes: '192x192' }]
    },
    {
      name: 'Strumenti',
      shortName: 'Tools',
      description: 'Utilizza calcolatori e strumenti',
      url: '/tools',
      icons: [{ src: '/logo192.png', sizes: '192x192' }]
    }
  ],
  
  // Cache configuration
  cache: {
    name: 'pac-monitor-v1',
    urls: [
      '/',
      '/static/js/bundle.js',
      '/static/css/main.css',
      '/manifest.json',
      '/favicon.ico',
      '/logo192.png',
      '/logo512.png'
    ]
  },
  
  // Notification configuration
  notifications: {
    defaultIcon: '/logo192.png',
    defaultBadge: '/logo192.png',
    defaultVibrate: [100, 50, 100],
    defaultActions: [
      {
        action: 'explore',
        title: 'Apri App',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Chiudi',
        icon: '/logo192.png'
      }
    ]
  }
};

// PWA feature flags
export const PWA_FEATURES = {
  offline: true,
  pushNotifications: true,
  backgroundSync: true,
  installPrompt: true,
  appShell: true
};

// PWA installation criteria
export const PWA_INSTALL_CRITERIA = {
  minEngagementTime: 30, // seconds
  minVisits: 2,
  minSessions: 1
};