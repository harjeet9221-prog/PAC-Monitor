// Markets Management Module
class MarketsManager {
    constructor() {
        this.currentMarket = 'indices';
        this.marketData = {
            indices: [],
            stocks: [],
            crypto: [],
            forex: []
        };
        
        this.initializeMarketData();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Market tabs
        const marketTabs = document.querySelectorAll('.market-tabs .tab-btn');
        marketTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const market = e.target.dataset.market;
                this.switchMarket(market);
            });
        });
    }

    initializeMarketData() {
        // Initialize with sample market data
        this.marketData = {
            indices: [
                {
                    id: 'ftse-mib',
                    name: 'FTSE MIB',
                    symbol: 'FTSEMIB.MI',
                    value: 28450.23,
                    change: 1.25,
                    changePercent: 0.044,
                    currency: 'EUR',
                    country: 'Italy'
                },
                {
                    id: 'dax',
                    name: 'DAX',
                    symbol: 'DAX',
                    value: 16234.87,
                    change: -45.32,
                    changePercent: -0.278,
                    currency: 'EUR',
                    country: 'Germany'
                },
                {
                    id: 'sp500',
                    name: 'S&P 500',
                    symbol: 'SPX',
                    value: 4567.12,
                    change: 23.45,
                    changePercent: 0.516,
                    currency: 'USD',
                    country: 'USA'
                },
                {
                    id: 'nasdaq',
                    name: 'NASDAQ',
                    symbol: 'IXIC',
                    value: 14234.56,
                    change: 89.23,
                    changePercent: 0.631,
                    currency: 'USD',
                    country: 'USA'
                },
                {
                    id: 'nikkei',
                    name: 'Nikkei 225',
                    symbol: 'N225',
                    value: 33456.78,
                    change: -123.45,
                    changePercent: -0.367,
                    currency: 'JPY',
                    country: 'Japan'
                }
            ],
            stocks: [
                {
                    id: 'aapl',
                    name: 'Apple Inc.',
                    symbol: 'AAPL',
                    price: 185.25,
                    change: 2.45,
                    changePercent: 1.34,
                    volume: 45234567,
                    marketCap: 2890000000000,
                    currency: 'USD',
                    exchange: 'NASDAQ'
                },
                {
                    id: 'msft',
                    name: 'Microsoft Corporation',
                    symbol: 'MSFT',
                    price: 342.87,
                    change: -1.23,
                    changePercent: -0.36,
                    volume: 23456789,
                    marketCap: 2540000000000,
                    currency: 'USD',
                    exchange: 'NASDAQ'
                },
                {
                    id: 'googl',
                    name: 'Alphabet Inc.',
                    symbol: 'GOOGL',
                    price: 132.45,
                    change: 3.21,
                    changePercent: 2.48,
                    volume: 34567890,
                    marketCap: 1650000000000,
                    currency: 'USD',
                    exchange: 'NASDAQ'
                },
                {
                    id: 'tsla',
                    name: 'Tesla, Inc.',
                    symbol: 'TSLA',
                    price: 234.56,
                    change: -5.67,
                    changePercent: -2.36,
                    volume: 67890123,
                    marketCap: 745000000000,
                    currency: 'USD',
                    exchange: 'NASDAQ'
                },
                {
                    id: 'asml',
                    name: 'ASML Holding N.V.',
                    symbol: 'ASML.AS',
                    price: 678.90,
                    change: 12.34,
                    changePercent: 1.85,
                    volume: 1234567,
                    marketCap: 278000000000,
                    currency: 'EUR',
                    exchange: 'Euronext Amsterdam'
                }
            ],
            crypto: [
                {
                    id: 'bitcoin',
                    name: 'Bitcoin',
                    symbol: 'BTC',
                    price: 45234.56,
                    change: 1234.78,
                    changePercent: 2.81,
                    volume24h: 28500000000,
                    marketCap: 885000000000,
                    currency: 'USD',
                    rank: 1
                },
                {
                    id: 'ethereum',
                    name: 'Ethereum',
                    symbol: 'ETH',
                    price: 2456.78,
                    change: -89.23,
                    changePercent: -3.51,
                    volume24h: 15600000000,
                    marketCap: 295000000000,
                    currency: 'USD',
                    rank: 2
                },
                {
                    id: 'cardano',
                    name: 'Cardano',
                    symbol: 'ADA',
                    price: 0.52,
                    change: 0.023,
                    changePercent: 4.62,
                    volume24h: 456000000,
                    marketCap: 18200000000,
                    currency: 'USD',
                    rank: 8
                },
                {
                    id: 'solana',
                    name: 'Solana',
                    symbol: 'SOL',
                    price: 98.45,
                    change: -2.34,
                    changePercent: -2.32,
                    volume24h: 2100000000,
                    marketCap: 42800000000,
                    currency: 'USD',
                    rank: 5
                }
            ],
            forex: [
                {
                    id: 'eurusd',
                    name: 'EUR/USD',
                    symbol: 'EURUSD',
                    price: 1.0856,
                    change: 0.0023,
                    changePercent: 0.21,
                    bid: 1.0854,
                    ask: 1.0858,
                    spread: 0.0004
                },
                {
                    id: 'gbpusd',
                    name: 'GBP/USD',
                    symbol: 'GBPUSD',
                    price: 1.2634,
                    change: -0.0045,
                    changePercent: -0.36,
                    bid: 1.2632,
                    ask: 1.2636,
                    spread: 0.0004
                },
                {
                    id: 'usdjpy',
                    name: 'USD/JPY',
                    symbol: 'USDJPY',
                    price: 149.23,
                    change: 0.78,
                    changePercent: 0.52,
                    bid: 149.21,
                    ask: 149.25,
                    spread: 0.04
                },
                {
                    id: 'usdchf',
                    name: 'USD/CHF',
                    symbol: 'USDCHF',
                    price: 0.8934,
                    change: -0.0012,
                    changePercent: -0.13,
                    bid: 0.8932,
                    ask: 0.8936,
                    spread: 0.0004
                }
            ]
        };

        console.log('Market data initialized');
    }

    loadMarkets() {
        this.renderMarketContent(this.currentMarket);
    }

    switchMarket(market) {
        this.currentMarket = market;
        
        // Update tab states
        document.querySelectorAll('.market-tabs .tab-btn').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.market === market);
        });

        this.renderMarketContent(market);
    }

    renderMarketContent(market) {
        const container = document.getElementById('markets-content');
        if (!container) return;

        const data = this.marketData[market] || [];
        
        if (data.length === 0) {
            container.innerHTML = `
                <div class="card text-center">
                    <h3>Dati non disponibili</h3>
                    <p>I dati di mercato per ${market} non sono attualmente disponibili.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(item => this.renderMarketItem(item, market)).join('');
    }

    renderMarketItem(item, market) {
        const isPositive = item.change >= 0 || item.changePercent >= 0;
        const changeClass = isPositive ? 'text-success' : 'text-danger';
        
        switch (market) {
            case 'indices':
                return this.renderIndexItem(item, changeClass);
            case 'stocks':
                return this.renderStockItem(item, changeClass);
            case 'crypto':
                return this.renderCryptoItem(item, changeClass);
            case 'forex':
                return this.renderForexItem(item, changeClass);
            default:
                return '';
        }
    }

    renderIndexItem(index, changeClass) {
        return `
            <div class="market-item">
                <div class="market-item-info">
                    <h4>${index.name}</h4>
                    <div class="market-item-symbol">${index.symbol} • ${index.country}</div>
                </div>
                <div class="market-item-price">
                    <div class="market-price">${this.formatNumber(index.value)}</div>
                    <div class="market-change ${changeClass}">
                        ${this.formatChange(index.change)} (${this.formatPercentage(index.changePercent)})
                    </div>
                </div>
            </div>
        `;
    }

    renderStockItem(stock, changeClass) {
        return `
            <div class="market-item">
                <div class="market-item-info">
                    <h4>${stock.name}</h4>
                    <div class="market-item-symbol">
                        ${stock.symbol} • ${stock.exchange}
                    </div>
                    <div class="market-item-details">
                        <small class="text-secondary">
                            Volume: ${this.formatVolume(stock.volume)} • 
                            Market Cap: ${this.formatMarketCap(stock.marketCap)}
                        </small>
                    </div>
                </div>
                <div class="market-item-price">
                    <div class="market-price">${this.formatCurrency(stock.price, stock.currency)}</div>
                    <div class="market-change ${changeClass}">
                        ${this.formatChange(stock.change)} (${this.formatPercentage(stock.changePercent)})
                    </div>
                </div>
            </div>
        `;
    }

    renderCryptoItem(crypto, changeClass) {
        return `
            <div class="market-item">
                <div class="market-item-info">
                    <h4>${crypto.name}</h4>
                    <div class="market-item-symbol">
                        ${crypto.symbol} • Rank #${crypto.rank}
                    </div>
                    <div class="market-item-details">
                        <small class="text-secondary">
                            24h Volume: ${this.formatVolume(crypto.volume24h)} • 
                            Market Cap: ${this.formatMarketCap(crypto.marketCap)}
                        </small>
                    </div>
                </div>
                <div class="market-item-price">
                    <div class="market-price">${this.formatCurrency(crypto.price, crypto.currency)}</div>
                    <div class="market-change ${changeClass}">
                        ${this.formatChange(crypto.change)} (${this.formatPercentage(crypto.changePercent)})
                    </div>
                </div>
            </div>
        `;
    }

    renderForexItem(forex, changeClass) {
        return `
            <div class="market-item">
                <div class="market-item-info">
                    <h4>${forex.name}</h4>
                    <div class="market-item-symbol">${forex.symbol}</div>
                    <div class="market-item-details">
                        <small class="text-secondary">
                            Bid: ${forex.bid.toFixed(4)} • 
                            Ask: ${forex.ask.toFixed(4)} • 
                            Spread: ${forex.spread.toFixed(4)}
                        </small>
                    </div>
                </div>
                <div class="market-item-price">
                    <div class="market-price">${forex.price.toFixed(4)}</div>
                    <div class="market-change ${changeClass}">
                        ${this.formatChange(forex.change, 4)} (${this.formatPercentage(forex.changePercent)})
                    </div>
                </div>
            </div>
        `;
    }

    getMarketIndices() {
        return this.marketData.indices.slice(0, 5).map(index => ({
            name: index.name,
            value: index.value,
            change: index.changePercent
        }));
    }

    async updateMarketData() {
        console.log('Updating market data...');
        
        try {
            // Simulate market data updates
            Object.keys(this.marketData).forEach(market => {
                this.marketData[market].forEach(item => {
                    this.simulatePriceUpdate(item, market);
                });
            });

            // Refresh UI if on markets page
            if (app?.currentPage === 'markets') {
                this.renderMarketContent(this.currentMarket);
            }

            // Update dashboard market overview
            if (app?.currentPage === 'dashboard') {
                app.loadMarketOverview();
            }

            console.log('Market data updated');
        } catch (error) {
            console.error('Error updating market data:', error);
        }
    }

    simulatePriceUpdate(item, market) {
        const volatility = this.getVolatilityForMarket(market);
        const changePercent = (Math.random() - 0.5) * 2 * volatility;
        
        if (market === 'forex') {
            const newPrice = item.price * (1 + changePercent / 100);
            const change = newPrice - item.price;
            
            item.price = newPrice;
            item.change = change;
            item.changePercent = changePercent;
            item.bid = newPrice - (item.spread / 2);
            item.ask = newPrice + (item.spread / 2);
        } else {
            const basePrice = market === 'indices' ? item.value : item.price;
            const newPrice = basePrice * (1 + changePercent / 100);
            const change = newPrice - basePrice;
            
            if (market === 'indices') {
                item.value = newPrice;
            } else {
                item.price = newPrice;
            }
            
            item.change = change;
            item.changePercent = changePercent;
        }
    }

    getVolatilityForMarket(market) {
        const volatilities = {
            indices: 0.02,    // 2%
            stocks: 0.03,     // 3%
            crypto: 0.08,     // 8%
            forex: 0.005      // 0.5%
        };
        return volatilities[market] || 0.02;
    }

    searchMarketData(query) {
        const results = [];
        const searchQuery = query.toLowerCase();

        Object.keys(this.marketData).forEach(market => {
            this.marketData[market].forEach(item => {
                const name = item.name.toLowerCase();
                const symbol = item.symbol.toLowerCase();
                
                if (name.includes(searchQuery) || symbol.includes(searchQuery)) {
                    results.push({
                        ...item,
                        market: market
                    });
                }
            });
        });

        return results;
    }

    getTopMovers(market = 'stocks', count = 5) {
        const data = this.marketData[market] || [];
        return data
            .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
            .slice(0, count);
    }

    getTopGainers(market = 'stocks', count = 5) {
        const data = this.marketData[market] || [];
        return data
            .filter(item => item.changePercent > 0)
            .sort((a, b) => b.changePercent - a.changePercent)
            .slice(0, count);
    }

    getTopLosers(market = 'stocks', count = 5) {
        const data = this.marketData[market] || [];
        return data
            .filter(item => item.changePercent < 0)
            .sort((a, b) => a.changePercent - b.changePercent)
            .slice(0, count);
    }

    // Utility methods
    formatNumber(value) {
        return new Intl.NumberFormat('it-IT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    formatCurrency(value, currency = 'EUR') {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: currency === 'USD' && value > 1000 ? 0 : 2
        }).format(value);
    }

    formatPercentage(value) {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    }

    formatChange(value, decimals = 2) {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(decimals)}`;
    }

    formatVolume(value) {
        if (value >= 1e9) {
            return `${(value / 1e9).toFixed(1)}B`;
        } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(1)}M`;
        } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(1)}K`;
        }
        return value.toString();
    }

    formatMarketCap(value) {
        if (value >= 1e12) {
            return `${(value / 1e12).toFixed(1)}T`;
        } else if (value >= 1e9) {
            return `${(value / 1e9).toFixed(1)}B`;
        } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(1)}M`;
        }
        return value.toString();
    }

    // Export market data
    exportMarketData() {
        const data = {
            marketData: this.marketData,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `market-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Create global markets instance
const markets = new MarketsManager();

// Auto-update market data every 30 seconds
setInterval(() => {
    if (!app?.isOffline) {
        markets.updateMarketData();
    }
}, 30 * 1000);