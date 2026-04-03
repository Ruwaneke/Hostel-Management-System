import axios from 'axios';

const API_BASE_URL = 'http://localhost:5025/api/restaurants';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const restaurantAPI = {
  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await axios.get(API_BASE_URL, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error fetching restaurants' };
    }
  },

  // Get single restaurant
  getRestaurant: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error fetching restaurant' };
    }
  },

  // Create restaurant
  createRestaurant: async (restaurantData) => {
    try {
      const response = await axios.post(API_BASE_URL, restaurantData, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error creating restaurant' };
    }
  },

  // Update restaurant
  updateRestaurant: async (id, restaurantData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, restaurantData, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error updating restaurant' };
    }
  },

  // Delete restaurant
  deleteRestaurant: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error deleting restaurant' };
    }
  }
};
