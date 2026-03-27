import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserComplaints from "./UserComplaints";
import UserFeedback from "./UserFeedback";

import StudentRoomList from "./roomAllocation/StudentRoomList";
import RoomBookingForm from "./roomAllocation/RoomBookingForm";

const menuItems = [
  { id: "overview",   label: "Overview",   icon: "📊" },
  { id: "room",       label: "My Room",    icon: "🛏️" },
  { id: "payments",   label: "Payments",   icon: "💳" },
  { id: "laundry",    label: "Laundry",    icon: "👕" },
  { id: "complaints", label: "Complaints", icon: "🔧" },
  { id: "meals",      label: "Meals",      icon: "🍽️" },
  { id: "feedback",   label: "Feedback",   icon: "💬" },
  { id: "contact",    label: "Contact",    icon: "📞" } 
];

const statusColor = {
  Paid:      "bg-emerald-50 text-emerald-600 border-emerald-200",
  Upcoming:  "bg-blue-50 text-blue-600 border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Open:      "bg-rose-50 text-rose-600 border-rose-200",
  Resolved:  "bg-emerald-50 text-emerald-600 border-emerald-200",
  Pending:   "bg-amber-50 text-amber-600 border-amber-200",
  Unpaid:    "bg-rose-50 text-rose-600 border-rose-200" 
};

const Badge = ({ s }) => (
  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusColor[s] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
    {s}
  </span>
);

const TH = ({ children }) => <th className="px-4 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">{children}</th>;
const TD = ({ children }) => <td className="px-4 py-4 text-sm font-medium text-slate-700 border-t border-slate-100">{children}</td>;

export default function UserDashboard() {
  const [active, setActive]       = useState("overview");
  const [dropdownOpen, setDropdownOpen] = useState(false); // Controls the profile dropdown
  const [submitted, setSubmitted] = useState({ complaint: false, laundry: false });

  const { user, logout }          = useAuth();
  const navigate                  = useNavigate();

  const [myBooking, setMyBooking] = useState(null);
  const [isCheckingBooking, setIsCheckingBooking] = useState(true);
  const [selectedRoomToBook, setSelectedRoomToBook] = useState(null);

  const FRONTEND_URL = "http://localhost:5173";

  const handleLogout = () => { logout(); navigate("/login"); };

  const checkMyBooking = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`http://localhost:5025/api/bookings/my-booking/${user.email}`);
      const data = await res.json();
      if (data.success && data.data) {
        setMyBooking(data.data);
      }
    } catch (err) {
      console.error("Failed to check booking", err);
    } finally {
      setIsCheckingBooking(false);
    }
  };

  useEffect(() => {
    checkMyBooking();
  }, [user]);

  const handleStripePayment = async (paymentType = undefined) => {
    try {
      const token = localStorage.getItem('token');
      const body = { bookingId: myBooking._id };
      if (paymentType) body.paymentType = paymentType;

      const response = await fetch('http://localhost:5025/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      });
      const session = await response.json();
      if (session.url) {
        window.location.href = session.url; 
      } else {
        alert(session.message || "Unauthorized access. Please login again.");
      }
    } catch (error) {
      alert("Payment initiation failed. Please check your connection.");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const correctedPath = path.replace('/uploads/', '/roomImage/');
    const finalPath = correctedPath.startsWith('/') ? correctedPath : `/${correctedPath}`;
    return `${FRONTEND_URL}${finalPath}`;
  };

  const renderContent = () => {
    switch (active) {
      case "overview":
        return (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pt-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user?.name}! ✨</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Here is your hostel summary for today.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🛏️", value: myBooking ? myBooking.roomNumber : "None",  label: "My Room",       tc: "text-blue-600", bg: "bg-blue-50" },
                { icon: "💳", value: myBooking?.monthlyRentStatus || "N/A", label: "Rent Status",   tc: "text-emerald-600",  bg: "bg-emerald-50"  },
                { icon: "👕", value: "3",    label: "Laundry Items",  tc: "text-sky-600",   bg: "bg-sky-50"   },
                { icon: "🔧", value: "1",    label: "Open Ticket",    tc: "text-amber-600",  bg: "bg-amber-50"  },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow flex flex-col">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${s.bg}`}>{s.icon}</div>
                  <div className={`text-3xl font-black mb-1 ${s.tc}`}>{s.value}</div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
              <h3 className="font-extrabold text-slate-800 mb-6 text-lg tracking-tight">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[["🔧","Raise Complaint","complaints"],["👕","Submit Laundry","laundry"],["💳","View Payments","payments"],["🍽️","Today's Meals","meals"]].map(([icon, label, id]) => (
                  <button key={id} onClick={() => setActive(id)}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-blue-50 rounded-2xl text-xs font-bold text-slate-600 hover:text-blue-600 transition-all border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow">
                    <span className="text-2xl">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "room":
        if (isCheckingBooking) return <div className="p-20 font-medium text-slate-400 animate-pulse text-center">Checking Residency Status...</div>;
        
        if (selectedRoomToBook) {
            return (
                <RoomBookingForm 
                    roomId={selectedRoomToBook} 
                    onCancel={() => setSelectedRoomToBook(null)}
                    onSuccess={(newBooking) => {
                        setMyBooking(newBooking);
                        setSelectedRoomToBook(null); 
                    }}
                />
            );
        }

        if (!myBooking) {
            return <StudentRoomList onBookClick={(roomId) => setSelectedRoomToBook(roomId)} />;
        }

        const roomPhotoUrl = myBooking.roomId?.photos?.[0] ? getImageUrl(myBooking.roomId.photos[0]) : null;

        return (
          <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Assigned Room</h2>
                    <p className="text-slate-400 font-medium mt-1">Official Residency Details</p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                    <Badge s={myBooking.status} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Residency ID: {myBooking._id.slice(-8)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 flex flex-col">
                    <div className="relative p-8 md:p-10 text-white flex justify-between items-end min-h-[260px] overflow-hidden">
                        {roomPhotoUrl ? (
                            <>
                                <img src={roomPhotoUrl} alt="Room" className="absolute inset-0 w-full h-full object-cover z-0" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-blue-600 z-0"></div>
                        )}
                        <div className="relative z-20 flex w-full justify-between items-end">
                            <div>
                                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase mb-3 inline-block tracking-widest shadow-sm">Block {myBooking.roomId?.block || 'A'}</span>
                                <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-2 drop-shadow-md">Room {myBooking.roomNumber}</h3>
                                <p className="text-blue-100 font-medium drop-shadow-sm">{myBooking.roomId?.roomType} Premium Suite</p>
                            </div>
                            <div className="hidden md:block">
                                {myBooking.paymentStatus === 'Unpaid' ? (
                                  <button onClick={() => handleStripePayment('monthly')} className="bg-white/95 backdrop-blur text-blue-700 px-8 py-4 rounded-2xl font-extrabold text-sm shadow-xl hover:scale-105 transition-all border border-blue-50">
                                    Pay Rs.{ myBooking.roomId?.monthlyFee?.toLocaleString() || 0 } <br/><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">(Monthly Fee)</span>
                                  </button>
                                ) : myBooking.monthlyRentStatus === 'Unpaid' ? (
                                    <button onClick={handleStripePayment} className="bg-rose-500/95 backdrop-blur text-white px-8 py-4 rounded-2xl font-extrabold text-sm shadow-xl hover:bg-rose-600 transition-all border border-rose-400">
                                        Pay Monthly Rent <br/><span className="text-[10px] font-bold text-rose-100 uppercase tracking-widest">(Rs. {myBooking.roomId?.monthlyFee?.toLocaleString()})</span>
                                    </button>
                                ) : (
                                    <div className="bg-emerald-500/30 border border-emerald-400/50 backdrop-blur-md px-6 py-4 rounded-2xl text-center shadow-lg">
                                        <p className="text-white font-black text-sm tracking-wide">✓ ALL SETTLED</p>
                                        <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mt-1">Next: {myBooking.nextRentDueDate ? new Date(myBooking.nextRentDueDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8 flex-grow">
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl shadow-sm">📅</div>
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Move-in Date</p><p className="text-lg font-black text-slate-800">{new Date(myBooking.expectedMoveInDate).toLocaleDateString()}</p></div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl shadow-sm">💳</div>
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIC Number</p><p className="text-lg font-black text-slate-800">{myBooking.nicNumber}</p></div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 h-full flex flex-col">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-200 pb-3"><span className="w-2 h-2 bg-rose-400 rounded-full"></span> Emergency Contact</h4>
                            <p className="text-lg font-bold text-slate-800 mb-1">{myBooking.emergencyContactName}</p>
                            <p className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">📞 {myBooking.emergencyContactPhone}</p>
                            <div className="mt-auto pt-4 border-t border-slate-200 text-xs font-medium text-slate-500 italic">"{myBooking.specialRequests || 'No special requests submitted'}"</div>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-slate-50 border-t border-slate-100 md:hidden">
                        {myBooking.paymentStatus === 'Unpaid' ? (
                          <button onClick={() => handleStripePayment('monthly')} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-md">Pay Rs.{ myBooking.roomId?.monthlyFee?.toLocaleString() || 0 }</button>
                        ) : myBooking.monthlyRentStatus === 'Unpaid' ? (
                            <button onClick={handleStripePayment} className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold shadow-md">Pay Monthly Rent (Rs. {myBooking.roomId?.monthlyFee?.toLocaleString()})</button>
                        ) : (
                            <div className="w-full bg-emerald-50 text-emerald-600 py-4 rounded-xl font-bold text-center border border-emerald-100">✓ All Dues Settled</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
                    <h3 className="text-lg font-extrabold text-slate-900 mb-6 tracking-tight">Finance Overview</h3>
                    <div className="space-y-4 flex-grow">
                        {myBooking.paymentStatus === 'Paid' && (
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Deposit</p><p className="font-bold text-slate-700 text-sm">Key Money</p></div>
                          <Badge s={myBooking.paymentStatus} />
                        </div>
                        )}
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current</p><p className="font-bold text-slate-700 text-sm">Room Rent</p></div>
                            <Badge s={myBooking.monthlyRentStatus} />
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Pricing Breakdown</p>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-bold text-slate-500"><span>Monthly Base:</span><span>Rs. {myBooking.roomId?.monthlyFee?.toLocaleString()}</span></div>
                                <div className="flex justify-between text-sm font-bold text-slate-500"><span>Maintenance:</span><span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-xs">Included</span></div>
                                <div className="flex justify-between text-lg font-black text-slate-900 mt-6 pt-4 border-t border-slate-100"><span>Total/Mo:</span><span className="text-blue-600">Rs. {myBooking.roomId?.monthlyFee?.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pt-4">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment History</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Track your invoices and download receipts.</p>
            </div>
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
              {!myBooking ? (
                <div className="p-16 text-center text-slate-400 font-medium flex flex-col items-center"><span className="text-4xl mb-3">🧾</span>No active bookings found.</div>
              ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr><TH>Description</TH><TH>Amount</TH><TH>Due Date</TH><TH>Status</TH><TH>Action</TH></tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-slate-50/50 transition border-b border-slate-100 group">
                        <TD><span className="font-bold text-slate-800">Initial Bundle</span><br/><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Key Money + 1st Month</span></TD>
                        <TD className="font-black text-slate-900">Rs. {((myBooking.roomId?.keyMoney || 0) + (myBooking.roomId?.monthlyFee || 0)).toLocaleString()}</TD>
                        <TD className="text-slate-500 font-medium">{new Date(myBooking.createdAt).toLocaleDateString()}</TD>
                        <TD><Badge s={myBooking.paymentStatus} /></TD>
                        <TD>
                            {myBooking.paymentStatus === 'Paid' ? (
                                <Link to={`/payment-receipt?booking_id=${myBooking._id}`} className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors inline-block">Receipt</Link>
                            ) : (
                                <button onClick={handleStripePayment} className="text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">Pay Now</button>
                            )}
                        </TD>
                        </tr>
                        {myBooking.paymentStatus === 'Paid' && (
                            <tr className="hover:bg-slate-50/50 transition group">
                                <TD><span className="font-bold text-slate-800">Monthly Recurring</span></TD>
                                <TD className="font-black text-slate-900">Rs. {myBooking.roomId?.monthlyFee?.toLocaleString() || 0}</TD>
                                <TD className="text-slate-500 font-medium">{myBooking.nextRentDueDate ? new Date(myBooking.nextRentDueDate).toLocaleDateString() : 'N/A'}</TD>
                                <TD><Badge s={myBooking.monthlyRentStatus} /></TD>
                                <TD>
                                    {myBooking.monthlyRentStatus === 'Unpaid' ? (
                                        <button onClick={handleStripePayment} className="text-xs font-bold text-white bg-rose-500 px-4 py-2 rounded-lg hover:bg-rose-600 shadow-sm transition-colors">Pay Rent</button>
                                    ) : <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded border border-emerald-100">Settled</span>}
                                </TD>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
              )}
            </div>
          </div>
        );

      case "laundry": return <div className="p-10 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-7xl mx-auto pt-4"><h2 className="text-2xl font-extrabold text-slate-900">Laundry Module</h2><p className="text-slate-500 mt-2 font-medium">Historical logs for laundry collections.</p></div>;
      case "complaints": return <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm h-full overflow-y-auto custom-scrollbar max-w-7xl mx-auto mt-4"><UserComplaints isEmbedded={true} /></div>;
      case "feedback": return <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm h-full overflow-y-auto custom-scrollbar max-w-7xl mx-auto mt-4"><UserFeedback isEmbedded={true} /></div>;
      case "meals": return <div className="p-20 text-center bg-white rounded-3xl shadow-sm border border-slate-100 max-w-7xl mx-auto mt-4"><span className="text-5xl mb-6 block opacity-50">🍽️</span><h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Meals & Restaurants</h2><p className="text-slate-400 mt-2 font-medium">Module under development.</p></div>;
      case "contact": return <div className="p-10 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-7xl mx-auto mt-4"><h2 className="text-2xl font-extrabold text-slate-900 mb-6">Administration Contact</h2><div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800 font-bold flex items-center gap-4"><span className="text-2xl">📞</span> Manager Hotline: +94 11 234 5678</div></div>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
      
      {/* ── TOP NAVBAR ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            
            {/* Left: Logo & Label */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-sm">🏠</div>
                <div>
                  <span className="font-extrabold text-2xl text-slate-900 tracking-tight block leading-none">HostelMS</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">Student Portal</span>
                </div>
              </div>
            </div>

            {/* Right Side: Interactive Profile Dropdown Trigger */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="flex items-center gap-3 focus:outline-none p-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800">{user?.name || "Student"}</p>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Resident</p>
                </div>
                <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold shadow-sm border border-blue-200 hover:bg-blue-200 transition-colors ring-2 ring-white">
                  {user?.name?.charAt(0).toUpperCase() || "S"}
                </div>
                {/* Small chevron arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* DROPDOWN MENU PANEL */}
              {dropdownOpen && (
                <>
                  {/* Invisible overlay to close dropdown when clicking outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                  
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 py-3 animate-in slide-in-from-top-2 duration-200 z-50">
                    
                    {/* Mobile Only: User Info inside dropdown */}
                    <div className="sm:hidden px-6 py-4 border-b border-slate-100 mb-2">
                        <p className="text-base font-bold text-slate-800">{user?.name || "Student"}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">{user?.email || "Resident Portal"}</p>
                    </div>

                    {/* Home Link */}
                    <Link 
                        to="/" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-4 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                        <span className="text-xl">🏠</span> Go to Homepage
                    </Link>

                    <div className="h-px bg-slate-100 my-2 mx-4"></div>

                    {/* All Dashboard Navigation Links */}
                    <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                        {menuItems.map(item => {
                            const isActive = active === item.id;
                            return (
                                <button
                                key={item.id}
                                onClick={() => { 
                                    setActive(item.id); 
                                    setSelectedRoomToBook(null); 
                                    setDropdownOpen(false); 
                                }}
                                className={`w-full flex items-center gap-4 px-6 py-3 text-sm transition-colors ${
                                    isActive
                                    ? "bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-500"
                                    : "text-slate-600 font-medium hover:bg-slate-50 border-l-4 border-transparent"
                                }`}
                                >
                                <span className={`text-xl flex-shrink-0 ${isActive ? "opacity-100" : "opacity-70 grayscale"}`}>{item.icon}</span>
                                <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="h-px bg-slate-100 my-2 mx-4"></div>

                    {/* Logout Button */}
                    <button 
                        onClick={() => { setDropdownOpen(false); handleLogout(); }} 
                        className="w-full flex items-center gap-4 px-6 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                        <span className="text-xl">🚪</span> Logout Securely
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FAFAFA] custom-scrollbar relative z-0">
        {renderContent()}
      </main>

    </div>
  );
}