import { useState, useEffect, useCallback } from 'react';

// Mock data per simulare dati di mercato reali
const mockMarketData = {
  indices: [
    {
      name: 'S&P 500',
      symbol: '^GSPC',
      value: 4567.89,
      change: 23.45,
      changePercent: 0.52,
      volume: '2.3B',
      market: 'US'
    },
    {
      name: 'NASDAQ',
      symbol: '^IXIC',
      value: 14234.56,
      change: -45.67,
      changePercent: -0.32,
      volume: '3.1B',
      market: 'US'
    },
    {
      name: 'FTSE MIB',
      symbol: 'FTSEMIB.MI',
      value: 28456.78,
      change: 123.45,
      changePercent: 0.44,
      volume: '456M',
      market: 'IT'
    },
    {
      name: 'DAX',
      symbol: '^GDAXI',
      value: 15678.90,
      change: 89.12,
      changePercent: 0.57,
      volume: '89M',
      market: 'DE'
    },
    {
      name: 'CAC 40',
      symbol: '^FCHI',
      value: 7234.56,
      change: 34.56,
      changePercent: 0.48,
      volume: '67M',
      market: 'FR'
    }
  ],
  currencies: [
    {
      pair: 'EUR/USD',
      rate: 1.0876,
      change: 0.0023,
      changePercent: 0.21,
      high: 1.0890,
      low: 1.0850
    },
    {
      pair: 'EUR/GBP',
      rate: 0.8567,
      change: -0.0012,
      changePercent: -0.14,
      high: 0.8580,
      low: 0.8550
    },
    {
      pair: 'EUR/JPY',
      rate: 158.45,
      change: 0.67,
      changePercent: 0.42,
      high: 158.80,
      low: 157.90
    }
  ],
  commodities: [
    {
      name: 'Oro',
      symbol: 'GC=F',
      price: 1987.50,
      change: 12.30,
      changePercent: 0.62,
      unit: 'USD/oz'
    },
    {
      name: 'Argento',
      symbol: 'SI=F',
      price: 23.45,
      change: 0.23,
      changePercent: 0.99,
      unit: 'USD/oz'
    },
    {
      name: 'Petrolio Brent',
      symbol: 'BZ=F',
      price: 78.90,
      change: -1.20,
      changePercent: -1.50,
      unit: 'USD/bbl'
    }
  ],
  crypto: [
    {
      name: 'Bitcoin',
      symbol: 'BTC-USD',
      price: 43250.67,
      change: 1234.56,
      changePercent: 2.94,
      marketCap: '847.2B',
      volume: '28.5B'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH-USD',
      price: 2345.67,
      change: 45.67,
      changePercent: 1.99,
      marketCap: '281.8B',
      volume: '15.2B'
    }
  ]
};

const mockNewsData = [
  {
    id: 1,
    title: 'Fed mantiene tassi invariati, mercati reagiscono positivamente',
    summary: 'La Federal Reserve ha mantenuto i tassi di interesse invariati al 5.25-5.50%, in linea con le aspettative del mercato.',
    source: 'Reuters',
    publishedAt: '2024-01-15T14:30:00Z',
    category: 'Monetary Policy',
    sentiment: 'positive',
    impact: 'high'
  },
  {
    id: 2,
    title: 'Inflazione Eurozona scende al 2.4%, sotto target BCE',
    summary: 'L\'inflazione nell\'Eurozona è scesa al 2.4% a dicembre, sotto il target del 2% della Banca Centrale Europea.',
    source: 'Bloomberg',
    publishedAt: '2024-01-15T12:15:00Z',
    category: 'Inflation',
    sentiment: 'positive',
    impact: 'medium'
  },
  {
    id: 3,
    title: 'Mercati emergenti mostrano segni di ripresa',
    summary: 'Gli indici dei mercati emergenti hanno registrato una ripresa del 3.2% nel primo trimestre del 2024.',
    source: 'Financial Times',
    publishedAt: '2024-01-15T10:45:00Z',
    category: 'Emerging Markets',
    sentiment: 'positive',
    impact: 'medium'
  },
  {
    id: 4,
    title: 'Tensioni geopolitiche influenzano prezzi petrolio',
    summary: 'Le tensioni nel Medio Oriente hanno spinto i prezzi del petrolio a livelli record negli ultimi giorni.',
    source: 'CNBC',
    publishedAt: '2024-01-15T09:20:00Z',
    category: 'Commodities',
    sentiment: 'negative',
    impact: 'high'
  }
];

export const useMarkets = () => {
  const [marketData, setMarketData] = useState(mockMarketData);
  const [news, setNews] = useState(mockNewsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simula aggiornamento dati in tempo reale
  const updateMarketData = useCallback(() => {
    setMarketData(prev => ({
      ...prev,
      indices: prev.indices.map(index => ({
        ...index,
        value: index.value + (Math.random() - 0.5) * 10,
        change: index.change + (Math.random() - 0.5) * 2,
        changePercent: ((index.change + (Math.random() - 0.5) * 2) / index.value) * 100
      })),
      currencies: prev.currencies.map(currency => ({
        ...currency,
        rate: currency.rate + (Math.random() - 0.5) * 0.001,
        change: currency.change + (Math.random() - 0.5) * 0.0005
      })),
      commodities: prev.commodities.map(commodity => ({
        ...commodity,
        price: commodity.price + (Math.random() - 0.5) * 5,
        change: commodity.change + (Math.random() - 0.5) * 1
      })),
      crypto: prev.crypto.map(crypto => ({
        ...crypto,
        price: crypto.price + (Math.random() - 0.5) * 100,
        change: crypto.change + (Math.random() - 0.5) * 50
      }))
    }));
    setLastUpdate(new Date());
  }, []);

  // Filtra notizie per categoria
  const filterNewsByCategory = useCallback((category) => {
    if (!category) return news;
    return news.filter(item => item.category === category);
  }, [news]);

  // Filtra notizie per sentiment
  const filterNewsBySentiment = useCallback((sentiment) => {
    if (!sentiment) return news;
    return news.filter(item => item.sentiment === sentiment);
  }, [news]);

  // Cerca notizie per parola chiave
  const searchNews = useCallback((query) => {
    if (!query) return news;
    const lowercaseQuery = query.toLowerCase();
    return news.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.summary.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [news]);

  // Ottieni notizie più recenti
  const getLatestNews = useCallback((limit = 5) => {
    return news
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, limit);
  }, [news]);

  // Ottieni notizie per impatto
  const getNewsByImpact = useCallback((impact) => {
    if (!impact) return news;
    return news.filter(item => item.impact === impact);
  }, [news]);

  // Calcola performance media degli indici
  const calculateIndicesPerformance = useCallback(() => {
    const totalChange = marketData.indices.reduce((sum, index) => sum + index.changePercent, 0);
    const avgChange = totalChange / marketData.indices.length;
    
    const positiveCount = marketData.indices.filter(index => index.changePercent > 0).length;
    const negativeCount = marketData.indices.filter(index => index.changePercent < 0).length;
    
    return {
      averageChange: avgChange,
      positiveCount,
      negativeCount,
      marketSentiment: positiveCount > negativeCount ? 'Bullish' : 'Bearish'
    };
  }, [marketData.indices]);

  // Analizza correlazioni tra asset
  const analyzeCorrelations = useCallback(() => {
    // Simula analisi correlazioni
    const correlations = {
      'S&P 500-NASDAQ': 0.95,
      'EUR/USD-Gold': -0.65,
      'Bitcoin-Gold': 0.15,
      'Oil-Gold': 0.45
    };
    
    return correlations;
  }, []);

  // Ottieni dati storici simulati
  const getHistoricalData = useCallback((symbol, period = '1M') => {
    const periods = {
      '1D': 24,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '1Y': 365
    };
    
    const dataPoints = periods[period] || 30;
    const data = [];
    let baseValue = 100;
    
    for (let i = 0; i < dataPoints; i++) {
      const change = (Math.random() - 0.5) * 0.02; // 2% variazione massima
      baseValue *= (1 + change);
      
      data.push({
        timestamp: new Date(Date.now() - (dataPoints - i) * 24 * 60 * 60 * 1000),
        value: baseValue,
        change: change * 100
      });
    }
    
    return data;
  }, []);

  // Simula aggiornamento dati ogni 30 secondi
  useEffect(() => {
    const interval = setInterval(updateMarketData, 30000);
    return () => clearInterval(interval);
  }, [updateMarketData]);

  // Simula ricezione notizie in tempo reale
  useEffect(() => {
    const newsInterval = setInterval(() => {
      const newNews = {
        id: Date.now(),
        title: 'Aggiornamento mercati in tempo reale',
        summary: `Ultimo aggiornamento: ${new Date().toLocaleTimeString()}`,
        source: 'Portfolio Pro',
        publishedAt: new Date().toISOString(),
        category: 'Market Update',
        sentiment: 'neutral',
        impact: 'low'
      };
      
      setNews(prev => [newNews, ...prev.slice(0, 19)]); // Mantieni max 20 notizie
    }, 60000); // Ogni minuto
    
    return () => clearInterval(newsInterval);
  }, []);

  return {
    marketData,
    news,
    loading,
    error,
    lastUpdate,
    updateMarketData,
    filterNewsByCategory,
    filterNewsBySentiment,
    searchNews,
    getLatestNews,
    getNewsByImpact,
    calculateIndicesPerformance,
    analyzeCorrelations,
    getHistoricalData
  };
};