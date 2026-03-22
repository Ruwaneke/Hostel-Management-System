import axios from 'axios';

const API_BASE_URL = 'http://localhost:5025/api';

const handleAxiosError = (error) => {
  if (error.response) {
    // Server responded with an error status (4xx, 5xx)
    throw error.response.data || { success: false, message: 'Server error' };
  } else if (error.request) {
    // Request was made but no response — backend is down
    throw { success: false, message: 'Cannot connect to server. Make sure the backend is running.' };
  } else {
    throw { success: false, message: error.message || 'An unexpected error occurred' };
  }
};

export const authAPI = {
  register: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  login: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
};
