// src/pages/dashboard/components/StudentModal.jsx
import React, { useState, useEffect } from 'react'
import {
  X,
  Save,
  Send,
  FileArchive,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  CreditCard,
  Shield,
  Sparkles,
} from 'lucide-react'
import { userAPI } from '../../services/api'

const StudentModal = ({ show, student, onClose, onSaved }) => {
  const [saveLoading, setSaveLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    age: '',
    gender: 'male',
    occupation: '',
    address: '',
    adhar_number: '',
    status: 'active',
    role: 'student',
    isVerified: false,
    reg_type: 'manual',
  })

  const genders = [
    { value: 'male', label: 'Male', icon: User },
    { value: 'female', label: 'Female', icon: User },
  ]

  const statuses = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  ]

  const regTypes = [
    { value: 'manual', label: 'Manual' },
    { value: 'google', label: 'Google' },
    { value: 'facebook', label: 'Facebook' },
  ]

  useEffect(() => {
    if (student) {
      setFormData({
        full_name: student.full_name || '',
        email: student.email || '',
        phone_number: student.phone_number || '',
        date_of_birth: student.date_of_birth || '',
        age: student.age || '',
        gender: student.gender || 'male',
        occupation: student.occupation || '',
        address: student.address || '',
        adhar_number: student.adhar_number || '',
        status: student.status || 'active',
        role: student.role || 'student',
        isVerified: student.isVerified || false,
        reg_type: student.reg_type || 'manual',
      })
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        age: '',
        gender: 'male',
        occupation: '',
        address: '',
        adhar_number: '',
        status: 'active',
        role: 'student',
        isVerified: false,
        reg_type: 'manual',
      })
    }
  }, [student])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Calculate age from date of birth
  const calculateAge = dateString => {
    if (!dateString) return ''
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age.toString()
  }

  const handleDateOfBirthChange = dateString => {
    handleInputChange('date_of_birth', dateString)
    if (dateString) {
      handleInputChange('age', calculateAge(dateString))
    }
  }

  const handleSaveStudent = async action => {
    try {
      setSaveLoading(true)

      const studentData = {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth || null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        occupation: formData.occupation || null,
        address: formData.address || null,
        adhar_number: formData.adhar_number || null,
        status: formData.status,
        role: 'student', // Always set as student
        isVerified: formData.isVerified,
        reg_type: formData.reg_type,
      }

      let response
      if (student) {
        const studentId = student.user_id || student.id
        response = await userAPI.updateUser(studentId, studentData)
      } else {
        // For new students, use the getAllUsers endpoint with create action
        response = await userAPI.getAllUsers({
          ...studentData,
          action: 'create',
        })
      }

      if (response.data?.success) {
        onSaved()
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save student')
    } finally {
      setSaveLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-md max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-lg text-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div>
            <h2 className="text-base font-semibold">
              {student ? 'Edit Student' : 'Create New Student'}
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              {student ? `Editing: ${student.full_name}` : 'Add student details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            disabled={saveLoading}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-3 space-y-3">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Full Name *</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={e => handleInputChange('full_name', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="student@example.com"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Phone Number</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={e => handleInputChange('phone_number', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Aadhar Number</label>
              <input
                type="text"
                value={formData.adhar_number}
                onChange={e => handleInputChange('adhar_number', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="1234 5678 9012"
                maxLength="12"
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Date of Birth</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={e => handleDateOfBirthChange(e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => handleInputChange('age', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="25"
                min="1"
                max="120"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Gender</label>
              <div className="space-y-1">
                {genders.map(gender => (
                  <button
                    key={gender.value}
                    type="button"
                    onClick={() => handleInputChange('gender', gender.value)}
                    className={`w-full flex items-center gap-1 px-2 py-1 border rounded text-xs ${
                      formData.gender === gender.value ? 'bg-primary-50 border-primary-500' : ''
                    }`}
                  >
                    <User className="w-3 h-3" />
                    {gender.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Occupation & Address */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={e => handleInputChange('occupation', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="e.g., Software Engineer, Student"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="Full address"
              />
            </div>
          </div>

          {/* Status & Settings */}
          <div className="grid grid-cols-3 gap-3">
            {/* Status */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
              <div className="space-y-1">
                {statuses.map(status => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => handleInputChange('status', status.value)}
                    className={`w-full flex items-center gap-1 px-2 py-1 border rounded text-xs ${status.color} ${
                      formData.status === status.value ? 'border-primary-500' : ''
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Registration Type */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Registration Type
              </label>
              <select
                value={formData.reg_type}
                onChange={e => handleInputChange('reg_type', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                {regTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Verification */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Account Status</label>
              <button
                onClick={() => handleInputChange('isVerified', !formData.isVerified)}
                className={`w-full flex items-center gap-1 px-2 py-1 border rounded text-xs ${
                  formData.isVerified
                    ? 'bg-green-50 border-green-500 text-green-800'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <Shield className="w-3 h-3" />
                {formData.isVerified ? 'Verified' : 'Unverified'}
              </button>
            </div>
          </div>

          {/* Additional Notes (if needed in future) */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Additional Notes</label>
            <textarea
              rows="2"
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Any additional information about the student..."
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between p-3 border-t bg-gray-50">
          <p className="text-xs text-gray-500">
            {student
              ? `Last updated: ${student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : 'Unknown'}`
              : 'New student registration'}
          </p>

          <div className="flex gap-1">
            <button
              onClick={onClose}
              className="px-2 py-1 text-xs border rounded bg-white hover:bg-gray-50 transition-colors"
              disabled={saveLoading}
            >
              Cancel
            </button>

            <button
              onClick={() => handleSaveStudent('inactive')}
              className="p-1 text-xs border rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
              disabled={saveLoading}
              title="Deactivate"
            >
              <FileArchive className="w-3 h-3" />
            </button>

            <button
              onClick={() => handleSaveStudent('active')}
              className="p-1 text-xs border rounded bg-gray-200 hover:bg-gray-300 transition-colors"
              disabled={saveLoading}
              title="Save as Draft"
            >
              <Save className="w-3 h-3" />
            </button>

            <button
              onClick={() => handleSaveStudent('active')}
              className="p-1 text-xs border rounded bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              disabled={saveLoading}
              title="Save & Activate"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Make sure this is a default export
export default StudentModal
