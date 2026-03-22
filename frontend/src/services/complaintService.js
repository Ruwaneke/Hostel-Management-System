import axios from 'axios';

const API_BASE_URL = 'http://localhost:5025/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw { success: false, message: 'No authentication token found. Please login.' };
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const handleAxiosError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw { success: false, message: 'Session expired. Please login again.' };
  }
  
  if (error.response) {
    throw error.response.data || { success: false, message: 'Server error' };
  } else if (error.request) {
    throw { success: false, message: 'Cannot connect to server. Make sure the backend is running.' };
  } else {
    throw { success: false, message: error.message || 'An unexpected error occurred' };
  }
};

export const complaintAPI = {
  createComplaint: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/complaints`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  getComplaints: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/complaints`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  getComplaintById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/complaints/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  updateComplaint: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/complaints/${id}`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  deleteComplaint: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/complaints/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  getComplaintsByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/complaints/status/${status}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
};