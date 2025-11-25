// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserData, classNames } from '../utils/helpers'

// Icons - Define all icons first
const Menu = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
)

const X = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const Home = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const BookOpen = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

const Users = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
)

const BarChart3 = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const CreditCard = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
)

const Award = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Settings = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

const User = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const LogOut = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
)

const Bell = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.81-2.68 6 6 0 00-1.9 5.22 2.5 2.5 0 01-2.35 2.68A2.5 2.5 0 014.5 16H8a3 3 0 006 0h4.5a2.5 2.5 0 00.33-4.98 2.5 2.5 0 01-2.35-2.68 6 6 0 00-1.9-5.22 5.97 5.97 0 01-3.81 2.68z"
    />
  </svg>
)

const Search = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const ChevronDown = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronRight = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

// Navigation items based on user role - Define this AFTER all icons are defined
const getNavigationItems = userRole => {
  const commonItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      exact: true,
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ]

  const studentItems = [
    {
      name: 'My Courses',
      href: '/dashboard/courses',
      icon: BookOpen,
    },
    {
      name: 'Progress',
      href: '/dashboard/progress',
      icon: BarChart3,
    },
    {
      name: 'Certificates',
      href: '/dashboard/certificates',
      icon: Award,
    },
    {
      name: 'Payments',
      href: '/dashboard/payments',
      icon: CreditCard,
    },
  ]

  const adminItems = [
    {
      name: 'Students',
      href: '/dashboard/students',
      icon: Users,
    },
    {
      name: 'Course Management',
      href: '/dashboard/courses',
      icon: BookOpen,
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: BarChart3,
    },
    {
      name: 'Payment Management',
      href: '/dashboard/payments',
      icon: CreditCard,
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
    {
      name: 'System Settings',
      href: '/dashboard/system',
      icon: Settings,
    },
  ]

  if (userRole === 'admin') {
    return [...commonItems.filter(item => item.name !== 'Dashboard'), ...adminItems]
  } else {
    return [...commonItems, ...studentItems]
  }
}

// Error Boundary for Layout
class LayoutErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Layout Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Layout Error</h3>
            <p className="text-gray-600 mb-4">
              Something went wrong with the layout. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Mobile sidebar component
const MobileSidebar = React.memo(
  ({ isOpen, onClose, navigationItems, userRole, userData, currentPath, onLogout }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 flex z-50 lg:hidden">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-in-out duration-300"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl transform transition ease-in-out duration-300 translate-x-0">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Learn SAP ABAP</h1>
                  <p className="text-xs text-gray-500 capitalize">{userRole} Portal</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 px-4 space-y-2" aria-label="Sidebar navigation">
              {navigationItems.map(item => {
                const isActive = item.exact
                  ? currentPath === item.href
                  : currentPath.startsWith(item.href)

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon
                      className={classNames(
                        'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                        isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User section */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userData?.full_name?.charAt(0) || userData?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userData?.full_name || userData?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {userRole} • {userData?.email}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="ml-3 flex-shrink-0 p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-lg hover:bg-gray-100"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

MobileSidebar.displayName = 'MobileSidebar'

// Desktop sidebar component
const DesktopSidebar = React.memo(
  ({ navigationItems, userRole, userData, currentPath, onLogout }) => {
    return (
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Learn SAP ABAP</h1>
                  <p className="text-xs text-gray-500 capitalize">{userRole} Portal</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 px-4 space-y-2" aria-label="Sidebar navigation">
              {navigationItems.map(item => {
                const isActive = item.exact
                  ? currentPath === item.href
                  : currentPath.startsWith(item.href)

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon
                      className={classNames(
                        'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                        isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User section */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userData?.full_name?.charAt(0) || userData?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userData?.full_name || userData?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
              </div>
              <div className="relative">
                <button
                  onClick={onLogout}
                  className="ml-3 flex-shrink-0 p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-lg hover:bg-gray-100"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

DesktopSidebar.displayName = 'DesktopSidebar'

// Header component
const Header = React.memo(({ onMenuClick, userData, userRole, onLogout }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (showUserDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserDropdown])

  // Get current page title from navigation items
  const getCurrentPageTitle = useCallback(() => {
    const navigationItems = getNavigationItems(userRole)
    const currentItem = navigationItems.find(item =>
      item.exact ? location.pathname === item.href : location.pathname.startsWith(item.href)
    )
    return currentItem?.name || 'Dashboard'
  }, [location.pathname, userRole])

  const currentPageTitle = getCurrentPageTitle()

  const handleDashboardClick = () => {
    navigate('/dashboard')
  }

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">{currentPageTitle}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Dashboard Access Button */}
          <button
            onClick={handleDashboardClick}
            className="hidden md:flex items-center space-x-2 bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            title="Go to Dashboard"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Search button */}
          <button
            className="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          {/* <button 
            className="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-lg hover:bg-gray-100 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button> */}

          {/* User dropdown */}
          <div className="relative user-dropdown-container">
            <button
              className="flex items-center space-x-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-2 hover:bg-gray-100 transition-colors"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              aria-expanded={showUserDropdown}
              aria-haspopup="true"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userData?.full_name?.charAt(0) || userData?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="font-medium text-gray-900 text-sm">
                    {userData?.full_name || userData?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
              </div>
              <ChevronDown
                className={classNames(
                  'w-4 h-4 text-gray-400 transition-transform',
                  showUserDropdown ? 'rotate-180' : ''
                )}
              />
            </button>

            {/* Dropdown menu */}
            {showUserDropdown && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-scale-in">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userData?.full_name || userData?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                  </div>

                  <Link
                    to="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserDropdown(false)}
                    role="menuitem"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Your Profile
                  </Link>

                  <Link
                    to="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserDropdown(false)}
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>

                  <div className="border-t border-gray-100"></div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false)
                      onLogout()
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

Header.displayName = 'Header'

// Main DashboardLayout component
const DashboardLayout = ({ children, userRole: propUserRole, userData: propUserData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout, user: authUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Enhanced user data handling
  const userData = useMemo(() => {
    return propUserData || getUserData(authUser)
  }, [propUserData, authUser])

  const userRole = useMemo(() => {
    return propUserRole || userData?.role || 'student'
  }, [propUserRole, userData])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Handle logout with better error handling
  const handleLogout = useCallback(async () => {
    try {
      await logout()
      navigate('/login', {
        replace: true,
        state: {
          message: 'You have been successfully logged out.',
          timestamp: Date.now(),
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback navigation
      navigate('/login', { replace: true })
    }
  }, [logout, navigate])

  const navigationItems = useMemo(() => getNavigationItems(userRole), [userRole])

  return (
    <LayoutErrorBoundary>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        {/* Mobile sidebar */}
        <MobileSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          navigationItems={navigationItems}
          userRole={userRole}
          userData={userData}
          currentPath={location.pathname}
          onLogout={handleLogout}
        />

        {/* Desktop sidebar */}
        <DesktopSidebar
          navigationItems={navigationItems}
          userRole={userRole}
          userData={userData}
          currentPath={location.pathname}
          onLogout={handleLogout}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            userData={userData}
            userRole={userRole}
            onLogout={handleLogout}
          />

          {/* Main content */}
          <main
            className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50"
            id="main-content"
          >
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <div className="text-sm text-gray-600">
                  © {new Date().getFullYear()} Learn SAP ABAP. All rights reserved.
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <Link to="/privacy" className="hover:text-gray-700 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="hover:text-gray-700 transition-colors">
                    Terms of Service
                  </Link>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>System Online</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Close sidebar when clicking outside (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </LayoutErrorBoundary>
  )
}

export default React.memo(DashboardLayout)
