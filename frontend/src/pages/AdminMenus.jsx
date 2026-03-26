import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodItemAPI } from '../services/foodItemService.js';
import { restaurantAPI } from '../services/restaurantService.js';
import { useToast } from '../components/Toast';

export default function AdminMenus() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [foodItems, setFoodItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    restaurantId: '',
    category: 'all',
    date: ''
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const [itemsResponse, restaurantsResponse] = await Promise.all([
        foodItemAPI.getAllFoodItems(),
        restaurantAPI.getAllRestaurants()
      ]);

      if (itemsResponse.success) {
        setFoodItems(itemsResponse.data);
      }
      if (restaurantsResponse.success) {
        setRestaurants(restaurantsResponse.data);
      }
    } catch (error) {
      toast.error('Error', 'Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Apply filters
  const filteredItems = foodItems.filter(item => {
    if (filters.restaurantId && item.restaurantId._id !== filters.restaurantId) return false;
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.date) {
      const itemDate = new Date(item.availableDate).toISOString().split('T')[0];
      if (itemDate !== filters.date) return false;
    }
    return true;
  });

  // Group by restaurant
  const groupedByRestaurant = filteredItems.reduce((acc, item) => {
    const restaurantId = item.restaurantId._id;
    if (!acc[restaurantId]) {
      acc[restaurantId] = {
        restaurantName: item.restaurantId.restaurantName,
        contactNo: item.restaurantId.contactNo,
        address: item.restaurantId.address,
        googleMapLink: item.restaurantId.googleMapLink,
        items: []
      };
    }
    acc[restaurantId].items.push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy flex justify-center items-center">
        <div className="animate-spin w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            ← Back
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-brand-gold">🍽️ All Menus</h1>
            <p className="text-slate-400">View all restaurants and their food items</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-brand-white rounded-2xl shadow-sm p-6 mb-8 border border-brand-platinum/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Restaurant</label>
              <select
                name="restaurantId"
                value={filters.restaurantId}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-brand-gold focus:outline-none"
              >
                <option value="">All Restaurants</option>
                {restaurants.map(restaurant => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.restaurantName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-brand-gold focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-brand-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Menus Display */}
        {filteredItems.length === 0 ? (
          <div className="bg-brand-white rounded-2xl shadow-sm p-12 text-center border border-brand-platinum/30">
            <p className="text-slate-600 text-lg">No menu items found with the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByRestaurant).map(([restaurantId, { restaurantName, contactNo, address, googleMapLink, items }]) => (
              <div key={restaurantId} className="bg-brand-white rounded-2xl shadow-sm border border-brand-platinum/30 overflow-hidden">
                {/* Restaurant Header */}
                <div className="bg-gradient-to-r from-brand-gold to-yellow-500 p-5">
                  <h2 className="text-2xl font-bold text-brand-navy">🏪 {restaurantName}</h2>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <a href={`tel:${contactNo}`} className="flex items-center gap-2 bg-white/30 hover:bg-white/50 px-3 py-2 rounded-lg transition-all text-brand-navy font-semibold text-sm">
                      <span>📞</span>
                      {contactNo}
                    </a>
                    <span className="flex items-center gap-2 text-brand-navy text-sm">
                      <span>📍</span>
                      {address}
                    </span>
                    {googleMapLink && (
                      <a 
                        href={googleMapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white/30 hover:bg-white/50 px-3 py-2 rounded-lg transition-all text-brand-navy font-semibold text-sm"
                      >
                        <span>🗺️</span>
                        View Map
                      </a>
                    )}
                  </div>
                </div>

                {/* Items Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                      <div key={item._id} className="border-2 border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-brand-navy">{item.foodName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.category === 'breakfast' ? 'bg-orange-100 text-orange-800' :
                            item.category === 'lunch' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{item.description}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>📅 {new Date(item.availableDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          <span>{item.isAvailable ? '✅ Available' : '❌ Unavailable'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
