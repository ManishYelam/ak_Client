import axiosInstance from "./axiosInstance";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const supportAPI = {
  // 🎟️ Ticket methods
  createTicket: (ticketData) => axiosInstance.post(`${baseURL}/support/tickets`, ticketData),

  getTickets: (params = {}) => axiosInstance.get(`${baseURL}/support/tickets`, { params }),

  getUserTickets: (params = {}) => axiosInstance.get(`${baseURL}/support/tickets/user`, { params }),

  getTicket: (ticketId) => axiosInstance.get(`${baseURL}/support/tickets/${ticketId}`),

  updateTicket: (ticketId, updateData) => axiosInstance.put(`${baseURL}/support/tickets/${ticketId}`, updateData),

  deleteTicket: (ticketId) => axiosInstance.delete(`${baseURL}/support/tickets/${ticketId}`),

  // 💬 Message methods
  addMessage: (ticketId, messageData) =>
    axiosInstance.post(`${baseURL}/support/tickets/${ticketId}/messages`, messageData),

  getTicketMessages: (ticketId) =>
    axiosInstance.get(`${baseURL}/support/tickets/${ticketId}/messages`),

  // ❓ FAQ methods
  getFAQs: (params = {}) => axiosInstance.get(`${baseURL}/support/faqs`, { params }),

  createFAQ: (faqData) => axiosInstance.post(`${baseURL}/support/faqs`, faqData),

  updateFAQ: (faqId, updateData) =>
    axiosInstance.put(`${baseURL}/support/faqs/${faqId}`, updateData),

  deleteFAQ: (faqId) => axiosInstance.delete(`${baseURL}/support/faqs/${faqId}`),

  // 📊 Stats
  getStats: () => axiosInstance.get(`${baseURL}/support/tickets/stats`),

  // 👤 User support history
  getUserSupportHistory: (userId) =>
    axiosInstance.get(`${baseURL}/support/users/${userId}/support-history`),

  // 🧾 Case tickets
  getCaseTickets: (caseId) => axiosInstance.get(`${baseURL}/support/cases/${caseId}/tickets`),
};
