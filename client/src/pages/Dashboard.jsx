import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Eye, Heart, MessageCircle, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/news');
      const allNews = res.data.news;
      
      setNews(allNews);
      setStats({
        total: allNews.length,
        published: allNews.filter(n => n.status === 'published').length,
        draft: allNews.filter(n => n.status === 'draft').length
      });
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this news?')) return;

    try {
      await api.delete(`/news/${id}`);
      toast.success('News deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete news');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <LayoutDashboard className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Articles</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Published</h3>
            <p className="text-3xl font-bold text-green-600">{stats.published}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Drafts</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
          </div>
        </div>

        {/* News List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Articles</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <Link to={`/news/${item.slug}`} className="text-blue-600 hover:underline font-medium">
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Eye size={16} />
                          <span>{item.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart size={16} />
                          <span>{item.likes_count}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle size={16} />
                          <span>{item.comments_count}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
