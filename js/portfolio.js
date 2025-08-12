// Portfolio Management Module
class PortfolioManager {
    constructor() {
        this.positions = [];
        this.portfolioData = {
            totalValue: 0,
            totalPL: 0,
            totalReturn: 0,
            dailyChange: 0,
            positions: []
        };
        
        this.loadFromStorage();
        this.setupEventListeners();
    }

    loadFromStorage() {
        const stored = localStorage.getItem('portfolio');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.positions = data.positions || [];
                this.portfolioData = { ...this.portfolioData, ...data };
                console.log('Portfolio loaded from storage:', this.positions.length, 'positions');
            } catch (error) {
                console.error('Error loading portfolio from storage:', error);
                this.initializeWithSampleData();
            }
        } else {
            this.initializeWithSampleData();
        }
    }

    saveToStorage() {
        try {
            const data = {
                ...this.portfolioData,
                positions: this.positions,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('portfolio', JSON.stringify(data));
            console.log('Portfolio saved to storage');
        } catch (error) {
            console.error('Error saving portfolio to storage:', error);
        }
    }

    setupEventListeners() {
        // Asset filter
        const assetFilter = document.getElementById('asset-filter');
        if (assetFilter) {
            assetFilter.addEventListener('change', (e) => {
                this.filterPositions(e.target.value);
            });
        }
    }

    initializeWithSampleData() {
        // Initialize with sample data for demonstration
        this.positions = [
            {
                id: this.generateId(),
                symbol: 'VWCE.DE',
                name: 'Vanguard FTSE All-World UCITS ETF',
                type: 'etf',
                quantity: 10.5,
                purchasePrice: 95.20,
                currentPrice: 98.75,
                purchaseDate: '2024-01-15',
                currency: 'EUR',
                exchange: 'XETRA'
            },
            {
                id: this.generateId(),
                symbol: 'AAPL',
                name: 'Apple Inc.',
                type: 'stock',
                quantity: 5,
                purchasePrice: 180.50,
                currentPrice: 185.25,
                purchaseDate: '2024-02-10',
                currency: 'USD',
                exchange: 'NASDAQ'
            },
            {
                id: this.generateId(),
                symbol: 'BTC-EUR',
                name: 'Bitcoin',
                type: 'crypto',
                quantity: 0.025,
                purchasePrice: 42000,
                currentPrice: 45500,
                purchaseDate: '2024-01-20',
                currency: 'EUR',
                exchange: 'Coinbase'
            }
        ];
        
        this.calculatePortfolioMetrics();
        this.saveToStorage();
        console.log('Portfolio initialized with sample data');
    }

    addPosition(positionData) {
        const position = {
            id: this.generateId(),
            symbol: positionData.symbol.toUpperCase(),
            name: positionData.name || positionData.symbol,
            type: positionData.type,
            quantity: positionData.quantity,
            purchasePrice: positionData.price,
            currentPrice: positionData.price, // Will be updated with real data
            purchaseDate: positionData.date,
            currency: positionData.currency || 'EUR',
            exchange: positionData.exchange || 'Unknown',
            addedDate: new Date().toISOString()
        };

        this.positions.push(position);
        this.calculatePortfolioMetrics();
        this.saveToStorage();
        
        // Fetch current price if possible
        this.updatePositionPrice(position.id);
        
        console.log('Position added:', position);
        return position;
    }

    updatePosition(positionId, updates) {
        const index = this.positions.findIndex(p => p.id === positionId);
        if (index !== -1) {
            this.positions[index] = { ...this.positions[index], ...updates };
            this.calculatePortfolioMetrics();
            this.saveToStorage();
            console.log('Position updated:', positionId);
            return this.positions[index];
        }
        return null;
    }

    removePosition(positionId) {
        const index = this.positions.findIndex(p => p.id === positionId);
        if (index !== -1) {
            const removed = this.positions.splice(index, 1)[0];
            this.calculatePortfolioMetrics();
            this.saveToStorage();
            console.log('Position removed:', removed.symbol);
            return removed;
        }
        return null;
    }

    getPosition(positionId) {
        return this.positions.find(p => p.id === positionId);
    }

    getAllPositions() {
        return [...this.positions];
    }

    getPositionsByType(type) {
        return this.positions.filter(p => p.type === type);
    }

    calculatePortfolioMetrics() {
        let totalValue = 0;
        let totalCost = 0;
        let totalPL = 0;
        
        this.positions.forEach(position => {
            const currentValue = position.quantity * position.currentPrice;
            const costBasis = position.quantity * position.purchasePrice;
            const positionPL = currentValue - costBasis;
            
            totalValue += currentValue;
            totalCost += costBasis;
            totalPL += positionPL;
            
            // Update position metrics
            position.currentValue = currentValue;
            position.costBasis = costBasis;
            position.unrealizedPL = positionPL;
            position.unrealizedPLPercent = costBasis > 0 ? (positionPL / costBasis) * 100 : 0;
        });

        const totalReturn = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;
        
        // Simulate daily change (in a real app, this would come from market data)
        const dailyChange = this.calculateDailyChange();

        this.portfolioData = {
            ...this.portfolioData,
            totalValue,
            totalCost,
            totalPL,
            totalReturn,
            dailyChange,
            positions: this.positions.length,
            lastCalculated: new Date().toISOString()
        };

        console.log('Portfolio metrics calculated:', {
            totalValue: totalValue.toFixed(2),
            totalPL: totalPL.toFixed(2),
            totalReturn: totalReturn.toFixed(2) + '%'
        });
    }

    calculateDailyChange() {
        // Simulate daily change calculation
        // In a real app, this would compare current prices with previous day's closing prices
        const changeRange = 0.05; // ±5% max daily change
        return (Math.random() - 0.5) * 2 * changeRange * 100;
    }

    getPortfolioData() {
        return { ...this.portfolioData };
    }

    setPortfolioData(data) {
        this.portfolioData = { ...this.portfolioData, ...data };
        if (data.positions) {
            this.positions = data.positions;
        }
        this.saveToStorage();
    }

    getTopHoldings(limit = 5) {
        return this.positions
            .map(position => ({
                symbol: position.symbol,
                name: position.name,
                value: position.currentValue || 0,
                change: position.unrealizedPLPercent || 0,
                weight: this.portfolioData.totalValue > 0 ? 
                    (position.currentValue / this.portfolioData.totalValue) * 100 : 0
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, limit);
    }

    getAssetAllocation() {
        const allocation = {};
        
        this.positions.forEach(position => {
            const type = this.getAssetTypeLabel(position.type);
            if (!allocation[type]) {
                allocation[type] = {
                    value: 0,
                    percentage: 0,
                    count: 0
                };
            }
            
            allocation[type].value += position.currentValue || 0;
            allocation[type].count += 1;
        });

        // Calculate percentages
        Object.keys(allocation).forEach(type => {
            allocation[type].percentage = this.portfolioData.totalValue > 0 ? 
                (allocation[type].value / this.portfolioData.totalValue) * 100 : 0;
        });

        return allocation;
    }

    getAssetTypeLabel(type) {
        const labels = {
            'stock': 'Azioni',
            'etf': 'ETF',
            'bond': 'Obbligazioni',
            'crypto': 'Criptovalute',
            'commodity': 'Materie Prime',
            'reit': 'REIT'
        };
        return labels[type] || 'Altro';
    }

    getPerformanceHistory(days = 30) {
        // Simulate performance history
        // In a real app, this would come from stored historical data
        const history = [];
        const startValue = this.portfolioData.totalValue * 0.95; // Start 5% lower
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Simulate some volatility
            const volatility = 0.02; // 2% daily volatility
            const randomChange = (Math.random() - 0.5) * volatility;
            const trend = 0.0003; // Slight upward trend
            
            const dayValue = i === 0 ? 
                this.portfolioData.totalValue : 
                startValue * (1 + (days - i) * trend + randomChange);
            
            history.push({
                date: date.toISOString().split('T')[0],
                value: Math.max(dayValue, 0),
                change: i === days ? 0 : ((dayValue - history[history.length - 1]?.value) / history[history.length - 1]?.value) * 100
            });
        }
        
        return history;
    }

    loadPortfolio() {
        this.renderPortfolioList();
    }

    renderPortfolioList(filter = 'all') {
        const container = document.getElementById('portfolio-list');
        if (!container) return;

        let positions = this.positions;
        
        if (filter !== 'all') {
            positions = this.positions.filter(p => {
                if (filter === 'stocks') return p.type === 'stock';
                if (filter === 'etf') return p.type === 'etf';
                if (filter === 'bonds') return p.type === 'bond';
                if (filter === 'crypto') return p.type === 'crypto';
                return true;
            });
        }

        if (positions.length === 0) {
            container.innerHTML = `
                <div class="card text-center">
                    <h3>Nessuna Posizione</h3>
                    <p>Inizia aggiungendo la tua prima posizione al portafoglio.</p>
                    <button class="btn btn-primary" onclick="app.showModal('add-position-modal')">
                        Aggiungi Prima Posizione
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = positions.map(position => this.renderPositionCard(position)).join('');
    }

    renderPositionCard(position) {
        const currentValue = position.currentValue || 0;
        const unrealizedPL = position.unrealizedPL || 0;
        const unrealizedPLPercent = position.unrealizedPLPercent || 0;
        const isPositive = unrealizedPL >= 0;

        return `
            <div class="portfolio-item">
                <div class="portfolio-item-header">
                    <div class="portfolio-item-info">
                        <h4>${position.symbol}</h4>
                        <div class="portfolio-item-type">${this.getAssetTypeLabel(position.type)}</div>
                        <div class="portfolio-item-name">${position.name}</div>
                    </div>
                    <div class="portfolio-item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="portfolio.editPosition('${position.id}')">
                            Modifica
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="portfolio.confirmRemovePosition('${position.id}')">
                            Rimuovi
                        </button>
                    </div>
                </div>
                
                <div class="portfolio-item-stats">
                    <div class="stat">
                        <div class="stat-label">Quantità</div>
                        <div class="stat-value">${this.formatQuantity(position.quantity)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Prezzo Acquisto</div>
                        <div class="stat-value">${this.formatCurrency(position.purchasePrice)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Prezzo Corrente</div>
                        <div class="stat-value">${this.formatCurrency(position.currentPrice)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Valore Corrente</div>
                        <div class="stat-value">${this.formatCurrency(currentValue)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">P&L Non Realizzato</div>
                        <div class="stat-value ${isPositive ? 'text-success' : 'text-danger'}">
                            ${this.formatCurrency(unrealizedPL)}
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Rendimento</div>
                        <div class="stat-value ${isPositive ? 'text-success' : 'text-danger'}">
                            ${this.formatPercentage(unrealizedPLPercent)}
                        </div>
                    </div>
                </div>
                
                <div class="portfolio-item-details">
                    <small class="text-secondary">
                        Acquistato il ${this.formatDate(position.purchaseDate)} • 
                        ${position.exchange || 'Exchange sconosciuto'}
                    </small>
                </div>
            </div>
        `;
    }

    filterPositions(filter) {
        this.renderPortfolioList(filter);
    }

    editPosition(positionId) {
        const position = this.getPosition(positionId);
        if (!position) return;

        // Pre-fill the add position form with current values
        document.getElementById('position-symbol').value = position.symbol;
        document.getElementById('position-type').value = position.type;
        document.getElementById('position-quantity').value = position.quantity;
        document.getElementById('position-price').value = position.purchasePrice;
        document.getElementById('position-date').value = position.purchaseDate;

        // Change form behavior to edit mode
        const form = document.getElementById('add-position-form');
        form.dataset.editMode = 'true';
        form.dataset.positionId = positionId;

        // Update modal title
        document.querySelector('#add-position-modal .modal-header h3').textContent = 'Modifica Posizione';
        document.querySelector('#add-position-form button[type="submit"]').textContent = 'Aggiorna Posizione';

        app.showModal('add-position-modal');
    }

    confirmRemovePosition(positionId) {
        const position = this.getPosition(positionId);
        if (!position) return;

        if (confirm(`Sei sicuro di voler rimuovere ${position.symbol} dal portafoglio?`)) {
            this.removePosition(positionId);
            this.renderPortfolioList();
            app.showNotification(`${position.symbol} rimosso dal portafoglio`, 'info');
            
            // Update dashboard if we're on it
            if (app.currentPage === 'dashboard') {
                app.loadDashboard();
            }
        }
    }

    async updatePositionPrice(positionId) {
        // In a real app, this would fetch current prices from a financial API
        // For demo purposes, we'll simulate price updates
        const position = this.getPosition(positionId);
        if (!position) return;

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate price change (±5% from purchase price)
            const changePercent = (Math.random() - 0.5) * 0.1; // ±5%
            const newPrice = position.purchasePrice * (1 + changePercent);
            
            this.updatePosition(positionId, { currentPrice: newPrice });
            console.log(`Updated price for ${position.symbol}: ${newPrice.toFixed(2)}`);
            
        } catch (error) {
            console.error('Error updating position price:', error);
        }
    }

    async updateAllPrices() {
        console.log('Updating all position prices...');
        const updatePromises = this.positions.map(position => 
            this.updatePositionPrice(position.id)
        );
        
        try {
            await Promise.all(updatePromises);
            this.calculatePortfolioMetrics();
            this.saveToStorage();
            
            // Refresh UI if on portfolio or dashboard page
            if (app.currentPage === 'portfolio') {
                this.renderPortfolioList();
            } else if (app.currentPage === 'dashboard') {
                app.loadDashboard();
            }
            
            app.showNotification('Prezzi aggiornati', 'success');
        } catch (error) {
            console.error('Error updating prices:', error);
            app.showNotification('Errore nell\'aggiornamento dei prezzi', 'error');
        }
    }

    clearPortfolio() {
        this.positions = [];
        this.portfolioData = {
            totalValue: 0,
            totalPL: 0,
            totalReturn: 0,
            dailyChange: 0,
            positions: []
        };
        this.saveToStorage();
    }

    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatCurrency(value, currency = 'EUR') {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    formatPercentage(value) {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    }

    formatQuantity(value) {
        return new Intl.NumberFormat('it-IT', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 6
        }).format(value);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('it-IT');
    }

    // Export/Import methods
    exportPortfolio() {
        const data = {
            portfolio: this.getPortfolioData(),
            positions: this.getAllPositions(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importPortfolio(data) {
        if (data.positions && Array.isArray(data.positions)) {
            this.positions = data.positions;
            this.calculatePortfolioMetrics();
            this.saveToStorage();
            this.renderPortfolioList();
            return true;
        }
        return false;
    }
}

// Create global portfolio instance
const portfolio = new PortfolioManager();

// Auto-update prices every 5 minutes
setInterval(() => {
    if (!app?.isOffline) {
        portfolio.updateAllPrices();
    }
}, 5 * 60 * 1000);