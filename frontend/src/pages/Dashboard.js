import React, { useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarkets } from '../hooks/useMarkets';
import { usePWA } from '../hooks/usePWA';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  DollarSign,
  Download,
  Plus,
  Bell,
  Wifi,
  WifiOff,
  Smartphone
} from 'lucide-react';

const Dashboard = () => {
  const { portfolio, metrics, riskMetrics } = usePortfolio();
  const { marketData, calculateIndicesPerformance } = useMarkets();
  const { isOnline, canInstall, installApp, isInstalled } = usePWA();
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: portfolio.currency
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPerformanceColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPerformanceIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header con stato PWA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Pro</h1>
          <p className="text-sm text-gray-600">
            {isOnline ? (
              <span className="flex items-center gap-2 text-green-600">
                <Wifi className="w-4 h-4" />
                Online
              </span>
            ) : (
              <span className="flex items-center gap-2 text-red-600">
                <WifiOff className="w-4 h-4" />
                Offline
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {canInstall && !isInstalled && (
            <Button 
              size="sm" 
              onClick={installApp}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Installa
            </Button>
          )}
          
          <Button size="sm" variant="outline">
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metriche principali */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Valore Totale</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Performance 1Y</p>
                <p className="text-2xl font-bold">{formatPercentage(metrics.weightedPerformance)}</p>
              </div>
              <BarChart3 className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principali */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="markets">Mercati</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Allocazione asset */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Allocazione Asset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(metrics.assetAllocation).map(([assetClass, data]) => (
                  <div key={assetClass} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">{assetClass}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(data.amount)}</p>
                      <p className="text-sm text-gray-600">{data.weight.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metriche di rischio */}
          <Card>
            <CardHeader>
              <CardTitle>Metriche di Rischio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{riskMetrics.diversificationScore.toFixed(0)}%</p>
                  <p className="text-sm text-gray-600">Diversificazione</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{riskMetrics.riskLevel}</p>
                  <p className="text-sm text-gray-600">Livello Rischio</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{metrics.weightedTER.toFixed(2)}%</p>
                  <p className="text-sm text-gray-600">TER Medio</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{metrics.volatility.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Volatilità</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Performance per periodo */}
          <Card>
            <CardHeader>
              <CardTitle>Performance per Periodo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolio.assets.slice(0, 3).map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{asset.ticker}</p>
                      <p className="text-xs text-gray-600">{asset.name}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getPerformanceColor(asset.performance['1y'])}`}>
                        {formatPercentage(asset.performance['1y'])}
                      </p>
                      <p className="text-xs text-gray-600">{formatCurrency(asset.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Azioni rapide */}
          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Asset
            </Button>
            <Button className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Esporta
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="markets" className="space-y-4">
          {/* Indici principali */}
          <Card>
            <CardHeader>
              <CardTitle>Indici Principali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.indices.slice(0, 3).map((index) => (
                  <div key={index.symbol} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{index.name}</p>
                      <p className="text-sm text-gray-600">{index.value.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {getPerformanceIcon(index.changePercent)}
                        <span className={getPerformanceColor(index.changePercent)}>
                          {formatPercentage(index.changePercent)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{index.volume}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sentiment mercato */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Mercato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {calculateIndicesPerformance().marketSentiment}
                </p>
                <p className="text-sm text-gray-600">
                  {calculateIndicesPerformance().positiveCount} su {marketData.indices.length} indici in positivo
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer con azioni rapide */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <PieChart className="w-5 h-5 mb-1" />
            <span className="text-xs">Portfolio</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs">Mercati</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <TrendingUp className="w-5 h-5 mb-1" />
            <span className="text-xs">Strumenti</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;