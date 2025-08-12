import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../hooks/usePortfolio';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Edit, 
  Trash2,
  Download,
  Share2,
  BarChart3,
  PieChart,
  Info,
  Calendar,
  DollarSign,
  Percent
} from 'lucide-react';

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { portfolio, updateAsset, removeAsset } = usePortfolio();
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const asset = portfolio.assets.find(a => a.id === parseInt(id));

  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Asset non trovato</h1>
          <Button onClick={() => navigate('/portfolio')}>
            Torna al Portafoglio
          </Button>
        </div>
      </div>
    );
  }

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
    if (value > 0) return <TrendingUp className="w-4 h-4" />;
    if (value < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const getAssetClassColor = (assetClass) => {
    const colors = {
      'Azioni': 'bg-blue-100 text-blue-800',
      'Obbligazioni': 'bg-green-100 text-green-800',
      'Metalli Preziosi': 'bg-yellow-100 text-yellow-800',
      'Liquidità': 'bg-gray-100 text-gray-800'
    };
    return colors[assetClass] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = () => {
    setEditData({ ...asset });
    setEditing(true);
  };

  const handleSave = () => {
    updateAsset(asset.id, editData);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({});
  };

  const handleDelete = () => {
    if (confirm('Sei sicuro di voler rimuovere questo asset?')) {
      removeAsset(asset.id);
      navigate('/portfolio');
    }
  };

  const exportAssetData = () => {
    const data = {
      asset: asset,
      exportDate: new Date().toISOString(),
      portfolio: portfolio.name || 'Portfolio Pro'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.ticker}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const shareAsset = () => {
    if (navigator.share) {
      navigator.share({
        title: `${asset.ticker} - ${asset.name}`,
        text: `Asset: ${asset.ticker}\nValore: ${formatCurrency(asset.amount)}\nPeso: ${asset.weight.toFixed(1)}%\nPerformance 1Y: ${formatPercentage(asset.performance['1y'])}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${asset.ticker} - ${asset.name}\nValore: ${formatCurrency(asset.amount)}\nPeso: ${asset.weight.toFixed(1)}%\nPerformance 1Y: ${formatPercentage(asset.performance['1y'])}`);
      alert('Informazioni asset copiate negli appunti!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/portfolio')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{asset.ticker}</h1>
            <p className="text-sm text-gray-600">{asset.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={shareAsset}>
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={exportAssetData}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Informazioni principali */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm opacity-90">Valore</p>
              <p className="text-2xl font-bold">{formatCurrency(asset.amount)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm opacity-90">Performance 1Y</p>
              <p className="text-2xl font-bold">{formatPercentage(asset.performance['1y'])}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dettagli asset */}
      <Card>
        <CardHeader>
          <CardTitle>Informazioni Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Ticker</p>
              <p className="font-medium">{asset.ticker}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ISIN</p>
              <p className="font-medium">{asset.isin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo</p>
              <p className="font-medium">{asset.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Classe Asset</p>
              <Badge className={getAssetClassColor(asset.assetClass)}>
                {asset.assetClass}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sottoclasse</p>
              <p className="font-medium">{asset.subClass}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">TER</p>
              <p className="font-medium">{asset.ter.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Peso nel Portafoglio</p>
              <p className="font-medium">{asset.weight.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prezzo</p>
              <p className="font-medium">{formatCurrency(asset.price)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principali */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analysis">Analisi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Performance per periodo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance per Periodo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">1 Giorno</p>
                  <p className={`text-lg font-bold ${getPerformanceColor(asset.performance['1d'])}`}>
                    {formatPercentage(asset.performance['1d'])}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">1 Settimana</p>
                  <p className={`text-lg font-bold ${getPerformanceColor(asset.performance['1w'])}`}>
                    {formatPercentage(asset.performance['1w'])}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">1 Mese</p>
                  <p className={`text-lg font-bold ${getPerformanceColor(asset.performance['1m'])}`}>
                    {formatPercentage(asset.performance['1m'])}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">3 Mesi</p>
                  <p className={`text-lg font-bold ${getPerformanceColor(asset.performance['3m'])}`}>
                    {formatPercentage(asset.performance['3m'])}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">1 Anno</p>
                  <p className={`text-lg font-bold ${getPerformanceColor(asset.performance['1y'])}`}>
                    {formatPercentage(asset.performance['1y'])}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">YTD</p>
                  <p className={`text-lg font-bold ${getPerformanceColor(asset.performance['ytd'])}`}>
                    {formatPercentage(asset.performance['ytd'])}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variazione prezzo */}
          <Card>
            <CardHeader>
              <CardTitle>Variazione Prezzo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prezzo Attuale</p>
                  <p className="text-2xl font-bold">{formatCurrency(asset.price)}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {getPerformanceIcon(asset.changePercent)}
                    <span className={`text-lg font-bold ${getPerformanceColor(asset.changePercent)}`}>
                      {formatPercentage(asset.changePercent)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {asset.change > 0 ? '+' : ''}{formatCurrency(asset.change)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Grafico performance (placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Andamento Storico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">Grafico Performance</p>
                  <p className="text-sm text-gray-400">Visualizzazione dati storici</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confronto con benchmark */}
          <Card>
            <CardHeader>
              <CardTitle>Confronto con Benchmark</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{asset.ticker}</p>
                    <p className="text-sm text-gray-600">Asset</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getPerformanceColor(asset.performance['1y'])}`}>
                      {formatPercentage(asset.performance['1y'])}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Benchmark</p>
                    <p className="text-sm text-gray-600">Indice di riferimento</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-600">+8.5%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {/* Analisi rischio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Analisi del Rischio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{asset.ter.toFixed(2)}%</p>
                  <p className="text-sm text-gray-600">TER</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">Medio</p>
                  <p className="text-sm text-gray-600">Livello Rischio</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">0.65</p>
                  <p className="text-sm text-gray-600">Beta</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">12.3%</p>
                  <p className="text-sm text-gray-600">Volatilità</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Correlazioni */}
          <Card>
            <CardHeader>
              <CardTitle>Correlazioni</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">S&P 500</span>
                  <span className="text-sm font-medium">0.85</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">NASDAQ</span>
                  <span className="text-sm font-medium">0.78</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">FTSE MIB</span>
                  <span className="text-sm font-medium">0.45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Oro</span>
                  <span className="text-sm font-medium">-0.12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metriche aggiuntive */}
          <Card>
            <CardHeader>
              <CardTitle>Metriche Aggiuntive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Sharpe Ratio</p>
                  <p className="font-medium">1.24</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sortino Ratio</p>
                  <p className="font-medium">1.87</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Drawdown</p>
                  <p className="font-medium text-red-600">-8.5%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">VaR (95%)</p>
                  <p className="font-medium">-2.1%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal di modifica */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Modifica Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Importo (€)</label>
                  <input
                    type="number"
                    value={editData.amount || asset.amount}
                    onChange={(e) => setEditData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Prezzo (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editData.price || asset.price}
                    onChange={(e) => setEditData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    Salva
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1">
                    Annulla
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer con azioni rapide */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Info className="w-5 h-5 mb-1" />
            <span className="text-xs">Dettagli</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs">Performance</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Edit className="w-5 h-5 mb-1" />
            <span className="text-xs">Modifica</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;