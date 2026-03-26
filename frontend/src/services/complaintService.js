import axios from 'axios';

const API_BASE_URL = 'http://localhost:5025/api';

const getAuthHeader = (isFormData = false) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw { success: false, message: 'No authentication token found. Please login.' };
  }
  const headers = { Authorization: `Bearer ${token}` };
  if (!isFormData) headers['Content-Type'] = 'application/json';
  return headers;
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
      const isFormData = data instanceof FormData;
      const response = await axios.post(`${API_BASE_URL}/complaints`, data, {
        headers: getAuthHeader(isFormData)
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  getMyComplaints: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/complaints/my-complaints`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  getAllComplaints: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_BASE_URL}/complaints/admin/all?${queryString}`, {
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

  assignComplaint: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/complaints/${id}/assign`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  updateProgress: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/complaints/${id}/progress`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },
  
  completeComplaint: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/complaints/${id}/complete`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  submitFeedback: async (id, data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/complaints/${id}/feedback`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  deleteComplaint: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/complaints/legacy/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
};