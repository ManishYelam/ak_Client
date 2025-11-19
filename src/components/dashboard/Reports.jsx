// src/pages/dashboard/Reports.jsx
import React, { useState } from 'react'

const Reports = () => {
  const [dateRange, setDateRange] = useState('30days')
  const [activeReport, setActiveReport] = useState('overview')

  const reportData = {
    overview: {
      title: "Platform Overview",
      description: "Key metrics and performance indicators",
      metrics: [
        { label: "Total Revenue", value: "$125,430", change: "+12.5%", trend: "up" },
        { label: "New Students", value: "1,234", change: "+8.2%", trend: "up" },
        { label: "Course Completions", value: "845", change: "+15.3%", trend: "up" },
        { label: "Avg. Rating", value: "4.8/5", change: "+0.2", trend: "up" }
      ],
      charts: [
        { title: "Revenue Trend", type: "line" },
        { title: "Student Growth", type: "bar" },
        { title: "Course Performance", type: "bar" },
        { title: "Geographic Distribution", type: "map" }
      ]
    },
    financial: {
      title: "Financial Reports",
      description: "Revenue, payments, and financial analytics",
      metrics: [
        { label: "Total Revenue", value: "$125,430", change: "+12.5%", trend: "up" },
        { label: "Recurring Revenue", value: "$89,120", change: "+18.7%", trend: "up" },
        { label: "Refunds", value: "$2,340", change: "-5.2%", trend: "down" },
        { label: "Avg. Revenue per Student", value: "$102.50", change: "+3.1%", trend: "up" }
      ]
    },
    students: {
      title: "Student Analytics",
      description: "Student behavior and engagement metrics",
      metrics: [
        { label: "Active Students", value: "3,456", change: "+5.7%", trend: "up" },
        { label: "Completion Rate", value: "68%", change: "+4.2%", trend: "up" },
        { label: "Avg. Study Time", value: "4.2h/week", change: "+0.3h", trend: "up" },
        { label: "Satisfaction Score", value: "92%", change: "+2.1%", trend: "up" }
      ]
    }
  }

  const reports = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'financial', name: 'Financial', icon: '💰' },
    { id: 'students', name: 'Students', icon: '👥' },
    { id: 'courses', name: 'Courses', icon: '📚' },
    { id: 'engagement', name: 'Engagement', icon: '🎯' },
    { id: 'technical', name: 'Technical', icon: '⚙️' }
  ]

  const currentReport = reportData[activeReport]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
            <option value="custom">Custom range</option>
          </select>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">
            Export Report
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {reports.map(report => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeReport === report.id
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{report.icon}</span>
                <span>{report.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Report Header */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{currentReport.title}</h2>
            <p className="text-gray-600 mt-1">{currentReport.description}</p>
            
            <div className="flex items-center space-x-4 mt-4 text-sm">
              <span className="text-gray-600">Date range:</span>
              <span className="font-medium text-gray-900">
                {dateRange === '7days' && 'Last 7 days'}
                {dateRange === '30days' && 'Last 30 days'}
                {dateRange === '90days' && 'Last 90 days'}
                {dateRange === '1year' && 'Last year'}
                {dateRange === 'custom' && 'Custom range'}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-green-600 font-medium">Data updated 2 hours ago</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {currentReport.metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-2">{metric.label}</p>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          {currentReport.charts && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {currentReport.charts.map((chart, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">{chart.title}</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">📈</div>
                      <p>Chart visualization</p>
                      <p className="text-sm">{chart.type} chart</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Detailed Data</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Previous
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map(row => (
                    <tr key={row} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Sample Metric {row}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.floor(Math.random() * 1000) + 500}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.floor(Math.random() * 800) + 400}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +{Math.floor(Math.random() * 30) + 5}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
            <h3 className="font-semibold text-blue-900 mb-3">Key Insights</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Student enrollment has increased by 15% compared to last month
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Course completion rates are highest in the "SAP ABAP Basics" course
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Revenue growth is primarily driven by new course offerings
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports