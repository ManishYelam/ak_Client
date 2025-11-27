// src/pages/Contact.jsx
import React, { useCallback, useMemo, useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { contactAPI } from '../services/api'
import WhatsAppFloatingIcon from '../components/ui/WhatsAppFloatingIcon'

// Memoized contact info items with proper error boundary
const ContactInfoItem = React.memo(({ icon: Icon, title, value, description, href }) => (
  <div className="flex items-start space-x-2">
    <div className="flex-shrink-0">
      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary-600" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-gray-900 text-xs mb-0.5">{title}</h3>
      <p className="text-gray-600 text-xs mb-0.5">{value}</p>
      <p className="text-[10px] text-gray-500">{description}</p>
    </div>
  </div>
))

ContactInfoItem.displayName = 'ContactInfoItem'

// Quick links with proper accessibility
const QuickLinks = React.memo(() => {
  const links = [
    'Course syllabus and curriculum',
    'Batch schedules and timings',
    'Payment options and EMI',
    'Placement assistance details',
  ]

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Links</h3>
      <div className="space-y-1">
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => console.log('Navigate to:', link)}
            className="block w-full text-left text-xs text-gray-600 hover:text-primary-600 py-0.5 px-1.5 rounded transition-colors duration-200 hover:bg-gray-50"
          >
            • {link}
          </button>
        ))}
      </div>
    </div>
  )
})

QuickLinks.displayName = 'QuickLinks'

// Enhanced form field with validation
const FormField = React.memo(
  ({
    label,
    id,
    name,
    value,
    onChange,
    type = 'text',
    required = false,
    placeholder,
    error,
    children,
  }) => (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      {children || (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        />
      )}
      {error && <p className="mt-0.5 text-xs text-red-600">{error}</p>}
    </div>
  )
)

FormField.displayName = 'FormField'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Enhanced validation
  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // Optimized handler with debouncing potential
  const handleChange = useCallback(
    e => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: '',
        }))
      }
      // Clear submit error when user makes changes
      if (submitError) {
        setSubmitError('')
      }
    },
    [errors, submitError]
  )

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()

      if (!validateForm()) {
        // Scroll to first error
        const firstErrorField = Object.keys(errors)[0]
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField)
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
            element.focus()
          }
        }
        return
      }

      setIsSubmitting(true)
      setSubmitError('')

      try {
        // Prepare data for API
        const submitData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null, // Send null if empty
          subject: formData.subject,
          message: formData.message.trim(),
          timestamp: new Date().toISOString(),
          source: 'website_contact_form',
        }

        // Call the API service
        const response = await contactAPI.submitContact(submitData)

        // Show success state
        setIsSubmitted(true)

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
        setErrors({})
      } catch (error) {
        console.error('Contact form submission error:', error)

        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const status = error.response.status
          const data = error.response.data

          if (status === 400) {
            // Validation errors from server
            if (data.errors) {
              setErrors(data.errors)
            } else {
              setSubmitError(data.message || 'Please check your form data and try again.')
            }
          } else if (status === 429) {
            setSubmitError('Too many requests. Please try again in a few minutes.')
          } else if (status >= 500) {
            setSubmitError('Server error. Please try again later or contact us directly.')
          } else {
            setSubmitError(data.message || 'Failed to send message. Please try again.')
          }
        } else if (error.request) {
          // Network error
          setSubmitError('Network error. Please check your connection and try again.')
        } else {
          // Other errors
          setSubmitError('An unexpected error occurred. Please try again.')
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, validateForm, errors]
  )

  // Memoized contact information
  const contactInfo = useMemo(
    () => [
      {
        icon: Mail,
        title: 'Email',
        value: 'akshay@learnsapabap.com',
        description: 'Send us an email anytime',
        href: 'mailto:akshay@learnsapabap.com',
      },
      {
        icon: Phone,
        title: 'Phone',
        value: '+91 9876543210',
        description: 'Mon to Fri 9am to 6pm',
        href: 'tel:+919876543210',
      },
      {
        icon: MapPin,
        title: 'Location',
        value: 'Pune, India',
        description: 'Online training available worldwide',
      },
      {
        icon: Clock,
        title: 'Office Hours',
        value: 'Mon - Fri: 9:00 - 18:00',
        description: 'Weekend batches available',
      },
    ],
    []
  )

  // Success state component
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-sm w-full text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600 text-xs mb-4">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-200"
            >
              Send Another Message
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with proper contrast */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-2xl lg:text-3xl font-bold font-display mb-3">Get In Touch</h1>
            <p className="text-sm text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Have questions about our courses? We're here to help you start your SAP ABAP journey.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with proper spacing */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block hover:bg-gray-50 rounded-lg p-1.5 -m-1.5 transition-colors duration-200 no-underline"
                    >
                      <ContactInfoItem {...item} />
                    </a>
                  ) : (
                    <div className="p-1.5 -m-1.5">
                      <ContactInfoItem {...item} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <QuickLinks />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Send us a Message</h2>

              {/* Submit Error Alert */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-700 text-xs font-medium">Submission Failed</p>
                      <p className="text-red-600 text-xs mt-0.5">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    label="Full Name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    error={errors.name}
                  />
                  <FormField
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    error={errors.email}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    label="Phone Number"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    error={errors.phone}
                  />
                  <FormField
                    label="Subject"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    error={errors.subject}
                  >
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a subject</option>
                      <option value="course-info">Course Information</option>
                      <option value="admission">Admission Process</option>
                      <option value="payment">Payment & Fees</option>
                      <option value="placement">Placement Assistance</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>
                </div>

                <FormField
                  label="Message"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  error={errors.message}
                >
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-vertical ${
                      errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about your requirements..."
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center transition-all duration-200 focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 mr-1.5" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Privacy Notice */}
                <p className="text-[10px] text-gray-500 text-center">
                  By submitting this form, you agree to our{' '}
                  <a
                    href="/privacy-policy"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Privacy Policy
                  </a>
                  . We respect your privacy and will never share your information with third
                  parties.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* WhatsApp Floating Icon - Directly included in Home page */}
      <WhatsAppFloatingIcon />
    </div>
  )
}

export default React.memo(Contact)
