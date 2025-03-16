import axios from 'axios';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

// Fallback news data in case API is not available
const fallbackNews: NewsArticle[] = [
  {
    title: "AI Breakthrough in Early Disease Detection",
    description: "New AI algorithms show promising results in early detection of various diseases, potentially revolutionizing preventive healthcare.",
    url: "https://example.com/ai-health",
    urlToImage: "https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Health Tech Today" }
  },
  {
    title: "Machine Learning Advances in Healthcare",
    description: "Recent developments in machine learning are transforming how we approach medical diagnostics and treatment planning.",
    url: "https://example.com/ml-health",
    urlToImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Medical AI Journal" }
  },
  {
    title: "Future of Preventive Healthcare",
    description: "How artificial intelligence and predictive analytics are shaping the future of preventive healthcare and personalized medicine.",
    url: "https://example.com/future-health",
    urlToImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Health Innovation" }
  },
  {
    title: "Digital Health Transformation",
    description: "The ongoing digital transformation in healthcare is creating new opportunities for better patient care and disease prevention.",
    url: "https://example.com/digital-health",
    urlToImage: "https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Digital Health Weekly" }
  },
  {
    title: "AI in Medical Imaging",
    description: "How artificial intelligence is revolutionizing medical imaging and improving diagnostic accuracy.",
    url: "https://example.com/ai-imaging",
    urlToImage: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Medical Imaging Today" }
  },
  {
    title: "Personalized Medicine Breakthroughs",
    description: "New advances in AI-driven personalized medicine are leading to more effective treatments.",
    url: "https://example.com/personalized-medicine",
    urlToImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Future Medicine" }
  },
  {
    title: "Healthcare Data Analytics",
    description: "Big data and analytics are transforming how we understand and predict health outcomes.",
    url: "https://example.com/health-analytics",
    urlToImage: "https://images.unsplash.com/photo-1576089172869-4f5f6f315620?q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Health Analytics Weekly" }
  },
  {
    title: "Remote Health Monitoring",
    description: "AI-powered remote health monitoring systems are making healthcare more accessible and efficient.",
    url: "https://example.com/remote-health",
    urlToImage: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Digital Health News" }
  }
];

export const fetchHealthNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'healthcare AI OR medical technology OR disease prevention',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 12, // Increased to 12 articles
        apiKey: import.meta.env.VITE_NEWS_API_KEY
      }
    });

    if (response.data.articles && response.data.articles.length > 0) {
      return response.data.articles;
    }

    // Return fallback news if API returns empty results
    return fallbackNews;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return fallback news in case of API error
    return fallbackNews;
  }
};