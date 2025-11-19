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
  createOrder: (orderData) => api.post('/payments/create-order', orderData),
  verify: (paymentData) => api.post('/payments/verify', paymentData),
  getHistory: (params = {}) => api.get('/payments/history', { params }),
}

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
  getAllProperties: (data) => api.post(`/application/properties`,data),
  getPropertyById: (id) => api.get(`/application/property/${id}`),
  deleteProperty: (id) => api.delete(`/application/property/${id}`),
};

export const genericAPI = {
  createOrUpdateLOV: (data) => api.post("/generics/lov", data),
  getAllLOVs: (data) => api.post("/generics/lov/all", data),
  getLOVById: (id) => api.get(`/generics/lov/${id}`),
  deleteLOV: (id) => api.delete(`/generics/lov/${id}`),
};

export default api