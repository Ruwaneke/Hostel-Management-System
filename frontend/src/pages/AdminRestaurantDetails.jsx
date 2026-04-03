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
    <div className="min-h-screen bg-gradient-to-br from-brand-platinum/50 to-brand-platinum/20">
      {/* Header with Restaurant Info */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navy to-blue-900 text-brand-platinum shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-brand-white/10 hover:bg-brand-white/20 text-brand-platinum font-semibold py-2 px-4 rounded-lg transition-all mb-6"
          >
            ← Back to Restaurants
          </button>

          {/* Restaurant Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-black mb-3">🏪 {restaurant?.restaurantName}</h1>
              <div className="space-y-2 text-brand-platinum/80">
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <a href={`tel:${restaurant?.contactNo}`} className="hover:text-brand-gold transition-colors">
                    {restaurant?.contactNo}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <p>{restaurant?.address}</p>
                </div>
                {restaurant?.googleMapLink && (
                  <div className="flex items-center gap-2">
                    <span>🗺️</span>
                    <a href={restaurant?.googleMapLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors underline">
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowAddMeal(!showAddMeal)}
              className={`px-6 py-3 rounded-xl font-extrabold transition-all ${
                showAddMeal
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-brand-gold hover:bg-[#e5920f] text-brand-black"
              }`}
            >
              {showAddMeal ? "✕ Cancel" : "+ Add Meal"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add/Edit Meal Form */}
        {showAddMeal && (
          <div className="bg-brand-white rounded-3xl shadow-xl p-8 mb-10 border-2 border-brand-gold/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-2xl">
                {editingMealId ? "✏️" : "➕"}
              </div>
              <h2 className="text-3xl font-black text-brand-navy">
                {editingMealId ? "Edit Meal" : "Add New Meal"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-navy mb-3 uppercase tracking-wide">Food Name *</label>
                  <input
                    type="text"
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleChange}
                    placeholder="e.g., Paneer Tikka, Butter Chicken"
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none focus:shadow-lg transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-navy mb-3 uppercase tracking-wide">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none focus:shadow-lg transition-all"
                  >
                    <option value="breakfast">🌅 Breakfast</option>
                    <option value="lunch">🍽️ Lunch</option>
                    <option value="dinner">🌙 Dinner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-navy mb-3 uppercase tracking-wide">Available Date *</label>
                <select
                  name="availableDate"
                  value={formData.availableDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none focus:shadow-lg transition-all"
                >
                  <option value="">Select a date</option>
                  <option value={todayStr}>📅 Today ({new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})</option>
                  <option value={tomorrowStr}>📅 Tomorrow ({new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-navy mb-3 uppercase tracking-wide">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add ingredients, spice level, or any special notes..."
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none focus:shadow-lg transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-brand-gold to-yellow-500 hover:shadow-lg disabled:opacity-50 text-brand-black font-extrabold py-3 rounded-xl transition-all transform hover:scale-105"
                >
                  {loading ? "Saving..." : editingMealId ? "Update Meal" : "Add Meal"}
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

        {/* Meals Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-black text-brand-navy">🍲 Meals </h2>
            <span className="bg-brand-gold text-brand-black px-4 py-2 rounded-full font-bold text-lg">
              {foodItems.length}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full"></div>
            </div>
          ) : foodItems.length === 0 ? (
            <div className="bg-brand-white rounded-3xl shadow-lg p-12 text-center border-2 border-dashed border-slate-300">
              <p className="text-3xl mb-2">🥘</p>
              <p className="text-slate-600 text-lg font-semibold">No meals added yet</p>
              <p className="text-slate-500 mt-2">Click "Add Meal" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-brand-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group border border-slate-100 hover:border-brand-gold/50"
                >
                  {/* Card Header with Category */}
                  <div className="h-2 bg-gradient-to-r from-brand-gold to-yellow-500"></div>
                  
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-bold inline-block ${
                        item.category === 'breakfast'
                          ? 'bg-orange-100 text-orange-700'
                          : item.category === 'lunch'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.category === 'breakfast' ? '🌅' : item.category === 'lunch' ? '🍽️' : '🌙'}{' '}
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                      <span className="text-2xl">🍴</span>
                    </div>

                    {/* Food Name */}
                    <h3 className="text-xl font-black text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">
                      {item.foodName}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-5 pb-5 border-b border-slate-100">
                      <span>📅</span>
                      <span>{new Date(item.availableDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:shadow-lg text-white font-bold py-2.5 px-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg text-white font-bold py-2.5 px-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
