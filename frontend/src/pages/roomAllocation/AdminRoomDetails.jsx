import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper component for status badges
const StatusBadge = ({ status }) => {
  const styles = {
    Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Unpaid: "bg-rose-100 text-rose-700 border-rose-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
  };
  const defaultStyle = "bg-slate-100 text-slate-700 border-slate-200";
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${styles[status] || styles[status.split(' ')[0]] || defaultStyle}`}>
      {status}
    </span>
  );
};

export default function AdminRoomDetails({ room, onBack, onEdit }) {
  const [occupants, setOccupants] = useState([]);
  const [loadingOccupants, setLoadingOccupants] = useState(true);

  // Fetch the students and their invoices specifically for THIS room
  useEffect(() => {
    const fetchRoomOccupants = async () => {
      try {
        // NOTE: You will need to create this route in your backend next!
        // It should return all bookings for this roomId, populated with their invoices.
        const response = await axios.get(`http://localhost:5025/api/bookings/room/${room._id}`);
        setOccupants(response.data);
      } catch (error) {
        console.error("Error fetching room occupants:", error);
      } finally {
        setLoadingOccupants(false);
      }
    };

    if (room && room._id) {
      fetchRoomOccupants();
    }
  }, [room]);

  if (!room) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8 pb-10">
      
      {/* ── TOP NAVIGATION ────────────────────────────────────────────── */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button 
          onClick={onBack}
          className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <span>←</span> Back to Rooms
        </button>
        <div className="flex gap-3">
          <button onClick={onEdit} className="bg-brand-navy text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md">
            Edit Room Setup
          </button>
        </div>
      </div>

      {/* ── ROOM OVERVIEW (Top Section) ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image & Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-96 bg-slate-100 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group">
            {room.image ? (
              <img src={`/roomImage/${room.image}`} alt="Room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 text-6xl">🛏️</div>
            )}
            
            <div className="absolute top-6 right-6">
              <StatusBadge status={room.status} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-transparent p-8 pt-24">
              <div className="flex items-end justify-between">
                <div>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold text-white uppercase tracking-wider border border-white/30 mb-3 inline-block">
                    Block {room.block} • {room.roomType}
                  </span>
                  <h1 className="text-5xl font-black text-white drop-shadow-lg">Room {room.roomNumber}</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-brand-navy mb-4">About this Room</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {room.description || "No specific description has been added for this room yet."}
            </p>
          </div>
        </div>

        {/* Right Column: Pricing & Setup Details */}
        <div className="space-y-6">
          
          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-brand-navy to-blue-900 p-8 rounded-[2rem] shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
            <h3 className="text-blue-200 font-bold uppercase tracking-wider text-xs mb-2 relative z-10">Monthly Rent</h3>
            <div className="text-4xl font-black mb-6 relative z-10">Rs. {room.monthlyRent?.toLocaleString()}</div>
            
            <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm relative z-10 border border-white/20">
              <h3 className="text-blue-200 font-bold uppercase tracking-wider text-[10px] mb-1">Key Money Deposit</h3>
              <div className="text-xl font-bold">Rs. {room.keyMoney?.toLocaleString()}</div>
            </div>
          </div>

          {/* Inventory Grid */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-sm font-black text-slate-800 mb-4">Room Configuration</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                <div className="text-2xl mb-1">👥</div>
                <div className="text-xl font-black text-brand-navy">{room.currentOccupancy}/{room.maxCapacity}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Occupancy</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                <div className="text-2xl mb-1">🚻</div>
                <div className="text-sm font-black text-brand-navy mt-1.5">{room.designatedGender}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Gender</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                <div className="text-2xl mb-1">❄️</div>
                <div className="text-sm font-black text-brand-navy mt-1.5">{room.airConditioning}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Climate</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                <div className="text-2xl mb-1">🚿</div>
                <div className="text-sm font-black text-brand-navy mt-1.5">{room.bathroomType}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Bathroom</div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-center gap-6">
               <div className="text-center"><span className="font-black text-brand-navy">{room.bedCount}</span> <span className="text-[10px] font-bold text-slate-400 uppercase">Beds</span></div>
               <div className="text-center"><span className="font-black text-brand-navy">{room.tableCount}</span> <span className="text-[10px] font-bold text-slate-400 uppercase">Tables</span></div>
               <div className="text-center"><span className="font-black text-brand-navy">{room.chairCount}</span> <span className="text-[10px] font-bold text-slate-400 uppercase">Chairs</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── NEW: CURRENT OCCUPANTS & FINANCIALS (Bottom Section) ──────── */}
      <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-200">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-brand-navy">Current Occupants</h2>
            <p className="text-slate-500 font-medium mt-1">Student details and individual payment histories for Room {room.roomNumber}.</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold border border-blue-200">
            Total Capacity: {room.currentOccupancy} / {room.maxCapacity}
          </div>
        </div>

        {loadingOccupants ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-brand-navy"></div>
          </div>
        ) : occupants.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
            <div className="text-6xl mb-4">👻</div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Room is Empty</h3>
            <p className="text-slate-500">No students are currently booked in this room.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {occupants.map((student) => (
              <div key={student._id} className="bg-white rounded-[2rem] shadow-md border border-slate-200 overflow-hidden">
                
                {/* Student Header Info */}
                <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-200 flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-brand-navy text-brand-gold rounded-full flex items-center justify-center font-black text-2xl shadow-inner">
                      {student.studentName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">{student.studentName}</h3>
                      <p className="text-slate-500 font-semibold">{student.studentEmail}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">NIC Number</p>
                      <p className="font-bold text-slate-700">{student.nicNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency Contact</p>
                      <p className="font-bold text-slate-700">{student.emergencyContactPhone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Move-in Date</p>
                      <p className="font-bold text-slate-700">{new Date(student.expectedMoveInDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Individual Payment History Table */}
                <div className="p-6 md:p-8">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span>💳</span> Financial History
                  </h4>
                  
                  {student.invoices && student.invoices.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Description</th>
                            <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Month</th>
                            <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Date Paid</th>
                            <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.invoices.map((invoice, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors border-t border-slate-100">
                              <td className="px-4 py-4 font-bold text-slate-700 text-sm">{invoice.description}</td>
                              <td className="px-4 py-4 text-slate-600 text-sm font-medium">{invoice.monthName || '-'}</td>
                              <td className="px-4 py-4 font-black text-brand-navy">Rs. {invoice.amount.toLocaleString()}</td>
                              <td className="px-4 py-4 text-slate-500 text-sm">{invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : '-'}</td>
                              <td className="px-4 py-4"><StatusBadge status={invoice.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-slate-50 text-slate-500 p-6 rounded-xl text-center font-medium border border-slate-100">
                      No payment records found for this student yet.
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}