// src/pages/dashboard/PaymentManagement.jsx
import React, { useState } from 'react'

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [dateRange, setDateRange] = useState('30days')

  const payments = [
    {
      id: 'INV-001',
      student: {
        name: "Rahul Sharma",
        email: "rahul@example.com"
      },
      course: "SAP ABAP Basics",
      amount: 99,
      status: "completed",
      date: "2024-02-15",
      method: "credit_card",
      currency: "USD"
    },
    {
      id: 'INV-002',
      student: {
        name: "Priya Patel",
        email: "priya@example.com"
      },
      course: "Advanced ABAP Programming",
      amount: 149,
      status: "completed",
      date: "2024-02-14",
      method: "paypal",
      currency: "USD"
    },
    {
      id: 'INV-003',
      student: {
        name: "Amit Kumar",
        email: "amit@example.com"
      },
      course: "SAP Fiori Development",
      amount: 199,
      status: "pending",
      date: "2024-02-14",
      method: "credit_card",
      currency: "USD"
    },
    {
      id: 'INV-004',
      student: {
        name: "Sneha Gupta",
        email: "sneha@example.com"
      },
      course: "ABAP Object-Oriented Programming",
      amount: 129,
      status: "failed",
      date: "2024-02-13",
      method: "credit_card",
      currency: "USD"
    },
    {
      id: 'INV-005',
      student: {
        name: "Rajesh Singh",
        email: "rajesh@example.com"
      },
      course: "SAP ABAP Basics",
      amount: 99,
      status: "refunded",
      date: "2024-02-12",
      method: "credit_card",
      currency: "USD"
    }
  ]

  const tabs = [
    { id: 'all', name: 'All Payments', count: payments.length },
    { id: 'completed', name: 'Completed', count: payments.filter(p => p.status === 'completed').length },
    { id: 'pending', name: 'Pending', count: payments.filter(p => p.status === 'pending').length },
    { id: 'failed', name: 'Failed', count: payments.filter(p => p.status === 'failed').length },
    { id: 'refunded', name: 'Refunded', count: payments.filter(p => p.status === 'refunded').length }
  ]

  const filteredPayments = payments.filter(payment => 
    activeTab === 'all' || payment.status === activeTab
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return '💳'
      case 'paypal': return '📊'
      case 'bank_transfer': return '🏦'
      default: return '💰'
    }
  }

  const stats = [
    { label: "Total Revenue", value: "$12,543", change: "+18.2%", trend: "up" },
    { label: "Successful Payments", value: "142", change: "+12.5%", trend: "up" },
    { label: "Avg. Transaction", value: "$88.50", change: "+3.2%", trend: "up" },
    { label: "Refund Rate", value: "2.4%", change: "-0.8%", trend: "down" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Manage and monitor all payment transactions</p>
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
          </select>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">
            Export Payments
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{payment.student.name}</div>
                      <div className="text-sm text-gray-500">{payment.student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span>{getMethodIcon(payment.method)}</span>
                      <span>
                        {payment.method === 'credit_card' && 'Credit Card'}
                        {payment.method === 'paypal' && 'PayPal'}
                        {payment.method === 'bank_transfer' && 'Bank Transfer'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      View
                    </button>
                    {payment.status === 'pending' && (
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Approve
                      </button>
                    )}
                    {payment.status === 'completed' && (
                      <button className="text-orange-600 hover:text-orange-900">
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">142</span> payments
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-primary-600 text-white rounded-lg">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">💰</div>
              <p>Revenue chart visualization</p>
              <p className="text-sm">Monthly revenue trends</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {[
              { method: 'Credit Card', percentage: 65, color: 'bg-blue-500' },
              { method: 'PayPal', percentage: 25, color: 'bg-blue-400' },
              { method: 'Bank Transfer', percentage: 8, color: 'bg-blue-300' },
              { method: 'Other', percentage: 2, color: 'bg-gray-300' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.method}</span>
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
      </div>
    </div>
  )
}

export default PaymentManagement