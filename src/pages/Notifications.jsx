// pages/NotificationsPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaFileAlt,
  FaMoneyBillWave,
  FaClock,
  FaSearch
} from 'react-icons/fa';
import { useNotifications, NOTIFICATION_TYPES } from '../context/NotificationsContext';

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = [
    { key: 'all', label: 'All Notifications', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: NOTIFICATION_TYPES.CASE_UPDATE, label: 'Case Updates', count: notifications.filter(n => n.type === NOTIFICATION_TYPES.CASE_UPDATE).length },
    { key: NOTIFICATION_TYPES.PAYMENT, label: 'Payments', count: notifications.filter(n => n.type === NOTIFICATION_TYPES.PAYMENT).length },
    { key: NOTIFICATION_TYPES.DOCUMENT, label: 'Documents', count: notifications.filter(n => n.type === NOTIFICATION_TYPES.DOCUMENT).length },
    { key: NOTIFICATION_TYPES.REMINDER, label: 'Reminders', count: notifications.filter(n => n.type === NOTIFICATION_TYPES.REMINDER).length }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <FaCheckCircle className="text-green-500 text-lg" />;
      case NOTIFICATION_TYPES.ERROR:
        return <FaExclamationTriangle className="text-red-500 text-lg" />;
      case NOTIFICATION_TYPES.WARNING:
        return <FaExclamationTriangle className="text-yellow-500 text-lg" />;
      case NOTIFICATION_TYPES.CASE_UPDATE:
        return <FaFileAlt className="text-blue-500 text-lg" />;
      case NOTIFICATION_TYPES.PAYMENT:
        return <FaMoneyBillWave className="text-green-500 text-lg" />;
      case NOTIFICATION_TYPES.DOCUMENT:
        return <FaFileAlt className="text-purple-500 text-lg" />;
      case NOTIFICATION_TYPES.REMINDER:
        return <FaClock className="text-orange-500 text-lg" />;
      default:
        return <FaInfoCircle className="text-gray-500 text-lg" />;
    }
  };

  const getNotificationClass = (type, read) => {
    const baseClass = 'p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md';
    const readClass = read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-500';
    
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return `${baseClass} ${readClass} hover:bg-green-50`;
      case NOTIFICATION_TYPES.ERROR:
        return `${baseClass} ${readClass} hover:bg-red-50`;
      case NOTIFICATION_TYPES.WARNING:
        return `${baseClass} ${readClass} hover:bg-yellow-50`;
      case NOTIFICATION_TYPES.CASE_UPDATE:
        return `${baseClass} ${readClass} hover:bg-blue-50`;
      case NOTIFICATION_TYPES.PAYMENT:
        return `${baseClass} ${readClass} hover:bg-green-50`;
      case NOTIFICATION_TYPES.DOCUMENT:
        return `${baseClass} ${readClass} hover:bg-purple-50`;
      case NOTIFICATION_TYPES.REMINDER:
        return `${baseClass} ${readClass} hover:bg-orange-50`;
      default:
        return `${baseClass} ${readClass} hover:bg-gray-50`;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         notification.type === filter;
    
    const matchesSearch = searchTerm === '' ||
                         notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const markAllAsRead = () => {
    markAsRead('all');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FaBell className="text-blue-600 text-2xl" />
                </div>
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-2">
                Stay updated with your legal practice activities
              </p>
            </div>
            
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaCheck className="text-sm" />
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FaTrash className="text-sm" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Label */}
            <div className="flex items-center gap-2 text-gray-700">
              <FaFilter className="text-gray-400" />
              <span className="font-medium">Filter by:</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.map((filterItem) => (
              <button
                key={filterItem.key}
                onClick={() => setFilter(filterItem.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterItem.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterItem.label}
                <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                  {filterItem.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'You\'re all caught up with notifications!'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={getNotificationClass(notification.type, notification.read)}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${
                        notification.read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      {notification.message}
                    </p>
                    
                    {notification.link && (
                      <div className="flex items-center gap-4 text-sm">
                        <Link
                          to={notification.link}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => markAsRead(notification.id)}
                        >
                          View details →
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Mark as read"
                      >
                        <FaCheck className="text-sm" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete notification"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More (if needed) */}
        {filteredNotifications.length > 0 && notifications.length > filteredNotifications.length && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Load more notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;