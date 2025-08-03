// Mock data for PAC Monitor PWA

export const marketData = {
  globalIndices: [
    {
      id: 1,
      name: "FTSE MIB",
      value: 28945.32,
      change: 1.24,
      changePercent: 2.1,
      icon: "TrendingUp",
      aiInsight: "Trend positivo sostenuto da settore bancario"
    },
    {
      id: 2,
      name: "S&P 500",
      value: 4387.16,
      change: -12.8,
      changePercent: -0.29,
      icon: "Globe",
      aiInsight: "Correzione temporanea, fondamentali solidi"
    },
    {
      id: 3,
      name: "NASDAQ",
      value: 13672.35,
      change: 45.2,
      changePercent: 0.33,
      icon: "Zap",
      aiInsight: "Tech in ripresa, ottimo momento per entry"
    },
    {
      id: 4,
      name: "EUR/USD",
      value: 1.0892,
      change: -0.0023,
      changePercent: -0.21,
      icon: "Euro",
      aiInsight: "Pressione ribassista, monitorare BCE"
    }
  ],
  
  aiMarketInsights: [
    {
      id: 1,
      type: "opportunity",
      title: "Opportunità Settore Tech",
      description: "I titoli tecnologici mostrano segnali di ripresa con volumi in aumento del 15%. L'AI suggerisce di considerare posizioni su ETF tecnologici diversificati.",
      confidence: 85,
      timeframe: "2-3 settimane",
      impact: "high"
    },
    {
      id: 2,
      type: "warning",
      title: "Rischio Valutario",
      description: "L'EUR/USD potrebbe scendere ulteriormente del 0.8% a causa delle tensioni geopolitiche. Considerare copertura per posizioni in dollari.",
      confidence: 72,
      timeframe: "1 settimana",
      impact: "medium"
    },
    {
      id: 3,
      type: "trend",
      title: "Energia Rinnovabile in Crescita",
      description: "Settore green energy +12% nel trimestre. Momentum positivo sostenuto da nuove politiche ambientali EU.",
      confidence: 91,
      timeframe: "3-6 mesi",
      impact: "high"
    }
  ]
};

export const portfolioData = {
  totalValue: 125847.65,
  dailyChange: 1250.45,
  dailyChangePercent: 1.01,
  weeklyChangePercent: 2.8,
  monthlyChangePercent: 5.4,
  
  assets: [
    {
      id: 1,
      name: "Apple Inc.",
      symbol: "AAPL",
      quantity: 50,
      currentPrice: 175.23,
      totalValue: 8761.5,
      change: 2.1,
      changePercent: 1.21,
      icon: "Smartphone"
    },
    {
      id: 2,
      name: "VWCE ETF",
      symbol: "VWCE",
      quantity: 120,
      currentPrice: 98.45,
      totalValue: 11814.0,
      change: -0.8,
      changePercent: -0.81,
      icon: "Globe"
    },
    {
      id: 3,
      name: "Microsoft Corp",
      symbol: "MSFT",
      quantity: 30,
      currentPrice: 329.85,
      totalValue: 9895.5,
      change: 5.2,
      changePercent: 1.6,
      icon: "Monitor"
    },
    {
      id: 4,
      name: "Tesla Inc.",
      symbol: "TSLA",
      quantity: 25,
      currentPrice: 242.67,
      totalValue: 6066.75,
      change: -3.4,
      changePercent: -1.38,
      icon: "Car"
    }
  ],
  
  performanceHistory: [
    { date: '2024-01', value: 118000 },
    { date: '2024-02', value: 119500 },
    { date: '2024-03', value: 121200 },
    { date: '2024-04', value: 123100 },
    { date: '2024-05', value: 124800 },
    { date: '2024-06', value: 125847 }
  ],
  
  aiRecommendations: [
    {
      id: 1,
      type: "rebalance",
      title: "Riequilibrio Suggerito",
      description: "Il portafoglio è sovraesposto al settore tech (45%). L'AI suggerisce di diversificare con bond e settore healthcare.",
      actionItems: [
        "Ridurre AAPL del 20%",
        "Aggiungere bond government 15%",
        "Considerare healthcare ETF 10%"
      ],
      priority: "high"
    },
    {
      id: 2,
      type: "buy",
      title: "Opportunità di Acquisto",
      description: "MSFT ha mostrato pattern di accumulo. Entry point favorevole nei prossimi 5 giorni.",
      targetPrice: 325.0,
      confidence: 78,
      priority: "medium"
    }
  ]
};

export const toolsData = {
  calculators: [
    {
      id: "tax-calc",
      name: "Calcolatore Tasse",
      description: "Calcola le tasse su capital gains",
      icon: "Calculator",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "yield-calc", 
      name: "Rendimento Investimento",
      description: "Simula rendimenti futuri",
      icon: "TrendingUp",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "currency-calc",
      name: "Convertitore Valute", 
      description: "Converti tra valute principali",
      icon: "ArrowLeftRight",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "risk-calc",
      name: "Calcolatore Rischio",
      description: "Valuta il profilo di rischio",
      icon: "Shield",
      color: "from-orange-500 to-red-500"
    }
  ],
  
  importExport: [
    {
      id: "import-csv",
      name: "Importa CSV",
      description: "Carica transazioni da CSV",
      icon: "FileUp",
      type: "import"
    },
    {
      id: "export-report",
      name: "Report PDF",
      description: "Genera report completo",
      icon: "FileDown", 
      type: "export"
    },
    {
      id: "sync-bank",
      name: "Sincronizza Banca",
      description: "Connetti conto bancario",
      icon: "Banknote",
      type: "sync"
    }
  ],
  
  aiTools: [
    {
      id: "portfolio-analyzer",
      name: "Analisi AI Portafoglio",
      description: "Analisi dettagliata con AI",
      icon: "Brain",
      status: "active"
    },
    {
      id: "market-forecast",
      name: "Previsioni Mercato",
      description: "Forecast AI prossimi 30gg",
      icon: "Crystal",
      status: "active"
    },
    {
      id: "auto-optimizer",
      name: "Ottimizzatore Auto",
      description: "Ottimizzazione automatica",
      icon: "Sparkles",
      status: "premium"
    }
  ]
};