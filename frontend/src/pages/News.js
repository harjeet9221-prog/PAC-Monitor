import React, { useState } from 'react';
import { useMarkets } from '../hooks/useMarkets';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Search, 
  Filter, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Info,
  ExternalLink,
  Bookmark,
  Share2,
  Newspaper,
  Globe,
  DollarSign,
  Coins
} from 'lucide-react';

const News = () => {
  const { news, filterNewsByCategory, filterNewsBySentiment, searchNews, getLatestNews } = useMarkets();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('');
  const [bookmarkedNews, setBookmarkedNews] = useState(new Set());

  const categories = [
    { key: 'Monetary Policy', label: 'Politica Monetaria', icon: DollarSign },
    { key: 'Inflation', label: 'Inflazione', icon: TrendingUp },
    { key: 'Emerging Markets', label: 'Mercati Emergenti', icon: Globe },
    { key: 'Commodities', label: 'Commodity', icon: Coins },
    { key: 'Market Update', label: 'Aggiornamenti', icon: Newspaper }
  ];

  const sentiments = [
    { key: 'positive', label: 'Positivo', color: 'bg-green-100 text-green-800' },
    { key: 'negative', label: 'Negativo', color: 'bg-red-100 text-red-800' },
    { key: 'neutral', label: 'Neutrale', color: 'bg-gray-100 text-gray-800' }
  ];

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(c => c.key === category);
    if (categoryObj) {
      const IconComponent = categoryObj.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <Newspaper className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Ora';
    if (diffInHours < 24) return `${diffInHours}h fa`;
    return date.toLocaleDateString('it-IT');
  };

  const handleBookmark = (newsId) => {
    setBookmarkedNews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const handleShare = (newsItem) => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.summary,
        url: window.location.href
      });
    } else {
      // Fallback per browser che non supportano Web Share API
      navigator.clipboard.writeText(`${newsItem.title}\n\n${newsItem.summary}`);
      alert('Notizia copiata negli appunti!');
    }
  };

  // Filtra le notizie
  let filteredNews = news;
  
  if (searchTerm) {
    filteredNews = searchNews(searchTerm);
  }
  
  if (selectedCategory) {
    filteredNews = filterNewsByCategory(selectedCategory);
  }
  
  if (selectedSentiment) {
    filteredNews = filterNewsBySentiment(selectedSentiment);
  }

  const latestNews = getLatestNews(3);

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notizie Finanziarie</h1>
          <p className="text-sm text-gray-600">
            Ultime notizie dal mondo della finanza
          </p>
        </div>
        
        <Button variant="outline" size="sm">
          <Bookmark className="w-4 h-4 mr-2" />
          Salvate
        </Button>
      </div>

      {/* Filtri e ricerca */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Barra di ricerca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cerca notizie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filtri categoria e sentiment */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Tutte le categorie</option>
                {categories.map(category => (
                  <option key={category.key} value={category.key}>{category.label}</option>
                ))}
              </select>
              
              <select
                value={selectedSentiment}
                onChange={(e) => setSelectedSentiment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Tutti i sentiment</option>
                {sentiments.map(sentiment => (
                  <option key={sentiment.key} value={sentiment.key}>{sentiment.label}</option>
                ))}
              </select>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedSentiment('');
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notizie in evidenza */}
      {latestNews.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Notizie in Evidenza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestNews.map((newsItem) => (
                <div key={newsItem.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(newsItem.category)}
                        <Badge className="bg-white/20 text-white">
                          {newsItem.category}
                        </Badge>
                        <Badge className={getImpactColor(newsItem.impact)}>
                          {newsItem.impact === 'high' ? 'Alto' : newsItem.impact === 'medium' ? 'Medio' : 'Basso'}
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-2">{newsItem.title}</h4>
                      <p className="text-sm opacity-90">{newsItem.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista notizie */}
      <div className="space-y-4">
        {filteredNews.map((newsItem) => (
          <Card key={newsItem.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header notizia */}
                  <div className="flex items-center gap-2 mb-3">
                    {getCategoryIcon(newsItem.category)}
                    <Badge variant="outline">{newsItem.category}</Badge>
                    <Badge className={getSentimentIcon(newsItem.sentiment) ? getImpactColor(newsItem.impact) : ''}>
                      {newsItem.impact === 'high' ? 'Alto' : newsItem.impact === 'medium' ? 'Medio' : 'Basso'}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatDate(newsItem.publishedAt)}
                    </div>
                  </div>
                  
                  {/* Titolo e riassunto */}
                  <h3 className="font-semibold text-lg mb-2">{newsItem.title}</h3>
                  <p className="text-gray-700 mb-3">{newsItem.summary}</p>
                  
                  {/* Fonte e sentiment */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Fonte: {newsItem.source}</span>
                      {getSentimentIcon(newsItem.sentiment)}
                      <span className="text-sm text-gray-600">
                        {newsItem.sentiment === 'positive' ? 'Positivo' : 
                         newsItem.sentiment === 'negative' ? 'Negativo' : 'Neutrale'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Azioni */}
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmark(newsItem.id)}
                    className={bookmarkedNews.has(newsItem.id) ? 'text-blue-600' : ''}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedNews.has(newsItem.id) ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(newsItem)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Nessuna notizia trovata */}
      {filteredNews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna notizia trovata</h3>
            <p className="text-gray-600">
              Prova a modificare i filtri o la ricerca
            </p>
          </CardContent>
        </Card>
      )}

      {/* Footer con azioni rapide */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Newspaper className="w-5 h-5 mb-1" />
            <span className="text-xs">Tutte</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <TrendingUp className="w-5 h-5 mb-1" />
            <span className="text-xs">Positive</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <AlertTriangle className="w-5 h-5 mb-1" />
            <span className="text-xs">Alto Impatto</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <Bookmark className="w-5 h-5 mb-1" />
            <span className="text-xs">Salvate</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default News;