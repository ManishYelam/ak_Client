// contexts/NotificationsContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const NotificationsContext = createContext();

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  CASE_UPDATE: 'case_update',
  PAYMENT: 'payment',
  DOCUMENT: 'document',
  REMINDER: 'reminder'
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  showDropdown: false
};

// Reducer
const notificationsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotification = {
        id: Date.now() + Math.random(),
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        timestamp: new Date(),
        read: false,
        link: action.payload.link,
        priority: action.payload.priority || 'normal'
      };
      
      return {
        ...state,
        notifications: [newNotification, ...state.notifications].slice(0, 100), // Keep last 100
        unreadCount: state.unreadCount + 1
      };

    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(notification =>
        action.payload.id === 'all' || notification.id === action.payload.id
          ? { ...notification, read: true }
          : notification
      );
      
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: action.payload.id === 'all' ? 0 : Math.max(0, state.unreadCount - 1)
      };

    case 'DELETE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(
        notification => notification.id !== action.payload.id
      );
      
      const wasUnread = state.notifications.find(n => n.id === action.payload.id)?.read === false;
      
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };

    case 'TOGGLE_DROPDOWN':
      return {
        ...state,
        showDropdown: action.payload
      };

    case 'LOAD_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload.notifications,
        unreadCount: action.payload.unreadCount
      };

    default:
      return state;
  }
};

// Provider Component
export const NotificationsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationsReducer, initialState);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('legal-notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        const unreadCount = parsed.filter(n => !n.read).length;
        dispatch({
          type: 'LOAD_NOTIFICATIONS',
          payload: {
            notifications: parsed,
            unreadCount
          }
        });
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('legal-notifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  // Auto-mark as read when dropdown is closed
  useEffect(() => {
    if (!state.showDropdown && state.unreadCount > 0) {
      // Auto-mark as read after 5 seconds of closing dropdown
      const timer = setTimeout(() => {
        dispatch({ type: 'MARK_AS_READ', payload: { id: 'all' } });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state.showDropdown, state.unreadCount]);

  const addNotification = (notification) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: notification
    });

    // Show browser notification if permitted and important
    if (Notification.permission === 'granted' && notification.priority === 'high') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/lawyer-icon.png'
      });
    }
  };

  const markAsRead = (id) => {
    dispatch({ type: 'MARK_AS_READ', payload: { id } });
  };

  const deleteNotification = (id) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: { id } });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  const toggleDropdown = (show) => {
    dispatch({ type: 'TOGGLE_DROPDOWN', payload: show });
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const value = {
    ...state,
    addNotification,
    markAsRead,
    deleteNotification,
    clearAll,
    toggleDropdown,
    requestNotificationPermission
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Hook
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};