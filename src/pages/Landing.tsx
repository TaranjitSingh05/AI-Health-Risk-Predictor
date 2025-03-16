import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, ExternalLink, Loader2, Heart, Brain, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchHealthNews, NewsArticle } from '../services/newsService';

const Landing = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const articles = await fetchHealthNews();
        setNews(articles.slice(0, 8)); // Limit to 8 articles
        setLoading(false);
      } catch (error) {
        console.error('Error loading news:', error);
        setLoading(false);
      }
    };

    loadNews();
    // Refresh news every 30 minutes
    const interval = setInterval(loadNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const renderNews = () => (
    <div className="pb-24">
      <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
        Latest Health News
      </h2>
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {news.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                window.open(article.url, '_blank', 'noopener,noreferrer');
              }}
              className={`group rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 
                ${isDark ? 'bg-dark-bg/80 hover:bg-dark-bg/90' : 'bg-white/90 hover:bg-white'} 
                backdrop-blur-md hover:shadow-2xl cursor-pointer`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.urlToImage || 'https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=800'}
                  alt={article.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${isDark ? 'bg-primary-accent/20 text-primary-accent' : 'bg-primary/10 text-primary'}`}>
                    {article.source.name}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className={`text-xl font-semibold mb-2 flex items-center justify-between
                  ${isDark ? 'text-gray-100' : 'text-gray-800'} group-hover:text-primary transition-colors`}>
                  {article.title}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
                  {article.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark ? 'bg-dark-bg text-gray-100' : 'bg-gradient-to-br from-primary-pale to-primary-bright'
    }`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className={`block bg-clip-text text-transparent bg-gradient-to-r 
                ${isDark ? 'from-primary-light to-primary-bright' : 'from-primary to-primary-accent'}`}>
                AI-Powered
              </span>
              <span className={`block mt-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                Health Risk Predictor
              </span>
            </h1>
            <p className={`mt-6 max-w-2xl mx-auto text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Advanced disease detection and stroke risk assessment powered by artificial intelligence.
              Get started today to access our comprehensive health analysis tools.
            </p>
            <div className="mt-10">
              <button
                onClick={() => navigate('/features')}
                className="px-8 py-4 rounded-full text-lg font-medium text-white 
                  bg-gradient-to-r from-primary to-primary-accent 
                  hover:from-primary-light hover:to-primary-bright
                  transform hover:scale-105 hover:shadow-[0_0_30px_rgba(87,204,153,0.5)]
                  transition-all duration-300 shadow-xl"
              >
                <span className="flex items-center">
                  Get Started
                  <ArrowRight className="inline-block ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {renderNews()}
      </div>
    </div>
  );
};

export default Landing;