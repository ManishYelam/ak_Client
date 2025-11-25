// src/pages/dashboard/StudentsManagement.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Search,
  Edit,
  Trash2,
  User,
  Users,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  Filter,
  Plus,
  Clock,
  MapPin,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Send,
  Phone,
} from 'lucide-react'
import { userAPI } from '../../services/api'
import StudentModal from './StudentModal'

const StudentsManagement = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [students, setStudents] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)

  // Advanced Filter States
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    gender: 'all',
    verified: 'all',
    page: 1,
    limit: 5,
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
  })

  // Confirmation Modal State
  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    title: '',
    message: '',
    type: '',
    onConfirm: null,
    data: null,
  })

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Available filter options
  const statusOptions = useMemo(
    () => [
      {
        value: 'active',
        label: 'Active',
        color: 'bg-green-100 text-green-800 border border-green-200',
      },
      {
        value: 'inactive',
        label: 'Inactive',
        color: 'bg-gray-100 text-gray-800 border border-gray-200',
      },
    ],
    []
  )

  const genderOptions = useMemo(
    () => [
      { value: 'all', label: 'All Genders' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
    []
  )

  const verifiedOptions = useMemo(
    () => [
      { value: 'all', label: 'All Verification' },
      { value: 'verified', label: 'Verified' },
      { value: 'unverified', label: 'Unverified' },
    ],
    []
  )

  // Calculate tab counts based on allStudents
  const tabs = useMemo(() => {
    if (!allStudents.length)
      return [
        { id: 'all', name: 'All Students', count: 0, icon: Users, color: 'text-gray-600' },
        {
          id: 'active',
          name: 'Active',
          count: 0,
          icon: CheckCircle,
          color: 'text-green-600',
        },
        { id: 'inactive', name: 'Inactive', count: 0, icon: AlertCircle, color: 'text-yellow-600' },
        { id: 'verified', name: 'Verified', count: 0, icon: CheckCircle2, color: 'text-blue-600' },
      ]

    const allCount = allStudents.length
    const activeCount = allStudents.filter(student => student.status === 'active').length
    const inactiveCount = allStudents.filter(student => student.status === 'inactive').length
    const verifiedCount = allStudents.filter(student => student.isVerified).length

    return [
      { id: 'all', name: 'All Students', count: allCount, icon: Users, color: 'text-gray-600' },
      {
        id: 'active',
        name: 'Active',
        count: activeCount,
        icon: CheckCircle,
        color: 'text-green-600',
      },
      {
        id: 'inactive',
        name: 'Inactive',
        count: inactiveCount,
        icon: AlertCircle,
        color: 'text-yellow-600',
      },
      {
        id: 'verified',
        name: 'Verified',
        count: verifiedCount,
        icon: CheckCircle2,
        color: 'text-blue-600',
      },
    ]
  }, [allStudents])

  // Generate sample CSV file with actual API fields
  const generateSampleCSV = () => {
    const sampleData = [
      [
        'full_name',
        'email',
        'phone_number',
        'date_of_birth',
        'age',
        'gender',
        'occupation',
        'address',
        'status',
        'role',
      ],
      [
        'Rahul Sharma',
        'rahul.sharma@example.com',
        '9876543210',
        '1995-05-15',
        '29',
        'male',
        'Software Engineer',
        'Mumbai, Maharashtra',
        'active',
        'student',
      ],
      [
        'Priya Patel',
        'priya.patel@example.com',
        '9876543211',
        '1998-08-20',
        '26',
        'female',
        'Designer',
        'Delhi, India',
        'active',
        'student',
      ],
    ]

    const csvContent = sampleData.map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', 'students_import_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast('Sample CSV template downloaded', 'info')
  }

  // CSV Import functionality
  const handleFileUpload = async event => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      showToast('Please upload a CSV file', 'error')
      return
    }

    setImportLoading(true)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())

      if (lines.length < 2) {
        throw new Error('CSV file must contain header and at least one data row')
      }

      const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim())

      const requiredHeaders = [
        'full_name',
        'email',
        'phone_number',
        'date_of_birth',
        'age',
        'gender',
        'occupation',
        'address',
        'status',
        'role',
      ]

      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header))

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`)
      }

      const studentsToImport = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.replace(/"/g, '').trim())

        if (values.length !== headers.length) {
          throw new Error(`Row ${i + 1} has incorrect number of columns`)
        }

        const studentData = {}
        headers.forEach((header, index) => {
          studentData[header] = values[index]
        })

        const validatedStudent = {
          full_name: studentData.full_name,
          email: studentData.email,
          phone_number: studentData.phone_number,
          date_of_birth: studentData.date_of_birth,
          age: parseInt(studentData.age) || 0,
          gender: studentData.gender,
          occupation: studentData.occupation,
          address: studentData.address,
          status: studentData.status || 'active',
          role: 'student',
          isVerified: false,
        }

        if (!validatedStudent.full_name) {
          throw new Error(`Row ${i + 1}: Full name is required`)
        }

        if (!validatedStudent.email) {
          throw new Error(`Row ${i + 1}: Email is required`)
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validatedStudent.email)) {
          throw new Error(`Row ${i + 1}: Please enter a valid email address`)
        }

        if (!['active', 'inactive'].includes(validatedStudent.status)) {
          throw new Error(`Row ${i + 1}: Status must be active or inactive`)
        }

        if (!['male', 'female'].includes(validatedStudent.gender)) {
          throw new Error(`Row ${i + 1}: Gender must be male or female`)
        }

        studentsToImport.push(validatedStudent)
      }

      // Import students via API
      const importPromises = studentsToImport.map(student =>
        userAPI.getAllUsers({ ...student, action: 'create' })
      )

      await Promise.all(importPromises)

      showToast(`Successfully imported ${studentsToImport.length} students`, 'success')
      setShowImportModal(false)
      fetchStudents()
      fetchAllStudents()
    } catch (err) {
      console.error('Error importing students:', err)
      showToast(`Import failed: ${err.message}`, 'error')
    } finally {
      setImportLoading(false)
      event.target.value = ''
    }
  }

  // Fetch students with filtering - UPDATED
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const payload = {
        page: filters.page,
        limit: filters.limit,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        filters: { role: 'student' },
      }

      // Add search
      if (filters.search.trim()) {
        payload.search = filters.search.trim()
        payload.searchFields = ['full_name', 'email', 'address', 'occupation']
      }

      // Add status filter
      if (filters.status !== 'all') {
        payload.filters.status = filters.status
      }

      // Add gender filter
      if (filters.gender !== 'all') {
        payload.filters.gender = filters.gender
      }

      // Add verification filter
      if (filters.verified !== 'all') {
        payload.filters.isVerified = filters.verified === 'verified'
      }

      const response = await userAPI.getAllUsers(payload)
      const responseData = response.data

      console.log('API Response:', responseData)

      // Handle the actual API response structure
      if (responseData && responseData.data) {
        const studentsData = responseData.data || []
        setStudents(studentsData)

        // Update pagination from API response
        setPagination({
          page: responseData.currentPage || filters.page,
          limit: filters.limit,
          totalItems: responseData.totalRecords || studentsData.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil((responseData.totalRecords || studentsData.length) / filters.limit),
        })
      } else {
        // Fallback if data structure is different
        console.warn('Unexpected API response structure:', responseData)
        setStudents([])
        setPagination({
          page: 1,
          limit: filters.limit,
          totalItems: 0,
          totalPages: 0,
        })
      }
    } catch (err) {
      setError('Failed to load students. Please try again.')
      console.error('Error fetching students:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Fetch all students for counting and export - UPDATED
  const fetchAllStudents = useCallback(async () => {
    try {
      const payload = {
        limit: 1000,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        filters: { role: 'student' },
      }

      const response = await userAPI.getAllUsers(payload)
      const responseData = response.data

      if (responseData && responseData.data) {
        const studentsData = responseData.data || []
        setAllStudents(studentsData)
      } else {
        console.warn('Unexpected API response structure in fetchAllStudents:', responseData)
        setAllStudents([])
      }
    } catch (err) {
      console.error('Error fetching all students:', err)
      setAllStudents([])
    }
  }, [])

  // Fetch all students for export - UPDATED
  const fetchAllStudentsForExport = async () => {
    try {
      const payload = {
        limit: 1000,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        filters: { role: 'student' },
      }

      if (filters.search.trim()) {
        payload.search = filters.search.trim()
        payload.searchFields = ['full_name', 'email', 'address', 'occupation']
      }

      if (filters.status !== 'all') {
        payload.filters.status = filters.status
      }

      if (filters.gender !== 'all') {
        payload.filters.gender = filters.gender
      }

      if (filters.verified !== 'all') {
        payload.filters.isVerified = filters.verified === 'verified'
      }

      const response = await userAPI.getAllUsers(payload)
      const responseData = response.data

      if (responseData && responseData.data) {
        return responseData.data || []
      } else {
        console.warn('Unexpected API response structure in export:', responseData)
        return []
      }
    } catch (err) {
      console.error('Error fetching students for export:', err)
      throw err
    }
  }

  // Export to CSV functionality with actual API fields
  const exportToCSV = async () => {
    try {
      setExportLoading(true)

      const allStudents = await fetchAllStudentsForExport()

      if (!allStudents || allStudents.length === 0) {
        showToast('No students found to export.', 'error')
        return
      }

      const headers = [
        'User ID',
        'Full Name',
        'Email',
        'Phone Number',
        'Date of Birth',
        'Age',
        'Gender',
        'Occupation',
        'Address',
        'Status',
        'Verified',
        'Registration Type',
        'Created At',
        'Last Login',
      ]

      const csvRows = allStudents.map(student => [
        student.user_id || '',
        `"${(student.full_name || '').replace(/"/g, '""')}"`,
        `"${(student.email || '').replace(/"/g, '""')}"`,
        student.phone_number || '',
        student.date_of_birth || '',
        student.age || '',
        student.gender || '',
        `"${(student.occupation || '').replace(/"/g, '""')}"`,
        `"${(student.address || '').replace(/"/g, '""')}"`,
        student.status || '',
        student.isVerified ? 'Yes' : 'No',
        student.reg_type || '',
        student.createdAt ? new Date(student.createdAt).toISOString() : '',
        student.last_login_at ? new Date(student.last_login_at).toISOString() : '',
      ])

      const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      const timestamp = new Date().toISOString().split('T')[0]
      let filename = `students_export_${timestamp}`

      if (hasActiveFilters) {
        const filterParts = []
        if (filters.search) filterParts.push('search')
        if (filters.status !== 'all') filterParts.push(filters.status)
        if (filters.gender !== 'all') filterParts.push(filters.gender)
        if (filters.verified !== 'all') filterParts.push(filters.verified)

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

      showToast(`Successfully exported ${allStudents.length} students to ${filename}`, 'success')
    } catch (err) {
      console.error('Error exporting students:', err)
      showToast('Failed to export students. Please try again.', 'error')
    } finally {
      setExportLoading(false)
    }
  }

  // Debounced search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents()
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [fetchStudents])

  // Fetch all students for counting on component mount
  useEffect(() => {
    fetchAllStudents()
  }, [fetchAllStudents])

  // Confirmation Modal Functions
  const showConfirmation = (title, message, type, onConfirm, data = null) => {
    setConfirmationModal({
      show: true,
      title,
      message,
      type,
      onConfirm,
      data,
    })
  }

  const hideConfirmation = () => {
    setConfirmationModal({
      show: false,
      title: '',
      message: '',
      type: '',
      onConfirm: null,
      data: null,
    })
  }

  const handleConfirm = () => {
    if (confirmationModal.onConfirm) {
      confirmationModal.onConfirm(confirmationModal.data)
    }
    hideConfirmation()
  }

  // Student Modal Functions
  const openStudentModal = (student = null) => {
    setEditingStudent(student)
    setShowStudentModal(true)
  }

  const closeStudentModal = () => {
    setShowStudentModal(false)
    setEditingStudent(null)
  }

  const handleStudentSaved = () => {
    closeStudentModal()
    fetchStudents()
    fetchAllStudents()
    showToast('Student saved successfully!', 'success')
  }

  // Handle status change from tabs
  const handleStatusChange = status => {
    setActiveTab(status)
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? 'all' : status,
      verified: status === 'verified' ? 'verified' : 'all',
      page: 1,
    }))
  }

  // Filter handlers
  const handleSearchChange = value => {
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1,
    }))
  }

  const handleStatusFilterChange = status => {
    setFilters(prev => ({
      ...prev,
      status: status,
      page: 1,
    }))
  }

  const handleGenderChange = gender => {
    setFilters(prev => ({
      ...prev,
      gender: gender,
      page: 1,
    }))
  }

  const handleVerifiedChange = verified => {
    setFilters(prev => ({
      ...prev,
      verified: verified,
      page: 1,
    }))
  }

  const handleLimitChange = newLimit => {
    setFilters(prev => ({
      ...prev,
      limit: parseInt(newLimit),
      page: 1,
    }))
  }

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }))
    }
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      gender: 'all',
      verified: 'all',
      page: 1,
      limit: 5,
    })
    setActiveTab('all')
    showToast('All filters cleared', 'info')
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.status !== 'all' ||
      filters.gender !== 'all' ||
      filters.verified !== 'all'
    )
  }, [filters])

  // Student selection and bulk actions
  const toggleStudentSelection = studentId => {
    setSelectedStudents(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedStudents(
      selectedStudents.length === students.length ? [] : students.map(student => student.user_id)
    )
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedStudents.length === 0) return

    try {
      if (bulkAction === 'delete') {
        showConfirmation(
          'Delete Students',
          `Are you sure you want to delete ${selectedStudents.length} selected student(s)? This action cannot be undone.`,
          'bulkDelete',
          async () => {
            await Promise.all(selectedStudents.map(id => userAPI.deleteUser(id)))
            setBulkAction('')
            setSelectedStudents([])
            fetchStudents()
            fetchAllStudents()
            showToast(`Successfully deleted ${selectedStudents.length} students`, 'success')
          }
        )
      } else {
        await Promise.all(
          selectedStudents.map(id => userAPI.updateUser(id, { status: bulkAction }))
        )
        setBulkAction('')
        setSelectedStudents([])
        fetchStudents()
        fetchAllStudents()
        showToast(`Successfully updated ${selectedStudents.length} students`, 'success')
      }
    } catch (err) {
      console.error('Error performing bulk action:', err)
      showToast('Failed to perform bulk action', 'error')
    }
  }

  // Individual student actions
  const handleStatusUpdate = async (studentId, newStatus) => {
    try {
      await userAPI.updateUser(studentId, { status: newStatus })
      fetchStudents()
      fetchAllStudents()
      showToast('Student status updated successfully', 'success')
    } catch (err) {
      console.error('Error updating student status:', err)
      showToast('Failed to update student status', 'error')
    }
  }

  const handleDeleteStudent = studentId => {
    const student = students.find(s => s.user_id === studentId)
    showConfirmation(
      'Delete Student',
      `Are you sure you want to delete the student "${student?.full_name}"? This action cannot be undone.`,
      'delete',
      async () => {
        try {
          await userAPI.deleteUser(studentId)
          fetchStudents()
          fetchAllStudents()
          showToast('Student deleted successfully', 'success')
        } catch (err) {
          console.error('Error deleting student:', err)
          showToast('Failed to delete student', 'error')
        }
      }
    )
  }

  // Utility functions
  const getStatusColor = status => {
    const statusObj = statusOptions.find(s => s.value === status)
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-700 border border-gray-300'
  }

  const getVerificationBadge = isVerified => {
    return isVerified
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  }

  const formatDate = dateString => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = dateString => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getGenders = () => {
    const genders = [...new Set(allStudents.map(student => student.gender).filter(Boolean))]
    return genders.map(gender => ({
      value: gender,
      label: gender.charAt(0).toUpperCase() + gender.slice(1),
    }))
  }

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
              <div className="h-3 bg-gray-200 rounded w-3"></div>
            </th>
            {[
              'Student',
              'Contact',
              'Details',
              'Status',
              'Verification',
              'Last Active',
              'Actions',
            ].map(header => (
              <th
                key={header}
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
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="h-3 bg-gray-200 rounded w-3"></div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mr-1.5"></div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-24 mb-0.5"></div>
                    <div className="h-2 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="h-3 bg-gray-200 rounded w-20 mb-0.5"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="h-3 bg-gray-200 rounded w-16 mb-0.5"></div>
                <div className="h-2 bg-gray-200 rounded w-12"></div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="h-5 bg-gray-200 rounded w-14"></div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="h-5 bg-gray-200 rounded w-12"></div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-3 p-3">
      {/* Toast Notification */}
      {toast && (
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
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          {/* <h1 className="text-xl font-bold text-gray-900">Students Management</h1> */}
          <p className="text-xs text-gray-600">Manage and monitor all registered students</p>
        </div>
        <div className="flex gap-1 mt-2 lg:mt-0">
          {/* Import Button with Sample Download */}
          <div className="flex gap-1">
            <button
              onClick={generateSampleCSV}
              className="flex items-center gap-0.5 px-2 py-0.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              title="Download Sample CSV Template"
            >
              <FileText className="w-2.5 h-2.5" />
              Sample
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-0.5 px-2 py-0.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              <Upload className="w-2.5 h-2.5" />
              Import
            </button>
          </div>

          <button
            onClick={exportToCSV}
            disabled={exportLoading}
            className="flex items-center gap-0.5 px-2 py-0.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-2.5 h-2.5" />
            {exportLoading ? 'Exporting...' : 'Export'}
          </button>

          <button
            onClick={() => openStudentModal()}
            className="flex items-center gap-0.5 px-2 py-0.5 bg-gradient-to-r from-primary-600 to-primary-700 
               hover:from-primary-700 hover:to-primary-800 text-white rounded 
               font-medium text-xs shadow-sm transition-all duration-200"
          >
            <Plus className="w-2.5 h-2.5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Import Students</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>File must be in CSV format</li>
                  <li>Include all required columns (see sample)</li>
                  <li>Status: active or inactive</li>
                  <li>Gender: male or female</li>
                  <li>Date of birth: YYYY-MM-DD format</li>
                </ul>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={generateSampleCSV}
                  className="flex items-center gap-1 px-3 py-2 text-xs border border-primary-300 rounded text-primary-700 bg-primary-50 hover:bg-primary-100 font-medium transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  Download Sample Template
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="csv-upload"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="csv-upload" className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 mb-1">Upload CSV File</p>
                  <p className="text-xs text-gray-500">Click to browse or drag and drop</p>
                </label>
              </div>

              {importLoading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    Importing students...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-0">
        <div className="p-3 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
            {/* Tabs */}
            <div className="flex space-x-0.5 bg-gray-100 p-0.5 rounded-md">
              {tabs.map(tab => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleStatusChange(tab.id)}
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
              {/* Bulk Actions */}
              {selectedStudents.length > 0 && (
                <div className="flex items-center gap-1.5 bg-primary-50 rounded-md">
                  <select
                    value={bulkAction}
                    onChange={e => setBulkAction(e.target.value)}
                    className="text-xs border border-primary-300 rounded px-1.5 py-0.5 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    <option value="">Bulk Actions</option>
                    <option value="active">Activate</option>
                    <option value="inactive">Deactivate</option>
                    <option value="delete">Delete</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="px-1.5 py-0.5 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
                  >
                    Apply
                  </button>
                  <span className="text-xs text-primary-700 font-medium">
                    {selectedStudents.length} selected
                  </span>
                </div>
              )}

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                  showAdvancedFilters || hasActiveFilters
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                Filters {hasActiveFilters && '•'}
              </button>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={filters.search}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="pl-7 pr-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-40 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={e => handleStatusFilterChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Status</option>
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={e => handleGenderChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Verification Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Verification
                  </label>
                  <select
                    value={filters.verified}
                    onChange={e => handleVerifiedChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {verifiedOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Results Per Page */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Per Page</label>
                  <select
                    value={filters.limit}
                    onChange={e => handleLimitChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="15">15 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200 mt-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs font-medium text-blue-800">Active Filters:</span>
                    {filters.search && (
                      <span className="inline-flex items-center px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded border border-blue-200">
                        Search: "{filters.search}"
                        <button
                          onClick={() => handleSearchChange('')}
                          className="ml-0.5 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    )}
                    {filters.status !== 'all' && (
                      <span className="inline-flex items-center px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded border border-blue-200">
                        Status: {statusOptions.find(s => s.value === filters.status)?.label}
                        <button
                          onClick={() => handleStatusFilterChange('all')}
                          className="ml-0.5 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    )}
                    {filters.gender !== 'all' && (
                      <span className="inline-flex items-center px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded border border-blue-200">
                        Gender: {genderOptions.find(g => g.value === filters.gender)?.label}
                        <button
                          onClick={() => handleGenderChange('all')}
                          className="ml-0.5 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    )}
                    {filters.verified !== 'all' && (
                      <span className="inline-flex items-center px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded border border-blue-200">
                        Verification:{' '}
                        {verifiedOptions.find(v => v.value === filters.verified)?.label}
                        <button
                          onClick={() => handleVerifiedChange('all')}
                          className="ml-0.5 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Table Container with Fixed Height */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1">
              <LoadingSkeleton />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Filter className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Unable to Load Students</h3>
                <p className="text-xs text-gray-600 mb-3 max-w-md mx-auto">{error}</p>
                <button
                  onClick={fetchStudents}
                  className="px-2 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-xs font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : students.length > 0 ? (
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === students.length && students.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-primary-600 focus:ring-1 focus:ring-primary-500 w-3 h-3"
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map(student => (
                    <tr key={student.user_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.user_id)}
                          onChange={() => toggleStudentSelection(student.user_id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-1 focus:ring-primary-500 w-3 h-3"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-2">
                            {student.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-900 line-clamp-1">
                              {student.full_name || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-0.5 mt-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{student.address || 'No address'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs text-gray-900">
                          <div className="flex items-center gap-0.5">
                            <Mail className="w-2.5 h-2.5 text-gray-400" />
                            <span className="font-medium">{student.email}</span>
                          </div>
                          {student.phone_number && (
                            <div className="flex items-center gap-0.5 mt-0.5">
                              <Phone className="w-2.5 h-2.5 text-gray-400" />
                              <span className="text-gray-500">{student.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs text-gray-900">
                          <div className="flex items-center gap-0.5">
                            <User className="w-2.5 h-2.5 text-gray-400" />
                            <span className="font-medium capitalize">
                              {student.gender || 'Unknown'}
                            </span>
                            <span className="mx-0.5">•</span>
                            <span>Age: {student.age || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            <BookOpen className="w-2.5 h-2.5 text-gray-400" />
                            <span className="text-gray-500">
                              {student.occupation || 'No occupation'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <select
                          value={student.status || 'active'}
                          onChange={e => handleStatusUpdate(student.user_id, e.target.value)}
                          className={`text-xs font-medium rounded-full border-0 focus:ring-1 focus:ring-primary-500 px-1.5 py-0.5 ${getStatusColor(student.status || 'active')}`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getVerificationBadge(student.isVerified)}`}
                        >
                          {student.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        <div className="flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {formatDateTime(student.last_login_at || student.updatedAt)}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => openStudentModal(student)}
                            className="text-gray-600 hover:text-gray-900 p-0.5 rounded hover:bg-gray-50 transition-colors"
                            title="View Student"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => openStudentModal(student)}
                            className="text-blue-600 hover:text-blue-900 p-0.5 rounded hover:bg-blue-50 transition-colors"
                            title="Edit Student"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              window.location.href = `mailto:${student.email}`
                            }}
                            className="text-green-600 hover:text-green-900 p-0.5 rounded hover:bg-green-50 transition-colors"
                            title="Send Email"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.user_id)}
                            className="text-red-600 hover:text-red-900 p-0.5 rounded hover:bg-red-50 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No students found</h3>
                <p className="text-xs text-gray-600 mb-3 max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'No students match your search criteria. Try adjusting your filters.'
                    : 'Get started by adding your first student.'}
                </p>
                <button
                  onClick={() => openStudentModal()}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-2 py-1 rounded font-medium flex items-center gap-1 text-xs mx-auto transition-colors"
                >
                  <Plus className="w-2.5 h-2.5" />
                  Add Student
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
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
                    onClick={() => handlePageChange(1)}
                    disabled={filters.page === 1}
                    className="p-0.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronsLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="p-0.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (filters.page <= 3) {
                      pageNum = i + 1
                    } else if (filters.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = filters.page - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-6 h-6 text-xs rounded border transition-colors ${
                          filters.page === pageNum
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.totalPages}
                    className="p-0.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={filters.page === pagination.totalPages}
                    className="p-0.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronsRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Modal */}
      <StudentModal
        show={showStudentModal}
        student={editingStudent}
        onClose={closeStudentModal}
        onSaved={handleStudentSaved}
      />

      {/* Confirmation Modal */}
      {confirmationModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-2 p-3 border-b border-gray-200">
              <div
                className={`p-1.5 rounded-full ${
                  confirmationModal.type === 'delete' || confirmationModal.type === 'bulkDelete'
                    ? 'bg-red-100 text-red-600'
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
                onClick={hideConfirmation}
                className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-2 py-1 text-xs font-medium text-white rounded focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors ${
                  confirmationModal.type === 'delete' || confirmationModal.type === 'bulkDelete'
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentsManagement
