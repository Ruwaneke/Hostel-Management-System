import React, { useState } from 'react';
import axios from 'axios';

export default function LaundryBookingForm({ user, roomNumber, settings }) {
  const [formData, setFormData] = useState({
    phone: '',
    serviceType: 'Wash and Iron', 
    packageType: 'One Day Service',
    pieces: 1,
    specialInstructions: '',
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Advanced Price Calculation based on the new Engine
  const calculateBasePrice = () => {
    if (!settings) return 0;
    if (formData.serviceType === 'Wash Only') return settings.washOnlyPrice || 0;
    if (formData.serviceType === 'Wash and Dry') return settings.washAndDryPrice || 0;
    if (formData.serviceType === 'Iron Only') return settings.ironOnlyPrice || 0;
    if (formData.serviceType === 'Wash and Iron') return settings.washAndIronPrice || 0;
    if (formData.serviceType === 'Dry Clean') return settings.dryCleanPrice || 0;
    return 0;
  };

  const calculateExtraPremium = () => {
    if (!settings) return 0;
    if (formData.packageType === 'One Day Service') return settings.oneDayExtra || 0;
    if (formData.packageType === 'Two Day Service') return settings.twoDayExtra || 0;
    if (formData.packageType === 'Weekly Service') return settings.weeklyExtra || 0;
    return 0;
  };

  const calculateTotal = () => {
    if (!settings) return 0;
    const pricePerPiece = calculateBasePrice() + calculateExtraPremium();
    return (pricePerPiece * formData.pieces) + (settings.deliveryCharge || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roomNumber === "Not Assigned") {
      alert("You must book a room before you can request laundry services!");
      return;
    }

    setIsSubmitting(true);
    
    const submitData = new FormData();
    submitData.append('studentId', user._id);
    submitData.append('studentName', user.name);
    submitData.append('studentEmail', user.email);
    submitData.append('studentPhone', formData.phone);
    submitData.append('roomNumber', roomNumber);
    submitData.append('serviceType', formData.serviceType);
    submitData.append('packageType', formData.packageType);
    submitData.append('pieces', formData.pieces);
    submitData.append('specialInstructions', formData.specialInstructions);
    
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      const res = await axios.post('http://localhost:5025/api/laundry/create-checkout', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      window.location.href = res.data.url; 
    } catch (error) {
      console.error(error);
      alert("Failed to initiate payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    { name: 'Wash Only', price: settings?.washOnlyPrice },
    { name: 'Wash and Dry', price: settings?.washAndDryPrice },
    { name: 'Iron Only', price: settings?.ironOnlyPrice },
    { name: 'Wash and Iron', price: settings?.washAndIronPrice },
    { name: 'Dry Clean', price: settings?.dryCleanPrice }
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
      <h3 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Laundry Request Form</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: PERSONAL DETAILS */}
        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider mb-2 flex items-center gap-2"><span>👤</span> Student Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <input type="text" value={user?.name || ''} readOnly className="w-full border border-slate-200 p-3 rounded-xl bg-slate-100 text-slate-500 font-bold cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Room Number</label>
              <input type="text" value={roomNumber} readOnly className="w-full border border-slate-200 p-3 rounded-xl bg-slate-100 text-slate-500 font-black cursor-not-allowed" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Phone Number <span className="text-rose-500">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="e.g. +94 77 123 4567"
                className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brand-navy transition-colors bg-white" />
            </div>
          </div>
        </div>

        {/* SECTION 2: SERVICE TYPE */}
        <div>
          <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider mb-3 flex items-center gap-2"><span>🧼</span> Select Service Type (Base Price)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {serviceOptions.map((opt) => (
              <label key={opt.name} className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-colors text-center ${formData.serviceType === opt.name ? 'border-brand-navy bg-brand-navy text-white shadow-md' : 'border-slate-200 text-slate-600 hover:border-brand-navy/50'}`}>
                <input type="radio" name="serviceType" value={opt.name} checked={formData.serviceType === opt.name} onChange={handleInputChange} className="hidden" />
                <span className="font-bold text-sm mb-1">{opt.name}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider ${formData.serviceType === opt.name ? 'text-brand-gold' : 'text-brand-navy'}`}>Rs. {opt.price || 0}/pc</span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 3: PACKAGE SPEED */}
        <div>
          <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider mb-3 flex items-center gap-2"><span>📦</span> Turnaround Speed (Premium Extra)</h4>
          <div className="space-y-3">
            {[
              { name: 'One Day Service', price: settings?.oneDayExtra || 0, desc: "Fast 24-hour turnaround" },
              { name: 'Two Day Service', price: settings?.twoDayExtra || 0, desc: "Standard 48-hour turnaround" },
              { name: 'Weekly Service',  price: settings?.weeklyExtra || 0, desc: "Standard batch, no rush" }
            ].map((pkg) => (
              <label key={pkg.name} className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.packageType === pkg.name ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="packageType" value={pkg.name} checked={formData.packageType === pkg.name} onChange={handleInputChange} className="w-5 h-5 text-amber-500 focus:ring-amber-500" />
                  <div>
                    <div className="font-bold text-slate-800">{pkg.name}</div>
                    <div className="text-xs text-slate-500">{pkg.desc}</div>
                  </div>
                </div>
                <div className="font-black text-amber-600 bg-amber-100/50 px-3 py-1 rounded-lg">+{pkg.price} <span className="text-[10px] font-bold uppercase">Rs/pc</span></div>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 4: QUANTITY, INSTRUCTIONS & IMAGE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider mb-3 flex items-center gap-2"><span>🔢</span> Number of Pieces</h4>
            <input type="number" name="pieces" min="1" value={formData.pieces} onChange={handleInputChange} required
              className="w-full border-2 border-slate-200 p-4 rounded-xl font-black text-2xl text-center text-brand-navy focus:outline-none focus:border-brand-navy transition-colors bg-white" />
          </div>

          <div>
            <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider mb-1 flex items-center gap-2"><span>📸</span> Attach Photo <span className="text-[10px] font-bold uppercase text-slate-400">(Optional)</span></h4>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mt-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider mb-2 flex items-center gap-2"><span>📝</span> Special Instructions <span className="text-[10px] font-bold uppercase text-slate-400">(Optional)</span></h4>
          <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleInputChange} placeholder="E.g., Please use gentle detergent, mind the red stain..."
            className="w-full border-2 border-slate-200 p-3 rounded-xl font-medium text-sm focus:outline-none focus:border-brand-navy transition-colors resize-none h-20 bg-white" />
        </div>
        
        {imagePreview && (
          <div className="h-40 w-full rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Checkout Summary Box */}
        <div className="bg-gradient-to-br from-brand-navy to-blue-900 p-6 rounded-2xl shadow-lg text-white mt-8 border border-blue-800">
          
          <div className="space-y-3 mb-4 pb-4 border-b border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-200">Base Price ({formData.pieces} pcs × Rs.{calculateBasePrice()})</span>
              <span className="font-bold">Rs. {calculateBasePrice() * formData.pieces}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-200">Speed Premium ({formData.pieces} pcs × Rs.{calculateExtraPremium()})</span>
              <span className="font-bold">Rs. {calculateExtraPremium() * formData.pieces}</span>
            </div>
            <div className="flex justify-between items-center text-blue-300">
              <span className="text-sm font-medium">Flat Pickup & Delivery Fee</span>
              <span className="font-bold">Rs. {settings?.deliveryCharge || 0}</span>
            </div>
          </div>

          <div className="flex justify-between items-end mb-6">
            <span className="font-bold text-sm uppercase tracking-wider text-blue-100">Total Due</span>
            <span className="text-4xl font-black text-brand-gold drop-shadow-md">Rs. {calculateTotal().toLocaleString()}</span>
          </div>

          <button type="submit" disabled={isSubmitting || roomNumber === "Not Assigned"} className="w-full bg-brand-gold hover:bg-[#e5920f] text-brand-black font-black text-lg py-4 rounded-xl transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
            {isSubmitting ? "Processing Transaction..." : <><span>💳</span> Pay Securely with Stripe</>}
          </button>
        </div>
      </form>
    </div>
  );
}