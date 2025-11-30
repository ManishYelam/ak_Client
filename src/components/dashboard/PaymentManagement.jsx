// src/components/dashboard/PaymentManagement.jsx
import React, { useState, useEffect, useCallback, useMemo, useContext, useRef } from 'react'
import {
  Search,
  Users,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  Filter,
  DollarSign,
  CreditCard,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCw,
  IndianRupee,
  Shield,
  Zap,
  BarChart3,
} from 'lucide-react'
import { paymentsAPI } from '../../services/api'
import PaymentModal from './PaymentModal'
import { AuthContext } from '../../context/AuthContext'

// Memoized components to prevent unnecessary re-renders
const StatusBadge = React.memo(({ status, statusOptions }) => {
  const statusObj = statusOptions.find(s => s.value === status)
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${statusObj?.color || 'bg-gray-100 text-gray-700 border border-gray-300'}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Created'}
    </span>
  )
})

StatusBadge.displayName = 'StatusBadge'

const PaymentMethodBadge = React.memo(({ method, paymentMethodOptions }) => {
  const methodObj = paymentMethodOptions.find(m => m.value === method)
  const IconComponent = methodObj?.icon || CreditCard
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${methodObj?.color || 'bg-gray-100 text-gray-700 border border-gray-300'}`}
    >
      <IconComponent className="w-3 h-3" />
      {method ? method.charAt(0).toUpperCase() + method.slice(1) : 'Unknown'}
    </span>
  )
})

PaymentMethodBadge.displayName = 'PaymentMethodBadge'

const UserAvatar = React.memo(({ user, email }) => (
  <div className="flex items-center">
    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-2">
      {user?.full_name?.charAt(0) || 'U'}
    </div>
    <div>
      <div className="text-xs font-medium text-gray-900 line-clamp-1">
        {user?.full_name || 'Unknown User'}
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-0.5 mt-0.5">
        <Mail className="w-2.5 h-2.5" />
        <span>{user?.email || email || 'No email'}</span>
      </div>
    </div>
  </div>
))

UserAvatar.displayName = 'UserAvatar'

const LoadingSkeleton = React.memo(() => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {Array.from({ length: 8 }).map((_, index) => (
            <th
              key={index}
              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div className="h-3 bg-gray-200 rounded w-14"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className="animate-pulse">
            {Array.from({ length: 8 }).map((_, cellIndex) => (
              <td key={cellIndex} className="px-3 py-2 whitespace-nowrap">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))

LoadingSkeleton.displayName = 'LoadingSkeleton'

// Constants to prevent recreation on every render
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'created', label: 'Created', color: 'bg-blue-100 text-blue-800 border border-blue-200' },
  { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800 border border-green-200' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800 border border-red-200' },
  {
    value: 'refunded',
    label: 'Refunded',
    color: 'bg-purple-100 text-purple-800 border border-purple-200',
  },
]

const PAYMENT_METHOD_OPTIONS = [
  { value: 'all', label: 'All Methods' },
  {
    value: 'card',
    label: 'Credit/Debit Card',
    color: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    icon: CreditCard,
  },
  {
    value: 'netbanking',
    label: 'Net Banking',
    color: 'bg-teal-100 text-teal-800 border border-teal-200',
    icon: BarChart3,
  },
  {
    value: 'upi',
    label: 'UPI',
    color: 'bg-orange-100 text-orange-800 border border-orange-200',
    icon: Zap,
  },
  {
    value: 'wallet',
    label: 'Wallet',
    color: 'bg-pink-100 text-pink-800 border border-pink-200',
    icon: DollarSign,
  },
]

const PaymentManagement = () => {
  const { user: authUser } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('all')
  const [payments, setPayments] = useState([])
  const [allPayments, setAllPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPayments, setSelectedPayments] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [editingPayment, setEditingPayment] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Refs for values that don't need re-renders
  const filtersRef = useRef({
    search: '',
    status: 'all',
    paymentMethod: 'all',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 5,
  })

  const [filters, setFilters] = useState(filtersRef.current)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
  })

  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    title: '',
    message: '',
    type: '',
    onConfirm: null,
    data: null,
  })

  // Memoized user role calculation
  const { userRole, isAdmin } = useMemo(() => {
    const role = authUser?.user?.role || 'student'
    return {
      userRole: role,
      isAdmin: role === 'admin',
    }
  }, [authUser])

  // Memoized utility functions
  const formatAmount = useCallback(amount => `₹${(amount / 100).toFixed(2)}`, [])

  const formatDate = useCallback(dateString => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  // Show toast notification with useCallback
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }, [])

  // Memoized derived values - MOVED UP before functions that use it
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.status !== 'all' ||
      filters.paymentMethod !== 'all' ||
      filters.minAmount !== '' ||
      filters.maxAmount !== '' ||
      filters.startDate !== '' ||
      filters.endDate !== ''
    )
  }, [filters])

  // Memoized tabs calculation
  const tabs = useMemo(() => {
    if (!allPayments.length) {
      return [
        { id: 'all', name: 'All Payments', count: 0, icon: Users, color: 'text-gray-600' },
        { id: 'paid', name: 'Paid', count: 0, icon: CheckCircle2, color: 'text-green-600' },
        { id: 'failed', name: 'Failed', count: 0, icon: XCircle, color: 'text-red-600' },
        { id: 'refunded', name: 'Refunded', count: 0, icon: RefreshCw, color: 'text-purple-600' },
      ]
    }

    const allCount = allPayments.length
    const paidCount = allPayments.filter(payment => payment.status === 'paid').length
    const failedCount = allPayments.filter(payment => payment.status === 'failed').length
    const refundedCount = allPayments.filter(payment => payment.status === 'refunded').length

    return [
      { id: 'all', name: 'All Payments', count: allCount, icon: Users, color: 'text-gray-600' },
      { id: 'paid', name: 'Paid', count: paidCount, icon: CheckCircle2, color: 'text-green-600' },
      { id: 'failed', name: 'Failed', count: failedCount, icon: XCircle, color: 'text-red-600' },
      {
        id: 'refunded',
        name: 'Refunded',
        count: refundedCount,
        icon: RefreshCw,
        color: 'text-purple-600',
      },
    ]
  }, [allPayments])

  // Memoized stats calculation
  const stats = useMemo(() => {
    if (!allPayments.length) {
      return [
        { number: '0', label: 'Total Payments', icon: DollarSign, color: 'text-blue-400' },
        { number: '₹0', label: 'Total Revenue', icon: IndianRupee, color: 'text-green-400' },
        { number: '0%', label: 'Success Rate', icon: CheckCircle, color: 'text-teal-400' },
        { number: '₹0', label: 'Avg. Order Value', icon: BarChart3, color: 'text-purple-400' },
      ]
    }

    const totalPayments = allPayments.length
    const paidPayments = allPayments.filter(payment => payment.status === 'paid')
    const totalRevenue = paidPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
    const successRate =
      totalPayments > 0 ? Math.round((paidPayments.length / totalPayments) * 100) : 0
    const averageOrderValue =
      paidPayments.length > 0 ? Math.round(totalRevenue / paidPayments.length) : 0

    return [
      {
        number: totalPayments.toLocaleString(),
        label: 'Total Payments',
        icon: DollarSign,
        color: 'text-blue-400',
      },
      {
        number: `₹${(totalRevenue / 100).toLocaleString()}`,
        label: 'Total Revenue',
        icon: IndianRupee,
        color: 'text-green-400',
      },
      {
        number: `${successRate}%`,
        label: 'Success Rate',
        icon: CheckCircle,
        color: 'text-teal-400',
      },
      {
        number: `₹${(averageOrderValue / 100).toLocaleString()}`,
        label: 'Avg. Order Value',
        icon: BarChart3,
        color: 'text-purple-400',
      },
    ]
  }, [allPayments])

  // Optimized fetch functions
  const extractPaymentsData = useCallback(responseData => {
    if (!responseData?.success || !responseData.data)
      return { paymentsData: [], paginationData: {} }

    let paymentsData = []
    let paginationData = {}

    if (responseData.data.payments) {
      paymentsData = responseData.data.payments
      paginationData = responseData.data.pagination || {}
    } else if (responseData.data.data?.payments) {
      paymentsData = responseData.data.data.payments
      paginationData = responseData.data.data.pagination || {}
    } else if (Array.isArray(responseData.data)) {
      paymentsData = responseData.data
    } else {
      paymentsData = responseData.payments || responseData.data || []
      paginationData = responseData.pagination || {}
    }

    return { paymentsData, paginationData }
  }, [])

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const requestData = {
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
        filters: {
          status: filters.status !== 'all' ? filters.status : undefined,
        },
      }

      const response = isAdmin
        ? await paymentsAPI.getAllUserPayments(requestData)
        : await paymentsAPI.getUserPayments(requestData)

      const { paymentsData, paginationData } = extractPaymentsData(response.data)

      if (paymentsData) {
        setPayments(paymentsData)

        const totalItems = paginationData.totalItems || paymentsData.length
        const currentPage = paginationData.page || filters.page
        const currentLimit = paginationData.limit || filters.limit
        const totalPages = paginationData.totalPages || Math.ceil(totalItems / currentLimit)

        setPagination({
          page: currentPage,
          limit: currentLimit,
          totalItems,
          totalPages,
        })
      } else {
        setPayments([])
        setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 0 }))
      }
    } catch (err) {
      console.error('❌ Error fetching payments:', err)
      setError('Failed to load payments. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters, isAdmin, extractPaymentsData])

  const fetchAllPayments = useCallback(async () => {
    try {
      const requestData = { page: 1, limit: 1000, filters: {} }

      const response = isAdmin
        ? await paymentsAPI.getAllUserPayments(requestData)
        : await paymentsAPI.getUserPayments(requestData)

      const { paymentsData } = extractPaymentsData(response.data)

      if (paymentsData) {
        setAllPayments(paymentsData)
      } else {
        setAllPayments([])
      }
    } catch (err) {
      console.error('Error fetching all payments:', err)
      setAllPayments([])
    }
  }, [isAdmin, extractPaymentsData])

  // Fixed fetchAllPaymentsForExport function with role-based API
  const fetchAllPaymentsForExport = useCallback(async () => {
    try {
      const requestData = {
        page: 1,
        limit: 1000,
        search: filters.search,
        filters: {
          status: filters.status !== 'all' ? filters.status : undefined,
        },
      }

      let response
      if (isAdmin) {
        response = await paymentsAPI.getAllUserPayments(requestData)
      } else {
        response = await paymentsAPI.getUserPayments(requestData)
      }

      const responseData = response.data

      if (responseData && responseData.success && responseData.data) {
        let paymentsData = []

        if (responseData.data.payments) {
          paymentsData = responseData.data.payments
        } else if (responseData.data.data && responseData.data.data.payments) {
          paymentsData = responseData.data.data.payments
        } else if (Array.isArray(responseData.data)) {
          paymentsData = responseData.data
        } else {
          paymentsData = responseData.payments || responseData.data || []
        }

        return paymentsData
      } else {
        console.warn('Unexpected API response structure in export:', responseData)
        return []
      }
    } catch (err) {
      console.error('Error fetching payments for export:', err)
      throw err
    }
  }, [filters, isAdmin])

  // Export to CSV functionality - NOW hasActiveFilters is defined
  const exportToCSV = useCallback(async () => {
    try {
      setExportLoading(true)

      const allPayments = await fetchAllPaymentsForExport()

      if (!allPayments || allPayments.length === 0) {
        showToast('No payments found to export.', 'error')
        return
      }

      const headers = [
        'Payment ID',
        'Order ID',
        'User Name',
        'User Email',
        'Amount (₹)',
        'Status',
        'Payment Method',
        'Course',
        'Contact',
        'Created At',
        'Razorpay Payment ID',
      ]

      const csvRows = allPayments.map(payment => [
        payment.payment_id || '',
        payment.rzp_order_id || '',
        `"${(payment.user?.full_name || '').replace(/"/g, '""')}"`,
        `"${(payment.user?.email || payment.email || '').replace(/"/g, '""')}"`,
        (payment.amount / 100).toFixed(2),
        payment.status || '',
        payment.method || '',
        `"${(payment.course?.title || 'No Course').replace(/"/g, '""')}"`,
        payment.contact || '',
        payment.createdAt ? new Date(payment.createdAt).toISOString() : '',
        payment.rzp_payment_id || '',
      ])

      const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      const timestamp = new Date().toISOString().split('T')[0]
      let filename = `payments_export_${timestamp}`

      if (hasActiveFilters) {
        const filterParts = []
        if (filters.status !== 'all') filterParts.push(filters.status)
        if (filters.paymentMethod !== 'all') filterParts.push(filters.paymentMethod)

        if (filterParts.length > 0) {
          filename += `_${filterParts.join('_')}`
        }
      }

      filename += '.csv'

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showToast(
        `Successfully exported ${allPayments.length} payment records to ${filename}`,
        'success'
      )
    } catch (err) {
      console.error('Error exporting payments:', err)
      showToast('Failed to export payments. Please try again.', 'error')
    } finally {
      setExportLoading(false)
    }
  }, [fetchAllPaymentsForExport, hasActiveFilters, filters, showToast])

  // Debounced search with useRef for cleanup
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchPayments()
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [fetchPayments])

  useEffect(() => {
    fetchAllPayments()
  }, [fetchAllPayments])

  // Optimized filter handlers
  const updateFilters = useCallback(updates => {
    setFilters(prev => ({ ...prev, ...updates, page: 1 }))
  }, [])

  const handleSearchChange = useCallback(
    value => {
      updateFilters({ search: value })
    },
    [updateFilters]
  )

  const handleStatusChange = useCallback(
    status => {
      setActiveTab(status)
      updateFilters({ status: status === 'all' ? 'all' : status })
    },
    [updateFilters]
  )

  const handleStatusFilterChange = useCallback(
    status => {
      updateFilters({ status })
    },
    [updateFilters]
  )

  const handlePaymentMethodChange = useCallback(
    method => {
      updateFilters({ paymentMethod: method })
    },
    [updateFilters]
  )

  const handleAmountFilterChange = useCallback(
    (field, value) => {
      updateFilters({ [field]: value })
    },
    [updateFilters]
  )

  const handleDateFilterChange = useCallback(
    (field, value) => {
      updateFilters({ [field]: value })
    },
    [updateFilters]
  )

  const handleLimitChange = useCallback(
    newLimit => {
      updateFilters({ limit: parseInt(newLimit) })
    },
    [updateFilters]
  )

  const handlePageChange = useCallback(
    newPage => {
      if (newPage >= 1 && newPage <= pagination.totalPages) {
        updateFilters({ page: newPage })
      }
    },
    [pagination.totalPages, updateFilters]
  )

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      paymentMethod: 'all',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 5,
    })
    setActiveTab('all')
    showToast('All filters cleared', 'info')
  }, [showToast])

  // Optimized selection handlers
  const togglePaymentSelection = useCallback(paymentId => {
    setSelectedPayments(prev =>
      prev.includes(paymentId) ? prev.filter(id => id !== paymentId) : [...prev, paymentId]
    )
  }, [])

  const toggleSelectAll = useCallback(() => {
    setSelectedPayments(
      selectedPayments.length === payments.length ? [] : payments.map(payment => payment.payment_id)
    )
  }, [selectedPayments.length, payments])

  // Optimized modal handlers
  const openPaymentModal = useCallback((payment = null) => {
    setEditingPayment(payment)
    setShowPaymentModal(true)
  }, [])

  const closePaymentModal = useCallback(() => {
    setShowPaymentModal(false)
    setEditingPayment(null)
  }, [])

  const handlePaymentUpdated = useCallback(() => {
    closePaymentModal()
    fetchPayments()
    fetchAllPayments()
    showToast('Payment updated successfully!', 'success')
  }, [closePaymentModal, fetchPayments, fetchAllPayments, showToast])

  // Confirmation modal handlers
  const showConfirmation = useCallback((title, message, type, onConfirm, data = null) => {
    setConfirmationModal({
      show: true,
      title,
      message,
      type,
      onConfirm,
      data,
    })
  }, [])

  const hideConfirmation = useCallback(() => {
    setConfirmationModal({
      show: false,
      title: '',
      message: '',
      type: '',
      onConfirm: null,
      data: null,
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (confirmationModal.onConfirm) {
      confirmationModal.onConfirm(confirmationModal.data)
    }
    hideConfirmation()
  }, [confirmationModal, hideConfirmation])

  // Bulk action handler
  const handleBulkAction = useCallback(async () => {
    if (!bulkAction || selectedPayments.length === 0) return

    try {
      if (bulkAction === 'refund') {
        showConfirmation(
          'Process Refund',
          `Are you sure you want to refund ${selectedPayments.length} selected payments? This action cannot be undone.`,
          'bulkRefund',
          async () => {
            try {
              await Promise.all(selectedPayments.map(id => paymentsAPI.refundPayment(id)))
              setBulkAction('')
              setSelectedPayments([])
              fetchPayments()
              fetchAllPayments()
              showToast(
                `Successfully processed refund for ${selectedPayments.length} payments`,
                'success'
              )
            } catch (err) {
              console.error('Error performing bulk action:', err)
              showToast('Failed to perform bulk action', 'error')
            }
          }
        )
      }
    } catch (err) {
      console.error('Error performing bulk action:', err)
      showToast('Failed to perform bulk action', 'error')
    }
  }, [bulkAction, selectedPayments, fetchPayments, fetchAllPayments, showToast, showConfirmation])

  // Refund payment handler
  const handleRefundPayment = useCallback(
    paymentId => {
      const payment = payments.find(p => p.payment_id === paymentId)
      showConfirmation(
        'Process Refund',
        `Are you sure you want to refund payment of ₹${(payment?.amount / 100).toFixed(2)} from "${payment?.user?.full_name}"? This action cannot be undone.`,
        'refund',
        async () => {
          try {
            await paymentsAPI.refundPayment(paymentId)
            fetchPayments()
            fetchAllPayments()
            showToast('Payment refunded successfully', 'success')
          } catch (err) {
            console.error('Error refunding payment:', err)
            showToast('Failed to refund payment', 'error')
          }
        }
      )
    },
    [payments, fetchPayments, fetchAllPayments, showToast, showConfirmation]
  )

  // Memoized table row component
  const PaymentRow = React.memo(
    ({ payment, isAdmin, selectedPayments, onSelect, onView, onRefund }) => (
      <tr className="hover:bg-gray-50 transition-colors">
        {isAdmin && (
          <td className="px-3 py-2 whitespace-nowrap">
            <input
              type="checkbox"
              checked={selectedPayments.includes(payment.payment_id)}
              onChange={() => onSelect(payment.payment_id)}
              className="rounded border-gray-300 text-primary-600 focus:ring-1 focus:ring-primary-500 w-3 h-3"
            />
          </td>
        )}
        {isAdmin && (
          <td className="px-3 py-2 whitespace-nowrap">
            <UserAvatar user={payment.user} email={payment.email} />
          </td>
        )}
        <td className="px-3 py-2 whitespace-nowrap">
          <div className="text-xs font-bold text-gray-900">{formatAmount(payment.amount)}</div>
          <div className="text-xs text-gray-500">{payment.currency || 'INR'}</div>
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          <div className="text-xs font-mono text-gray-600 bg-gray-50 px-1 py-0.5 rounded border">
            {payment.rzp_order_id ? payment.rzp_order_id.slice(-8) : 'N/A'}
          </div>
        </td>
        <td className="px-3 py-2">
          <div className="text-xs text-gray-900 font-medium line-clamp-2">
            {payment.course?.title || 'No Course'}
          </div>
          {payment.enrollment && (
            <div className="text-xs text-gray-500">
              Enrollment: {payment.enrollment.enrollment_id}
            </div>
          )}
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          <PaymentMethodBadge
            method={payment.method}
            paymentMethodOptions={PAYMENT_METHOD_OPTIONS}
          />
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          <StatusBadge status={payment.status || 'created'} statusOptions={STATUS_OPTIONS} />
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
          <div className="flex items-center gap-0.5">
            <Calendar className="w-2.5 h-2.5" />
            {formatDate(payment.createdAt)}
          </div>
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onView(payment)}
              className="text-gray-600 hover:text-gray-900 p-0.5 rounded hover:bg-gray-50 transition-colors"
              title="View Payment Details"
            >
              <Eye className="w-3 h-3" />
            </button>
            {isAdmin && payment.status === 'paid' && (
              <button
                onClick={() => onRefund(payment.payment_id)}
                className="text-purple-600 hover:text-purple-900 p-0.5 rounded hover:bg-purple-50 transition-colors"
                title="Refund Payment"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>
        </td>
      </tr>
    )
  )

  PaymentRow.displayName = 'PaymentRow'

  return (
    <div className="space-y-3 p-3">
      {/* Toast Notification */}
      {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <Header
        isAdmin={isAdmin}
        onExport={exportToCSV}
        exportLoading={exportLoading}
        onRefresh={fetchPayments}
      />

      {/* Stats Cards */}
      <StatsCards stats={stats} isAdmin={isAdmin} />

      {/* Tabs and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-0">
        <div className="p-3 border-b border-gray-200">
          <TabsHeader
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleStatusChange}
            isAdmin={isAdmin}
            selectedPayments={selectedPayments}
            bulkAction={bulkAction}
            onBulkActionChange={setBulkAction}
            onBulkAction={handleBulkAction}
            showAdvancedFilters={showAdvancedFilters}
            onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            hasActiveFilters={hasActiveFilters}
            searchValue={filters.search}
            onSearchChange={handleSearchChange}
          />

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <AdvancedFilters
              filters={filters}
              onFilterChange={updateFilters}
              hasActiveFilters={hasActiveFilters}
              onClearAll={clearAllFilters}
            />
          )}
        </div>

        {/* Table Content */}
        <TableContent
          loading={loading}
          error={error}
          payments={payments}
          isAdmin={isAdmin}
          selectedPayments={selectedPayments}
          onSelectPayment={togglePaymentSelection}
          onSelectAll={toggleSelectAll}
          onViewPayment={openPaymentModal}
          onRefundPayment={handleRefundPayment}
          PaymentRow={PaymentRow}
          pagination={pagination}
          filters={filters}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          hasActiveFilters={hasActiveFilters}
          onRetry={fetchPayments}
        />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        show={showPaymentModal}
        payment={editingPayment}
        onClose={closePaymentModal}
        onUpdated={handlePaymentUpdated}
        userRole={userRole}
        isAdmin={isAdmin}
      />

      {/* Confirmation Modal */}
      {confirmationModal.show && (
        <ConfirmationModal
          confirmationModal={confirmationModal}
          onCancel={hideConfirmation}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

// Extracted components for better performance
const ToastNotification = React.memo(({ toast, onClose }) => (
  <div
    className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border transform transition-all duration-300 ${
      toast.type === 'success'
        ? 'bg-green-50 text-green-800 border-green-200'
        : toast.type === 'error'
          ? 'bg-red-50 text-red-800 border-red-200'
          : 'bg-blue-50 text-blue-800 border-blue-200'
    }`}
  >
    {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
    {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
    {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
    <span className="text-sm font-medium">{toast.message}</span>
    <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
      <X className="w-4 h-4" />
    </button>
  </div>
))

ToastNotification.displayName = 'ToastNotification'

const Header = React.memo(({ isAdmin, onExport, exportLoading, onRefresh }) => (
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h1 className="text-xl font-bold text-gray-900">
        {isAdmin ? 'Payment Management' : 'My Payments'}
      </h1>
      <p className="text-xs text-gray-600">
        {isAdmin
          ? 'Manage and track all payment transactions'
          : 'View your payment history and receipts'}
      </p>
    </div>
    <div className="flex gap-1 mt-2 lg:mt-0">
      {isAdmin && (
        <button
          onClick={onExport}
          disabled={exportLoading}
          className="flex items-center gap-0.5 px-2 py-0.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-2.5 h-2.5" />
          {exportLoading ? 'Exporting...' : 'Export'}
        </button>
      )}
      <button
        onClick={onRefresh}
        className="flex items-center gap-0.5 px-2 py-0.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors"
      >
        <RefreshCw className="w-2.5 h-2.5" />
        Refresh
      </button>
    </div>
  </div>
))

Header.displayName = 'Header'

const StatsCards = React.memo(({ stats, isAdmin }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
    {stats.map((stat, index) => {
      const IconComponent = stat.icon
      return (
        <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">
                {isAdmin
                  ? stat.label
                  : stat.label === 'Total Payments'
                    ? 'My Payments'
                    : stat.label === 'Total Revenue'
                      ? 'Total Spent'
                      : stat.label}
              </p>
              <p className="text-lg font-bold text-gray-900">{stat.number}</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <IconComponent className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
        </div>
      )
    })}
  </div>
))

StatsCards.displayName = 'StatsCards'

const TabsHeader = React.memo(
  ({
    tabs,
    activeTab,
    onTabChange,
    isAdmin,
    selectedPayments,
    bulkAction,
    onBulkActionChange,
    onBulkAction,
    showAdvancedFilters,
    onToggleFilters,
    hasActiveFilters,
    searchValue,
    onSearchChange,
  }) => (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
      {/* Tabs */}
      <div className="flex space-x-0.5 bg-gray-100 p-0.5 rounded-md">
        {tabs.map(tab => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-2 py-1 text-xs font-medium rounded-sm transition-all duration-200 flex items-center gap-1 ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-xs border border-primary-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <IconComponent className={`w-3 h-3 ${activeTab === tab.id ? tab.color : ''}`} />
              {tab.name}
              <span
                className={`px-0.5 py-0.5 text-xs rounded-full min-w-4 flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-1.5">
        {isAdmin && selectedPayments.length > 0 && (
          <div className="flex items-center gap-1.5 bg-primary-50 rounded-md">
            <select
              value={bulkAction}
              onChange={e => onBulkActionChange(e.target.value)}
              className="text-xs border border-primary-300 rounded px-1.5 py-0.5 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="">Bulk Actions</option>
              <option value="refund">Process Refund</option>
            </select>
            <button
              onClick={onBulkAction}
              disabled={!bulkAction}
              className="px-1.5 py-0.5 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
            >
              Apply
            </button>
            <span className="text-xs text-primary-700 font-medium">
              {selectedPayments.length} selected
            </span>
          </div>
        )}

        <button
          onClick={onToggleFilters}
          className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
            showAdvancedFilters || hasActiveFilters
              ? 'bg-primary-100 text-primary-700 border border-primary-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          Filters {hasActiveFilters && '•'}
        </button>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
          <input
            type="text"
            placeholder={isAdmin ? 'Search payments...' : 'Search my payments...'}
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-7 pr-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-40 text-xs"
          />
        </div>
      </div>
    </div>
  )
)

TabsHeader.displayName = 'TabsHeader'

const AdvancedFilters = React.memo(({ filters, onFilterChange, hasActiveFilters, onClearAll }) => (
  <div className="mt-2 pt-2 border-t border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
      {/* Status Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
        <select
          value={filters.status}
          onChange={e => onFilterChange({ status: e.target.value })}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Method Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
        <select
          value={filters.paymentMethod}
          onChange={e => onFilterChange({ paymentMethod: e.target.value })}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          {PAYMENT_METHOD_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Range */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Min Amount (₹)</label>
        <input
          type="number"
          placeholder="Min"
          value={filters.minAmount}
          onChange={e => onFilterChange({ minAmount: e.target.value })}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Max Amount (₹)</label>
        <input
          type="number"
          placeholder="Max"
          value={filters.maxAmount}
          onChange={e => onFilterChange({ maxAmount: e.target.value })}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Results Per Page */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Per Page</label>
        <select
          value={filters.limit}
          onChange={e => onFilterChange({ limit: parseInt(e.target.value) })}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
      </div>
    </div>

    {/* Active Filters Display */}
    {hasActiveFilters && <ActiveFiltersDisplay filters={filters} onClearAll={onClearAll} />}
  </div>
))

AdvancedFilters.displayName = 'AdvancedFilters'

const ActiveFiltersDisplay = React.memo(({ filters, onClearAll }) => (
  <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200 mt-2">
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-xs font-medium text-blue-800">Active Filters:</span>
      {filters.search && (
        <FilterChip
          label={`Search: "${filters.search}"`}
          onClear={() => onFilterChange({ search: '' })}
        />
      )}
      {filters.status !== 'all' && (
        <FilterChip
          label={`Status: ${STATUS_OPTIONS.find(s => s.value === filters.status)?.label}`}
          onClear={() => onFilterChange({ status: 'all' })}
        />
      )}
      {filters.paymentMethod !== 'all' && (
        <FilterChip
          label={`Method: ${PAYMENT_METHOD_OPTIONS.find(m => m.value === filters.paymentMethod)?.label}`}
          onClear={() => onFilterChange({ paymentMethod: 'all' })}
        />
      )}
      {(filters.minAmount || filters.maxAmount) && (
        <FilterChip
          label={`Amount: ₹${filters.minAmount || '0'} - ₹${filters.maxAmount || '∞'}`}
          onClear={() => {
            onFilterChange({ minAmount: '', maxAmount: '' })
          }}
        />
      )}
    </div>
    <button
      onClick={onClearAll}
      className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
    >
      Clear All
    </button>
  </div>
))

ActiveFiltersDisplay.displayName = 'ActiveFiltersDisplay'

const FilterChip = React.memo(({ label, onClear }) => (
  <span className="inline-flex items-center px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded border border-blue-200">
    {label}
    <button onClick={onClear} className="ml-0.5 text-blue-600 hover:text-blue-800">
      <X className="w-2.5 h-2.5" />
    </button>
  </span>
))

FilterChip.displayName = 'FilterChip'

const TableContent = React.memo(
  ({
    loading,
    error,
    payments,
    isAdmin,
    selectedPayments,
    onSelectPayment,
    onSelectAll,
    onViewPayment,
    onRefundPayment,
    PaymentRow,
    pagination,
    filters,
    onPageChange,
    onLimitChange,
    hasActiveFilters,
    onRetry,
  }) => (
    <div className="flex-1 overflow-hidden flex flex-col">
      {loading ? (
        <div className="flex-1">
          <LoadingSkeleton />
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={onRetry} />
      ) : payments.length > 0 ? (
        <>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  {isAdmin && (
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                      <input
                        type="checkbox"
                        checked={selectedPayments.length === payments.length && payments.length > 0}
                        onChange={onSelectAll}
                        className="rounded border-gray-300 text-primary-600 focus:ring-1 focus:ring-primary-500 w-3 h-3"
                      />
                    </th>
                  )}
                  {isAdmin && (
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                  )}
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map(payment => (
                  <PaymentRow
                    key={payment.payment_id}
                    payment={payment}
                    isAdmin={isAdmin}
                    selectedPayments={selectedPayments}
                    onSelect={onSelectPayment}
                    onView={onViewPayment}
                    onRefund={onRefundPayment}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <Pagination pagination={pagination} filters={filters} onPageChange={onPageChange} />
          )}
        </>
      ) : (
        <EmptyState hasActiveFilters={hasActiveFilters} isAdmin={isAdmin} />
      )}
    </div>
  )
)

TableContent.displayName = 'TableContent'

const ErrorState = React.memo(({ error, onRetry }) => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center">
      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
        <Filter className="w-4 h-4 text-red-500" />
      </div>
      <h3 className="text-sm font-bold text-gray-900 mb-1">Unable to Load Payments</h3>
      <p className="text-xs text-gray-600 mb-3 max-w-md mx-auto">{error}</p>
      <button
        onClick={onRetry}
        className="px-2 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-xs font-medium"
      >
        Try Again
      </button>
    </div>
  </div>
))

ErrorState.displayName = 'ErrorState'

const EmptyState = React.memo(({ hasActiveFilters, isAdmin }) => (
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="text-center">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
        <DollarSign className="w-4 h-4 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">No payments found</h3>
      <p className="text-xs text-gray-600 mb-3 max-w-md mx-auto">
        {hasActiveFilters
          ? 'No payments match your search criteria. Try adjusting your filters.'
          : isAdmin
            ? 'No payment transactions have been recorded yet.'
            : "You haven't made any payments yet."}
      </p>
    </div>
  </div>
))

EmptyState.displayName = 'EmptyState'

const Pagination = React.memo(({ pagination, filters, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = []
    const totalPages = pagination.totalPages
    const currentPage = filters.page

    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 2)

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages)
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-6 h-6 text-xs rounded border transition-colors ${
            filters.page === i
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-300 hover:bg-gray-50 text-gray-700'
          }`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="flex-shrink-0 border-t border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-2 gap-2">
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <span>Showing</span>
          <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span>
          <span>to</span>
          <span className="font-medium">
            {Math.min(filters.page * filters.limit, pagination.totalItems)}
          </span>
          <span>of</span>
          <span className="font-medium">{pagination.totalItems}</span>
          <span>results</span>
        </div>
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => onPageChange(1)}
            disabled={filters.page === 1}
            className="p-0.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronsLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => onPageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="p-0.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => onPageChange(filters.page + 1)}
            disabled={filters.page === pagination.totalPages}
            className="p-0.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={filters.page === pagination.totalPages}
            className="p-0.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronsRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
})

Pagination.displayName = 'Pagination'

const ConfirmationModal = React.memo(({ confirmationModal, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-sm w-full shadow-xl">
      <div className="flex items-center gap-2 p-3 border-b border-gray-200">
        <div
          className={`p-1.5 rounded-full ${
            confirmationModal.type === 'refund' || confirmationModal.type === 'bulkRefund'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-blue-100 text-blue-600'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{confirmationModal.title}</h3>
          <p className="text-xs text-gray-600">This action cannot be undone</p>
        </div>
      </div>

      <div className="p-3">
        <p className="text-xs text-gray-700">{confirmationModal.message}</p>
      </div>

      <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-2 py-1 text-xs font-medium text-white rounded focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors ${
            confirmationModal.type === 'refund' || confirmationModal.type === 'bulkRefund'
              ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
))

ConfirmationModal.displayName = 'ConfirmationModal'

export default React.memo(PaymentManagement)
