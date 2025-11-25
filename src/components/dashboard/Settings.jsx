// src/pages/dashboard/Settings.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, Lock, Shield, CheckCircle, XCircle, X } from 'lucide-react'
import { authAPI } from '../../services/api'

// Password change validation schema
const changePasswordSchema = yup.object({
  old_password: yup.string().required('Current password is required'),
  new_password: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirm_password: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('new_password')], 'Passwords must match'),
})

// Modal Component
const ChangePasswordModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  errors,
  register,
  watch,
  showOldPassword,
  setShowOldPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  success,
  error,
}) => {
  const newPasswordValue = watch('new_password')
  const confirmPasswordValue = watch('confirm_password')

  // Password strength indicator
  const getPasswordStrength = password => {
    if (!password) return { strength: 0, text: '', color: '' }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++

    const strengthMap = {
      1: { text: 'Very Weak', color: 'bg-red-500' },
      2: { text: 'Weak', color: 'bg-orange-500' },
      3: { text: 'Fair', color: 'bg-yellow-500' },
      4: { text: 'Good', color: 'bg-blue-500' },
      5: { text: 'Strong', color: 'bg-green-500' },
    }

    return { strength, ...strengthMap[strength] }
  }

  const passwordStrength = getPasswordStrength(newPasswordValue)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Shield className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-fade-in">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-700 font-medium mb-1">
                      Password Changed Successfully!
                    </p>
                    <p className="text-green-600 text-sm">
                      Your password has been updated successfully.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-fade-in">
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-medium mb-1">Password Change Failed</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    {...register('old_password')}
                    type={showOldPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.old_password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter current password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.old_password && (
                  <p className="mt-1 text-xs text-red-600 animate-fade-in">
                    {errors.old_password.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    {...register('new_password')}
                    type={showNewPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.new_password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPasswordValue && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Password strength:</span>
                      <span className="text-xs font-medium text-gray-700">
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          passwordStrength.color
                        }`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {errors.new_password && (
                  <p className="mt-1 text-xs text-red-600 animate-fade-in">
                    {errors.new_password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    {...register('confirm_password')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirm_password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="mt-1 text-xs text-red-600 animate-fade-in">
                    {errors.confirm_password.message}
                  </p>
                )}

                {/* Password Match Indicator */}
                {confirmPasswordValue && newPasswordValue === confirmPasswordValue && (
                  <p className="mt-1 text-xs text-green-600 animate-fade-in">✓ Passwords match</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-semibold shadow-sm hover:shadow transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    isSubmitting
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-primary-700 hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Changing Password...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Update Password</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('security')

  // Modal states
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)
  const [passwordChangeError, setPasswordChangeError] = useState('')

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    reset: resetPasswordForm,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  })

  const handleChangePassword = async data => {
    setIsChangingPassword(true)
    setPasswordChangeError('')
    setPasswordChangeSuccess(false)

    try {
      console.log('Changing password with data:', {
        old_password: data.old_password,
        new_password: data.new_password,
      })

      const response = await authAPI.changePassword({
        old_password: data.old_password,
        new_password: data.new_password,
      })

      console.log('Change password response:', response)

      if (response.status === 200 || response.status === 201 || response.data) {
        setPasswordChangeSuccess(true)
        resetPasswordForm()

        // Auto-close modal after success
        setTimeout(() => {
          setIsChangePasswordModalOpen(false)
          setPasswordChangeSuccess(false)
        }, 2000)
      } else {
        throw new Error('Failed to change password')
      }
    } catch (error) {
      console.error('Change password error:', error)

      let errorMessage = 'Failed to change password. Please try again.'

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          `Server error: ${error.response.status}`

        if (error.response.status === 400) {
          errorMessage =
            error.response.data?.message ||
            'Invalid current password or new password does not meet requirements.'
        } else if (error.response.status === 401) {
          errorMessage = 'Current password is incorrect.'
        } else if (error.response.status === 429) {
          errorMessage = 'Too many attempts. Please try again later.'
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.'
      }

      setPasswordChangeError(errorMessage)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const openChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true)
    setPasswordChangeSuccess(false)
    setPasswordChangeError('')
    resetPasswordForm()
  }

  const closeChangePasswordModal = () => {
    if (!isChangingPassword) {
      setIsChangePasswordModalOpen(false)
      setPasswordChangeSuccess(false)
      setPasswordChangeError('')
      resetPasswordForm()
    }
  }

  const tabs = [{ id: 'security', name: 'Security', icon: '🔒' }]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-40">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'security' && (
            <div className="space-y-4">
              {/* Security Settings */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Security Settings</h2>

                {/* Change Password Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Password</h3>
                      <p className="text-xs text-gray-600 mt-0.5">Last changed 2 weeks ago</p>
                    </div>
                    <button
                      onClick={openChangePasswordModal}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Active Sessions</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Current Session</p>
                      <p className="text-xs text-gray-600 mt-0.5">Chrome • Windows • Just now</p>
                    </div>
                    <span className="text-green-600 text-xs font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Mobile Device</p>
                      <p className="text-xs text-gray-600 mt-0.5">Safari • iOS • 2 hours ago</p>
                    </div>
                    <button className="text-red-600 text-xs font-medium hover:text-red-700">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={closeChangePasswordModal}
        onSubmit={handleSubmitPassword(handleChangePassword)}
        isSubmitting={isChangingPassword}
        errors={passwordErrors}
        register={registerPassword}
        watch={watchPassword}
        showOldPassword={showOldPassword}
        setShowOldPassword={setShowOldPassword}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        success={passwordChangeSuccess}
        error={passwordChangeError}
      />
    </div>
  )
}

export default Settings
