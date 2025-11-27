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
} from 'recharts'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import {
  userAPI,
  coursesAPI,
  paymentsAPI,
  adminAPI,
  contactAPI,
  feedbackAPI,
  supportAPI,
  analyticsAPI,
} from '../../services/api'
import {
  Download,
  FileText,
  Users,
  BookOpen,
  DollarSign,
  MessageSquare,
  Mail,
  Star,
  Calendar,
  Filter,
  Search,
  Printer,
  FileSpreadsheet,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  DownloadCloud,
  FileDown,
  BarChart2,
  LineChart as LineChartIcon,
} from 'lucide-react'

// Report Categories
const REPORT_CATEGORIES = {
  USERS: 'users',
  COURSES: 'courses',
  FINANCIAL: 'financial',
  SUPPORT: 'support',
  ANALYTICS: 'analytics',
  FEEDBACK: 'feedback',
  CONTACTS: 'contacts',
}

// Report Types for each category
const REPORT_TYPES = {
  // Users
  USER_LIST: 'user-list',
  USER_STATS: 'user-stats',
  USER_ENROLLMENTS: 'user-enrollments',

  // Courses
  COURSE_LIST: 'course-list',
  COURSE_PERFORMANCE: 'course-performance',
  COURSE_ENROLLMENTS: 'course-enrollments',

  // Financial
  PAYMENT_HISTORY: 'payment-history',
  REVENUE_REPORT: 'revenue-report',
  TRANSACTION_DETAILS: 'transaction-details',

  // Support
  TICKET_REPORT: 'ticket-report',
  SUPPORT_STATS: 'support-stats',
  RESPONSE_TIMES: 'response-times',

  // Analytics
  DASHBOARD_ANALYTICS: 'dashboard-analytics',
  USER_ANALYTICS: 'user-analytics',
  REVENUE_ANALYTICS: 'revenue-analytics',

  // Feedback
  FEEDBACK_REPORT: 'feedback-report',
  RATING_ANALYSIS: 'rating-analysis',

  // Contacts
  CONTACT_REPORT: 'contact-report',
  INQUIRY_ANALYSIS: 'inquiry-analysis',
}

// Utility Functions
const formatCurrency = amount => {
  if (!amount) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount / 100)
}

const formatDate = date => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatDateTime = date => {
  if (!date) return '-'
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const calculateGrowth = (current, previous) => {
  if (!previous || previous === 0) return '100%'
  const growth = ((current - previous) / previous) * 100
  return `${Math.round(growth)}%`
}

const getStatusColor = status => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    open: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-100 text-gray-800',
    resolved: 'bg-green-100 text-green-800',
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  }
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getStatusColorForPrint = status => {
  const statusMap = {
    active: 'status-active',
    inactive: 'status-inactive',
    pending: 'status-pending',
    completed: 'status-completed',
    success: 'status-success',
    failed: 'status-failed',
    open: 'status-active',
    closed: 'status-inactive',
    resolved: 'status-completed',
  }
  return statusMap[status?.toLowerCase()] || 'status-pending'
}

const generateChartData = (data, groupBy, valueKey) => {
  return data.reduce((acc, item) => {
    const key = item[groupBy]
    const existing = acc.find(x => x.name === key)
    if (existing) {
      existing.value += item[valueKey] || 1
    } else {
      acc.push({ name: key, value: item[valueKey] || 1 })
    }
    return acc
  }, [])
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

// Enhanced Print function
const printReport = (title, contentId, config = {}) => {
  const printContent = document.getElementById(contentId)

  if (!printContent) {
    console.error('Print content not found')
    return
  }

  const printWindow = window.open('', '_blank', 'width=1000,height=600')

  // Get current date and time
  const now = new Date()
  const generatedDate = now.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  const generatedTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Clone the content to avoid modifying original
  const contentClone = printContent.cloneNode(true)

  // Remove elements that shouldn't be printed
  const elementsToRemove = contentClone.querySelectorAll('.no-print, button, [onclick]')
  elementsToRemove.forEach(el => el.remove())

  // Add print-specific styling
  const printStyles = `
    <style>
      @media print {
        @page {
          size: A4;
          margin: 0.5in;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.4;
          color: #000;
          background: white !important;
          margin: 0;
          padding: 0;
        }
        
        .print-header {
          text-align: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 3px double #333;
        }
        
        .print-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 5px 0;
          color: #1f2937;
        }
        
        .print-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 5px 0;
        }
        
        .print-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
          margin-top: 10px;
        }
        
        .print-section {
          margin: 25px 0;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          font-size: 12px;
        }
        
        th {
          background-color: #f8fafc !important;
          color: #374151;
          font-weight: 600;
          border: 1px solid #e5e7eb;
          padding: 10px 8px;
          text-align: left;
        }
        
        td {
          border: 1px solid #e5e7eb;
          padding: 8px;
          vertical-align: top;
        }
        
        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin: 20px 0;
        }
        
        .stat-card {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 15px;
          text-align: center;
          background: #f9fafb;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .chart-container {
          margin: 20px 0;
          page-break-inside: avoid;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 15px;
          background: white;
        }
        
        .chart-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #374151;
        }
        
        .chart-image {
          max-width: 100%;
          height: auto;
        }
        
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 11px;
          color: #6b7280;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        /* Status badges for print */
        .status-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status-active { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .status-inactive { background: #fecaca; color: #991b1b; border: 1px solid #fca5a5; }
        .status-pending { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
        .status-completed { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
        .status-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .status-failed { background: #fecaca; color: #991b1b; border: 1px solid #fca5a5; }
        
        /* Hide interactive elements */
        button, .btn, .actions, .pagination, .search-box {
          display: none !important;
        }
      }
      
      @media screen {
        .screen-only { display: block; }
        .print-only { display: none; }
      }
      
      @media print {
        .screen-only { display: none; }
        .print-only { display: block; }
      }
    </style>
  `

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Report</title>
        <meta charset="UTF-8">
        ${printStyles}
      </head>
      <body>
        <div class="print-header">
          <h1 class="print-title">${title}</h1>
          <div class="print-subtitle">Comprehensive Analytics Report</div>
          <div class="print-meta">
            <span>Generated on: ${generatedDate} at ${generatedTime}</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
        
        <div class="print-content">
          ${contentClone.innerHTML}
        </div>
        
        <div class="footer">
          <div>Confidential Report - ${config.company || 'Learning Management System'}</div>
          <div>Generated by Admin Dashboard</div>
        </div>
        
        <script>
          // Auto-print and close
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 250);
          };
        </script>
      </body>
    </html>
  `)

  printWindow.document.close()
}

// Export to Excel function
const exportToExcel = (data, filename, columns) => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(item => {
      const row = {}
      columns.forEach(col => {
        if (col.exportKey) {
          row[col.title] = col.exportKey.split('.').reduce((obj, key) => obj?.[key], item) || ''
        } else {
          row[col.title] = item[col.key] || ''
        }
      })
      return row
    })
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')

  // Auto-size columns
  const colWidths = columns.map(col => ({ wch: Math.max(col.title.length, 15) }))
  worksheet['!cols'] = colWidths

  XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`)
}

// Chart Components
const ChartContainer = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
    <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
    {children}
  </div>
)

const SimpleBarChart = ({ data, dataKey, nameKey = 'name' }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={nameKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={dataKey} fill="#3B82F6" />
    </BarChart>
  </ResponsiveContainer>
)

const SimplePieChart = ({ data, dataKey, nameKey = 'name' }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey={dataKey}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
)

const SimpleLineChart = ({ data, dataKey, nameKey = 'name' }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={nameKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={dataKey} stroke="#3B82F6" activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
)

// Components
const DataTable = ({
  data = [],
  columns = [],
  title,
  exportable = true,
  printable = true,
  onExport,
  onPrint,
  summaryStats = null,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const filteredData = data.filter(item =>
    columns.some(col => {
      const value = col.key.includes('.')
        ? col.key.split('.').reduce((obj, key) => obj?.[key], item)
        : item[col.key]
      return String(value || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    })
  )

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      let aValue = sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a)
        : a[sortConfig.key]
      let bValue = sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b)
        : b[sortConfig.key]

      aValue = String(aValue || '').toLowerCase()
      bValue = String(bValue || '').toLowerCase()

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = key => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 no-print">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">{title}</h3>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {exportable && (
            <button
              onClick={onExport}
              className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 no-print"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              Excel
            </button>
          )}
          {printable && (
            <button
              onClick={onPrint}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 no-print"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats for Print */}
      {summaryStats && (
        <div className="print-only p-4 border-b border-gray-200">
          <div className="summary-stats">
            {summaryStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 no-print"
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {sortConfig.key === column.key && column.sortable !== false && (
                      <ChevronDown
                        className={`w-4 h-4 ml-1 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50">
                  {columns.map(column => {
                    const value = column.key.includes('.')
                      ? column.key.split('.').reduce((obj, key) => obj?.[key], row)
                      : row[column.key]

                    return (
                      <td
                        key={column.key}
                        className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                      >
                        {column.render ? column.render(value, row) : value || '-'}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 no-print">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={itemsPerPage}
              onChange={e => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ title, value, icon: Icon, color, change, subtitle }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all duration-150">
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-600 truncate mb-1">{title}</p>
        <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
        {change && (
          <div
            className={`flex items-center mt-1 text-xs ${change.includes('-') ? 'text-red-600' : 'text-green-600'}`}
          >
            <TrendingUp
              className={`w-3 h-3 mr-1 ${change.includes('-') ? 'transform rotate-180' : ''}`}
            />
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

const Reports = () => {
  const [activeCategory, setActiveCategory] = useState(REPORT_CATEGORIES.USERS)
  const [activeReport, setActiveReport] = useState(REPORT_TYPES.USER_LIST)
  const [dateRange, setDateRange] = useState('last-30-days')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Data states
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [payments, setPayments] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [feedback, setFeedback] = useState([])
  const [contacts, setContacts] = useState([])
  const [analytics, setAnalytics] = useState({})

  // Mock data for demonstration
  const mockUserStats = [
    { role: 'student', count: 1500, percentage: 75 },
    { role: 'instructor', count: 45, percentage: 2 },
    { role: 'admin', count: 8, percentage: 0.4 },
    { role: 'guest', count: 447, percentage: 22.6 },
  ]

  const mockRevenueData = [
    { period: 'Jan', revenue: 1250000, growth: 12, transactions: 45, average_order: 27778 },
    { period: 'Feb', revenue: 1450000, growth: 16, transactions: 52, average_order: 27885 },
    { period: 'Mar', revenue: 1650000, growth: 14, transactions: 58, average_order: 28448 },
    { period: 'Apr', revenue: 1850000, growth: 12, transactions: 63, average_order: 29365 },
    { period: 'May', revenue: 2100000, growth: 14, transactions: 68, average_order: 30882 },
    { period: 'Jun', revenue: 1950000, growth: -7, transactions: 61, average_order: 31967 },
  ]

  const mockCoursePerformance = [
    {
      course: 'Web Development',
      enrollments: 450,
      completion_rate: 78,
      revenue: 2250000,
      rating: 4.5,
    },
    {
      course: 'Data Science',
      enrollments: 320,
      completion_rate: 82,
      revenue: 1920000,
      rating: 4.7,
    },
    {
      course: 'Mobile Development',
      enrollments: 280,
      completion_rate: 75,
      revenue: 1680000,
      rating: 4.3,
    },
    {
      course: 'UI/UX Design',
      enrollments: 190,
      completion_rate: 85,
      revenue: 1140000,
      rating: 4.6,
    },
    {
      course: 'Digital Marketing',
      enrollments: 210,
      completion_rate: 72,
      revenue: 1260000,
      rating: 4.2,
    },
  ]

  const mockSupportStats = [
    { status: 'open', count: 12, percentage: 15 },
    { status: 'in_progress', count: 25, percentage: 31 },
    { status: 'resolved', count: 38, percentage: 48 },
    { status: 'closed', count: 5, percentage: 6 },
  ]

  // Load data based on category
  useEffect(() => {
    loadCategoryData(activeCategory)
  }, [activeCategory])

  const loadCategoryData = async category => {
    try {
      setLoading(true)
      setError('')

      switch (category) {
        case REPORT_CATEGORIES.USERS:
          const usersResponse = await userAPI.getAllUsers({})
          setUsers(usersResponse.data?.data?.users || [])
          break

        case REPORT_CATEGORIES.COURSES:
          const coursesResponse = await coursesAPI.getAll({})
          setCourses(coursesResponse.data?.data?.courses || [])
          break

        case REPORT_CATEGORIES.FINANCIAL:
          const paymentsResponse = await paymentsAPI.getHistory()
          setPayments(paymentsResponse.data?.data?.payments || [])
          break

        case REPORT_CATEGORIES.SUPPORT:
          const ticketsResponse = await supportAPI.getTickets()
          setSupportTickets(ticketsResponse.data?.data?.tickets || [])
          break

        case REPORT_CATEGORIES.FEEDBACK:
          const feedbackResponse = await feedbackAPI.getAllFeedback(new URLSearchParams())
          setFeedback(feedbackResponse.data?.data?.feedback || [])
          break

        case REPORT_CATEGORIES.CONTACTS:
          const contactsResponse = await contactAPI.getContacts()
          setContacts(contactsResponse.data?.data?.contacts || [])
          break

        case REPORT_CATEGORIES.ANALYTICS:
          const analyticsResponse = await analyticsAPI.getDashboardOverview()
          setAnalytics(analyticsResponse.data?.data || {})
          break
      }
    } catch (err) {
      setError(`Failed to load ${category} data`)
      console.error('Data load error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Enhanced report configurations with print support
  const reportConfigs = {
    // User Reports
    [REPORT_TYPES.USER_LIST]: {
      title: 'User List Report',
      columns: [
        { key: 'user_id', title: 'ID', sortable: true },
        { key: 'full_name', title: 'Name', sortable: true },
        { key: 'email', title: 'Email', sortable: true },
        { key: 'role', title: 'Role', sortable: true },
        { key: 'phone_number', title: 'Phone' },
        {
          key: 'status',
          title: 'Status',
          render: (value, row) => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
              {value || 'Active'}
            </span>
          ),
        },
        { key: 'createdAt', title: 'Joined', render: formatDate },
      ],
      data: users,
      exportKey: 'users',
      summaryStats: [
        { label: 'Total Users', value: users.length },
        { label: 'Active Users', value: users.filter(u => u.status === 'active').length },
        { label: 'Students', value: users.filter(u => u.role === 'student').length },
        { label: 'Instructors', value: users.filter(u => u.role === 'instructor').length },
      ],
    },

    [REPORT_TYPES.USER_STATS]: {
      title: 'User Statistics Report',
      columns: [
        {
          key: 'role',
          title: 'Role',
          render: value => <span className="capitalize">{value}</span>,
        },
        {
          key: 'count',
          title: 'Count',
          render: value => <span className="font-semibold">{value}</span>,
        },
        {
          key: 'percentage',
          title: 'Percentage',
          render: (_, row, index, data) => {
            const total = data.reduce((sum, item) => sum + item.count, 0)
            const percentage = Math.round((row.count / total) * 100)
            return (
              <div className="flex items-center">
                <span className="w-12">{percentage}%</span>
                <div className="flex-1 ml-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          },
        },
      ],
      data: mockUserStats,
      exportKey: 'user-stats',
      summaryStats: [
        { label: 'Total Users', value: mockUserStats.reduce((sum, item) => sum + item.count, 0) },
        { label: 'Students', value: mockUserStats.find(u => u.role === 'student')?.count || 0 },
        {
          label: 'Instructors',
          value: mockUserStats.find(u => u.role === 'instructor')?.count || 0,
        },
        { label: 'Admins', value: mockUserStats.find(u => u.role === 'admin')?.count || 0 },
      ],
      charts: [
        {
          type: 'pie',
          title: 'User Distribution by Role',
          data: mockUserStats,
          dataKey: 'count',
          nameKey: 'role',
        },
      ],
    },

    // Course Reports
    [REPORT_TYPES.COURSE_LIST]: {
      title: 'Course List Report',
      columns: [
        { key: 'course_id', title: 'ID' },
        { key: 'title', title: 'Course Title' },
        { key: 'fee', title: 'Fee', render: formatCurrency },
        { key: 'duration', title: 'Duration' },
        { key: 'mode', title: 'Mode' },
        { key: 'level', title: 'Level' },
        {
          key: 'is_active',
          title: 'Status',
          render: value => (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {value ? 'Active' : 'Inactive'}
            </span>
          ),
        },
      ],
      data: courses,
      exportKey: 'courses',
      summaryStats: [
        { label: 'Total Courses', value: courses.length },
        { label: 'Active Courses', value: courses.filter(c => c.is_active).length },
        { label: 'Online Courses', value: courses.filter(c => c.mode === 'online').length },
        { label: 'Offline Courses', value: courses.filter(c => c.mode === 'offline').length },
      ],
    },

    [REPORT_TYPES.COURSE_PERFORMANCE]: {
      title: 'Course Performance Report',
      columns: [
        { key: 'course', title: 'Course Name' },
        { key: 'enrollments', title: 'Enrollments' },
        {
          key: 'completion_rate',
          title: 'Completion Rate',
          render: value => `${value}%`,
        },
        { key: 'revenue', title: 'Revenue', render: formatCurrency },
        {
          key: 'rating',
          title: 'Rating',
          render: value => (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span>{value}/5</span>
            </div>
          ),
        },
      ],
      data: mockCoursePerformance,
      exportKey: 'course-performance',
      summaryStats: [
        {
          label: 'Total Enrollments',
          value: mockCoursePerformance.reduce((sum, item) => sum + item.enrollments, 0),
        },
        {
          label: 'Average Rating',
          value: (
            mockCoursePerformance.reduce((sum, item) => sum + item.rating, 0) /
            mockCoursePerformance.length
          ).toFixed(1),
        },
        {
          label: 'Total Revenue',
          value: formatCurrency(mockCoursePerformance.reduce((sum, item) => sum + item.revenue, 0)),
        },
        {
          label: 'Avg Completion',
          value: `${Math.round(mockCoursePerformance.reduce((sum, item) => sum + item.completion_rate, 0) / mockCoursePerformance.length)}%`,
        },
      ],
      charts: [
        {
          type: 'bar',
          title: 'Course Enrollments',
          data: mockCoursePerformance,
          dataKey: 'enrollments',
          nameKey: 'course',
        },
        {
          type: 'bar',
          title: 'Course Revenue',
          data: mockCoursePerformance,
          dataKey: 'revenue',
          nameKey: 'course',
        },
      ],
    },

    // Financial Reports
    [REPORT_TYPES.PAYMENT_HISTORY]: {
      title: 'Payment History Report',
      columns: [
        { key: 'payment_id', title: 'Payment ID' },
        { key: 'rzp_order_id', title: 'Order ID' },
        { key: 'amount', title: 'Amount', render: formatCurrency },
        {
          key: 'status',
          title: 'Status',
          render: value => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
              {value}
            </span>
          ),
        },
        { key: 'method', title: 'Method' },
        { key: 'user.full_name', title: 'User' },
        { key: 'course.title', title: 'Course' },
        { key: 'createdAt', title: 'Date', render: formatDateTime },
      ],
      data: payments,
      exportKey: 'payments',
      summaryStats: [
        { label: 'Total Payments', value: payments.length },
        {
          label: 'Total Revenue',
          value: formatCurrency(payments.reduce((sum, item) => sum + (item.amount || 0), 0)),
        },
        {
          label: 'Successful Payments',
          value: payments.filter(p => p.status === 'success').length,
        },
        { label: 'Failed Payments', value: payments.filter(p => p.status === 'failed').length },
      ],
    },

    [REPORT_TYPES.REVENUE_ANALYTICS]: {
      title: 'Revenue Analytics Report',
      columns: [
        { key: 'period', title: 'Period' },
        {
          key: 'revenue',
          title: 'Revenue',
          render: formatCurrency,
        },
        {
          key: 'growth',
          title: 'Growth',
          render: value => (
            <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {value >= 0 ? '↑' : '↓'} {Math.abs(value)}%
            </span>
          ),
        },
        { key: 'transactions', title: 'Transactions' },
        { key: 'average_order', title: 'Average Order', render: formatCurrency },
      ],
      data: mockRevenueData,
      exportKey: 'revenue-analytics',
      summaryStats: [
        {
          label: 'Total Revenue',
          value: formatCurrency(mockRevenueData.reduce((sum, item) => sum + item.revenue, 0)),
        },
        {
          label: 'Total Transactions',
          value: mockRevenueData.reduce((sum, item) => sum + item.transactions, 0),
        },
        {
          label: 'Average Growth',
          value: `${(mockRevenueData.reduce((sum, item) => sum + item.growth, 0) / mockRevenueData.length).toFixed(1)}%`,
        },
        {
          label: 'Avg Order Value',
          value: formatCurrency(
            Math.round(
              mockRevenueData.reduce((sum, item) => sum + item.average_order, 0) /
                mockRevenueData.length
            )
          ),
        },
      ],
      charts: [
        {
          type: 'line',
          title: 'Monthly Revenue Trend',
          data: mockRevenueData,
          dataKey: 'revenue',
          nameKey: 'period',
        },
        {
          type: 'bar',
          title: 'Monthly Transactions',
          data: mockRevenueData,
          dataKey: 'transactions',
          nameKey: 'period',
        },
      ],
    },

    // Support Reports
    [REPORT_TYPES.TICKET_REPORT]: {
      title: 'Support Tickets Report',
      columns: [
        { key: 'ticket_number', title: 'Ticket No' },
        { key: 'subject', title: 'Subject' },
        { key: 'category', title: 'Category' },
        {
          key: 'priority',
          title: 'Priority',
          render: value => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
              {value}
            </span>
          ),
        },
        {
          key: 'status',
          title: 'Status',
          render: value => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
              {value}
            </span>
          ),
        },
        { key: 'user.full_name', title: 'User' },
        { key: 'created_at', title: 'Created', render: formatDateTime },
        { key: 'resolved_at', title: 'Resolved', render: formatDateTime },
      ],
      data: supportTickets,
      exportKey: 'support-tickets',
      summaryStats: [
        { label: 'Total Tickets', value: supportTickets.length },
        { label: 'Open Tickets', value: supportTickets.filter(t => t.status === 'open').length },
        {
          label: 'Resolved Tickets',
          value: supportTickets.filter(t => t.status === 'resolved').length,
        },
        { label: 'High Priority', value: supportTickets.filter(t => t.priority === 'high').length },
      ],
    },

    [REPORT_TYPES.SUPPORT_STATS]: {
      title: 'Support Statistics Report',
      columns: [
        {
          key: 'status',
          title: 'Status',
          render: value => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
              {value.replace('_', ' ').toUpperCase()}
            </span>
          ),
        },
        { key: 'count', title: 'Count' },
        {
          key: 'percentage',
          title: 'Percentage',
          render: value => `${value}%`,
        },
      ],
      data: mockSupportStats,
      exportKey: 'support-stats',
      summaryStats: [
        {
          label: 'Total Tickets',
          value: mockSupportStats.reduce((sum, item) => sum + item.count, 0),
        },
        {
          label: 'Resolution Rate',
          value: `${Math.round(((mockSupportStats.find(s => s.status === 'resolved')?.count || 0) / mockSupportStats.reduce((sum, item) => sum + item.count, 0)) * 100)}%`,
        },
        { label: 'Avg Response Time', value: '2.5 hours' },
        { label: 'Satisfaction Rate', value: '94%' },
      ],
      charts: [
        {
          type: 'pie',
          title: 'Ticket Status Distribution',
          data: mockSupportStats,
          dataKey: 'count',
          nameKey: 'status',
        },
      ],
    },

    // Feedback Reports
    [REPORT_TYPES.FEEDBACK_REPORT]: {
      title: 'Feedback Report',
      columns: [
        { key: 'feedback_id', title: 'ID' },
        { key: 'user.full_name', title: 'User' },
        {
          key: 'rating',
          title: 'Rating',
          render: value => (
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2">({value}/5)</span>
            </div>
          ),
        },
        { key: 'category', title: 'Category' },
        {
          key: 'status',
          title: 'Status',
          render: value => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
              {value}
            </span>
          ),
        },
        { key: 'message', title: 'Message' },
        { key: 'createdAt', title: 'Submitted', render: formatDateTime },
      ],
      data: feedback,
      exportKey: 'feedback',
      summaryStats: [
        { label: 'Total Feedback', value: feedback.length },
        {
          label: 'Average Rating',
          value:
            feedback.length > 0
              ? (
                  feedback.reduce((sum, item) => sum + (item.rating || 0), 0) / feedback.length
                ).toFixed(1) + '/5'
              : 'N/A',
        },
        { label: 'Positive Feedback', value: feedback.filter(f => f.rating >= 4).length },
        { label: 'Action Required', value: feedback.filter(f => f.status === 'pending').length },
      ],
    },

    // Contact Reports
    [REPORT_TYPES.CONTACT_REPORT]: {
      title: 'Contact Inquiries Report',
      columns: [
        { key: 'contact_id', title: 'ID' },
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email' },
        {
          key: 'status',
          title: 'Status',
          render: value => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
              {value}
            </span>
          ),
        },
        {
          key: 'priority',
          title: 'Priority',
          render: value => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
              {value}
            </span>
          ),
        },
        { key: 'message', title: 'Message' },
        { key: 'createdAt', title: 'Submitted', render: formatDateTime },
      ],
      data: contacts,
      exportKey: 'contacts',
      summaryStats: [
        { label: 'Total Inquiries', value: contacts.length },
        { label: 'New Inquiries', value: contacts.filter(c => c.status === 'new').length },
        { label: 'Responded', value: contacts.filter(c => c.status === 'responded').length },
        { label: 'High Priority', value: contacts.filter(c => c.priority === 'high').length },
      ],
    },

    // Analytics Reports
    [REPORT_TYPES.DASHBOARD_ANALYTICS]: {
      title: 'Dashboard Analytics Report',
      columns: [
        { key: 'metric', title: 'Metric' },
        { key: 'current', title: 'Current' },
        { key: 'previous', title: 'Previous' },
        {
          key: 'growth',
          title: 'Growth',
          render: value => (
            <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {value >= 0 ? '↑' : '↓'} {Math.abs(value)}%
            </span>
          ),
        },
      ],
      data: [
        { metric: 'Total Users', current: 2000, previous: 1800, growth: 11 },
        { metric: 'Active Courses', current: 45, previous: 42, growth: 7 },
        { metric: 'Monthly Revenue', current: 1950000, previous: 1850000, growth: 5 },
        { metric: 'Support Tickets', current: 80, previous: 95, growth: -16 },
        { metric: 'Course Completion', current: 72, previous: 68, growth: 6 },
      ],
      exportKey: 'dashboard-analytics',
      summaryStats: [
        { label: 'Overall Growth', value: '+4.6%' },
        { label: 'Active Users', value: '1,850' },
        { label: 'Monthly Revenue', value: formatCurrency(1950000) },
        { label: 'Satisfaction Rate', value: '92%' },
      ],
    },
  }

  const currentReport = reportConfigs[activeReport] || {
    title: '',
    columns: [],
    data: [],
    charts: [],
    summaryStats: [],
  }

  const handleExport = () => {
    exportToExcel(currentReport.data, currentReport.title, currentReport.columns)
  }

  const handlePrint = () => {
    printReport(currentReport.title, 'report-content', {
      company: 'Learning Management System',
    })
  }

  const renderChart = (chartConfig, index) => {
    switch (chartConfig.type) {
      case 'bar':
        return (
          <ChartContainer key={index} title={chartConfig.title} className="mb-6">
            <SimpleBarChart
              data={chartConfig.data}
              dataKey={chartConfig.dataKey}
              nameKey={chartConfig.nameKey}
            />
          </ChartContainer>
        )
      case 'pie':
        return (
          <ChartContainer key={index} title={chartConfig.title} className="mb-6">
            <SimplePieChart
              data={chartConfig.data}
              dataKey={chartConfig.dataKey}
              nameKey={chartConfig.nameKey}
            />
          </ChartContainer>
        )
      case 'line':
        return (
          <ChartContainer key={index} title={chartConfig.title} className="mb-6">
            <SimpleLineChart
              data={chartConfig.data}
              dataKey={chartConfig.dataKey}
              nameKey={chartConfig.nameKey}
            />
          </ChartContainer>
        )
      default:
        return null
    }
  }

  const categoryConfigs = {
    [REPORT_CATEGORIES.USERS]: {
      icon: Users,
      label: 'Users',
      reports: [
        { type: REPORT_TYPES.USER_LIST, label: 'User List' },
        { type: REPORT_TYPES.USER_STATS, label: 'User Statistics' },
        { type: REPORT_TYPES.USER_ENROLLMENTS, label: 'User Enrollments' },
      ],
    },
    [REPORT_CATEGORIES.COURSES]: {
      icon: BookOpen,
      label: 'Courses',
      reports: [
        { type: REPORT_TYPES.COURSE_LIST, label: 'Course List' },
        { type: REPORT_TYPES.COURSE_PERFORMANCE, label: 'Course Performance' },
        { type: REPORT_TYPES.COURSE_ENROLLMENTS, label: 'Course Enrollments' },
      ],
    },
    [REPORT_CATEGORIES.FINANCIAL]: {
      icon: DollarSign,
      label: 'Financial',
      reports: [
        { type: REPORT_TYPES.PAYMENT_HISTORY, label: 'Payment History' },
        { type: REPORT_TYPES.REVENUE_REPORT, label: 'Revenue Report' },
        { type: REPORT_TYPES.REVENUE_ANALYTICS, label: 'Revenue Analytics' },
      ],
    },
    [REPORT_CATEGORIES.SUPPORT]: {
      icon: MessageSquare,
      label: 'Support',
      reports: [
        { type: REPORT_TYPES.TICKET_REPORT, label: 'Ticket Report' },
        { type: REPORT_TYPES.SUPPORT_STATS, label: 'Support Statistics' },
        { type: REPORT_TYPES.RESPONSE_TIMES, label: 'Response Times' },
      ],
    },
    [REPORT_CATEGORIES.ANALYTICS]: {
      icon: BarChart3,
      label: 'Analytics',
      reports: [
        { type: REPORT_TYPES.DASHBOARD_ANALYTICS, label: 'Dashboard Analytics' },
        { type: REPORT_TYPES.USER_ANALYTICS, label: 'User Analytics' },
        { type: REPORT_TYPES.REVENUE_ANALYTICS, label: 'Revenue Analytics' },
      ],
    },
    [REPORT_CATEGORIES.FEEDBACK]: {
      icon: Star,
      label: 'Feedback',
      reports: [
        { type: REPORT_TYPES.FEEDBACK_REPORT, label: 'Feedback Report' },
        { type: REPORT_TYPES.RATING_ANALYSIS, label: 'Rating Analysis' },
      ],
    },
    [REPORT_CATEGORIES.CONTACTS]: {
      icon: Mail,
      label: 'Contacts',
      reports: [
        { type: REPORT_TYPES.CONTACT_REPORT, label: 'Contact Report' },
        { type: REPORT_TYPES.INQUIRY_ANALYSIS, label: 'Inquiry Analysis' },
      ],
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comprehensive Reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Generate detailed reports from all system data
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 no-print"
            >
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-90-days">Last 90 Days</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="all-time">All Time</option>
            </select>
            <button
              onClick={() => loadCategoryData(activeCategory)}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 no-print"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center p-3 mb-4 bg-red-50 border border-red-200 rounded-md no-print">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1 no-print">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Categories</h3>
              <div className="space-y-2">
                {Object.entries(categoryConfigs).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveCategory(key)
                      setActiveReport(config.reports[0].type)
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeCategory === key
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <config.icon className="w-4 h-4 mr-2" />
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Report Types */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4 no-print">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h3>
              <div className="space-y-1">
                {categoryConfigs[activeCategory]?.reports.map(report => (
                  <button
                    key={report.type}
                    onClick={() => setActiveReport(report.type)}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors ${
                      activeReport === report.type
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {report.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div id="report-content">
              {/* Charts Section */}
              {currentReport.charts && currentReport.charts.length > 0 && (
                <div className="mb-6">
                  {currentReport.charts.map((chartConfig, index) =>
                    renderChart(chartConfig, index)
                  )}
                </div>
              )}

              {/* Data Table */}
              <DataTable
                {...currentReport}
                onExport={handleExport}
                onPrint={handlePrint}
                summaryStats={currentReport.summaryStats}
              />
            </div>

            {/* Quick Stats */}
            {currentReport.data.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 no-print">
                <StatCard
                  title="Total Records"
                  value={currentReport.data.length}
                  icon={FileText}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Last Updated"
                  value={formatDate(new Date())}
                  icon={Calendar}
                  color="bg-green-500"
                />
                {activeCategory === REPORT_CATEGORIES.FINANCIAL && (
                  <StatCard
                    title="Total Revenue"
                    value={formatCurrency(
                      currentReport.data.reduce(
                        (sum, item) => sum + (item.amount || item.revenue || 0),
                        0
                      )
                    )}
                    icon={DollarSign}
                    color="bg-emerald-500"
                  />
                )}
                <StatCard
                  title="Export Ready"
                  value="Excel/PDF"
                  icon={DownloadCloud}
                  color="bg-purple-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
