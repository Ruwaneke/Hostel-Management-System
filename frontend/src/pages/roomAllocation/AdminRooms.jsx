import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminRoomCreate from './AdminRoomCreate'; 
import AdminRoomDetails from './AdminRoomDetails';

// --- NEW IMPORTS FOR ANALYTICS ---
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); 
  const [selectedRoom, setSelectedRoom] = useState(null);

  // --- NEW STATES FOR SEARCH & FILTERS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    roomType: 'All',
    designatedGender: 'All',
    airConditioning: 'All',
    floorLevel: 'All',
  });

  // Fetch rooms from the backend (UPDATED PORT TO 5025)
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5025/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleRoomAdded = () => {
    setView('list');
    fetchRooms(); 
  };

  const handleRoomView = (room) => {
    setSelectedRoom(room);
    setView('details');
  };

  const handleEditRoom = () => {
    setView('edit');
  };

  const handleBackToList = () => {
    setSelectedRoom(null);
    setView('list');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room? This cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5025/api/rooms/${id}`);
        fetchRooms(); 
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  // --- FILTERING LOGIC ---
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: 'All',
      roomType: 'All',
      designatedGender: 'All',
      airConditioning: 'All',
      floorLevel: 'All',
    });
  };

  const filteredRooms = rooms.filter((room) => {
    // Search by room number or block
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      room.block.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'All' || room.status === filters.status;
    const matchesRoomType = filters.roomType === 'All' || room.roomType === filters.roomType;
    const matchesGender = filters.designatedGender === 'All' || room.designatedGender === filters.designatedGender;
    const matchesAC = filters.airConditioning === 'All' || room.airConditioning === filters.airConditioning;
    const matchesFloor = filters.floorLevel === 'All' || room.floorLevel === filters.floorLevel;

    return matchesSearch && matchesStatus && matchesRoomType && matchesGender && matchesAC && matchesFloor;
  });


  // --- ANALYTICS LOGIC (Only Booked/Full Rooms) ---
  const bookedRooms = rooms.filter(r => r.status === 'Full');

  // Chart 1: Booked Rooms by Gender
  const genderChartData = {
    labels: ['Male', 'Female', 'All/Mixed'],
    datasets: [
      {
        data: [
          bookedRooms.filter(r => r.designatedGender === 'Male').length,
          bookedRooms.filter(r => r.designatedGender === 'Female').length,
          bookedRooms.filter(r => r.designatedGender === 'All').length,
        ],
        backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6'], // Blue, Pink, Purple
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  // Chart 2: Booked Rooms by Room Type
  const roomTypeChartData = {
    labels: ['Single', 'Double', 'Triple', 'Shared'],
    datasets: [
      {
        data: [
          bookedRooms.filter(r => r.roomType === 'Single').length,
          bookedRooms.filter(r => r.roomType === 'Double').length,
          bookedRooms.filter(r => r.roomType === 'Triple').length,
          bookedRooms.filter(r => r.roomType === 'Shared').length,
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444'], // Emerald, Amber, Orange, Red
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }
    }
  };


  // --- ADD ROOM VIEW ---
  if (view === 'add') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add New Room ✨</h2>
            <p className="text-slate-500 text-sm mt-1">Configure block, capacity, and pricing for your new hostel room.</p>
          </div>
          <button 
            onClick={() => setView('list')}
            className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <span>←</span> Back to List
          </button>
        </div>
        <AdminRoomCreate onSuccess={handleRoomAdded} />
      </div>
    );
  }

  // --- DETAILS VIEW ---
  if (view === 'details' && selectedRoom) {
    return <AdminRoomDetails room={selectedRoom} onBack={handleBackToList} onEdit={handleEditRoom} />;
  }

  // --- EDIT ROOM VIEW ---
  if (view === 'edit' && selectedRoom) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Edit Room {selectedRoom.roomNumber} ✏️</h2>
            <p className="text-slate-500 text-sm mt-1">Update the inventory, pricing, or status for this room.</p>
          </div>
          <button 
            onClick={() => setView('details')}
            className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <span>←</span> Cancel Edit
          </button>
        </div>
        <AdminRoomCreate onSuccess={handleRoomAdded} editData={selectedRoom} />
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Room Management 🏨</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor occupancy, edit details, and add new inventory.</p>
        </div>
        <button 
          onClick={() => setView('add')}
          className="relative z-10 bg-[#14213d] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0f1829] hover:shadow-lg hover:shadow-[#14213d]/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <span className="text-xl leading-none">+</span> Add Room
        </button>
      </div>

      {/* --- NEW: ANALYTICS GRAPHS --- */}
      {!loading && rooms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Booked Rooms By Gender</h3>
            <div className="w-full h-48 relative">
              {bookedRooms.length > 0 ? (
                <Doughnut data={genderChartData} options={chartOptions} />
              ) : (
                <p className="text-slate-400 text-sm mt-16 text-center">No rooms are currently booked.</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Booked Rooms By Type</h3>
            <div className="w-full h-48 relative">
              {bookedRooms.length > 0 ? (
                <Doughnut data={roomTypeChartData} options={chartOptions} />
              ) : (
                <p className="text-slate-400 text-sm mt-16 text-center">No rooms are currently booked.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- NEW: SEARCH & FILTERS SECTION --- */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search by Room No or Block..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all"
            />
          </div>

          {/* Filters Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <select name="status" value={filters.status} onChange={handleFilterChange} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy cursor-pointer">
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Full">Booked / Full</option>
              
            </select>
            
            <select name="roomType" value={filters.roomType} onChange={handleFilterChange} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy cursor-pointer">
              <option value="All">All Types</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Shared">Shared</option>
            </select>

            <select name="designatedGender" value={filters.designatedGender} onChange={handleFilterChange} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy cursor-pointer">
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select name="airConditioning" value={filters.airConditioning} onChange={handleFilterChange} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy cursor-pointer">
              <option value="All">AC / Non-AC</option>
              <option value="AC">AC</option>
              <option value="Non AC">Non-AC</option>
            </select>

            <select name="floorLevel" value={filters.floorLevel} onChange={handleFilterChange} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy cursor-pointer">
              <option value="All">All Floors</option>
              <option value="Ground">Ground</option>
              <option value="1st Floor">1st Floor</option>
              <option value="2nd Floor">2nd Floor</option>
              <option value="3rd Floor">3rd Floor</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <button 
            onClick={clearFilters}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors whitespace-nowrap text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-blue-600"></div>
            <p className="text-slate-400 font-semibold animate-pulse">Loading rooms...</p>
          </div>
        </div>
      ) : filteredRooms.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">
            📭
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">No Rooms Found</h3>
          <p className="text-slate-500 mb-8 max-w-md">Try adjusting your search or filters, or add a new room to your inventory.</p>
          <button 
            onClick={clearFilters} 
            className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all hover:shadow-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        // Advanced Room Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              onClick={() => handleRoomView(room)}
              className="cursor-pointer bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden group flex flex-col"
            >
              
              {/* Premium Image Section */}
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                {room.image ? (
                  <img src={`/roomImage/${room.image}`} alt={`Room ${room.roomNumber}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <span className="text-slate-400 text-5xl opacity-50">🛏️</span>
                  </div>
                )}
                
                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md border ${
                    room.status === 'Available' ? 'bg-emerald-500/90 text-white border-emerald-400/50' : 
                    room.status === 'Full' ? 'bg-rose-500/90 text-white border-rose-400/50' : 
                    'bg-amber-500/90 text-white border-amber-400/50'
                  }`}>
                    {room.status}
                  </span>
                </div>

                {/* Overlaid Title */}
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider border border-white/30 mb-2 inline-block shadow-sm">
                        Block {room.block || 'A'} • {room.roomType}
                      </span>
                      <h3 className="text-3xl font-black text-white drop-shadow-md leading-none">
                        {room.roomNumber}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-5 flex-1 flex flex-col">
                
                {/* Price Tag */}
                <div className="flex items-center justify-between mb-5 bg-blue-50 rounded-2xl p-3 border border-blue-100/50">
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Monthly Rent</p>
                    <p className="text-xl font-black text-blue-700">Rs. {room.monthlyRent?.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Money</p>
                    <p className="text-sm font-bold text-slate-600">Rs. {room.keyMoney?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Amenities Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">🏢</div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Floor</p>
                      <p className="text-xs font-bold text-slate-700">{room.floorLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">👥</div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Capacity</p>
                      <p className="text-xs font-bold text-slate-700">{room.currentOccupancy || 0} / {room.maxCapacity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">🚻</div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Gender</p>
                      <p className="text-xs font-bold text-slate-700">{room.designatedGender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">❄️</div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Climate</p>
                      <p className="text-xs font-bold text-slate-700">{room.airConditioning}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRoomView(room);
                    }}
                    className="flex-1 bg-white border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl transition-all text-sm shadow-sm"
                  >
                    View
                  </button>
                  <button 
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(room._id);
                    }}
                    className="flex-1 bg-white border-2 border-rose-100 hover:border-rose-500 hover:bg-rose-500 text-rose-500 hover:text-white font-bold py-2.5 rounded-xl transition-all text-sm shadow-sm"
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
  );
}