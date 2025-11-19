import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutService } from "../services/authService";
import SearchBar from "./SearchBar";
import feedbackService from "../services/feedbackService";
import {
  FaHome,
  FaFolderOpen,
  FaUsers,
  FaCalendarAlt,
  FaFileAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaCommentDots,
  FaStar,
  FaQuestionCircle,
  FaHistory,
  FaShieldAlt,
  FaUserCog,
  FaFileInvoiceDollar,
  FaChartLine,
  FaCrown
} from "react-icons/fa";

const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    message: "",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [validationErrors, setValidationErrors] = useState({});

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const feedbackModalRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // User info from local storage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userFullName = user.full_name || "John Doe";
  const userEmail = user.email || "user@example.com";
  const userImage = user.image || import.meta.env.VITE_DEFAULT_PROFILE_IMG;
  const userRole = user.role || "Admin";

  // Navbar gradient
  const navbarGradient = "from-green-700 to-green-500";

  // Check user roles for conditional rendering
  const isAdmin = userRole.toLowerCase() === 'admin';
  const isAdvocate = userRole.toLowerCase() === 'advocate';
  const isClient = userRole.toLowerCase() === 'client';
  const showBillingOptions = isAdmin || isAdvocate;

  // Sample notifications
  useEffect(() => {
    const sampleNotifications = [
      { id: 1, message: "New case assigned to you", time: "5 min ago", read: false, type: "case" },
      { id: 2, message: "Payment received for Case #123", time: "1 hour ago", read: false, type: "payment" },
      { id: 3, message: "Court date reminder: Tomorrow at 10 AM", time: "2 hours ago", read: true, type: "reminder" },
      { id: 4, message: "Document approved by client", time: "1 day ago", read: true, type: "document" }
    ];
    setNotifications(sampleNotifications);
  }, []);

  // Navigation items - Conditionally exclude "Clients" for client users
  const navItems = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/cases", label: "Cases", icon: FaFolderOpen },
    // Only show "Clients" if user is NOT a client
    ...(isClient ? [] : [{ path: "/clients", label: "Clients", icon: FaUsers }]),
    { path: "/calendar", label: "Calendar", icon: FaCalendarAlt },
    { path: "/documents", label: "Documents", icon: FaFileAlt },
  ];

  const handleLogout = async () => {
    try {
      await logoutService();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Enhanced feedback handlers with Joi validation matching
  const handleFeedbackClick = () => {
    setShowFeedbackModal(true);
    setOpenProfile(false);
    setOpenMobileMenu(false);
    setSubmitStatus({ type: '', message: '' });
    setValidationErrors({});
  };

  // Frontend validation that matches Joi schema
  const validateFeedback = (feedbackData) => {
    const errors = {};

    // Rating validation (1-5, required)
    if (!feedbackData.rating || feedbackData.rating < 1 || feedbackData.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    // Category validation (specific values, required)
    const validCategories = ['general', 'bug', 'feature', 'ui', 'performance'];
    if (!feedbackData.category || !validCategories.includes(feedbackData.category)) {
      errors.category = 'Please select a valid category';
    }

    // Message validation (10-2000 characters, required, trimmed)
    const trimmedMessage = feedbackData.message.trim();
    if (!trimmedMessage) {
      errors.message = 'Message is required';
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    } else if (trimmedMessage.length > 2000) {
      errors.message = 'Message must be less than 2000 characters';
    }

    return errors;
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors({});
    setSubmitStatus({ type: '', message: '' });

    // Frontend validation
    const validationErrors = validateFeedback(feedback);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload exactly as your backend expects
      const feedbackData = {
        rating: feedback.rating,
        category: feedback.category,
        message: feedback.message.trim()
      };

      // console.log('Sending feedback data:', feedbackData);

      const result = await feedbackService.submitFeedback(feedbackData);

      // console.log('Feedback API result:', result);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Thank you for your feedback! We appreciate your input.'
        });

        // Reset form and close modal after success
        setTimeout(() => {
          resetFeedbackForm();
        }, 2000);

      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to submit feedback. Please try again.'
        });
      }
    } catch (error) {
      console.error('Feedback submission error:', error);

      // Handle specific validation errors from backend
      if (error.message.includes('Rating must be') ||
        error.message.includes('Category must be') ||
        error.message.includes('Message must be')) {
        setValidationErrors({ backend: error.message });
      } else {
        setSubmitStatus({
          type: 'error',
          message: error.message || 'An unexpected error occurred. Please try again later.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFeedback(prev => ({ ...prev, rating }));
    // Clear rating error when user selects a rating
    if (validationErrors.rating) {
      setValidationErrors(prev => ({ ...prev, rating: '' }));
    }
    if (submitStatus.type === 'error') {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  const handleCategoryChange = (e) => {
    setFeedback(prev => ({ ...prev, category: e.target.value }));
    // Clear category error when user selects a category
    if (validationErrors.category) {
      setValidationErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleMessageChange = (e) => {
    const message = e.target.value;
    setFeedback(prev => ({ ...prev, message }));

    // Clear message error when user starts typing
    if (validationErrors.message && message.trim().length >= 10) {
      setValidationErrors(prev => ({ ...prev, message: '' }));
    }

    if (submitStatus.type === 'error') {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  const resetFeedbackForm = () => {
    setFeedback({
      rating: 0,
      message: "",
      category: "general"
    });
    setSubmitStatus({ type: '', message: '' });
    setValidationErrors({});
    setShowFeedbackModal(false);
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    const trimmedMessage = feedback.message.trim();
    return (
      feedback.rating >= 1 &&
      feedback.rating <= 5 &&
      ['general', 'bug', 'feature', 'ui', 'performance'].includes(feedback.category) &&
      trimmedMessage.length >= 10 &&
      trimmedMessage.length <= 2000
    );
  };

  // Calculate message status
  const getMessageStatus = () => {
    const trimmedLength = feedback.message.trim().length;
    if (trimmedLength === 0) return 'empty';
    if (trimmedLength < 10) return 'too-short';
    if (trimmedLength > 2000) return 'too-long';
    return 'valid';
  };

  const messageStatus = getMessageStatus();
  const trimmedMessageLength = feedback.message.trim().length;

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (feedbackModalRef.current && !feedbackModalRef.current.contains(event.target)) {
        setShowFeedbackModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpenMobileMenu(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`bg-gradient-to-r ${navbarGradient} text-white shadow-lg px-4 py-3 flex items-center justify-between relative z-50`}
      >
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
            className="lg:hidden p-2 rounded-lg hover:bg-green-600 transition-colors"
            aria-label="Toggle menu"
          >
            {openMobileMenu ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-700 font-bold text-lg">SJ</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold font-serif">Satyamev Jayate</h1>
              <p className="text-xs text-green-100">Justice Management System</p>
            </div>
          </Link>
        </div>

        {/* Center Section - Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Right Section - Navigation and Profile */}
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "bg-green-600 text-white shadow-inner"
                      : "text-green-100 hover:bg-green-600 hover:text-white"
                    }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-green-600 transition-colors"
              aria-label="Notifications"
            >
              <FaBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-xl z-50 border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-green-600 hover:text-green-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""
                          }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-200">
                  <Link
                    to="/notifications"
                    className="block text-center text-sm text-green-600 hover:text-green-800 font-medium py-2"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-green-600 transition-colors group"
              aria-label="User menu"
            >
              <img
                src={userImage}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-green-300 group-hover:border-green-200"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{userFullName}</p>
                <p className="text-xs text-green-200">{userRole}</p>
              </div>
              <FaChevronDown
                size={12}
                className={`text-green-200 transition-transform ${openProfile ? "rotate-180" : ""
                  }`}
              />
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-xl z-50 border border-gray-200">
                {/* User Info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={userImage}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border-2 border-green-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {userFullName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">{userEmail}</p>
                      <p className="text-xs text-green-600 font-medium">{userRole}</p>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="p-2">
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors mb-1"
                    onClick={() => setOpenProfile(false)}
                  >
                    <FaCog className="text-gray-500" size={16} />
                    <span>Settings</span>
                  </Link>
                </div>

                {/* Activity & Analytics - Only for Admin */}
                {isAdmin && (
                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => navigate('/activity-log')}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors mb-1"
                    >
                      <FaHistory size={16} />
                      <span>Activity Log</span>
                    </button>
                    <button
                      onClick={() => navigate('/analytics')}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mb-1"
                    >
                      <FaChartLine size={16} />
                      <span>Analytics</span>
                    </button>
                  </div>
                )}

                {/* Billing & Upgrade - Only for Admin and Advocate */}
                {showBillingOptions && (
                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => navigate('/billing')}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors mb-1"
                    >
                      <FaFileInvoiceDollar size={16} />
                      <span>Billing & Plans</span>
                    </button>
                    <button
                      onClick={() => navigate('/upgrade')}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors mb-1"
                    >
                      <FaCrown size={16} />
                      <span>Upgrade Plan</span>
                    </button>
                  </div>
                )}

                {/* Help & Support */}
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={handleFeedbackClick}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mb-1"
                  >
                    <FaCommentDots size={16} />
                    <span>Give Feedback</span>
                  </button>
                  <button
                    onClick={() => navigate('/support')}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mb-1"
                  >
                    <FaQuestionCircle size={16} />
                    <span>Help & Support</span>
                  </button>
                  <button
                    onClick={() => navigate('/privacy')}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mb-1"
                  >
                    <FaShieldAlt size={16} />
                    <span>Privacy & Security</span>
                  </button>
                </div>

                {/* Admin Panel - Only for Admin */}
                {isAdmin && (
                  <div className="p-2 border-t border-gray-200">
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => setOpenProfile(false)}
                    >
                      <FaUserCog size={16} />
                      <span>Admin Panel</span>
                    </Link>
                  </div>
                )}

                {/* Logout */}
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaSignOutAlt size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="lg:hidden bg-green-600 px-4 py-2 border-t border-green-500">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Mobile Menu */}
      {openMobileMenu && (
        <div className="lg:hidden bg-white shadow-lg border-t border-gray-200 z-40">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "bg-green-100 text-green-700 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => setOpenMobileMenu(false)}
                >
                  <Icon size={16} className={isActive ? "text-green-600" : "text-gray-500"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Menu Links */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setOpenMobileMenu(false)}
              >
                <FaCog className="text-gray-500" size={16} />
                <span>Settings</span>
              </Link>

              {/* Activity Log & Analytics - Only for Admin */}
              {isAdmin && (
                <>
                  <button
                    onClick={() => navigate('/activity-log')}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-purple-600 hover:bg-purple-50 rounded-lg"
                  >
                    <FaHistory size={16} />
                    <span>Activity Log</span>
                  </button>

                  <button
                    onClick={() => navigate('/analytics')}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FaChartLine size={16} />
                    <span>Analytics</span>
                  </button>
                </>
              )}

              {/* Billing & Upgrade - Only for Admin and Advocate */}
              {showBillingOptions && (
                <>
                  <button
                    onClick={() => navigate('/billing')}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <FaFileInvoiceDollar size={16} />
                    <span>Billing & Plans</span>
                  </button>

                  <button
                    onClick={() => navigate('/upgrade')}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg"
                  >
                    <FaCrown size={16} />
                    <span>Upgrade Plan</span>
                  </button>
                </>
              )}

              <button
                onClick={handleFeedbackClick}
                className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <FaCommentDots size={16} />
                <span>Give Feedback</span>
              </button>

              <button
                onClick={() => navigate('/support')}
                className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaQuestionCircle size={16} />
                <span>Help & Support</span>
              </button>

              {/* Admin Panel - Only for Admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  onClick={() => setOpenMobileMenu(false)}
                >
                  <FaUserCog size={16} />
                  <span>Admin Panel</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FaSignOutAlt size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {openMobileMenu && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setOpenMobileMenu(false)}
        />
      )}

      {/* Enhanced Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={feedbackModalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaCommentDots className="text-blue-600" />
                  Share Your Feedback
                </h2>
                <button
                  onClick={resetFeedbackForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Status Message */}
              {submitStatus.message && (
                <div className={`mb-4 p-3 rounded-lg ${submitStatus.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                  {submitStatus.message}
                </div>
              )}

              {/* Backend Validation Errors */}
              {validationErrors.backend && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                  {validationErrors.backend}
                </div>
              )}

              {/* Feedback Form */}
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How would you rate your experience? *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        disabled={isSubmitting}
                        className={`p-2 rounded-lg transition-all ${feedback.rating >= star
                            ? "bg-yellow-100 text-yellow-500 border-2 border-yellow-400"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200 border-2 border-transparent"
                          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <FaStar size={20} />
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                  {validationErrors.rating && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.rating}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={feedback.category}
                    onChange={handleCategoryChange}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.category ? 'border-red-300' : 'border-gray-300'
                      }`}
                  >
                    <option value="general">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="ui">User Interface</option>
                    <option value="performance">Performance</option>
                  </select>
                  {validationErrors.category && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.category}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback *
                  </label>
                  <textarea
                    value={feedback.message}
                    onChange={handleMessageChange}
                    placeholder="Please share your thoughts, suggestions, or issues (minimum 10 characters)..."
                    rows={4}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.message ? 'border-red-300' : 'border-gray-300'
                      }`}
                    required
                  />
                  <div className="text-xs mt-1 flex justify-between">
                    <span className={
                      messageStatus === 'valid' ? 'text-green-600' :
                        messageStatus === 'empty' ? 'text-gray-500' :
                          'text-red-500'
                    }>
                      {trimmedMessageLength}/2000 characters
                      {messageStatus === 'too-short' && ` (minimum 10 required)`}
                      {messageStatus === 'too-long' && ` (maximum 2000 exceeded)`}
                    </span>
                    {messageStatus === 'valid' && (
                      <span className="text-green-600">✓ Ready to submit</span>
                    )}
                  </div>
                  {validationErrors.message && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.message}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetFeedbackForm}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </div>
              </form>

              {/* Validation Requirements */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Validation Requirements:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Rating: 1-5 stars (required)</li>
                  <li>• Category: Must be selected (required)</li>
                  <li>• Message: 10-2000 characters (required)</li>
                </ul>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-gray-500 mt-4 text-center">
                Your feedback helps us improve the system for everyone.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;