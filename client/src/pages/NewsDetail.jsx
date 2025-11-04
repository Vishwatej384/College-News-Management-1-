import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function NewsDetail() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    fetchNews();
    fetchComments();
  }, [slug]);

  const fetchNews = async () => {
    try {
      const res = await api.get(`/news/${slug}`);
      setNews(res.data.news);
    } catch (error) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/news/${slug}`);
      setComments(res.data.comments);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like');
      return;
    }

    try {
      const res = await api.post(`/news/${news.id}/like`);
      setLiked(res.data.liked);
      setNews({ ...news, likes_count: news.likes_count + (res.data.liked ? 1 : -1) });
      toast.success(res.data.message);
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark');
      return;
    }

    try {
      const res = await api.post(`/news/${news.id}/bookmark`);
      setBookmarked(res.data.bookmarked);
      toast.success(res.data.message);
    } catch (error) {
      toast.error('Failed to bookmark');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    try {
      await api.post('/comments', {
        news_id: news.id,
        content: commentText
      });
      setCommentText('');
      fetchComments();
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">News not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Badge */}
        {news.category_name && (
          <Link
            to={`/category/${news.category_slug}`}
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: news.category_color }}
          >
            {news.category_name}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{news.title}</h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center space-x-2">
            <User size={18} />
            <span>{news.author_name}</span>
            {news.author_department && <span>• {news.author_department}</span>}
          </div>
          <div className="flex items-center space-x-2">
            <Calendar size={18} />
            <span>{formatDistanceToNow(new Date(news.published_at), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye size={18} />
            <span>{news.views} views</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              liked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
            <span>{news.likes_count}</span>
          </button>
          <button
            onClick={handleBookmark}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              bookmarked ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>

        {/* Featured Image */}
        {news.featured_image && (
          <img
            src={news.featured_image}
            alt={news.title}
            className="w-full h-96 object-cover rounded-xl mb-8"
          />
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {news.content}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <MessageCircle size={24} />
            <span>Comments ({comments.length})</span>
          </h3>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                rows="3"
                required
              />
              <button type="submit" className="mt-2 btn-primary">
                Post Comment
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                <Link to="/login" className="text-primary-600 hover:underline">Login</Link> to post a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-primary-200 pl-4 py-2">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-gray-900">{comment.user_name}</span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
