import React, { useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  PieChart, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Search,
  Filter
} from 'lucide-react';

const Portfolio = () => {
  const { portfolio, metrics, riskMetrics, updateAsset, removeAsset, exportToCSV } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAssetClass, setFilterAssetClass] = useState('');
  const [editingAsset, setEditingAsset] = useState(null);
  const [showValues, setShowValues] = useState(true);

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

  const filteredAssets = portfolio.assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterAssetClass || asset.assetClass === filterAssetClass;
    return matchesSearch && matchesFilter;
  });

  const handleEditAsset = (asset) => {
    setEditingAsset({ ...asset });
  };

  const handleSaveAsset = () => {
    if (editingAsset) {
      updateAsset(editingAsset.id, editingAsset);
      setEditingAsset(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingAsset(null);
  };

  const handleAmountChange = (assetId, newAmount) => {
    if (editingAsset && editingAsset.id === assetId) {
      const newWeight = (newAmount / metrics.totalValue) * 100;
      setEditingAsset({
        ...editingAsset,
        amount: parseFloat(newAmount),
        weight: newWeight
      });
    }
  };

  const assetClasses = [...new Set(portfolio.assets.map(asset => asset.assetClass))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portafoglio</h1>
          <p className="text-sm text-gray-600">
            {portfolio.assets.length} asset • Ultimo aggiornamento: {new Date(portfolio.lastUpdate).toLocaleDateString('it-IT')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowValues(!showValues)}
          >
            {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          
          <Button size="sm" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Esporta
          </Button>
        </div>
      </div>

      {/* Metriche principali */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm opacity-90">Valore Totale</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm opacity-90">Performance 1Y</p>
              <p className="text-2xl font-bold">{formatPercentage(metrics.weightedPerformance)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtri e ricerca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cerca asset..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterAssetClass}
                onChange={(e) => setFilterAssetClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Tutte le classi</option>
                {assetClasses.map(assetClass => (
                  <option key={assetClass} value={assetClass}>{assetClass}</option>
                ))}
              </select>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabella asset */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Asset del Portafoglio</span>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Asset
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Asset</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Classe</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Importo</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Peso</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">TER</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Performance</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium text-sm">{asset.ticker}</p>
                        <p className="text-xs text-gray-600 truncate max-w-32">{asset.name}</p>
                      </div>
                    </td>
                    
                    <td className="py-3 px-2">
                      <Badge className={getAssetClassColor(asset.assetClass)}>
                        {asset.assetClass}
                      </Badge>
                    </td>
                    
                    <td className="py-3 px-2 text-right">
                      {editingAsset?.id === asset.id ? (
                        <Input
                          type="number"
                          value={editingAsset.amount}
                          onChange={(e) => handleAmountChange(asset.id, e.target.value)}
                          className="w-20 text-right"
                        />
                      ) : (
                        <span className="font-medium">
                          {showValues ? formatCurrency(asset.amount) : '***'}
                        </span>
                      )}
                    </td>
                    
                    <td className="py-3 px-2 text-right">
                      <span className="text-sm">
                        {asset.weight.toFixed(1)}%
                      </span>
                    </td>
                    
                    <td className="py-3 px-2 text-right">
                      <span className="text-sm text-gray-600">
                        {asset.ter.toFixed(2)}%
                      </span>
                    </td>
                    
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {getPerformanceIcon(asset.performance['1y'])}
                        <span className={`text-sm font-medium ${getPerformanceColor(asset.performance['1y'])}`}>
                          {formatPercentage(asset.performance['1y'])}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {editingAsset?.id === asset.id ? (
                          <>
                            <Button size="sm" onClick={handleSaveAsset} className="h-6 px-2">
                              ✓
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-6 px-2">
                              ✕
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEditAsset(asset)}
                              className="h-6 px-2"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => removeAsset(asset.id)}
                              className="h-6 px-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Riepilogo per classe asset */}
      <Card>
        <CardHeader>
          <CardTitle>Riepilogo per Classe Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(metrics.assetAllocation).map(([assetClass, data]) => (
              <div key={assetClass} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">{assetClass}</p>
                    <p className="text-sm text-gray-600">{data.count} asset</p>
                  </div>
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
          <CardTitle>Analisi del Rischio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{riskMetrics.diversificationScore.toFixed(0)}%</p>
              <p className="text-sm text-gray-600">Diversificazione</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{riskMetrics.riskLevel}</p>
              <p className="text-sm text-gray-600">Livello Rischio</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{metrics.weightedTER.toFixed(2)}%</p>
              <p className="text-sm text-gray-600">TER Medio</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{metrics.volatility.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Volatilità</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;