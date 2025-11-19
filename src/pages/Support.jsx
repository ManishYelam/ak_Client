// src/pages/Support.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { useSupport } from '../hooks/useSupport';
import {
  FaComments,
  FaStar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSync,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaClock,
  FaTag,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChartBar,
  FaPhone,
  FaEnvelope,
  FaTicketAlt,
  FaQuestionCircle,
  FaInfoCircle
} from 'react-icons/fa';

// Constants
const TABS = [
  { id: 'contact', label: 'Contact', icon: FaPhone },
  { id: 'faq', label: 'FAQ', icon: FaQuestionCircle },
  { id: 'status', label: 'Status', icon: FaInfoCircle },
  { id: 'my-tickets', label: 'My Tickets', icon: FaTicketAlt },
];

const CONTACT_METHODS = [
  {
    icon: FaEnvelope,
    title: "Email Support",
    description: "24-hour response time",
    contact: "support@yourapp.com",
    action: "mailto:support@yourapp.com"
  },
  {
    icon: FaPhone,
    title: "Phone Support",
    description: "9 AM - 6 PM business hours",
    contact: "+1 (555) 123-4567",
    action: "tel:+15551234567"
  }
];

const STATUS_CONFIG = {
  open: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Open', icon: '🟡' },
  in_progress: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'In Progress', icon: '🔄' },
  resolved: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Resolved', icon: '✅' },
  closed: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Closed', icon: '🔒' },
};

const PRIORITY_CONFIG = {
  low: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Low', icon: '⬇️' },
  medium: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Medium', icon: '🔷' },
  high: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'High', icon: '⚠️' },
  urgent: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Urgent', icon: '🚨' },
};

// Tab data handlers
const TAB_HANDLERS = {
  faq: (fetchFAQs) => fetchFAQs(),
  'my-tickets': (fetchUserTickets) => fetchUserTickets(),
  contact: () => {},
  status: () => {}
};

const Support = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());
  const [ticketView, setTicketView] = useState('grid');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [showStats, setShowStats] = useState(true);
  
  const {
    formData,
    setFormData,
    isSubmitting,
    submitStatus,
    setSubmitStatus,
    validationErrors,
    clearValidationErrors,
    clearForm,
    faqs,
    loadingFaqs,
    userTickets,
    loadingTickets,
    stats,
    submitTicket,
    fetchFAQs,
    fetchUserTickets,
    fetchUserStats
  } = useSupport();

  // Load stats on initial mount
  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // Tab-specific data loading using object lookup
  useEffect(() => {
    const handler = TAB_HANDLERS[activeTab];
    if (handler) {
      handler(activeTab === 'faq' ? fetchFAQs : fetchUserTickets);
    }
  }, [activeTab, fetchFAQs, fetchUserTickets]);

  // Clear validation errors when tab changes
  useEffect(() => {
    clearValidationErrors();
    setSubmitStatus('');
  }, [activeTab, clearValidationErrors, setSubmitStatus]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      clearValidationErrors();
    }
  }, [setFormData, validationErrors, clearValidationErrors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const result = await submitTicket(formData);
    if (result.success) {
      clearForm();
      setTimeout(() => setSubmitStatus(''), 5000);
      if (activeTab === 'my-tickets') {
        fetchUserTickets(true);
      }
    }
  }, [formData, submitTicket, clearForm, setSubmitStatus, activeTab, fetchUserTickets]);

  const toggleFaq = useCallback((faqId) => {
    setExpandedFaqs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  }, []);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getSortedTickets = () => {
    if (!sortConfig.key) return userTickets;

    return [...userTickets].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="text-blue-600" /> 
      : <FaSortDown className="text-blue-600" />;
  };

  // Memoized tab content with improved design
  const tabContent = useMemo(() => ({
    contact: (
      <ContactTab 
        formData={formData} 
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
        validationErrors={validationErrors}
      />
    ),
    
    faq: (
      <FaqTab 
        faqs={faqs} 
        loading={loadingFaqs} 
        expandedFaqs={expandedFaqs}
        onToggleFaq={toggleFaq}
      />
    ),
    
    'my-tickets': (
      <TicketsTab 
        tickets={getSortedTickets()}
        loading={loadingTickets}
        onCreateTicket={() => setActiveTab('contact')}
        viewMode={ticketView}
        onViewModeChange={setTicketView}
        sortConfig={sortConfig}
        onSort={handleSort}
        getSortIcon={getSortIcon}
      />
    ),
    
    status: <StatusTab />
  }), [
    formData, handleSubmit, handleInputChange, isSubmitting, submitStatus, validationErrors,
    faqs, loadingFaqs, expandedFaqs, toggleFaq, userTickets, loadingTickets, ticketView,
    sortConfig, getSortedTickets
  ]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                    <FaComments className="text-white text-xl" />
                  </div>
                  Support Center
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Get help with your account and application issues
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FaChartBar className="text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {showStats ? 'Hide Analytics' : 'Show Analytics'}
                  </span>
                </button>
                
                <button
                  onClick={() => {
                    fetchUserStats();
                    if (activeTab === 'my-tickets') fetchUserTickets(true);
                    if (activeTab === 'faq') fetchFAQs();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FaSync className="text-white" />
                  <span className="font-medium">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          {showStats && stats && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Tickets</p>
                      <p className="text-3xl font-bold mt-2">{stats.total_tickets}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <FaComments className="text-2xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-blue-100 text-sm">
                    All support requests
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm font-medium">Open Tickets</p>
                      <p className="text-3xl font-bold mt-2">{stats.open_tickets}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <FaExclamationTriangle className="text-2xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-amber-100 text-sm">
                    Awaiting resolution
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">In Progress</p>
                      <p className="text-3xl font-bold mt-2">{stats.in_progress_tickets}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <FaSync className="text-2xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-orange-100 text-sm">
                    Being worked on
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Resolved</p>
                      <p className="text-3xl font-bold mt-2">{stats.resolved_tickets}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <FaCheckCircle className="text-2xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-emerald-100 text-sm">
                    Completed tickets
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 min-w-0">{tabContent[activeTab]}</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Sidebar Component
const Sidebar = ({ activeTab, onTabChange }) => (
  <div className="lg:w-64">
    <Card className="p-4 shadow-sm border-0 bg-gradient-to-b from-white to-gray-50 rounded-2xl">
      <nav className="space-y-2">
        {TABS.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-200 group ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-xs border border-transparent hover:border-gray-200"
              }`}
            >
              <IconComponent className={`text-lg transition-transform duration-200 group-hover:scale-110 ${
                activeTab === tab.id ? 'scale-110' : ''
              }`} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </Card>
  </div>
);

// Contact Tab
const ContactTab = ({ formData, onSubmit, onInputChange, isSubmitting, submitStatus, validationErrors }) => (
  <Card className="shadow-sm border-0 overflow-hidden rounded-2xl">
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
      <h2 className="text-xl font-semibold">Contact Support Team</h2>
      <p className="text-green-100 text-sm mt-1">We're here to help you with any issues</p>
    </div>
    
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {CONTACT_METHODS.map((method, index) => {
          const IconComponent = method.icon;
          return (
            <ContactMethod key={index} method={method} IconComponent={IconComponent} />
          );
        })}
      </div>

      <div className="border-t border-gray-100 pt-6">
        <ContactForm 
          formData={formData}
          onSubmit={onSubmit}
          onInputChange={onInputChange}
          isSubmitting={isSubmitting}
          submitStatus={submitStatus}
          validationErrors={validationErrors}
        />
      </div>
    </div>
  </Card>
);

const ContactMethod = ({ method, IconComponent }) => (
  <div className="text-center p-6 border border-gray-200 rounded-2xl bg-gradient-to-b from-white to-gray-50 hover:from-white hover:to-gray-100 transition-all duration-200 hover:shadow-md hover:border-green-200 group">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200">
      <IconComponent className="text-white text-2xl" />
    </div>
    <h3 className="font-semibold text-gray-800 text-lg mb-2">{method.title}</h3>
    <p className="text-gray-600 mb-3">{method.description}</p>
    <p className="text-green-600 font-semibold mb-4">{method.contact}</p>
    <Button
      onClick={() => window.open(method.action, '_blank')}
      className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
      variant="outline"
      size="sm"
    >
      Contact Now
    </Button>
  </div>
);

const ContactForm = ({ formData, onSubmit, onInputChange, isSubmitting, submitStatus, validationErrors }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label="Subject *"
        name="subject"
        type="text"
        value={formData.subject}
        onChange={onInputChange}
        placeholder="Brief description of your issue"
        error={validationErrors.subject}
        required
      />
      <FormField
        label="Category *"
        name="category"
        type="select"
        value={formData.category}
        onChange={onInputChange}
        error={validationErrors.category}
        options={[
          { value: 'general', label: 'General Inquiry' },
          { value: 'technical', label: 'Technical Issue' },
          { value: 'billing', label: 'Billing' },
          { value: 'feature', label: 'Feature Request' },
          { value: 'bug', label: 'Bug Report' },
          { value: 'case_related', label: 'Case Related' },
        ]}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label="Priority"
        name="priority"
        type="select"
        value={formData.priority}
        onChange={onInputChange}
        error={validationErrors.priority}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent' },
        ]}
      />
      <FormField
        label="Case ID (Optional)"
        name="case_id"
        type="number"
        value={formData.case_id || ''}
        onChange={onInputChange}
        error={validationErrors.case_id}
        placeholder="Enter case ID if related to a case"
        min="1"
        step="1"
      />
    </div>

    <FormField
      label="Description *"
      name="description"
      type="textarea"
      value={formData.description}
      onChange={onInputChange}
      placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you were trying to accomplish."
      error={validationErrors.description}
      rows={5}
      required
    />

    {Object.keys(validationErrors).length > 0 && (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
          <FaExclamationTriangle />
          <span>Please fix the following errors:</span>
        </div>
        <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
          {Object.entries(validationErrors).map(([field, error]) => (
            <li key={field}>{error}</li>
          ))}
        </ul>
      </div>
    )}

    {submitStatus && (
      <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
        submitStatus.startsWith('success') 
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        {submitStatus.startsWith('success') ? <FaCheckCircle /> : <FaExclamationTriangle />}
        <span>{submitStatus.replace('success: ', '').replace('error: ', '')}</span>
      </div>
    )}

    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
      <Button 
        type="button" 
        variant="outline"
        onClick={() => {
          document.querySelector('form').reset();
          onInputChange({ target: { name: 'category', value: 'general' } });
          onInputChange({ target: { name: 'priority', value: 'medium' } });
          onInputChange({ target: { name: 'case_id', value: null } });
        }}
      >
        Clear Form
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Creating Ticket...
          </span>
        ) : (
          'Create Support Ticket'
        )}
      </Button>
    </div>
  </form>
);

const FormField = ({ label, type = 'text', options = [], error, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
      {label}
      {props.required && <span className="text-red-500 text-xs">*</span>}
    </label>
    {type === 'select' ? (
      <select 
        {...props} 
        className={`w-full px-4 py-3 border text-sm rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:shadow-xs'
        }`}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : type === 'textarea' ? (
      <textarea 
        {...props} 
        className={`w-full px-4 py-3 border text-sm rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:shadow-xs'
        }`}
      />
    ) : (
      <input 
        type={type} 
        {...props} 
        className={`w-full px-4 py-3 border text-sm rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:shadow-xs'
        }`}
      />
    )}
    {error && (
      <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
        <FaExclamationTriangle size={12} />
        <span>{error}</span>
      </p>
    )}
  </div>
);

// FAQ Tab
const FaqTab = ({ faqs, loading, expandedFaqs, onToggleFaq }) => (
  <Card className="shadow-sm border-0 rounded-2xl overflow-hidden">
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
      <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
      <p className="text-green-100 text-sm mt-1">Find quick answers to common questions</p>
    </div>
    
    <div className="p-6">
      {loading ? (
        <LoadingSpinner text="Loading FAQs..." />
      ) : (
        <div className="space-y-4">
          {faqs.length > 0 ? (
            faqs.map((item) => (
              <FaqItem 
                key={item.faq_id} 
                item={item} 
                isExpanded={expandedFaqs.has(item.faq_id)}
                onToggle={() => onToggleFaq(item.faq_id)}
              />
            ))
          ) : (
            <EmptyState 
              message="No FAQs available at the moment."
              icon={FaQuestionCircle}
            />
          )}
        </div>
      )}
    </div>
  </Card>
);

const FaqItem = ({ item, isExpanded, onToggle }) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md bg-white">
    <button
      className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors group"
      onClick={onToggle}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-1">
          <FaQuestionCircle size={16} />
        </div>
        <span className="font-semibold text-gray-800 text-left pr-4 group-hover:text-green-600 transition-colors">
          {item.question}
        </span>
      </div>
      <div className={`text-gray-400 flex-shrink-0 transition-transform duration-200 group-hover:text-green-500 ${
        isExpanded ? 'rotate-180' : ''
      }`}>
        <FaSortDown size={16} />
      </div>
    </button>
    <div className={`transition-all duration-200 overflow-hidden ${
      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
    }`}>
      <div className="p-6 border-t border-gray-200 bg-green-50">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 mt-1 flex-shrink-0">
            <FaInfoCircle size={16} />
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{item.answer}</p>
        </div>
      </div>
    </div>
  </div>
);

// Tickets Tab
const TicketsTab = ({ tickets, loading, onCreateTicket, viewMode, onViewModeChange, sortConfig, onSort, getSortIcon }) => {
  return (
    <Card className="shadow-sm border-0 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">My Support Tickets</h2>
            <p className="text-green-100 text-sm mt-1">Manage and track your support requests</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
            <Button 
              onClick={onCreateTicket} 
              className="bg-white text-green-600 hover:bg-green-50 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              + New Ticket
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <LoadingSpinner text="Loading your tickets..." />
        ) : tickets.length > 0 ? (
          viewMode === 'grid' ? (
            <TicketGridView tickets={tickets} />
          ) : (
            <TicketListView 
              tickets={tickets} 
              sortConfig={sortConfig}
              onSort={onSort}
              getSortIcon={getSortIcon}
            />
          )
        ) : (
          <EmptyState 
            message="You haven't created any support tickets yet."
            action={
              <Button 
                onClick={onCreateTicket} 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Your First Ticket
              </Button>
            }
            icon={FaTicketAlt}
          />
        )}
      </div>
    </Card>
  );
};

const ViewToggle = ({ viewMode, onViewModeChange }) => (
  <div className="flex bg-white rounded-lg p-1 shadow-sm border border-green-200">
    <button
      onClick={() => onViewModeChange('grid')}
      className={`p-2 rounded-md transition-colors ${
        viewMode === 'grid' 
          ? 'bg-green-500 text-white' 
          : 'text-gray-600 hover:text-green-600'
      }`}
      title="Grid View"
    >
      ⬜
    </button>
    <button
      onClick={() => onViewModeChange('list')}
      className={`p-2 rounded-md transition-colors ${
        viewMode === 'list' 
          ? 'bg-green-500 text-white' 
          : 'text-gray-600 hover:text-green-600'
      }`}
      title="List View"
    >
      ☰
    </button>
  </div>
);

const TicketGridView = ({ tickets }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {tickets.map((ticket) => (
      <TicketCard key={ticket.support_ticket_id} ticket={ticket} />
    ))}
  </div>
);

const TicketListView = ({ tickets, sortConfig, onSort, getSortIcon }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50/80">
          <tr>
            <th 
              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('subject')}
            >
              <div className="flex items-center gap-2">
                Subject
                {getSortIcon('subject')}
              </div>
            </th>
            <th 
              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center gap-2">
                Status
                {getSortIcon('status')}
              </div>
            </th>
            <th 
              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('priority')}
            >
              <div className="flex items-center gap-2">
                Priority
                {getSortIcon('priority')}
              </div>
            </th>
            <th 
              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('created_at')}
            >
              <div className="flex items-center gap-2">
                Created
                {getSortIcon('created_at')}
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tickets.map((ticket) => (
            <TicketListItem key={ticket.support_ticket_id} ticket={ticket} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TicketCard = ({ ticket }) => {
  const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.closed;
  const priorityConfig = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium;

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white group hover:border-green-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-lg truncate group-hover:text-green-600 transition-colors mb-2">
            {ticket.subject}
          </h3>
          <p className="text-xs text-gray-500 font-mono mb-3">#{ticket.ticket_number}</p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0 ml-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.color} flex items-center gap-1.5`}>
            <span className="text-xs">{statusConfig.icon}</span>
            {statusConfig.label}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${priorityConfig.color} flex items-center gap-1.5`}>
            <span className="text-xs">{priorityConfig.icon}</span>
            {priorityConfig.label}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
        {ticket.description}
      </p>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <FaTag size={12} />
            <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
          </span>
          <span className="flex items-center gap-2">
            <FaClock size={12} />
            <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
          </span>
        </div>
        
        {ticket.updated_at !== ticket.created_at && (
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Updated:</span>
            <span>{new Date(ticket.updated_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          className="w-full hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

const TicketListItem = ({ ticket }) => {
  const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.closed;
  const priorityConfig = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium;

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
            <FaTicketAlt />
          </div>
          <div>
            <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
              {ticket.subject}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              #{ticket.ticket_number}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.color} border`}>
          {statusConfig.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${priorityConfig.color} border`}>
          {priorityConfig.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaClock size={12} />
          {new Date(ticket.created_at).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="View Details"
          >
            <FaEye size={14} />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
            title="Edit Ticket"
          >
            <FaEdit size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Status Tab
const StatusTab = () => (
  <Card className="shadow-sm border-0 rounded-2xl overflow-hidden">
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
      <h2 className="text-xl font-semibold">System Status</h2>
      <p className="text-green-100 text-sm mt-1">Current platform status and performance</p>
    </div>
    
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-green-600 text-4xl mb-3">
            <FaCheckCircle />
          </div>
          <div className="text-green-800 font-semibold text-lg mb-2">All Systems Operational</div>
          <p className="text-green-600">No issues reported</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 text-lg mb-4 flex items-center gap-2">
            <FaChartBar />
            Performance Metrics
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Response Time</span>
              <span className="text-blue-800 font-semibold">~2.3s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Uptime</span>
              <span className="text-blue-800 font-semibold">99.98%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Active Users</span>
              <span className="text-blue-800 font-semibold">1,247</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          Last updated: {new Date().toLocaleString()} • Next update in 5 minutes
        </p>
      </div>
    </div>
  </Card>
);

const LoadingSpinner = ({ text }) => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
    <p className="text-gray-600 text-lg">{text}</p>
  </div>
);

const EmptyState = ({ message, action, icon: IconComponent }) => (
  <div className="text-center py-12 text-gray-500">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
      <IconComponent className="text-2xl text-gray-400" />
    </div>
    <p className="text-lg font-medium text-gray-900 mb-2">{message}</p>
    {action}
  </div>
);

export default Support;