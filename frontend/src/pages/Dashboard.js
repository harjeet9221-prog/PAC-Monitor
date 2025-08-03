import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Target, Lightbulb, BarChart3 } from 'lucide-react';
import { marketData } from '../data/mock';

const Dashboard = () => {
  const { globalIndices, aiMarketInsights } = marketData;

  const getInsightIcon = (type) => {
    switch(type) {
      case 'opportunity': return Target;
      case 'warning': return AlertTriangle;
      case 'trend': return TrendingUp;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type) => {
    switch(type) {
      case 'opportunity': return 'from-green-500 to-emerald-600';
      case 'warning': return 'from-orange-500 to-red-500';
      case 'trend': return 'from-blue-500 to-indigo-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Market Insights Panel */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Analisi AI del Mercato</span>
            <Badge className="bg-white/20 text-white hover:bg-white/30">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aiMarketInsights.map((insight) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <div
                  key={insight.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <IconComponent className="h-5 w-5" />
                    <h4 className="font-semibold">{insight.title}</h4>
                  </div>
                  <p className="text-sm text-white/90 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-white/20 px-2 py-1 rounded">
                      Confidenza: {insight.confidence}%
                    </span>
                    <span>{insight.timeframe}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Market Indices Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {globalIndices.map((index) => {
          const isPositive = index.change > 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <Card 
              key={index.id} 
              className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* AI Insight Badge */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">
                  <Brain className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              </div>
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {index.name}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${
                  isPositive ? 'from-green-100 to-emerald-100' : 'from-red-100 to-orange-100'
                }`}>
                  <TrendIcon className={`h-4 w-4 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {index.value.toLocaleString('it-IT', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-semibold ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? '+' : ''}{index.change.toFixed(2)}
                    </span>
                    <span className={`text-sm ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  
                  {/* AI Insight - shown on hover */}
                  <div className="mt-3 p-2 bg-indigo-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-indigo-700">{index.aiInsight}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Market Overview Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Panoramica Mercati</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Trend Dominante</div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600">Rialzista</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Volatilità Media</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold">Moderata</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Sentiment AI</div>
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-indigo-600" />
                <span className="font-semibold text-indigo-600">Positivo 78%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;