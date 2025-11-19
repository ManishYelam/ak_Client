// services/contactService.js
import axiosInstance from "./axiosInstance";

// Contact API service
export const contactService = {
  // Submit contact form (public)
  submitContact: (data) => axiosInstance.post("/contact/", data),

  // Get all contacts with pagination and filters
  getContacts: (params = {}) => axiosInstance.get("/contact/", { params }),

  // Get contact by ID
  getContactById: (id) => axiosInstance.get(`/contact/${id}`),

  // Delete contact
  deleteContact: (id) => axiosInstance.delete(`/contact/${id}`),

  // Update contact status
  updateStatus: (id, data) => axiosInstance.put(`/contact/${id}/status`, data),

  // Update admin remarks
  updateRemarks: (id, data) => axiosInstance.put(`/contact/${id}/remarks`, data),

  // Get contact statistics
  getStats: () => axiosInstance.get("/contact/stats"),

  // Search contacts
  searchContacts: (query, params = {}) => 
    axiosInstance.get("/contact/search", { params: { q: query, ...params } }),

  // Get contacts by status
  getContactsByStatus: (status, params = {}) => 
    axiosInstance.get(`/contact/status/${status}`, { params })
};

// Export individual functions for backward compatibility
export const submitContactForm = contactService.submitContact;
export const getAllContacts = contactService.getContacts;
export const getContactById = contactService.getContactById;
export const deleteContact = contactService.deleteContact;
export const updateContactStatus = contactService.updateStatus;
export const updateContactRemarks = contactService.updateRemarks;
export const getContactStats = contactService.getStats;