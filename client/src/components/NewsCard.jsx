import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NewsCard({ news }) {
  return (
    <Link to={`/news/${news.slug}`} className="card group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={news.featured_image || 'https://via.placeholder.com/400x300?text=News+Image'}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {news.is_featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        {news.category_name && (
          <div 
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: news.category_color }}
          >
            {news.category_name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {news.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {news.excerpt || news.content?.substring(0, 150)}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User size={16} />
              <span>{news.author_name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{formatDistanceToNow(new Date(news.published_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye size={16} />
            <span>{news.views || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart size={16} />
            <span>{news.likes_count || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle size={16} />
            <span>{news.comments_count || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
