import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import NewsCard from '../components/NewsCard';
import toast from 'react-hot-toast';

export default function Category() {
  const { slug } = useParams();
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    fetchCategory();
  }, [slug]);

  const fetchNews = async () => {
    try {
      const res = await api.get(`/news?category=${slug}`);
      setNews(res.data.news);
    } catch (error) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await api.get('/categories');
      const cat = res.data.categories.find(c => c.slug === slug);
      setCategory(cat);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        {category && (
          <div className="mb-8">
            <div
              className="inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-4"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </div>
            <p className="text-gray-600">{category.description}</p>
            <p className="text-sm text-gray-500 mt-2">{news.length} articles</p>
          </div>
        )}

        {/* News Grid */}
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No news found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
