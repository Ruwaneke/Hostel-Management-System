import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function UserBookingCheckout() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    agreedToTerms: false,
    nicNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    expectedMoveInDate: '',
    specialRequests: '',
  });

  // Validation Errors State
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5025/api/rooms/${roomId}`);
        setRoom(response.data);
      } catch (err) {
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const validateStep3AndProceed = () => {
    const newErrors = {};
    const nicRegex = /^([0-9]{9}[vV]|[0-9]{12})$/;
    if (!nicRegex.test(formData.nicNumber)) {
      newErrors.nicNumber = "Invalid NIC. Must be 12 digits or 9 digits followed by 'V'.";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = "Invalid phone. Must be exactly 10 digits (e.g., 0712345678).";
    }
    if (!formData.expectedMoveInDate) {
      newErrors.expectedMoveInDate = "Please select a move-in date.";
    } else {
      const selectedDate = new Date(formData.expectedMoveInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.expectedMoveInDate = "Move-in date cannot be in the past.";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      nextStep();
    }
  };

  // --- UPDATED PAYMENT HANDLER ---
  const handlePayment = async () => {
    try {
      const payload = {
        userId: user._id,
        name: user.name,   // 🔥 ADDED REAL NAME
        email: user.email, // 🔥 ADDED REAL EMAIL
        roomId: room._id,
        ...formData
      };

      const response = await axios.post('http://localhost:5025/api/bookings/create-checkout', payload);

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
    }
  };

  if (loading || !room) return <div className="min-h-screen bg-[#e5e5e5] flex justify-center items-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-navy border-t-brand-gold"></div></div>;

  const todayFormatted = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#e5e5e5] text-brand-black pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="mb-10">
          <div className="flex justify-between mb-2 px-2">
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${step >= 1 ? 'text-brand-navy' : 'text-slate-400'}`}>1. Details</span>
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${step >= 2 ? 'text-brand-navy' : 'text-slate-400'}`}>2. Rules</span>
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${step >= 3 ? 'text-brand-navy' : 'text-slate-400'}`}>3. Student Info</span>
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${step >= 4 ? 'text-brand-navy' : 'text-slate-400'}`}>4. Payment</span>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-brand-navy to-blue-500 transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden relative min-h-[500px]">
          {step === 1 && (
            <div className="animate-in fade-in duration-500 bg-slate-50 pb-8">
              <div className="h-72 bg-slate-200 relative">
                {room.image ? <img src={`/roomImage/${room.image}`} className="w-full h-full object-cover" alt="Room" /> : <div className="w-full h-full flex justify-center items-center text-6xl text-slate-400">🛏️</div>}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                <div className="absolute top-6 right-6"><span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-wider">Block {room.block}</span></div>
              </div>
              <div className="max-w-2xl mx-auto -mt-20 relative z-10 bg-white rounded-3xl shadow-lg border border-slate-100 p-8 mb-8">
                <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-6">
                  <div><p className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">Selected Room</p><h2 className="text-4xl font-black text-brand-navy">Room {room.roomNumber}</h2></div>
                  <div className="text-right"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Rent</p><p className="text-2xl font-black text-blue-600">Rs. {room.monthlyRent?.toLocaleString()}</p></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="text-2xl mb-2">🚻</span><span className="text-[10px] font-bold text-slate-500 uppercase">{room.designatedGender}</span></div>
                  <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="text-2xl mb-2">❄️</span><span className="text-[10px] font-bold text-slate-500 uppercase">{room.airConditioning}</span></div>
                  <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="text-2xl mb-2">👥</span><span className="text-[10px] font-bold text-slate-500 uppercase">{room.maxCapacity} Max</span></div>
                  <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="text-2xl mb-2">🚿</span><span className="text-[10px] font-bold text-slate-500 uppercase">{room.bathroomType}</span></div>
                </div>
              </div>
              <div className="px-8 flex justify-between items-center max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="text-slate-500 font-bold px-6 py-3 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                <button onClick={nextStep} className="bg-brand-navy text-white font-black text-lg px-10 py-4 rounded-2xl hover:bg-slate-800 transition-transform hover:-translate-y-1 shadow-xl shadow-brand-navy/20 flex items-center gap-2">Confirm Selection <span>→</span></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8"><h2 className="text-3xl font-black text-brand-navy mb-2">Hostel Agreement</h2><p className="text-slate-500 font-medium text-sm">Please read and accept our community guidelines.</p></div>
              <div className="h-[350px] overflow-y-auto pr-4 mb-8 custom-scrollbar space-y-4">
                {[
                  { icon: "💰", title: "Rent Payments", desc: "Monthly rent must be cleared by the 5th of every month." },
                  { icon: "🛡️", title: "Key Money", desc: "Deposit is fully refundable upon official departure." },
                  { icon: "🤫", title: "Conduct & Noise", desc: "Strict quiet hours: 10:00 PM - 6:00 AM." },
                  { icon: "🚭", title: "Prohibited Items", desc: "Violations result in expulsion." },
                ].map((rule, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl"><div className="text-2xl">{rule.icon}</div><div><h4 className="font-bold text-slate-800 text-sm mb-1">{rule.title}</h4><p className="text-xs text-slate-600 leading-relaxed">{rule.desc}</p></div></div>
                ))}
              </div>
              <label className="flex items-center gap-4 p-5 border-2 border-brand-platinum rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleInputChange} className="w-6 h-6 rounded border-slate-300 text-brand-navy focus:ring-brand-navy" />
                <span className="font-bold text-brand-navy">I have read, understood, and agree to all rules.</span>
              </label>
              <div className="flex justify-between items-center mt-8">
                <button onClick={prevStep} className="text-slate-500 font-bold px-6 py-3 hover:bg-slate-100 rounded-xl transition-colors">← Back</button>
                <button onClick={nextStep} disabled={!formData.agreedToTerms} className={`font-black text-lg px-10 py-4 rounded-2xl transition-all shadow-lg flex items-center gap-2 ${formData.agreedToTerms ? 'bg-brand-navy text-white hover:bg-slate-800 hover:-translate-y-1 shadow-brand-navy/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Agree & Continue <span>→</span></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-brand-navy mb-2">Student Details</h2>
              <p className="text-slate-500 text-sm mb-8">Please provide your identification and emergency contacts.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">NIC / Passport Number <span className="text-rose-500">*</span></label>
                  <input type="text" name="nicNumber" value={formData.nicNumber} onChange={handleInputChange} placeholder="e.g. 199912345V" className={`w-full border-2 p-4 rounded-xl focus:outline-none transition-colors ${errors.nicNumber ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50 focus:border-brand-navy'}`} />
                  {errors.nicNumber && <p className="text-rose-500 text-xs font-bold mt-2">{errors.nicNumber}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Emergency Contact Name <span className="text-rose-500">*</span></label>
                    <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} placeholder="Guardian's Name" className={`w-full border-2 p-4 rounded-xl focus:outline-none transition-colors ${errors.emergencyContactName ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50 focus:border-brand-navy'}`} />
                    {errors.emergencyContactName && <p className="text-rose-500 text-xs font-bold mt-2">{errors.emergencyContactName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Emergency Phone <span className="text-rose-500">*</span></label>
                    <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} placeholder="07XXXXXXXX" maxLength="10" className={`w-full border-2 p-4 rounded-xl focus:outline-none transition-colors ${errors.emergencyContactPhone ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50 focus:border-brand-navy'}`} />
                    {errors.emergencyContactPhone && <p className="text-rose-500 text-xs font-bold mt-2">{errors.emergencyContactPhone}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Move-in Date <span className="text-rose-500">*</span></label>
                  <input type="date" name="expectedMoveInDate" min={todayFormatted} value={formData.expectedMoveInDate} onChange={handleInputChange} className={`w-full border-2 p-4 rounded-xl focus:outline-none transition-colors ${errors.expectedMoveInDate ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50 focus:border-brand-navy'}`} />
                  {errors.expectedMoveInDate && <p className="text-rose-500 text-xs font-bold mt-2">{errors.expectedMoveInDate}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Special Requests (Optional)</label>
                  <textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} placeholder="e.g. Prefer bottom bunk" className="w-full border-2 border-slate-200 bg-slate-50 focus:bg-white p-4 rounded-xl focus:border-brand-navy focus:outline-none resize-none h-24" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
                <button onClick={prevStep} className="text-slate-500 font-bold px-6 py-3 hover:bg-slate-100 rounded-xl transition-colors">← Back</button>
                <button onClick={validateStep3AndProceed} className="bg-brand-navy text-white font-black text-lg px-10 py-4 rounded-2xl hover:bg-slate-800 transition-transform shadow-xl shadow-brand-navy/20">Verify & Continue →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-10"><div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner border border-green-200">💳</div><h2 className="text-3xl font-black text-slate-800">Secure Payment</h2><p className="text-slate-500 font-medium mt-2">Final step to secure Room {room.roomNumber}</p></div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6 mb-10 max-w-xl mx-auto shadow-sm">
                <div className="flex justify-between items-center text-slate-600 font-medium pb-6 border-b border-slate-200"><span className="flex items-center gap-3"><span className="text-xl">📅</span> First Month Rent</span><span className="text-lg">Rs. {room.monthlyRent.toLocaleString()}</span></div>
                <div className="flex justify-between items-center text-slate-600 font-medium pb-6 border-b border-slate-200"><span className="flex items-center gap-3"><span className="text-xl">🔐</span> Refundable Key Money</span><span className="text-lg">Rs. {room.keyMoney.toLocaleString()}</span></div>
                <div className="flex justify-between items-end pt-2"><span className="font-bold text-slate-800 text-lg">Total Due Today</span><span className="text-4xl font-black text-brand-navy">Rs. {(room.monthlyRent + room.keyMoney).toLocaleString()}</span></div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center max-w-xl mx-auto gap-4">
                <button onClick={prevStep} className="w-full sm:w-auto text-slate-500 font-bold px-6 py-4 hover:bg-slate-100 rounded-xl transition-colors">← Edit Details</button>
                <button onClick={handlePayment} className="w-full sm:w-auto bg-green-600 text-white font-black text-lg px-10 py-4 rounded-2xl hover:bg-green-700 transition-all shadow-xl hover:-translate-y-1 shadow-green-600/30 flex items-center justify-center gap-3"><span>🔒</span> Pay Securely with Stripe</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}