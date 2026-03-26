import React, { useState, useEffect } from 'react';
import { foodItemAPI } from '../services/foodItemService.js';
import { useToast } from '../components/Toast';

export default function UserMenusView({ isEmbedded = false }) {
  const { toast } = useToast();

  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    date: ''
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await foodItemAPI.getAllFoodItems();
      if (response.success) {
        // Only show available items
        setFoodItems(response.data.filter(item => item.isAvailable));
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
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isEmbedded) {
    return (
      <div className="min-h-screen bg-brand-navy p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-brand-gold">🍽️ Food Menus</h1>
              <p className="text-slate-400">Browse meals from our partner restaurants</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-brand-white rounded-2xl shadow-sm p-6 mb-8 border border-brand-platinum/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <p className="text-slate-600 text-lg">No meal items available with the selected filters.</p>
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
                        <div key={item._id} className="border-2 border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all hover:border-brand-gold">
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
                          <p className="text-slate-600 text-sm mb-3">{item.description || 'No description'}</p>
                          <div className="text-xs text-slate-500">
                            <span>📅 {new Date(item.availableDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
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

  // Embedded version for dashboard
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">🍽️ Available Meals</h2>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-brand-gold focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-brand-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Meals Display */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-50 rounded-lg p-4 text-center text-slate-600 text-sm">
          No meals available with the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByRestaurant).map(([restaurantId, { restaurantName, contactNo, googleMapLink, items }]) => (
            <div key={restaurantId} className="bg-white rounded-lg border-l-4 border-brand-gold shadow-sm overflow-hidden">
              <div className="bg-brand-gold/10 p-3 border-b border-brand-gold/30">
                <h3 className="font-bold text-brand-navy mb-2">{restaurantName}</h3>
                <div className="flex gap-2 flex-wrap">
                  <a href={`tel:${contactNo}`} className="text-xs bg-brand-gold/20 hover:bg-brand-gold/40 px-2 py-1 rounded text-brand-navy font-semibold transition-all">
                    📞 {contactNo}
                  </a>
                  {googleMapLink && (
                    <a 
                      href={googleMapLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-brand-gold/20 hover:bg-brand-gold/40 px-2 py-1 rounded text-brand-navy font-semibold transition-all"
                    >
                      🗺️ View Map
                    </a>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
                {items.map(item => (
                  <div key={item._id} className="border border-slate-200 rounded-lg p-3 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-slate-800 text-sm">{item.foodName}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        item.category === 'breakfast' ? 'bg-orange-100 text-orange-800' :
                        item.category === 'lunch' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {item.category === 'breakfast' ? '🌅' : item.category === 'lunch' ? '🍽️' : '🌙'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mb-2">{item.description || 'No description'}</p>
                    <div className="text-xs text-slate-500">
                      📅 {new Date(item.availableDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
