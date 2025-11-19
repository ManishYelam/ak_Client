import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { FaPlus, FaCheck, FaTimes, FaArrowLeft, FaDownload, FaSearch, FaFilePdf, FaEdit, FaEye, FaPrint, FaTrash, FaEllipsisV } from "react-icons/fa";
import { FiTrash2, FiEdit, FiRefreshCcw, FiEye, FiPrinter, FiMoreVertical, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAllUser } from "../services/applicationService"; // Import your service

// Debounce utility for search
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Custom hook for debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Token validation utility
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const Clients = ({ 
  onDeleteClient, 
  onEditClient, 
  onView, 
  onPrint, 
  onMore, 
  onAddClient,
  userRole = "admin"
}) => {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({ 
    globalSearch: "", 
    status: "", 
    verified: "",
    regType: "",
    searchField: "",
    searchValue: ""
  });
  const [selectedclient_ids, setSelectedclient_ids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Delete confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientsToDelete, setCliientsToDelete] = useState([]);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState("");

  const navigate = useNavigate();
  const debouncedSearchRef = React.useRef();

  // Use debounce for global search
  const debouncedGlobalSearch = useDebounce(filters.globalSearch, 500);

  useEffect(() => {
    debouncedSearchRef.current = debounce((value) => {
      setFilters(prev => ({ ...prev, globalSearch: value }));
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 300);
  }, []);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Prepare request data for getAllUser API
      const requestData = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedGlobalSearch || '',
        searchFields: filters.searchField ? [filters.searchField] : [],
        // Apply filters - transform to match API expectations
        ...(filters.status && { status: filters.status.toLowerCase() }),
        ...(filters.verified && { isVerified: filters.verified }),
        ...(filters.regType && { reg_type: filters.regType }),
        role: 'client' // Only fetch clients, not admins
      };

      // Add field-specific search if applicable
      if (filters.searchField && filters.searchValue) {
        requestData.search = filters.searchValue;
        requestData.searchFields = [filters.searchField];
      }

      console.log('API Request:', requestData); // For debugging

      const response = await getAllUser(requestData);
      
      // Transform API response to match table format
      const transformedData = response.data.data.map(user => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone_number,
        address: user.address,
        company: user.occupation || 'N/A',
        createdAt: user.createdAt,
        status: user.status === 'active' ? 'Active' : 'Inactive',
        verified: user.isVerified,
        regType: user.reg_type || 'Manual',
        clientSince: user.createdAt,
        lastActive: user.last_login_at || user.createdAt,
        totalCases: 0, // You might need to calculate this from another API
        activeCases: 0, // You might need to calculate this from another API
        // Include additional fields that might be useful
        role: user.role,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        age: user.age,
        adharNumber: user.adhar_number,
        isVerified: user.isVerified,
        lastLoginAt: user.last_login_at
      }));

      setClients(transformedData);
      setTotalRecords(response.totalRecords || response.total || transformedData.length);

    } catch (err) {
      setError(`Failed to fetch clients: ${err.message}`);
      console.error('API Error:', err);
      
      // Fallback to mock data if API fails (optional)
      const fallbackData = [
        { 
          id: 1, 
          name: "John Doe", 
          email: "john@example.com", 
          phone: "+1 (555) 123-4567", 
          address: "123 Main Street, New York, NY 10001", 
          company: "ABC Corp", 
          createdAt: "2025-01-15T10:30:00Z", 
          status: "Active", 
          verified: true,
          regType: "Manual",
          clientSince: "2024-01-15",
          lastActive: "2025-01-10",
          totalCases: 5,
          activeCases: 2
        }
      ];
      setClients(fallbackData);
      setTotalRecords(fallbackData.length);
    } finally {
      setLoading(false);
    }
  }, [debouncedGlobalSearch, filters, pagination]);

  useEffect(() => { 
    fetchClients(); 
  }, [fetchClients]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "globalSearch") {
      debouncedSearchRef.current(value);
    } else if (name === "searchField") {
      setFilters(prev => ({ 
        ...prev, 
        searchField: value,
        searchValue: "" // Reset search value when field changes
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesGlobalSearch = !filters.globalSearch || 
        Object.values(client).some(val => 
          val?.toString().toLowerCase().includes(filters.globalSearch.toLowerCase())
        );
      const matchesStatus = !filters.status || client.status === filters.status;
      const matchesVerified = filters.verified === "" || 
        (filters.verified === "true" && client.verified) || 
        (filters.verified === "false" && !client.verified);
      const matchesRegType = !filters.regType || client.regType === filters.regType;
      const matchesFieldSearch = !filters.searchField || !filters.searchValue ||
        client[filters.searchField]?.toString().toLowerCase().includes(filters.searchValue.toLowerCase());

      return matchesGlobalSearch && matchesStatus && matchesVerified && matchesRegType && matchesFieldSearch;
    });
  }, [clients, filters]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedclient_ids(filteredClients.map(c => c.id));
    } else {
      setSelectedclient_ids([]);
    }
  };

  const toggleSelectOne = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedclient_ids(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  // ✅ Ultra-fast Delete Confirmation
  const showDeleteConfirmation = useCallback((clientIds) => {
    if (!clientIds || clientIds.length === 0) {
      setError("No clients selected for deletion");
      return;
    }

    setCliientsToDelete(clientIds);
    setDeleteConfirmMessage(
      clientIds.length === 1
        ? `Are you sure you want to delete client #${clientIds[0]}? This action cannot be undone.`
        : `Are you sure you want to delete ${clientIds.length} selected clients? This action cannot be undone.`
    );
    setShowDeleteConfirm(true);
  }, []);

  // ✅ Ultra-optimized DELETE CLIENT
  const handleDeleteClient = useCallback(async () => {
    setDeleteLoading(true);
    setError(null);

    try {
      const user = localStorage.getItem("user");
      if (!user) throw new Error("User not logged in");

      const parsedUser = JSON.parse(user);
      const token = parsedUser?.token;

      if (!token || isTokenExpired(token)) {
        throw new Error("Token expired. Please login again.");
      }

      // Direct parallel deletion
      await Promise.all(clientsToDelete.map(id => onDeleteClient?.(id)));

      // Direct state updates
      setShowDeleteConfirm(false);
      setCliientsToDelete([]);
      await fetchClients();
      setSelectedclient_ids([]);
      setSelectedRowId(null);

      setError(clientsToDelete.length === 1
        ? `Client #${clientsToDelete[0]} deleted successfully`
        : `${clientsToDelete.length} clients deleted successfully`
      );

    } catch (err) {
      setError(`Failed to delete clients: ${err.message}`);
      setShowDeleteConfirm(false);
      setCliientsToDelete([]);
    } finally {
      setDeleteLoading(false);
    }
  }, [clientsToDelete, fetchClients, onDeleteClient]);

  // ✅ Ultra-fast Single Client Delete
  const handleDeleteSingleClient = useCallback((client, e) => {
    e.stopPropagation();
    showDeleteConfirmation([client.id]);
  }, [showDeleteConfirmation]);

  // ✅ Fast Cancel Delete
  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setCliientsToDelete([]);
    setDeleteConfirmMessage("");
  }, []);

  const handleBulkAction = () => {
    if (bulkAction && selectedclient_ids.length > 0) {
      switch (bulkAction) {
        case "delete":
          showDeleteConfirmation(selectedclient_ids);
          break;
        case "export":
          handleExport();
          break;
        default:
          break;
      }
      setBulkAction("");
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const csvHeaders = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Registration Type', 'Status', 'Verified', 'Client Since', 'Total Cases', 'Active Cases'].join(',');
      const csvRows = filteredClients.map(client => [
        client.id,
        `"${client.name}"`,
        client.email,
        client.phone,
        `"${client.company}"`,
        client.regType,
        client.status,
        client.verified ? 'Yes' : 'No',
        client.clientSince ? new Date(client.clientSince).toLocaleDateString() : '-',
        client.totalCases || 0,
        client.activeCases || 0
      ].join(','));
      const csvContent = [csvHeaders, ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `clients-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(`Export failed: ${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({ globalSearch: "", status: "", verified: "", regType: "", searchField: "", searchValue: "" });
    setPagination({ page: 1, limit: 10 });
    setSelectedclient_ids([]);
    setSelectedRowId(null);
  };

  // ✅ Ultra-fast Row Click Handler
  const handleRowClick = useCallback((clientId, e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.closest('button') || e.target.closest('input')) {
      return;
    }
    setSelectedRowId(clientId === selectedRowId ? null : clientId);
  }, [selectedRowId]);

  // ✅ Ultra-fast Row Background Color
  const getRowBackgroundColor = useCallback((clientId) => 
    clientId === selectedRowId ? 'bg-blue-200 border-l-4 border-blue-500' : 'bg-white hover:bg-pink-100',
  [selectedRowId]);

  // ✅ Ultra-optimized Pagination Calculations
  const paginationInfo = useMemo(() => ({
    totalPages: Math.ceil(totalRecords / pagination.limit),
    startIndex: (pagination.page - 1) * pagination.limit + 1,
    endIndex: Math.min(pagination.page * pagination.limit, totalRecords)
  }), [pagination, totalRecords]);

  const getPageNumbers = useCallback(() => {
    const delta = 2;
    const range = [];
    const { totalPages } = paginationInfo;

    for (let i = Math.max(1, pagination.page - delta); i <= Math.min(totalPages, pagination.page + delta); i++) {
      range.push(i);
    }

    if (range[0] > 2) range.unshift("...");
    if (range[0] !== 1) range.unshift(1);
    if (range[range.length - 1] < totalPages - 1) range.push("...");
    if (range[range.length - 1] !== totalPages) range.push(totalPages);

    return range;
  }, [paginationInfo, pagination.page]);

  // ✅ ULTRA-FAST Action Button Handler
  const handleActionButtonClick = useCallback((action, client, e) => {
    e.stopPropagation();
    
    // Direct if-else chain - Fastest execution
    if (action === 'view') onView?.(client);
    else if (action === 'edit') onEditClient?.(client);
    else if (action === 'print') onPrint?.(client);
    else if (action === 'delete') handleDeleteSingleClient(client, e);
    else if (action === 'more') onMore?.(client);
  }, [onView, onEditClient, onPrint, onMore, handleDeleteSingleClient]);

  const canEditDelete = userRole === "admin";
  const canAddClients = userRole === "admin" || userRole === "advocate";

  // Search field options matching API field names
  const searchFieldOptions = [
    { value: "full_name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "occupation", label: "Company" },
    { value: "phone_number", label: "Phone" },
    { value: "reg_type", label: "Registration Type" },
    { value: "adhar_number", label: "Aadhar Number" }
  ];

  return (
    <DashboardLayout>
      <div className="m-3 min-h-screen bg-gray-50 rounded-lg p-3">
        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleDeleteClient}
          title="Confirm Deletion"
          message={deleteConfirmMessage}
          confirmText={deleteLoading ? "Deleting..." : "Delete"}
          cancelText="Cancel"
        />

        {/* Header - Compact */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600"
              title="Go back"
            >
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Clients</h1>
              <p className="text-gray-600 text-xs">
                Manage client relationships - Connected to API
              </p>
            </div>
          </div>
          
          {canAddClients && (
            <button
              onClick={onAddClient}
              className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors duration-200 flex items-center gap-1 font-medium"
            >
              <FiUserPlus size={12} />
              Add Client
            </button>
          )}
        </div>

        {/* Stats Overview - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="bg-white p-2 rounded shadow-sm border text-center">
            <div className="text-lg font-bold text-gray-800">{totalRecords}</div>
            <div className="text-gray-600 text-xs">Total</div>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border text-center">
            <div className="text-lg font-bold text-green-600">
              {clients.filter(c => c.status === "Active").length}
            </div>
            <div className="text-gray-600 text-xs">Active</div>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border text-center">
            <div className="text-lg font-bold text-blue-600">
              {clients.filter(c => c.regType === "Manual").length}
            </div>
            <div className="text-gray-600 text-xs">Manual</div>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border text-center">
            <div className="text-lg font-bold text-purple-600">
              {clients.filter(c => c.regType === "Reg_Link").length}
            </div>
            <div className="text-gray-600 text-xs">Reg Link</div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`px-3 py-2 rounded mb-3 ${error.includes('successfully') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`} role="alert">
            {error}
          </div>
        )}

        {/* Loading State */}
        {(loading || deleteLoading) && (
          <div className="flex items-center justify-center py-4" aria-live="polite">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="ml-2">{deleteLoading ? "Deleting clients..." : "Loading clients..."}</span>
          </div>
        )}

        {/* Filters and Actions - Left & Right Aligned */}
        <div className="bg-white p-3 rounded shadow-sm border mb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Filters - Left Side */}
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Global Search */}
              <div className="relative">
                <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                <input
                  type="text"
                  name="globalSearch"
                  value={filters.globalSearch}
                  onChange={handleFilterChange}
                  placeholder="Search clients..."
                  className="pl-8 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-48"
                />
              </div>

              {/* Field Search */}
              <select
                name="searchField"
                value={filters.searchField}
                onChange={handleFilterChange}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-32"
              >
                <option value="">Search Field</option>
                {searchFieldOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="searchValue"
                value={filters.searchValue}
                onChange={handleFilterChange}
                placeholder="Search value..."
                disabled={!filters.searchField}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-32 disabled:bg-gray-100"
              />

              {/* Status & Verified & Reg Type */}
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-28"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                name="verified"
                value={filters.verified}
                onChange={handleFilterChange}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-32"
              >
                <option value="">All Clients</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>

              <select
                name="regType"
                value={filters.regType}
                onChange={handleFilterChange}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-32"
              >
                <option value="">All Types</option>
                <option value="Manual">Manual</option>
                <option value="Reg_Link">Reg Link</option>
              </select>

              {/* Bulk Actions */}
              {canEditDelete && selectedclient_ids.length > 0 && (
                <div className="flex items-center gap-1">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-28"
                  >
                    <option value="">Bulk Actions</option>
                    <option value="delete">Delete</option>
                    <option value="export">Export</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="px-2 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Apply
                  </button>
                  <span className="text-xs text-gray-600 ml-1">
                    ({selectedclient_ids.length})
                  </span>
                </div>
              )}
            </div>

            {/* Actions - Right Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors duration-200 flex items-center gap-1"
              >
                <FiRefreshCcw size={12} />
                Reset
              </button>

              <button
                onClick={handleExport}
                disabled={exportLoading || filteredClients.length === 0}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 flex items-center gap-1"
              >
                {exportLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                ) : (
                  <FaDownload size={12} />
                )}
                Export
              </button>

              {/* Delete Selected - Only show for admin */}
              {canEditDelete && (
                <button
                  onClick={() => showDeleteConfirmation(selectedclient_ids)}
                  disabled={selectedclient_ids.length === 0 || deleteLoading}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 transition-colors duration-200 flex items-center gap-1"
                >
                  {deleteLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <FiTrash2 size={12} />
                  )}
                  {selectedclient_ids.length > 0 && `(${selectedclient_ids.length})`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table - Compact */}
        <div className="bg-white rounded shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-green-700 text-white">
                <tr>
                  {canEditDelete && (
                    <th className="px-2 py-2 text-left w-8">
                      <input
                        type="checkbox"
                        checked={selectedclient_ids.length === filteredClients.length && filteredClients.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 scale-90"
                      />
                    </th>
                  )}
                  <th className="px-2 py-2 text-left">Client</th>
                  <th className="px-2 py-2 text-left">Contact</th>
                  <th className="px-2 py-2 text-center">Cases</th>
                  <th className="px-2 py-2 text-center">Reg Type</th>
                  <th className="px-2 py-2 text-center">Status</th>
                  <th className="px-2 py-2 text-center">Verified</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={canEditDelete ? 8 : 7} className="px-2 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        <span className="text-gray-600 text-xs">Loading clients...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={canEditDelete ? 8 : 7} className="px-2 py-6 text-center">
                      <div className="text-gray-400 text-2xl mb-1">👥</div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No clients found</h3>
                      <p className="text-gray-500 text-xs">
                        {Object.values(filters).some(f => f) 
                          ? "Adjust filters to see results" 
                          : "Add your first client"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr 
                      key={client.id} 
                      className={`cursor-pointer transition-all duration-200 ${getRowBackgroundColor(client.id)}`}
                      onClick={(e) => handleRowClick(client.id, e)}
                    >
                      {canEditDelete && (
                        <td className="px-2 py-2">
                          <input
                            type="checkbox"
                            checked={selectedclient_ids.includes(client.id)}
                            onChange={(e) => toggleSelectOne(client.id, e)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500 scale-90"
                          />
                        </td>
                      )}
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-800 font-semibold text-xs">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 text-xs truncate">{client.name}</div>
                            <div className="text-gray-500 text-xs truncate">{client.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="space-y-0.5">
                          <div className="text-gray-900 text-xs truncate">{client.email}</div>
                          <div className="text-gray-600 text-xs">{client.phone}</div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <div>
                          <div className="text-sm font-bold text-gray-900">{client.totalCases || 0}</div>
                          <div className="text-xs">
                            <span className={`px-1.5 py-0.5 rounded-full ${
                              (client.activeCases || 0) > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {client.activeCases || 0}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          client.regType === 'Manual' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {client.regType}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          client.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center">
                        {client.verified ? (
                          <FaCheck className="text-green-600 mx-auto" size={12} />
                        ) : (
                          <FaTimes className="text-red-600 mx-auto" size={12} />
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={(e) => handleActionButtonClick('view', client, e)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                            title="View"
                          >
                            <FaEye size={12} />
                          </button>
                          {canEditDelete && (
                            <button
                              onClick={(e) => handleActionButtonClick('edit', client, e)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                              title="Edit"
                            >
                              <FaEdit size={12} />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleActionButtonClick('print', client, e)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                            title="Print"
                          >
                            <FaPrint size={12} />
                          </button>
                          {canEditDelete && (
                            <button
                              onClick={(e) => handleActionButtonClick('delete', client, e)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                              title="Delete"
                              disabled={deleteLoading}
                            >
                              <FaTrash size={12} />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleActionButtonClick('more', client, e)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                            title="More"
                          >
                            <FaEllipsisV size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Same as CaseTable */}
        {filteredClients.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2 text-xs">
            <div>
              Showing{" "}
              <span className="font-medium">{paginationInfo.startIndex}</span>{" "}
              to{" "}
              <span className="font-medium">{paginationInfo.endIndex}</span>{" "}
              of <span className="font-medium">{totalRecords}</span> clients
            </div>

            <div className="flex items-center gap-1 flex-wrap">
              <div className="flex items-center gap-1 ml-2">
                <span>Show</span>
                <select
                  value={pagination.limit}
                  onChange={(e) =>
                    setPagination((prev) => ({
                      ...prev,
                      limit: parseInt(e.target.value),
                      page: 1,
                    }))
                  }
                  className="px-2 py-1 border rounded text-xs focus:outline-none focus:border-green-500"
                  aria-label="Items per page"
                >
                  {[5, 10, 20, 50].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <span>per page</span>
              </div>

              <button
                onClick={() => setPagination({ ...pagination, page: 1 })}
                disabled={pagination.page === 1}
                className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Go to first page"
              >
                First
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Go to previous page"
              >
                Prev
              </button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2 py-1 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => setPagination({ ...pagination, page: p })}
                    className={`px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${pagination.page === p
                      ? "bg-green-800 text-white"
                      : "bg-white border border-gray-300 hover:bg-green-100"
                      }`}
                    aria-label={`Go to page ${p}`}
                    aria-current={pagination.page === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === paginationInfo.totalPages}
                className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Go to next page"
              >
                Next
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: paginationInfo.totalPages })}
                disabled={pagination.page === paginationInfo.totalPages}
                className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Go to last page"
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* Compact Help Section */}
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2 text-xs">
          <h3 className="font-semibold text-blue-800 mb-1">💡 Quick Tips</h3>
          <ul className="text-blue-700 space-y-0.5 list-disc list-inside">
            <li>Use search and filters to find clients</li>
            <li>Select multiple clients for bulk actions</li>
            <li>Filter by Registration Type: Manual or Reg Link</li>
            {canAddClients && <li>Add new clients with the Add Client button</li>}
            <li>Click anywhere on a row to <span className="font-medium text-blue-700">highlight and select</span> it.</li>
            <li>Use the <span className="font-medium text-green-700">Export button</span> to download clients as CSV.</li>
            {canEditDelete && (
              <>
                <li>Select multiple clients using checkboxes for bulk actions.</li>
                <li>Use the <span className="font-medium text-red-700">Delete button</span> to remove individual clients or bulk delete selected clients.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clients;