# Portfolio Pro - PWA per Monitoraggio Portafoglio

Una Progressive Web App (PWA) completa e ottimizzata per smartphone per il monitoraggio del portafoglio di investimenti con strumenti finanziari avanzati.

## 🚀 Caratteristiche Principali

### 📱 PWA Completa
- **Installabile**: Può essere installata come app nativa su smartphone
- **Offline**: Funziona anche senza connessione internet
- **Responsive**: Ottimizzata per dispositivi mobili
- **Push Notifications**: Notifiche per aggiornamenti mercato

### 💼 Gestione Portafoglio
- **Dashboard**: Panoramica completa del portafoglio
- **Asset Management**: Aggiunta, modifica e rimozione asset
- **Performance Tracking**: Monitoraggio rendimenti per periodo
- **Risk Analysis**: Analisi rischio e diversificazione
- **Portfolio Builder**: Costruzione guidata di nuovi portafogli

### 📊 Dati di Mercato
- **Indici Principali**: S&P 500, NASDAQ, FTSE MIB, DAX, CAC 40
- **Valute**: EUR/USD, EUR/GBP, EUR/JPY
- **Commodity**: Oro, Argento, Petrolio
- **Criptovalute**: Bitcoin, Ethereum
- **Aggiornamenti Real-time**: Dati aggiornati ogni 30 secondi

### 📰 Notizie Finanziarie
- **Categorie**: Politica Monetaria, Inflazione, Mercati Emergenti
- **Sentiment Analysis**: Classificazione positiva/negativa/neutrale
- **Filtri Avanzati**: Per categoria, impatto e sentiment
- **Bookmark**: Salvataggio notizie preferite

### 🧮 Strumenti Finanziari
- **Calcolatori**: Interesse composto, rendimento annualizzato, inflazione
- **Analisi Rischio**: Diversificazione, correlazione, volatilità, Sharpe Ratio, VaR
- **Pianificazione**: Asset allocation, rebalancing, costi transazione
- **Simulazioni**: Performance storica e proiezioni future

## 🛠️ Tecnologie Utilizzate

### Frontend
- **React 19**: Framework principale
- **Tailwind CSS**: Styling e design system
- **Radix UI**: Componenti accessibili
- **Lucide React**: Icone moderne
- **React Router**: Navigazione SPA

### PWA Features
- **Service Worker**: Gestione cache e offline
- **Web App Manifest**: Installazione e configurazione
- **Push API**: Notifiche push
- **Background Sync**: Sincronizzazione dati offline

### State Management
- **React Hooks**: Gestione stato locale
- **Custom Hooks**: Logica riutilizzabile
- **LocalStorage**: Persistenza dati

## 📱 Installazione e Utilizzo

### Prerequisiti
- Node.js 18+ 
- Yarn o npm
- Browser moderno con supporto PWA

### Installazione
```bash
# Clona il repository
git clone <repository-url>
cd portfolio-pro

# Installa dipendenze
yarn install

# Avvia in modalità sviluppo
yarn start

# Build per produzione
yarn build
```

### Installazione PWA
1. Apri l'app nel browser
2. Clicca sul pulsante "Installa" quando appare
3. Conferma l'installazione
4. L'app sarà disponibile come app nativa

## 🏗️ Struttura del Progetto

```
frontend/
├── public/
│   ├── manifest.json          # Configurazione PWA
│   ├── service-worker.js      # Service worker per offline
│   └── index.html            # Entry point HTML
├── src/
│   ├── components/            # Componenti UI riutilizzabili
│   ├── hooks/                 # Custom hooks
│   │   ├── usePWA.js         # Gestione funzionalità PWA
│   │   ├── usePortfolio.js   # Gestione portafoglio
│   │   ├── useMarkets.js     # Dati mercato
│   │   └── useFinancialTools.js # Strumenti finanziari
│   ├── pages/                 # Pagine dell'applicazione
│   │   ├── Dashboard.js      # Dashboard principale
│   │   ├── Portfolio.js      # Gestione portafoglio
│   │   ├── Markets.js        # Dati mercato
│   │   ├── News.js           # Notizie finanziarie
│   │   ├── Tools.js          # Strumenti finanziari
│   │   ├── AssetDetail.js    # Dettagli asset
│   │   └── PortfolioBuilder.js # Costruttore portafoglio
│   └── App.js                # Componente principale
```

## 🔧 Configurazione

### Manifest PWA
Il file `manifest.json` configura:
- Nome e descrizione dell'app
- Icone per diversi dispositivi
- Colori tema e sfondo
- Shortcuts per accesso rapido
- Orientamento e display mode

### Service Worker
Il service worker gestisce:
- Cache strategica per asset statici
- Gestione richieste API con fallback offline
- Background sync per dati portafoglio
- Push notifications per aggiornamenti

### Hooks Personalizzati

#### usePWA
Gestisce tutte le funzionalità PWA:
- Registrazione service worker
- Installazione app
- Gestione notifiche
- Sincronizzazione offline

#### usePortfolio
Gestisce i dati del portafoglio:
- Asset e loro performance
- Calcoli metriche e rischio
- Salvataggio e caricamento dati
- Esportazione CSV

#### useMarkets
Gestisce i dati di mercato:
- Indici e valute
- Aggiornamenti real-time
- Notizie finanziarie
- Filtri e ricerca

#### useFinancialTools
Fornisce strumenti finanziari:
- Calcolatori matematici
- Analisi rischio e performance
- Pianificazione portafoglio
- Simulazioni e proiezioni

## 📊 Funzionalità Dettagliate

### Dashboard
- **Metriche Principali**: Valore totale, performance 1Y
- **Allocazione Asset**: Distribuzione per classe
- **Metriche Rischio**: Diversificazione, volatilità, TER
- **Performance**: Rendimenti per periodo
- **Mercati**: Sentiment e indici principali

### Portfolio Management
- **Tabella Asset**: Visualizzazione completa con filtri
- **Modifica Asset**: Aggiornamento importi e pesi
- **Ricerca**: Filtri per nome, ticker, classe
- **Esportazione**: CSV con dati completi
- **Privacy**: Modalità nascondi valori

### Market Data
- **Indici Globali**: Principali indici con performance
- **Tassi Cambio**: Valute principali con variazioni
- **Commodity**: Prezzi oro, argento, petrolio
- **Crypto**: Bitcoin, Ethereum con market cap
- **Sentiment**: Analisi mood mercato

### News & Analysis
- **Categorie**: Politica monetaria, inflazione, mercati
- **Sentiment**: Classificazione automatica
- **Filtri**: Per categoria, impatto, fonte
- **Bookmark**: Salvataggio notizie preferite
- **Condivisione**: Web Share API e clipboard

### Financial Tools
- **Calcolatori Base**: Interesse composto, rendimenti
- **Analisi Rischio**: Diversificazione, correlazione
- **Metriche Avanzate**: Sharpe ratio, VaR, volatilità
- **Pianificazione**: Asset allocation, rebalancing
- **Simulazioni**: Performance storica e future

## 🎨 Design e UX

### Principi di Design
- **Mobile First**: Ottimizzato per smartphone
- **Touch Friendly**: Interfacce per touch screen
- **Accessibilità**: Componenti Radix UI compliant
- **Performance**: Lazy loading e ottimizzazioni

### Sistema Colori
- **Primario**: Blu (#1e40af)
- **Successo**: Verde (#16a34a)
- **Warning**: Giallo (#ca8a04)
- **Errore**: Rosso (#dc2626)
- **Neutro**: Grigio (#6b7280)

### Componenti UI
- **Cards**: Contenitori informativi
- **Buttons**: Azioni principali e secondarie
- **Tabs**: Navigazione tra sezioni
- **Badges**: Etichette e stati
- **Inputs**: Form e controlli

## 📱 Compatibilità

### Browser Supportati
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Dispositivi
- **Smartphone**: iOS 12+, Android 8+
- **Tablet**: iPadOS 14+, Android 8+
- **Desktop**: Windows 10+, macOS 10.15+, Linux

### PWA Support
- **Installazione**: Chrome, Edge, Safari
- **Offline**: Service Worker support
- **Push**: Chrome, Edge, Firefox
- **Background Sync**: Chrome, Edge

## 🚀 Deployment

### Build di Produzione
```bash
yarn build
```

### Servizio Web
- Configura HTTPS (richiesto per PWA)
- Imposta cache headers appropriati
- Abilita compressione gzip
- Configura service worker

### Hosting Consigliato
- **Vercel**: Deploy automatico da Git
- **Netlify**: Build e deploy semplificato
- **Firebase Hosting**: Integrazione Google
- **AWS S3 + CloudFront**: Scalabilità enterprise

## 🔒 Sicurezza

### Best Practices
- **HTTPS**: Richiesto per PWA
- **CSP**: Content Security Policy
- **Sanitizzazione**: Input validation
- **Autenticazione**: JWT o OAuth2

### Privacy
- **Dati Locali**: Salvataggio locale sicuro
- **Crittografia**: Sensitive data encryption
- **GDPR**: Compliance privacy
- **Audit**: Log accessi e modifiche

## 📈 Roadmap

### Versione 1.1
- [ ] Integrazione API reali per dati mercato
- [ ] Autenticazione utente
- [ ] Sincronizzazione cloud
- [ ] Notifiche push personalizzate

### Versione 1.2
- [ ] Grafici interattivi (Chart.js/D3.js)
- [ ] Export PDF reports
- [ ] Integrazione broker
- [ ] Social trading features

### Versione 2.0
- [ ] AI-powered insights
- [ ] Portfolio optimization
- [ ] Tax optimization
- [ ] Multi-currency support

## 🤝 Contributi

### Come Contribuire
1. Fork del repository
2. Crea branch per feature
3. Commit delle modifiche
4. Push al branch
5. Crea Pull Request

### Guidelines
- Segui le convenzioni di codice
- Aggiungi test per nuove funzionalità
- Aggiorna la documentazione
- Mantieni la compatibilità PWA

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 📞 Supporto

### Canali di Supporto
- **Issues**: GitHub Issues per bug e feature requests
- **Discussions**: GitHub Discussions per domande
- **Wiki**: Documentazione dettagliata
- **Email**: support@portfoliopro.com

### Community
- **Discord**: Server community per sviluppatori
- **Twitter**: Aggiornamenti e news
- **Blog**: Articoli tecnici e tutorial
- **YouTube**: Video guide e demo

---

**Portfolio Pro** - La PWA completa per il monitoraggio del tuo portafoglio di investimenti 📱💼📊