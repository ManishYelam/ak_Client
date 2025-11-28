// src/pages/student/CourseCatalog.jsx
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react'
import {
  BookOpen,
  X,
  Clock,
  CheckCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Grid3X3,
  Table,
  User,
  Filter,
  Star,
  TrendingUp,
  DollarSign,
  Zap,
  Target,
  BarChart3,
  PlayCircle,
  Globe,
  Monitor,
  Building,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react'
import { coursesAPI } from '../../services/api'
import CourseCard from '../../components/ui/CourseCard'
import { AuthContext } from '../../context/AuthContext'

const CourseCatalog = () => {
  const { user } = useContext(AuthContext)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [toast, setToast] = useState(null)
  const [viewMode, setViewMode] = useState('card')
  const [showMyCourses, setShowMyCourses] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    level: 'all',
    mode: 'all',
    price: 'all',
    featured: 'all',
    status: 'all',
    page: 1,
    limit: 9,
    sortBy: 'popular',
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalItems: 0,
    totalPages: 0,
  })

  // Available filter options
  const levels = useMemo(
    () => [
      { value: 'all', label: 'All Levels', icon: Target, color: 'text-gray-600' },
      { value: 'beginner', label: 'Beginner', icon: Zap, color: 'text-green-600' },
      { value: 'intermediate', label: 'Intermediate', icon: TrendingUp, color: 'text-blue-600' },
      { value: 'advanced', label: 'Advanced', icon: BarChart3, color: 'text-purple-600' },
    ],
    []
  )

  const modes = useMemo(
    () => [
      { value: 'all', label: 'All Modes', icon: SlidersHorizontal, color: 'text-gray-600' },
      { value: 'online_live', label: 'Live Online', icon: PlayCircle, color: 'text-red-500' },
      { value: 'online_self_paced', label: 'Self Paced', icon: Monitor, color: 'text-blue-500' },
      { value: 'hybrid', label: 'Hybrid', icon: Building, color: 'text-green-500' },
    ],
    []
  )

  const featuredOptions = useMemo(
    () => [
      { value: 'all', label: 'All Courses', icon: BookOpen, color: 'text-gray-600' },
      { value: 'true', label: 'Featured', icon: Star, color: 'text-yellow-500' },
      { value: 'false', label: 'Regular', icon: BookOpen, color: 'text-gray-600' },
    ],
    []
  )

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Helper function to check if a course is enrolled
  const isCourseEnrolled = useCallback(
    courseId => {
      return enrolledCourses.some(course => course.course_id === courseId)
    },
    [enrolledCourses]
  )

  // Helper function to get enrollment status
  const getEnrollmentStatus = useCallback(
    courseId => {
      const enrolledCourse = enrolledCourses.find(course => course.course_id === courseId)
      return enrolledCourse?.enrollments?.[0]?.status || null
    },
    [enrolledCourses]
  )

  // Helper function to get enrollment progress
  const getEnrollmentProgress = useCallback(
    courseId => {
      const enrolledCourse = enrolledCourses.find(course => course.course_id === courseId)
      return enrolledCourse?.enrollments?.[0]?.progress || 0
    },
    [enrolledCourses]
  )

  // Get user ID from the user object
  const getUserId = useCallback(() => {
    if (!user) return null

    if (user.user_id) {
      return user.user_id
    } else if (user.user && user.user.user_id) {
      return user.user.user_id
    }

    return null
  }, [user])

  // Build payload for API calls
  const buildPayload = useCallback(() => {
    const userId = getUserId()
    if (!userId) return null

    const payload = {
      user_id: userId,
      page: filters.page,
      limit: filters.limit,
      filters: {},
      searchFields: ['title', 'description', 'short_description'],
    }

    // Add search
    if (filters.search.trim()) {
      payload.search = filters.search.trim()
    }

    // Add filters based on your API structure
    if (filters.level !== 'all') payload.filters.level = filters.level
    if (filters.mode !== 'all') payload.filters.mode = filters.mode
    if (filters.featured !== 'all') payload.filters.featured = filters.featured === 'true'
    if (filters.status !== 'all') payload.filters.status = filters.status

    // Price filter
    if (filters.price !== 'all') {
      if (filters.price === 'free') {
        payload.filters.fee = 0
      } else if (filters.price === 'paid') {
        payload.filters.fee_gt = 0
      } else if (filters.price.includes('-')) {
        const [min, max] = filters.price.split('-')
        payload.filters.fee_gte = min === '0' ? 0 : parseInt(min)
        payload.filters.fee_lte = max.endsWith('+') ? 1000000 : parseInt(max)
      }
    }

    return payload
  }, [filters, getUserId])

  // Fetch courses based on current mode
  const fetchCourses = useCallback(async () => {
    const payload = buildPayload()

    if (!payload) {
      setError('Please log in to view courses')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log('📡 API Payload:', payload)

      let response
      if (showMyCourses) {
        response = await coursesAPI.getEnrolled(payload)
      } else {
        const { user_id, ...allCoursesPayload } = payload
        response = await coursesAPI.getAll(allCoursesPayload)
      }

      const responseData = response.data
      console.log('📦 API Response:', responseData)

      if (responseData && responseData.success) {
        const coursesData = responseData.courses || []
        setCourses(coursesData)

        if (responseData.pagination) {
          setPagination(responseData.pagination)
        } else {
          setPagination({
            page: filters.page,
            limit: filters.limit,
            totalItems: coursesData.length,
            totalPages: Math.ceil(coursesData.length / filters.limit),
          })
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      setError('Failed to load courses. Please try again.')
      console.error('❌ Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }, [buildPayload, showMyCourses, filters.page, filters.limit])

  // Fetch enrolled courses for status checks
  const fetchEnrolledCourses = useCallback(async () => {
    const userId = getUserId()

    if (!userId) return

    try {
      const payload = {
        user_id: userId,
        page: 1,
        limit: 100,
        filters: {},
      }

      const response = await coursesAPI.getEnrolled(payload)
      const enrolledData = response.data?.courses || []
      setEnrolledCourses(enrolledData)
    } catch (err) {
      console.error('Error fetching enrolled courses:', err)
    }
  }, [getUserId])

  // Filter handlers
  const handleSearchChange = value => {
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1,
    }))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
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
      level: 'all',
      mode: 'all',
      price: 'all',
      featured: 'all',
      status: 'all',
      page: 1,
      limit: 9,
      sortBy: 'popular',
    })
    showToast('All filters cleared', 'info')
  }

  // Toggle between all courses and my courses
  const toggleMyCourses = () => {
    const newShowMyCourses = !showMyCourses
    setShowMyCourses(newShowMyCourses)
    setFilters(prev => ({
      ...prev,
      page: 1,
    }))
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.level !== 'all' ||
      filters.mode !== 'all' ||
      filters.price !== 'all' ||
      filters.featured !== 'all' ||
      filters.status !== 'all'
    )
  }, [filters])

  // Effects
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourses()
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [fetchCourses])

  useEffect(() => {
    const userId = getUserId()
    if (userId) {
      fetchEnrolledCourses()
    }
  }, [fetchEnrolledCourses, getUserId])

  // Filter Section Component
  const FilterSection = ({ title, options, currentValue, onChange, icon: Icon }) => (
    <div className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3 h-3 text-gray-500" />
        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">{title}</h4>
      </div>
      <div className="space-y-1">
        {options.map(option => {
          const OptionIcon = option.icon
          const isSelected = currentValue === option.value
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <OptionIcon className={`w-3 h-3 ${isSelected ? 'text-blue-600' : option.color}`} />
              <span className="font-medium">{option.label}</span>
              {isSelected && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
            </button>
          )
        })}
      </div>
    </div>
  )

  // Loading skeleton
  const CourseCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
      <div className="p-5">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-xl mt-4"></div>
      </div>
    </div>
  )

  // Show loading if user is not available yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your learning journey...</p>
        </div>
      </div>
    )
  }

  const userId = getUserId()
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Authentication Required</h3>
          <p className="text-gray-600 mb-6">
            Please log in to explore our course catalog and continue your learning journey.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Refresh & Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transform transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200'
              : toast.type === 'error'
                ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border-red-200'
                : 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border-blue-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
          {toast.type === 'error' && <X className="w-6 h-6 text-red-600" />}
          {toast.type === 'info' && <Award className="w-6 h-6 text-blue-600" />}
          <span className="text-sm font-semibold">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-2">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Filters & Options</span>
              <div
                className={`ml-auto transform transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`}
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          </div>

          {/* Sidebar Filters */}
          <div
            className={`lg:w-60 flex-shrink-0 transition-all duration-300 ${
              isFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200/60 p-4 sticky top-4">
              {/* Page Title */}
              <div className="mb-4 text-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  {showMyCourses ? 'My Learning Journey' : 'Course Catalog'}
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  {showMyCourses
                    ? 'Continue your progress and master new skills'
                    : 'Discover courses to transform your career'}
                </p>
              </div>

              {/* My Courses Toggle */}
              <div className="mb-4">
                <button
                  onClick={toggleMyCourses}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm ${
                    showMyCourses
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {showMyCourses ? 'Browse All Courses' : 'View My Courses'}
                  {showMyCourses && <Sparkles className="w-3 h-3 ml-1" />}
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                  <h3 className="text-base font-bold text-gray-900">Filter Courses</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                <FilterSection
                  title="Skill Level"
                  options={levels}
                  currentValue={filters.level}
                  onChange={value => handleFilterChange('level', value)}
                  icon={Target}
                />

                <FilterSection
                  title="Learning Mode"
                  options={modes}
                  currentValue={filters.mode}
                  onChange={value => handleFilterChange('mode', value)}
                  icon={Globe}
                />

                <FilterSection
                  title="Course Type"
                  options={featuredOptions}
                  currentValue={filters.featured}
                  onChange={value => handleFilterChange('featured', value)}
                  icon={Star}
                />
              </div>

              {/* Active Filters Count */}
              {hasActiveFilters && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-900">
                      {Object.values(filters).filter(val => val !== 'all' && val !== '').length}{' '}
                      active filters
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/60 p-3 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {showMyCourses ? '🎓 My Learning Progress' : '📚 Available Courses'}
                  </p>
                  <p className="text-gray-600 mt-0.5 text-xs">
                    {loading
                      ? 'Discovering amazing courses...'
                      : `Showing ${courses.length} of ${pagination.totalItems} courses`}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setViewMode('card')}
                      className={`p-1.5 rounded-md transition-all duration-200 ${
                        viewMode === 'card'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <Grid3X3 className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-md transition-all duration-200 ${
                        viewMode === 'table'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <Table className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-600">Active:</span>
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-md border border-blue-200">
                      🔍 "{filters.search}"
                      <button
                        onClick={() => handleSearchChange('')}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </span>
                  )}
                  {filters.level !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-md border border-green-200">
                      🎯 {levels.find(l => l.value === filters.level)?.label}
                      <button
                        onClick={() => handleFilterChange('level', 'all')}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </span>
                  )}
                  {filters.mode !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-md border border-purple-200">
                      🌐 {modes.find(m => m.value === filters.mode)?.label}
                      <button
                        onClick={() => handleFilterChange('mode', 'all')}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </span>
                  )}
                  {filters.featured !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-md border border-yellow-200">
                      ⭐ {filters.featured === 'true' ? 'Featured' : 'Regular'}
                      <button
                        onClick={() => handleFilterChange('featured', 'all')}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Courses Display */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <CourseCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Courses</h3>
                <p className="text-gray-600 mb-6 text-lg">{error}</p>
                <button
                  onClick={fetchCourses}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Try Again
                </button>
              </div>
            ) : courses.length > 0 ? (
              <>
                {viewMode === 'card' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                      <CourseCard
                        key={course.course_id}
                        course={course}
                        viewMode="grid"
                        showActions={true}
                        isEnrolled={isCourseEnrolled(course.course_id)}
                        enrollmentStatus={getEnrollmentStatus(course.course_id)}
                        enrollmentProgress={getEnrollmentProgress(course.course_id)}
                        showMyCourses={showMyCourses}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map(course => (
                      <CourseCard
                        key={course.course_id}
                        course={course}
                        viewMode="list"
                        showActions={true}
                        isEnrolled={isCourseEnrolled(course.course_id)}
                        enrollmentStatus={getEnrollmentStatus(course.course_id)}
                        enrollmentProgress={getEnrollmentProgress(course.course_id)}
                        showMyCourses={showMyCourses}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200 rounded-b-2xl mt-8 shadow-lg">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Showing</span>
                      <span className="font-semibold">
                        {(filters.page - 1) * filters.limit + 1}
                      </span>
                      <span>to</span>
                      <span className="font-semibold">
                        {Math.min(filters.page * filters.limit, pagination.totalItems)}
                      </span>
                      <span>of</span>
                      <span className="font-semibold">{pagination.totalItems}</span>
                      <span>results</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={filters.page === 1}
                        className="p-3 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                        className="p-3 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
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
                            className={`w-10 h-10 text-sm rounded-xl border transition-all duration-200 font-medium ${
                              filters.page === pageNum
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                                : 'border-gray-300 hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === pagination.totalPages}
                        className="p-3 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={filters.page === pagination.totalPages}
                        className="p-3 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {showMyCourses ? 'No Enrolled Courses' : 'No Courses Found'}
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  {hasActiveFilters
                    ? 'No courses match your current filters. Try adjusting your search criteria.'
                    : showMyCourses
                      ? "You haven't enrolled in any courses yet. Start your learning journey by browsing our catalog!"
                      : 'No courses are currently available. Please check back later.'}
                </p>
                <div className="flex gap-4 justify-center">
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Clear Filters
                    </button>
                  )}
                  {showMyCourses && (
                    <button
                      onClick={toggleMyCourses}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Browse Courses
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCatalog
