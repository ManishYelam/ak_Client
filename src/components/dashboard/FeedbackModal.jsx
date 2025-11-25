// src/components/dashboard/FeedbackModal.jsx
import React, { useState, useEffect } from 'react'
import {
  X,
  Mail,
  User,
  Calendar,
  MessageCircle,
  Star,
  Tag,
  CheckCircle,
  Clock,
  AlertCircle,
  Bug,
  Zap,
  Lightbulb,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  ExternalLink,
} from 'lucide-react'
import { feedbackAPI } from '../../services/api'

const FeedbackModal = ({ show, feedback, onClose, onSaved }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    status: '',
    adminNotes: '',
  })

  // Initialize form data when feedback changes
  useEffect(() => {
    if (feedback) {
      setFormData({
        status: feedback.status || 'pending',
        adminNotes: feedback.metadata?.adminNotes || '',
      })
    }
  }, [feedback])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!feedback) return

    setLoading(true)
    try {
      // Update status and admin notes
      await feedbackAPI.updateFeedbackStatus(
        feedback.feedback_id,
        formData.status,
        formData.adminNotes
      )

      onSaved()
      showToast('Feedback updated successfully!', 'success')
    } catch (error) {
      console.error('Error updating feedback:', error)
      showToast('Failed to update feedback', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = category => {
    switch (category) {
      case 'bug':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'feature':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ui':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'performance':
        return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'general':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = status => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'reviewed':
        return <AlertCircle className="w-4 h-4" />
      case 'in_progress':
        return <Settings className="w-4 h-4" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />
      case 'closed':
        return <X className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getCategoryIcon = category => {
    switch (category) {
      case 'bug':
        return <Bug className="w-4 h-4" />
      case 'feature':
        return <Lightbulb className="w-4 h-4" />
      case 'ui':
        return <Monitor className="w-4 h-4" />
      case 'performance':
        return <Zap className="w-4 h-4" />
      case 'general':
        return <MessageCircle className="w-4 h-4" />
      default:
        return <Tag className="w-4 h-4" />
    }
  }

  const renderStars = rating => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const formatDate = dateString => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const detectDevice = userAgent => {
    if (!userAgent) return 'Unknown'

    if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      return 'Mobile'
    } else if (/Tablet/i.test(userAgent)) {
      return 'Tablet'
    } else {
      return 'Desktop'
    }
  }

  const detectBrowser = userAgent => {
    if (!userAgent) return 'Unknown'

    if (/Chrome/i.test(userAgent)) return 'Chrome'
    if (/Firefox/i.test(userAgent)) return 'Firefox'
    if (/Safari/i.test(userAgent)) return 'Safari'
    if (/Edge/i.test(userAgent)) return 'Edge'
    if (/Opera/i.test(userAgent)) return 'Opera'
    return 'Unknown'
  }

  // FIXED: Safe URL parsing function
  const getPageUrlInfo = pageUrl => {
    if (!pageUrl) return { display: 'No page URL', isValid: false }

    try {
      const url = new URL(pageUrl)
      return {
        display: url.pathname || 'Home',
        fullUrl: pageUrl,
        isValid: true,
      }
    } catch (error) {
      // If it's not a valid URL, try to extract path from string
      const pathMatch = pageUrl.match(/\/([^?#]*)/)
      return {
        display: pathMatch ? pathMatch[0] : 'Invalid URL',
        fullUrl: pageUrl,
        isValid: false,
      }
    }
  }

  const showToast = (message, type = 'success') => {
    // You can implement a toast notification system here
    console.log(`${type}: ${message}`)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Feedback Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {feedback ? (
            <div className="space-y-6">
              {/* User Information */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {feedback.user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {feedback.user?.full_name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-500">{feedback.user?.role || 'User'}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a
                        href={`mailto:${feedback.user?.email}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {feedback.user?.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Submitted: {formatDate(feedback.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Feedback Metadata */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(feedback.status)}`}
                    >
                      {getStatusIcon(feedback.status)}
                      {feedback.status
                        ? feedback.status.charAt(0).toUpperCase() +
                          feedback.status.slice(1).replace('_', ' ')
                        : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Category:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(feedback.category)}`}
                    >
                      {getCategoryIcon(feedback.category)}
                      {feedback.category
                        ? feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)
                        : 'General'}
                    </span>
                  </div>

                  {feedback.rating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Rating:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                        <span className="text-sm text-gray-500 ml-2">({feedback.rating}/5)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Technical Information */}
                <div className="space-y-3">
                  {feedback.user_agent && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Device:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          <Smartphone className="w-3 h-3" />
                          {detectDevice(feedback.user_agent)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Browser:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          <Globe className="w-3 h-3" />
                          {detectBrowser(feedback.user_agent)}
                        </span>
                      </div>
                    </>
                  )}

                  {/* FIXED: Safe page URL handling */}
                  {feedback.page_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Page:</span>
                      <div className="flex items-center gap-1">
                        {getPageUrlInfo(feedback.page_url).isValid ? (
                          <a
                            href={feedback.page_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700 truncate max-w-[150px] flex items-center gap-1"
                            title={feedback.page_url}
                          >
                            {getPageUrlInfo(feedback.page_url).display}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span
                            className="text-xs text-gray-500 truncate max-w-[150px]"
                            title={feedback.page_url}
                          >
                            {getPageUrlInfo(feedback.page_url).display}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback Message</h4>
                  <div className="text-sm text-gray-900 bg-gray-50 rounded-lg p-4 border border-gray-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {feedback.message}
                  </div>
                </div>

                {/* Admin Response Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Notes & Response</h4>
                  <textarea
                    value={formData.adminNotes}
                    onChange={e => handleInputChange('adminNotes', e.target.value)}
                    placeholder="Add your notes, response, or action taken for this feedback..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows="4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    These notes are for internal use and won't be shared with the user.
                  </p>
                </div>

                {/* Status Update */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200 w-full">
                      <strong>Status Guidelines:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>
                          • <strong>Pending:</strong> New, unprocessed feedback
                        </li>
                        <li>
                          • <strong>Reviewed:</strong> Feedback has been read and acknowledged
                        </li>
                        <li>
                          • <strong>In Progress:</strong> Working on the feedback item
                        </li>
                        <li>
                          • <strong>Resolved:</strong> Feedback has been addressed
                        </li>
                        <li>
                          • <strong>Closed:</strong> No further action needed
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Additional Metadata */}
                {(feedback.metadata || feedback.updatedAt !== feedback.createdAt) && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <strong>Created:</strong> {formatDate(feedback.createdAt)}
                      </div>
                      {feedback.updatedAt !== feedback.createdAt && (
                        <div>
                          <strong>Last Updated:</strong> {formatDate(feedback.updatedAt)}
                        </div>
                      )}
                      {feedback.metadata && Object.keys(feedback.metadata).length > 0 && (
                        <div className="md:col-span-2">
                          <strong>Metadata:</strong>
                          <pre className="mt-1 text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                            {JSON.stringify(feedback.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No feedback data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500">Feedback ID: {feedback?.feedback_id || 'N/A'}</div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
            >
              Cancel
            </button>

            {feedback && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
