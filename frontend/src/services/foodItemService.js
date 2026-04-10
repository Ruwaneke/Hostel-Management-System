import axios from 'axios';

const API_BASE_URL = 'http://localhost:5025/api/food-items';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const foodItemAPI = {
  // Get all food items
  getAllFoodItems: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.restaurantId) params.append('restaurantId', filters.restaurantId);
      if (filters.category) params.append('category', filters.category);
      if (filters.date) params.append('date', filters.date);

      const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;
      const response = await axios.get(url, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error fetching food items' };
    }
  },

  // Get single food item
  getFoodItem: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error fetching food item' };
    }
  },

  // Get food items by date and category
  getFoodItemsByDateAndCategory: async (date, category) => {
    try {
      const params = new URLSearchParams();
      params.append('date', date);
      if (category) params.append('category', category);

      const response = await axios.get(
        `${API_BASE_URL}/search/by-date-category?${params.toString()}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error fetching food items' };
    }
  },

  // Create food item
  createFoodItem: async (foodItemData) => {
    try {
      const response = await axios.post(API_BASE_URL, foodItemData, getAuthHeader());
      return response.data;
    } catch (error) {
      const errMessage = error.response?.data?.message || error.message || 'Error creating food item';
      throw error.response?.data || { success: false, message: errMessage };
    }
  },

  // Update food item
  updateFoodItem: async (id, foodItemData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, foodItemData, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error updating food item' };
    }
  },

  // Delete food item
  deleteFoodItem: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error deleting food item' };
    }
  }
};
