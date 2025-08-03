import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { 
  Calculator, TrendingUp, ArrowLeftRight, Shield, FileUp, FileDown, 
  Banknote, Brain, Sparkles, BarChart, Euro, DollarSign, Upload, 
  Download, Camera, FileText, Bell, Calendar, AlertCircle, CheckCircle,
  Eye, Trash2, Edit, Save
} from 'lucide-react';
import { toolsData } from '../data/mock';

const Tools = () => {
  const { calculators, importExport, aiTools } = toolsData;
  const [activeCalculator, setActiveCalculator] = useState(null);
  const [taxResult, setTaxResult] = useState(null);
  const [yieldResult, setYieldResult] = useState(null);
  const [currencyResult, setCurrencyResult] = useState(null);

  // Tax Calculator
  const calculateTax = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const gain = parseFloat(formData.get('gain'));
    const holdingPeriod = parseInt(formData.get('holdingPeriod'));
    
    let taxRate = holdingPeriod > 365 ? 0.20 : 0.26; // Long-term vs short-term
    let taxAmount = gain * taxRate;
    
    setTaxResult({
      gain,
      taxRate: taxRate * 100,
      taxAmount,
      netGain: gain - taxAmount
    });
  };

  // Yield Calculator
  const calculateYield = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const principal = parseFloat(formData.get('principal'));
    const rate = parseFloat(formData.get('rate')) / 100;
    const years = parseInt(formData.get('years'));
    
    const futureValue = principal * Math.pow(1 + rate, years);
    const totalReturn = futureValue - principal;
    
    setYieldResult({
      principal,
      futureValue,
      totalReturn,
      annualizedReturn: (rate * 100).toFixed(2)
    });
  };

  // Currency Converter
  const convertCurrency = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = parseFloat(formData.get('amount'));
    const from = formData.get('from');
    const to = formData.get('to');
    
    // Mock exchange rates
    const rates = {
      'EUR-USD': 1.0892,
      'USD-EUR': 0.9181,
      'EUR-GBP': 0.8651,
      'GBP-EUR': 1.1558
    };
    
    const rate = rates[`${from}-${to}`] || 1;
    const converted = amount * rate;
    
    setCurrencyResult({
      amount,
      from,
      to,
      rate,
      converted
    });
  };

  const ToolCard = ({ tool, onClick }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
          {React.createElement(
            eval(tool.icon), 
            { className: "h-6 w-6 text-white" }
          )}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
        <p className="text-sm text-gray-600">{tool.description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* AI Tools Section */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Strumenti AI Avanzati</span>
            <Badge className="bg-white/20 text-white hover:bg-white/30">Pro</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {aiTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2 mb-3">
                  {React.createElement(
                    eval(tool.icon),
                    { className: "h-5 w-5" }
                  )}
                  <h4 className="font-semibold">{tool.name}</h4>
                  <Badge 
                    variant={tool.status === 'active' ? 'secondary' : 'destructive'}
                    className={tool.status === 'active' ? 'bg-green-500/20 text-green-200' : 'bg-orange-500/20 text-orange-200'}
                  >
                    {tool.status}
                  </Badge>
                </div>
                <p className="text-sm text-white/90">{tool.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="calculators" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculators">Calcolatori</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          <TabsTrigger value="advanced">Avanzati</TabsTrigger>
        </TabsList>

        <TabsContent value="calculators" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {calculators.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => setActiveCalculator(tool.id)}
              />
            ))}
          </div>

          {/* Calculator Modals */}
          {activeCalculator === 'tax-calc' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Calcolatore Tasse su Capital Gains</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={calculateTax} className="space-y-4">
                  <div>
                    <Label htmlFor="gain">Guadagno (€)</Label>
                    <Input type="number" name="gain" placeholder="Es. 5000" required />
                  </div>
                  <div>
                    <Label htmlFor="holdingPeriod">Periodo di detenzione (giorni)</Label>
                    <Input type="number" name="holdingPeriod" placeholder="Es. 400" required />
                  </div>
                  <Button type="submit" className="w-full">Calcola Tasse</Button>
                </form>
                
                {taxResult && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Risultato Calcolo:</h4>
                    <div className="space-y-2 text-sm">
                      <div>Guadagno lordo: €{taxResult.gain.toFixed(2)}</div>
                      <div>Aliquota fiscale: {taxResult.taxRate}%</div>
                      <div>Tasse da pagare: €{taxResult.taxAmount.toFixed(2)}</div>
                      <div className="font-semibold text-green-600">
                        Guadagno netto: €{taxResult.netGain.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeCalculator === 'yield-calc' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Calcolatore Rendimento</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={calculateYield} className="space-y-4">
                  <div>
                    <Label htmlFor="principal">Capitale iniziale (€)</Label>
                    <Input type="number" name="principal" placeholder="Es. 10000" required />
                  </div>
                  <div>
                    <Label htmlFor="rate">Rendimento annuo atteso (%)</Label>
                    <Input type="number" step="0.1" name="rate" placeholder="Es. 7.5" required />
                  </div>
                  <div>
                    <Label htmlFor="years">Periodo di investimento (anni)</Label>
                    <Input type="number" name="years" placeholder="Es. 10" required />
                  </div>
                  <Button type="submit" className="w-full">Calcola Rendimento</Button>
                </form>
                
                {yieldResult && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Proiezione Investimento:</h4>
                    <div className="space-y-2 text-sm">
                      <div>Capitale iniziale: €{yieldResult.principal.toFixed(2)}</div>
                      <div>Valore finale: €{yieldResult.futureValue.toFixed(2)}</div>
                      <div className="font-semibold text-green-600">
                        Guadagno totale: €{yieldResult.totalReturn.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeCalculator === 'currency-calc' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowLeftRight className="h-5 w-5" />
                  <span>Convertitore Valute</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={convertCurrency} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Importo</Label>
                    <Input type="number" step="0.01" name="amount" placeholder="Es. 1000" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from">Da</Label>
                      <select name="from" className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="to">A</Label>
                      <select name="to" className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Converti</Button>
                </form>
                
                {currencyResult && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Conversione:</h4>
                    <div className="space-y-2 text-sm">
                      <div>{currencyResult.amount} {currencyResult.from}</div>
                      <div className="text-center">↓ (Tasso: {currencyResult.rate})</div>
                      <div className="font-semibold text-blue-600">
                        {currencyResult.converted.toFixed(2)} {currencyResult.to}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="import-export" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {importExport.map((tool) => (
              <Card key={tool.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${
                    tool.type === 'import' ? 'bg-green-100' :
                    tool.type === 'export' ? 'bg-blue-100' : 'bg-purple-100'
                  } mb-4 flex items-center justify-center`}>
                    {React.createElement(
                      eval(tool.icon),
                      { 
                        className: `h-6 w-6 ${
                          tool.type === 'import' ? 'text-green-600' :
                          tool.type === 'export' ? 'text-blue-600' : 'text-purple-600'
                        }`
                      }
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strumenti Avanzati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Funzionalità Avanzate</h3>
                <p className="text-gray-600 mb-4">
                  Strumenti di analisi professionale e automazione AI
                </p>
                <Button>Scopri di più</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tools;