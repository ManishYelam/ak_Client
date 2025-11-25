// src/pages/dashboard/Analytics.jsx
import React, { useState } from 'react'

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30days')
  const [activeMetric, setActiveMetric] = useState('engagement')

  const metrics = {
    engagement: {
      title: 'User Engagement',
      description: 'How users interact with your platform',
      data: [
        { label: 'Daily Active Users', value: '1,234', change: '+12.5%', trend: 'up' },
        { label: 'Avg. Session Duration', value: '24m 18s', change: '+2.3m', trend: 'up' },
        { label: 'Pages per Session', value: '8.2', change: '+0.7', trend: 'up' },
        { label: 'Bounce Rate', value: '32%', change: '-4.2%', trend: 'down' },
      ],
    },
    acquisition: {
      title: 'User Acquisition',
      description: 'How new users discover your platform',
      data: [
        { label: 'New Users', value: '2,345', change: '+18.7%', trend: 'up' },
        { label: 'Returning Users', value: '1,892', change: '+8.3%', trend: 'up' },
        { label: 'Acquisition Cost', value: '$4.52', change: '-$0.38', trend: 'down' },
        { label: 'Conversion Rate', value: '3.8%', change: '+0.6%', trend: 'up' },
      ],
    },
    retention: {
      title: 'User Retention',
      description: 'How well you retain users over time',
      data: [
        { label: 'Day 1 Retention', value: '68%', change: '+5.2%', trend: 'up' },
        { label: 'Day 7 Retention', value: '42%', change: '+3.8%', trend: 'up' },
        { label: 'Day 30 Retention', value: '28%', change: '+2.1%', trend: 'up' },
        { label: 'Churn Rate', value: '4.2%', change: '-0.8%', trend: 'down' },
      ],
    },
  }

  const chartData = {
    userGrowth: [1200, 1300, 1250, 1400, 1600, 1800, 2000, 2200, 2100, 2300, 2400, 2500],
    engagement: [65, 68, 72, 70, 75, 78, 80, 82, 85, 83, 87, 90],
    revenue: [8500, 9200, 8800, 9500, 11000, 12500, 13200, 14000, 13800, 14500, 15200, 16000],
  }

  const currentMetric = metrics[activeMetric]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Deep insights into platform performance and user behavior</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">
            Export Data
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(metrics).map(([key, metric]) => (
          <button
            key={key}
            onClick={() => setActiveMetric(key)}
            className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
              activeMetric === key
                ? 'border-primary-500 bg-primary-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <h3 className="font-semibold text-gray-900 mb-2">{metric.title}</h3>
            <p className="text-sm text-gray-600">{metric.description}</p>
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentMetric.data.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-2">{item.label}</p>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <span
                className={`text-sm font-medium ${
                  item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.change}
              </span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  item.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: '75%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64">
            <div className="flex items-end justify-between h-48 space-x-1">
              {chartData.userGrowth.map((value, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-primary-500 to-primary-600 rounded-t-lg transition-all duration-500 hover:from-primary-600 hover:to-primary-700"
                    style={{ height: `${(value / 3000) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              <span>Jan</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Engagement Rate</h3>
          <div className="h-64">
            <div className="flex items-end justify-between h-48 space-x-1">
              {chartData.engagement.map((value, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all duration-500 hover:from-green-600 hover:to-green-700"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              <span>Jan</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {[
              { source: 'Direct', percentage: 45, color: 'bg-blue-500' },
              { source: 'Organic Search', percentage: 30, color: 'bg-green-500' },
              { source: 'Social Media', percentage: 15, color: 'bg-purple-500' },
              { source: 'Referral', percentage: 8, color: 'bg-orange-500' },
              { source: 'Email', percentage: 2, color: 'bg-red-500' },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.source}</span>
                  <span className="text-gray-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color} transition-all duration-1000`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Device Distribution</h3>
          <div className="space-y-4">
            {[
              { device: 'Desktop', percentage: 58, color: 'bg-indigo-500' },
              { device: 'Mobile', percentage: 35, color: 'bg-pink-500' },
              { device: 'Tablet', percentage: 7, color: 'bg-yellow-500' },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.device}</span>
                  <span className="text-gray-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color} transition-all duration-1000`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Top Countries</h3>
          <div className="space-y-3">
            {[
              { country: 'United States', users: 1245, percentage: 32 },
              { country: 'India', users: 987, percentage: 25 },
              { country: 'United Kingdom', users: 654, percentage: 17 },
              { country: 'Germany', users: 432, percentage: 11 },
              { country: 'Others', users: 682, percentage: 15 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.country}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{item.users}</span>
                  <span className="text-xs text-gray-500">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { metric: 'Page Load Time', value: '1.2s', target: '<2s', status: 'good' },
            { metric: 'API Response Time', value: '180ms', target: '<200ms', status: 'good' },
            { metric: 'Uptime', value: '99.9%', target: '>99.5%', status: 'good' },
            { metric: 'Error Rate', value: '0.2%', target: '<0.5%', status: 'good' },
          ].map((item, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-1">{item.metric}</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{item.value}</p>
              <p
                className={`text-xs ${item.status === 'good' ? 'text-green-600' : 'text-red-600'}`}
              >
                Target: {item.target}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics
