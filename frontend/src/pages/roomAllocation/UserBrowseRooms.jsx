import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserBrowseRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // State for the category filter

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5025/api/rooms');
        
        // Filter out rooms that the Admin chose to hide, or that are completely Full
        const availableRooms = response.data.filter(
          (room) => room.display === true && room.status !== 'Full'
        );
        setRooms(availableRooms);
      } catch (error) {
        console.error("Error fetching available rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Filter logic for the buttons
  const filteredRooms = filter === 'All' 
    ? rooms 
    : rooms.filter(room => room.roomType === filter);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8 pb-10">
      
      {/* Header & Filters */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-brand-navy tracking-tight mb-2">Available Rooms 🏨</h2>
          <p className="text-slate-500 font-medium">Find your perfect space. Filter by room type and book instantly.</p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {['All', 'Single', 'Double', 'Triple', 'Shared'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                filter === type 
                  ? 'bg-white text-brand-navy shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-brand-gold"></div>
            <p className="text-slate-400 font-semibold animate-pulse">Loading available rooms...</p>
          </div>
        </div>
      ) : filteredRooms.length === 0 ? (
        
        // Empty State
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">
            📭
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">No Rooms Found</h3>
          <p className="text-slate-500 mb-8 max-w-md">There are currently no {filter !== 'All' ? filter : ''} rooms available. Please check back later or try a different filter.</p>
          {filter !== 'All' && (
            <button onClick={() => setFilter('All')} className="text-brand-navy font-bold hover:underline">
              View All Room Types
            </button>
          )}
        </div>

      ) : (
        
        // Room Cards Grid
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div key={room._id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col relative">
              
              {/* Image Section */}
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                {room.image ? (
                  <img src={`/roomImage/${room.image}`} alt={`Room ${room.roomNumber}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-6xl">🛏️</div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-transparent to-transparent"></div>
                
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg border border-emerald-400/50">
                    {room.status}
                  </span>
                </div>

                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                  <div>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/30 mb-2 inline-block shadow-sm">
                      Block {room.block}
                    </span>
                    <h3 className="text-3xl font-black text-white drop-shadow-md leading-none">
                      Room {room.roomNumber}
                    </h3>
                  </div>
                </div>
              </div>
              
              {/* Details Section */}
              <div className="p-6 flex-1 flex flex-col">
                
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Room Type</p>
                    <p className="text-sm font-black text-slate-700">{room.roomType}</p>
                  </div>
                  <div className="text-right bg-brand-gold/10 px-4 py-2 rounded-2xl border border-brand-gold/20">
                    <p className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">Monthly Rent</p>
                    <p className="text-2xl font-black text-brand-navy">Rs. {room.monthlyRent?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="text-lg mb-1">🚻</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">{room.designatedGender}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="text-lg mb-1">❄️</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">{room.airConditioning}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="text-lg mb-1">👥</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">{room.currentOccupancy}/{room.maxCapacity}</div>
                  </div>
                </div>

                <div className="mt-auto">
                  {/* Notice how this routes to /book/roomID. This is the next phase! */}
                  <button 
                    onClick={() => navigate(`/book/${room._id}`)}
                    className="w-full bg-brand-navy hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 group-hover:bg-brand-gold group-hover:text-brand-black group-hover:shadow-brand-gold/20 group-hover:shadow-lg"
                  >
                    <span>Proceed to Booking</span>
                    <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}