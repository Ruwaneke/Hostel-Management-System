import React, { useState, useEffect } from 'react';

export default function AdminRoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // We need BOTH URLs because the API is on 5025, but images are on 5173
  const BACKEND_URL = "http://localhost:5025";
  const FRONTEND_URL = "http://localhost:5173";

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms/admin`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch rooms');
      setRooms(result.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure? This will permanently remove the room.")) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms/${roomId}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not delete room.');
      }

      setRooms(rooms.filter(room => room._id !== roomId));
      alert("Room deleted successfully");
    } catch (err) {
      alert("⚠️ Delete Denied: " + err.message);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400 font-medium animate-pulse">Syncing Database...</div>;
  if (error) return <div className="p-20 text-center text-red-400 font-medium">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#FAFAFA] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Room Inventory</h1>
          <p className="text-sm text-gray-500 font-medium">Monitoring hostel accommodation units.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-gray-200 px-5 py-2.5 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-black text-gray-400 block tracking-widest mb-1">Units</span>
            <span className="text-xl font-black text-gray-800">{rooms.length}</span>
          </div>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 p-20 rounded-[2.5rem] text-center">
          <p className="text-gray-400 font-bold">No rooms found in system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => {
            const bookedCount = room.bookedStudents ? room.bookedStudents.length : 0;
            const isFull = bookedCount >= room.capacity;

            // --- THE CRITICAL FIX ---
            // If the database says "/uploads/file.jpg" but they are actually in "/roomImage/file.jpg"
            const getImageUrl = (path) => {
              if (!path) return null;
              if (path.startsWith('http')) return path;
              
              // Replace "uploads" with "roomImage" to match your actual folder structure
              const correctedPath = path.replace('/uploads/', '/roomImage/');
              const finalPath = correctedPath.startsWith('/') ? correctedPath : `/${correctedPath}`;
              
              // Serve from the Frontend Port where the public folder lives
              return `${FRONTEND_URL}${finalPath}`;
            };

            return (
              <div key={room._id} className="bg-white border border-gray-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
                
                {/* Image Section */}
                <div className="h-52 bg-gray-100 relative">
                  {room.photos && room.photos.length > 0 ? (
                    <img 
                      src={getImageUrl(room.photos[0])} 
                      alt="Room" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        console.log("Failed to load image at:", e.target.src);
                        e.target.onerror = null;
                        // Local SVG placeholder if image fails (avoids via.placeholder.com errors)
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23aaa" font-family="sans-serif" font-size="14">Image Not Found</text></svg>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-widest">No Image</div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-gray-700 border border-white shadow-sm uppercase">
                    Block {room.block}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-black text-gray-800">Room {room.roomNumber}</h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{room.roomType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900">Rs.{room.monthlyFee}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Monthly</p>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="mb-6">
                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mb-2 tracking-tighter">
                      <span>Live Occupancy</span>
                      <span className={isFull ? 'text-red-500' : 'text-blue-500'}>{bookedCount} / {room.capacity} Slots</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isFull ? 'bg-red-400' : 'bg-blue-500'}`} 
                        style={{ width: `${(bookedCount / room.capacity) * 100}%` }}>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                    <button className="py-3 rounded-xl border border-gray-200 text-gray-600 text-[10px] font-black uppercase hover:bg-gray-50 transition-all tracking-widest">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(room._id)}
                      className="py-3 rounded-xl bg-red-50 text-red-500 text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all tracking-widest">
                      Delete
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