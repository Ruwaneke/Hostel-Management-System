import React, { useState, useEffect } from 'react';

export default function StudentRoomList({ onBookClick }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // IMAGE FIX URL
  const FRONTEND_URL = "http://localhost:5173";

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5025/api/rooms/available');
        const result = await response.json();
        if (result.success) setRooms(result.data);
      } catch (err) {
        console.error("Failed to fetch available rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) {
    return <div className="p-10 flex justify-center text-slate-400 font-medium animate-pulse">Loading Available Rooms...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Available Hostel Rooms</h2>
        <p className="text-slate-500 font-medium text-sm mt-1">Select a room to view details and start your booking.</p>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm text-center border border-slate-200">
          <span className="text-5xl mb-4 block opacity-50">📭</span>
          <h3 className="text-lg text-slate-700 font-bold">No Rooms Available</h3>
          <p className="text-slate-400 mt-2 text-sm">Please check back later or contact administration.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const availableSlots = room.capacity - (room.bookedStudents?.length || 0);

            // FIXED IMAGE LOGIC
            const getImageUrl = (path) => {
                if (!path) return null;
                if (path.startsWith('http')) return path;
                const correctedPath = path.replace('/uploads/', '/roomImage/');
                const finalPath = correctedPath.startsWith('/') ? correctedPath : `/${correctedPath}`;
                return `${FRONTEND_URL}${finalPath}`;
            };

            return (
              <div key={room._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden group hover:shadow-md transition-all">
                
                {/* Room Image & Badges */}
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  {room.photos && room.photos[0] ? (
                    <img 
                        src={getImageUrl(room.photos[0])} 
                        alt="Room" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f8fafc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14">Image Unavailable</text></svg>';
                        }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold uppercase">No Image</div>
                  )}
                  <div className="absolute top-3 right-3 bg-sky-100 text-sky-700 border border-sky-200 text-[10px] font-bold px-3 py-1 rounded-lg uppercase shadow-sm">
                    Block {room.block}
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-end mb-4 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-800">Room {room.roomNumber}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{room.roomType}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] uppercase font-bold px-2.5 py-1.5 rounded-lg border ${availableSlots > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                        {availableSlots} Slots Left
                      </span>
                    </div>
                  </div>

                  {/* Furnishings */}
                  <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl mb-6 border border-slate-100">
                    <div className="text-center w-1/3 border-r border-slate-200"><span className="block text-sm mb-1">🛏️</span><span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{room.beds} Beds</span></div>
                    <div className="text-center w-1/3 border-r border-slate-200"><span className="block text-sm mb-1">🪵</span><span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{room.tables} Desk</span></div>
                    <div className="text-center w-1/3"><span className="block text-sm mb-1">{room.isAC ? '❄️' : '🌬️'}</span><span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{room.isAC ? 'AC' : 'Fan'}</span></div>
                  </div>

                  {/* Booking Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => onBookClick(room._id)}
                      className="w-full py-3 bg-sky-500 text-white text-sm font-bold rounded-xl hover:bg-sky-600 transition-colors shadow-sm">
                      Select & Proceed
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}