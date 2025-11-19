import axiosInstance from "./axiosInstance";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const feedbackApi = {
  // Submit feedback
  submitFeedback: async (feedbackData) => {
    const response = await axiosInstance.post(`${baseURL}/feedback/submit`, feedbackData
    );
    return response.data;
  },

  // Get user's feedback history
  getUserFeedback: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `${baseURL}/feedback/my-feedback?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  // Get all feedback (admin only)
  getAllFeedback: async (filters = {}) => {
    try {
      let queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      const response = await axiosInstance.get(
        `${baseURL}/feedback?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch feedback');
    }
  },

  // Get feedback statistics (admin only)
  getFeedbackStats: async () => {
    const response = await axiosInstance.get(`${baseURL}/feedback/stats`,);
    return response.data;
  },

  // Update feedback status (admin only)
  updateFeedbackStatus: async (id, status, adminNotes = '') => {
    const response = await axiosInstance.patch(
      `${baseURL}/feedback/${id}/status`, { status, adminNotes },
    );
    return response.data;
  },

  // Delete feedback (admin only)
  deleteFeedback: async (id) => {
    const response = await axiosInstance.delete(`${baseURL}/feedback/${id}`,);
    return response.data;
  }
};

export default feedbackApi;