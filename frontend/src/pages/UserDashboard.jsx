import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import UserComplaints from "./UserComplaints";
import UserFeedback from "./UserFeedback";
import UserBrowseRooms from "./RoomAllocation/UserBrowseRooms";

// --- NEW IMPORT ---
import StudentLaundry from "./Londary/StudentLaundry";

const statusColor = {
  Paid:      "bg-emerald-100 text-emerald-800",
  Upcoming:  "bg-amber-100 text-amber-800",
  Delivered: "bg-blue-100 text-blue-800",
  Open:      "bg-rose-100 text-rose-700",
  Resolved:  "bg-emerald-100 text-emerald-800",
  Pending:   "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Unpaid:    "bg-rose-100 text-rose-800"
};

const Badge = ({ s }) => (
  <span className={"px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider " + (statusColor[s] || "bg-slate-100 text-slate-600")}>
    {s}
  </span>
);

const TH = ({ children }) => <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">{children}</th>;
const TD = ({ children, className = "" }) => <td className={`px-4 py-4 text-sm font-semibold text-slate-700 border-t border-slate-100 ${className}`}>{children}</td>;

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [hasBooking, setHasBooking] = useState(false); 
  const [bookingData, setBookingData] = useState(null); // Stores the student's actual booking
  const [roomData, setRoomData] = useState(null);       // Stores the actual room details & image
  
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- FETCH BOOKING & ROOM DATA ON LOAD ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user && user._id) {
        try {
          // 1. Check if they have a booking
          const statusRes = await axios.get(`http://localhost:5025/api/bookings/status/${user._id}`);
          const hasRoom = statusRes.data.hasBooking;
          setHasBooking(hasRoom);
          
          if (hasRoom) {
            const bData = statusRes.data.booking;
            setBookingData(bData);
            
            // 2. If they have a booking, fetch the specific room data (for the image & amenities)
            const roomRes = await axios.get(`http://localhost:5025/api/rooms/${bData.roomId}`);
            setRoomData(roomRes.data);

            if (active === "browseRooms") setActive("overview");
          } else {
            if (active !== "browseRooms") setActive("browseRooms");
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDashboardData();
  }, [user]);

  // Other UI States
  const [complaint, setComplaint] = useState("");
  const [laundryItems, setLaundryItems] = useState("");
  const [submitted, setSubmitted] = useState({ complaint: false, laundry: false });

  const handleLogout = () => { logout(); navigate("/login"); };

  // DYNAMIC MENU ITEMS
  const menuItems = hasBooking 
    ? [
        { id: "overview",   label: "Overview",   icon: "📊" },
        { id: "room",       label: "My Room",    icon: "🛏️" },
        { id: "payments",   label: "Payments",   icon: "💳" },
        { id: "laundry",    label: "Laundry",    icon: "👕" },
        { id: "complaints", label: "Complaints", icon: "🔧" },
        { id: "meals",      label: "Meals",      icon: "🍽️" },
        { id: "feedback",   label: "Feedback",   icon: "⭐" },
      ]
    : [
        { id: "overview",    label: "Overview",     icon: "📊" },
        { id: "browseRooms", label: "Browse Rooms", icon: "🏨" },
      ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-navy border-t-brand-gold"></div>
        </div>
      );
    }

    switch (active) {
      case "browseRooms":
        return <UserBrowseRooms />;

      // ─────────────────────────────────────────────────────────────────
      // 1. OVERVIEW (DASHBOARD SUMMARY)
      // ─────────────────────────────────────────────────────────────────
      case "overview":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50">
              <div>
                <h2 className="text-3xl font-black text-brand-navy tracking-tight">Welcome back, {user?.name}! ✨</h2>
                <p className="text-slate-500 font-medium text-sm mt-2">Here is your campus living summary for today.</p>
              </div>
              {hasBooking && bookingData && (
                <div className="hidden md:block text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Room</p>
                  <div className="text-3xl font-black text-brand-gold">Room {bookingData.roomNumber}</div>
                </div>
              )}
            </div>
            
            {!hasBooking ? (
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-12 text-center shadow-inner">
                 <div className="text-6xl mb-4">🏨</div>
                 <h3 className="text-2xl font-black text-blue-900 mb-2">You haven't booked a room yet!</h3>
                 <p className="text-blue-700 mb-8 max-w-md mx-auto">Secure your spot on campus today by browsing our premium available rooms.</p>
                 <button onClick={() => setActive('browseRooms')} className="bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-600/20">
                    Browse Available Rooms Now
                 </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: "🛏️", value: bookingData?.roomNumber, label: "My Room",       color: "border-brand-navy", tc: "text-brand-navy", bg: "bg-brand-navy/5" },
                    { icon: "💳", value: bookingData?.paymentStatus, label: "Rent Status", color: "border-emerald-500",  tc: "text-emerald-700",  bg: "bg-emerald-50"  },
                    { icon: "📅", value: new Date(bookingData?.expectedMoveInDate).toLocaleDateString(), label: "Move-in Date", color: "border-sky-500",   tc: "text-sky-700",   bg: "bg-sky-50"   },
                    { icon: "🛡️", value: bookingData?.status, label: "Booking Status", color: "border-brand-gold",  tc: "text-[#e5920f]",  bg: "bg-brand-gold/10"  },
                  ].map(s => (
                    <div key={s.label} className={"bg-brand-white rounded-3xl shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow " + s.color}>
                      <div className={"w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 " + s.bg}>{s.icon}</div>
                      <div className={"text-xl sm:text-2xl font-black " + s.tc}>{s.value}</div>
                      <div className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-brand-white rounded-3xl shadow-sm p-8 border border-brand-platinum/30">
                  <h3 className="font-black text-brand-navy mb-6 text-xl">Quick Actions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      ["🛏️","View Room Details","room"],
                      ["💳","Payment History","payments"],
                      ["👕","Submit Laundry","laundry"],
                      ["🔧","Raise Complaint","complaints"]
                    ].map(([icon, label, id]) => (
                      <button key={id} onClick={() => setActive(id)}
                        className="flex flex-col items-center justify-center gap-3 py-6 px-4 bg-slate-50 hover:bg-brand-navy hover:text-white rounded-2xl text-sm font-bold text-slate-700 transition-all border border-slate-100 hover:shadow-xl group">
                        <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
                        <span className="text-center">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      // ─────────────────────────────────────────────────────────────────
      // 2. MY ROOM (ROOM DETAILS & BOOKING INFO)
      // ─────────────────────────────────────────────────────────────────
      case "room":
        if (!bookingData || !roomData) return null;
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-black text-slate-800">My Room Profile</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image & Main Info */}
              <div className="lg:col-span-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="h-64 bg-slate-200 relative">
                  {roomData.image ? (
                    <img src={`/roomImage/${roomData.image}`} className="w-full h-full object-cover" alt="My Room" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-slate-400">🛏️</div>
                  )}
                  <div className="absolute top-4 right-4"><Badge s={bookingData.status} /></div>
                </div>
                <div className="p-6 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Block {roomData.block}</span>
                  <h3 className="text-4xl font-black text-brand-navy mb-2">Room {bookingData.roomNumber}</h3>
                  <p className="text-slate-500 font-medium">{roomData.roomType} • {roomData.airConditioning}</p>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                <h3 className="font-black text-xl text-slate-800 mb-6 border-b border-slate-100 pb-4">Booking Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Student NIC</p>
                    <p className="font-black text-slate-700 text-lg">{bookingData.nicNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Official Move-in Date</p>
                    <p className="font-black text-slate-700 text-lg">{new Date(bookingData.expectedMoveInDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Emergency Contact</p>
                    <p className="font-black text-slate-700 text-lg">{bookingData.emergencyContactName}</p>
                    <p className="text-sm font-semibold text-slate-500">{bookingData.emergencyContactPhone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Room Capacity</p>
                    <p className="font-black text-slate-700 text-lg">{roomData.currentOccupancy} / {roomData.maxCapacity} Students</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Special Requests Applied</p>
                  <p className="font-medium text-slate-600 bg-slate-50 p-4 rounded-xl italic">
                    {bookingData.specialRequests || "No special requests were made during booking."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────────
      // 3. PAYMENTS & INVOICE HISTORY
      // ─────────────────────────────────────────────────────────────────
      case "payments":
        if (!bookingData || !roomData) return null;
        
        // Simulating the payment history based on their booking.
        // Once you build the Invoice backend, you can fetch actual arrays here!
        const paymentHistory = [
          { 
            desc: "First Month Rent & Key Money", 
            amount: roomData.monthlyRent + roomData.keyMoney, 
            date: new Date(bookingData.createdAt).toLocaleDateString(), 
            status: bookingData.paymentStatus,
            type: "Initial Deposit"
          },
          { 
            desc: "Upcoming Monthly Rent", 
            amount: roomData.monthlyRent, 
            date: new Date(bookingData.paidUntil).toLocaleDateString(), 
            status: "Upcoming",
            type: "Monthly Rent"
          }
        ];

        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-slate-800">Financial Center</h2>
              <button className="bg-brand-navy text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md text-sm">
                Pay Next Month Rent
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-brand-navy to-blue-800 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1 relative z-10">Monthly Rent</p>
                <h3 className="text-3xl font-black relative z-10">Rs. {roomData.monthlyRent.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Held Key Money</p>
                <h3 className="text-2xl font-black text-slate-700">Rs. {roomData.keyMoney.toLocaleString()}</h3>
                <p className="text-xs text-emerald-500 font-bold mt-1">✓ Safely Deposited</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Next Payment Due</p>
                <h3 className="text-2xl font-black text-amber-600">{new Date(bookingData.paidUntil).toLocaleDateString()}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Status: <Badge s="Upcoming" /></p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-black text-lg text-slate-800">Payment History & Invoices</h3>
              </div>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <TH>Description</TH>
                    <TH>Type</TH>
                    <TH>Amount (LKR)</TH>
                    <TH>Date / Due</TH>
                    <TH>Status</TH>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <TD className="font-bold">{p.desc}</TD>
                      <TD><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{p.type}</span></TD>
                      <TD><span className="font-black text-brand-navy">Rs. {p.amount.toLocaleString()}</span></TD>
                      <TD>{p.date}</TD>
                      <TD><Badge s={p.status} /></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────────
      // 4. NEW LAUNDRY COMPONENT 
      // ─────────────────────────────────────────────────────────────────
      case "laundry":
        return <StudentLaundry />;

      // ─────────────────────────────────────────────────────────────────
      // MEALS, COMPLAINTS, FEEDBACK 
      // ─────────────────────────────────────────────────────────────────
      case "meals":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800">Meals & Dining</h2>
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
              <p className="text-slate-500 font-medium">Meal booking integration will appear here.</p>
            </div>
          </div>
        );

      case "complaints":
        return (
          <div className="bg-brand-white rounded-3xl shadow-sm overflow-hidden h-full flex flex-col border border-brand-platinum/30">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
              <UserComplaints isEmbedded={true} />
            </div>
          </div>
        );

      case "feedback":
        return (
          <div className="bg-brand-white rounded-3xl shadow-sm overflow-hidden h-full flex flex-col border border-brand-platinum/30">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
              <UserFeedback isEmbedded={true} />
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-brand-black">
      {/* Sidebar */}
      <aside className={"flex flex-col bg-brand-navy text-brand-platinum border-r border-brand-white/10 transition-all duration-300 relative z-20 shadow-2xl " + (collapsed ? "w-20" : "w-64")}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-brand-white/10">
          <span className="text-3xl flex-shrink-0 drop-shadow-sm">🏠</span>
          {!collapsed && <span className="font-black text-xl text-brand-gold tracking-tight">HostelMS</span>}
        </div>
        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              title={collapsed ? item.label : ""}
              className={"w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all " +
                (active === item.id
                  ? "bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20"
                  : "text-brand-platinum/80 hover:bg-brand-white/5 hover:text-brand-gold")}
            >
              <span className={"text-xl flex-shrink-0 " + (active !== item.id && "opacity-70")}>{"→"}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        {/* BOTTOM ACTIONS */}
        <div className="px-3 pb-6 border-t border-brand-white/10 pt-4 space-y-2">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 transition-all">
            <span className="flex-shrink-0 text-xl opacity-80">🌐</span>
            {!collapsed && <span>Go to Home</span>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all">
            <span className="flex-shrink-0 text-xl opacity-80">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between flex-shrink-0 relative z-10 shadow-sm">
          <div className="flex items-center gap-5">
            <button onClick={() => setCollapsed(!collapsed)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-brand-navy transition-colors">
              <span className="text-xl">☰</span>
            </button>
            <div>
              <h1 className="font-black text-brand-navy text-2xl tracking-tight flex items-center gap-2">
                {menuItems.find(m => m.id === active)?.label || "Loading..."}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-brand-navy">{user?.name}</p>
              <p className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Student Portal</p>
            </div>
            <div className="w-12 h-12 bg-brand-navy text-brand-gold rounded-full flex items-center justify-center font-black text-xl shadow-lg border-2 border-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}