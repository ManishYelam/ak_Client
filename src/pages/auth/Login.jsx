import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Eye,
  EyeOff,
  LogIn,
  Mail,
  Lock,
  User,
  Shield,
  Scale,
  AlertCircle,
  X,
  Send,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'

// Enhanced validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

// Forgot password schema
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required to reset password'),
})

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    reset: resetLoginForm
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const {
    register: registerForgotPassword,
    handleSubmit: handleSubmitForgotPassword,
    formState: { errors: forgotPasswordErrors },
    setError: setForgotPasswordError,
    setValue: setForgotPasswordValue,
    reset: resetForgotPasswordForm,
    getValues,
    watch: watchForgotPassword
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      setValue('email', rememberedEmail)
      setRememberMe(true)
    }
  }, [setValue])

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      const response = await authAPI.login(data)

      if (response.data) {
        const { user, token } = response.data;
        login(true, user, token);

        // Redirect to hierarchical app structure
        navigate('/dashboard', {
          replace: true,
          state: {
            message: `Welcome back, ${user?.full_name || user?.email}!`
          }
        });
      } else {
        setError('root', {
          type: 'manual',
          message: response.message || 'Login failed. Please check your credentials.'
        })
      }
    } catch (error) {
      console.error('Login error:', error)

      // Handle different error types
      if (error.response) {
        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          'Login failed. Please check your credentials.'
        setError('root', {
          type: 'manual',
          message: errorMessage
        })
      } else if (error.request) {
        setError('root', {
          type: 'manual',
          message: 'Network error. Please check your connection and try again.'
        })
      } else {
        setError('root', {
          type: 'manual',
          message: 'An unexpected error occurred. Please try again.'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitForgotPassword = async (data) => {
    setForgotPasswordLoading(true);
    setForgotPasswordSuccess(false);

    try {
      console.log('Sending forgot password request for:', data.email);
      
      // Call forget password API - FIXED: Ensure proper API call
      const response = await authAPI.forgetPassword(data.email);
      console.log('Forgot password API response:', response);
      
      // Handle successful response
      setForgotPasswordSuccess(true);
      resetForgotPasswordForm();
      
      console.log('Reset link sent successfully');
      
      // Auto close modal after success
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setForgotPasswordSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Forgot password error:', error);
      
      let errorMessage = 'Failed to send reset link. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          `Server error: ${error.response.status}`;
          
        if (error.response.status === 404) {
          errorMessage = 'No account found with this email address.';
        } else if (error.response.status === 429) {
          errorMessage = 'Too many attempts. Please try again later.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setForgotPasswordError('email', {
        type: 'manual',
        message: errorMessage
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
    setForgotPasswordSuccess(false);
    resetForgotPasswordForm();
    
    // Pre-fill with login email if available - FIXED
    const loginEmail = watch('email');
    if (loginEmail) {
      // Use setTimeout to ensure the modal is fully rendered
      setTimeout(() => {
        setForgotPasswordValue('email', loginEmail);
      }, 0);
    }
  }

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPasswordSuccess(false);
    setForgotPasswordLoading(false);
    resetForgotPasswordForm();
  }

  const handleResendResetLink = () => {
    const email = getValues('email');
    if (email) {
      onSubmitForgotPassword({ email });
    }
  }

  const watchedEmail = watch('email')
  const watchedPassword = watch('password')

  return (
    <>
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
                Master SAP Development
              </p>

              <div className="w-48 h-32 bg-white bg-opacity-10 rounded-lg flex items-center justify-center backdrop-blur-sm mb-3">
                <User className="w-12 h-12 text-white opacity-80" />
              </div>

              <div className="text-left bg-white bg-opacity-10 p-3 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-1 text-sm">Features</h3>
                <ul className="space-y-1 text-xs opacity-90">
                  <li className="flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure access
                  </li>
                  <li className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    Progress tracking
                  </li>
                  <li className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    Expert support
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-center">
            {/* Mobile Header */}
            <div className="md:hidden text-center mb-3">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <LogIn className="w-4 h-4 text-white" />
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
                Welcome Back
              </h2>
              <p className="text-gray-600 text-xs mt-1">
                Sign in to continue learning
              </p>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              {/* Root Error Message */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded p-2 text-xs animate-fade-in">
                  <div className="flex items-start">
                    <AlertCircle className="w-3 h-3 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-700 font-medium">Login Failed</p>
                      <p className="text-red-600 mt-0.5">{errors.root.message}</p>
                    </div>
                  </div>
                </div>
              )}

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
                    className={`w-full pl-7 pr-2 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-0.5 text-xs text-red-600 animate-fade-in">{errors.email.message}</p>
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
                    className={`w-full pl-7 pr-8 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    placeholder="Enter your password"
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3 h-3"
                    disabled={isLoading}
                  />
                  <span className="text-xs text-gray-600">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={openForgotPasswordModal}
                  className="text-xs text-primary-600 hover:text-primary-800 transition-colors duration-200 font-medium"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !watchedEmail || !watchedPassword}
                className={`w-full py-2 px-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded font-semibold text-xs shadow-sm hover:shadow transform transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 ${isLoading || !watchedEmail || !watchedPassword
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-primary-700 hover:to-primary-800 hover:-translate-y-0.5"
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-1">
                    <LogIn className="w-3 h-3" />
                    <span>Sign In</span>
                  </div>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-800 font-semibold transition-colors duration-200"
                >
                  Create account
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

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-scale-in">
            {/* Close Button */}
            <button
              onClick={closeForgotPasswordModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={forgotPasswordLoading}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reset Your Password
              </h3>
              <p className="text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Success Message */}
            {forgotPasswordSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-fade-in">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">
                      Reset link sent successfully!
                    </p>
                    <p className="text-xs text-green-600 mb-2">
                      Check your email for the password reset link. The link will expire in 1 hour.
                    </p>
                    <button
                      onClick={handleResendResetLink}
                      className="text-xs text-green-700 hover:text-green-800 font-medium underline"
                    >
                      Resend link
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Forgot Password Form */}
            {!forgotPasswordSuccess && (
              <form onSubmit={handleSubmitForgotPassword(onSubmitForgotPassword)} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      {...registerForgotPassword('email')}
                      type="email"
                      id="forgot-email"
                      className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        forgotPasswordErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your registered email"
                      disabled={forgotPasswordLoading}
                    />
                  </div>
                  {forgotPasswordErrors.email && (
                    <div className="mt-1 flex items-start space-x-1 animate-fade-in">
                      <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-600">
                        {forgotPasswordErrors.email.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={closeForgotPasswordModal}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                    disabled={forgotPasswordLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className={`flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                      forgotPasswordLoading
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:bg-primary-700 hover:-translate-y-0.5'
                    }`}
                  >
                    {forgotPasswordLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Help Text */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Remember your password?{' '}
                <button
                  onClick={closeForgotPasswordModal}
                  className="text-primary-600 hover:text-primary-800 font-medium"
                  disabled={forgotPasswordLoading}
                >
                  Back to login
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default React.memo(Login)