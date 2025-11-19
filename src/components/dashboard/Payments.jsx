// src/pages/dashboard/Payments.jsx
import React, { useState } from 'react'

const Payments = () => {
  const [activeTab, setActiveTab] = useState('all')

  const payments = [
    {
      id: 'INV-001',
      course: {
        id: 1,
        title: "SAP ABAP Basics",
        instructor: "Akshay Kumar"
      },
      amount: 99,
      status: "completed",
      date: "2024-02-15",
      method: "credit_card",
      currency: "USD",
      invoiceUrl: "/invoices/inv-001.pdf",
      receiptUrl: "/receipts/rec-001.pdf"
    },
    {
      id: 'INV-002',
      course: {
        id: 2,
        title: "Advanced ABAP Programming",
        instructor: "Akshay Kumar"
      },
      amount: 149,
      status: "completed",
      date: "2024-02-14",
      method: "paypal",
      currency: "USD",
      invoiceUrl: "/invoices/inv-002.pdf",
      receiptUrl: "/receipts/rec-002.pdf"
    },
    {
      id: 'INV-003',
      course: {
        id: 3,
        title: "SAP Fiori Development",
        instructor: "Akshay Kumar"
      },
      amount: 199,
      status: "pending",
      date: "2024-02-14",
      method: "credit_card",
      currency: "USD",
      invoiceUrl: "/invoices/inv-003.pdf",
      receiptUrl: null
    },
    {
      id: 'INV-004',
      course: {
        id: 4,
        title: "ABAP Object-Oriented Programming",
        instructor: "Akshay Kumar"
      },
      amount: 129,
      status: "failed",
      date: "2024-02-13",
      method: "credit_card",
      currency: "USD",
      invoiceUrl: "/invoices/inv-004.pdf",
      receiptUrl: null
    },
    {
      id: 'INV-005',
      course: {
        id: 1,
        title: "SAP ABAP Basics",
        instructor: "Akshay Kumar"
      },
      amount: 99,
      status: "refunded",
      date: "2024-02-12",
      method: "credit_card",
      currency: "USD",
      invoiceUrl: "/invoices/inv-005.pdf",
      receiptUrl: "/receipts/rec-005.pdf"
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
      case 'credit_card': return '💳 Credit Card'
      case 'paypal': return '📊 PayPal'
      case 'bank_transfer': return '🏦 Bank Transfer'
      default: return '💰 ' + method
    }
  }

  const stats = [
    { 
      label: "Total Spent", 
      value: "$576", 
      description: "Lifetime total",
      trend: "+$129 this month"
    },
    { 
      label: "Successful Payments", 
      value: "3", 
      description: "Completed transactions",
      trend: "2 courses enrolled"
    },
    { 
      label: "Pending Payments", 
      value: "1", 
      description: "Awaiting confirmation",
      trend: "Needs attention"
    },
    { 
      label: "Saved Cards", 
      value: "2", 
      description: "Payment methods",
      trend: "1 default card"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600">View your payment transactions and invoices</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Download Statements
          </button>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">
            Add Payment Method
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.description}</p>
            <p className="text-xs text-blue-600 mt-2">{stat.trend}</p>
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
                      <div className="font-medium text-gray-900">{payment.course.title}</div>
                      <div className="text-sm text-gray-500">by {payment.course.instructor}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getMethodIcon(payment.method)}
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
                    <div className="flex space-x-2">
                      {payment.invoiceUrl && (
                        <button className="text-primary-600 hover:text-primary-900">
                          Invoice
                        </button>
                      )}
                      {payment.receiptUrl && (
                        <button className="text-green-600 hover:text-green-900">
                          Receipt
                        </button>
                      )}
                      {payment.status === 'pending' && (
                        <button className="text-blue-600 hover:text-blue-900">
                          Retry
                        </button>
                      )}
                      {payment.status === 'failed' && (
                        <button className="text-red-600 hover:text-red-900">
                          Contact Support
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'all' 
                ? 'You haven\'t made any payments yet' 
                : 'No payments match your current filter'
              }
            </p>
            {activeTab !== 'all' && (
              <button 
                onClick={() => setActiveTab('all')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                View All Payments
              </button>
            )}
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
        <div className="space-y-4">
          {/* Saved Cards */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-sm text-gray-600">Expires 12/2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Default</span>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">MC</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Mastercard ending in 8888</p>
                <p className="text-sm text-gray-600">Expires 08/2026</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Add New Card */}
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New Payment Method</span>
            </div>
          </button>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>john.doe@example.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Billing Address</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>John Doe</p>
              <p>123 Main Street</p>
              <p>New York, NY 10001</p>
              <p>United States</p>
            </div>
          </div>
        </div>
        <button className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
          Update Billing Information
        </button>
      </div>

      {/* Support */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Need Help with Payments?</h3>
        <p className="text-blue-800 mb-4">
          If you're experiencing issues with payments or have questions about billing, 
          our support team is here to help.
        </p>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Contact Support
          </button>
          <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 font-medium">
            View FAQ
          </button>
        </div>
      </div>
    </div>
  )
}

export default Payments