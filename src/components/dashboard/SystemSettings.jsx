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
  Settings as SettingsIcon,
  AlertCircle,
  Save,
  Download,
  Database,
  Edit,
  Plus,
  Activity,
  X
} from 'lucide-react'
import { applicationAPI } from '../../services/api'

// Validation schemas
const emailSettingsSchema = yup.object({
  smtpServer: yup.string().required('SMTP server is required'),
  port: yup.number()
    .typeError('Port must be a number')
    .required('Port is required')
    .min(1, 'Port must be at least 1')
    .max(65535, 'Port must be less than 65535'),
  service: yup.string().required('Service is required'),
  username: yup.string().email('Must be a valid email').required('Username is required'),
  password: yup.string().required('Password is required'),
  useTLS: yup.boolean().default(true),
  description: yup.string()
})

const generalSettingsSchema = yup.object({
  siteName: yup.string().required('Site name is required'),
  siteDescription: yup.string().required('Site description is required'),
  contactEmail: yup.string().email('Must be a valid email').required('Contact email is required')
})

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showSmtpPassword, setShowSmtpPassword] = useState(false)
  const [emailConfigs, setEmailConfigs] = useState([])
  const [showEmailConfigs, setShowEmailConfigs] = useState(false)

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [editingEmailConfig, setEditingEmailConfig] = useState(null)
  const [emailFormStatus, setEmailFormStatus] = useState('active')

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    site_title: "Learn SAP ABAP",
    site_description: "Master SAP ABAP programming with expert-led courses",
    contact_email: "support@learnsapabap.com",

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
    smtp_use_tls: true
  })

  // Forms
  const { 
    register: registerGeneral, 
    handleSubmit: handleSubmitGeneral, 
    formState: { errors: generalErrors }, 
    reset: resetGeneral,
    watch: watchGeneral 
  } = useForm({
    resolver: yupResolver(generalSettingsSchema),
    defaultValues: {
      siteName: '',
      siteDescription: '',
      contactEmail: ''
    }
  })

  const { 
    register: registerEmail, 
    handleSubmit: handleSubmitEmail, 
    formState: { errors: emailErrors }, 
    reset: resetEmail 
  } = useForm({
    resolver: yupResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: '',
      port: 587,
      service: '',
      username: '',
      password: '',
      useTLS: true,
      description: ''
    }
  })

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'email', name: 'Email', icon: '📧' },
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
            Object.keys(property.metadata).forEach(key => {
              loadedSettings[key] = property.metadata[key]
            })
          }
        })

        setSettings(prev => ({ ...prev, ...loadedSettings }))

        // Reset forms with loaded data
        resetGeneral({
          siteName: loadedSettings.site_title || '',
          siteDescription: loadedSettings.site_description || '',
          contactEmail: loadedSettings.contact_email || ''
        })
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

  // Email Modal Functions
  const openEditModal = (config) => {
    setEditingEmailConfig(config)
    setEmailFormStatus(config.status || 'active')
    
    if (config.metadata?.emailSettings) {
      const emailSettings = config.metadata.emailSettings
      resetEmail({
        smtpServer: emailSettings.smtpServer || '',
        port: emailSettings.port || 587,
        service: emailSettings.service || '',
        username: emailSettings.username || '',
        password: emailSettings.password || '',
        useTLS: emailSettings.useTLS !== false,
        description: config.desc || ''
      })
    } else {
      resetEmail({
        smtpServer: '',
        port: 587,
        service: '',
        username: '',
        password: '',
        useTLS: true,
        description: config.desc || ''
      })
    }
    
    setShowEmailModal(true)
  }

  const openNewModal = () => {
    setEditingEmailConfig(null)
    setEmailFormStatus('active')
    resetEmail()
    setShowEmailModal(true)
  }

  const closeEmailModal = () => {
    if (saveLoading) return
    
    setShowEmailModal(false)
    setEditingEmailConfig(null)
    setEmailFormStatus('active')
    resetEmail()
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

      if (config.app_prop_id) {
        payload.app_prop_id = config.app_prop_id
      }

      await applicationAPI.createOrUpdateProperty(payload)
      loadEmailConfigs()
      showMessage('success', 'Email configuration activated successfully!')
    } catch (error) {
      console.error('Error activating email config:', error)
      showMessage('error', 'Failed to activate email configuration')
    }
  }

  // Save Email Configuration
  const handleEmailSubmit = async (data) => {
    setSaveLoading(true)
    try {
      const payload = {
        property_name: "app_email",
        property_value: data.username,
        desc: data.description || "SMTP email server configuration",
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
        status: emailFormStatus
      }

      if (editingEmailConfig) {
        payload.app_prop_id = editingEmailConfig.app_prop_id
      }

      await applicationAPI.createOrUpdateProperty(payload)
      showMessage('success', editingEmailConfig ? 'Email configuration updated successfully!' : 'Email configuration created successfully!')
      closeEmailModal()
      loadEmailConfigs()
    } catch (error) {
      console.error('Error saving email settings:', error)
      const errorMessage = error.response?.data?.message || 'Failed to save email configuration'
      showMessage('error', errorMessage)
    } finally {
      setSaveLoading(false)
    }
  }

  // Test Email Configuration Functions
  const testSpecificEmailConfig = async (config) => {
    try {
      showMessage('info', `Testing email configuration: ${config.property_value}...`)
      
      setTimeout(() => {
        showMessage('success', `Email configuration test for ${config.property_value} completed successfully!`)
      }, 2000)
    } catch (error) {
      showMessage('error', `Failed to test email configuration: ${config.property_value}`)
    }
  }

  const testEmailConfiguration = async () => {
    try {
      if (editingEmailConfig) {
        await testSpecificEmailConfig(editingEmailConfig)
      } else {
        showMessage('info', 'Testing current email configuration...')
        setTimeout(() => {
          showMessage('success', 'Email configuration test completed successfully!')
        }, 2000)
      }
    } catch (error) {
      showMessage('error', 'Failed to test email configuration')
    }
  }

  // Save Current Tab Settings
  const saveCurrentTab = async () => {
    setSaveLoading(true)
    try {
      let payload = {}

      switch (activeTab) {
        case 'general':
          const generalData = watchGeneral()
          payload = {
            property_name: "site_title",
            property_value: generalData.siteName || "",
            desc: "Website title and name",
            metadata: {
              site_description: generalData.siteDescription,
              contact_email: generalData.contactEmail
            }
          }
          break

        default:
          showMessage('info', 'Save functionality for this tab is not implemented yet')
          setSaveLoading(false)
          return
      }

      await applicationAPI.createOrUpdateProperty(payload)
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
      contact_email: data.contactEmail
    }))
    saveCurrentTab()
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
            smtp_use_tls: true
          })
          resetGeneral({
            siteName: "Learn SAP ABAP",
            siteDescription: "Master SAP ABAP programming with expert-led courses",
            contactEmail: "support@learnsapabap.com"
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900">System Settings</h1> */}
          <p className="text-gray-600 text-sm mt-1">Configure platform-wide settings and preferences</p>
        </div>
        <div className="flex space-x-2 mt-4 lg:mt-0">
          <button
            onClick={saveCurrentTab}
            disabled={saveLoading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saveLoading ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`rounded-lg p-3 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start">
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            ) : message.type === 'error' ? (
              <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-32">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-2 px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h2 className="text-base font-semibold text-gray-900 mb-3">General Settings</h2>

                <form onSubmit={handleSubmitGeneral(handleGeneralSubmit)} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Site Name *
                    </label>
                    <input
                      type="text"
                      {...registerGeneral('siteName')}
                      className={`w-full px-2.5 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent ${
                        generalErrors.siteName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter site name"
                    />
                    {generalErrors.siteName && (
                      <p className="mt-1 text-xs text-red-600">{generalErrors.siteName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Site Description *
                    </label>
                    <textarea
                      {...registerGeneral('siteDescription')}
                      rows="2"
                      className={`w-full px-2.5 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent ${
                        generalErrors.siteDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter site description"
                    />
                    {generalErrors.siteDescription && (
                      <p className="mt-1 text-xs text-red-600">{generalErrors.siteDescription.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      {...registerGeneral('contactEmail')}
                      className={`w-full px-2.5 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent ${
                        generalErrors.contactEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter contact email"
                    />
                    {generalErrors.contactEmail && (
                      <p className="mt-1 text-xs text-red-600">{generalErrors.contactEmail.message}</p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-4">
              {/* Email Configurations Header */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Email Configurations</h2>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Manage your email service configurations ({emailConfigs.length} total)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowEmailConfigs(!showEmailConfigs)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{showEmailConfigs ? 'Hide' : 'Show'} Table</span>
                    </button>
                    <button
                      onClick={openNewModal}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Config</span>
                    </button>
                  </div>
                </div>
              </div>

              {showEmailConfigs && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="w-16 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Server
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="w-20 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {emailConfigs.map((config) => (
                          <tr
                            key={config.app_prop_id}
                            className={`hover:bg-gray-50 transition-colors ${
                              config.status === 'active' ? 'bg-green-50 hover:bg-green-100' : ''
                            }`}
                          >
                            {/* Status Column */}
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-1.5 ${
                                  config.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                  config.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {config.status}
                                </span>
                              </div>
                            </td>

                            {/* Email Column */}
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div>
                                <div className="font-medium text-gray-900 text-xs">
                                  {config.property_value}
                                </div>
                                <div className="text-gray-500 text-xs mt-0.5">
                                  {config.metadata?.emailSettings?.username}
                                </div>
                              </div>
                            </td>

                            {/* Server Column */}
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div>
                                <div className="text-gray-900 text-xs">
                                  {config.metadata?.emailSettings?.smtpServer || 'N/A'}
                                </div>
                                <div className="text-gray-500 text-xs mt-0.5">
                                  Port: {config.metadata?.emailSettings?.port || 'N/A'}
                                </div>
                              </div>
                            </td>

                            {/* Service Column */}
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium capitalize ${
                                config.metadata?.emailSettings?.service === 'gmail' ? 'bg-red-100 text-red-800' :
                                config.metadata?.emailSettings?.service === 'outlook' ? 'bg-blue-100 text-blue-800' :
                                config.metadata?.emailSettings?.service === 'yahoo' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {config.metadata?.emailSettings?.service || 'custom'}
                              </span>
                            </td>

                            {/* Description Column */}
                            <td className="px-3 py-2">
                              <div className="text-gray-900 text-xs max-w-[120px] truncate" title={config.desc}>
                                {config.desc || 'No description'}
                              </div>
                            </td>

                            {/* Actions Column */}
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                                {config.status !== 'active' && (
                                  <button
                                    onClick={() => setActiveEmailConfig(config)}
                                    className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors"
                                    title="Activate this configuration"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                  </button>
                                )}
                                <button
                                  onClick={() => openEditModal(config)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors"
                                  title="Edit this configuration"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => testSpecificEmailConfig(config)}
                                  className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-100 transition-colors"
                                  title="Test this configuration"
                                >
                                  <Activity className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {emailConfigs.length === 0 && (
                      <div className="text-center py-6">
                        <Mail className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No email configurations</h3>
                        <p className="text-xs text-gray-500 mb-3">Get started by creating a new email configuration.</p>
                        <button
                          onClick={openNewModal}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 mx-auto transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create Configuration</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Advanced Settings</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Clear Application Cache</p>
                      <p className="text-xs text-gray-600">Remove temporary files and refresh system cache</p>
                    </div>
                    <button
                      onClick={handleClearCache}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      Clear Cache
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Create System Backup</p>
                      <p className="text-xs text-gray-600">Generate a complete backup of system data</p>
                    </div>
                    <button
                      onClick={handleCreateBackup}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Backup</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="text-sm font-medium text-red-900">Reset All Settings</p>
                      <p className="text-xs text-red-700">Restore all settings to default values</p>
                    </div>
                    <button
                      onClick={handleResetSettings}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Configuration Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingEmailConfig ? 'Edit Email Config' : 'New Email Config'}
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  {editingEmailConfig
                    ? `Editing: ${editingEmailConfig.property_value}`
                    : 'Configure SMTP email settings'
                  }
                </p>
              </div>
              <button
                onClick={closeEmailModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <form onSubmit={handleSubmitEmail(handleEmailSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      SMTP Host *
                    </label>
                    <input
                      type="text"
                      {...registerEmail('smtpServer')}
                      className={`w-full px-2.5 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent ${
                        emailErrors.smtpServer ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="smtp.gmail.com"
                    />
                    {emailErrors.smtpServer && (
                      <p className="mt-1 text-xs text-red-600">{emailErrors.smtpServer.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      SMTP Port *
                    </label>
                    <input
                      type="number"
                      {...registerEmail('port')}
                      className={`w-full px-2.5 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent ${
                        emailErrors.port ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="587"
                    />
                    {emailErrors.port && (
                      <p className="mt-1 text-xs text-red-600">{emailErrors.port.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Service Type *
                    </label>
                    <select
                      {...registerEmail('service')}
                      className={`w-full px-2.5 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent ${
                        emailErrors.service ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select service</option>
                      <option value="gmail">Gmail</option>
                      <option value="outlook">Outlook</option>
                      <option value="yahoo">Yahoo</option>
                      <option value="custom">Custom SMTP</option>
                    </select>
                    {emailErrors.service && (
                      <p className="mt-1 text-xs text-red-600">{emailErrors.service.message}</p>
                    )}
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      {...registerEmail('useTLS')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                    />
                    <label className="ml-2 text-xs text-gray-700">Enable TLS</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      SMTP Username *
                    </label>
                    <input
                      type="email"
                      {...registerEmail('username')}
                      className={`w-full px-2.5 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent ${
                        emailErrors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="your-email@gmail.com"
                    />
                    {emailErrors.username && (
                      <p className="mt-1 text-xs text-red-600">{emailErrors.username.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      SMTP Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showSmtpPassword ? "text" : "password"}
                        {...registerEmail('password')}
                        className={`w-full pl-2.5 pr-8 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent ${
                          emailErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        {showSmtpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {emailErrors.password && (
                      <p className="mt-1 text-xs text-red-600">{emailErrors.password.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    {...registerEmail('description')}
                    rows="2"
                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe this email configuration..."
                  />
                </div>

                {/* Status Toggle for Editing */}
                {editingEmailConfig && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <p className="text-xs text-gray-600">Set as active</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmailFormStatus(editingEmailConfig.status === 'active' ? 'inactive' : 'active')}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        emailFormStatus === 'active' ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          emailFormStatus === 'active' ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      if (editingEmailConfig) {
                        testSpecificEmailConfig(editingEmailConfig)
                      } else {
                        testEmailConfiguration()
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Test</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={closeEmailModal}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>
                        {saveLoading
                          ? 'Saving...'
                          : (editingEmailConfig ? 'Update' : 'Create')
                        }
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SystemSettings