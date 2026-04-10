import axios from 'axios';

const BASE_URL = 'http://localhost:5025/api/feedback';

export const feedbackAPI = {
  submitFeedback: async (feedbackData) => {
    try {
      const response = await axios.post(BASE_URL, feedbackData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getMyFeedback: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/my-feedback`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getAllFeedback: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
      if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status);
      if (filters.rating) queryParams.append('rating', filters.rating);

      const response = await axios.get(`${BASE_URL}?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  updateFeedbackStatus: async (id, updateData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  deleteFeedback: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }
};
