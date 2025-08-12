// Charts Management Module
class ChartsManager {
    constructor() {
        this.charts = {};
        this.chartColors = {
            primary: '#2563eb',
            success: '#10b981',
            danger: '#ef4444',
            warning: '#f59e0b',
            info: '#06b6d4',
            purple: '#8b5cf6',
            pink: '#ec4899',
            orange: '#f97316',
            teal: '#14b8a6',
            indigo: '#6366f1'
        };
        
        this.setupChartDefaults();
    }

    setupChartDefaults() {
        if (typeof Chart !== 'undefined') {
            Chart.defaults.font.family = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            Chart.defaults.font.size = 12;
            Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') || '#64748b';
            Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-light') || '#f1f5f9';
            Chart.defaults.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-card') || '#ffffff';
        }
    }

    loadPerformanceChart() {
        const canvas = document.getElementById('performance-chart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (this.charts.performance) {
            this.charts.performance.destroy();
        }

        const ctx = canvas.getContext('2d');
        const performanceData = this.getPerformanceData();

        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: performanceData.labels,
                datasets: [{
                    label: 'Valore Portafoglio',
                    data: performanceData.values,
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.hexToRgba(this.chartColors.primary, 0.1),
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: this.chartColors.primary,
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.chartColors.primary,
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                            title: (tooltipItems) => {
                                return this.formatDate(tooltipItems[0].label);
                            },
                            label: (context) => {
                                return `Valore: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 6,
                            callback: function(value, index, values) {
                                const date = new Date(this.getLabelForValue(value));
                                return date.toLocaleDateString('it-IT', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                });
                            }
                        }
                    },
                    y: {
                        display: true,
                        position: 'right',
                        grid: {
                            color: this.hexToRgba(this.chartColors.primary, 0.1)
                        },
                        ticks: {
                            callback: (value) => {
                                return this.formatCurrency(value, false);
                            }
                        }
                    }
                }
            }
        });
    }

    loadAllocationChart() {
        const canvas = document.getElementById('allocation-chart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (this.charts.allocation) {
            this.charts.allocation.destroy();
        }

        const ctx = canvas.getContext('2d');
        const allocationData = this.getAllocationData();

        this.charts.allocation = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: allocationData.labels,
                datasets: [{
                    data: allocationData.values,
                    backgroundColor: allocationData.colors,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 15,
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, index) => ({
                                    text: `${label}: ${allocationData.percentages[index]}%`,
                                    fillStyle: data.datasets[0].backgroundColor[index],
                                    strokeStyle: data.datasets[0].backgroundColor[index],
                                    lineWidth: 0,
                                    pointStyle: 'circle',
                                    hidden: false,
                                    index: index
                                }));
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.chartColors.primary,
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                const percentage = allocationData.percentages[context.dataIndex];
                                return `${label}: ${this.formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }

    loadHoldingsChart(containerId = 'holdings-chart') {
        const canvas = document.getElementById(containerId);
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (this.charts.holdings) {
            this.charts.holdings.destroy();
        }

        const ctx = canvas.getContext('2d');
        const holdingsData = this.getTopHoldingsData();

        this.charts.holdings = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: holdingsData.labels,
                datasets: [{
                    label: 'Valore Posizione',
                    data: holdingsData.values,
                    backgroundColor: holdingsData.colors,
                    borderColor: holdingsData.colors,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.chartColors.primary,
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.x;
                                const percentage = holdingsData.percentages[context.dataIndex];
                                return `Valore: ${this.formatCurrency(value)} (${percentage}% del portafoglio)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            color: this.hexToRgba(this.chartColors.primary, 0.1)
                        },
                        ticks: {
                            callback: (value) => {
                                return this.formatCurrency(value, false);
                            }
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    loadMarketTrendChart(containerId = 'market-trend-chart') {
        const canvas = document.getElementById(containerId);
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (this.charts.marketTrend) {
            this.charts.marketTrend.destroy();
        }

        const ctx = canvas.getContext('2d');
        const trendData = this.getMarketTrendData();

        this.charts.marketTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.labels,
                datasets: trendData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.chartColors.primary,
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        display: true,
                        position: 'right',
                        grid: {
                            color: this.hexToRgba(this.chartColors.primary, 0.1)
                        }
                    }
                }
            }
        });
    }

    // Data generation methods
    getPerformanceData() {
        const portfolio = app?.portfolio || window.portfolio;
        if (!portfolio) {
            return this.generateSamplePerformanceData();
        }

        const history = portfolio.getPerformanceHistory(30);
        return {
            labels: history.map(item => item.date),
            values: history.map(item => item.value)
        };
    }

    generateSamplePerformanceData() {
        const labels = [];
        const values = [];
        const startDate = new Date();
        const startValue = 10000;

        for (let i = 30; i >= 0; i--) {
            const date = new Date(startDate);
            date.setDate(date.getDate() - i);
            labels.push(date.toISOString().split('T')[0]);

            // Simulate portfolio growth with some volatility
            const trend = 0.0003; // Small upward trend
            const volatility = 0.02; // 2% daily volatility
            const randomChange = (Math.random() - 0.5) * volatility;
            const dayValue = startValue * (1 + (30 - i) * trend + randomChange);
            
            values.push(Math.max(dayValue, 0));
        }

        return { labels, values };
    }

    getAllocationData() {
        const portfolio = app?.portfolio || window.portfolio;
        if (!portfolio) {
            return this.generateSampleAllocationData();
        }

        const allocation = portfolio.getAssetAllocation();
        const labels = Object.keys(allocation);
        const values = labels.map(label => allocation[label].value);
        const percentages = labels.map(label => allocation[label].percentage.toFixed(1));
        const colors = this.generateColors(labels.length);

        return { labels, values, percentages, colors };
    }

    generateSampleAllocationData() {
        const labels = ['Azioni', 'ETF', 'Obbligazioni', 'Criptovalute'];
        const values = [4500, 3200, 1800, 500];
        const total = values.reduce((sum, value) => sum + value, 0);
        const percentages = values.map(value => ((value / total) * 100).toFixed(1));
        const colors = this.generateColors(labels.length);

        return { labels, values, percentages, colors };
    }

    getTopHoldingsData() {
        const portfolio = app?.portfolio || window.portfolio;
        if (!portfolio) {
            return this.generateSampleHoldingsData();
        }

        const holdings = portfolio.getTopHoldings(5);
        const labels = holdings.map(holding => holding.symbol);
        const values = holdings.map(holding => holding.value);
        const percentages = holdings.map(holding => holding.weight.toFixed(1));
        const colors = this.generateColors(holdings.length);

        return { labels, values, percentages, colors };
    }

    generateSampleHoldingsData() {
        const labels = ['VWCE.DE', 'AAPL', 'BTC-EUR', 'MSFT', 'GOOGL'];
        const values = [2500, 1800, 1200, 1000, 800];
        const total = values.reduce((sum, value) => sum + value, 0);
        const percentages = values.map(value => ((value / total) * 100).toFixed(1));
        const colors = this.generateColors(labels.length);

        return { labels, values, percentages, colors };
    }

    getMarketTrendData() {
        const markets = app?.markets || window.markets;
        const indices = markets ? markets.getMarketIndices() : this.generateSampleMarketData();
        
        const labels = this.generateDateLabels(7);
        const datasets = indices.slice(0, 3).map((index, i) => ({
            label: index.name,
            data: this.generateTrendValues(index.value, 7),
            borderColor: Object.values(this.chartColors)[i],
            backgroundColor: this.hexToRgba(Object.values(this.chartColors)[i], 0.1),
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
        }));

        return { labels, datasets };
    }

    generateSampleMarketData() {
        return [
            { name: 'S&P 500', value: 4567 },
            { name: 'NASDAQ', value: 14234 },
            { name: 'DAX', value: 16234 }
        ];
    }

    generateDateLabels(days) {
        const labels = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toISOString().split('T')[0]);
        }
        
        return labels;
    }

    generateTrendValues(baseValue, days) {
        const values = [];
        let currentValue = baseValue * 0.98; // Start slightly lower
        
        for (let i = 0; i < days; i++) {
            const volatility = 0.015; // 1.5% daily volatility
            const trend = 0.002; // Small upward trend
            const randomChange = (Math.random() - 0.5) * volatility;
            
            currentValue = currentValue * (1 + trend + randomChange);
            values.push(Math.round(currentValue * 100) / 100);
        }
        
        return values;
    }

    // Utility methods
    generateColors(count) {
        const colorKeys = Object.keys(this.chartColors);
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            const colorKey = colorKeys[i % colorKeys.length];
            colors.push(this.chartColors[colorKey]);
        }
        
        return colors;
    }

    hexToRgba(hex, alpha = 1) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return hex;
        
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    formatCurrency(value, symbol = true) {
        const formatted = new Intl.NumberFormat('it-IT', {
            style: symbol ? 'currency' : 'decimal',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: value > 1000 ? 0 : 2
        }).format(value);
        
        return symbol ? formatted : formatted.replace(/[€\s]/g, '');
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    // Chart management methods
    destroyChart(chartName) {
        if (this.charts[chartName]) {
            this.charts[chartName].destroy();
            delete this.charts[chartName];
        }
    }

    destroyAllCharts() {
        Object.keys(this.charts).forEach(chartName => {
            this.destroyChart(chartName);
        });
    }

    updateChartTheme() {
        // Update chart defaults for theme changes
        this.setupChartDefaults();
        
        // Recreate all charts with new theme
        const activeCharts = Object.keys(this.charts);
        activeCharts.forEach(chartName => {
            if (chartName === 'performance') {
                this.loadPerformanceChart();
            } else if (chartName === 'allocation') {
                this.loadAllocationChart();
            } else if (chartName === 'holdings') {
                this.loadHoldingsChart();
            } else if (chartName === 'marketTrend') {
                this.loadMarketTrendChart();
            }
        });
    }

    refreshCharts() {
        // Refresh all active charts with new data
        if (this.charts.performance) {
            this.loadPerformanceChart();
        }
        
        if (this.charts.allocation) {
            this.loadAllocationChart();
        }
        
        if (this.charts.holdings) {
            this.loadHoldingsChart();
        }
        
        if (this.charts.marketTrend) {
            this.loadMarketTrendChart();
        }
    }

    // Export chart as image
    exportChart(chartName, filename) {
        const chart = this.charts[chartName];
        if (!chart) return;

        const canvas = chart.canvas;
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `${chartName}-chart-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Responsive chart handling
    handleResize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
}

// Create global charts instance
const charts = new ChartsManager();

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
    charts.handleResize();
});

// Handle theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        setTimeout(() => {
            charts.updateChartTheme();
        }, 100);
    });
}