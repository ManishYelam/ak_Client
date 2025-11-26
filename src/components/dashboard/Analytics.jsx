import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { analyticsAPI } from '../../services/api'
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  FileText,
  MessageSquare,
  Calendar,
  Download,
  RefreshCw,
  UserCheck,
  BarChart3,
  PieChart as PieChartIcon,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react'

// Compact components
const StatCard = ({ title, value, icon: Icon, color, change, subtitle }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all duration-150">
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-600 truncate mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
        {change && (
          <div className="flex items-center mt-1 text-xs text-gray-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            {change}
          </div>
        )}
      </div>
      <div className={`p-2 rounded-md ${color} ml-3 flex-shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
  </div>
)

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
      active
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`}
  >
    {Icon && <Icon className="w-4 h-4 mr-2" />}
    {children}
  </button>
)

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="flex flex-col items-center space-y-3">
      <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
      <p className="text-sm text-gray-600">Loading analytics...</p>
    </div>
  </div>
)

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [overview, setOverview] = useState(null)
  const [revenueData, setRevenueData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [courseData, setCourseData] = useState(null)
  const [supportData, setSupportData] = useState(null)
  const [blogData, setBlogData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('monthly')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [customData, setCustomData] = useState(null)
  const [customLoading, setCustomLoading] = useState(false)
  const [customError, setCustomError] = useState('')

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  useEffect(() => {
    fetchAnalyticsData()
  }, [period])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        overviewResponse,
        revenueResponse,
        userResponse,
        courseResponse,
        supportResponse,
        blogResponse,
      ] = await Promise.all([
        analyticsAPI.getDashboardOverview(),
        analyticsAPI.getRevenueAnalytics({ period }),
        analyticsAPI.getUserAnalytics(),
        analyticsAPI.getCourseAnalytics(),
        analyticsAPI.getSupportAnalytics(),
        analyticsAPI.getBlogAnalytics(),
      ])

      if (overviewResponse.data.success) setOverview(overviewResponse.data.data)
      if (revenueResponse.data.success) setRevenueData(revenueResponse.data.data)
      if (userResponse.data.success) setUserData(userResponse.data.data)
      if (courseResponse.data.success) setCourseData(courseResponse.data.data)
      if (supportResponse.data.success) setSupportData(supportResponse.data.data)
      if (blogResponse.data.success) setBlogData(blogResponse.data.data)
    } catch (err) {
      setError('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomAnalytics = async () => {
    if (!startDate || !endDate) {
      setCustomError('Please select both start and end dates')
      return
    }

    try {
      setCustomLoading(true)
      setCustomError('')

      const response = await analyticsAPI.getCustomAnalytics({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      })

      if (response.data.success) {
        setCustomData(response.data.data)
      } else {
        setCustomError('Failed to fetch custom analytics data')
      }
    } catch (err) {
      setCustomError('Error fetching custom analytics data')
    } finally {
      setCustomLoading(false)
    }
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount / 100)
  }

  // Dashboard Overview Component
  const AnalyticsDashboard = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1> */}
          <p className="text-xs text-gray-600 mt-0.5">Platform performance metrics</p>
        </div>
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={fetchAnalyticsData}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-3 h-3 mr-1.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Total Users"
          value={overview?.totalUsers || 0}
          icon={Users}
          color="bg-blue-500"
          subtitle={`${overview?.activeUsers || 0} active`}
        />
        <StatCard
          title="Total Courses"
          value={overview?.totalCourses || 0}
          icon={BookOpen}
          color="bg-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(overview?.totalRevenue || 0)}
          icon={DollarSign}
          color="bg-amber-500"
          change={`${revenueData?.revenueGrowth || 0}% growth`}
        />
        <StatCard
          title="Active Users"
          value={overview?.activeUsers || 0}
          icon={UserCheck}
          color="bg-purple-500"
        />
      </div>

      {/* Second Row Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <StatCard
          title="Enrollments"
          value={overview?.totalEnrollments || 0}
          icon={TrendingUp}
          color="bg-blue-400"
        />
        <StatCard
          title="Support Tickets"
          value={overview?.supportTickets || 0}
          icon={MessageSquare}
          color="bg-orange-500"
        />
        <StatCard
          title="Demo Requests"
          value={overview?.demoRequests || 0}
          icon={Calendar}
          color="bg-cyan-500"
        />
        <StatCard
          title="Pending"
          value={overview?.pendingEnrollments || 0}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Blog Posts"
          value={overview?.totalBlogs || 0}
          icon={FileText}
          color="bg-pink-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-blue-600" />
              Revenue Trend
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData?.revenueTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="period" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} />
              <Tooltip
                formatter={value => [formatCurrency(value), 'Revenue']}
                contentStyle={{ fontSize: '12px', borderRadius: '6px' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <PieChartIcon className="w-4 h-4 mr-1.5 text-green-600" />
              User Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={userData?.userStats || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ role, count }) => `${role}: ${count}`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="count"
              >
                {userData?.userStats?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-4 h-4 mr-1.5 text-purple-600" />
              Top Courses
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={courseData?.courseStats?.slice(0, 5) || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis type="number" stroke="#6B7280" fontSize={11} />
              <YAxis type="category" dataKey="title" width={80} stroke="#6B7280" fontSize={11} />
              <Tooltip />
              <Bar dataKey="enrollmentCount" fill="#8B5CF6" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Support Tickets */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-4 h-4 mr-1.5 text-orange-600" />
              Support Tickets
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={supportData?.ticketStats || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="status" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Blog Performance */}
      {blogData && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-4 h-4 mr-1.5 text-pink-600" />
            Blog Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <p className="text-lg font-bold text-gray-900">{blogData.totalBlogs}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <p className="text-lg font-bold text-gray-900">{blogData.totalViews}</p>
              <p className="text-xs text-gray-600">Views</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <p className="text-lg font-bold text-gray-900">
                {Math.round(blogData.avgViews || 0)}
              </p>
              <p className="text-xs text-gray-600">Avg Views</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <p className="text-lg font-bold text-gray-900">{blogData.publishedBlogs}</p>
              <p className="text-xs text-gray-600">Published</p>
            </div>
          </div>

          {/* Popular Blogs */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3">Popular Blogs</h4>
            <div className="space-y-2">
              {blogData.popularBlogs?.slice(0, 3).map(blog => (
                <div
                  key={blog.blog_id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{blog.title}</p>
                    <p className="text-xs text-gray-600 truncate">By {blog.author?.full_name}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-900">{blog.view_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Date Range Analytics Component
  const DateRangeAnalytics = () => (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Custom Date Analytics</h1>
        <p className="text-xs text-gray-600 mt-0.5">Generate reports for specific periods</p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-1.5 text-blue-600" />
          Select Date Range
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={fetchCustomAnalytics}
            disabled={customLoading}
            className="flex items-center justify-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {customLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin mr-1.5" />
            ) : (
              <Download className="w-3 h-3 mr-1.5" />
            )}
            {customLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {customError && (
          <div className="flex items-center mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-3 h-3 text-red-600 mr-1.5" />
            <p className="text-xs text-red-600">{customError}</p>
          </div>
        )}
      </div>

      {customData && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Report Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <StatCard
                title="New Users"
                value={customData.newUsers}
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                title="Enrollments"
                value={customData.newEnrollments}
                icon={BookOpen}
                color="bg-green-500"
              />
              <StatCard
                title="Revenue"
                value={formatCurrency(customData.revenue)}
                icon={DollarSign}
                color="bg-amber-500"
              />
              <StatCard
                title="Tickets"
                value={customData.supportTickets}
                icon={MessageSquare}
                color="bg-orange-500"
              />
              <StatCard
                title="Demos"
                value={customData.demoRequests}
                icon={Calendar}
                color="bg-cyan-500"
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-xs font-semibold text-gray-900 mb-3">Additional Metrics</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <FileText className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-sm font-bold text-gray-900">{customData.blogPosts}</p>
                  <p className="text-xs text-gray-600">Blogs</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-bold text-gray-900">{customData.payments}</p>
                  <p className="text-xs text-gray-600">Payments</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-xs font-semibold text-gray-900 mb-3">Report Period</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                  <span className="text-xs text-gray-700">Start</span>
                  <span className="text-xs text-gray-900">
                    {new Date(customData.period.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                  <span className="text-xs text-gray-700">End</span>
                  <span className="text-xs text-gray-900">
                    {new Date(customData.period.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                  <span className="text-xs text-gray-700">Days</span>
                  <span className="text-xs text-green-700 font-medium">
                    {Math.ceil(
                      (new Date(customData.period.endDate) -
                        new Date(customData.period.startDate)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (loading && activeTab === 'overview') {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg border border-gray-200 p-1">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon={BarChart3}
          >
            Overview
          </TabButton>
          <TabButton
            active={activeTab === 'custom'}
            onClick={() => setActiveTab('custom')}
            icon={Calendar}
          >
            Custom Range
          </TabButton>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center p-3 mb-4 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Content */}
        {activeTab === 'overview' && <AnalyticsDashboard />}
        {activeTab === 'custom' && <DateRangeAnalytics />}
      </div>
    </div>
  )
}

export default Analytics
