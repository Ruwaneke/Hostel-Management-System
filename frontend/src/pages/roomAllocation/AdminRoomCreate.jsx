import React, { useState, useEffect } from 'react';
import axios from 'axios';

const roomTypeDefaults = {
  Single: { maxCapacity: '1', bedCount: '1' },
  Double: { maxCapacity: '2', bedCount: '2' },
  Triple: { maxCapacity: '3', bedCount: '3' },
  Shared: { maxCapacity: '4', bedCount: '4' }
};

const AdminRoomCreate = ({ onSuccess, editData }) => {
  // 1. Initialize state with editData if it exists, otherwise use defaults
  const [formData, setFormData] = useState({
    block: editData?.block || 'A',
    roomNumber: editData?.roomNumber || '',
    floorLevel: editData?.floorLevel || 'Ground',
    roomType: editData?.roomType || 'Single',
    designatedGender: editData?.designatedGender || 'All',
    airConditioning: editData?.airConditioning || 'AC',
    bathroomType: editData?.bathroomType || 'Attached',
    bedCount: editData?.bedCount || roomTypeDefaults.Single.bedCount,
    tableCount: editData?.tableCount || '',
    chairCount: editData?.chairCount || '',
    monthlyRent: editData?.monthlyRent || '',
    keyMoney: editData?.keyMoney || '',
    maxCapacity: editData?.maxCapacity || roomTypeDefaults.Single.maxCapacity,
    description: editData?.description || '',
    status: editData?.status || 'Available',
    display: editData !== undefined ? String(editData.display) : 'true'
  });
  
  const [imageFile, setImageFile] = useState(null);
  // 2. If editing and there is an image, set the preview to the existing image
  const [imagePreview, setImagePreview] = useState(editData?.image ? `/roomImage/${editData.image}` : null); 
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'roomNumber') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNums });
      return;
    }

    if (name === 'roomType') {
      const defaults = roomTypeDefaults[value] || roomTypeDefaults.Single;
      setFormData({
        ...formData,
        roomType: value,
        maxCapacity: defaults.maxCapacity,
        bedCount: defaults.bedCount
      });
      return;
    }

    if ((name === 'maxCapacity' || name === 'bedCount') && formData.roomType === 'Shared') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums === '') {
        setFormData({ ...formData, [name]: '' });
        return;
      }
      const numericValue = Math.max(4, parseInt(onlyNums, 10));
      setFormData({ ...formData, [name]: String(numericValue) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      let response;
      // 3. Switch between PUT (Update) and POST (Create)
      if (editData) {
        response = await axios.put(`http://localhost:5025/api/rooms/${editData._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Room updated successfully!');
      } else {
        response = await axios.post('http://localhost:5025/api/rooms/create', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Room created successfully!');
      }
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Failed to save room');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      {message && <p className="mb-6 p-4 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Basic Info */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Block</label>
              <select name="block" value={formData.block} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-lg bg-white">
                <option value="A">Block A</option>
                <option value="B">Block B</option>
                <option value="C">Block C</option>
                <option value="D">Block D</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Room Number</label>
              {/* Disable room number editing if updating to prevent unique ID conflicts */}
              <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} placeholder="Numbers only" required disabled={!!editData} className={`w-full border border-slate-300 p-2.5 rounded-lg ${editData ? 'bg-slate-200 cursor-not-allowed' : ''}`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Floor Level</label>
              <select name="floorLevel" value={formData.floorLevel} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-lg bg-white">
                <option value="Ground">Ground</option>
                <option value="1st Floor">1st Floor</option>
                <option value="2nd Floor">2nd Floor</option>
                <option value="3rd Floor">3rd Floor</option>
                <option value="4th Floor">4th Floor</option>
                <option value="5th Floor">5th Floor</option>
                <option value="6th Floor">6th Floor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Room Type</label>
              <select name="roomType" value={formData.roomType} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-lg bg-white">
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
              <select name="designatedGender" value={formData.designatedGender} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-lg bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="All">All (Default)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Max Capacity</label>
              {formData.roomType === 'Shared' ? (
                <input type="number" min="4" name="maxCapacity" value={formData.maxCapacity} onChange={handleInputChange} placeholder="4 or above" required className="w-full border border-slate-300 p-2.5 rounded-lg" />
              ) : (
                <input type="number" min="1" name="maxCapacity" value={formData.maxCapacity} readOnly required className="w-full border border-slate-300 p-2.5 rounded-lg bg-slate-100 text-slate-600" />
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Furniture & Amenities */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Furniture & Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Beds</label>
              {formData.roomType === 'Shared' ? (
                <input type="number" min="4" name="bedCount" value={formData.bedCount} onChange={handleInputChange} placeholder="4 or above" required className="w-full border border-slate-300 p-2.5 rounded-lg" />
              ) : (
                <input type="number" min="1" name="bedCount" value={formData.bedCount} readOnly required className="w-full border border-slate-300 p-2.5 rounded-lg bg-slate-100 text-slate-600" />
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tables</label>
              <input type="number" min="0" name="tableCount" value={formData.tableCount} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Chairs</label>
              <input type="number" min="0" name="chairCount" value={formData.chairCount} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Air Conditioning</label>
              <select name="airConditioning" value={formData.airConditioning} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-lg bg-white">
                <option value="AC">AC</option>
                <option value="Non AC">Non AC</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Bathroom Type</label>
              <select name="bathroomType" value={formData.bathroomType} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-lg bg-white">
                <option value="Attached">Attached</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Settings */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pricing</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Monthly Rent (Rs.)</label>
              <input type="number" min="1" name="monthlyRent" value={formData.monthlyRent} onChange={handleInputChange} placeholder="Min: 1" required className="w-full border border-slate-300 p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Key Money (Rs.)</label>
              <input type="number" min="1" name="keyMoney" value={formData.keyMoney} onChange={handleInputChange} placeholder="Min: 1" required className="w-full border border-slate-300 p-2.5 rounded-lg" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Settings</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Room Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} required className="w-full border border-slate-300 p-2.5 rounded-lg bg-white">
                <option value="Available">Available</option>
                <option value="Full">Full</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Display to Users?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="display" value="true" checked={formData.display === 'true'} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                  Yes (Show)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="display" value="false" checked={formData.display === 'false'} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                  No (Hide)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Image Upload & Description */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Add any extra details here..." className="w-full border border-slate-300 p-3 rounded-lg h-32 resize-none"></textarea>
          </div>
          
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Room Photo {editData && "(Leave blank to keep current)"}</label>
            <input type="file" name="image" onChange={handleFileChange} accept="image/*" className="w-full border border-slate-300 p-2 rounded-lg bg-white mb-3" />
            
            {/* Image Preview Box */}
            <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400 text-sm font-medium">No image selected</span>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-lg">
          {editData ? "Update Room Details" : "Save Room Structure"}
        </button>
      </form>
    </div>
  );
};

export default AdminRoomCreate;