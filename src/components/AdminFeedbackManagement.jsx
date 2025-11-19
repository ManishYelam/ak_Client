import { useState, useEffect } from 'react';
import feedbackService from '../services/feedbackService';
import {
  FaStar,
  FaClock,
  FaTag,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaChartBar,
  FaUsers,
  FaComments,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSync,
  FaEye,
  FaTimes,
  FaEllipsisV,
  FaDownload,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';

const AdminFeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    rating: '',
    search: '',
    page: 1,
    limit: 10
  });

  // Status update form
  const [statusForm, setStatusForm] = useState({
    status: '',
    adminNotes: ''
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { value: 'reviewed', label: 'Reviewed', color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { value: 'in_progress', label: 'In Progress', color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { value: 'resolved', label: 'Resolved', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { value: 'closed', label: 'Closed', color: 'gray', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' }
  ];

  const categoryOptions = [
    { value: 'general', label: 'General', color: 'blue' },
    { value: 'bug', label: 'Bug', color: 'red' },
    { value: 'feature', label: 'Feature', color: 'green' },
    { value: 'ui', label: 'UI/UX', color: 'purple' },
    { value: 'performance', label: 'Performance', color: 'orange' }
  ];

  const ratingOptions = [
    { value: '1', label: '1 Star' },
    { value: '2', label: '2 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '5', label: '5 Stars' }
  ];

  // Helper function to process stats data
  const processStats = (statsData) => {
    if (!statsData) return null;
    
    const pendingCount = statsData.byStatus?.find(item => item.status === 'pending')?.count || 0;
    const resolvedCount = statsData.byStatus?.find(item => item.status === 'resolved')?.count || 0;
    const reviewedCount = statsData.byStatus?.find(item => item.status === 'reviewed')?.count || 0;
    const inProgressCount = statsData.byStatus?.find(item => item.status === 'in_progress')?.count || 0;
    const closedCount = statsData.byStatus?.find(item => item.status === 'closed')?.count || 0;

    return {
      totalCount: statsData.totalCount || 0,
      averageRating: statsData.overallAverage ? parseFloat(statsData.overallAverage).toFixed(1) : '0.0',
      pendingCount,
      resolvedCount,
      reviewedCount,
      inProgressCount,
      closedCount
    };
  };

  const [processedStats, setProcessedStats] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await feedbackService.getAllFeedback(filters);
      
      if (response.success) {
        setFeedbacks(response.data.feedbacks || response.data || []);
      } else {
        setError('Failed to load feedback data');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await feedbackService.getFeedbackStats();
      // console.log('Stats response:', response);
      
      if (response.success) {
        setStats(response.data);
        setProcessedStats(processStats(response.data));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, [filters]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getSortedFeedbacks = () => {
    if (!sortConfig.key) return feedbacks;

    return [...feedbacks].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedFeedback) return;

    try {
      await feedbackService.updateFeedbackStatus(
        selectedFeedback.feedback_id || selectedFeedback.id,
        statusForm.status,
        statusForm.adminNotes
      );

      await fetchFeedbacks();
      await fetchStats();
      
      setShowModal(false);
      setSelectedFeedback(null);
      setStatusForm({ status: '', adminNotes: '' });
      
      // Show success notification
      alert('Feedback status updated successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    try {
      await feedbackService.deleteFeedback(id);
      await fetchFeedbacks();
      await fetchStats();
      alert('Feedback deleted successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  const openStatusModal = (feedback) => {
    setSelectedFeedback(feedback);
    setStatusForm({
      status: feedback.status || 'pending',
      adminNotes: feedback.admin_notes || feedback.adminNotes || ''
    });
    setShowModal(true);
  };

  const toggleExpandFeedback = (id) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  const getStatusConfig = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const getCategoryConfig = (category) => {
    return categoryOptions.find(option => option.value === category) || categoryOptions[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-sm ${
              i < rating 
                ? 'text-yellow-500 fill-current drop-shadow-sm' 
                : 'text-gray-300'
            } transition-transform hover:scale-110`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-500 font-medium">({rating})</span>
      </div>
    );
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="text-blue-600" /> 
      : <FaSortDown className="text-blue-600" />;
  };

  if (loading && !feedbacks.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  const sortedFeedbacks = getSortedFeedbacks();

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <FaComments className="text-white text-xl" />
                </div>
                Feedback Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Monitor and manage user feedback submissions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaChartBar className="text-gray-600" />
                <span className="font-medium text-gray-700">
                  {showStats ? 'Hide Analytics' : 'Show Analytics'}
                </span>
              </button>
              
              <button
                onClick={() => {
                  fetchFeedbacks();
                  fetchStats();
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaSync className="text-white" />
                <span className="font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {showStats && processedStats && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Feedback</p>
                    <p className="text-3xl font-bold mt-2">{processedStats.totalCount}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FaComments className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4 text-blue-100 text-sm">
                  All user submissions
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">Average Rating</p>
                    <p className="text-3xl font-bold mt-2">{processedStats.averageRating}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FaStar className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4 text-amber-100 text-sm">
                  Overall satisfaction
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Pending Review</p>
                    <p className="text-3xl font-bold mt-2">{processedStats.pendingCount}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FaExclamationTriangle className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4 text-orange-100 text-sm">
                  Awaiting action
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Resolved</p>
                    <p className="text-3xl font-bold mt-2">{processedStats.resolvedCount}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FaCheckCircle className="text-2xl" />
                  </div>
                </div>
                <div className="mt-4 text-emerald-100 text-sm">
                  Completed items
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FaFilter className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
                  <p className="text-gray-600 text-sm">Refine feedback results</p>
                </div>
              </div>
              <button
                onClick={() => setFilters({
                  status: '', category: '', rating: '', search: '', page: 1, limit: 10
                })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Feedback
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <option value="">All Status</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <option value="">All Ratings</option>
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="w-full text-center p-3 bg-gray-50 rounded-xl border">
                  <div className="text-2xl font-bold text-gray-900">{feedbacks.length}</div>
                  <div className="text-sm text-gray-600">Results</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800">Unable to load feedback</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Feedback Submissions
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  {feedbacks.length} items
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('user_id')}
                  >
                    <div className="flex items-center gap-2">
                      User
                      {getSortIcon('user_id')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center gap-2">
                      Rating
                      {getSortIcon('rating')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-2">
                      Category
                      {getSortIcon('category')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedFeedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <FaComments className="mx-auto text-4xl text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">No feedback found</p>
                        <p className="text-gray-600">
                          {filters.search || filters.status || filters.category || filters.rating
                            ? 'Try adjusting your filters to see more results.'
                            : 'No feedback submissions yet.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedFeedbacks.map((feedback) => {
                    const statusConfig = getStatusConfig(feedback.status);
                    const categoryConfig = getCategoryConfig(feedback.category);
                    const isExpanded = expandedFeedback === feedback.feedback_id;

                    return (
                      <tr 
                        key={feedback.feedback_id} 
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
                              U{feedback.user_id}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                User #{feedback.user_id}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: #{feedback.feedback_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {renderStars(feedback.rating)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${categoryConfig.color}-50 text-${categoryConfig.color}-700 border border-${categoryConfig.color}-200`}>
                            <FaTag className="mr-1.5" size={10} />
                            {feedback.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bgColor} text-${statusConfig.color}-700 border ${statusConfig.borderColor}`}>
                            {feedback.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaClock size={12} />
                            {formatDate(feedback.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleExpandFeedback(feedback.feedback_id)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="View Details"
                            >
                              <FaEye size={14} />
                            </button>
                            <button
                              onClick={() => openStatusModal(feedback)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                              title="Update Status"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(feedback.feedback_id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete Feedback"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Update Modal */}
        {showModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Update Feedback Status
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <form onSubmit={handleStatusUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Feedback Message
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedFeedback.message}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Status
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusConfig(selectedFeedback.status).bgColor} text-${getStatusConfig(selectedFeedback.status).color}-700 border ${getStatusConfig(selectedFeedback.status).borderColor}`}>
                        {selectedFeedback.status.replace('_', ' ')}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusConfig(statusForm.status).bgColor} text-${getStatusConfig(statusForm.status).color}-700 border ${getStatusConfig(statusForm.status).borderColor}`}>
                        {statusForm.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={statusForm.status}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={statusForm.adminNotes}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                      placeholder="Add internal notes or follow-up actions..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Update Status
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackManagement;