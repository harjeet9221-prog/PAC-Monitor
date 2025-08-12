import React, { useState } from 'react';
import { useMarkets } from '../hooks/useMarkets';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Globe,
  DollarSign,
  Coins,
  Bitcoin,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';

const Markets = () => {
  const { marketData, lastUpdate, calculateIndicesPerformance } = useMarkets();
  const [activeTab, setActiveTab] = useState('indices');
  const [refreshKey, setRefreshKey] = useState(0);

  const formatNumber = (value, decimals = 2) => {
    return new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
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
    if (value > 0) return <TrendingUp className="w-4 h-4" />;
    if (value < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const getMarketColor = (market) => {
    const colors = {
      'US': 'bg-blue-100 text-blue-800',
      'IT': 'bg-green-100 text-green-800',
      'DE': 'bg-yellow-100 text-yellow-800',
      'FR': 'bg-red-100 text-red-800'
    };
    return colors[market] || 'bg-gray-100 text-gray-800';
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const marketPerformance = calculateIndicesPerformance();

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mercati</h1>
          <p className="text-sm text-gray-600">
            Ultimo aggiornamento: {lastUpdate.toLocaleTimeString('it-IT')}
          </p>
        </div>
        
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 ${refreshKey > 0 ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Sentiment generale */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Sentiment Mercato</p>
              <p className="text-2xl font-bold">
                {marketPerformance.marketSentiment === 'Bullish' ? '🟢 Rialzista' : '🔴 Ribassista'}
              </p>
              <p className="text-sm opacity-90">
                {marketPerformance.positiveCount} su {marketData.indices.length} indici in positivo
              </p>
            </div>
            <BarChart3 className="w-12 h-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs principali */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="indices">Indici</TabsTrigger>
          <TabsTrigger value="currencies">Valute</TabsTrigger>
          <TabsTrigger value="commodities">Commodity</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
        </TabsList>

        <TabsContent value="indices" className="space-y-4">
          {/* Indici principali */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Indici Principali
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.indices.map((index) => (
                  <div key={index.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getMarketColor(index.market)}>
                        {index.market}
                      </Badge>
                      <div>
                        <p className="font-medium">{index.name}</p>
                        <p className="text-sm text-gray-600">{index.symbol}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatNumber(index.value)}</p>
                      <div className="flex items-center gap-1">
                        {getPerformanceIcon(index.changePercent)}
                        <span className={getPerformanceColor(index.changePercent)}>
                          {formatPercentage(index.changePercent)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Vol: {index.volume}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance media */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className={`text-3xl font-bold ${getPerformanceColor(marketPerformance.averageChange)}`}>
                  {formatPercentage(marketPerformance.averageChange)}
                </p>
                <p className="text-sm text-gray-600">Rendimento medio degli indici</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currencies" className="space-y-4">
          {/* Tassi di cambio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Tassi di Cambio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.currencies.map((currency) => (
                  <div key={currency.pair} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-lg">{currency.pair}</p>
                      <p className="text-sm text-gray-600">
                        High: {formatNumber(currency.high, 4)} | Low: {formatNumber(currency.low, 4)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatNumber(currency.rate, 4)}</p>
                      <div className="flex items-center gap-1">
                        {getPerformanceIcon(currency.changePercent)}
                        <span className={getPerformanceColor(currency.changePercent)}>
                          {formatPercentage(currency.changePercent)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info valute */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Informazioni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• EUR/USD: Rapporto Euro-Dollaro americano</p>
                <p>• EUR/GBP: Rapporto Euro-Sterlina britannica</p>
                <p>• EUR/JPY: Rapporto Euro-Yen giapponese</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commodities" className="space-y-4">
          {/* Commodity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Commodity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.commodities.map((commodity) => (
                  <div key={commodity.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{commodity.name}</p>
                      <p className="text-sm text-gray-600">{commodity.unit}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatNumber(commodity.price)}</p>
                      <div className="flex items-center gap-1">
                        {getPerformanceIcon(commodity.changePercent)}
                        <span className={getPerformanceColor(commodity.changePercent)}>
                          {formatPercentage(commodity.changePercent)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert commodity */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Attenzione Commodity</p>
                  <p className="text-sm text-orange-700">
                    I prezzi del petrolio sono influenzati da tensioni geopolitiche
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4">
          {/* Criptovalute */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="w-5 h-5" />
                Criptovalute
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.crypto.map((crypto) => (
                  <div key={crypto.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-sm text-gray-600">MC: {crypto.marketCap}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatNumber(crypto.price)}</p>
                      <div className="flex items-center gap-1">
                        {getPerformanceIcon(crypto.changePercent)}
                        <span className={getPerformanceColor(crypto.changePercent)}>
                          {formatPercentage(crypto.changePercent)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Vol: {crypto.volume}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info crypto */}
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Crypto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Bitcoin: La prima e più grande criptovaluta</p>
                <p>• Ethereum: Piattaforma per smart contract e DeFi</p>
                <p>• Attenzione: Le crypto sono altamente volatili</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer con azioni rapide */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Globe className="w-5 h-5 mb-1" />
            <span className="text-xs">Indici</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <DollarSign className="w-5 h-5 mb-1" />
            <span className="text-xs">Valute</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Coins className="w-5 h-5 mb-1" />
            <span className="text-xs">Commodity</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Bitcoin className="w-5 h-5 mb-1" />
            <span className="text-xs">Crypto</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Markets;