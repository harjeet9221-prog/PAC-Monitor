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
  const { toast } = useToast();
  
  // States for different tools
  const [activeCalculator, setActiveCalculator] = useState(null);
  const [taxResult, setTaxResult] = useState(null);
  const [yieldResult, setYieldResult] = useState(null);
  const [currencyResult, setCurrencyResult] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  
  // File upload ref
  const fileInputRef = useRef(null);

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

    toast({
      title: "Calcolo completato",
      description: `Tasse calcolate: €${taxAmount.toFixed(2)}`,
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

    toast({
      title: "Proiezione calcolata",
      description: `Valore finale: €${futureValue.toFixed(2)}`,
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

    toast({
      title: "Conversione completata",
      description: `${amount} ${from} = ${converted.toFixed(2)} ${to}`,
    });
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload and analysis
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => f.id === newFile.id ? { ...f, status: 'analyzing' } : f)
        );

        setTimeout(() => {
          const analysisResult = {
            fileId: newFile.id,
            insights: generateMockAnalysis(file),
            confidence: Math.floor(Math.random() * 30) + 70
          };

          setAnalysisResults(prev => [...prev, analysisResult]);
          setUploadedFiles(prev => 
            prev.map(f => f.id === newFile.id ? { ...f, status: 'completed' } : f)
          );

          toast({
            title: "Analisi completata",
            description: `${file.name} analizzato con successo`,
          });
        }, 2000);
      }, 1000);
    });
  };

  // Generate mock analysis based on file type
  const generateMockAnalysis = (file) => {
    if (file.type.includes('pdf')) {
      return [
        "Documento finanziario rilevato",
        "Identificate 5 transazioni di investimento", 
        "Performance media: +8.2% annuo",
        "Raccomandazione: diversificare portafoglio"
      ];
    } else if (file.type.includes('image')) {
      return [
        "Grafico finanziario riconosciuto",
        "Trend rialzista identificato",
        "Pattern di crescita sostenibile",
        "Livello di supporto a €45.30"
      ];
    } else {
      return [
        "Dati strutturati rilevati",
        "Format compatibile per import",
        "Transazioni pronte per elaborazione"
      ];
    }
  };

  // Add Reminder
  const addReminder = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newReminder = {
      id: Date.now(),
      title: formData.get('title'),
      description: formData.get('description'),
      date: formData.get('date'),
      time: formData.get('time'),
      priority: formData.get('priority'),
      status: 'active',
      createdAt: new Date()
    };

    setReminders(prev => [...prev, newReminder]);
    e.target.reset();

    toast({
      title: "Promemoria creato",
      description: `${newReminder.title} programmato per ${newReminder.date}`,
    });
  };

  // Export Data
  const exportData = (format) => {
    const data = {
      portfolioData: "Mock portfolio data...",
      reminders: reminders,
      calculations: { taxResult, yieldResult, currencyResult },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pac-monitor-backup.${format}`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export completato",
      description: `Dati esportati in formato ${format.toUpperCase()}`,
    });
  };

  // Get icon component
  const getIcon = (iconName) => {
    const icons = {
      Calculator, TrendingUp, ArrowLeftRight, Shield, FileUp, FileDown, 
      Brain, Sparkles, BarChart, Upload, Download, Camera, FileText,
      Bell, Calendar
    };
    return icons[iconName] || Calculator;
  };

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
            {aiTools.map((tool) => {
              const IconComponent = getIcon(tool.icon);
              return (
                <div
                  key={tool.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <IconComponent className="h-5 w-5" />
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
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="calculators" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculators">Calcolatori</TabsTrigger>
          <TabsTrigger value="files">File & Analisi</TabsTrigger>
          <TabsTrigger value="reminders">Promemoria</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* CALCOLATORI TAB */}
        <TabsContent value="calculators" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {calculators.map((tool) => {
              const IconComponent = getIcon(tool.icon);
              return (
                <Card
                  key={tool.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                  onClick={() => setActiveCalculator(tool.id)}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tax Calculator */}
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
                    <Label htmlFor="gain">Guadagno Totale (€)</Label>
                    <Input type="number" name="gain" placeholder="Es. 5000" required />
                  </div>
                  <div>
                    <Label htmlFor="holdingPeriod">Periodo di detenzione (giorni)</Label>
                    <Input type="number" name="holdingPeriod" placeholder="Es. 400" required />
                  </div>
                  <Button type="submit" className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcola Tasse
                  </Button>
                </form>
                
                {taxResult && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Risultato Calcolo:
                    </h4>
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

          {/* Yield Calculator */}
          {activeCalculator === 'yield-calc' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Calcolatore Rendimento Investimento</span>
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
                  <Button type="submit" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Calcola Rendimento
                  </Button>
                </form>
                
                {yieldResult && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Proiezione Investimento:
                    </h4>
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

          {/* Currency Calculator */}
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
                  <Button type="submit" className="w-full">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Converti
                  </Button>
                </form>
                
                {currencyResult && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Conversione:
                    </h4>
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

        {/* FILE & ANALISI TAB */}
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Caricamento e Analisi File</span>
                <Badge variant="secondary">PDF, JPG, PNG, CSV</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx"
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Carica File per Analisi AI
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">PDF Reports</p>
                    <p className="text-xs text-gray-400">Analisi documenti finanziari</p>
                  </div>
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Grafici & Foto</p>
                    <p className="text-xs text-gray-400">Riconoscimento pattern</p>
                  </div>
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileDown className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Dati CSV</p>
                    <p className="text-xs text-gray-400">Import transazioni</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>File Caricati & Analisi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => {
                    const analysis = analysisResults.find(a => a.fileId === file.id);
                    return (
                      <div key={file.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">{file.name}</span>
                          </div>
                          <Badge variant={
                            file.status === 'completed' ? 'default' : 
                            file.status === 'analyzing' ? 'secondary' : 'destructive'
                          }>
                            {file.status === 'completed' ? 'Completato' :
                             file.status === 'analyzing' ? 'Analizzando...' : 'Caricamento...'}
                          </Badge>
                        </div>
                        
                        {analysis && (
                          <div className="mt-3 p-3 bg-indigo-50 rounded-md">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-indigo-900">Analisi AI</h5>
                              <Badge variant="secondary">
                                Confidenza: {analysis.confidence}%
                              </Badge>
                            </div>
                            <ul className="space-y-1">
                              {analysis.insights.map((insight, idx) => (
                                <li key={idx} className="text-sm text-indigo-700 flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* PROMEMORIA TAB */}
        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Crea Promemoria & Avvisi</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addReminder} className="space-y-4">
                <div>
                  <Label htmlFor="title">Titolo</Label>
                  <Input name="title" placeholder="Es. Revisione portafoglio mensile" required />
                </div>
                <div>
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea name="description" placeholder="Dettagli del promemoria..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input type="date" name="date" required />
                  </div>
                  <div>
                    <Label htmlFor="time">Ora</Label>
                    <Input type="time" name="time" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="priority">Priorità</Label>
                  <select name="priority" className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="low">Bassa</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Crea Promemoria
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reminders List */}
          {reminders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>I Tuoi Promemoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className={`border rounded-lg p-4 ${
                      reminder.priority === 'high' ? 'border-red-200 bg-red-50' :
                      reminder.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-green-200 bg-green-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{reminder.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{reminder.date} alle {reminder.time}</span>
                            </span>
                            <Badge variant="outline" size="sm">
                              {reminder.priority}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* BACKUP TAB */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Import/Export Dati</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Esporta Dati</span>
                  </h4>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => exportData('json')}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Esporta JSON Completo
                    </Button>
                    <Button 
                      onClick={() => exportData('csv')}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Esporta CSV Transazioni
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Report PDF Completo
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Importa Dati</span>
                  </h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileUp className="h-4 w-4 mr-2" />
                      Importa da CSV
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileUp className="h-4 w-4 mr-2" />
                      Importa da Excel
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Banknote className="h-4 w-4 mr-2" />
                      Sincronizza Banca
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Backup Automatico
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  I tuoi dati vengono salvati automaticamente ogni giorno alle 2:00 AM.
                  Ultimo backup: {new Date().toLocaleDateString('it-IT')}
                </p>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Backup Manuale Ora
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tools;