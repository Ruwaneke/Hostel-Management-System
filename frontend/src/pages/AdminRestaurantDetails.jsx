import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/restaurantService.js';
import { foodItemAPI } from '../services/foodItemService.js';
import { useToast } from '../components/Toast';

export default function AdminRestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [editingMealId, setEditingMealId] = useState(null);
  const [formData, setFormData] = useState({
    foodName: '',
    category: 'breakfast',
    availableDate: '',
    description: ''
  });

  // Get today and tomorrow dates
  const getDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return { todayStr, tomorrowStr };
  };

  const { todayStr, tomorrowStr } = getDateRange();

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getRestaurant(id);
      if (response.success) {
        setRestaurant(response.data);
        setFoodItems(response.data.foodItems || []);
      }
    } catch (error) {
      toast.error('Error', error.message || 'Failed to load restaurant');
      navigate('/admin/restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.foodName || !formData.availableDate) {
      toast.error('Validation', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        restaurantId: id
      };

      let response;
      if (editingMealId) {
        response = await foodItemAPI.updateFoodItem(editingMealId, payload);
        toast.success('Success', 'Meal updated successfully');
      } else {
        response = await foodItemAPI.createFoodItem(payload);
        toast.success('Success', 'Meal added successfully');
      }

      if (response.success) {
        resetForm();
        fetchRestaurantDetails();
      }
    } catch (error) {
      toast.error('Error', error.message || 'Failed to save meal');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (foodItem) => {
    setEditingMealId(foodItem._id);
    setFormData({
      foodName: foodItem.foodName,
      category: foodItem.category,
      availableDate: foodItem.availableDate?.split('T')[0],
      description: foodItem.description || ''
    });
    setShowAddMeal(true);
  };

  const handleDelete = async (mealId) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;

    try {
      const response = await foodItemAPI.deleteFoodItem(mealId);
      if (response.success) {
        toast.success('Success', 'Meal deleted successfully');
        fetchRestaurantDetails();
      }
    } catch (error) {
      toast.error('Error', error.message || 'Failed to delete meal');
    }
  };

  const resetForm = () => {
    setFormData({ foodName: '', category: 'breakfast', availableDate: '', description: '' });
    setEditingMealId(null);
    setShowAddMeal(false);
  };

  if (loading && !restaurant) {
    return (
      <div className="min-h-screen bg-brand-navy flex justify-center items-center">
        <div className="animate-spin w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            ← Back
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-brand-gold">{restaurant?.restaurantName}</h1>
            <p className="text-slate-400">📞 {restaurant?.contactNo} • 📍 {restaurant?.address}</p>
          </div>
          <button
            onClick={() => setShowAddMeal(!showAddMeal)}
            className="bg-brand-gold hover:bg-[#e5920f] text-brand-black font-extrabold py-3 px-6 rounded-xl transition-all"
          >
            {showAddMeal ? '✕ Cancel' : '+ Add Meal'}
          </button>
        </div>

        {/* Add Meal Form */}
        {showAddMeal && (
          <div className="bg-brand-white rounded-2xl p-8 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold text-brand-black mb-6">
              {editingMealId ? 'Edit Meal' : 'Add New Meal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Food Name *</label>
                  <input
                    type="text"
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleChange}
                    placeholder="e.g., Paneer Tikka"
                    required
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none"
                  >
                    <option value="breakfast">🌅 Breakfast</option>
                    <option value="lunch">🍽️ Lunch</option>
                    <option value="dinner">🌙 Dinner</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Available Date *</label>
                <select
                  name="availableDate"
                  value={formData.availableDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none"
                >
                  <option value="">Select a date</option>
                  <option value={todayStr}>📅 Today ({new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})</option>
                  <option value={tomorrowStr}>📅 Tomorrow ({new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional description"
                  rows="3"
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-gold hover:bg-[#e5920f] disabled:bg-gray-400 text-brand-black font-extrabold py-3 rounded-xl transition-all"
                >
                  {loading ? 'Saving...' : editingMealId ? 'Update' : 'Add'} Meal
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-300 hover:bg-slate-400 text-brand-black font-extrabold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Meals List */}
        <div className="bg-brand-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-brand-navy text-brand-gold p-6">
            <h2 className="text-2xl font-bold">Meals ({foodItems.length})</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full"></div>
            </div>
          ) : foodItems.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 text-lg">No meals added yet. Add your first meal!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Food Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Category</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Description</th>
                    <th className="px-6 py-3 text-center font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {foodItems.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-slate-800 font-medium">{item.foodName}</td>
                      <td className="px-6 py-3">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                          {item.category === 'breakfast' ? '🌅' : item.category === 'lunch' ? '🍽️' : '🌙'} {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-600">{new Date(item.availableDate).toLocaleDateString()}</td>
                      <td className="px-6 py-3 text-slate-600 text-sm">{item.description || '—'}</td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleEdit(item)}
                          className="inline-block bg-brand-gold hover:bg-[#e5920f] text-brand-black font-semibold py-1 px-3 rounded text-sm mr-2 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-sm transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
