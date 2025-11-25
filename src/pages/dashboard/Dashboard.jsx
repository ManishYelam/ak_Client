// src/pages/dashboard/Dashboard.jsx
import React, { lazy, Suspense, useMemo, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../layouts/DashboardLayout'
import { getUserData } from '../../utils/helpers'

// Lazy load all dashboard components
const StudentDashboard = lazy(() =>
  import('./StudentDashboard').catch(() => ({
    default: () => <div>Failed to load Student Dashboard</div>,
  }))
)

const AdminDashboard = lazy(() =>
  import('./AdminDashboard').catch(() => ({
    default: () => <div>Failed to load Admin Dashboard</div>,
  }))
)

// Import all the new components we created
const Profile = lazy(() => import('../../components/dashboard/Profile'))
const Settings = lazy(() => import('../../components/dashboard/Settings'))
const MyCourses = lazy(() => import('../../components/dashboard/MyCourses'))
const Progress = lazy(() => import('../../components/dashboard/Progress'))
const Certificates = lazy(() => import('../../components/dashboard/Certificates'))
const Payments = lazy(() => import('../../components/dashboard/Payments'))
const StudentsManagement = lazy(() => import('../../components/dashboard/StudentManagement'))
const CourseManagement = lazy(() => import('../../components/dashboard/CourseManagement'))
const Reports = lazy(() => import('../../components/dashboard/Reports'))
const PaymentManagement = lazy(() => import('../../components/dashboard/PaymentManagement'))
const Analytics = lazy(() => import('../../components/dashboard/Analytics'))
const SystemSettings = lazy(() => import('../../components/dashboard/SystemSettings'))

// Enhanced loading component
const DashboardLoading = ({ message = 'Loading dashboard...' }) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">{message}</p>
      <p className="text-sm text-gray-500 mt-2">Please wait while we load your data</p>
    </div>
  </div>
)

// Enhanced error component
const DashboardError = ({ message, errorCode, showRetry = true, onRetry }) => (
  <div className="text-center py-16">
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Dashboard Error</h3>
      <p className="text-red-600 mb-4">{message}</p>
      {errorCode && <p className="text-sm text-red-500 mb-4">Error Code: {errorCode}</p>}
      {showRetry && (
        <div className="flex space-x-3 justify-center">
          <button
            onClick={onRetry || (() => window.location.reload())}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Reload Page
          </button>
        </div>
      )}
    </div>
  </div>
)

// Enhanced Network Status Component
const NetworkStatusIndicator = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)
  const [showStatus, setShowStatus] = React.useState(false)

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowStatus(true)
      setTimeout(() => setShowStatus(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowStatus(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showStatus) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        isOnline ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <div className="flex items-center space-x-2 text-white">
        {isOnline ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
        <span className="text-sm font-medium">{isOnline ? 'Back online' : 'You are offline'}</span>
      </div>
    </div>
  )
}

// Enhanced route configurations with all components
const getRouteConfig = userRole => {
  const baseConfig = {
    student: {
      dashboard: StudentDashboard,
      routes: [
        {
          path: 'courses',
          element: <MyCourses />,
        },
        {
          path: 'progress',
          element: <Progress />,
        },
        {
          path: 'certificates',
          element: <Certificates />,
        },
        {
          path: 'payments',
          element: <Payments />,
        },
        {
          path: 'profile',
          element: <Profile />,
        },
        {
          path: 'settings',
          element: <Settings />,
        },
      ],
    },
    admin: {
      dashboard: AdminDashboard,
      routes: [
        {
          path: 'students',
          element: <StudentsManagement />,
        },
        {
          path: 'students/:id',
          element: <div className="p-8">Student Details View - Coming Soon</div>,
        },
        {
          path: 'courses',
          element: <CourseManagement />,
        },
        {
          path: 'reports',
          element: <Reports />,
        },
        {
          path: 'payments',
          element: <PaymentManagement />,
        },
        {
          path: 'analytics',
          element: <Analytics />,
        },
        {
          path: 'system',
          element: <SystemSettings />,
        },
        {
          path: 'profile',
          element: <Profile />,
        },
        {
          path: 'settings',
          element: <Settings />,
        },
      ],
    },
  }

  return baseConfig[userRole] || baseConfig.student
}

// Enhanced Dashboard component
const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  const userData = useMemo(() => getUserData(user), [user])
  const userRole = userData?.role

  // Enhanced debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔐 Dashboard Authentication Debug')
      console.log('📦 Raw user from AuthContext:', user)
      console.log('👤 Processed userData:', userData)
      console.log('🎭 User Role:', userRole)
      console.log('🔄 Auth Loading:', authLoading)
      console.log('✅ Authenticated:', isAuthenticated)
      console.groupEnd()
    }
  }, [authLoading, isAuthenticated, userRole, userData, user])

  // Show loading while checking authentication
  if (authLoading) {
    return <DashboardLoading message="Verifying your session..." />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.warn('🚫 User not authenticated, redirecting to login')
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: 'Please login to access the dashboard',
          timestamp: Date.now(),
        }}
      />
    )
  }

  // Handle missing user role
  if (!userRole) {
    console.error('❌ User role not defined:', userData)
    return (
      <DashboardError
        message="Unable to determine user role. Please contact support."
        errorCode="ROLE_UNDEFINED"
        showRetry={true}
      />
    )
  }

  const config = getRouteConfig(userRole)

  if (!config) {
    console.error('❌ Unsupported user role:', userRole)
    return (
      <DashboardError
        message={`Unsupported user role: ${userRole}. Please contact support.`}
        errorCode="UNSUPPORTED_ROLE"
        showRetry={false}
      />
    )
  }

  const DashboardComponent = config.dashboard

  return (
    <>
      <NetworkStatusIndicator />

      <DashboardLayout userRole={userRole} userData={userData}>
        <Suspense fallback={<DashboardLoading message="Loading dashboard..." />}>
          <Routes>
            <Route index element={<DashboardComponent />} />

            {config.routes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </>
  )
}

// Enhanced error boundary
class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Dashboard Error:', error, errorInfo)
    this.setState({ errorInfo })

    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true,
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <DashboardError
          message="Something went wrong in the dashboard. Our team has been notified."
          errorCode="DASHBOARD_ERROR"
          showRetry={true}
          onRetry={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      )
    }

    return this.props.children
  }
}

export default function DashboardWithErrorBoundary(props) {
  return (
    <DashboardErrorBoundary>
      <Dashboard {...props} />
    </DashboardErrorBoundary>
  )
}
