import React, { useState, useEffect } from 'react';

// Added onClose prop so the modal can be closed via an "X" button
const AddRoom = ({ onRoomAdded, onClose }) => {
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

      setSuccess(`Room ${formData.roomNumber} added successfully! Closing...`);
      
      // Reset Form completely
      setFormData({ block: 'A', roomNumber: '', roomType: 'Shared', capacity: '4', isAC: 'false', beds: '4', tables: '2', chairs: '4', features: '', keyMoney: '', monthlyFee: '' });
      setPhotos([]);
      setPhotoPreviews([]);

      // WAIT 1.5 SECONDS SO THEY SEE THE SUCCESS MESSAGE, THEN CLOSE POPUP
      setTimeout(() => {
        if (onRoomAdded) onRoomAdded();
        if (onClose) onClose();
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // BACKDROP: Dark blurred overlay covering the whole screen
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* MODAL WINDOW: Light blue gradient mix, restricted height for scrolling */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-blue-200 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* STICKY HEADER: Keeps the title and close button visible while scrolling */}
        <div className="flex items-center justify-between px-8 py-6 bg-white/60 backdrop-blur-md border-b border-blue-100 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm text-xl">
              🏗️
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add New Unit</h2>
              <p className="text-blue-600/80 font-bold text-[10px] uppercase tracking-widest mt-0.5">Configuration & Pricing</p>
            </div>
          </div>
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full flex items-center justify-center transition-colors shadow-sm border border-slate-200"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* SCROLLABLE FORM CONTENT */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl mb-6 font-bold shadow-sm">{error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-4 rounded-xl mb-6 font-bold shadow-sm flex items-center gap-2"><span>✅</span> {success}</div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 bg-white/60 p-6 rounded-2xl border border-blue-100 shadow-sm backdrop-blur-sm">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-blue-600/80 mb-2 uppercase tracking-widest">Building Block</label>
                <select name="block" value={formData.block} onChange={handleChange} 
                  className="w-full border border-blue-200 p-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all bg-white/80 text-slate-800 font-bold">
                  <option value="A">Block A</option>
                  <option value="B">Block B</option>
                  <option value="C">Block C</option>
                  <option value="D">Block D</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-blue-600/80 mb-2 uppercase tracking-widest">Room Number</label>
                <input type="number" name="roomNumber" value={formData.roomNumber} onChange={handleChange} placeholder="e.g. 101" min="1"
                  className="w-full border border-blue-200 p-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all bg-white/80 text-slate-800 font-bold" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-blue-600/80 mb-2 uppercase tracking-widest">Room Type</label>
                <select name="roomType" value={formData.roomType} onChange={handleChange} 
                  className="w-full border border-blue-200 p-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all bg-white/80 text-slate-800 font-bold text-sm">
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Shared">Shared</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-blue-600/80 mb-2 uppercase tracking-widest">Capacity (Slots)</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1"
                  disabled={formData.roomType !== 'Shared'}
                  className={`w-full border p-3.5 rounded-xl font-bold focus:outline-none transition-all ${
                    formData.roomType !== 'Shared' ? 'bg-slate-100/50 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white/80 border-blue-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                  }`} />
              </div>
            </div>

            {/* Section 2: Furnishings & AC */}
            <div>
              <h3 className="text-sm font-extrabold text-blue-900 mb-4 border-b border-blue-200/50 pb-2">Room Furnishings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-blue-600/80 mb-2 uppercase tracking-widest">🛏️ Beds</label>
                  <input type="number" name="beds" value={formData.beds} onChange={handleChange} min="1"
                    disabled={formData.roomType !== 'Shared'}
                    className={`w-full border p-3 rounded-xl font-bold text-center focus:outline-none shadow-sm ${formData.roomType !== 'Shared' ? 'bg-slate-100/50 border-slate-200 text-slate-400' : 'bg-white/80 border-blue-200 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'}`} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-blue-600/80 mb-2 uppercase tracking-widest">🪑 Chairs</label>
                  <input type="number" name="chairs" value={formData.chairs} onChange={handleChange} min="0"
                    className="w-full border border-blue-200 bg-white/80 p-3 rounded-xl font-bold text-center text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-blue-600/80 mb-2 uppercase tracking-widest">🪵 Tables</label>
                  <input type="number" name="tables" value={formData.tables} onChange={handleChange} min="0"
                    className="w-full border border-blue-200 bg-white/80 p-3 rounded-xl font-bold text-center text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-blue-600/80 mb-2 uppercase tracking-widest">❄️ Climate</label>
                  <select name="isAC" value={formData.isAC} onChange={handleChange} 
                    className="w-full border border-blue-200 bg-white/80 p-3 rounded-xl font-bold text-center text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm">
                    <option value="true">AC Room</option>
                    <option value="false">Non-AC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Financials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-600/5 border border-blue-200/60 p-6 rounded-2xl backdrop-blur-sm">
              <div>
                <label className="block text-[10px] font-bold text-blue-700 mb-2 uppercase tracking-widest">Key Money (Deposit)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-blue-400 font-bold">Rs.</span>
                  <input type="number" name="keyMoney" value={formData.keyMoney} onChange={handleChange} min="0" placeholder="0"
                    className="w-full border border-blue-200 p-3.5 pl-12 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm bg-white/90 font-black text-slate-800 text-lg" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-700 mb-2 uppercase tracking-widest">Monthly Rent</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-blue-400 font-bold">Rs.</span>
                  <input type="number" name="monthlyFee" value={formData.monthlyFee} onChange={handleChange} min="0" placeholder="0"
                    className="w-full border border-blue-200 p-3.5 pl-12 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm bg-white/90 font-black text-slate-800 text-lg" />
                </div>
              </div>
            </div>

            {/* Section 4: Image Upload */}
            <div>
               <label className="block text-[10px] font-bold text-blue-600/80 mb-2 uppercase tracking-widest">Upload Room Photos</label>
               <div className="border-2 border-dashed border-blue-300/50 bg-white/50 rounded-2xl p-8 text-center hover:bg-white/80 transition-colors relative backdrop-blur-sm">
                  <input type="file" id="file-upload" name="photos" multiple accept="image/*" onChange={handleFileChange} 
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer" />
                  
                  {/* Image Previews */}
                  {photoPreviews.length > 0 && (
                    <div className="mt-6 flex gap-4 overflow-x-auto pb-2 justify-center">
                      {photoPreviews.map((src, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-blue-200">
                          <img src={src} alt={`Preview ${idx}`} className="h-28 w-28 object-cover transition-transform group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4 pt-4 border-t border-blue-200/50">
              <button 
                type="button" 
                onClick={onClose}
                className="w-1/3 bg-white text-slate-600 border border-slate-200 font-bold text-base py-4 rounded-xl hover:bg-slate-50 transition-all duration-300">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="w-2/3 bg-blue-600 text-white font-extrabold text-lg py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-blue-600/25">
                {isSubmitting ? 'Saving Room...' : '+ Finalize & Save Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;