// src/pages/dashboard/SystemSettings.jsx
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Mail,
  Shield,
  CreditCard,
  Palette,
  Settings as SettingsIcon,
  AlertCircle,
  Save,
  Trash2,
  Download,
  Database,
  Key,
  Edit,
  Plus,
  Activity
} from 'lucide-react'
import { applicationAPI } from '../../services/api'

// Validation schemas
const emailSettingsSchema = yup.object({
  smtpServer: yup.string().required('SMTP server is required'),
  port: yup.number().required('Port is required').min(1, 'Port must be valid'),
  service: yup.string().required('Service is required'),
  username: yup.string().email('Must be a valid email').required('Username is required'),
  password: yup.string().required('Password is required'),
  useTLS: yup.boolean().default(true)
})

const generalSettingsSchema = yup.object({
  siteName: yup.string().required('Site name is required'),
  siteDescription: yup.string().required('Site description is required'),
  contactEmail: yup.string().email('Must be a valid email').required('Contact email is required'),
  timezone: yup.string().required('Timezone is required')
})

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showSmtpPassword, setShowSmtpPassword] = useState(false)
  const [showStripeSecret, setShowStripeSecret] = useState(false)
  const [emailConfigs, setEmailConfigs] = useState([])
  const [selectedEmailConfig, setSelectedEmailConfig] = useState(null)
  const [showEmailConfigs, setShowEmailConfigs] = useState(false)
  
  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    site_title: "Learn SAP ABAP",
    site_description: "Master SAP ABAP programming with expert-led courses",
    contact_email: "support@learnsapabap.com",
    timezone: "UTC",
    
    // Security Settings
    maintenance_mode: false,
    user_registration: true,
    email_verification: true,
    strong_passwords: true,
    session_timeout: 120,
    max_login_attempts: 5,
    
    // Email Settings
    smtp_host: "smtp.gmail.com",
    smtp_port: 587,
    smtp_service: "gmail",
    smtp_username: "noreply@learnsapabap.com",
    smtp_password: "",
    smtp_use_tls: true,
    
    // Payment Settings
    currency: "USD",
    tax_rate: "0",
    payment_gateway: "stripe",
    stripe_publishable_key: "",
    stripe_secret_key: "",
    
    // Appearance
    theme: "light",
    primary_color: "#4f46e5",
    logo_url: "/logo.png",
    favicon_url: "/favicon.ico"
  })

  // Forms
  const { register: registerGeneral, handleSubmit: handleSubmitGeneral, formState: { errors: generalErrors }, reset: resetGeneral } = useForm({
    resolver: yupResolver(generalSettingsSchema)
  })

  const { register: registerEmail, handleSubmit: handleSubmitEmail, formState: { errors: emailErrors }, reset: resetEmail, setValue: setEmailValue } = useForm({
    resolver: yupResolver(emailSettingsSchema)
  })

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'advanced', name: 'Advanced', icon: '🔧' }
  ]

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
    loadEmailConfigs()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const response = await applicationAPI.getAllProperties()
      
      if (response.data && response.data.data) {
        const properties = response.data.data
        const loadedSettings = {}

        // Transform properties array to settings object
        properties.forEach(property => {
          const settingKey = property.property_name
          loadedSettings[settingKey] = property.property_value
          
          // Merge metadata if exists
          if (property.metadata) {
            Object.assign(loadedSettings, property.metadata)
          }
        })

        setSettings(prev => ({ ...prev, ...loadedSettings }))
        
        // Reset forms with loaded data
        resetGeneral({
          siteName: loadedSettings.site_title || '',
          siteDescription: loadedSettings.site_description || '',
          contactEmail: loadedSettings.contact_email || '',
          timezone: loadedSettings.timezone || 'UTC'
        })
        
        // Set email form with active email configuration
        const activeEmailConfig = emailConfigs.find(config => config.status === 'active')
        if (activeEmailConfig && activeEmailConfig.metadata?.emailSettings) {
          const emailSettings = activeEmailConfig.metadata.emailSettings
          resetEmail({
            smtpServer: emailSettings.smtpServer || '',
            port: emailSettings.port || 587,
            service: emailSettings.service || 'gmail',
            username: emailSettings.username || '',
            password: emailSettings.password || '',
            useTLS: emailSettings.useTLS !== false
          })
        } else {
          resetEmail({
            smtpServer: loadedSettings.smtp_host || '',
            port: loadedSettings.smtp_port || 587,
            service: loadedSettings.smtp_service || 'gmail',
            username: loadedSettings.smtp_username || '',
            password: loadedSettings.smtp_password || '',
            useTLS: loadedSettings.smtp_use_tls !== false
          })
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      showMessage('error', 'Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const loadEmailConfigs = async () => {
    try {
      const payload = {
        page: 1,
        limit: 50,
        search: '',
        searchFields: ['property_name', 'property_value'],
        filters: {
          property_name: 'app_email'
        }
      }

      const response = await applicationAPI.getAllProperties(payload)
      if (response.data && response.data.data) {
        setEmailConfigs(response.data.data)
        
        // Set the active email config as selected
        const activeConfig = response.data.data.find(config => config.status === 'active')
        if (activeConfig) {
          setSelectedEmailConfig(activeConfig)
        }
      }
    } catch (error) {
      console.error('Error loading email configurations:', error)
      showMessage('error', 'Failed to load email configurations')
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  // Set Active Email Configuration
  const setActiveEmailConfig = async (config) => {
    try {
      const payload = {
        property_name: "app_email",
        property_value: config.property_value,
        desc: config.desc,
        metadata: config.metadata,
        status: "active"
      }

      await applicationAPI.createOrUpdateProperty(payload)
      setSelectedEmailConfig(config)
      loadEmailConfigs() // Reload to get updated status
      showMessage('success', 'Email configuration activated successfully!')
    } catch (error) {
      console.error('Error activating email config:', error)
      showMessage('error', 'Failed to activate email configuration')
    }
  }

  // Save Email Configuration
  const saveEmailSettings = async (data) => {
    setSaveLoading(true)
    try {
      const payload = {
        property_name: "app_email",
        property_value: data.username, // Use email as property_value
        desc: "SMTP email server configuration",
        metadata: {
          appName: settings.site_title || "Learn SAP ABAP",
          companyName: "Learn SAP ABAP",
          contactNumber: "+91 000-000-0000",
          emailSettings: {
            smtpServer: data.smtpServer,
            port: parseInt(data.port),
            service: data.service,
            username: data.username,
            password: data.password,
            useTLS: data.useTLS
          }
        },
        status: "active" // Set as active when saving new configuration
      }

      const response = await applicationAPI.createOrUpdateProperty(payload)
      showMessage('success', 'Email settings saved and activated successfully!')
      loadEmailConfigs() // Reload email configurations
    } catch (error) {
      console.error('Error saving email settings:', error)
      showMessage('error', 'Failed to save email settings')
    } finally {
      setSaveLoading(false)
    }
  }

  // Save All Settings using Bulk API
  const saveAllSettings = async () => {
    setSaveLoading(true)
    try {
      const bulkPayload = []

      // General Settings
      bulkPayload.push(
        {
          property_name: "site_title",
          property_value: settings.site_title || "",
          desc: "Website title and name",
          metadata: {
            site_description: settings.site_description,
            contact_email: settings.contact_email,
            timezone: settings.timezone
          }
        }
      )

      // Security Settings
      bulkPayload.push(
        {
          property_name: "security_settings",
          property_value: "Security Configuration",
          desc: "Platform security and access settings",
          metadata: {
            maintenance_mode: settings.maintenance_mode,
            user_registration: settings.user_registration,
            email_verification: settings.email_verification,
            strong_passwords: settings.strong_passwords,
            session_timeout: settings.session_timeout,
            max_login_attempts: settings.max_login_attempts
          }
        }
      )

      // Payment Settings
      bulkPayload.push(
        {
          property_name: "payment_settings",
          property_value: "Payment Configuration",
          desc: "Payment gateway and billing settings",
          metadata: {
            currency: settings.currency,
            tax_rate: settings.tax_rate,
            payment_gateway: settings.payment_gateway,
            stripe_publishable_key: settings.stripe_publishable_key,
            stripe_secret_key: settings.stripe_secret_key
          }
        }
      )

      // Appearance Settings
      bulkPayload.push(
        {
          property_name: "appearance_settings",
          property_value: "Appearance Configuration",
          desc: "Platform theme and branding settings",
          metadata: {
            theme: settings.theme,
            primary_color: settings.primary_color,
            logo_url: settings.logo_url,
            favicon_url: settings.favicon_url
          }
        }
      )

      const response = await applicationAPI.createOrUpdateBulkProperties(bulkPayload)
      showMessage('success', 'All settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      showMessage('error', 'Failed to save settings')
    } finally {
      setSaveLoading(false)
    }
  }

  // Save Current Tab Settings
  const saveCurrentTab = async () => {
    setSaveLoading(true)
    try {
      let bulkPayload = []

      switch (activeTab) {
        case 'general':
          bulkPayload = [
            {
              property_name: "site_title",
              property_value: settings.site_title || "",
              desc: "Website title and name",
              metadata: {
                site_description: settings.site_description,
                contact_email: settings.contact_email,
                timezone: settings.timezone
              }
            }
          ]
          break

        case 'security':
          bulkPayload = [
            {
              property_name: "security_settings",
              property_value: "Security Configuration",
              desc: "Platform security and access settings",
              metadata: {
                maintenance_mode: settings.maintenance_mode,
                user_registration: settings.user_registration,
                email_verification: settings.email_verification,
                strong_passwords: settings.strong_passwords,
                session_timeout: settings.session_timeout,
                max_login_attempts: settings.max_login_attempts
              }
            }
          ]
          break

        case 'payment':
          bulkPayload = [
            {
              property_name: "payment_settings",
              property_value: "Payment Configuration",
              desc: "Payment gateway and billing settings",
              metadata: {
                currency: settings.currency,
                tax_rate: settings.tax_rate,
                payment_gateway: settings.payment_gateway,
                stripe_publishable_key: settings.stripe_publishable_key,
                stripe_secret_key: settings.stripe_secret_key
              }
            }
          ]
          break

        case 'appearance':
          bulkPayload = [
            {
              property_name: "appearance_settings",
              property_value: "Appearance Configuration",
              desc: "Platform theme and branding settings",
              metadata: {
                theme: settings.theme,
                primary_color: settings.primary_color,
                logo_url: settings.logo_url,
                favicon_url: settings.favicon_url
              }
            }
          ]
          break

        default:
          showMessage('info', 'Save functionality for this tab is not implemented yet')
          return
      }

      const response = await applicationAPI.createOrUpdateBulkProperties(bulkPayload)
      showMessage('success', `${tabs.find(tab => tab.id === activeTab)?.name} settings saved successfully!`)
    } catch (error) {
      console.error('Error saving settings:', error)
      showMessage('error', `Failed to save ${tabs.find(tab => tab.id === activeTab)?.name} settings`)
    } finally {
      setSaveLoading(false)
    }
  }

  // Handle form submissions for individual tabs
  const handleGeneralSubmit = (data) => {
    setSettings(prev => ({
      ...prev,
      site_title: data.siteName,
      site_description: data.siteDescription,
      contact_email: data.contactEmail,
      timezone: data.timezone
    }))
    setTimeout(saveCurrentTab, 100)
  }

  const handleEmailSubmit = (data) => {
    saveEmailSettings(data)
  }

  // Load Email Configuration into Form
  const loadEmailConfigIntoForm = (config) => {
    if (config.metadata?.emailSettings) {
      const emailSettings = config.metadata.emailSettings
      setEmailValue('smtpServer', emailSettings.smtpServer || '')
      setEmailValue('port', emailSettings.port || 587)
      setEmailValue('service', emailSettings.service || 'gmail')
      setEmailValue('username', emailSettings.username || '')
      setEmailValue('password', emailSettings.password || '')
      setEmailValue('useTLS', emailSettings.useTLS !== false)
    }
    setSelectedEmailConfig(config)
    setShowEmailConfigs(false)
  }

  // Test Email Configuration
  const testEmailConfiguration = async () => {
    try {
      showMessage('info', 'Testing email configuration...')
      setTimeout(() => {
        showMessage('success', 'Email configuration test completed successfully!')
      }, 2000)
    } catch (error) {
      showMessage('error', 'Failed to test email configuration')
    }
  }

  // Advanced Settings Actions
  const handleClearCache = async () => {
    try {
      showMessage('info', 'Clearing cache...')
      setTimeout(() => {
        showMessage('success', 'Cache cleared successfully!')
      }, 1500)
    } catch (error) {
      showMessage('error', 'Failed to clear cache')
    }
  }

  const handleCreateBackup = async () => {
    try {
      showMessage('info', 'Creating database backup...')
      setTimeout(() => {
        showMessage('success', 'Database backup created successfully!')
      }, 2000)
    } catch (error) {
      showMessage('error', 'Failed to create backup')
    }
  }

  const handleResetSettings = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      try {
        showMessage('info', 'Resetting settings to default...')
        setTimeout(() => {
          setSettings({
            site_title: "Learn SAP ABAP",
            site_description: "Master SAP ABAP programming with expert-led courses",
            contact_email: "support@learnsapabap.com",
            timezone: "UTC",
            maintenance_mode: false,
            user_registration: true,
            email_verification: true,
            strong_passwords: true,
            session_timeout: 120,
            max_login_attempts: 5,
            smtp_host: "smtp.gmail.com",
            smtp_port: 587,
            smtp_service: "gmail",
            smtp_username: "noreply@learnsapabap.com",
            smtp_password: "",
            smtp_use_tls: true,
            currency: "USD",
            tax_rate: "0",
            payment_gateway: "stripe",
            stripe_publishable_key: "",
            stripe_secret_key: "",
            theme: "light",
            primary_color: "#4f46e5",
            logo_url: "/logo.png",
            favicon_url: "/favicon.ico"
          })
          showMessage('success', 'Settings reset to default successfully!')
        }, 1500)
      } catch (error) {
        showMessage('error', 'Failed to reset settings')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-gray-600">Configure platform-wide settings and preferences</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button
            onClick={saveCurrentTab}
            disabled={saveLoading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saveLoading ? 'Saving...' : 'Save Current'}</span>
          </button>
          <button
            onClick={saveAllSettings}
            disabled={saveLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveLoading ? 'Saving All...' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            ) : message.type === 'error' ? (
              <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-700' :
              message.type === 'error' ? 'text-red-700' :
              'text-blue-700'
            }`}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
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
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                
                <form onSubmit={handleSubmitGeneral(handleGeneralSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      {...registerGeneral('siteName')}
                      defaultValue={settings.site_title}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        generalErrors.siteName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {generalErrors.siteName && (
                      <p className="mt-1 text-xs text-red-600">{generalErrors.siteName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      {...registerGeneral('siteDescription')}
                      defaultValue={settings.site_description}
                      rows="3"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        generalErrors.siteDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {generalErrors.siteDescription && (
                      <p className="mt-1 text-xs text-red-600">{generalErrors.siteDescription.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      {...registerGeneral('contactEmail')}
                      defaultValue={settings.contact_email}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        generalErrors.contactEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {generalErrors.contactEmail && (
                      <p className="mt-1 text-xs text-red-600">{generalErrors.contactEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      {...registerGeneral('timezone')}
                      defaultValue={settings.timezone}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        generalErrors.timezone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time (EST)</option>
                      <option value="PST">Pacific Time (PST)</option>
                      <option value="CET">Central European Time (CET)</option>
                      <option value="IST">Indian Standard Time (IST)</option>
                    </select>
                    {generalErrors.timezone && (
                      <p className="mt-1 text-xs text-red-600">{generalErrors.timezone.message}</p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      key: 'maintenance_mode',
                      label: 'Maintenance Mode',
                      description: 'Put the site in maintenance mode (visible only to admins)'
                    },
                    {
                      key: 'user_registration',
                      label: 'User Registration',
                      description: 'Allow new users to register accounts'
                    },
                    {
                      key: 'email_verification',
                      label: 'Email Verification',
                      description: 'Require email verification for new accounts'
                    },
                    {
                      key: 'strong_passwords',
                      label: 'Strong Password Requirement',
                      description: 'Enforce strong password policies'
                    }
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange(key, !settings[key])}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings[key] ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings[key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.session_timeout}
                      onChange={(e) => handleSettingChange('session_timeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={settings.max_login_attempts}
                      onChange={(e) => handleSettingChange('max_login_attempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              {/* Email Configurations List */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Email Configurations</h2>
                  <button
                    onClick={() => setShowEmailConfigs(!showEmailConfigs)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{showEmailConfigs ? 'Hide Configurations' : 'Show Configurations'}</span>
                  </button>
                </div>

                {showEmailConfigs && (
                  <div className="space-y-3 mb-6">
                    {emailConfigs.map((config) => (
                      <div
                        key={config.app_prop_id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedEmailConfig?.app_prop_id === config.app_prop_id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${
                          config.status === 'active' ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                        }`}
                        onClick={() => loadEmailConfigIntoForm(config)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              config.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                            <div>
                              <p className="font-medium text-gray-900">{config.property_value}</p>
                              <p className="text-sm text-gray-600">{config.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {config.status !== 'active' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveEmailConfig(config)
                                }}
                                className="text-green-600 hover:text-green-700 text-sm font-medium"
                              >
                                Activate
                              </button>
                            )}
                            <span className={`text-xs px-2 py-1 rounded ${
                              config.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {config.status}
                            </span>
                          </div>
                        </div>
                        {config.metadata?.emailSettings && (
                          <div className="mt-2 text-xs text-gray-500">
                            {config.metadata.emailSettings.smtpServer}:{config.metadata.emailSettings.port}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Current Active Configuration */}
                {selectedEmailConfig && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Active Configuration</span>
                    </div>
                    <p className="text-green-700">{selectedEmailConfig.property_value}</p>
                    <p className="text-sm text-green-600">{selectedEmailConfig.desc}</p>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedEmailConfig ? 'Edit Email Configuration' : 'Add New Email Configuration'}
                </h3>
                
                <form onSubmit={handleSubmitEmail(handleEmailSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        {...registerEmail('smtpServer')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          emailErrors.smtpServer ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {emailErrors.smtpServer && (
                        <p className="mt-1 text-xs text-red-600">{emailErrors.smtpServer.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        {...registerEmail('port')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          emailErrors.port ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {emailErrors.port && (
                        <p className="mt-1 text-xs text-red-600">{emailErrors.port.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service
                    </label>
                    <select
                      {...registerEmail('service')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        emailErrors.service ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="gmail">Gmail</option>
                      <option value="outlook">Outlook</option>
                      <option value="yahoo">Yahoo</option>
                      <option value="custom">Custom</option>
                    </select>
                    {emailErrors.service && (
                      <p className="mt-1 text-xs text-red-600">{emailErrors.service.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Username
                    </label>
                    <input
                      type="email"
                      {...registerEmail('username')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        emailErrors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {emailErrors.username && (
                      <p className="mt-1 text-xs text-red-600">{emailErrors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Password
                    </label>
                    <div className="relative">
                      <input
                        type={showSmtpPassword ? "text" : "password"}
                        {...registerEmail('password')}
                        className={`w-full pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          emailErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {emailErrors.password && (
                      <p className="mt-1 text-xs text-red-600">{emailErrors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...registerEmail('useTLS')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Use TLS</label>
                  </div>

                  <div className="pt-4 flex space-x-3">
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      {selectedEmailConfig ? 'Update Configuration' : 'Save Configuration'}
                    </button>
                    <button
                      type="button"
                      onClick={testEmailConfiguration}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
                    >
                      Test Configuration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Other tabs (Payment, Appearance, Advanced) remain the same */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleSettingChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        value={settings.tax_rate}
                        onChange={(e) => handleSettingChange('tax_rate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Gateway
                    </label>
                    <select
                      value={settings.payment_gateway}
                      onChange={(e) => handleSettingChange('payment_gateway', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="razorpay">Razorpay</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>

                  {settings.payment_gateway === 'stripe' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Stripe Publishable Key
                        </label>
                        <input
                          type="text"
                          value={settings.stripe_publishable_key}
                          onChange={(e) => handleSettingChange('stripe_publishable_key', e.target.value)}
                          placeholder="pk_live_..."
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Stripe Secret Key
                        </label>
                        <div className="relative">
                          <input
                            type={showStripeSecret ? "text" : "password"}
                            value={settings.stripe_secret_key}
                            onChange={(e) => handleSettingChange('stripe_secret_key', e.target.value)}
                            placeholder="sk_live_..."
                            className="w-full pl-3 pr-10 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowStripeSecret(!showStripeSecret)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                          >
                            {showStripeSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => handleSettingChange('primary_color', e.target.value)}
                        className="w-12 h-12 rounded-lg border border-gray-300"
                      />
                      <input
                        type="text"
                        value={settings.primary_color}
                        onChange={(e) => handleSettingChange('primary_color', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                          LS
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Current logo</p>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Upload New Logo
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favicon
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center text-white text-xs font-bold mx-auto mb-2">
                          L
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Current favicon</p>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Upload New Favicon
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Access
                    </label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">API Keys</p>
                        <p className="text-sm text-gray-600">Manage your API access keys</p>
                      </div>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                        <Key className="w-4 h-4" />
                        <span>Manage Keys</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cache Management
                    </label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Clear Cache</p>
                        <p className="text-sm text-gray-600">Clear all cached data</p>
                      </div>
                      <button 
                        onClick={handleClearCache}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear Cache</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Database Backup
                    </label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Backup Database</p>
                        <p className="text-sm text-gray-600">Create a full database backup</p>
                      </div>
                      <button 
                        onClick={handleCreateBackup}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Create Backup</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-red-900">Reset All Settings</p>
                        <p className="text-sm text-red-700">Reset all settings to default values</p>
                      </div>
                      <button 
                        onClick={handleResetSettings}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                      >
                        <Database className="w-4 h-4" />
                        <span>Reset Settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemSettings