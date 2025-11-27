import api from './axiosInstance'

export const authAPI = {
  login: credentials => api.post('/auth/login', credentials),
  register: userData => api.post('/auth/register', userData),
  getProfile: id => api.get(`/users/${id}`),
  updateProfile: (userId, profileData) => api.put(`/users/${userId}`, profileData),
  changePassword: passwordData => api.post('/auth/change-password', passwordData),
  forgetPassword: email => api.post(`/auth/forget-password`, { email }),
  otpChangePasswordService: (email, data) => api.post(`/auth/change-password-otp/${email}`, data),
  refreshToken: () => api.post('/auth/refresh-token'),
  logout: () => api.post('/auth/logout'),
}

export const userAPI = {
  getAllUsers: data => api.post('/users/v2', data),
  getUserById: userId => api.get(`/users/${userId}`),
  createUser: userData => api.post('/users', userData),
  updateUser: (userId, profileData) => api.put(`/users/${userId}`, profileData),
  deleteUser: userId => api.delete(`/users/${userId}`),
  updateUserStatus: (userId, status) => api.patch(`/users/${userId}/status`, { status }),
  getUserStats: () => api.get('/users/stats'),
  getUserEnrollments: userId => api.get(`/users/${userId}/enrollments`),
  searchUsers: (query, params = {}) =>
    api.get('/users/search', { params: { q: query, ...params } }),
  getUsersByRole: (role, params = {}) => api.get(`/users/role/${role}`, { params }),
  exportUsers: (params = {}) =>
    api.get('/users/export', {
      params,
      responseType: 'blob',
    }),
}

export const coursesAPI = {
  getAll: data => api.post('/courses', data),
  getFeatured: () => api.get('/courses/featured'),
  getBySlug: slug => api.get(`/courses/slug/${slug}`),
  getById: id => api.get(`/courses/${id}`),
  create: courseData => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: id => api.delete(`/courses/${id}`),
  updateCourseStatus: (id, status) => api.patch(`/courses/${id}/status`, { status }),
  getCourseEnrollments: courseId => api.get(`/courses/${courseId}/enrollments`),
  getCoursePerformance: courseId => api.get(`/courses/${courseId}/performance`),
  getCourseStats: () => api.get('/courses/stats'),
  searchCourses: (query, params = {}) =>
    api.get('/courses/search', { params: { q: query, ...params } }),
  exportCourses: (params = {}) =>
    api.get('/courses/export', {
      params,
      responseType: 'blob',
    }),
}

export const paymentsAPI = {
  createRazorpayOrder: orderData => api.post('/payments/create-order', orderData),
  verifyPayment: paymentData => api.post('/payments/verify-payment', paymentData),
  getHistory: (params = {}) => api.get('/payments/history', { params }),
  getUserPayments: (params = {}) => api.get('/payments/user-payments', { params }),
  getAllUserPayments: data => api.post('/payments/all-user-payments', data),
  checkEnrollment: courseId => api.get(`/payments/check-enrollment/${courseId}`),
  getUserEnrollments: (params = {}) => api.get('/payments/user-enrollments', { params }),
  getPaymentDetails: paymentId => api.get(`/payments/payment-details/${paymentId}`),
  getPaymentMethods: () => api.get('/payments/payment-methods'),
  refundPayment: (paymentId, refundData) => api.post(`/payments/${paymentId}/refund`, refundData),
  getRevenueStats: (params = {}) => api.get('/payments/revenue/stats', { params }),
  getTransactionReport: (params = {}) => api.get('/payments/transactions/report', { params }),
  exportPayments: (params = {}) =>
    api.get('/payments/export', {
      params,
      responseType: 'blob',
    }),
  getDailyRevenue: (params = {}) => api.get('/payments/revenue/daily', { params }),
  getMonthlyRevenue: (params = {}) => api.get('/payments/revenue/monthly', { params }),
}

export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getMyCourses: (params = {}) => api.get('/student/courses', { params }),
  getCourseProgress: courseId => api.get(`/student/courses/${courseId}/progress`),
  updateProgress: (courseId, data) => api.put(`/student/courses/${courseId}/progress`, data),
  getCertificates: () => api.get('/student/certificates'),
  getLearningStats: () => api.get('/student/learning-stats'),
  enrollCourse: courseId => api.post(`/student/courses/${courseId}/enroll`),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: (params = {}) => api.get('/admin/students', { params }),
  getStudentDetail: id => api.get(`/admin/students/${id}`),
  updateStudentStatus: (id, data) => api.put(`/admin/students/${id}/status`, data),
  getFinancialReports: (params = {}) => api.get('/admin/reports/financial', { params }),
  getSystemStats: () => api.get('/admin/system-stats'),
  getActiveUsers: (params = {}) => api.get('/admin/active-users', { params }),
  getRevenueOverview: (params = {}) => api.get('/admin/revenue/overview', { params }),
}

export const contactAPI = {
  submitContact: data => api.post('/contact/', data),
  getContacts: (params = {}) => api.get('/contact/', { params }),
  getContactById: id => api.get(`/contact/${id}`),
  deleteContact: id => api.delete(`/contact/${id}`),
  updateStatus: (id, data) => api.put(`/contact/${id}/status`, data),
  updateRemarks: (id, data) => api.put(`/contact/${id}/remarks`, data),
  getStats: () => api.get('/contact/stats'),
  searchContacts: (query, params = {}) =>
    api.get('/contact/search', { params: { q: query, ...params } }),
  getContactsByStatus: (status, params = {}) => api.get(`/contact/status/${status}`, { params }),
  exportContacts: (params = {}) =>
    api.get('/contact/export', {
      params,
      responseType: 'blob',
    }),
  getInquiryAnalysis: (params = {}) => api.get('/contact/analysis/inquiries', { params }),
  getContactTrends: (params = {}) => api.get('/contact/analysis/trends', { params }),
}

export const applicationAPI = {
  createOrUpdateProperty: data => api.post('/application/property', data),
  createOrUpdateBulkProperties: data => api.post('/application/properties/bulk', data),
  getAllProperties: data => api.post('/application/properties', data),
  getPropertyById: id => api.get(`/application/property/${id}`),
  deleteProperty: app_prop_id => api.delete(`/application/property/${app_prop_id}`),
  activeAppProperty: (property_name, app_prop_id) =>
    api.put(`/application/property/${property_name}/${app_prop_id}`),
}

export const genericAPI = {
  createOrUpdateLOV: data => api.post('/generics/lov', data),
  getAllLOVs: data => api.post('/generics/lov/all', data),
  getLOVById: id => api.get(`/generics/lov/${id}`),
  deleteLOV: id => api.delete(`/generics/lov/${id}`),
}

export const feedbackAPI = {
  submitFeedback: feedbackData => api.post('/feedback/submit', feedbackData),
  getUserFeedback: (page = 1, limit = 10) =>
    api.get(`/feedback/my-feedback?page=${page}&limit=${limit}`),
  getAllFeedback: queryParams => {
    const params =
      queryParams instanceof URLSearchParams ? queryParams : new URLSearchParams(queryParams)
    return api.get(`/feedback?${params.toString()}`)
  },
  getFeedbackStats: () => api.get('/feedback/stats'),
  updateFeedbackStatus: (id, status, adminNotes = '') =>
    api.patch(`/feedback/${id}/status`, { status, adminNotes }),
  deleteFeedback: id => api.delete(`/feedback/${id}`),
  getRatingAnalysis: () => api.get('/feedback/analysis/ratings'),
  getFeedbackTrends: (params = {}) => api.get('/feedback/analysis/trends', { params }),
  exportFeedback: (params = {}) =>
    api.get('/feedback/export', {
      params,
      responseType: 'blob',
    }),
  getCategoryAnalysis: () => api.get('/feedback/analysis/categories'),
}

export const analyticsAPI = {
  // Dashboard Analytics
  getDashboardOverview: () => api.get('/analytics/dashboard-overview'),
  getRevenueAnalytics: (params = {}) => api.get('/analytics/revenue', { params }),
  getUserAnalytics: (params = {}) => api.get('/analytics/users', { params }),
  getCourseAnalytics: (params = {}) => api.get('/analytics/courses', { params }),
  getSupportAnalytics: (params = {}) => api.get('/analytics/support', { params }),
  getBlogAnalytics: () => api.get('/analytics/blogs'),
  getCustomAnalytics: (params = {}) => api.get('/analytics/custom', { params }),
  getEnrollmentAnalytics: (params = {}) => api.get('/analytics/enrollments', { params }),
  getDemoRequestAnalytics: (params = {}) => api.get('/analytics/demo-requests', { params }),
  getTestimonialAnalytics: () => api.get('/analytics/testimonials'),

  // Enhanced Analytics for Reports
  getUserEnrollmentAnalytics: (params = {}) => api.get('/analytics/user-enrollments', { params }),
  getCoursePerformance: (params = {}) => api.get('/analytics/course-performance', { params }),
  getRevenueBreakdown: (params = {}) => api.get('/analytics/revenue/breakdown', { params }),
  getUserGrowth: (params = {}) => api.get('/analytics/users/growth', { params }),
  getCourseEngagement: (params = {}) => api.get('/analytics/courses/engagement', { params }),
  getLearningProgress: (params = {}) => api.get('/analytics/learning-progress', { params }),
  getGeographicDistribution: () => api.get('/analytics/users/geographic'),
  getPlatformUsage: (params = {}) => api.get('/analytics/platform/usage', { params }),
  getRetentionMetrics: (params = {}) => api.get('/analytics/users/retention', { params }),

  // Export Analytics
  exportAnalytics: (type, params = {}) =>
    api.get(`/analytics/export/${type}`, {
      params,
      responseType: 'blob',
    }),
}

export const supportAPI = {
  // 🎟️ Ticket methods
  createTicket: ticketData => api.post('/support/tickets', ticketData),
  getTickets: (params = {}) => api.get('/support/tickets', { params }),
  getUserTickets: (params = {}) => api.get('/support/tickets/user', { params }),
  getTicket: ticketId => api.get(`/support/tickets/${ticketId}`),
  updateTicket: (ticketId, updateData) => api.put(`/support/tickets/${ticketId}`, updateData),
  deleteTicket: ticketId => api.delete(`/support/tickets/${ticketId}`),

  // 💬 Message methods
  addMessage: (ticketId, messageData) =>
    api.post(`/support/tickets/${ticketId}/messages`, messageData),
  getTicketMessages: ticketId => api.get(`/support/tickets/${ticketId}/messages`),

  // ❓ FAQ methods
  getFAQs: (params = {}) => api.get('/support/faqs', { params }),
  createFAQ: faqData => api.post('/support/faqs', faqData),
  updateFAQ: (faqId, updateData) => api.put(`/support/faqs/${faqId}`, updateData),
  deleteFAQ: faqId => api.delete(`/support/faqs/${faqId}`),

  // 📊 Stats & Analytics
  getStats: () => api.get('/support/tickets/stats'),
  getSupportStats: () => api.get('/support/stats'),
  getResponseTimes: (params = {}) => api.get('/support/response-times', { params }),
  getTicketAnalytics: (params = {}) => api.get('/support/analytics/tickets', { params }),
  getAgentPerformance: (params = {}) => api.get('/support/analytics/agents', { params }),
  getCategoryAnalysis: () => api.get('/support/analytics/categories'),
  getPriorityAnalysis: () => api.get('/support/analytics/priorities'),

  // 👤 User support history
  getUserSupportHistory: userId => api.get(`/support/users/${userId}/support-history`),

  // 🧾 Case tickets
  getCaseTickets: caseId => api.get(`/support/cases/${caseId}/tickets`),

  // 📈 Reports & Exports
  exportTickets: (params = {}) =>
    api.get('/support/tickets/export', {
      params,
      responseType: 'blob',
    }),
  getSupportReports: (type, params = {}) => api.get(`/support/reports/${type}`, { params }),
}

export const blogAPI = {
  getAllBlogs: (params = {}) => api.get('/blogs', { params }),
  getBlogBySlug: slug => api.get(`/blogs/slug/${slug}`),
  getBlogById: id => api.get(`/blogs/${id}`),
  createBlog: blogData => api.post('/blogs', blogData),
  updateBlog: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  deleteBlog: id => api.delete(`/blogs/${id}`),
  getBlogStats: () => api.get('/blogs/stats'),
  getPopularBlogs: (limit = 5) => api.get(`/blogs/popular?limit=${limit}`),
  searchBlogs: (query, params = {}) =>
    api.get('/blogs/search', { params: { q: query, ...params } }),
}

export const certificateAPI = {
  generateCertificate: enrollmentId => api.post(`/certificates/generate/${enrollmentId}`),
  getMyCertificates: () => api.get('/certificates/my-certificates'),
  getCertificateById: certificateId => api.get(`/certificates/${certificateId}`),
  verifyCertificate: certificateId => api.get(`/certificates/verify/${certificateId}`),
  downloadCertificate: certificateId =>
    api.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob',
    }),
}

export const notificationAPI = {
  getNotifications: (params = {}) => api.get('/notifications', { params }),
  markAsRead: notificationId => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  deleteNotification: notificationId => api.delete(`/notifications/${notificationId}`),
}

export const reportAPI = {
  // Comprehensive Report Endpoints
  generateReport: (reportType, params = {}) =>
    api.post('/reports/generate', { reportType, ...params }),
  getReportStatus: reportId => api.get(`/reports/status/${reportId}`),
  downloadReport: reportId => api.get(`/reports/download/${reportId}`, { responseType: 'blob' }),

  // Pre-defined Reports
  getUserReport: (params = {}) => api.get('/reports/users', { params }),
  getFinancialReport: (params = {}) => api.get('/reports/financial', { params }),
  getCourseReport: (params = {}) => api.get('/reports/courses', { params }),
  getSupportReport: (params = {}) => api.get('/reports/support', { params }),
  getFeedbackReport: (params = {}) => api.get('/reports/feedback', { params }),
  getContactReport: (params = {}) => api.get('/reports/contacts', { params }),
  getAnalyticsReport: (params = {}) => api.get('/reports/analytics', { params }),

  // Custom Reports
  createCustomReport: reportConfig => api.post('/reports/custom', reportConfig),
  getCustomReports: () => api.get('/reports/custom'),
  deleteCustomReport: reportId => api.delete(`/reports/custom/${reportId}`),
}

export const exportAPI = {
  exportData: (type, format, params = {}) =>
    api.get(`/export/${type}/${format}`, {
      params,
      responseType: 'blob',
    }),
  getExportTemplates: () => api.get('/export/templates'),
  downloadTemplate: templateId =>
    api.get(`/export/templates/${templateId}/download`, {
      responseType: 'blob',
    }),
}

export default api
