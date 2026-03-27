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

  if (loading) return <div className="min-h-screen bg-slate-50 flex justify-center items-center text-slate-400 font-medium animate-pulse text-lg">Loading Available Rooms...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex justify-center items-center text-red-500 font-bold text-lg">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Available Hostel Rooms</h1>
        <p className="text-slate-500 mb-10 font-medium">Select a room to view features and proceed with your booking.</p>

        {rooms.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm text-center border border-slate-200">
            <span className="text-5xl mb-4 block opacity-50">📭</span>
            <p className="text-xl text-slate-600 font-bold">No rooms are currently available.</p>
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
                <div key={room._id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md border border-slate-200 group">
                  
                  {/* Image Header */}
                  <div className="h-52 bg-slate-100 relative overflow-hidden">
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
                     
                     <span className="absolute top-4 right-4 bg-sky-100 text-sky-700 border border-sky-200 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide shadow-sm">
                       {room.roomType}
                     </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-grow flex flex-col text-slate-800">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-2xl font-black text-slate-800">Room {room.roomNumber}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Block {room.block}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-800">Rs.{room.monthlyFee}</span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Monthly</p>
                      </div>
                    </div>
                    
                    {/* Slot Availability Indicator */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Availability</span>
                        <span className={`text-[10px] font-bold uppercase ${availableSlots <= 1 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {availableSlots} / {room.capacity} Slots Left
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-sky-400 h-full rounded-full transition-all duration-1000" style={{ width: `${(bookedCount / room.capacity) * 100}%` }}></div>
                      </div>
                    </div>

                    {/* Push button to the bottom */}
                    <div className="mt-auto pt-2">
                      <button 
                        onClick={() => navigate(`/room/${room._id}`)}
                        className="w-full bg-sky-50 text-sky-600 border border-sky-100 font-bold py-3 rounded-xl hover:bg-sky-500 hover:text-white transition-colors duration-300 text-sm shadow-sm">
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