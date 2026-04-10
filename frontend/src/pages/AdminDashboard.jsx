import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Components
import AdminComplaints from "./AdminComplaints";
import AdminFeedback from "./AdminFeedback";
import AdminRooms from "./roomAllocation/AdminRooms"; 
import AdminPayments from "./roomAllocation/AdminPayments"; 
import AdminLaundry from "./roomAllocation/AdminLaundry";

// --- NEW IMPORTS FOR MEALS MANAGEMENT ---
import AdminRestaurants from "./AdminRestaurants";
import AdminMenus from "./AdminMenus";

const menuItems = [
  { id: "dashboard",  label: "Dashboard",  icon: "📊" },
  { id: "users",      label: "Users",      icon: "👥" },
  { id: "rooms",      label: "Rooms",      icon: "🛏️" },
  { id: "payments",   label: "Payments",   icon: "💳" },
  { id: "laundry",    label: "Laundry",    icon: "👕" },
  { id: "complaints", label: "Complaints", icon: "🔧" },
  { id: "meals",      label: "Meals",      icon: "🍽️" },
  { id: "feedback",   label: "Feedback",   icon: "⭐" },
];

const colorCls = {
  navy:    { border: "border-brand-navy",  text: "text-brand-navy",  bg: "bg-brand-navy/5" },
  emerald: { border: "border-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50"  },
  sky:     { border: "border-sky-500",     text: "text-sky-700",     bg: "bg-sky-50"   },
  rose:    { border: "border-rose-500",    text: "text-rose-700",    bg: "bg-rose-50"    },
};

const statusColor = {
  Active:       "bg-emerald-100 text-emerald-700",
  Admin:        "bg-brand-navy/10 text-brand-navy",
  Staff:        "bg-purple-100 text-purple-700",
  Paid:         "bg-emerald-100 text-emerald-700",
  Pending:      "bg-amber-100 text-amber-700",
  Open:         "bg-rose-100 text-rose-700",
  Resolved:     "bg-emerald-100 text-emerald-700",
};

const Badge = ({ s }) => (
  <span className={"px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm " + (statusColor[s] || "bg-slate-100 text-slate-600")}>
    {s}
  </span>
);

const TH = ({ children }) => <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">{children}</th>;
const TD = ({ children }) => <td className="px-4 py-4 text-sm font-semibold text-slate-700 border-t border-slate-100">{children}</td>;

export default function AdminDashboard() {
  const [active, setActive]       = useState("dashboard");
  const [mealsSubmenu, setMealsSubmenu] = useState("restaurants");
  const [collapsed, setCollapsed] = useState(false);

  const { user, logout }          = useAuth();
  const navigate                  = useNavigate();

  // --- DYNAMIC DATA STATES ---
  const [usersData, setUsersData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [statsData, setStatsData] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalStudents: 0,
    openTickets: 0
  });

  // --- FETCH REAL USERS AND STATS ON LOAD ---
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoadingData(true);
        const token = localStorage.getItem('token') || (user && user.token) || '';
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [usersRes, roomsRes] = await Promise.all([
          axios.get('http://localhost:5025/api/auth/users', config).catch(() => ({ data: [] })),
          axios.get('http://localhost:5025/api/rooms').catch(() => ({ data: [] }))
        ]);

        // 🔥 THE FIX: Safely extract the array whether the backend sends an array or an object containing an array
        const fetchedUsers = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data.users || []);
        const fetchedRooms = Array.isArray(roomsRes.data) ? roomsRes.data : (roomsRes.data.rooms || []);

        setUsersData(fetchedUsers);

        // Calculate Real Stats
        const studentCount = fetchedUsers.filter(u => u.role === 'user').length;
        const occupiedCount = fetchedRooms.filter(r => r.currentOccupancy > 0).length;

        setStatsData({
          totalRooms: fetchedRooms.length || 0,
          occupiedRooms: occupiedCount || 0,
          totalStudents: studentCount || 0,
          openTickets: 5 // Placeholder until complaints are fully wired
        });

      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) fetchAdminData();
  }, [user]);

  const handleLogout = () => { logout(); navigate("/login"); };

  const renderContent = () => {
    if (loadingData) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-navy border-t-brand-gold"></div>
        </div>
      );
    }

    switch (active) {
      // ─────────────────────────────────────────────────────────────────
      // 1. DASHBOARD OVERVIEW (Updated with Real Data)
      // ─────────────────────────────────────────────────────────────────
      case "dashboard":
        const recentStudents = usersData.filter(u => u.role === 'user').slice(-5).reverse(); // Get latest 5

        const displayStats = [
          { label: "Total Rooms",    value: statsData.totalRooms,    icon: "🛏️", color: "navy" },
          { label: "Occupied Rooms", value: statsData.occupiedRooms, icon: "👥",  color: "emerald"  },
          { label: "Total Students", value: statsData.totalStudents, icon: "🎓",  color: "sky"   },
          { label: "Open Tickets",   value: statsData.openTickets,   icon: "🔧",  color: "rose"    },
        ];

        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <h2 className="text-3xl font-black text-brand-navy tracking-tight">Dashboard Overview ✨</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Welcome back, {user?.name}! Here is your live hostel snapshot.</p>
            </div>
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {displayStats.map(s => {
                const c = colorCls[s.color];
                return (
                  <div key={s.label} className={"bg-brand-white rounded-3xl shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow " + c.border}>
                    <div className={"w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 " + c.bg}>{s.icon}</div>
                    <div className={"text-3xl font-black " + c.text}>{s.value}</div>
                    <div className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-wider">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions & Recent Students */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-brand-navy rounded-3xl p-8 text-brand-platinum shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
                <h3 className="font-extrabold text-brand-gold text-xl mb-6 relative z-10">Quick Actions</h3>
                <div className="flex flex-col gap-4 relative z-10">
                  <button onClick={() => setActive('rooms')} className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl transition-colors text-left flex justify-between items-center">
                    <span>Manage Rooms</span> <span>→</span>
                  </button>
                  <button onClick={() => setActive('payments')} className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl transition-colors text-left flex justify-between items-center">
                    <span>Review Payments</span> <span>→</span>
                  </button>
                  <button onClick={() => setActive('laundry')} className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl transition-colors text-left flex justify-between items-center">
                    <span>Process Laundry</span> <span>→</span>
                  </button>
                </div>
              </div>

              {/* Recently Registered Students List */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-slate-800 text-xl">Recently Registered Students</h3>
                  <button onClick={() => setActive('users')} className="text-brand-navy font-bold text-xs hover:underline uppercase tracking-wider">View All</button>
                </div>
                {recentStudents.length === 0 ? (
                  <p className="text-slate-500 font-medium">No students registered yet.</p>
                ) : (
                  <div className="space-y-4">
                    {recentStudents.map((student, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-brand-navy text-white rounded-full flex items-center justify-center font-bold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.email}</p>
                          </div>
                        </div>
                        <Badge s="Active" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────────
      // 2. USERS MANAGEMENT (Dynamic Real Data)
      // ─────────────────────────────────────────────────────────────────
      case "users":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h2 className="text-3xl font-black text-brand-navy tracking-tight">User Management 👥</h2>
                <p className="text-slate-500 font-medium mt-1">View and manage all registered users and administrators.</p>
              </div>
              <div className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-brand-navy border border-slate-200">
                Total Users: {usersData.length}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <TH>Name</TH>
                      <TH>Email</TH>
                      <TH>Role</TH>
                      <TH>Joined Date</TH>
                      <TH>Status</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-slate-500 font-medium">No users found in the database.</td>
                      </tr>
                    ) : (
                      usersData.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50/80 transition-colors group">
                          <TD>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm" style={{backgroundColor: u.role === 'admin' ? '#fca311' : '#14213d'}}>
                                {u.name ? u.name[0].toUpperCase() : 'U'}
                              </div>
                              <span className="font-bold text-slate-800">{u.name}</span>
                            </div>
                          </TD>
                          <TD><span className="text-slate-500 font-medium">{u.email}</span></TD>
                          <TD>
                            <Badge s={u.role === "admin" ? "Admin" : u.role === "staff" ? "Staff" : "Active"} />
                          </TD>
                          <TD className="text-slate-400 text-xs">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </TD>
                          <TD><span className="text-emerald-500 font-black text-xs uppercase tracking-wider">● Online</span></TD>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────────
      // OTHER COMPONENTS (Untouched functionality)
      // ─────────────────────────────────────────────────────────────────
      case "rooms":
        return <AdminRooms />;

      case "payments":
        return <AdminPayments />;

      case "laundry":
        return <AdminLaundry />;

      case "complaints":
        return (
          <div className="bg-brand-white rounded-3xl shadow-sm overflow-hidden h-full flex flex-col border border-brand-platinum/30">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
              <AdminComplaints isEmbedded={true} />
            </div>
          </div>
        );

      case "meals":
        return (
          <div className="space-y-6">
            <div className="bg-brand-white rounded-3xl shadow-sm border border-brand-platinum/30 overflow-hidden">
              {/* Meals Navigation Header */}
              <div className="bg-gradient-to-r from-brand-navy to-brand-navy/80 text-brand-platinum p-6 border-b border-brand-white/10">
                <h2 className="text-2xl font-bold mb-4">🍽️ Meals Management</h2>
                <p className="text-brand-platinum/70">Manage restaurants and food items</p>
              </div>

              {/* Meals Navigation Tabs */}
              <div className="flex border-b border-brand-platinum/20 bg-brand-platinum/5">
                <button
                  onClick={() => setMealsSubmenu("restaurants")}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-all border-b-2 ${
                    mealsSubmenu === "restaurants"
                      ? "border-brand-navy text-brand-navy bg-brand-white"
                      : "border-transparent text-slate-600 hover:text-brand-navy"
                  }`}
                >
                  🏪 Manage Restaurants
                </button>
                <button
                  onClick={() => setMealsSubmenu("menus")}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-all border-b-2 ${
                    mealsSubmenu === "menus"
                      ? "border-brand-navy text-brand-navy bg-brand-white"
                      : "border-transparent text-slate-600 hover:text-brand-navy"
                  }`}
                >
                  🍲 View Menus
                </button>
              </div>

              {/* Content Area */}
              <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                {mealsSubmenu === "restaurants" && <AdminRestaurants isEmbedded={true} />}
                {mealsSubmenu === "menus" && <AdminMenus isEmbedded={true} />}
              </div>
            </div>
          </div>
        );

      case "feedback":
        return (
          <div className="bg-brand-white rounded-3xl shadow-sm overflow-hidden h-full flex flex-col border border-brand-platinum/30">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
              <AdminFeedback isEmbedded={true} />
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-brand-platinum/20 overflow-hidden text-brand-black">
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
              {/* Show Icon Instead of Arrow if provided */}
              <span className={"text-xl flex-shrink-0 " + (active !== item.id && "opacity-70")}>{item.icon || "→"}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        {/* BOTTOM ACTIONS */}
        <div className="px-3 pb-6 border-t border-brand-white/10 pt-4 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 transition-all"
          >
            <span className="flex-shrink-0 text-xl opacity-80">🌐</span>
            {!collapsed && <span>Go to Home</span>}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
          >
            <span className="flex-shrink-0 text-xl opacity-80">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-brand-platinum/10">
        {/* Topbar */}
        <header className="bg-brand-white border-b border-brand-platinum/50 px-8 py-4 flex items-center justify-between flex-shrink-0 relative z-10 shadow-sm">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-brand-platinum/30 text-brand-navy transition-colors"
            >
              <span className="text-xl">☰</span>
            </button>
            <div>
              <h1 className="font-extrabold text-brand-navy text-xl tracking-tight flex items-center gap-2">
                {menuItems.find(m => m.id === active)?.label}
              </h1>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-0.5">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-brand-navy">{user?.name}</p>
              <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider">Administrator</p>
            </div>
            <div className="w-11 h-11 bg-brand-navy text-brand-gold rounded-full flex items-center justify-center font-bold text-lg shadow-inner ring-2 ring-brand-platinum/50">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}