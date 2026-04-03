import React, { useState, useEffect } from 'react';
import { foodItemAPI } from '../services/foodItemService.js';
import { useToast } from '../components/Toast';

const categoryIcons = {
  breakfast: '🌅',
  lunch: '🍽️',
  dinner: '🌙'
};

const categoryColors = {
  breakfast: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-800' },
  lunch: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' },
  dinner: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-100 text-purple-800' }
};

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-gradient-to-r from-brand-navy to-blue-800 rounded-3xl p-10 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <span className="text-6xl">🍽️</span>
                <div>
                  <h1 className="text-4xl font-black">Delicious Meals</h1>
                  <p className="text-blue-100 text-lg mt-2">Explore meals from our partner restaurants</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-3xl shadow-sm p-8 mb-10 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">🔍 Filter Meals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">Meal Type</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none font-semibold text-slate-700 transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="breakfast">🌅 Breakfast</option>
                  <option value="lunch">🍽️ Lunch</option>
                  <option value="dinner">🌙 Dinner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-brand-gold focus:outline-none font-semibold text-slate-700 transition-all"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ category: 'all', date: '' })}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 px-4 rounded-xl transition-all"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Menus Display */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm p-16 text-center border border-slate-100">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-slate-600 text-xl font-semibold mb-2">No meals found</p>
              <p className="text-slate-500">Try adjusting your filters to find available meals</p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(groupedByRestaurant).map(([restaurantId, { restaurantName, contactNo, address, googleMapLink, items }], idx) => (
                <div
                  key={restaurantId}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                    {/* Restaurant Header */}
                    <div className="bg-gradient-to-r from-brand-gold to-yellow-500 p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-4xl">🏪</span>
                          <h2 className="text-3xl font-black text-brand-navy">{restaurantName}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <a
                            href={`tel:${contactNo}`}
                            className="flex items-center gap-3 bg-white/40 hover:bg-white/60 backdrop-blur px-5 py-3 rounded-xl transition-all font-semibold text-brand-navy group"
                          >
                            <span className="text-xl group-hover:scale-125 transition-transform">📞</span>
                            <span>{contactNo}</span>
                          </a>
                          <div className="flex items-center gap-3 bg-white/40 backdrop-blur px-5 py-3 rounded-xl font-semibold text-brand-navy">
                            <span className="text-xl">📍</span>
                            <span className="text-sm">{address}</span>
                          </div>
                          {googleMapLink && (
                            <a
                              href={googleMapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 bg-white/40 hover:bg-white/60 backdrop-blur px-5 py-3 rounded-xl transition-all font-semibold text-brand-navy group"
                            >
                              <span className="text-xl group-hover:scale-125 transition-transform">🗺️</span>
                              <span>View Map</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item, idx) => {
                          const colors = categoryColors[item.category] || categoryColors.lunch;
                          return (
                            <div
                              key={item._id}
                              className={`rounded-2xl p-6 border-2 ${colors.border} ${colors.bg} hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer group overflow-hidden relative`}
                            >
                              <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300"></div>
                              <div className="relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                  <span className="text-3xl">{categoryIcons[item.category]}</span>
                                  <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${colors.badge}`}>
                                    {item.category}
                                  </span>
                                </div>
                                <h3 className={`text-xl font-black ${colors.text} mb-2`}>{item.foodName}</h3>
                                <p className={`text-sm ${colors.text} opacity-75 mb-4 leading-relaxed`}>
                                  {item.description || 'Specially prepared meal'}
                                </p>
                                <div className={`flex items-center gap-2 text-sm font-semibold ${colors.text}`}>
                                  <span>📅</span>
                                  <span>
                                    {new Date(item.availableDate).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with stats */}
      <div className="bg-gradient-to-r from-brand-gold/10 to-yellow-100/20 rounded-2xl p-6 border-2 border-brand-gold/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800">🍽️ Today's Menu</h2>
            <p className="text-slate-600 text-sm mt-1">{filteredItems.length} delicious meals available</p>
          </div>
          <div className="text-5xl opacity-30">🥘</div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wider">Meal Type</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-semibold focus:border-brand-gold focus:outline-none transition-all bg-white"
          >
            <option value="all">All Types</option>
            <option value="breakfast">🌅 Breakfast</option>
            <option value="lunch">🍽️ Lunch</option>
            <option value="dinner">🌙 Dinner</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wider">Date</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-semibold focus:border-brand-gold focus:outline-none transition-all bg-white"
          />
        </div>
      </div>

      {/* Meals Display */}
      {filteredItems.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 text-center border-2 border-dashed border-slate-300">
          <div className="text-4xl mb-3">🍴</div>
          <p className="text-slate-700 font-semibold">No meals available</p>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(groupedByRestaurant).map(([restaurantId, { restaurantName, contactNo, googleMapLink, items }]) => (
            <div key={restaurantId} className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:border-brand-gold hover:shadow-md transition-all">
              {/* Restaurant Header */}
              <div className="bg-gradient-to-r from-brand-gold to-yellow-400 px-5 py-4 border-b-2 border-brand-gold/60">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-xl">🏪</span>
                    <span>{restaurantName}</span>
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <a href={`tel:${contactNo}`} className="text-xs bg-white/70 hover:bg-white px-3 py-1.5 rounded-lg text-brand-navy font-bold transition-all flex items-center gap-1">
                      <span>📞</span>
                      <span className="hidden sm:inline">{contactNo}</span>
                    </a>
                    {googleMapLink && (
                      <a 
                        href={googleMapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-white/70 hover:bg-white px-3 py-1.5 rounded-lg text-brand-navy font-bold transition-all flex items-center gap-1"
                      >
                        <span>🗺️</span>
                        <span>Map</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Meal Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
                {items.map((item) => {
                  const colors = categoryColors[item.category] || categoryColors.lunch;
                  return (
                    <div
                      key={item._id}
                      className={`rounded-xl p-4 border-2 ${colors.border} ${colors.bg} hover:shadow-md hover:-translate-y-1 transition-all group relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -mr-6 -mt-6 group-hover:scale-125 transition-transform"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl">{categoryIcons[item.category]}</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${colors.badge}`}>
                            {item.category}
                          </span>
                        </div>
                        <h4 className={`font-bold text-slate-800 text-sm mb-1`}>{item.foodName}</h4>
                        <p className={`text-slate-600 text-xs mb-3 leading-snug`}>
                          {item.description || 'Specially prepared meal'}
                        </p>
                        <div className={`text-xs font-semibold ${colors.text}`}>
                          📅 {new Date(item.availableDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
