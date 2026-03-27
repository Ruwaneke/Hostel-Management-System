import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext"; 

export default function RoomBookingForm({ roomId, onCancel, onSuccess }) {
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [step, setStep] = useState(1); 
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nicNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    expectedMoveInDate: '',
    specialRequests: ''
  });

  useEffect(() => {
    fetch(`http://localhost:5025/api/rooms/${roomId}`)
      .then(res => res.json())
      .then(data => { if (data.success) setRoom(data.data); });
  }, [roomId]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Updated Regex for Sri Lankan NIC and Phone
    const nicRegex = /^([0-9]{9}[vV]|[0-9]{12})$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!nicRegex.test(formData.nicNumber)) {
      return setError('Invalid NIC. Must be 9 digits + V, or exactly 12 digits.');
    }
    if (!phoneRegex.test(formData.emergencyContactPhone)) {
      return setError('Invalid Phone Number. Must be exactly 10 digits.');
    }
    if (!formData.expectedMoveInDate) {
      return setError('Please select an expected move-in date.');
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        roomId: room._id,
        roomNumber: room.roomNumber.toString(),
        studentName: user.name,
        studentEmail: user.email,
        agreedToTerms: agreed,
        ...formData
      };

      // 1. Save the Booking Record in Database
      const res = await fetch('http://localhost:5025/api/bookings', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Booking failed');
      
      // 2. TRIGGER STRIPE IMMEDIATELY WITH BOTH AMOUNTS
      const stripeRes = await fetch('http://localhost:5025/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        // IMPORTANT: Passing 'initial' tells backend to sum Key Money + Month Fee
        body: JSON.stringify({ 
            bookingId: data.data._id, 
            paymentType: 'initial' 
        })
      });
      
      const stripeData = await stripeRes.json();

      if (stripeData.url) {
        window.location.href = stripeData.url; // Redirect to Stripe
      } else {
        onSuccess(data.data);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!room) return <div className="p-20 animate-pulse text-slate-400 font-medium text-center">Loading Configuration...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto animate-in fade-in zoom-in duration-500 flex flex-col">
      {/* Header */}
      <div className="bg-slate-50 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Secure Your Room</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Room {room.roomNumber} • Block {room.block} • {room.roomType}</p>
        </div>
        <div className="sm:text-right bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold leading-tight text-left">Key Money +<br/>1st Month</p>
          <p className="text-xl font-black text-blue-600">Rs. {(room.keyMoney + room.monthlyFee).toLocaleString()}</p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {step === 1 ? (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                <span className="bg-blue-50 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black border border-blue-100">1</span>
                Hostel Rules & Regulations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl text-xs text-slate-600 border border-slate-200 font-medium">
              <p className="flex gap-2 items-start"><span className="text-blue-500 font-black">1.</span> Payments must be settled before the 5th of every month.</p>
              <p className="flex gap-2 items-start"><span className="text-blue-500 font-black">2.</span> Visitors are not allowed inside the rooms after 8:00 PM.</p>
              <p className="flex gap-2 items-start"><span className="text-blue-500 font-black">3.</span> Students are responsible for furniture provided in room.</p>
              <p className="flex gap-2 items-start"><span className="text-blue-500 font-black">4.</span> Strictly no smoking or alcohol consumption on the premises.</p>
              <p className="flex gap-2 items-start"><span className="text-blue-500 font-black">5.</span> Key money is non-refundable if stay is under 6 months.</p>
              <p className="flex gap-2 items-start"><span className="text-blue-500 font-black">6.</span> Management reserves the right to inspect rooms for security.</p>
            </div>
            <label className="flex items-center gap-4 cursor-pointer bg-blue-50/50 p-4 rounded-xl border border-blue-100 hover:bg-blue-50 transition-all group">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <span className="font-bold text-slate-700 text-sm group-hover:text-blue-700 transition-colors">I agree to all hostel rules and initial payment obligations.</span>
            </label>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={onCancel} className="px-6 py-2.5 font-bold text-slate-400 hover:text-slate-600 rounded-xl">Cancel</button>
              <button onClick={() => setStep(2)} disabled={!agreed} className={`px-8 py-2.5 font-bold rounded-xl transition-all ${agreed ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>Agree & Continue →</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-3">
              <button type="button" onClick={() => setStep(1)} className="text-slate-400 hover:text-blue-600 flex items-center gap-1 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-lg">← Back</button>
              <h3 className="text-lg font-bold text-slate-800">Registration Details</h3>
            </div>
            {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg font-bold text-sm border border-rose-100 shadow-sm flex items-center gap-2">⚠️ {error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">NIC Number</label>
                    <input type="text" name="nicNumber" value={formData.nicNumber} onChange={handleChange} placeholder="e.g. 199912345V" className="w-full border border-slate-200 p-2.5 rounded-lg focus:border-blue-500 font-bold text-slate-800 text-sm shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Expected Move-in</label>
                    <input type="date" name="expectedMoveInDate" value={formData.expectedMoveInDate} onChange={handleChange} className="w-full border border-slate-200 p-2.5 rounded-lg focus:border-blue-500 font-bold text-slate-800 text-sm shadow-sm" />
                  </div>
                </div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Special Requests</label>
                <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows="2" className="w-full border border-slate-200 p-2.5 rounded-lg focus:border-blue-500 font-medium text-slate-700 text-sm resize-none shadow-sm" />
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Emergency Contact</h4>
                <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Guardian Name" className="w-full border-b border-slate-200 p-1.5 bg-transparent focus:border-blue-500 font-bold text-slate-800 text-sm" />
                <input type="text" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} placeholder="07XXXXXXXX" className="w-full border-b border-slate-200 p-1.5 bg-transparent focus:border-blue-500 font-bold text-slate-800 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-slate-100">
              <button type="button" onClick={onCancel} className="px-6 py-2.5 font-bold text-slate-400 hover:text-slate-600 rounded-xl">Discard</button>
              <button type="submit" disabled={loading} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm disabled:opacity-70">
                {loading ? 'Processing...' : 'Confirm & Book Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}