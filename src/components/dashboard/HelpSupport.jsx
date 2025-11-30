// src/components/HelpSupport.jsx
import React, { useState, useEffect, useContext } from 'react'
import {
  Mail,
  MessageCircle,
  FileText,
  HelpCircle,
  CheckCircle,
  XCircle,
  UserCheck,
  X,
  Edit,
  Trash2,
  Plus,
  Search,
  BarChart,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
} from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { getUserData } from '../../utils/getUserId'
import { supportAPI } from '../../services/api'
import FAQModal from './FAQModal'
import TicketModal from './TicketModal'

// Toast Component
const Toast = ({ toast, onClose }) => {
  if (!toast) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-md shadow-lg border transform transition-all duration-300 ${
        toast.type === 'success'
          ? 'bg-green-50 text-green-800 border-green-200'
          : toast.type === 'error'
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-blue-50 text-blue-800 border-blue-200'
      }`}
    >
      {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
      {toast.type === 'error' && <XCircle className="w-4 h-4 text-red-600" />}
      {toast.type === 'info' && <HelpCircle className="w-4 h-4 text-blue-600" />}
      <span className="text-xs font-medium">{toast.message}</span>
      <button onClick={onClose} className="ml-1 text-gray-400 hover:text-gray-600">
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

// Filter Section Component
const FilterSection = ({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  isAdmin,
  showMyTicketsOnly,
  onMyTicketsToggle,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ]

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'course', label: 'Course Content' },
    { value: 'account', label: 'Account Issues' },
    { value: 'general', label: 'General Inquiry' },
  ]

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ]

  const FilterPill = ({ label, value, onRemove }) => (
    <span className="inline-flex items-center px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded border border-blue-200">
      {label}: {value}
      <button onClick={onRemove} className="ml-0.5 text-blue-600 hover:text-blue-800">
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  )

  return (
    <div className="bg-gray-50 rounded-md p-3 mb-4 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={e => onFilterChange('search', e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={e => onFilterChange('status', e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={e => onFilterChange('category', e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={e => onFilterChange('priority', e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-blue-800">Active Filters:</span>
            {filters.search && (
              <FilterPill
                label="Search"
                value={`"${filters.search}"`}
                onRemove={() => onFilterChange('search', '')}
              />
            )}
            {filters.status !== 'all' && (
              <FilterPill
                label="Status"
                value={statusOptions.find(s => s.value === filters.status)?.label}
                onRemove={() => onFilterChange('status', 'all')}
              />
            )}
            {filters.category !== 'all' && (
              <FilterPill
                label="Category"
                value={categoryOptions.find(c => c.value === filters.category)?.label}
                onRemove={() => onFilterChange('category', 'all')}
              />
            )}
            {filters.priority !== 'all' && (
              <FilterPill
                label="Priority"
                value={priorityOptions.find(p => p.value === filters.priority)?.label}
                onRemove={() => onFilterChange('priority', 'all')}
              />
            )}
            {isAdmin && showMyTicketsOnly && (
              <FilterPill
                label="Filter"
                value="My Tickets Only"
                onRemove={() => onMyTicketsToggle(false)}
              />
            )}
          </div>
          <button
            onClick={onClearFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}

// Overview Stats Component
const OverviewStats = ({ stats, loading, isAdmin }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const StatCard = ({ title, value, icon: Icon, color, description }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600',
      purple: 'bg-purple-50 text-purple-600',
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 ${colorClasses[color]} rounded-full flex items-center justify-center`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={stats.totalTickets}
          icon={BarChart}
          color="blue"
          description={isAdmin ? 'All support tickets' : 'Your support tickets'}
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          icon={AlertCircle}
          color="red"
          description="Requiring attention"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressTickets}
          icon={Clock}
          color="yellow"
          description="Being worked on"
        />
        <StatCard
          title="Resolved"
          value={stats.resolvedTickets}
          icon={CheckCircle2}
          color="green"
          description="Successfully closed"
        />
      </div>

      {/* Quick Actions & Support Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Create New Ticket</p>
                  <p className="text-gray-600 text-xs">Submit a new support request</p>
                </div>
                <Plus className="w-4 h-4 text-primary-600" />
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Browse FAQs</p>
                  <p className="text-gray-600 text-xs">Find quick answers to common questions</p>
                </div>
                <HelpCircle className="w-4 h-4 text-primary-600" />
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Live Chat</p>
                  <p className="text-gray-600 text-xs">Get immediate help from our team</p>
                </div>
                <MessageCircle className="w-4 h-4 text-primary-600" />
              </div>
            </button>
          </div>
        </div>

        {/* Support Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Support Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-green-900 text-sm">Support Team Online</p>
                  <p className="text-green-700 text-xs">Typically responds in 2-4 hours</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Response Time</span>
                <span className="font-medium text-gray-900">2 hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Resolution Rate</span>
                <span className="font-medium text-gray-900">94%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Customer Satisfaction</span>
                <span className="font-medium text-gray-900">4.8/5</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <strong>Office Hours:</strong> Mon-Fri, 9:00 AM - 6:00 PM EST
              </p>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Emergency Support:</strong> Available 24/7 for critical issues
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {stats.recentTickets && stats.recentTickets.length > 0 ? (
            stats.recentTickets.slice(0, 3).map((ticket, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      ticket.status === 'open'
                        ? 'bg-red-500'
                        : ticket.status === 'in-progress'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{ticket.subject}</p>
                    <p className="text-gray-600 text-xs">
                      {ticket.category} • {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'open'
                      ? 'bg-red-100 text-red-800'
                      : ticket.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  )
}

// Ticket Table Component - Shows all details without sorting
const TicketTable = ({ tickets, isAdmin, onEditTicket, loading, pagination, onPageChange }) => {
  const ticketStatusColors = {
    open: 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-gray-100 text-gray-800',
    closed: 'bg-gray-300 text-gray-600',
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
    urgent: 'bg-red-600 text-white',
  }

  const getStatusDisplay = status => {
    const statusMap = {
      open: 'Open',
      'in-progress': 'In Progress',
      pending: 'Pending',
      resolved: 'Resolved',
      closed: 'Closed',
    }
    return statusMap[status] || status
  }

  const getPriorityDisplay = priority => {
    const priorityMap = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
    }
    return priorityMap[priority] || priority
  }

  // Safe value getter to handle objects and null values
  const getSafeValue = (value, defaultValue = '') => {
    if (value === null || value === undefined) return defaultValue
    if (typeof value === 'object') {
      return JSON.stringify(value) || defaultValue
    }
    return String(value)
  }

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 text-xs mt-1.5">Loading tickets...</p>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1.5">No support tickets found</h3>
        <p className="text-gray-500 text-sm">Create your first support ticket to get help</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject & Description
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {isAdmin && (
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
              )}
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              {isAdmin && (
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map(ticket => {
              const ticketId = getSafeValue(ticket.support_ticket_id || ticket.id)

              return (
                <tr key={ticketId} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    <div className="font-medium">{getSafeValue(ticket.ticket_number)}</div>
                    <div className="text-gray-500 text-xs mt-0.5">ID: {ticketId}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="max-w-md">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {getSafeValue(ticket.subject)}
                      </div>
                      <div className="text-sm text-gray-600 whitespace-pre-wrap">
                        {getSafeValue(ticket.description, 'No description provided')}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {getSafeValue(ticket.category)}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority] || priorityColors.medium}`}
                    >
                      {getPriorityDisplay(ticket.priority)}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ticketStatusColors[ticket.status] || ticketStatusColors.open}`}
                    >
                      {getStatusDisplay(ticket.status)}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-3 py-2">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {getSafeValue(ticket.user?.full_name, 'N/A')}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {getSafeValue(ticket.user?.email, 'N/A')}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          User ID: {getSafeValue(ticket.user_id, 'N/A')}
                        </div>
                        {ticket.user?.phone_number && (
                          <div className="text-gray-500 text-xs">
                            Phone: {getSafeValue(ticket.user.phone_number)}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    <div>
                      <div>
                        Created:{' '}
                        {ticket.created_at
                          ? new Date(ticket.created_at).toLocaleDateString()
                          : 'N/A'}
                      </div>
                      {ticket.updated_at && (
                        <div className="mt-0.5">
                          Updated: {new Date(ticket.updated_at).toLocaleDateString()}
                        </div>
                      )}
                      {ticket.resolved_at && (
                        <div className="mt-0.5">
                          Resolved: {new Date(ticket.resolved_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditTicket(ticket)}
                          className="text-gray-600 hover:text-primary-600 transition-colors"
                          title="Edit Ticket"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {ticket.assigned_to && (
                          <div className="text-xs text-gray-500" title="Assigned To">
                            {getSafeValue(ticket.assigned_to)}
                          </div>
                        )}
                        {ticket.assigned_agent && (
                          <div className="text-xs text-gray-500" title="Assigned Agent">
                            {getSafeValue(ticket.assigned_agent)}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex items-center space-x-1 text-xs text-gray-600 mb-3 sm:mb-0">
            <span>Showing</span>
            <span className="font-medium">
              {(pagination.currentPage - 1) * pagination.limit + 1}
            </span>
            <span>to</span>
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)}
            </span>
            <span>of</span>
            <span className="font-medium">{pagination.totalItems}</span>
            <span>results</span>
          </div>
          <div className="flex items-center space-x-0.5">
            <button
              onClick={() => onPageChange(1)}
              disabled={pagination.currentPage === 1}
              className="p-1.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronsLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-1.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum
              if (pagination.totalPages <= 5) {
                pageNum = i + 1
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i
              } else {
                pageNum = pagination.currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 text-xs rounded border transition-colors ${
                    pagination.currentPage === pageNum
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-1.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-1.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronsRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// FAQ Table Component - Uses same table format as TicketTable
const FAQTable = ({ faqs, onEditFAQ, onToggleStatus, onDeleteFAQ, loading }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  }

  const categoryColors = {
    technical: 'bg-blue-100 text-blue-800',
    billing: 'bg-purple-100 text-purple-800',
    course: 'bg-yellow-100 text-yellow-800',
    account: 'bg-red-100 text-red-800',
    general: 'bg-gray-100 text-gray-800',
  }

  // Safe value getter to handle objects and null values
  const getSafeValue = (value, defaultValue = '') => {
    if (value === null || value === undefined) return defaultValue
    if (typeof value === 'object') {
      return JSON.stringify(value) || defaultValue
    }
    return String(value)
  }

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 text-xs mt-1.5">Loading FAQs...</p>
      </div>
    )
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1.5">No FAQs created yet</h3>
        <p className="text-gray-500 text-sm">Create your first FAQ to help users</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              FAQ ID
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Question & Answer
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {faqs.map(faq => {
            const faqId = getSafeValue(faq.faq_id || faq.id)

            return (
              <tr key={faqId} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-xs">
                  <div className="font-medium">FAQ-{faqId}</div>
                  <div className="text-gray-500 text-xs mt-0.5">ID: {faqId}</div>
                </td>
                <td className="px-3 py-2">
                  <div className="max-w-md">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {getSafeValue(faq.question)}
                    </div>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap">
                      {getSafeValue(faq.answer, 'No answer provided')}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[faq.category] || categoryColors.general}`}
                  >
                    {getSafeValue(faq.category, 'general').charAt(0).toUpperCase() +
                      getSafeValue(faq.category, 'general').slice(1)}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[faq.is_active ? 'active' : 'inactive']}`}
                  >
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {getSafeValue(faq.author?.full_name, 'Unknown')}
                    </div>
                    <div className="text-gray-500 text-xs">
                      User ID: {getSafeValue(faq.created_by, 'N/A')}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  <div>
                    <div>
                      Created:{' '}
                      {faq.created_at ? new Date(faq.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                    {faq.updated_at && (
                      <div className="mt-0.5">
                        Updated: {new Date(faq.updated_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStatus(faq.faq_id || faq.id, faq.is_active)}
                      className={`transition-colors ${
                        faq.is_active
                          ? 'text-yellow-600 hover:text-yellow-800'
                          : 'text-green-600 hover:text-green-800'
                      }`}
                      title={faq.is_active ? 'Deactivate FAQ' : 'Activate FAQ'}
                    >
                      {faq.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onEditFAQ(faq)}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                      title="Edit FAQ"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteFAQ(faq.faq_id || faq.id)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// Main HelpSupport Component
const HelpSupport = () => {
  const { user } = useContext(AuthContext)
  const userData = getUserData(user)

  // State
  const [activeTab, setActiveTab] = useState('overview')
  const [userTickets, setUserTickets] = useState([])
  const [faqs, setFaqs] = useState([])
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [loadingFaqs, setLoadingFaqs] = useState(false)
  const [loadingOverview, setLoadingOverview] = useState(false)
  const [showMyTicketsOnly, setShowMyTicketsOnly] = useState(false)
  const [toast, setToast] = useState(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [editingTicket, setEditingTicket] = useState(null)
  const [editingFAQ, setEditingFAQ] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    priority: 'all',
    page: 1,
    limit: 10,
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  })

  // Constants
  const user_id = userData?.user_id
  const isAdmin = userData?.role === 'admin'

  // Calculate overview stats
  const overviewStats = {
    totalTickets: userTickets.length,
    openTickets: userTickets.filter(ticket => ticket.status === 'open').length,
    inProgressTickets: userTickets.filter(ticket => ticket.status === 'in-progress').length,
    resolvedTickets: userTickets.filter(
      ticket => ticket.status === 'resolved' || ticket.status === 'closed'
    ).length,
    recentTickets: userTickets.slice(0, 5),
  }

  // Effects
  useEffect(() => {
    if (activeTab === 'my-tickets' || activeTab === 'overview') {
      fetchUserTickets()
    }
  }, [activeTab, filters, showMyTicketsOnly])

  useEffect(() => {
    if (activeTab === 'faq' || (isAdmin && activeTab === 'faq-management')) {
      fetchFAQs()
    }
  }, [activeTab])

  // API Functions
  const buildPayload = () => {
    const payload = {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      searchFields: ['subject', 'message', 'category'],
      filters: {},
      sortBy: 'created_at',
      sortOrder: 'DESC',
    }

    if (filters.status !== 'all') payload.filters.status = filters.status
    if (filters.category !== 'all') payload.filters.category = filters.category
    if (filters.priority !== 'all') payload.filters.priority = filters.priority

    // Only add user_id filter for admin users when "My Tickets Only" is enabled
    // Non-admin users will automatically get their own tickets via getUserTickets endpoint
    if (isAdmin && showMyTicketsOnly && user_id) {
      payload.filters.user_id = parseInt(user_id)
    }

    return payload
  }

  const fetchUserTickets = async () => {
    try {
      if (activeTab === 'my-tickets') {
        setLoadingTickets(true)
      } else if (activeTab === 'overview') {
        setLoadingOverview(true)
      }

      const payload = buildPayload()

      // Use different API based on user role
      let response
      if (isAdmin) {
        // Admin uses the general tickets endpoint
        response = await supportAPI.getTickets(payload)
      } else {
        // Non-admin users use the user-specific endpoint
        response = await supportAPI.getUserTickets(payload)
      }

      if (response.data?.success) {
        const ticketsData = response.data.data
        if (ticketsData && typeof ticketsData === 'object') {
          // Handle paginated response
          if (ticketsData.tickets && Array.isArray(ticketsData.tickets)) {
            setUserTickets(ticketsData.tickets)
            setPagination({
              currentPage: ticketsData.currentPage || filters.page,
              totalPages: ticketsData.totalPages || 1,
              totalItems: ticketsData.totalItems || ticketsData.tickets.length,
              limit: filters.limit,
            })
          } else if (Array.isArray(ticketsData)) {
            // Handle non-paginated response (fallback)
            setUserTickets(ticketsData)
            setPagination({
              currentPage: 1,
              totalPages: 1,
              totalItems: ticketsData.length,
              limit: filters.limit,
            })
          } else {
            // Handle other response formats
            setUserTickets([])
            setPagination({
              currentPage: 1,
              totalPages: 1,
              totalItems: 0,
              limit: filters.limit,
            })
          }
        } else {
          setUserTickets([])
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            limit: filters.limit,
          })
        }
      } else {
        setUserTickets([])
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          limit: filters.limit,
        })
        showToast('Failed to load tickets', 'error')
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setUserTickets([])
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: filters.limit,
      })
      showToast('Error loading tickets', 'error')
    } finally {
      setLoadingTickets(false)
      setLoadingOverview(false)
    }
  }

  const fetchFAQs = async () => {
    try {
      setLoadingFaqs(true)
      const response = await supportAPI.getFAQs()

      // console.log(response, "............................");

      if (response.data?.success) {
        // The FAQ data is nested under response.data.data.faqs
        const faqsData = response.data.data?.faqs ?? []
        setFaqs(faqsData)
      } else {
        setFaqs([])
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      setFaqs([])
    } finally {
      setLoadingFaqs(false)
    }
  }

  // Handlers
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 4000)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = newPage => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleMyTicketsToggle = checked => {
    setShowMyTicketsOnly(checked)
    setFilters(prev => ({ ...prev, page: 1 }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      priority: 'all',
      page: 1,
      limit: 10,
    })
    if (isAdmin) setShowMyTicketsOnly(false)
    showToast('All filters cleared', 'info')
  }

  // Modal Handlers
  const openTicketModal = (ticket = null) => {
    setEditingTicket(ticket)
    setShowTicketModal(true)
  }

  const openFAQModal = (faq = null) => {
    setEditingFAQ(faq)
    setShowFAQModal(true)
  }

  const closeTicketModal = () => {
    setShowTicketModal(false)
    setEditingTicket(null)
  }

  const closeFAQModal = () => {
    setShowFAQModal(false)
    setEditingFAQ(null)
  }

  const handleTicketSaved = () => {
    fetchUserTickets()
    showToast(
      editingTicket ? 'Ticket updated successfully!' : 'Ticket created successfully!',
      'success'
    )
  }

  const handleFAQSaved = () => {
    fetchFAQs()
    showToast(editingFAQ ? 'FAQ updated successfully!' : 'FAQ created successfully!', 'success')
  }

  // Update FAQ status (is_active)
  const handleToggleFAQStatus = async (faqId, currentStatus) => {
    try {
      const newStatus = !currentStatus
      await supportAPI.updateFAQ(faqId, { is_active: newStatus })
      fetchFAQs()
      showToast(`FAQ ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success')
    } catch (error) {
      console.error('Error updating FAQ status:', error)
      showToast('Failed to update FAQ status', 'error')
    }
  }

  const handleDeleteFAQ = async faqId => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await supportAPI.deleteFAQ(faqId)
        fetchFAQs()
        showToast('FAQ deleted successfully!', 'success')
      } catch (error) {
        console.error('Error deleting FAQ:', error)
        showToast('Failed to delete FAQ', 'error')
      }
    }
  }

  // Utility Functions
  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    (isAdmin && showMyTicketsOnly)

  // Tabs configuration - Updated to include Overview tab
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    ...(isAdmin ? [{ id: 'faq-management', label: 'FAQ Management', icon: FileText }] : []),
    { id: 'my-tickets', label: isAdmin ? 'All Tickets' : 'My Tickets', icon: MessageCircle },
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Tabs - Header integrated into tabs container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Integrated Header in the tabs section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Help & Support</h1>
              <p className="text-gray-600 text-sm mt-0.5">
                {isAdmin
                  ? 'Manage support tickets and FAQs'
                  : 'Get help with any issues or questions you have'}
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs mt-3 lg:mt-0">
              <div className="flex items-center space-x-1.5 text-green-600">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Support Team Online</span>
              </div>
              <div className="text-gray-500">Typical response: 2-4 hours</div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(tab => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900">Support Overview</h2>
                <p className="text-gray-600 text-sm mt-0.5">
                  Quick overview of your support tickets and available help options
                </p>
              </div>

              <OverviewStats stats={overviewStats} loading={loadingOverview} isAdmin={isAdmin} />
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="mb-3">
                <h2 className="text-base font-semibold text-gray-900">
                  Frequently Asked Questions
                </h2>
              </div>

              {loadingFaqs ? (
                <div className="text-center py-6">
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 text-xs mt-1.5">Loading FAQs...</p>
                </div>
              ) : faqs.length > 0 ? (
                <div className="space-y-3">
                  {faqs
                    .filter(faq => faq.is_active !== false)
                    .map(faq => (
                      <div
                        key={faq.faq_id || faq.id}
                        className="border border-gray-200 rounded p-3 hover:border-primary-200 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                        {faq.category && faq.category !== 'general' && (
                          <div className="text-xs text-gray-500 mt-2">
                            Category: <span className="capitalize">{faq.category}</span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HelpCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1.5">No FAQs available</h3>
                  <p className="text-gray-500 text-sm mb-3">
                    Check back later for frequently asked questions
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FAQ Management Tab */}
          {activeTab === 'faq-management' && isAdmin && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h2 className="text-base font-semibold text-gray-900">FAQ Management</h2>
                <button
                  onClick={() => openFAQModal()}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3" /> New FAQ
                </button>
              </div>

              <FAQTable
                faqs={faqs}
                onEditFAQ={openFAQModal}
                onToggleStatus={handleToggleFAQStatus}
                onDeleteFAQ={handleDeleteFAQ}
                loading={loadingFaqs}
              />
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'my-tickets' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h2 className="text-base font-semibold text-gray-900">
                  {isAdmin ? 'All Support Tickets' : 'My Support Tickets'}
                </h2>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded border border-gray-300">
                      <input
                        type="checkbox"
                        id="my-tickets-only"
                        checked={showMyTicketsOnly}
                        onChange={e => handleMyTicketsToggle(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-1 focus:ring-primary-500 w-3.5 h-3.5"
                      />
                      <label
                        htmlFor="my-tickets-only"
                        className="text-xs font-medium text-gray-700 flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> My Tickets Only
                      </label>
                    </div>
                  )}

                  <button
                    onClick={() => openTicketModal()}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3" /> New Ticket
                  </button>
                </div>
              </div>

              {/* Filters */}
              <FilterSection
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
                isAdmin={isAdmin}
                showMyTicketsOnly={showMyTicketsOnly}
                onMyTicketsToggle={handleMyTicketsToggle}
              />

              <TicketTable
                tickets={userTickets}
                isAdmin={isAdmin}
                onEditTicket={openTicketModal}
                loading={loadingTickets}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Quick Help Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: MessageCircle,
            title: 'Live Chat',
            desc: 'Chat with our support team in real-time',
            color: 'blue',
          },
          {
            icon: Mail,
            title: 'Email Support',
            desc: 'Send us an email at support@learnsapabap.com',
            color: 'green',
            link: 'mailto:support@learnsapabap.com',
          },
          {
            icon: FileText,
            title: 'Documentation',
            desc: 'Browse our comprehensive documentation',
            color: 'purple',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
          >
            <div
              className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-2`}
            >
              <item.icon className={`w-5 h-5 text-${item.color}-600`} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{item.title}</h3>
            <p className="text-gray-600 text-xs mb-2">{item.desc}</p>
            {item.link ? (
              <a
                href={item.link}
                className="text-primary-600 hover:text-primary-700 text-xs font-medium flex items-center justify-center gap-1 mx-auto"
              >
                Send Email <span>→</span>
              </a>
            ) : (
              <button className="text-primary-600 hover:text-primary-700 text-xs font-medium flex items-center justify-center gap-1 mx-auto">
                Start Chat <span>→</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      <TicketModal
        show={showTicketModal}
        ticket={editingTicket}
        onClose={closeTicketModal}
        onSaved={handleTicketSaved}
      />
      <FAQModal
        show={showFAQModal}
        faq={editingFAQ}
        onClose={closeFAQModal}
        onSaved={handleFAQSaved}
      />
    </div>
  )
}

export default HelpSupport
