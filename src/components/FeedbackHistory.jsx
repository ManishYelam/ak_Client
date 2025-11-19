import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import feedbackService from '../services/feedbackService';
import { 
  FaStar, 
  FaClock, 
  FaTag, 
  FaArrowLeft, 
  FaCommentDots,
  FaExclamationCircle,
  FaLightbulb,
  FaPalette,
  FaRocket,
  FaReply,
  FaHistory
} from 'react-icons/fa';

const FeedbackHistory = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchFeedback = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await feedbackService.getUserFeedback(page, pagination.limit);
      
      // Handle the API response structure
      if (response.success && response.data) {
        const feedbackData = response.data.feedbacks || [];
        const paginationData = response.data.pagination || {};
        
        setFeedback(feedbackData);
        setPagination(prev => ({
          ...prev,
          page: paginationData.currentPage || page,
          total: paginationData.totalItems || feedbackData.length,
          pages: paginationData.totalPages || Math.ceil((paginationData.totalItems || feedbackData.length) / pagination.limit)
        }));
      } else {
        setError('Failed to load feedback data');
        setFeedback([]);
      }
    } catch (error) {
      console.error('Error fetching feedback history:', error);
      setError(error.message || 'Failed to load feedback history');
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800 border-blue-200',
      bug: 'bg-red-100 text-red-800 border-red-200',
      feature: 'bg-green-100 text-green-800 border-green-200',
      ui: 'bg-purple-100 text-purple-800 border-purple-200',
      performance: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[category] || colors.general;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      general: FaCommentDots,
      bug: FaExclamationCircle,
      feature: FaLightbulb,
      ui: FaPalette,
      performance: FaRocket
    };
    const IconComponent = icons[category] || FaCommentDots;
    return <IconComponent className="inline mr-1" size={12} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-orange-100 text-orange-800', // Added this line
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-sm ${
              i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FaHistory className="text-purple-600" />
          My Feedback History
        </h1>
        <p className="text-gray-600 mt-2">
          Review your previous feedback submissions and track their status.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Unable to load feedback</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {feedback.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FaCommentDots className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback submitted yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Your feedback helps us improve the system. Share your thoughts and suggestions to help us serve you better.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          feedback.map((item) => (
            <div 
              key={item.feedback_id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {renderStars(item.rating)}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                      {getCategoryIcon(item.category)}
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                    <FaClock size={10} />
                    {formatDate(item.createdAt)}
                  </div>
                </div>
                
                {/* Message */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {item.message}
                  </p>
                </div>
                
                {/* Metadata */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>ID: #{item.feedback_id}</span>
                    {item.updatedAt && item.updatedAt !== item.createdAt && (
                      <span>Updated: {formatDate(item.updatedAt)}</span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    via {item.user_agent?.includes('Postman') ? 'API' : 'Web'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => fetchFeedback(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
          </div>
          
          <button
            onClick={() => fetchFeedback(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackHistory;