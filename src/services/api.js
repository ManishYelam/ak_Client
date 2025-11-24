import api from "./axiosInstance"

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/users', userData),
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (userId, profileData) => api.put(`/users/${userId}`, profileData),
  changePassword: (passwordData) => api.post('/change-password', passwordData),
  forgetPassword: (email) => api.post(`/forget-password/${email}`),
  otpChangePasswordService: (email, data) => api.post(`/change-password-otp/${email}`, data),
}

export const coursesAPI = {
  getAll: (data) => api.post('/courses', data),
  getById: (id) => api.get(`/courses/${id}`),
  getBySlug: (slug) => api.get(`/courses/slug/${slug}`),
}

export const paymentsAPI = {
  createRazorpayOrder: (orderData) => api.post('/payments/create-order', orderData),
  verifyPayment: (paymentData) => api.post('/payments/verify-payment', paymentData),
  getHistory: (params = {}) => api.get('/payments/history', { params }),
  getUserPayments: (params = {}) => api.get('/payments/user-payments', { params }),
  checkEnrollment: (courseId) => api.get(`/payments/check-enrollment/${courseId}`),
  getUserEnrollments: (params = {}) => api.get('/payments/user-enrollments', { params }),
  getPaymentDetails: (paymentId) => api.get(`/payments/payment-details/${paymentId}`),
  getPaymentMethods: () => api.get('/payments/payment-methods'),
  refundPayment: (paymentId, refundData) => api.post(`/payments/${paymentId}/refund`, refundData),
};

export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getMyCourses: (params = {}) => api.get('/student/courses', { params }),
  getCourseProgress: (courseId) => api.get(`/student/courses/${courseId}/progress`),
  updateProgress: (courseId, data) => api.put(`/student/courses/${courseId}/progress`, data),
  getCertificates: () => api.get('/student/certificates'),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: (params = {}) => api.get('/admin/students', { params }),
  getStudentDetail: (id) => api.get(`/admin/students/${id}`),
  updateStudentStatus: (id, data) => api.put(`/admin/students/${id}/status`, data),
  getFinancialReports: (params = {}) => api.get('/admin/reports/financial', { params }),
}

export const contactAPI = {
  submitContact: (data) => api.post("/contact/", data),
  getContacts: (params = {}) => api.get("/contact/", { params }),
  getContactById: (id) => api.get(`/contact/${id}`),
  deleteContact: (id) => api.delete(`/contact/${id}`),
  updateStatus: (id, data) => api.put(`/contact/${id}/status`, data),
  updateRemarks: (id, data) => api.put(`/contact/${id}/remarks`, data),
  getStats: () => api.get("/contact/stats"),
  searchContacts: (query, params = {}) => api.get("/contact/search", { params: { q: query, ...params } }),
  getContactsByStatus: (status, params = {}) => api.get(`/contact/status/${status}`, { params })
};

export const applicationAPI = {
  createOrUpdateProperty: (data) => api.post("/application/property", data),
  createOrUpdateBulkProperties: (data) => api.post("/application/properties/bulk", data),
  getAllProperties: (data) => api.post(`/application/properties`, data),
  getPropertyById: (id) => api.get(`/application/property/${id}`),
  deleteProperty: (id) => api.delete(`/application/property/${id}`),
  activeAppProperty: (property_name, app_prop_id) => api.put(`/application/property/${property_name}/${app_prop_id}`),
};

export const genericAPI = {
  createOrUpdateLOV: (data) => api.post("/generics/lov", data),
  getAllLOVs: (data) => api.post("/generics/lov/all", data),
  getLOVById: (id) => api.get(`/generics/lov/${id}`),
  deleteLOV: (id) => api.delete(`/generics/lov/${id}`),
};

export const feedbackAPI = {
  submitFeedback: (feedbackData) => api.post(`/feedback/submit`, feedbackData),
  getUserFeedback: (page = 1, limit = 10) => api.get(`/feedback/my-feedback?page=${page}&limit=${limit}`),
  getAllFeedback: (queryParams) => api.get(`/feedback?${queryParams.toString()}`),
  getFeedbackStats: () => api.get(`/feedback/stats`,),
  updateFeedbackStatus: (id, status, adminNotes = '') => api.patch(`/feedback/${id}/status`, { status, adminNotes },),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`)
};

// import api from "./axiosInstance";

// export const supportAPI = {
//   // 🎟️ Ticket methods
//   createTicket: (ticketData) => api.post(`/support/tickets`, ticketData),
//   getTickets: (params = {}) => api.get(`/support/tickets`, { params }),
//   getUserTickets: (params = {}) => api.get(`/support/tickets/user`, { params }),
//   getTicket: (ticketId) => api.get(`/support/tickets/${ticketId}`),
//   updateTicket: (ticketId, updateData) => api.put(`/support/tickets/${ticketId}`, updateData),
//   deleteTicket: (ticketId) => api.delete(`/support/tickets/${ticketId}`),
//   // 💬 Message methods
//   addMessage: (ticketId, messageData) => api.post(`/support/tickets/${ticketId}/messages`, messageData),
//   getTicketMessages: (ticketId) => api.get(`/support/tickets/${ticketId}/messages`),
//   // ❓ FAQ methods
//   getFAQs: (params = {}) => api.get(`/support/faqs`, { params }),
//   createFAQ: (faqData) => api.post(`/support/faqs`, faqData),
//   updateFAQ: (faqId, updateData) => api.put(`/support/faqs/${faqId}`, updateData),
//   deleteFAQ: (faqId) => api.delete(`/support/faqs/${faqId}`),
//   // 📊 Stats
//   getStats: () => api.get(`/support/tickets/stats`),
//   // 👤 User support history
//   getUserSupportHistory: (userId) => api.get(`/support/users/${userId}/support-history`),
//   // 🧾 Case tickets
//   getCaseTickets: (caseId) => api.get(`/support/cases/${caseId}/tickets`),
// };


export default api