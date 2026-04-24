import React, { useState } from 'react';
import axios from 'axios';

export default function LaundryBookingForm({ user, roomNumber, settings }) {
  const [formData, setFormData] = useState({
    phone: '',
    serviceType: 'Wash and Iron',
    packageType: 'Standard',
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
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number!");
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
    if (formData.image) submitData.append('image', formData.image);

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
    { name: 'Wash and Dry', price: settings?.washAndDryPrice },
    { name: 'Iron Only', price: settings?.ironOnlyPrice },
    { name: 'Wash and Iron', price: settings?.washAndIronPrice },
    { name: 'Dry Clean', price: settings?.dryCleanPrice },
  ];

  return (
    <div className="min-h-screen bg-brand-platinum/20 relative py-12 px-4 selection:bg-brand-gold/30 selection:text-brand-navy text-brand-black">

      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-platinum/50 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-80 h-80 bg-brand-navy/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight mb-4">
            Laundry <span className="text-brand-gold drop-shadow-sm">Request</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Book a wash, select your service type, and track your clothes.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-brand-white rounded-3xl p-8 sm:p-10 border border-brand-platinum/50 shadow-lg shadow-brand-platinum/20 hover:shadow-xl transition-shadow duration-300">

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Student Details */}
            <div>
              <label className="block text-brand-navy font-black text-lg mb-4 tracking-tight">
                Student Details
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-500 text-sm mb-2 font-medium">Full Name</p>
                  <input
                    type="text"
                    value={user?.name || ''}
                    readOnly
                    className="w-full px-5 py-4 bg-brand-platinum/10 border border-brand-platinum/30 rounded-2xl text-slate-500 font-bold cursor-not-allowed shadow-sm"
                  />
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-2 font-medium">Room Number</p>
                  <input
                    type="text"
                    value={roomNumber}
                    readOnly
                    className="w-full px-5 py-4 bg-brand-platinum/10 border border-brand-platinum/30 rounded-2xl text-slate-500 font-bold cursor-not-allowed shadow-sm"
                  />
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-2 font-medium">Phone Number <span className="text-rose-500">*</span></p>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: val });
                    }}
                    required
                    placeholder="e.g. 0771234567"
                    className="w-full border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brand-navy transition-colors bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-brand-navy font-black text-lg mb-4 tracking-tight">
                What service do you need? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceOptions.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceType: opt.name })}
                    className={`p-4 rounded-2xl transition-all duration-300 border flex items-center gap-3 ${
                      formData.serviceType === opt.name
                        ? 'bg-brand-navy border-brand-navy text-brand-gold shadow-md ring-1 ring-brand-navy'
                        : 'bg-brand-white/60 border-brand-platinum/50 text-slate-600 hover:bg-brand-white hover:border-brand-platinum hover:shadow-sm'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-sm">{opt.name}</div>
                      <div className={`text-[10px] font-black uppercase tracking-wider ${formData.serviceType === opt.name ? 'text-brand-gold' : 'text-brand-navy'}`}>
                        Rs. {opt.price || 0}/pc
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Turnaround Speed */}
            <div>
              <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider mb-3">How fast do you need it?</h4>
              <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.packageType === 'One Day Service' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'}`}>
                <input
                  type="checkbox"
                  checked={formData.packageType === 'One Day Service'}
                  onChange={(e) => {
                    const newPackage = e.target.checked ? 'One Day Service' : 'Standard';
                    setFormData({ ...formData, packageType: newPackage, pieces: 1 });
                  }}
                  className="w-5 h-5 accent-amber-500"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-800">One Day Service</div>
                  <div className="text-xs text-slate-500">Fast 24-hour turnaround</div>
                </div>
                <div className="font-black text-amber-600 bg-amber-100/50 px-3 py-1 rounded-lg">
                  +{settings?.oneDayExtra || 0} <span className="text-[10px] font-bold uppercase">Rs/pc</span>
                </div>
              </label>
            </div>

            {/* Number of Pieces */}
            <div>
              <label className="block text-brand-navy font-bold text-lg mb-2">
                Number of Pieces <span className="text-rose-500">*</span>
              </label>
              <p className="text-slate-500 text-sm mb-3 font-medium">
                How many clothing items are you sending?{' '}
                <span className="font-bold text-brand-navy">
                  (Max: {formData.packageType === 'One Day Service' ? 2 : 8})
                </span>
              </p>
              <input
                type="number"
                name="pieces"
                min="1"
                max={formData.packageType === 'One Day Service' ? 2 : 8}
                value={formData.pieces}
                onChange={(e) => {
                  const max = formData.packageType === 'One Day Service' ? 2 : 8;
                  const val = Math.min(Math.max(1, parseInt(e.target.value) || 1), max);
                  setFormData({ ...formData, pieces: val });
                }}
                required
                className="w-full px-5 py-4 bg-brand-platinum/10 border border-brand-platinum/30 rounded-2xl font-black text-2xl text-center text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all shadow-sm"
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-brand-navy font-bold text-lg mb-2">
                Special Instructions <span className="text-slate-400 text-sm font-normal ml-2">(Optional)</span>
              </label>
              <p className="text-slate-500 text-sm mb-3 font-medium">Any specific care requirements or notes for our team.</p>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                placeholder="Please use gentle detergent, mind the red stain..."
                rows="3"
                className="w-full px-5 py-4 bg-brand-platinum/10 border border-brand-platinum/30 rounded-2xl text-brand-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all resize-none shadow-sm"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-brand-navy font-bold text-lg mb-2">
                Attach Photo <span className="text-slate-400 text-sm font-normal ml-2">(Optional)</span>
              </label>
              <p className="text-slate-500 text-sm mb-3 font-medium">Upload a photo of your clothes so we can handle them with care.</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-5 py-4 bg-brand-platinum/10 border border-brand-platinum/30 rounded-2xl text-brand-black file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-brand-navy file:text-brand-gold hover:file:bg-brand-navy/90 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-4 relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-32 rounded-xl border border-slate-200 object-cover shadow-sm" />
                  <button
                    type="button"
                    onClick={() => { setFormData({ ...formData, image: null }); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md hover:bg-rose-600 transition"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Checkout Summary */}
            <div className="bg-gradient-to-br from-brand-navy to-blue-900 p-6 rounded-2xl shadow-lg text-white border border-blue-800">
              <h4 className="font-black text-brand-gold uppercase tracking-wider text-sm mb-4">Order Summary</h4>
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
            </div>

   <div className="flex justify-center items-center gap-4 pt-6 mt-2 border-t border-brand-platinum/30">

              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-48 px-6 py-4 bg-brand-white text-brand-navy font-bold rounded-2xl border border-brand-platinum/50 hover:bg-brand-platinum/20 transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || roomNumber === "Not Assigned"}
                className="w-48 bg-brand-gold hover:bg-[#e5920f] disabled:bg-brand-gold/50 text-brand-black font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    <span>Pay Securely</span>
                  </>
                )}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}