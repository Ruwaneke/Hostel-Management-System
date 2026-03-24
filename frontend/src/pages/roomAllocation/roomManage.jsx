import React, { useState, useEffect } from 'react';
import axios from 'axios';

// IMPORTANT: Ensure this matches your backend port (5025 based on your last logs)
const API_URL = 'http://localhost:5025/api/rooms';

const initialFormState = {
  roomNumber: '', floorLevel: '', roomType: 'Single', designatedGender: 'Any',
  bedCount: 1, chairCount: 1, // New Fields
  airConditioning: 'Non-AC', bathroomType: 'Common', 
  monthlyRent: '', keyMoney: '', maxCapacity: 1,
  display: true // Show room by default
};

export default function RoomManage() {
  const [rooms, setRooms] = useState([]); 
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [isViewOpen, setIsViewOpen] = useState(false); 
  const [formData, setFormData] = useState(initialFormState);
  const [imageFiles, setImageFiles] = useState([]); 
  const [editingId, setEditingId] = useState(null); 
  const [selectedRoom, setSelectedRoom] = useState(null); 

  const fetchRooms = async () => {
    try {
      const response = await axios.get(API_URL);
      setRooms(response.data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  // Handle regular inputs & checkboxes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    // Logic: Auto-set capacity based on Room Type
    if (name === 'roomType') {
      let newCapacity = formData.maxCapacity;
      if (value === 'Single') newCapacity = 1;
      if (value === 'Double') newCapacity = 2;
      if (value === 'Triple') newCapacity = 3;
      setFormData({ ...formData, roomType: value, maxCapacity: newCapacity });
    } else {
      setFormData({ ...formData, [name]: finalValue });
    }
  };

  const handleImageChange = (e) => setImageFiles(Array.from(e.target.files));

  const openAddForm = () => {
    setFormData(initialFormState); setImageFiles([]); setEditingId(null); setIsFormOpen(true);
  };

  const handleEdit = (room) => {
    setFormData(room); setImageFiles([]); setEditingId(room._id); setIsFormOpen(true);
  };

  const handleView = (room) => {
    setSelectedRoom(room); setIsViewOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this room and its images permanently?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));
    imageFiles.forEach(file => dataToSend.append('images', file));

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post(API_URL, dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setIsFormOpen(false); fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save room.");
    }
  };

  // Helper to check if capacity should be disabled
  const isCapacityDisabled = ['Single', 'Double', 'Triple'].includes(formData.roomType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Room Directory</h2>
          <p className="text-sm text-slate-500">Manage hostel rooms, inventory, and visibility.</p>
        </div>
        <button onClick={openAddForm} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all">
          + Add New Room
        </button>
      </div>
      
      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-semibold">Photo</th>
                <th className="p-4 font-semibold">Room details</th>
                <th className="p-4 font-semibold">Inventory</th>
                <th className="p-4 font-semibold">Rent</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No rooms found.</td></tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      {room.images && room.images.length > 0 ? (
                        <img src={`/roomImage/${room.images[0]}`} alt="Room" className="w-14 h-14 rounded-lg object-cover border border-slate-200 shadow-sm" />
                      ) : (
                        <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400 border border-slate-200">No Img</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-base">Room {room.roomNumber}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{room.roomType} • {room.designatedGender}</div>
                      <div className="text-xs text-slate-500">{room.maxCapacity} Student(s)</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-700">🛏️ {room.bedCount} Bed(s)</div>
                      <div className="text-sm text-slate-700 mt-1">🪑 {room.chairCount} Chair(s)</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">${room.monthlyRent}</td>
                    <td className="p-4">
                      {room.display ? (
                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">Visible</span>
                      ) : (
                        <span className="bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold">Hidden</span>
                      )}
                    </td>
                    <td className="p-4 flex justify-center gap-2 mt-2">
                      <button onClick={() => handleView(room)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition">View</button>
                      <button onClick={() => handleEdit(room)} className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 transition">Edit</button>
                      <button onClick={() => handleDelete(room._id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-extrabold text-slate-800 mb-6">{editingId ? 'Edit Room Details' : 'Add New Room'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Basic Info */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">🏢 Basic Information</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room No *</label><input type="text" name="roomNumber" required value={formData.roomNumber} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Floor *</label><input type="text" name="floorLevel" required value={formData.floorLevel} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender Focus</label><select name="designatedGender" value={formData.designatedGender} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white outline-none"><option>Male</option><option>Female</option><option>Co-ed</option><option>Any</option></select></div>
                </div>
              </div>

              {/* Section 2: Capacity & Inventory */}
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">🛏️ Capacity & Inventory</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-2"><label className="block text-xs font-bold text-indigo-900 uppercase mb-1">Room Type</label>
                    <select name="roomType" value={formData.roomType} onChange={handleInputChange} className="w-full border border-indigo-200 rounded-xl px-4 py-2 bg-white outline-none text-indigo-900 font-medium">
                      <option>Single</option><option>Double</option><option>Triple</option><option>Dormitory</option>
                    </select>
                  </div>
                  <div className="col-span-2"><label className="block text-xs font-bold text-indigo-900 uppercase mb-1">Max Capacity (Students) *</label>
                    <input type="number" name="maxCapacity" required value={formData.maxCapacity} onChange={handleInputChange} disabled={isCapacityDisabled} className={`w-full border rounded-xl px-4 py-2 font-bold ${isCapacityDisabled ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed' : 'bg-white border-indigo-200 text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none'}`} />
                  </div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Beds *</label><input type="number" name="bedCount" min="1" required value={formData.bedCount} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white outline-none" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chairs *</label><input type="number" name="chairCount" min="0" required value={formData.chairCount} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white outline-none" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">AC / Non-AC</label><select name="airConditioning" value={formData.airConditioning} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white outline-none"><option>AC</option><option>Non-AC</option></select></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bathroom</label><select name="bathroomType" value={formData.bathroomType} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white outline-none"><option>Attached</option><option>Common</option></select></div>
                </div>
              </div>

              {/* Section 3: Pricing & Media */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">💰 Pricing</h4>
                  <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Rent ($) *</label><input type="number" name="monthlyRent" required value={formData.monthlyRent} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white outline-none" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Key Money ($) *</label><input type="number" name="keyMoney" required value={formData.keyMoney} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white outline-none" /></div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">📷 Media</h4>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload Images (Max 5)</label>
                    <input type="file" name="images" multiple accept="image/*" onChange={handleImageChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer" />
                  </div>
                  
                  {/* VISIBILITY TOGGLE */}
                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Show to Students?</p>
                      <p className="text-xs text-slate-500">Make this room visible on the student portal.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="display" checked={formData.display} onChange={handleInputChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition">{editingId ? 'Update Room' : 'Save Room'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS & ALL PHOTOS MODAL */}
      {isViewOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-indigo-900 text-white p-6 flex justify-between items-center flex-shrink-0">
              <div>
                <h3 className="text-2xl font-extrabold">Room {selectedRoom.roomNumber}</h3>
                <p className="text-indigo-200">{selectedRoom.roomType} • {selectedRoom.floorLevel}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${selectedRoom.display ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>
                {selectedRoom.display ? '👀 Visible to Students' : '🚫 Hidden'}
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {/* DISPLAY ALL IMAGES */}
              {selectedRoom.images && selectedRoom.images.length > 0 ? (
                <div className="mb-8 grid grid-cols-3 gap-3">
                  {selectedRoom.images.map((imgName, index) => (
                    <img key={index} src={`/roomImage/${imgName}`} alt={`Room ${index}`} className="h-32 w-full object-cover rounded-xl shadow-sm border border-slate-200 hover:opacity-90 transition cursor-pointer" />
                  ))}
                </div>
              ) : (
                <div className="mb-8 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                  <span className="text-2xl mb-1">📷</span>
                  <span className="text-sm font-medium">No photos available</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="space-y-4">
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Capacity</p><p className="font-semibold text-slate-800">{selectedRoom.maxCapacity} Students max</p></div>
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Beds & Chairs</p><p className="font-semibold text-slate-800">{selectedRoom.bedCount} Beds, {selectedRoom.chairCount} Chairs</p></div>
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Gender restriction</p><p className="font-semibold text-slate-800">{selectedRoom.designatedGender}</p></div>
                </div>
                <div className="space-y-4">
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Amenities</p><p className="font-semibold text-slate-800">{selectedRoom.airConditioning}, {selectedRoom.bathroomType} Bath</p></div>
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Monthly Rent</p><p className="font-semibold text-green-600 text-lg">${selectedRoom.monthlyRent}</p></div>
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Key Money</p><p className="font-semibold text-slate-800">${selectedRoom.keyMoney}</p></div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right flex-shrink-0">
              <button onClick={() => setIsViewOpen(false)} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition shadow-sm">Close Window</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}