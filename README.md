# Portfolio Monitor PWA 📊

Una Progressive Web App (PWA) ottimizzata per smartphone per monitorare il portafoglio di investimenti con strumenti finanziari avanzati.

## 🚀 Caratteristiche Principali

### 📱 Ottimizzazione Mobile
- **Design Mobile-First**: Interfaccia ottimizzata per smartphone con navigazione touch-friendly
- **PWA Completa**: Installabile come app nativa con funzionalità offline
- **Responsive Design**: Si adatta perfettamente a qualsiasi dimensione di schermo
- **Tema Scuro/Chiaro**: Supporto per tema automatico basato sulle preferenze di sistema

### 💼 Gestione Portafoglio
- **Tracking Completo**: Monitora azioni, ETF, obbligazioni e criptovalute
- **Metriche Avanzate**: Calcolo automatico di P&L, rendimenti e allocazione asset
- **Storico Performance**: Visualizzazione grafica delle performance nel tempo
- **Import/Export**: Backup e ripristino dei dati del portafoglio

### 📈 Dati di Mercato
- **Mercati Globali**: Monitoraggio di indici, azioni, crypto e forex
- **Aggiornamenti Real-time**: Simulazione di prezzi in tempo reale
- **Analisi Tecnica**: Grafici e trend di mercato
- **Top Movers**: Migliori e peggiori performer del giorno

### 🧮 Calcolatori Finanziari
- **Interesse Composto**: Calcolo crescita investimenti nel tempo
- **Pianificazione Pensione**: Proiezioni per il retirement planning
- **Prestiti**: Calcolo rate e piani di ammortamento
- **Risultati Real-time**: Aggiornamento automatico durante la digitazione

### 📊 Dashboard e Analytics
- **Grafici Interattivi**: Visualizzazioni con Chart.js
- **Allocazione Asset**: Distribuzione grafica del portafoglio
- **Top Holdings**: Principali posizioni per valore
- **Panoramica Mercati**: Indici principali in tempo reale

### 🔔 Notifiche e Avvisi
- **Push Notifications**: Notifiche per aggiornamenti importanti
- **Avvisi Prezzo**: Alerts personalizzabili per i tuoi investimenti
- **Aggiornamenti Offline**: Sincronizzazione quando torna la connessione

## 🛠️ Tecnologie Utilizzate

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **PWA**: Service Worker, Web App Manifest
- **Grafici**: Chart.js per visualizzazioni interattive
- **Storage**: LocalStorage per persistenza dati
- **Design**: CSS Grid, Flexbox, CSS Custom Properties
- **Fonts**: Inter (Google Fonts)

## 📁 Struttura del Progetto

```
portfolio-monitor/
├── index.html              # Pagina principale dell'app
├── manifest.json           # Manifest PWA
├── sw.js                   # Service Worker
├── styles/
│   └── main.css            # Stili principali
├── js/
│   ├── app.js              # Logica principale dell'app
│   ├── portfolio.js        # Gestione portafoglio
│   ├── markets.js          # Dati di mercato
│   ├── calculator.js       # Calcolatori finanziari
│   └── charts.js           # Gestione grafici
└── icons/                  # Icone PWA (varie dimensioni)
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

## 🚀 Installazione e Utilizzo

### Installazione Locale
1. Clona o scarica il progetto
2. Apri `index.html` in un browser moderno
3. Per HTTPS locale (necessario per PWA), usa un server locale:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   
   # Con Live Server (VS Code)
   # Installa l'estensione Live Server e clicca "Go Live"
   ```

### Installazione come PWA
1. Visita l'app nel browser
2. Cerca l'icona "Installa" nella barra degli indirizzi
3. Clicca "Installa" per aggiungere alla home screen
4. L'app sarà disponibile come applicazione nativa

## 📱 Funzionalità PWA

### ✅ Offline First
- **Cache Intelligente**: Risorse statiche sempre disponibili offline
- **Strategia di Cache**: Cache-first per assets, network-first per dati
- **Sincronizzazione**: Background sync quando torna la connessione
- **Fallback**: Messaggi informativi quando offline

### ✅ Installabile
- **Manifest Completo**: Configurazione per installazione nativa
- **Icone Adattive**: Set completo di icone per tutti i dispositivi
- **Shortcuts**: Scorciatoie rapide nel launcher
- **Splash Screen**: Schermata di avvio personalizzata

### ✅ App-like
- **Navigazione Nativa**: Gestione della cronologia del browser
- **Notifiche Push**: Sistema di notifiche integrato
- **Fullscreen**: Modalità standalone senza barre del browser
- **Orientamento**: Ottimizzato per uso verticale

## 🎯 Funzionalità Principali

### Dashboard
- Panoramica completa del portafoglio
- Grafici performance e allocazione asset
- Top holdings e panoramica mercati
- Metriche chiave (valore totale, P&L, rendimento)

### Gestione Portafoglio
- Aggiunta/modifica/rimozione posizioni
- Supporto per azioni, ETF, obbligazioni, crypto
- Calcolo automatico metriche performance
- Filtri per tipo di asset

### Mercati Finanziari
- Indici globali (S&P 500, NASDAQ, DAX, FTSE MIB, Nikkei)
- Azioni principali (AAPL, MSFT, GOOGL, TSLA)
- Criptovalute (BTC, ETH, ADA, SOL)
- Coppie Forex (EUR/USD, GBP/USD, USD/JPY)

### Calcolatori
- **Interesse Composto**: Crescita capitale con contributi mensili
- **Pensione**: Proiezioni retirement con inflazione
- **Prestiti**: Rate mensili e piani di ammortamento

## 🎨 Design e UX

### Mobile-First
- Progettato prioritariamente per smartphone
- Touch-friendly con elementi da 44px minimo
- Navigazione con tab inferiori per accesso rapido
- Swipe gestures e interazioni native

### Accessibilità
- Contrasti colori conformi WCAG
- Focus management per navigazione da tastiera
- Etichette semantiche per screen reader
- Dimensioni testo scalabili

### Performance
- Lazy loading per componenti pesanti
- Ottimizzazione immagini e assets
- Minificazione CSS e JS (in produzione)
- Critical CSS inline

## 🔧 Personalizzazione

### Temi
- Chiaro, Scuro, Automatico (segue sistema)
- CSS Custom Properties per facile personalizzazione
- Supporto `prefers-color-scheme`

### Valute
- Euro (EUR) - default
- Dollaro USA (USD)
- Sterlina (GBP)
- Formattazione automatica numeri

### Dati
- Export completo in JSON
- Import dati da backup
- Reset completo applicazione

## 🚧 Sviluppo Futuro

### Roadmap
- [ ] Integrazione API reali per dati di mercato
- [ ] Sistema avvisi prezzo avanzato
- [ ] Analisi tecnica con indicatori
- [ ] Portfolio comparison e benchmarking
- [ ] Reporting PDF automatico
- [ ] Integrazione broker per import transazioni
- [ ] Supporto multi-valuta avanzato
- [ ] Machine learning per predizioni
- [ ] Social features e community

### Contributi
I contributi sono benvenuti! Per contribuire:
1. Fork del repository
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 🤝 Supporto

Per supporto, bug report o richieste di funzionalità:
- Apri un issue su GitHub
- Contatta via email
- Unisciti alla community Discord

---

**Portfolio Monitor PWA** - La tua finanza personale sempre a portata di mano! 📱💰