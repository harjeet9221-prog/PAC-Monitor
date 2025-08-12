// Portfolio Monitor App - Main Application Logic
class PortfolioApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.theme = localStorage.getItem('theme') || 'light';
        this.baseCurrency = localStorage.getItem('baseCurrency') || 'EUR';
        this.isOffline = !navigator.onLine;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupOfflineHandling();
        this.loadApp();
        
        // Initialize other modules
        this.portfolio = new PortfolioManager();
        this.markets = new MarketsManager();
        this.calculator = new CalculatorManager();
        this.charts = new ChartsManager();
        
        console.log('Portfolio Monitor App initialized');
    }

    setupEventListeners() {
        // Navigation event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.hideLoadingScreen();
            this.setupNavigation();
            this.setupModals();
            this.setupSettings();
        });

        // Bottom navigation
        const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Side navigation
        const sideNavItems = document.querySelectorAll('.nav-menu .nav-link');
        sideNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.toggleMenu();
            });
        }

        // Window events
        window.addEventListener('online', () => {
            this.isOffline = false;
            this.handleOnlineStatus();
        });

        window.addEventListener('offline', () => {
            this.isOffline = true;
            this.handleOfflineStatus();
        });

        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    setupNavigation() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'dashboard';
            this.navigateToPage(page, false);
        });

        // Set initial page from URL hash
        const hash = window.location.hash.substring(1);
        if (hash && this.isValidPage(hash)) {
            this.navigateToPage(hash, false);
        }
    }

    setupModals() {
        // Add position modal
        const addPositionBtn = document.getElementById('add-position-btn');
        const addPositionModal = document.getElementById('add-position-modal');
        const addPositionForm = document.getElementById('add-position-form');
        const closeModalBtns = document.querySelectorAll('.close-modal');

        if (addPositionBtn && addPositionModal) {
            addPositionBtn.addEventListener('click', () => {
                this.showModal('add-position-modal');
            });
        }

        if (addPositionForm) {
            addPositionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddPosition();
            });
        }

        // Close modal events
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideAllModals();
            });
        });

        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    setupSettings() {
        const themeSelector = document.getElementById('theme-selector');
        const baseCurrencySelector = document.getElementById('base-currency');
        const pushNotifications = document.getElementById('push-notifications');
        const autoRefresh = document.getElementById('auto-refresh');

        if (themeSelector) {
            themeSelector.value = this.theme;
            themeSelector.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }

        if (baseCurrencySelector) {
            baseCurrencySelector.value = this.baseCurrency;
            baseCurrencySelector.addEventListener('change', (e) => {
                this.setBaseCurrency(e.target.value);
            });
        }

        if (pushNotifications) {
            pushNotifications.checked = this.getNotificationPermission();
            pushNotifications.addEventListener('change', (e) => {
                this.handleNotificationToggle(e.target.checked);
            });
        }

        // Settings actions
        const exportBtn = document.getElementById('export-data-btn');
        const importBtn = document.getElementById('import-data-btn');
        const resetBtn = document.getElementById('reset-data-btn');

        if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());
        if (importBtn) importBtn.addEventListener('click', () => this.importData());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetData());
    }

    setupTheme() {
        if (this.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.theme === 'auto') {
                    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                }
            });
        } else {
            document.documentElement.setAttribute('data-theme', this.theme);
        }
    }

    setupOfflineHandling() {
        // Register service worker for offline functionality
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                    
                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.showUpdateAvailable();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }

        // Handle offline status
        this.updateOfflineStatus();
    }

    loadApp() {
        // Simulate app loading
        setTimeout(() => {
            this.hideLoadingScreen();
            this.navigateToPage(this.currentPage, false);
        }, 1500);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const appContainer = document.getElementById('app');
        
        if (loadingScreen && appContainer) {
            loadingScreen.style.display = 'none';
            appContainer.style.display = 'flex';
        }
    }

    navigateToPage(page, updateHistory = true) {
        if (!this.isValidPage(page)) {
            console.warn('Invalid page:', page);
            return;
        }

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation states
        this.updateNavigationState(page);

        // Update URL and history
        if (updateHistory) {
            const url = page === 'dashboard' ? '/' : `/#${page}`;
            history.pushState({ page }, '', url);
        }

        this.currentPage = page;

        // Load page-specific data
        this.loadPageData(page);

        // Close mobile menu if open
        this.closeMenu();
    }

    updateNavigationState(page) {
        // Update bottom navigation
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Update side navigation
        document.querySelectorAll('.nav-menu .nav-link').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
    }

    loadPageData(page) {
        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'portfolio':
                this.portfolio.loadPortfolio();
                break;
            case 'markets':
                this.markets.loadMarkets();
                break;
            case 'calculator':
                this.calculator.loadCalculators();
                break;
            case 'alerts':
                this.loadAlerts();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    loadDashboard() {
        // Load dashboard data
        this.updatePortfolioSummary();
        this.loadTopHoldings();
        this.loadMarketOverview();
        this.charts.loadPerformanceChart();
        this.charts.loadAllocationChart();
    }

    updatePortfolioSummary() {
        const portfolio = this.portfolio.getPortfolioData();
        const totalValue = portfolio.totalValue || 0;
        const dailyChange = portfolio.dailyChange || 0;
        const totalPL = portfolio.totalPL || 0;
        const totalReturn = portfolio.totalReturn || 0;

        // Update DOM elements
        const totalValueEl = document.getElementById('total-value');
        const dailyChangeEl = document.getElementById('daily-change');
        const totalPLEl = document.getElementById('total-pl');
        const totalReturnEl = document.getElementById('total-return');

        if (totalValueEl) {
            totalValueEl.textContent = this.formatCurrency(totalValue);
        }

        if (dailyChangeEl) {
            dailyChangeEl.textContent = this.formatPercentage(dailyChange);
            dailyChangeEl.className = `change ${dailyChange >= 0 ? 'positive' : 'negative'}`;
        }

        if (totalPLEl) {
            totalPLEl.textContent = this.formatCurrency(totalPL);
            totalPLEl.className = `value ${totalPL >= 0 ? 'text-success' : 'text-danger'}`;
        }

        if (totalReturnEl) {
            totalReturnEl.textContent = this.formatPercentage(totalReturn);
            totalReturnEl.className = `value ${totalReturn >= 0 ? 'text-success' : 'text-danger'}`;
        }
    }

    loadTopHoldings() {
        const holdings = this.portfolio.getTopHoldings(5);
        const container = document.getElementById('top-holdings');
        
        if (!container) return;

        container.innerHTML = holdings.map(holding => `
            <div class="holding-item">
                <div class="holding-info">
                    <div class="holding-symbol">${holding.symbol}</div>
                    <div class="holding-name">${holding.name}</div>
                </div>
                <div class="holding-value">
                    <div class="holding-price">${this.formatCurrency(holding.value)}</div>
                    <div class="holding-change ${holding.change >= 0 ? 'text-success' : 'text-danger'}">
                        ${this.formatPercentage(holding.change)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadMarketOverview() {
        const indices = this.markets.getMarketIndices();
        const container = document.getElementById('market-indices');
        
        if (!container) return;

        container.innerHTML = indices.map(index => `
            <div class="market-index">
                <div class="index-name">${index.name}</div>
                <div class="index-value">
                    <div class="index-price">${this.formatNumber(index.value)}</div>
                    <div class="index-change ${index.change >= 0 ? 'text-success' : 'text-danger'}">
                        ${this.formatPercentage(index.change)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadAlerts() {
        const alerts = this.getAlerts();
        const container = document.getElementById('alerts-list');
        
        if (!container) return;

        if (alerts.length === 0) {
            container.innerHTML = `
                <div class="card text-center">
                    <h3>Nessun Avviso Configurato</h3>
                    <p>Aggiungi avvisi di prezzo per ricevere notifiche quando i tuoi investimenti raggiungono determinati valori.</p>
                    <button class="btn btn-primary" onclick="app.showAddAlertModal()">Aggiungi Primo Avviso</button>
                </div>
            `;
            return;
        }

        container.innerHTML = alerts.map(alert => `
            <div class="alert-item">
                <div class="alert-header">
                    <div class="alert-info">
                        <h4>${alert.symbol}</h4>
                        <div class="alert-condition">${alert.condition}</div>
                    </div>
                    <div class="alert-actions">
                        <button class="btn btn-sm btn-secondary" onclick="app.editAlert('${alert.id}')">
                            Modifica
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteAlert('${alert.id}')">
                            Elimina
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Modal methods
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    handleAddPosition() {
        const form = document.getElementById('add-position-form');
        const formData = new FormData(form);
        
        const position = {
            symbol: document.getElementById('position-symbol').value,
            type: document.getElementById('position-type').value,
            quantity: parseFloat(document.getElementById('position-quantity').value),
            price: parseFloat(document.getElementById('position-price').value),
            date: document.getElementById('position-date').value
        };

        if (this.validatePosition(position)) {
            this.portfolio.addPosition(position);
            this.hideAllModals();
            form.reset();
            this.showNotification('Posizione aggiunta con successo!', 'success');
            
            // Refresh dashboard if we're on it
            if (this.currentPage === 'dashboard') {
                this.loadDashboard();
            }
        }
    }

    validatePosition(position) {
        if (!position.symbol || position.symbol.trim() === '') {
            this.showNotification('Inserisci un simbolo valido', 'error');
            return false;
        }
        
        if (!position.type) {
            this.showNotification('Seleziona il tipo di asset', 'error');
            return false;
        }
        
        if (!position.quantity || position.quantity <= 0) {
            this.showNotification('Inserisci una quantità valida', 'error');
            return false;
        }
        
        if (!position.price || position.price <= 0) {
            this.showNotification('Inserisci un prezzo valido', 'error');
            return false;
        }
        
        if (!position.date) {
            this.showNotification('Inserisci una data valida', 'error');
            return false;
        }
        
        return true;
    }

    // Theme and settings methods
    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.setupTheme();
    }

    setBaseCurrency(currency) {
        this.baseCurrency = currency;
        localStorage.setItem('baseCurrency', currency);
        this.showNotification(`Valuta di base cambiata in ${currency}`, 'info');
        
        // Refresh current page data
        this.loadPageData(this.currentPage);
    }

    // Notification methods
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    getNotificationPermission() {
        return Notification.permission === 'granted';
    }

    async handleNotificationToggle(enabled) {
        if (enabled) {
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    this.showNotification('Permesso notifiche negato', 'error');
                    document.getElementById('push-notifications').checked = false;
                    return;
                }
            }
            
            this.enablePushNotifications();
        } else {
            this.disablePushNotifications();
        }
    }

    enablePushNotifications() {
        // Implementation for enabling push notifications
        console.log('Push notifications enabled');
        this.showNotification('Notifiche push abilitate', 'success');
    }

    disablePushNotifications() {
        // Implementation for disabling push notifications
        console.log('Push notifications disabled');
        this.showNotification('Notifiche push disabilitate', 'info');
    }

    // Data management methods
    exportData() {
        const data = {
            portfolio: this.portfolio.getPortfolioData(),
            settings: {
                theme: this.theme,
                baseCurrency: this.baseCurrency
            },
            alerts: this.getAlerts(),
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Dati esportati con successo', 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.restoreData(data);
                    this.showNotification('Dati importati con successo', 'success');
                } catch (error) {
                    this.showNotification('Errore nell\'importazione dei dati', 'error');
                    console.error('Import error:', error);
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    restoreData(data) {
        if (data.portfolio) {
            this.portfolio.setPortfolioData(data.portfolio);
        }
        
        if (data.settings) {
            if (data.settings.theme) this.setTheme(data.settings.theme);
            if (data.settings.baseCurrency) this.setBaseCurrency(data.settings.baseCurrency);
        }
        
        if (data.alerts) {
            this.setAlerts(data.alerts);
        }
        
        // Refresh current page
        this.loadPageData(this.currentPage);
    }

    resetData() {
        if (confirm('Sei sicuro di voler cancellare tutti i dati? Questa azione non può essere annullata.')) {
            localStorage.clear();
            this.portfolio.clearPortfolio();
            this.clearAlerts();
            this.showNotification('Tutti i dati sono stati cancellati', 'info');
            
            // Reload app
            window.location.reload();
        }
    }

    // Offline handling
    updateOfflineStatus() {
        const offlineIndicator = document.getElementById('offline-indicator');
        if (this.isOffline) {
            if (!offlineIndicator) {
                const indicator = document.createElement('div');
                indicator.id = 'offline-indicator';
                indicator.className = 'offline-indicator';
                indicator.textContent = 'Modalità Offline';
                document.body.appendChild(indicator);
            }
        } else {
            if (offlineIndicator) {
                offlineIndicator.remove();
            }
        }
    }

    handleOnlineStatus() {
        this.updateOfflineStatus();
        this.showNotification('Connessione ripristinata', 'success');
        
        // Sync offline data
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('portfolio-sync');
            });
        }
    }

    handleOfflineStatus() {
        this.updateOfflineStatus();
        this.showNotification('Modalità offline attiva', 'warning');
    }

    showUpdateAvailable() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'update-banner';
        updateBanner.innerHTML = `
            <span>Nuovo aggiornamento disponibile!</span>
            <button onclick="window.location.reload()">Aggiorna</button>
        `;
        document.body.appendChild(updateBanner);
    }

    // Utility methods
    isValidPage(page) {
        const validPages = ['dashboard', 'portfolio', 'markets', 'calculator', 'alerts', 'settings'];
        return validPages.includes(page);
    }

    toggleMenu() {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.style.display = navMenu.style.display === 'block' ? 'none' : 'block';
        }
    }

    closeMenu() {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.style.display = 'none';
        }
    }

    formatCurrency(value, currency = null) {
        const curr = currency || this.baseCurrency;
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: curr,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    formatPercentage(value) {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    }

    formatNumber(value) {
        return new Intl.NumberFormat('it-IT').format(value);
    }

    // Placeholder methods for alerts (to be implemented)
    getAlerts() {
        return JSON.parse(localStorage.getItem('alerts') || '[]');
    }

    setAlerts(alerts) {
        localStorage.setItem('alerts', JSON.stringify(alerts));
    }

    clearAlerts() {
        localStorage.removeItem('alerts');
    }

    showAddAlertModal() {
        // Implementation for showing add alert modal
        console.log('Show add alert modal');
    }

    editAlert(alertId) {
        // Implementation for editing alert
        console.log('Edit alert:', alertId);
    }

    deleteAlert(alertId) {
        // Implementation for deleting alert
        const alerts = this.getAlerts().filter(alert => alert.id !== alertId);
        this.setAlerts(alerts);
        this.loadAlerts();
        this.showNotification('Avviso eliminato', 'info');
    }

    loadSettings() {
        // Load and display current settings
        console.log('Loading settings page');
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PortfolioApp();
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    if (app) {
        app.showNotification('Si è verificato un errore', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    if (app) {
        app.showNotification('Errore di connessione', 'error');
    }
});