import React, { useState } from 'react';
import { useFinancialTools } from '../hooks/useFinancialTools';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  DollarSign,
  Percent,
  Calendar,
  BarChart3,
  Target,
  AlertTriangle,
  Info,
  Download,
  RefreshCw,
  Home
} from 'lucide-react';

const Tools = () => {
  const {
    calculateCompoundInterest,
    calculateAnnualizedReturn,
    calculateInflationImpact,
    calculateMortgage,
    calculateDiversification,
    calculateCorrelation,
    calculateVolatility,
    calculateSharpeRatio,
    calculateVaR,
    calculateAssetAllocation,
    calculateRebalancing,
    calculateTransactionCosts
  } = useFinancialTools();

  const [activeTab, setActiveTab] = useState('calculators');
  const [results, setResults] = useState({});

  // Stati per i calcolatori
  const [compoundInterest, setCompoundInterest] = useState({
    principal: 10000,
    rate: 5,
    time: 10,
    frequency: 1
  });

  const [annualizedReturn, setAnnualizedReturn] = useState({
    initialValue: 10000,
    finalValue: 15000,
    timeInYears: 5
  });

  const [inflation, setInflation] = useState({
    amount: 10000,
    inflationRate: 2,
    years: 10
  });

  const [mortgage, setMortgage] = useState({
    principal: 200000,
    annualRate: 3.5,
    years: 30,
    paymentFrequency: 12
  });

  const [diversification, setDiversification] = useState({
    weights: [40, 30, 20, 10]
  });

  const [correlation, setCorrelation] = useState({
    returns1: [2.5, 3.1, -1.2, 4.5, 2.8],
    returns2: [1.8, 2.9, -0.8, 3.2, 2.1]
  });

  const [volatility, setVolatility] = useState({
    returns: [2.5, 3.1, -1.2, 4.5, 2.8, -0.5, 1.9, 3.2, -2.1, 4.8],
    period: 'annual'
  });

  const [sharpeRatio, setSharpeRatio] = useState({
    returns: [2.5, 3.1, -1.2, 4.5, 2.8, -0.5, 1.9, 3.2, -2.1, 4.8],
    riskFreeRate: 2
  });

  const [var, setVar] = useState({
    returns: [2.5, 3.1, -1.2, 4.5, 2.8, -0.5, 1.9, 3.2, -2.1, 4.8],
    confidence: 95,
    timeHorizon: 1
  });

  const [assetAllocation, setAssetAllocation] = useState({
    totalAmount: 100000,
    allocations: [
      { name: 'Azioni', percentage: 60, riskLevel: 'Alto' },
      { name: 'Obbligazioni', percentage: 30, riskLevel: 'Basso' },
      { name: 'Commodity', percentage: 10, riskLevel: 'Medio' }
    ]
  });

  const [rebalancing, setRebalancing] = useState({
    currentAllocations: [
      { assetClass: 'Azioni', amount: 65000 },
      { assetClass: 'Obbligazioni', amount: 28000 },
      { assetClass: 'Commodity', amount: 7000 }
    ],
    targetAllocations: [
      { assetClass: 'Azioni', percentage: 60 },
      { assetClass: 'Obbligazioni', percentage: 30 },
      { assetClass: 'Commodity', percentage: 10 }
    ],
    totalValue: 100000
  });

  const [transactionCosts, setTransactionCosts] = useState({
    amount: 10000,
    commissionRate: 0.1,
    taxRate: 26
  });

  const handleCalculate = (calculator, data) => {
    let result;
    switch (calculator) {
      case 'compoundInterest':
        result = calculateCompoundInterest(data.principal, data.rate, data.time, data.frequency);
        break;
      case 'annualizedReturn':
        result = calculateAnnualizedReturn(data.initialValue, data.finalValue, data.timeInYears);
        break;
      case 'inflation':
        result = calculateInflationImpact(data.amount, data.inflationRate, data.years);
        break;
      case 'mortgage':
        result = calculateMortgage(data.principal, data.annualRate, data.years, data.paymentFrequency);
        break;
      case 'diversification':
        result = calculateDiversification(data.weights);
        break;
      case 'correlation':
        result = calculateCorrelation(data.returns1, data.returns2);
        break;
      case 'volatility':
        result = calculateVolatility(data.returns, data.period);
        break;
      case 'sharpeRatio':
        result = calculateSharpeRatio(data.returns, data.riskFreeRate);
        break;
      case 'var':
        result = calculateVaR(data.returns, data.confidence, data.timeHorizon);
        break;
      case 'assetAllocation':
        result = calculateAssetAllocation(data.totalAmount, data.allocations);
        break;
      case 'rebalancing':
        result = calculateRebalancing(data.currentAllocations, data.targetAllocations, data.totalValue);
        break;
      case 'transactionCosts':
        result = calculateTransactionCosts(data.amount, data.commissionRate, data.taxRate);
        break;
      default:
        return;
    }
    setResults(prev => ({ ...prev, [calculator]: result }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Strumenti Finanziari</h1>
          <p className="text-sm text-gray-600">
            Calcolatori e strumenti per la gestione del portafoglio
          </p>
        </div>
        
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Esporta
        </Button>
      </div>

      {/* Tabs principali */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculators">Calcolatori</TabsTrigger>
          <TabsTrigger value="analysis">Analisi</TabsTrigger>
          <TabsTrigger value="planning">Pianificazione</TabsTrigger>
        </TabsList>

        <TabsContent value="calculators" className="space-y-6">
          {/* Interesse Composto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Calcolatore Interesse Composto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="principal">Capitale Iniziale (€)</Label>
                  <Input
                    id="principal"
                    type="number"
                    value={compoundInterest.principal}
                    onChange={(e) => setCompoundInterest(prev => ({ ...prev, principal: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="rate">Tasso di Interesse (%)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.1"
                    value={compoundInterest.rate}
                    onChange={(e) => setCompoundInterest(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Tempo (anni)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={compoundInterest.time}
                    onChange={(e) => setCompoundInterest(prev => ({ ...prev, time: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequenza Capitalizzazione</Label>
                  <select
                    id="frequency"
                    value={compoundInterest.frequency}
                    onChange={(e) => setCompoundInterest(prev => ({ ...prev, frequency: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value={1}>Annuale</option>
                    <option value={2}>Semestrale</option>
                    <option value={4}>Trimestrale</option>
                    <option value={12}>Mensile</option>
                  </select>
                </div>
              </div>
              
              <Button 
                className="mt-4 w-full"
                onClick={() => handleCalculate('compoundInterest', compoundInterest)}
              >
                Calcola
              </Button>

              {results.compoundInterest && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Risultati:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Capitale Iniziale:</strong> {formatCurrency(results.compoundInterest.principal)}</p>
                      <p><strong>Interesse:</strong> {formatCurrency(results.compoundInterest.interest)}</p>
                    </div>
                    <div>
                      <p><strong>Montante Finale:</strong> {formatCurrency(results.compoundInterest.amount)}</p>
                      <p><strong>Tasso:</strong> {formatPercentage(results.compoundInterest.rate)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rendimento Annualizzato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Calcolatore Rendimento Annualizzato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="initialValue">Valore Iniziale (€)</Label>
                  <Input
                    id="initialValue"
                    type="number"
                    value={annualizedReturn.initialValue}
                    onChange={(e) => setAnnualizedReturn(prev => ({ ...prev, initialValue: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="finalValue">Valore Finale (€)</Label>
                  <Input
                    id="finalValue"
                    type="number"
                    value={annualizedReturn.finalValue}
                    onChange={(e) => setAnnualizedReturn(prev => ({ ...prev, finalValue: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="timeInYears">Tempo (anni)</Label>
                  <Input
                    id="timeInYears"
                    type="number"
                    step="0.1"
                    value={annualizedReturn.timeInYears}
                    onChange={(e) => setAnnualizedReturn(prev => ({ ...prev, timeInYears: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
              
              <Button 
                className="mt-4 w-full"
                onClick={() => handleCalculate('annualizedReturn', annualizedReturn)}
              >
                Calcola
              </Button>

              {results.annualizedReturn && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Risultati:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Rendimento Totale:</strong> {formatPercentage(results.annualizedReturn.totalReturn)}</p>
                      <p><strong>Rendimento Annualizzato:</strong> {formatPercentage(results.annualizedReturn.annualizedReturn)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inflazione */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5" />
                Calcolatore Impatto Inflazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inflationAmount">Importo (€)</Label>
                  <Input
                    id="inflationAmount"
                    type="number"
                    value={inflation.amount}
                    onChange={(e) => setInflation(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="inflationRate">Tasso Inflazione (%)</Label>
                  <Input
                    id="inflationRate"
                    type="number"
                    step="0.1"
                    value={inflation.inflationRate}
                    onChange={(e) => setInflation(prev => ({ ...prev, inflationRate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="inflationYears">Anni</Label>
                  <Input
                    id="inflationYears"
                    type="number"
                    value={inflation.years}
                    onChange={(e) => setInflation(prev => ({ ...prev, years: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <Button 
                className="mt-4 w-full"
                onClick={() => handleCalculate('inflation', inflation)}
              >
                Calcola
              </Button>

              {results.inflation && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Risultati:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Importo Originale:</strong> {formatCurrency(results.inflation.originalAmount)}</p>
                      <p><strong>Valore Futuro:</strong> {formatCurrency(results.inflation.futureValue)}</p>
                    </div>
                    <div>
                      <p><strong>Potere d'Acquisto:</strong> {formatCurrency(results.inflation.purchasingPower)}</p>
                      <p><strong>Perdita:</strong> {formatCurrency(results.inflation.loss)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mutuo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Calcolatore Mutuo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mortgagePrincipal">Capitale (€)</Label>
                  <Input
                    id="mortgagePrincipal"
                    type="number"
                    value={mortgage.principal}
                    onChange={(e) => setMortgage(prev => ({ ...prev, principal: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="mortgageRate">Tasso Annuo (%)</Label>
                  <Input
                    id="mortgageRate"
                    type="number"
                    step="0.1"
                    value={mortgage.annualRate}
                    onChange={(e) => setMortgage(prev => ({ ...prev, annualRate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="mortgageYears">Durata (anni)</Label>
                  <Input
                    id="mortgageYears"
                    type="number"
                    value={mortgage.years}
                    onChange={(e) => setMortgage(prev => ({ ...prev, years: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentFrequency">Frequenza Pagamenti</Label>
                  <select
                    id="paymentFrequency"
                    value={mortgage.paymentFrequency}
                    onChange={(e) => setMortgage(prev => ({ ...prev, paymentFrequency: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value={12}>Mensile</option>
                    <option value={4}>Trimestrale</option>
                    <option value={2}>Semestrale</option>
                    <option value={1}>Annuale</option>
                  </select>
                </div>
              </div>
              
              <Button 
                className="mt-4 w-full"
                onClick={() => handleCalculate('mortgage', mortgage)}
              >
                Calcola
              </Button>

              {results.mortgage && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Risultati:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Rata:</strong> {formatCurrency(results.mortgage.monthlyPayment)}</p>
                      <p><strong>Totale Pagato:</strong> {formatCurrency(results.mortgage.totalPayment)}</p>
                    </div>
                    <div>
                      <p><strong>Interessi Totali:</strong> {formatCurrency(results.mortgage.totalInterest)}</p>
                      <p><strong>Tasso:</strong> {formatPercentage(results.mortgage.annualRate)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* Diversificazione */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Analisi Diversificazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Pesi Asset (separati da virgola, %)</Label>
                  <Input
                    placeholder="40, 30, 20, 10"
                    value={diversification.weights.join(', ')}
                    onChange={(e) => setDiversification(prev => ({ 
                      weights: e.target.value.split(',').map(w => parseFloat(w.trim())).filter(w => !isNaN(w))
                    }))}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleCalculate('diversification', diversification)}
                >
                  Analizza
                </Button>

                {results.diversification && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Risultati:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Indice HHI:</strong> {results.diversification.hhi.toFixed(4)}</p>
                        <p><strong>N Effettivo:</strong> {results.diversification.effectiveN.toFixed(2)}</p>
                      </div>
                      <div>
                        <p><strong>Indice Diversificazione:</strong> {formatPercentage(results.diversification.diversificationIndex)}</p>
                        <p><strong>Livello:</strong> {results.diversification.diversificationLevel}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Correlazione */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analisi Correlazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Rendimenti Asset 1 (separati da virgola, %)</Label>
                  <Input
                    placeholder="2.5, 3.1, -1.2, 4.5, 2.8"
                    value={correlation.returns1.join(', ')}
                    onChange={(e) => setCorrelation(prev => ({ 
                      ...prev,
                      returns1: e.target.value.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r))
                    }))}
                  />
                </div>
                <div>
                  <Label>Rendimenti Asset 2 (separati da virgola, %)</Label>
                  <Input
                    placeholder="1.8, 2.9, -0.8, 3.2, 2.1"
                    value={correlation.returns2.join(', ')}
                    onChange={(e) => setCorrelation(prev => ({ 
                      ...prev,
                      returns2: e.target.value.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r))
                    }))}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleCalculate('correlation', correlation)}
                >
                  Analizza
                </Button>

                {results.correlation && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Risultati:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Correlazione:</strong> {results.correlation.correlation.toFixed(4)}</p>
                        <p><strong>Forza:</strong> {results.correlation.strength}</p>
                      </div>
                      <div>
                        <p><strong>Direzione:</strong> {results.correlation.direction}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Volatilità */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Analisi Volatilità
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Rendimenti (separati da virgola, %)</Label>
                  <Input
                    placeholder="2.5, 3.1, -1.2, 4.5, 2.8, -0.5, 1.9, 3.2, -2.1, 4.8"
                    value={volatility.returns.join(', ')}
                    onChange={(e) => setVolatility(prev => ({ 
                      ...prev,
                      returns: e.target.value.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r))
                    }))}
                  />
                </div>
                <div>
                  <Label>Periodo</Label>
                  <select
                    value={volatility.period}
                    onChange={(e) => setVolatility(prev => ({ ...prev, period: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="daily">Giornaliero</option>
                    <option value="weekly">Settimanale</option>
                    <option value="monthly">Mensile</option>
                    <option value="annual">Annuale</option>
                  </select>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleCalculate('volatility', volatility)}
                >
                  Analizza
                </Button>

                {results.volatility && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Risultati:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Deviazione Standard:</strong> {formatPercentage(results.volatility.standardDeviation)}</p>
                        <p><strong>Varianza:</strong> {formatPercentage(results.volatility.variance)}</p>
                      </div>
                      <div>
                        <p><strong>Volatilità Annualizzata:</strong> {formatPercentage(results.volatility.annualizedVolatility)}</p>
                        <p><strong>Periodo:</strong> {results.volatility.period}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sharpe Ratio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Sharpe Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Rendimenti (separati da virgola, %)</Label>
                  <Input
                    placeholder="2.5, 3.1, -1.2, 4.5, 2.8, -0.5, 1.9, 3.2, -2.1, 4.8"
                    value={sharpeRatio.returns.join(', ')}
                    onChange={(e) => setSharpeRatio(prev => ({ 
                      ...prev,
                      returns: e.target.value.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r))
                    }))}
                  />
                </div>
                <div>
                  <Label>Tasso Privo di Rischio (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={sharpeRatio.riskFreeRate}
                    onChange={(e) => setSharpeRatio(prev => ({ ...prev, riskFreeRate: parseFloat(e.target.value) }))}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleCalculate('sharpeRatio', sharpeRatio)}
                >
                  Calcola
                </Button>

                {results.sharpeRatio && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Risultati:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Sharpe Ratio:</strong> {results.sharpeRatio.sharpeRatio.toFixed(4)}</p>
                        <p><strong>Rendimento Eccesso:</strong> {formatPercentage(results.sharpeRatio.excessReturn)}</p>
                      </div>
                      <div>
                        <p><strong>Volatilità:</strong> {formatPercentage(results.sharpeRatio.volatility)}</p>
                        <p><strong>Interpretazione:</strong> {results.sharpeRatio.interpretation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* VaR */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Value at Risk (VaR)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Rendimenti (separati da virgola, %)</Label>
                  <Input
                    placeholder="2.5, 3.1, -1.2, 4.5, 2.8, -0.5, 1.9, 3.2, -2.1, 4.8"
                    value={var.returns.join(', ')}
                    onChange={(e) => setVar(prev => ({ 
                      ...prev,
                      returns: e.target.value.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r))
                    }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Livello di Confidenza (%)</Label>
                    <Input
                      type="number"
                      value={var.confidence}
                      onChange={(e) => setVar(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Orizzonte Temporale (anni)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={var.timeHorizon}
                      onChange={(e) => setVar(prev => ({ ...prev, timeHorizon: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleCalculate('var', var)}
                >
                  Calcola
                </Button>

                {results.var && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Risultati:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>VaR:</strong> {formatPercentage(results.var.varValue)}</p>
                        <p><strong>VaR Aggiustato:</strong> {formatPercentage(results.var.adjustedVaR)}</p>
                      </div>
                      <div>
                        <p><strong>Confidenza:</strong> {results.var.confidence}%</p>
                        <p><strong>Orizzonte:</strong> {results.var.timeHorizon} anni</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{results.var.interpretation}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          {/* Asset Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Pianificazione Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Capitale Totale (€)</Label>
                  <Input
                    type="number"
                    value={assetAllocation.totalAmount}
                    onChange={(e) => setAssetAllocation(prev => ({ ...prev, totalAmount: parseFloat(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Allocazioni</Label>
                  {assetAllocation.allocations.map((allocation, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Nome asset"
                        value={allocation.name}
                        onChange={(e) => {
                          const newAllocations = [...assetAllocation.allocations];
                          newAllocations[index].name = e.target.value;
                          setAssetAllocation(prev => ({ ...prev, allocations: newAllocations }));
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="%"
                        value={allocation.percentage}
                        onChange={(e) => {
                          const newAllocations = [...assetAllocation.allocations];
                          newAllocations[index].percentage = parseFloat(e.target.value);
                          setAssetAllocation(prev => ({ ...prev, allocations: newAllocations }));
                        }}
                      />
                      <select
                        value={allocation.riskLevel}
                        onChange={(e) => {
                          const newAllocations = [...assetAllocation.allocations];
                          newAllocations[index].riskLevel = e.target.value;
                          setAssetAllocation(prev => ({ ...prev, allocations: newAllocations }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Basso">Basso</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                      </select>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleCalculate('assetAllocation', assetAllocation)}
                >
                  Pianifica
                </Button>

                {results.assetAllocation && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Risultati:</h4>
                    <div className="space-y-2">
                      {results.assetAllocation.allocations.map((allocation, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{allocation.assetClass}</span>
                          <span>{formatCurrency(allocation.amount)} ({allocation.percentage}%)</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Totale Allocato:</span>
                          <span>{formatPercentage(results.assetAllocation.totalAllocated)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Non Allocato:</span>
                          <span>{formatPercentage(results.assetAllocation.unallocated)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rebalancing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Calcolatore Rebalancing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Valore Totale Portafoglio (€)</Label>
                  <Input
                    type="number"
                    value={rebalancing.totalValue}
                    onChange={(e) => setRebalancing(prev => ({ ...prev, totalValue: parseFloat(e.target.value) }))}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleCalculate('rebalancing', rebalancing)}
                >
                  Calcola Rebalancing
                </Button>

                {results.rebalancing && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Risultati:</h4>
                    <div className="space-y-2">
                      {results.rebalancing.rebalancing.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.assetClass}</span>
                          <span className={item.difference > 0 ? 'text-green-600' : 'text-red-600'}>
                            {item.action} {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Totale Rebalancing:</span>
                          <span>{formatCurrency(results.rebalancing.totalRebalancing)}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {results.rebalancing.needsRebalancing ? 
                            '🟡 Rebalancing necessario (>5%)' : 
                            '🟢 Portafoglio bilanciato'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Costi di Transazione */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Calcolatore Costi di Transazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transactionAmount">Importo Transazione (€)</Label>
                  <Input
                    id="transactionAmount"
                    type="number"
                    value={transactionCosts.amount}
                    onChange={(e) => setTransactionCosts(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="commissionRate">Commissione (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    step="0.01"
                    value={transactionCosts.commissionRate}
                    onChange={(e) => setTransactionCosts(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tassazione (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={transactionCosts.taxRate}
                    onChange={(e) => setTransactionCosts(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
              
              <Button 
                className="mt-4 w-full"
                onClick={() => handleCalculate('transactionCosts', transactionCosts)}
              >
                Calcola
              </Button>

              {results.transactionCosts && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Risultati:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Importo Lordo:</strong> {formatCurrency(results.transactionCosts.grossAmount)}</p>
                      <p><strong>Commissione:</strong> {formatCurrency(results.transactionCosts.commission)}</p>
                    </div>
                    <div>
                      <p><strong>Tasse:</strong> {formatCurrency(results.transactionCosts.tax)}</p>
                      <p><strong>Importo Netto:</strong> {formatCurrency(results.transactionCosts.netAmount)}</p>
                    </div>
                    <div className="col-span-2">
                      <p><strong>Costi Totali:</strong> {formatCurrency(results.transactionCosts.totalCosts)}</p>
                      <p><strong>% Costi:</strong> {formatPercentage(results.transactionCosts.costRatio)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer con azioni rapide */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Calculator className="w-5 h-5 mb-1" />
            <span className="text-xs">Calcolatori</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs">Analisi</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Target className="w-5 h-5 mb-1" />
            <span className="text-xs">Pianificazione</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tools;