import { useState, useEffect, useCallback } from 'react';

// Mock data per simulare dati finanziari reali
const mockPortfolioData = {
  totalValue: 25000,
  currency: 'EUR',
  assets: [
    {
      id: 1,
      name: 'iShares Core MSCI Emerging Markets IMI UCITS ETF',
      ticker: 'EMIM',
      isin: 'IE00BKM4GZ66',
      type: 'ETF',
      assetClass: 'Azioni',
      subClass: 'Mercati Emergenti',
      amount: 5000,
      weight: 20,
      ter: 0.18,
      performance: {
        '1d': 0.5,
        '1w': 2.1,
        '1m': -1.2,
        '3m': 5.8,
        '1y': 12.3,
        'ytd': 8.7
      },
      price: 25.45,
      change: 0.12,
      changePercent: 0.47
    },
    {
      id: 2,
      name: 'Vanguard FTSE All-World UCITS ETF',
      ticker: 'VWRL',
      isin: 'IE00B3RBWM25',
      type: 'ETF',
      assetClass: 'Azioni',
      subClass: 'Globale',
      amount: 12000,
      weight: 48,
      ter: 0.22,
      performance: {
        '1d': 0.3,
        '1w': 1.8,
        '1m': 0.9,
        '3m': 4.2,
        '1y': 15.7,
        'ytd': 12.1
      },
      price: 98.76,
      change: 0.28,
      changePercent: 0.28
    },
    {
      id: 3,
      name: 'iShares Core Global Aggregate Bond UCITS ETF',
      ticker: 'AGGG',
      isin: 'IE00BDBRDM35',
      type: 'ETF',
      assetClass: 'Obbligazioni',
      subClass: 'Globale',
      amount: 6000,
      weight: 24,
      ter: 0.10,
      performance: {
        '1d': 0.1,
        '1w': 0.5,
        '1m': 0.8,
        '3m': 2.1,
        '1y': 4.2,
        'ytd': 3.8
      },
      price: 45.23,
      change: 0.05,
      changePercent: 0.11
    },
    {
      id: 4,
      name: 'iShares Physical Gold ETC',
      ticker: 'SGLN',
      isin: 'IE00B4ND3602',
      type: 'ETC',
      assetClass: 'Metalli Preziosi',
      subClass: 'Oro',
      amount: 2000,
      weight: 8,
      ter: 0.12,
      performance: {
        '1d': 0.8,
        '1w': 1.2,
        '1m': 2.1,
        '3m': 6.8,
        '1y': 18.5,
        'ytd': 15.2
      },
      price: 67.89,
      change: 0.54,
      changePercent: 0.80
    }
  ],
  cash: 0,
  lastUpdate: new Date().toISOString()
};

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState(mockPortfolioData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calcola metriche del portafoglio
  const calculateMetrics = useCallback(() => {
    const assets = portfolio.assets;
    const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0) + portfolio.cash;
    
    // Calcola TER medio ponderato
    const weightedTER = assets.reduce((sum, asset) => {
      return sum + (asset.ter * asset.weight / 100);
    }, 0);

    // Calcola performance totale ponderata
    const weightedPerformance = assets.reduce((sum, asset) => {
      return sum + (asset.performance['1y'] * asset.weight / 100);
    }, 0);

    // Calcola volatilità (simulata)
    const volatility = Math.sqrt(
      assets.reduce((sum, asset) => {
        const variance = Math.pow(asset.performance['1y'] - weightedPerformance, 2);
        return sum + (variance * asset.weight / 100);
      }, 0)
    );

    // Calcola allocazione per asset class
    const assetAllocation = assets.reduce((acc, asset) => {
      if (!acc[asset.assetClass]) {
        acc[asset.assetClass] = { amount: 0, weight: 0, count: 0 };
      }
      acc[asset.assetClass].amount += asset.amount;
      acc[asset.assetClass].weight += asset.weight;
      acc[asset.assetClass].count += 1;
      return acc;
    }, {});

    return {
      totalValue,
      weightedTER,
      weightedPerformance,
      volatility,
      assetAllocation,
      assetCount: assets.length
    };
  }, [portfolio]);

  // Aggiungi nuovo asset
  const addAsset = useCallback((newAsset) => {
    setPortfolio(prev => ({
      ...prev,
      assets: [...prev.assets, { ...newAsset, id: Date.now() }]
    }));
  }, []);

  // Aggiorna asset esistente
  const updateAsset = useCallback((id, updates) => {
    setPortfolio(prev => ({
      ...prev,
      assets: prev.assets.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      )
    }));
  }, []);

  // Rimuovi asset
  const removeAsset = useCallback((id) => {
    setPortfolio(prev => ({
      ...prev,
      assets: prev.assets.filter(asset => asset.id !== id)
    }));
  }, []);

  // Ricalcola pesi dopo modifiche
  const recalculateWeights = useCallback(() => {
    setPortfolio(prev => {
      const totalValue = prev.assets.reduce((sum, asset) => sum + asset.amount, 0) + prev.cash;
      
      const updatedAssets = prev.assets.map(asset => ({
        ...asset,
        weight: totalValue > 0 ? (asset.amount / totalValue) * 100 : 0
      }));

      return {
        ...prev,
        assets: updatedAssets,
        totalValue
      };
    });
  }, []);

  // Simula performance storica
  const simulateHistoricalPerformance = useCallback((months = 12) => {
    const simulation = [];
    let currentValue = portfolio.totalValue;
    
    for (let i = 0; i <= months; i++) {
      const monthReturn = (Math.random() - 0.5) * 0.1; // Simula rendimento mensile
      currentValue *= (1 + monthReturn);
      
      simulation.push({
        month: i,
        value: currentValue,
        return: monthReturn * 100,
        cumulativeReturn: ((currentValue / portfolio.totalValue) - 1) * 100
      });
    }
    
    return simulation;
  }, [portfolio.totalValue]);

  // Calcola metriche di rischio
  const calculateRiskMetrics = useCallback(() => {
    const assets = portfolio.assets;
    const totalValue = portfolio.totalValue;
    
    // Calcola diversificazione (numero di asset class)
    const assetClasses = new Set(assets.map(asset => asset.assetClass)).size;
    const diversificationScore = Math.min(assetClasses / 5, 1) * 100; // Max 5 asset class
    
    // Calcola concentrazione (HHI - Herfindahl-Hirschman Index)
    const hhi = assets.reduce((sum, asset) => {
      return sum + Math.pow(asset.weight / 100, 2);
    }, 0);
    
    // Calcola correlazione media (simulata)
    const avgCorrelation = 0.3; // Simulato
    
    // Calcola VaR (Value at Risk) al 95%
    const portfolioVolatility = calculateMetrics().volatility;
    const var95 = portfolio.totalValue * portfolioVolatility * 1.65 / Math.sqrt(12);
    
    return {
      diversificationScore,
      hhi,
      concentrationRisk: hhi > 0.25 ? 'Alto' : hhi > 0.15 ? 'Medio' : 'Basso',
      avgCorrelation,
      var95,
      riskLevel: portfolioVolatility > 15 ? 'Alto' : portfolioVolatility > 10 ? 'Medio' : 'Basso'
    };
  }, [portfolio, calculateMetrics]);

  // Esporta dati in CSV
  const exportToCSV = useCallback(() => {
    const headers = ['Asset', 'Ticker', 'ISIN', 'Classe', 'Importo', 'Peso', 'TER', 'Performance 1Y'];
    const csvContent = [
      headers.join(','),
      ...portfolio.assets.map(asset => [
        asset.name,
        asset.ticker,
        asset.isin,
        asset.assetClass,
        asset.amount,
        `${asset.weight.toFixed(2)}%`,
        `${asset.ter.toFixed(2)}%`,
        `${asset.performance['1y'].toFixed(2)}%`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [portfolio]);

  // Salva portafoglio nel localStorage
  const savePortfolio = useCallback(() => {
    try {
      localStorage.setItem('portfolio-data', JSON.stringify(portfolio));
      return true;
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      return false;
    }
  }, [portfolio]);

  // Carica portafoglio dal localStorage
  const loadPortfolio = useCallback(() => {
    try {
      const saved = localStorage.getItem('portfolio-data');
      if (saved) {
        setPortfolio(JSON.parse(saved));
        return true;
      }
    } catch (error) {
      console.error('Errore nel caricamento:', error);
    }
    return false;
  }, []);

  // Carica dati salvati all'avvio
  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  // Salva automaticamente quando il portafoglio cambia
  useEffect(() => {
    if (portfolio.assets.length > 0) {
      savePortfolio();
    }
  }, [portfolio, savePortfolio]);

  return {
    portfolio,
    loading,
    error,
    metrics: calculateMetrics(),
    riskMetrics: calculateRiskMetrics(),
    addAsset,
    updateAsset,
    removeAsset,
    recalculateWeights,
    simulateHistoricalPerformance,
    exportToCSV,
    savePortfolio,
    loadPortfolio
  };
};