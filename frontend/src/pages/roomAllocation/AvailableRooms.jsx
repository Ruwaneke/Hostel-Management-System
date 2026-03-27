import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // IMAGE FIX URL
  const FRONTEND_URL = "http://localhost:5173";

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await fetch('http://localhost:5025/api/rooms/available');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch rooms');
        }

        setRooms(result.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAvailableRooms();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex justify-center items-center text-slate-400 font-medium animate-pulse text-lg">Loading Available Spaces...</div>;
  if (error) return <div className="min-h-screen bg-[#FAFAFA] flex justify-center items-center text-red-500 font-bold text-lg">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-14">
          <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4 inline-block">
            Student Housing
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Available Premium Spaces</h1>
          <p className="text-slate-500 font-medium text-base max-w-2xl mx-auto">
            Browse our open inventory, select your preferred suite, and secure your residency in minutes.
          </p>
        </div>

        {rooms.length === 0 ? (
          <div className="bg-white p-16 rounded-[2.5rem] shadow-sm text-center border border-slate-200 max-w-2xl mx-auto">
            <span className="text-6xl mb-6 block opacity-40">📭</span>
            <h3 className="text-2xl text-slate-800 font-extrabold mb-2">No Rooms Available</h3>
            <p className="text-slate-500 font-medium">All our units are currently occupied. Please check back later or contact administration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => {
              const bookedCount = room.bookedStudents ? room.bookedStudents.length : 0;
              const availableSlots = room.capacity - bookedCount;

              // FIXED IMAGE LOGIC
              const getImageUrl = (path) => {
                if (!path) return null;
                if (path.startsWith('http')) return path;
                const correctedPath = path.replace('/uploads/', '/roomImage/');
                const finalPath = correctedPath.startsWith('/') ? correctedPath : `/${correctedPath}`;
                return `${FRONTEND_URL}${finalPath}`;
              };

              return (
                <div key={room._id} className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-slate-200 group">
                  
                  {/* Image Header */}
                  <div className="h-60 bg-slate-100 relative overflow-hidden">
                     {room.photos && room.photos.length > 0 ? (
                        <img 
                          src={getImageUrl(room.photos[0])} 
                          alt={`Room ${room.roomNumber}`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f8fafc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14">Image Unavailable</text></svg>';
                          }}
                        />
                     ) : (
                        <div className="w-full h-full flex justify-center items-center text-slate-400 text-sm font-medium">No Image Provided</div>
                     )}
                     
                     {/* Floating Glass Badges */}
                     <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/95 backdrop-blur-sm text-slate-800 border border-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">
                          Block {room.block}
                        </span>
                        {room.isAC && (
                          <span className="bg-blue-50/95 backdrop-blur-sm border border-blue-100 text-blue-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">
                            ❄️ AC
                          </span>
                        )}
                     </div>
                     <span className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur text-white border border-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide shadow-sm">
                       {room.roomType}
                     </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-grow flex flex-col text-slate-600">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Room {room.roomNumber}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Key Money: Rs. {room.keyMoney?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-blue-600">Rs.{room.monthlyFee?.toLocaleString()}</span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Per Month</p>
                      </div>
                    </div>

                    {/* Quick Furnishings Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 p-3 rounded-xl mb-6">
                      <div className="flex flex-col items-center">
                        <span className="text-lg mb-1">🛏️</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{room.beds} Beds</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg mb-1">🪵</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{room.tables} Desk</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg mb-1">🪑</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{room.chairs} Chairs</span>
                      </div>
                    </div>
                    
                    {/* Slot Availability Indicator */}
                    <div className="mb-6 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Availability</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${availableSlots <= 1 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {availableSlots} / {room.capacity} Left
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${availableSlots <= 1 ? 'bg-rose-400' : 'bg-blue-500'}`} 
                          style={{ width: `${(bookedCount / room.capacity) * 100}%` }}>
                        </div>
                      </div>
                    </div>

                    {/* Booking Button */}
                    <div className="mt-auto">
                      <button 
                        onClick={() => navigate(`/room/${room._id}`)}
                        className="w-full bg-blue-50 text-blue-600 border border-blue-100 font-extrabold py-3.5 rounded-xl hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 text-sm">
                        View Details & Book
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableRooms;