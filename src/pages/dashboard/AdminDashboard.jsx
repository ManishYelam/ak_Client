// src/pages/dashboard/AdminDashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Icons (same as before)
const Users = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const BookOpen = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const CreditCard = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

const TrendingUp = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const BarChart3 = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const Clock = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const MessageCircle = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const CheckCircle2 = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Calendar = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const RefreshCw = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const Shield = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const Settings = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const Cpu = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
)

// Pre-loaded mock data - NO API CALLS
const ADMIN_MOCK_DATA = {
  overview: {
    total_students: 156,
    total_courses: 12,
    total_revenue: 125000,
    total_enrollments: 487,
    pending_approvals: 8,
    active_sessions: 3,
    support_tickets: 12,
    completion_rate: 78,
    active_users: 45
  },
  recent_enrollments: [
    {
      id: 1,
      User: {
        full_name: "Rahul Sharma",
        email: "rahul@example.com"
      },
      Course: {
        title: "SAP ABAP Basics"
      },
      enrollment_date: new Date().toISOString(),
      status: "active"
    },
    {
      id: 2,
      User: {
        full_name: "Priya Patel",
        email: "priya@example.com"
      },
      Course: {
        title: "Advanced ABAP Programming"
      },
      enrollment_date: new Date().toISOString(),
      status: "active"
    },
    {
      id: 3,
      User: {
        full_name: "Amit Kumar",
        email: "amit@example.com"
      },
      Course: {
        title: "SAP Fiori Development"
      },
      enrollment_date: new Date().toISOString(),
      status: "pending"
    }
  ],
  course_performance: [
    {
      id: 1,
      title: "SAP ABAP Basics",
      enrollment_count: 120,
      avg_progress: 75,
      revenue: 45000,
      rating: 4.8
    },
    {
      id: 2,
      title: "Advanced ABAP Programming",
      enrollment_count: 85,
      avg_progress: 68,
      revenue: 38000,
      rating: 4.9
    },
    {
      id: 3,
      title: "SAP Fiori Development",
      enrollment_count: 65,
      avg_progress: 72,
      revenue: 32000,
      rating: 4.7
    }
  ],
  system_health: {
    server_uptime: "99.9%",
    active_users: 45,
    storage_used: "65%",
    last_backup: new Date().toISOString()
  },
  realTime: {
    active_students: 23,
    active_courses: 8,
    today_revenue: 12500,
    today_enrollments: 7
  },
  system: {
    cpu_usage: 45,
    memory_usage: 62,
    disk_usage: 78,
    response_time: "120ms"
  }
}

// Custom hook for admin dashboard data - INSTANT LOADING
const useAdminDashboard = () => {
  const [data, setData] = useState(ADMIN_MOCK_DATA) // Pre-loaded data
  const [loading, setLoading] = useState(false) // No loading initially
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setLoading(true)
      // Simulate instant refresh - no delay
      setTimeout(() => {
        setData(ADMIN_MOCK_DATA)
        setLastUpdate(new Date())
        setLoading(false)
      }, 0)
    }
  }, [])

  return { data, loading, lastUpdate, refetch: fetchData }
}

// RealTimeMetrics Component with React.memo
const RealTimeMetrics = React.memo(({ metrics }) => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Cpu className="w-5 h-5 mr-2" />
      Real-time Metrics
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold">{metrics?.active_students || 0}</div>
        <div className="text-blue-200 text-sm">Active Students</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{metrics?.active_courses || 0}</div>
        <div className="text-blue-200 text-sm">Active Courses</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">₹{(metrics?.today_revenue || 0).toLocaleString()}</div>
        <div className="text-blue-200 text-sm">Today's Revenue</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{metrics?.today_enrollments || 0}</div>
        <div className="text-blue-200 text-sm">New Enrollments</div>
      </div>
    </div>
  </div>
))

// SystemHealth Component with React.memo
const SystemHealth = React.memo(({ system }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Shield className="w-5 h-5 mr-2 text-green-600" />
      System Health
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-gray-900">{system?.cpu_usage || 0}%</div>
        <div className="text-gray-600 text-sm">CPU Usage</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${system?.cpu_usage || 0}%` }}
          />
        </div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-gray-900">{system?.memory_usage || 0}%</div>
        <div className="text-gray-600 text-sm">Memory</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${system?.memory_usage || 0}%` }}
          />
        </div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-gray-900">{system?.disk_usage || 0}%</div>
        <div className="text-gray-600 text-sm">Disk Space</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-orange-500 h-2 rounded-full"
            style={{ width: `${system?.disk_usage || 0}%` }}
          />
        </div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-gray-900">{system?.response_time || '0ms'}</div>
        <div className="text-gray-600 text-sm">Response Time</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-purple-500 h-2 rounded-full"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  </div>
))

// QuickActionsGrid Component with React.memo
const QuickActionsGrid = React.memo(({ actions }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.href}
          className="flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 hover:scale-105 group"
        >
          <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <action.icon className={`w-6 h-6 ${action.color}`} />
          </div>
          <p className="font-semibold text-gray-700 group-hover:text-primary-600 mb-1">
            {action.name}
          </p>
          <p className="text-sm text-gray-500">{action.description}</p>
          {action.count !== undefined && (
            <span className={`mt-2 text-xs px-2 py-1 rounded-full ${
              action.count > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {action.count} {action.count === 1 ? 'item' : 'items'}
            </span>
          )}
        </Link>
      ))}
    </div>
  </div>
))

// RecentActivityFeed Component with React.memo
const RecentActivityFeed = React.memo(({ activities }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            activity.type === 'enrollment' ? 'bg-green-100' :
            activity.type === 'payment' ? 'bg-blue-100' :
            activity.type === 'support' ? 'bg-orange-100' : 'bg-gray-100'
          }`}>
            <activity.icon className={`w-4 h-4 ${
              activity.type === 'enrollment' ? 'text-green-600' :
              activity.type === 'payment' ? 'text-blue-600' :
              activity.type === 'support' ? 'text-orange-600' : 'text-gray-600'
            }`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
))

const AdminDashboard = () => {
  const { user } = useAuth()
  const { data: dashboardData, loading, lastUpdate, refetch } = useAdminDashboard()
  const [autoRefresh, setAutoRefresh] = useState(false)

  const userData = user?.user || user
  const { overview, recent_enrollments, course_performance, system_health, realTime, system } = dashboardData || {}

  // Use useMemo for derived data
  const stats = useMemo(() => [
    {
      name: 'Total Students',
      value: overview?.total_students || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive',
      realTime: realTime?.active_students || 0,
      realTimeLabel: 'Online Now'
    },
    {
      name: 'Total Courses',
      value: overview?.total_courses || 0,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+5%',
      changeType: 'positive',
      realTime: realTime?.active_courses || 0,
      realTimeLabel: 'Active'
    },
    {
      name: 'Total Revenue',
      value: `₹${(overview?.total_revenue || 0).toLocaleString()}`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%',
      changeType: 'positive',
      realTime: `₹${(realTime?.today_revenue || 0).toLocaleString()}`,
      realTimeLabel: 'Today'
    },
    {
      name: 'Enrollments',
      value: overview?.total_enrollments || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+8%',
      changeType: 'positive',
      realTime: realTime?.today_enrollments || 0,
      realTimeLabel: 'Today'
    }
  ], [overview, realTime])

  const quickActions = useMemo(() => [
    {
      name: 'Student Management',
      description: 'Manage students and enrollments',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/dashboard/students',
      count: overview?.pending_approvals || 0
    },
    {
      name: 'Course Management',
      description: 'Create and manage courses',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/dashboard/courses'
    },
    {
      name: 'Payment Management',
      description: 'View and manage payments',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/dashboard/payments'
    },
    {
      name: 'System Settings',
      description: 'Configure system settings',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      href: '/dashboard/system'
    }
  ], [overview])

  const recentActivities = useMemo(() => [
    {
      type: 'enrollment',
      message: 'New student enrollment: Rahul Sharma',
      time: '2 minutes ago',
      icon: Users
    },
    {
      type: 'payment',
      message: 'Payment received: ₹12,500',
      time: '5 minutes ago',
      icon: CreditCard
    },
    {
      type: 'support',
      message: 'New support ticket created',
      time: '10 minutes ago',
      icon: MessageCircle
    }
  ], [])

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Just now'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => refetch(true)}
            disabled={loading}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">Auto-refresh</span>
          </label>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
              Welcome back, {userData?.full_name || userData?.name || 'Admin'}! 👋
            </h1>
            <p className="text-primary-100 text-lg mb-6 max-w-2xl">
              Manage your SAP ABAP learning platform. Here's what's happening today.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span className="font-medium">System: {system_health?.server_uptime || '99.9%'} Uptime</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Users className="w-4 h-4 text-blue-300" />
                <span className="font-medium">{overview?.active_users || 45} Active Users</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Calendar className="w-4 h-4 text-purple-300" />
                <span className="font-medium">Last Backup: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 lg:ml-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{overview?.completion_rate || 78}%</div>
              <div className="text-primary-200 text-sm">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <RealTimeMetrics metrics={realTime} />

      {/* System Health */}
      <SystemHealth system={system} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.name} 
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <div className="space-y-1">
                  <p className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                  <p className="text-xs text-gray-500">
                    {stat.realTimeLabel}: {stat.realTime}
                  </p>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor} transition-transform duration-300 hover:scale-110`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <QuickActionsGrid actions={quickActions} />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivityFeed activities={recentActivities} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Enrollments</h2>
            <Link to="/dashboard/students" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1 transition-colors duration-200">
              <span>View all</span>
              <Users className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recent_enrollments?.slice(0, 5).map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {enrollment.User.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {enrollment.User.full_name}
                    </h3>
                    <p className="text-sm text-gray-500">{enrollment.User.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{enrollment.Course.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      enrollment.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {enrollment.status}
                    </span>
                    <p className="text-sm text-gray-500">
                      {new Date(enrollment.enrollment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Course Performance</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {course_performance?.slice(0, 5).map((course, index) => (
              <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500">
                      {course.enrollment_count} enrollments • {Math.round(course.avg_progress)}% avg progress
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">
                    ₹{course.revenue?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AdminDashboard)