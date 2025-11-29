// src/components/dashboard/PaymentModal.jsx
import React, { useState, useEffect } from 'react'
import {
  X,
  Mail,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
  IndianRupee,
  Shield,
  ExternalLink,
  Copy,
  BarChart3,
  Zap,
  Smartphone,
  BookOpen,
  RefreshCw,
  Image,
} from 'lucide-react'
import { paymentsAPI } from '../../services/api'

const PaymentModal = ({ show, payment, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false)
  const [refundLoading, setRefundLoading] = useState(false)
  const [formData, setFormData] = useState({
    adminNotes: '',
  })
  const [imageError, setImageError] = useState(false)

  // Initialize form data when payment changes
  useEffect(() => {
    if (payment) {
      setFormData({
        adminNotes: payment.metadata?.adminNotes || '',
      })
      setImageError(false) // Reset image error when payment changes
    }
  }, [payment])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!payment) return

    setLoading(true)
    try {
      // Update admin notes only
      await paymentsAPI.updatePayment(payment.payment_id, {
        metadata: {
          ...payment.metadata,
          adminNotes: formData.adminNotes,
        },
      })

      onUpdated()
    } catch (error) {
      console.error('Error updating payment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!payment) return

    setRefundLoading(true)
    try {
      await paymentsAPI.refundPayment(payment.payment_id)
      onUpdated()
    } catch (error) {
      console.error('Error refunding payment:', error)
    } finally {
      setRefundLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const getStatusColor = status => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = status => {
    switch (status) {
      case 'created':
        return <Clock className="w-4 h-4" />
      case 'paid':
        return <CheckCircle className="w-4 h-4" />
      case 'failed':
        return <AlertCircle className="w-4 h-4" />
      case 'refunded':
        return <Shield className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getPaymentMethodIcon = method => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />
      case 'netbanking':
        return <BarChart3 className="w-4 h-4" />
      case 'upi':
        return <Zap className="w-4 h-4" />
      case 'wallet':
        return <Smartphone className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  const formatAmount = amount => {
    return `₹${(amount / 100).toFixed(2)}`
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

  const copyToClipboard = text => {
    if (!text) return
    navigator.clipboard.writeText(text)
  }

  const openRazorpayDashboard = () => {
    if (payment.rzp_payment_id) {
      window.open(`https://dashboard.razorpay.com/app/payments/${payment.rzp_payment_id}`, '_blank')
    }
  }

  // Generate gradient background based on course ID
  const getCourseGradient = () => {
    if (!payment.course) return 'from-blue-100 to-blue-200'
    
    const courseId = payment.course.course_id || 0
    const gradients = [
      'from-blue-100 to-blue-200',
      'from-green-100 to-green-200', 
      'from-purple-100 to-purple-200',
      'from-orange-100 to-orange-200',
      'from-teal-100 to-teal-200',
      'from-pink-100 to-pink-200'
    ]
    return gradients[courseId % gradients.length]
  }

  // Get course initial for placeholder
  const getCourseInitial = () => {
    if (!payment.course || !payment.course.title) return 'C'
    return payment.course.title.charAt(0).toUpperCase()
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
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
          {payment ? (
            <div className="space-y-6">
              {/* Payment Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {payment.user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {payment.user?.full_name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {payment.user?.occupation || 'Customer'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a
                        href={`mailto:${payment.user?.email || payment.email}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {payment.user?.email || payment.email || 'No email'}
                      </a>
                    </div>

                    {payment.contact && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Smartphone className="w-4 h-4 text-gray-400" />
                        <span>{payment.contact}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Paid: {formatDate(payment.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Amount:</span>
                    <span className="text-lg font-bold text-green-600 flex items-center gap-1">
                      <IndianRupee className="w-5 h-5" />
                      {formatAmount(payment.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(payment.status)}`}
                    >
                      {getStatusIcon(payment.status)}
                      {payment.status
                        ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1)
                        : 'Created'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Method:</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700">
                      {getPaymentMethodIcon(payment.method)}
                      {payment.method
                        ? payment.method.charAt(0).toUpperCase() + payment.method.slice(1)
                        : 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Order Information */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Order ID:</span>
                    <div className="flex items-center gap-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {payment.rzp_order_id?.slice(-8) || 'N/A'}
                      </code>
                      <button
                        onClick={() => copyToClipboard(payment.rzp_order_id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Payment ID:</span>
                    <div className="flex items-center gap-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {payment.rzp_payment_id?.slice(-8) || 'N/A'}
                      </code>
                      <button
                        onClick={() => copyToClipboard(payment.rzp_payment_id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {payment.receipt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Receipt:</span>
                      <span className="text-sm text-gray-600">{payment.receipt}</span>
                    </div>
                  )}

                  {/* Razorpay Dashboard Link */}
                  {payment.rzp_payment_id && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-700">Razorpay:</span>
                      <button
                        onClick={openRazorpayDashboard}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:text-primary-700 bg-primary-50 rounded border border-primary-200 hover:bg-primary-100 transition-colors"
                        title="Open in Razorpay Dashboard"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View in Dashboard
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Information */}
              {payment.course && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Course Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{payment.course.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {payment.notes?.courseTitle || payment.course.title}
                        </p>
                        {payment.notes?.actualAmount && (
                          <p className="text-sm text-gray-700 mt-1">
                            <strong>Original Price:</strong> ₹{(payment.notes.actualAmount).toFixed(2)}
                          </p>
                        )}
                        {payment.notes?.paymentPlan && (
                          <p className="text-sm text-gray-700 mt-1">
                            <strong>Payment Plan:</strong> {payment.notes.paymentPlan}
                          </p>
                        )}
                      </div>
                      <div className="w-16 h-12 flex-shrink-0 ml-4">
                        {payment.course.thumbnail_image && !imageError ? (
                          <img
                            src={payment.course.thumbnail_image}
                            alt={payment.course.title}
                            className="w-full h-full object-cover rounded border"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${getCourseGradient()} rounded border flex items-center justify-center`}>
                            <span className="text-lg font-bold text-gray-700">
                              {getCourseInitial()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {payment.enrollment && (
                      <div className="mt-3 text-xs text-gray-500">
                        <strong>Enrollment ID:</strong> {payment.enrollment.enrollment_id} • 
                        <strong> Status:</strong> {payment.enrollment.status} • 
                        <strong> Progress:</strong> {payment.enrollment.progress || 0}%
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Metadata */}
              <div className="space-y-4">
                {/* Admin Response Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Notes</h4>
                  <textarea
                    value={formData.adminNotes}
                    onChange={e => handleInputChange('adminNotes', e.target.value)}
                    placeholder="Add internal notes about this payment..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows="3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    These notes are for internal use only.
                  </p>
                </div>

                {/* Additional Metadata */}
                {(payment.metadata || payment.notes) && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <strong>Currency:</strong> {payment.currency || 'INR'}
                      </div>
                      {payment.attempts && (
                        <div>
                          <strong>Attempts:</strong> {payment.attempts}
                        </div>
                      )}
                      {payment.amount_due !== undefined && (
                        <div>
                          <strong>Amount Due:</strong> {formatAmount(payment.amount_due)}
                        </div>
                      )}
                      {payment.amount_paid !== undefined && (
                        <div>
                          <strong>Amount Paid:</strong> {formatAmount(payment.amount_paid)}
                        </div>
                      )}
                      {payment.metadata?.enrollment_type && (
                        <div>
                          <strong>Enrollment Type:</strong> {payment.metadata.enrollment_type}
                        </div>
                      )}
                      {payment.notes && (
                        <div className="md:col-span-2">
                          <strong>Payment Notes:</strong>
                          <pre className="mt-1 text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                            {JSON.stringify(payment.notes, null, 2)}
                          </pre>
                        </div>
                      )}
                      {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                        <div className="md:col-span-2">
                          <strong>Razorpay Metadata:</strong>
                          <pre className="mt-1 text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                            {JSON.stringify(payment.metadata, null, 2)}
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
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No payment data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500">
            Payment ID: {payment?.payment_id || 'N/A'} • 
            Created: {payment?.createdAt ? formatDate(payment.createdAt) : 'N/A'}
          </div>

          <div className="flex items-center gap-3">
            {/* Refund Button for paid payments */}
            {payment?.status === 'paid' && (
              <button
                onClick={handleRefund}
                disabled={refundLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refundLoading ? 'animate-spin' : ''}`} />
                {refundLoading ? 'Processing...' : 'Refund Payment'}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
            >
              Close
            </button>

            {/* Save Changes button for admin notes only */}
            {payment && (
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
                  'Save Notes'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal