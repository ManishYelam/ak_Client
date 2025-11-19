// components/ContactManagement.jsx
import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaEye, 
  FaTrash, 
  FaEdit, 
  FaCheck, 
  FaClock,
  FaExclamationTriangle,
  FaUserCheck,
  FaComment,
  FaEnvelope,
  FaUser,
  FaCalendar,
  FaExclamationCircle,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { getAllContacts, getContactById, deleteContact, updateContactStatus, updateContactRemarks } from '../services/contactService';
import { showSuccessToast, showErrorToast, showWarningToast } from '../utils/Toastify';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [error, setError] = useState('');
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
      setError('Failed to load contacts');
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
      setAdminRemarks(contactData.admin_remarks || '');
      setView('detail');
      
      if (!contactData.is_read) {
        await updateContactStatus(id, { is_read: true });
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
      showErrorToast('Failed to load contact details');
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
        showSuccessToast('Contact deleted successfully');
        
        if (selectedContact && selectedContact.id === id) {
          setView('list');
          setSelectedContact(null);
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
        showErrorToast('Failed to delete contact');
      }
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedContact) return;

    setUpdateLoading(true);
    try {
      await updateContactStatus(selectedContact.id, { status });
      
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === selectedContact.id ? { ...contact, status } : contact
        )
      );
      
      setSelectedContact(prev => ({ ...prev, status }));
      
      showSuccessToast(`Status updated to ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      showErrorToast('Failed to update status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdateRemarks = async () => {
    if (!selectedContact || !adminRemarks.trim()) {
      showWarningToast('Please enter remarks');
      return;
    }

    setUpdateLoading(true);
    try {
      await updateContactRemarks(selectedContact.id, { admin_remarks: adminRemarks });
      
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === selectedContact.id ? { ...contact, admin_remarks: adminRemarks } : contact
        )
      );
      
      setSelectedContact(prev => ({ ...prev, admin_remarks: adminRemarks }));
      
      showSuccessToast('Remarks updated successfully');
      setView('detail');
    } catch (error) {
      console.error('Error updating remarks:', error);
      showErrorToast('Failed to update remarks');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleMarkAsResponded = async () => {
    if (!selectedContact) return;

    setUpdateLoading(true);
    try {
      await updateContactStatus(selectedContact.id, { 
        responded_at: new Date().toISOString(),
        handled_by_admin_id: 1
      });
      
      const updatedContact = { 
        responded_at: new Date().toISOString(),
        handled_by_admin_id: 1 
      };
      
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === selectedContact.id ? { ...contact, ...updatedContact } : contact
        )
      );
      
      setSelectedContact(prev => ({ ...prev, ...updatedContact }));
      
      showSuccessToast('Marked as responded');
    } catch (error) {
      console.error('Error marking as responded:', error);
      showErrorToast('Failed to update response status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Reviewed': 'bg-blue-100 text-blue-800 border-blue-200',
      'Resolved': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || colors.Pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-orange-100 text-orange-800',
      'High': 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.Medium;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FaEnvelope className="text-purple-600" />
          Contact Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage all contact form submissions and responses from users.
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

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contacts by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.totalRecords}</p>
                </div>
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {contacts.filter(c => c.status === 'Pending').length}
                  </p>
                </div>
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reviewed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {contacts.filter(c => c.status === 'Reviewed').length}
                  </p>
                </div>
                <FaEye className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {contacts.filter(c => c.status === 'Resolved').length}
                  </p>
                </div>
                <FaCheck className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Contact Submissions ({filteredContacts.length})
              </h2>
              <div className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredContacts.length === 0 ? (
                <div className="p-8 text-center">
                  <FaEnvelope className="mx-auto text-gray-400 text-4xl mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {contacts.length === 0 ? 'No contacts found' : 'No contacts match your search'}
                  </h3>
                  <p className="text-gray-500">
                    {contacts.length === 0 
                      ? 'No contact submissions have been made yet.' 
                      : 'Try adjusting your search criteria.'
                    }
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div key={contact.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            {contact.name || 'Unknown Name'}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                            {getStatusIcon(contact.status)}
                            {contact.status || 'Pending'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                            {contact.priority || 'Medium'}
                          </span>
                          {!contact.is_read && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              New
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" />
                          {contact.email || 'No email provided'}
                        </p>
                        
                        <p className="text-gray-700 line-clamp-2 mb-2">
                          {contact.message || 'No message provided'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaCalendar className="text-gray-400" />
                            {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'Unknown date'}
                          </span>
                          {contact.responded_at && (
                            <span className="text-green-600 flex items-center gap-1">
                              <FaUserCheck className="text-green-400" />
                              Responded: {new Date(contact.responded_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleViewContact(contact.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Contact"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-4 py-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredContacts.length} of {pagination.totalRecords} contacts
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchContacts(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft size={14} />
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchContacts(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <FaChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
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
          onEdit={() => setView('edit')}
          onUpdateStatus={handleUpdateStatus}
          onMarkAsResponded={handleMarkAsResponded}
          updateLoading={updateLoading}
        />
      )}

      {/* Edit View */}
      {view === 'edit' && selectedContact && (
        <ContactEditView
          contact={selectedContact}
          adminRemarks={adminRemarks}
          setAdminRemarks={setAdminRemarks}
          onSave={handleUpdateRemarks}
          onCancel={() => setView('detail')}
          updateLoading={updateLoading}
        />
      )}
    </div>
  );
};

// Contact Detail View Component
const ContactDetailView = ({ contact, onBack, onEdit, onUpdateStatus, onMarkAsResponded, updateLoading }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Reviewed': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.Pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-orange-100 text-orange-800',
      'High': 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.Medium;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaArrowLeft size={16} />
            Back to List
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Contact Details</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contact.status)}`}>
            {contact.status || 'Pending'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(contact.priority)}`}>
            {contact.priority || 'Medium'}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
            <p className="text-gray-900 font-medium">{contact.name || 'Unknown Name'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
            <p className="text-gray-900">{contact.email || 'No email provided'}</p>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Message</label>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{contact.message || 'No message provided'}</p>
          </div>
        </div>

        {/* Admin Remarks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-600">Admin Remarks</label>
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              <FaEdit size={12} />
              {contact.admin_remarks ? 'Edit Remarks' : 'Add Remarks'}
            </button>
          </div>
          {contact.admin_remarks ? (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{contact.admin_remarks}</p>
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-yellow-800">No remarks added yet.</p>
            </div>
          )}
        </div>

        {/* Admin Actions */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Admin Actions</h3>
          <div className="flex flex-wrap gap-3">
            <select
              value={contact.status || 'Pending'}
              onChange={(e) => onUpdateStatus(e.target.value)}
              disabled={updateLoading}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Resolved">Resolved</option>
            </select>

            {!contact.responded_at && (
              <button
                onClick={onMarkAsResponded}
                disabled={updateLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <FaUserCheck size={14} />
                Mark as Responded
              </button>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Submission Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-sm font-medium text-gray-600">Submitted On</label>
              <p className="mt-1 text-gray-900">
                {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : 'Unknown date'}
              </p>
            </div>
            {contact.updatedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                <p className="mt-1 text-gray-900">
                  {new Date(contact.updatedAt).toLocaleString()}
                </p>
              </div>
            )}
            {contact.responded_at && (
              <div>
                <label className="block text-sm font-medium text-gray-600">Responded On</label>
                <p className="mt-1 text-gray-900">
                  {new Date(contact.responded_at).toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-600">Contact ID</label>
              <p className="mt-1 text-gray-900">#{contact.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Edit View Component
const ContactEditView = ({ contact, adminRemarks, setAdminRemarks, onSave, onCancel, updateLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaArrowLeft size={16} />
            Back to Details
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {contact.admin_remarks ? 'Edit Remarks' : 'Add Remarks'}
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Contact Info Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-2">Contact Summary</h3>
          <p className="text-gray-600 text-sm">
            <strong>From:</strong> {contact.name} ({contact.email})
          </p>
          <p className="text-gray-600 text-sm mt-1">
            <strong>Message:</strong> {contact.message?.substring(0, 100)}...
          </p>
        </div>

        {/* Remarks Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Admin Remarks
          </label>
          <textarea
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your remarks or response for this contact submission..."
          />
          <p className="text-sm text-gray-500 mt-1">
            These remarks will be stored for internal reference.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={updateLoading || !adminRemarks.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {updateLoading ? 'Saving...' : 'Save Remarks'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactManagement;