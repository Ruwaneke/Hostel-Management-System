import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/restaurantService.js';
import { useToast } from '../components/Toast';

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    restaurantName: '',
    contactNo: '',
    address: '',
    googleMapLink: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getAllRestaurants();
      if (response.success) {
        setRestaurants(response.data);
      }
    } catch (error) {
      toast.error('Error', error.message || 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.restaurantName || !formData.contactNo || !formData.address) {
      toast.error('Validation', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (editingId) {
        response = await restaurantAPI.updateRestaurant(editingId, formData);
        toast.success('Success', 'Restaurant updated successfully');
      } else {
        response = await restaurantAPI.createRestaurant(formData);
        toast.success('Success', 'Restaurant added successfully');
      }

      if (response.success) {
        setFormData({ restaurantName: '', contactNo: '', address: '', googleMapLink: '' });
        setEditingId(null);
        setShowForm(false);
        fetchRestaurants();
      }
    } catch (error) {
      toast.error('Error', error.message || 'Failed to save restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant._id);
    setFormData({
      restaurantName: restaurant.restaurantName,
      contactNo: restaurant.contactNo,
      address: restaurant.address,
      googleMapLink: restaurant.googleMapLink || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;

    try {
      setLoading(true);
      const response = await restaurantAPI.deleteRestaurant(id);
      if (response.success) {
        toast.success('Success', 'Restaurant deleted successfully');
        fetchRestaurants();
      }
    } catch (error) {
      toast.error('Error', error.message || 'Failed to delete restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ restaurantName: '', contactNo: '', address: '', googleMapLink: '' });
  };

  return (
    <div className="min-h-screen bg-brand-navy p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            ← Back
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-brand-gold">Restaurant Management</h1>
            <p className="text-slate-400 mt-2">Manage all restaurants and their food items</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-gold hover:bg-[#e5920f] text-brand-black font-extrabold py-3 px-6 rounded-xl transition-all"
          >
            {showForm ? '✕ Cancel' : '+ Add Restaurant'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-brand-white rounded-2xl p-8 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold text-brand-black mb-6">
              {editingId ? 'Edit Restaurant' : 'Add New Restaurant'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Restaurant Name *</label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    required
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    pattern="\d{10}"
                    required
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter restaurant address"
                  required
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Google Map Link</label>
                <input
                  type="url"
                  name="googleMapLink"
                  value={formData.googleMapLink}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-gold hover:bg-[#e5920f] disabled:bg-gray-400 text-brand-black font-extrabold py-3 rounded-xl transition-all"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Add'} Restaurant
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-slate-300 hover:bg-slate-400 text-brand-black font-extrabold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && !showForm && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Restaurant List */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-brand-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-brand-black mb-2">{restaurant.restaurantName}</h3>
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <p>📞 {restaurant.contactNo}</p>
                    <p>📍 {restaurant.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/restaurants/${restaurant._id}`)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all text-sm"
                    >
                      View Meals
                    </button>
                    <button
                      onClick={() => handleEdit(restaurant)}
                      className="flex-1 bg-brand-gold hover:bg-[#e5920f] text-brand-black font-semibold py-2 rounded-lg transition-all text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && restaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No restaurants found. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
