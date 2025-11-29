// src/components/HelpSupport/TicketModal.jsx
import React, { useState, useEffect, useContext } from 'react'
import { X } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { getUserData } from '../../utils/getUserId'
import { supportAPI } from '../../services/api'

const TicketModal = ({ show, ticket, onClose, onSaved }) => {
  const { user } = useContext(AuthContext)
  const userData = getUserData(user)
  const isAdmin = userData?.role === 'admin'
  const isEditing = !!ticket
  console.log(ticket, '/////////////////////////////////////////////////////////////////////////')

  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: '',
    course_id: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (ticket) {
      // For editing - include status only for admin
      const baseData = {
        subject: ticket.subject || '',
        category: ticket.category || 'general',
        priority: ticket.priority || 'medium',
        description: ticket.description || ticket.message || '',
        course_id: ticket.course_id || '',
      }

      // Only include status if user is admin
      if (isAdmin) {
        baseData.status = ticket.status || 'open'
      }

      setFormData(baseData)
    } else {
      // For creating - never include status
      setFormData({
        subject: '',
        category: 'general',
        priority: 'medium',
        description: '',
        course_id: '',
      })
    }
    setErrors({})
  }, [ticket, show, isAdmin])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    // Category validation - match backend options
    const validCategories = ['general', 'technical', 'billing', 'feature', 'bug', 'course_related']
    if (!formData.category || !validCategories.includes(formData.category)) {
      newErrors.category = 'Please select a valid category'
    }

    // Priority validation
    const validPriorities = ['low', 'medium', 'high', 'urgent']
    if (!formData.priority || !validPriorities.includes(formData.priority)) {
      newErrors.priority = 'Please select a valid priority'
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    // Course ID validation - must be integer if provided
    if (formData.course_id && !/^\d+$/.test(formData.course_id)) {
      newErrors.course_id = 'Course ID must be a number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  console.log(formData, '...................')

  const prepareApiData = () => {
    const apiData = {
      subject: formData.subject.trim(),
      category: formData.category,
      priority: formData.priority,
      description: formData.description.trim(),
    }

    // Only include course_id if provided
    if (formData.course_id) {
      apiData.course_id = parseInt(formData.course_id)
    }

    // For admin users when editing, include status and assigned_to
    if (isAdmin && isEditing) {
      if (formData.status) {
        apiData.status = formData.status
      }
      if (formData.assigned_to) {
        apiData.assigned_to = formData.assigned_to
      }
    }

    return apiData
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const apiData = prepareApiData()
      console.log(apiData, '//////////////////////////////////')

      if (isEditing) {
        await supportAPI.updateTicket(ticket.support_ticket_id, apiData)
      } else {
        await supportAPI.createTicket(apiData)
      }
      onSaved()
      onClose()
    } catch (error) {
      console.error('Error saving ticket:', error)
      const errorMessage =
        error.response?.data?.message || 'Failed to save ticket. Please try again.'
      setErrors({ submit: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            {isEditing ? 'Edit Ticket' : 'Create New Ticket'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-3 space-y-3 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          {errors.submit && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-2 py-1.5 border rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.subject ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief description of your issue"
              />
              {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-2 py-1.5 border rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing & Payments</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="course_related">Course Related</option>
              </select>
              {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-2 py-1.5 border rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.priority ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              {errors.priority && <p className="text-red-600 text-xs mt-1">{errors.priority}</p>}
            </div>

            {/* Course ID - Available for both create and edit */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Course ID</label>
              <input
                type="text"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className={`w-full px-2 py-1.5 border rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.course_id ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Optional course reference number"
              />
              {errors.course_id && <p className="text-red-600 text-xs mt-1">{errors.course_id}</p>}
            </div>
          </div>

          {/* Admin Only Fields - Only shown when editing existing ticket */}
          {isAdmin && isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status || 'open'}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Assigned To</label>
                <input
                  type="text"
                  name="assigned_to"
                  value={formData.assigned_to || ''}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Assign to support agent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-2 py-1.5 border rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Please provide detailed information about your issue..."
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Display current ticket info for admin when editing */}
          {isAdmin && isEditing && ticket && (
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <h4 className="text-xs font-medium text-gray-700 mb-1">Ticket Information</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  Ticket ID: <span className="font-medium">{ticket.id || ticket.ticket_id}</span>
                </div>
                <div>
                  Created:{' '}
                  <span className="font-medium">
                    {new Date(ticket.created_at || ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {ticket.user_id && (
                  <div>
                    User ID: <span className="font-medium">{ticket.user_id}</span>
                  </div>
                )}
                {ticket.updated_at && (
                  <div>
                    Last Updated:{' '}
                    <span className="font-medium">
                      {new Date(ticket.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 border border-transparent rounded hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </div>
            ) : isEditing ? (
              'Update Ticket'
            ) : (
              'Create Ticket'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TicketModal
