import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../hooks/usePortfolio';
import { useFinancialTools } from '../hooks/useFinancialTools';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  PieChart, 
  Target,
  TrendingUp,
  AlertTriangle,
  Info,
  Calculator,
  BarChart3,
  CheckCircle,
  XCircle
} from 'lucide-react';

const PortfolioBuilder = () => {
  const navigate = useNavigate();
  const { addAsset, portfolio } = usePortfolio();
  const { calculateDiversification, calculateAssetAllocation } = useFinancialTools();
  
  const [portfolioName, setPortfolioName] = useState('Nuovo Portafoglio');
  const [totalAmount, setTotalAmount] = useState(100000);
  const [investmentType, setInvestmentType] = useState('PAC');
  const [riskProfile, setRiskProfile] = useState('Moderato');
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [assets, setAssets] = useState([
    { id: 1, name: 'Azioni Globali', assetClass: 'Azioni', percentage: 60, riskLevel: 'Alto' },
    { id: 2, name: 'Obbligazioni Governative', assetClass: 'Obbligazioni', percentage: 30, riskLevel: 'Basso' },
    { id: 3, name: 'Commodity', assetClass: 'Commodity', percentage: 10, riskLevel: 'Medio' }
  ]);

  const [newAsset, setNewAsset] = useState({
    name: '',
    assetClass: 'Azioni',
    percentage: 0,
    riskLevel: 'Medio'
  });

  const assetClasses = [
    { value: 'Azioni', label: 'Azioni', color: 'bg-blue-100 text-blue-800' },
    { value: 'Obbligazioni', label: 'Obbligazioni', color: 'bg-green-100 text-green-800' },
    { value: 'Metalli Preziosi', label: 'Metalli Preziosi', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Liquidità', label: 'Liquidità', color: 'bg-gray-100 text-gray-800' },
    { value: 'Commodity', label: 'Commodity', color: 'bg-orange-100 text-orange-800' },
    { value: 'Real Estate', label: 'Real Estate', color: 'bg-purple-100 text-purple-800' }
  ];

  const riskLevels = [
    { value: 'Molto Basso', label: 'Molto Basso', color: 'bg-green-100 text-green-800' },
    { value: 'Basso', label: 'Basso', color: 'bg-blue-100 text-blue-800' },
    { value: 'Medio', label: 'Medio', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Alto', label: 'Alto', color: 'bg-orange-100 text-orange-800' },
    { value: 'Molto Alto', label: 'Molto Alto', color: 'bg-red-100 text-red-800' }
  ];

  const investmentTypes = [
    { value: 'Unica Soluzione', label: 'Unica Soluzione', description: 'Investimento una tantum' },
    { value: 'PAC', label: 'PAC', description: 'Piano di Accumulo Capitale' },
    { value: 'PIP', label: 'PIP', description: 'Piano di Investimento Programmato' }
  ];

  const riskProfiles = [
    { value: 'Conservativo', label: 'Conservativo', description: 'Basso rischio, basso rendimento' },
    { value: 'Moderato', label: 'Moderato', description: 'Rischio medio, rendimento medio' },
    { value: 'Aggressivo', label: 'Aggressivo', description: 'Alto rischio, alto rendimento' }
  ];

  const timeHorizons = [
    { value: 1, label: '1 anno', description: 'Breve termine' },
    { value: 3, label: '3 anni', description: 'Breve-medio termine' },
    { value: 5, label: '5 anni', description: 'Medio termine' },
    { value: 10, label: '10 anni', description: 'Medio-lungo termine' },
    { value: 15, label: '15 anni', description: 'Lungo termine' },
    { value: 20, label: '20+ anni', description: 'Molto lungo termine' }
  ];

  const addNewAsset = () => {
    if (newAsset.name && newAsset.percentage > 0) {
      const asset = {
        ...newAsset,
        id: Date.now(),
        percentage: parseFloat(newAsset.percentage)
      };
      setAssets(prev => [...prev, asset]);
      setNewAsset({
        name: '',
        assetClass: 'Azioni',
        percentage: 0,
        riskLevel: 'Medio'
      });
    }
  };

  const removeAsset = (id) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const updateAsset = (id, field, value) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    ));
  };

  const getTotalAllocated = () => {
    return assets.reduce((sum, asset) => sum + asset.percentage, 0);
  };

  const getRemainingPercentage = () => {
    return 100 - getTotalAllocated();
  };

  const getDiversificationScore = () => {
    const weights = assets.map(asset => asset.percentage);
    const diversification = calculateDiversification(weights);
    return diversification ? diversification.diversificationScore : 0;
  };

  const getRiskLevel = () => {
    const totalRisk = assets.reduce((sum, asset) => {
      const riskValues = { 'Molto Basso': 1, 'Basso': 2, 'Medio': 3, 'Alto': 4, 'Molto Alto': 5 };
      return sum + (riskValues[asset.riskLevel] * asset.percentage / 100);
    }, 0);
    
    if (totalRisk <= 2) return 'Conservativo';
    if (totalRisk <= 3.5) return 'Moderato';
    return 'Aggressivo';
  };

  const getRecommendedAllocation = () => {
    const recommendations = {
      'Conservativo': [
        { assetClass: 'Obbligazioni', percentage: 70, riskLevel: 'Basso' },
        { assetClass: 'Azioni', percentage: 20, riskLevel: 'Medio' },
        { assetClass: 'Liquidità', percentage: 10, riskLevel: 'Molto Basso' }
      ],
      'Moderato': [
        { assetClass: 'Azioni', percentage: 60, riskLevel: 'Medio' },
        { assetClass: 'Obbligazioni', percentage: 30, riskLevel: 'Basso' },
        { assetClass: 'Commodity', percentage: 10, riskLevel: 'Medio' }
      ],
      'Aggressivo': [
        { assetClass: 'Azioni', percentage: 80, riskLevel: 'Alto' },
        { assetClass: 'Commodity', percentage: 15, riskLevel: 'Alto' },
        { assetClass: 'Obbligazioni', percentage: 5, riskLevel: 'Basso' }
      ]
    };
    
    return recommendations[riskProfile] || recommendations['Moderato'];
  };

  const applyRecommendation = () => {
    const recommended = getRecommendedAllocation();
    setAssets(recommended.map((rec, index) => ({
      id: Date.now() + index,
      name: `${rec.assetClass} (Raccomandato)`,
      assetClass: rec.assetClass,
      percentage: rec.percentage,
      riskLevel: rec.riskLevel
    })));
  };

  const validatePortfolio = () => {
    const totalAllocated = getTotalAllocated();
    const diversificationScore = getDiversificationScore();
    
    const errors = [];
    const warnings = [];
    
    if (totalAllocated !== 100) {
      errors.push(`Allocazione totale deve essere 100% (attuale: ${totalAllocated.toFixed(1)}%)`);
    }
    
    if (diversificationScore < 50) {
      warnings.push('Diversificazione bassa - considera di distribuire meglio gli asset');
    }
    
    if (assets.length < 3) {
      warnings.push('Portafoglio con pochi asset - considera di aumentare la diversificazione');
    }
    
    return { errors, warnings, isValid: errors.length === 0 };
  };

  const savePortfolio = () => {
    const validation = validatePortfolio();
    if (validation.isValid) {
      // Qui si potrebbe salvare il portafoglio
      alert('Portafoglio salvato con successo!');
      navigate('/portfolio');
    } else {
      alert(`Errore: ${validation.errors.join(', ')}`);
    }
  };

  const exportPortfolio = () => {
    const data = {
      portfolioName,
      totalAmount,
      investmentType,
      riskProfile,
      timeHorizon,
      assets,
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolioName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const validation = validatePortfolio();

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Costruttore Portafoglio</h1>
          <p className="text-sm text-gray-600">
            Pianifica e costruisci il tuo portafoglio di investimento
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportPortfolio}>
            <Download className="w-4 h-4 mr-2" />
            Esporta
          </Button>
          <Button onClick={savePortfolio} disabled={!validation.isValid}>
            <Save className="w-4 h-4 mr-2" />
            Salva Portafoglio
          </Button>
        </div>
      </div>

      {/* Configurazione base */}
      <Card>
        <CardHeader>
          <CardTitle>Configurazione Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portfolioName">Nome Portafoglio</Label>
              <Input
                id="portfolioName"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="Es. Portafoglio Pensionistico"
              />
            </div>
            <div>
              <Label htmlFor="totalAmount">Capitale Totale (€)</Label>
              <Input
                id="totalAmount"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(parseFloat(e.target.value))}
                placeholder="100000"
              />
            </div>
            <div>
              <Label>Tipo di Investimento</Label>
              <select
                value={investmentType}
                onChange={(e) => setInvestmentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                {investmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Profilo di Rischio</Label>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                {riskProfiles.map(profile => (
                  <option key={profile.value} value={profile.value}>{profile.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Orizzonte Temporale</Label>
              <select
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                {timeHorizons.map(horizon => (
                  <option key={horizon.value} value={horizon.value}>{horizon.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raccomandazioni */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Raccomandazioni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profilo di rischio: <strong>{riskProfile}</strong></p>
              <p className="text-sm text-gray-600">Orizzonte temporale: <strong>{timeHorizon} anni</strong></p>
            </div>
            <Button onClick={applyRecommendation} variant="outline">
              Applica Raccomandazione
            </Button>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            {getRecommendedAllocation().map((rec, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="font-medium">{rec.assetClass}</p>
                <p className="text-2xl font-bold text-blue-600">{rec.percentage}%</p>
                <Badge className="text-xs">{rec.riskLevel}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs principali */}
      <Tabs defaultValue="allocation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="allocation">Allocazione</TabsTrigger>
          <TabsTrigger value="analysis">Analisi</TabsTrigger>
          <TabsTrigger value="validation">Validazione</TabsTrigger>
        </TabsList>

        <TabsContent value="allocation" className="space-y-4">
          {/* Aggiungi nuovo asset */}
          <Card>
            <CardHeader>
              <CardTitle>Aggiungi Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Nome Asset</Label>
                  <Input
                    value={newAsset.name}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Es. ETF Azioni Globali"
                  />
                </div>
                <div>
                  <Label>Classe Asset</Label>
                  <select
                    value={newAsset.assetClass}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, assetClass: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {assetClasses.map(assetClass => (
                      <option key={assetClass.value} value={assetClass.value}>{assetClass.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Percentuale (%)</Label>
                  <Input
                    type="number"
                    value={newAsset.percentage}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, percentage: parseFloat(e.target.value) }))}
                    placeholder="20"
                  />
                </div>
                <div>
                  <Label>Livello Rischio</Label>
                  <select
                    value={newAsset.riskLevel}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, riskLevel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {riskLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Button onClick={addNewAsset} className="mt-4" disabled={!newAsset.name || newAsset.percentage <= 0}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Asset
              </Button>
            </CardContent>
          </Card>

          {/* Lista asset */}
          <Card>
            <CardHeader>
              <CardTitle>Asset del Portafoglio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={assetClasses.find(ac => ac.value === asset.assetClass)?.color}>
                        {asset.assetClass}
                      </Badge>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-gray-600">{asset.riskLevel}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{asset.percentage}%</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency((asset.percentage / 100) * totalAmount)}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAsset(asset.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Riepilogo allocazione */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Totale Allocato</p>
                    <p className="text-sm text-gray-600">
                      {getTotalAllocated().toFixed(1)}% di 100%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {getRemainingPercentage().toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Rimanente</p>
                  </div>
                </div>
                
                {/* Barra progresso */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getTotalAllocated()}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {/* Analisi diversificazione */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Analisi Diversificazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{getDiversificationScore().toFixed(0)}%</p>
                  <p className="text-sm text-gray-600">Diversificazione</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{assets.length}</p>
                  <p className="text-sm text-gray-600">Numero Asset</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{getRiskLevel()}</p>
                  <p className="text-sm text-gray-600">Rischio Totale</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Distribuzione per classe asset */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuzione per Classe Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assetClasses.map(assetClass => {
                  const classAssets = assets.filter(asset => asset.assetClass === assetClass.value);
                  const totalPercentage = classAssets.reduce((sum, asset) => sum + asset.percentage, 0);
                  
                  if (totalPercentage === 0) return null;
                  
                  return (
                    <div key={assetClass.value} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={assetClass.color}>{assetClass.label}</Badge>
                        <span className="text-sm text-gray-600">
                          {classAssets.length} asset
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{totalPercentage.toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency((totalPercentage / 100) * totalAmount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Analisi rischio */}
          <Card>
            <CardHeader>
              <CardTitle>Analisi del Rischio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Profilo Rischio</p>
                  <p className="text-lg font-bold">{riskProfile}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Orizzonte</p>
                  <p className="text-lg font-bold">{timeHorizon} anni</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tipo Investimento</p>
                  <p className="text-lg font-bold">{investmentType}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Capitale</p>
                  <p className="text-lg font-bold">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          {/* Validazione portafoglio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Validazione Portafoglio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Errori */}
                {validation.errors.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold text-red-800">Errori da Correggere</h4>
                    </div>
                    <ul className="space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warning */}
                {validation.warnings.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-800">Avvisi</h4>
                    </div>
                    <ul className="space-y-1">
                      {validation.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-yellow-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Successo */}
                {validation.isValid && validation.warnings.length === 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Portafoglio Valido!</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Il tuo portafoglio è pronto per essere salvato e implementato.
                    </p>
                  </div>
                )}

                {/* Riepilogo validazione */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Allocazione</p>
                    <p className={`text-lg font-bold ${getTotalAllocated() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {getTotalAllocated().toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Diversificazione</p>
                    <p className={`text-lg font-bold ${getDiversificationScore() >= 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {getDiversificationScore().toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Azioni finali */}
          <Card>
            <CardHeader>
              <CardTitle>Azioni Finali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Salva Portafoglio</p>
                    <p className="text-sm text-gray-600">Salva la configurazione per uso futuro</p>
                  </div>
                  <Button onClick={savePortfolio} disabled={!validation.isValid}>
                    <Save className="w-4 h-4 mr-2" />
                    Salva
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Esporta Configurazione</p>
                    <p className="text-sm text-gray-600">Scarica file JSON con la configurazione</p>
                  </div>
                  <Button onClick={exportPortfolio} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Esporta
                  </Button>
                </div>
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
            <span className="text-xs">Allocazione</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs">Analisi</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <CheckCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">Validazione</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export default PortfolioBuilder;