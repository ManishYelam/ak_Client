import { toast } from "react-toastify";

// Custom toast configurations
const TOAST_CONFIG = {
  success: {
    icon: "✅",
    className: "!bg-green-50 !text-green-800 border-l-4 border-l-green-500",
  },
  error: {
    icon: "❌", 
    className: "!bg-red-50 !text-red-800 border-l-4 border-l-red-500",
  },
  warning: {
    icon: "⚠️",
    className: "!bg-yellow-50 !text-yellow-800 border-l-4 border-l-yellow-500",
  },
  info: {
    icon: "ℹ️",
    className: "!bg-blue-50 !text-blue-800 border-l-4 border-l-blue-500",
  },
  default: {
    icon: "💡",
    className: "!bg-gray-50 !text-gray-800 border-l-4 border-l-gray-500",
  },
};

// Enhanced success toast with modern features
export const showSuccessToast = (message, options = {}) => {
  toast.success(message, {
    icon: TOAST_CONFIG.success.icon,
    className: TOAST_CONFIG.success.className,
    progressClassName: '!bg-green-500',
    ...options,
  });
};

// Enhanced error toast with modern features
export const showErrorToast = (message, options = {}) => {
  toast.error(message, {
    icon: TOAST_CONFIG.error.icon,
    className: TOAST_CONFIG.error.className,
    progressClassName: '!bg-red-500',
    autoClose: options.autoClose || 6000, // Longer display for errors
    ...options,
  });
};

// Enhanced info toast with modern features
export const showInfoToast = (message, options = {}) => {
  toast.info(message, {
    icon: TOAST_CONFIG.info.icon,
    className: TOAST_CONFIG.info.className,
    progressClassName: '!bg-blue-500',
    ...options,
  });
};

// Enhanced warning toast with modern features
export const showWarningToast = (message, options = {}) => {
  toast.warning(message, {
    icon: TOAST_CONFIG.warning.icon,
    className: TOAST_CONFIG.warning.className,
    progressClassName: '!bg-yellow-500',
    ...options,
  });
};

// Enhanced default toast with modern features
export const showDefaultToast = (message, options = {}) => {
  toast(message, {
    icon: TOAST_CONFIG.default.icon,
    className: TOAST_CONFIG.default.className,
    progressClassName: '!bg-gray-500',
    ...options,
  });
};

// New: Promise-based toast for async operations
export const showPromiseToast = (promise, {
  pending = 'Processing...',
  success = 'Operation completed successfully!',
  error = 'Something went wrong!'
}) => {
  return toast.promise(promise, {
    pending: {
      render: pending,
      className: TOAST_CONFIG.info.className,
      progressClassName: '!bg-blue-500',
    },
    success: {
      render: success,
      className: TOAST_CONFIG.success.className,
      progressClassName: '!bg-green-500',
      autoClose: 3000,
    },
    error: {
      render: error,
      className: TOAST_CONFIG.error.className,
      progressClassName: '!bg-red-500',
      autoClose: 5000,
    },
  });
};

// New: Loading toast with manual control
export const showLoadingToast = (message = 'Loading...') => {
  return toast.loading(message, {
    className: '!bg-purple-50 !text-purple-800 border-l-4 border-l-purple-500',
    progressClassName: '!bg-purple-500',
  });
};

// New: Update existing toast (useful for loading states)
export const updateToast = (toastId, options) => {
  toast.update(toastId, options);
};

// New: Dismiss specific toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// New: Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// New: Position-based toasts for different scenarios
export const showTopCenterSuccess = (message) => {
  toast.success(message, {
    position: "top-center",
    className: TOAST_CONFIG.success.className,
    progressClassName: '!bg-green-500',
  });
};

export const showBottomRightError = (message) => {
  toast.error(message, {
    position: "bottom-right", 
    className: TOAST_CONFIG.error.className,
    progressClassName: '!bg-red-500',
  });
};