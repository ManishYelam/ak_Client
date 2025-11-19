// src/pages/auth/Signup.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Shield,
  Scale,
  AlertCircle,
  Check,
  X
} from 'lucide-react'
import { authAPI } from '../../services/api'

// Enhanced validation schema
const signupSchema = yup.object({
  full_name: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['student', 'instructor'], 'Please select a valid role')
    .required('Role is required'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
})

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  })

  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      agreeToTerms: false
    }
  })

  const watchedPassword = watch('password')
  const watchedConfirmPassword = watch('confirmPassword')
  const watchedEmail = watch('email')

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const feedback = []
    let score = 0

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('At least 8 characters')
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('One uppercase letter')
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('One lowercase letter')
    }

    if (/[0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push('One number')
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push('One special character')
    }

    return { score, feedback }
  }

  // Watch password changes for strength indicator
  useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength(checkPasswordStrength(watchedPassword))
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [watchedPassword])

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      // Remove confirmPassword from submission data
      const { confirmPassword, agreeToTerms, ...submitData } = data
      
      console.log('Signup Data:', submitData)
      
      // Simulate API call - replace with your actual signup service
      await authAPI.register(submitData)
      
      // Show success message and redirect
      navigate('/login', { 
        replace: true,
        state: { 
          message: 'Account created successfully! Please login to continue.',
          type: 'success'
        }
      })
    } catch (error) {
      console.error('Signup error:', error)
      setError('root', { 
        type: 'manual',
        message: 'Signup failed. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const getPasswordStrengthColor = (score) => {
    if (score === 0) return 'bg-gray-200'
    if (score <= 2) return 'bg-red-500'
    if (score <= 3) return 'bg-yellow-500'
    if (score <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (score) => {
    if (score === 0) return 'Very Weak'
    if (score <= 2) return 'Weak'
    if (score <= 3) return 'Good'
    if (score <= 4) return 'Strong'
    return 'Very Strong'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 p-3">
      <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-2xl shadow-md rounded-lg overflow-hidden bg-white">
        
        {/* Left Side - Brand & Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-4 flex-col items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full"></div>
            <div className="absolute bottom-12 right-12 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center text-white">
            <div className="mb-3 flex justify-center">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Scale className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-xl font-bold mb-2 font-display">
              Learn SAP ABAP
            </h1>
            <p className="text-xs mb-3 opacity-90">
              Start Your SAP Journey
            </p>
            
            <div className="w-48 h-32 bg-white bg-opacity-10 rounded-lg flex items-center justify-center backdrop-blur-sm mb-3">
              <User className="w-12 h-12 text-white opacity-80" />
            </div>
            
            <div className="text-left bg-white bg-opacity-10 p-3 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-1 text-sm">Benefits</h3>
              <ul className="space-y-1 text-xs opacity-90">
                <li className="flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Expert-led courses
                </li>
                <li className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  Hands-on projects
                </li>
                <li className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  Career support
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-center">
          {/* Mobile Header */}
          <div className="md:hidden text-center mb-3">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Learn SAP ABAP</h2>
                <p className="text-xs text-gray-500">with Akshay</p>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block text-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Create Account
            </h2>
            <p className="text-gray-600 text-xs mt-1">
              Join our SAP learning community
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Root Error Message */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-xs animate-fade-in">
                <div className="flex items-start">
                  <AlertCircle className="w-3 h-3 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-medium">Signup Failed</p>
                    <p className="text-red-600 mt-0.5">{errors.root.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label htmlFor="full_name" className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  {...register('full_name')}
                  type="text"
                  id="full_name"
                  className={`w-full pl-7 pr-2 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                    errors.full_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
              {errors.full_name && (
                <p className="mt-0.5 text-xs text-red-600 animate-fade-in">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`w-full pl-7 pr-2 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-0.5 text-xs text-red-600 animate-fade-in">{errors.email.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-xs font-medium text-gray-700 mb-1">
                I want to
              </label>
              <div className="relative">
                <Shield className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <select
                  {...register('role')}
                  id="role"
                  className={`w-full pl-7 pr-2 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white ${
                    errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <option value="student">Learn SAP ABAP</option>
                  <option value="instructor">Teach SAP ABAP</option>
                </select>
              </div>
              {errors.role && (
                <p className="mt-0.5 text-xs text-red-600 animate-fade-in">{errors.role.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`w-full pl-7 pr-8 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-0.5 text-xs text-red-600 animate-fade-in">{errors.password.message}</p>
              )}

              {/* Password Strength Indicator */}
              {watchedPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-600' :
                      passwordStrength.score <= 3 ? 'text-yellow-600' :
                      passwordStrength.score <= 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className={`w-full pl-7 pr-8 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-0.5 text-xs text-red-600 animate-fade-in">{errors.confirmPassword.message}</p>
              )}

              {/* Password Match Indicator */}
              {watchedConfirmPassword && (
                <div className={`flex items-center space-x-1 mt-1 text-xs ${
                  watchedPassword === watchedConfirmPassword ? 'text-green-600' : 'text-red-600'
                }`}>
                  {watchedPassword === watchedConfirmPassword ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                  <span>
                    {watchedPassword === watchedConfirmPassword 
                      ? 'Passwords match' 
                      : 'Passwords do not match'
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <input
                {...register('agreeToTerms')}
                type="checkbox"
                id="agreeToTerms"
                className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3 h-3"
                disabled={isLoading}
              />
              <label htmlFor="agreeToTerms" className="text-xs text-gray-600 cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-800 font-medium">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-800 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-xs text-red-600 animate-fade-in">{errors.agreeToTerms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded font-semibold text-xs shadow-sm hover:shadow transform transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-primary-700 hover:to-primary-800 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-800 font-semibold transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Shield className="w-2 h-2 mr-1" />
              Securely encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Signup)