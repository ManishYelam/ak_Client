// components/UserContacts.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaClock, 
  FaCheck, 
  FaEye, 
  FaUser,
  FaCalendar,
  FaArrowLeft,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { getAllContacts, getContactById } from '../services/contactService';
import { showErrorToast } from '../utils/Toastify';

const UserContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [view, setView] = useState('list');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllContacts({ page });
      
      const contactsData = response?.data?.data || [];
      const paginationData = response?.data || {};
      
      setContacts(contactsData);
      setPagination({
        currentPage: paginationData.currentPage || page,
        totalPages: paginationData.totalPages || 1,
        totalRecords: paginationData.totalRecords || contactsData.length
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load your contact submissions');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async (id) => {
    try {
      const response = await getContactById(id);
      
      let contactData = response?.data?.data || response?.data || response;
      
      setSelectedContact(contactData);
      setView('detail');
    } catch (error) {
      console.error('Error fetching contact details:', error);
      showErrorToast('Failed to load contact details');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Reviewed': 'bg-blue-100 text-blue-800 border-blue-200',
      'Resolved': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || colors.Pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': FaClock,
      'Reviewed': FaEye,
      'Resolved': FaCheck
    };
    const Icon = icons[status] || FaClock;
    return <Icon size={12} />;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FaEnvelope className="text-purple-600" />
          My Contact Submissions
        </h1>
        <p className="text-gray-600 mt-2">
          Review your contact form submissions and track their status.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Unable to load contacts</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detail View */}
      {view === 'detail' && selectedContact && (
        <ContactDetailView 
          contact={selectedContact}
          onBack={() => {
            setView('list');
            setSelectedContact(null);
          }}
        />
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FaEnvelope className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contact submissions yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                You haven't submitted any contact forms yet. Use the contact form to get in touch with us.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Contact Form
              </Link>
            </div>
          ) : (
            <>
              {contacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <FaUser className="text-gray-400" />
                          {contact.name}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                          {getStatusIcon(contact.status)}
                          {contact.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${contact.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {contact.priority} Priority
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                        <FaCalendar size={10} />
                        {formatDate(contact.createdAt)}
                      </div>
                    </div>
                    
                    {/* Message Preview */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed line-clamp-3">
                        {contact.message}
                      </p>
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaEnvelope className="text-gray-400" />
                          {contact.email}
                        </span>
                        <span>ID: #{contact.id}</span>
                        {contact.responded_at && (
                          <span className="text-green-600 flex items-center gap-1">
                            <FaCheck className="text-green-400" />
                            Responded
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleViewContact(contact.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <FaEye size={12} />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => fetchContacts(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FaChevronLeft size={14} />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => fetchContacts(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                    <FaChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Contact Detail View for Users
const ContactDetailView = ({ contact, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <FaArrowLeft size={16} />
          Back to List
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Contact Submission Details</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Overview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Current Status</h3>
              <p className="text-blue-600 mt-1">
                Your submission is currently <strong>{contact.status}</strong>
                {contact.responded_at && ' and has been responded to.'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              contact.status === 'Resolved' ? 'bg-green-100 text-green-800' :
              contact.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {contact.status}
            </div>
          </div>
        </div>

        {/* Your Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <p className="mt-1 text-gray-900 font-medium">{contact.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email Address</label>
              <p className="mt-1 text-gray-900">{contact.email}</p>
            </div>
          </div>
        </div>

        {/* Your Message */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Your Message</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{contact.message}</p>
          </div>
        </div>

        {/* Submission Details */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Submission Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-sm font-medium text-gray-600">Submitted On</label>
              <p className="mt-1 text-gray-900">
                {new Date(contact.createdAt).toLocaleString()}
              </p>
            </div>
            {contact.responded_at && (
              <div>
                <label className="block text-sm font-medium text-gray-600">Responded On</label>
                <p className="mt-1 text-gray-900">
                  {new Date(contact.responded_at).toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-600">Priority</label>
              <p className="mt-1 text-gray-900">{contact.priority}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Submission ID</label>
              <p className="mt-1 text-gray-900">#{contact.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContacts;