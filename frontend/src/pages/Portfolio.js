import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  PieChart, TrendingUp, TrendingDown, Brain, AlertCircle, 
  Target, Euro, Smartphone, Globe, Monitor, Car 
} from 'lucide-react';
import { portfolioData } from '../data/mock';

const Portfolio = () => {
  const { totalValue, dailyChange, dailyChangePercent, assets, aiRecommendations } = portfolioData;
  const [selectedAsset, setSelectedAsset] = useState(null);

  const getAssetIcon = (iconName) => {
    const icons = {
      Smartphone,
      Globe,
      Monitor,
      Car
    };
    return icons[iconName] || Globe;
  };

  const isPositive = dailyChange > 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PieChart className="h-6 w-6" />
              <span>Il Mio Portafoglio</span>
            </div>
            <Badge className="bg-white/20 text-white hover:bg-white/30">
              Aggiornato ora
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold">
                €{totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`flex items-center space-x-1 ${
                  isPositive ? 'text-green-200' : 'text-red-200'
                }`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-semibold">
                    {isPositive ? '+' : ''}€{Math.abs(dailyChange).toFixed(2)}
                  </span>
                  <span>
                    ({isPositive ? '+' : ''}{dailyChangePercent.toFixed(2)}%) oggi
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-lg font-semibold">+2.8%</div>
                <div className="text-sm text-white/80">Settimana</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-lg font-semibold">+5.4%</div>
                <div className="text-sm text-white/80">Mese</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-lg font-semibold">+12.1%</div>
                <div className="text-sm text-white/80">Anno</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <span>Consigli AI Personalizzati</span>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              Aggiornati
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high'
                    ? 'border-red-500 bg-red-50'
                    : rec.priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5" />
                      <h4 className="font-semibold">{rec.title}</h4>
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                    {rec.actionItems && (
                      <ul className="space-y-1">
                        {rec.actionItems.map((item, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    Applica
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card>
        <CardHeader>
          <CardTitle>Le Mie Posizioni</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assets.map((asset) => {
              const IconComponent = getAssetIcon(asset.icon);
              const isAssetPositive = asset.change > 0;
              
              return (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedAsset(asset.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-500">
                        {asset.quantity} × €{asset.currentPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      €{asset.totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-sm flex items-center space-x-1 ${
                      isAssetPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isAssetPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <span>
                        {isAssetPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Andamento Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Grafico Performance</p>
              <p className="text-sm text-gray-400">Visualizzazione dati storici</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;