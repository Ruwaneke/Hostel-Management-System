import React, { useState, useEffect } from 'react';

// Added onRoomAdded prop to trigger the tab switch
const AddRoom = ({ onRoomAdded }) => {
  const [formData, setFormData] = useState({
    block: 'A',
    roomNumber: '',
    roomType: 'Shared',
    capacity: '4',
    isAC: 'false',
    beds: '4',
    tables: '2',
    chairs: '4',
    features: '',
    keyMoney: '',
    monthlyFee: ''
  });
  
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-lock Capacity and Beds based on Room Type
  useEffect(() => {
    if (formData.roomType === 'Single') {
        setFormData(prev => ({ ...prev, capacity: '1', beds: '1' }));
    } else if (formData.roomType === 'Double') {
        setFormData(prev => ({ ...prev, capacity: '2', beds: '2' }));
    } else if (formData.roomType === 'Triple') {
        setFormData(prev => ({ ...prev, capacity: '3', beds: '3' }));
    }
  }, [formData.roomType]);

  // Clean up memory from image previews
  useEffect(() => {
    return () => photoPreviews.forEach(url => URL.revokeObjectURL(url));
  }, [photoPreviews]);

  const handleChange = (e) => {
    if (e.target.type === 'number' && e.target.value < 0) return; 
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!formData.roomNumber || !formData.keyMoney || !formData.monthlyFee) {
      setError('Please fill all required numeric fields.');
      setIsSubmitting(false);
      return;
    }
    if (photos.length === 0) {
      setError('Please select at least one room photo to upload.');
      setIsSubmitting(false);
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    for (let i = 0; i < photos.length; i++) submitData.append('photos', photos[i]);

    try {
      const response = await fetch('http://localhost:5025/api/rooms', {
        method: 'POST',
        body: submitData 
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      setSuccess(`Room ${formData.roomNumber} added successfully! Redirecting...`);
      
      // Reset Form completely
      setFormData({ block: 'A', roomNumber: '', roomType: 'Shared', capacity: '4', isAC: 'false', beds: '4', tables: '2', chairs: '4', features: '', keyMoney: '', monthlyFee: '' });
      setPhotos([]);
      setPhotoPreviews([]);
      document.getElementById('file-upload').value = "";

      // WAIT 1.5 SECONDS SO THEY SEE THE SUCCESS MESSAGE, THEN SWITCH TABS
      setTimeout(() => {
        if (onRoomAdded) onRoomAdded();
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] p-6 min-h-full flex justify-center items-start animate-in fade-in duration-500">
      <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-200 w-full max-w-4xl transition-all">
        
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8">
          <div className="bg-blue-50 text-blue-600 w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm text-2xl">
            🏗️
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Add New Unit</h2>
            <p className="text-slate-500 font-medium mt-1">Configure room details, capacity, and pricing.</p>
          </div>
        </div>

        {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl mb-6 font-bold shadow-sm">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-4 rounded-xl mb-6 font-bold shadow-sm flex items-center gap-2"><span>✅</span> {success}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Building Block</label>
              <select name="block" value={formData.block} onChange={handleChange} 
                className="w-full border border-slate-200 p-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white text-slate-800 font-bold shadow-sm">
                <option value="A">Block A</option>
                <option value="B">Block B</option>
                <option value="C">Block C</option>
                <option value="D">Block D</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Room Number</label>
              <input type="number" name="roomNumber" value={formData.roomNumber} onChange={handleChange} placeholder="e.g. 101" min="1"
                className="w-full border border-slate-200 p-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white text-slate-800 font-bold shadow-sm" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Room Type</label>
              <select name="roomType" value={formData.roomType} onChange={handleChange} 
                className="w-full border border-slate-200 p-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white text-slate-800 font-bold shadow-sm text-sm">
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Capacity (Slots)</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1"
                disabled={formData.roomType !== 'Shared'}
                className={`w-full border p-3.5 rounded-xl font-bold focus:outline-none transition-all shadow-sm ${
                  formData.roomType !== 'Shared' ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                }`} />
            </div>
          </div>

          {/* Section 2: Furnishings & AC */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 mb-4 border-b border-slate-100 pb-2">Room Furnishings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">🛏️ Beds</label>
                <input type="number" name="beds" value={formData.beds} onChange={handleChange} min="1"
                  disabled={formData.roomType !== 'Shared'}
                  className={`w-full border p-3 rounded-xl font-bold text-center focus:outline-none shadow-sm ${formData.roomType !== 'Shared' ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">🪑 Chairs</label>
                <input type="number" name="chairs" value={formData.chairs} onChange={handleChange} min="0"
                  className="w-full border border-slate-200 p-3 rounded-xl font-bold text-center text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">🪵 Tables</label>
                <input type="number" name="tables" value={formData.tables} onChange={handleChange} min="0"
                  className="w-full border border-slate-200 p-3 rounded-xl font-bold text-center text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">❄️ Climate</label>
                <select name="isAC" value={formData.isAC} onChange={handleChange} 
                  className="w-full border border-slate-200 p-3 rounded-xl font-bold text-center text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm">
                  <option value="true">AC Room</option>
                  <option value="false">Non-AC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Financials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 border border-blue-100 p-6 rounded-2xl">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Key Money (Deposit)</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">Rs.</span>
                <input type="number" name="keyMoney" value={formData.keyMoney} onChange={handleChange} min="0" placeholder="0"
                  className="w-full border border-slate-200 p-3.5 pl-12 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm bg-white font-black text-slate-800 text-lg" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Monthly Rent</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">Rs.</span>
                <input type="number" name="monthlyFee" value={formData.monthlyFee} onChange={handleChange} min="0" placeholder="0"
                  className="w-full border border-slate-200 p-3.5 pl-12 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm bg-white font-black text-slate-800 text-lg" />
              </div>
            </div>
          </div>

          {/* Section 4: Image Upload */}
          <div>
             <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Upload Room Photos</label>
             <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors bg-white relative">
                <input type="file" id="file-upload" name="photos" multiple accept="image/*" onChange={handleFileChange} 
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer" />
                
                {/* Image Previews */}
                {photoPreviews.length > 0 && (
                  <div className="mt-6 flex gap-4 overflow-x-auto pb-2 justify-center">
                    {photoPreviews.map((src, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200">
                        <img src={src} alt={`Preview ${idx}`} className="h-28 w-28 object-cover transition-transform group-hover:scale-110" />
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-extrabold text-lg py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-300 mt-8 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
            {isSubmitting ? 'Saving Room...' : '+ Finalize & Save Room'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;