import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./adminSidebar"; 
import RoomManage from "./roomAllocation/roomManage";
import AdminComplaints from "./AdminComplaints";
import AdminFeedback from "./AdminFeedback";

// --- DATA ARRAYS ---
const stats = [
  { label: "Total Rooms",    value: 48,  icon: "🛏️", color: "navy" },
  { label: "Occupied",       value: 35,  icon: "👥",  color: "emerald"  },
  { label: "Total Students", value: 127, icon: "🎓",  color: "sky"   },
  { label: "Open Tickets",   value: 8,   icon: "🔧",  color: "rose"    },
];

const colorCls = {
  navy:    { border: "border-brand-navy",  text: "text-brand-navy",  bg: "bg-brand-navy/5" },
  emerald: { border: "border-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50"  },
  sky:     { border: "border-sky-500",     text: "text-sky-700",     bg: "bg-sky-50"   },
  rose:    { border: "border-rose-500",    text: "text-rose-700",    bg: "bg-rose-50"    },
};

export default function AdminDashboard() {
  const [active, setActive]       = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout }          = useAuth();
  const navigate                  = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const renderContent = () => {
    switch (active) {
      case "dashboard": 
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Overview ✨</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Welcome back, {user?.name || "Admin"}!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(s => {
                const c = colorCls[s.color] || colorCls.navy;
                return (
                  <div key={s.label} className={"bg-white rounded-3xl shadow-sm border-l-4 p-6 hover:shadow-md transition-all " + c.border}>
                    <div className={"w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 " + c.bg}>{s.icon}</div>
                    <div className={"text-3xl font-black " + c.text}>{s.value}</div>
                    <div className="text-slate-500 text-sm mt-1 font-bold">{s.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
              <h3 className="font-extrabold text-yellow-500 text-xl mb-8 relative z-10 uppercase tracking-widest">Today at a Glance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                {[["8","Open Tickets"],["3","Pending Payments"],["2","Laundry Ready"]].map(([v, l]) => (
                  <div key={l} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors">
                    <div className="text-4xl font-black text-white">{v}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "users":
        return <div className="p-12 text-center bg-white rounded-3xl shadow-sm">
                 <span className="text-4xl mb-4 block">👥</span>
                 <h2 className="text-xl font-bold">User Management</h2>
                 <p className="text-slate-500">Module under development.</p>
               </div>;

      // --- ONLY THIS BLOCK WAS UPDATED TO MATCH YOUR DASHBOARD STYLE ---
      case "rooms":
      case "roomManage": 
        return (
          <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden h-full flex flex-col border border-slate-100">
            <div className="flex-1 overflow-y-auto">
              <RoomManage />
            </div>
          </div>
        );
      // ----------------------------------------------------------------

      case "payments":
        return <div className="p-12 text-center bg-white rounded-3xl shadow-sm">
                 <span className="text-4xl mb-4 block">💳</span>
                 <h2 className="text-xl font-bold">Payment Management</h2>
                 <p className="text-slate-500">Module under development.</p>
               </div>;

      case "laundry":
        return <div className="p-12 text-center bg-white rounded-3xl shadow-sm">
                 <span className="text-4xl mb-4 block">🧺</span>
                 <h2 className="text-xl font-bold">Laundry Management</h2>
                 <p className="text-slate-500">Module under development.</p>
               </div>;

      case "complaints":
        return (
          <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden h-full flex flex-col border border-slate-100">
            <div className="flex-1 overflow-y-auto p-6">
              <AdminComplaints isEmbedded={true} />
            </div>
          </div>
        );

      case "feedback":
        return (
          <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden h-full flex flex-col border border-slate-100">
            <div className="flex-1 overflow-y-auto p-6">
              <AdminFeedback isEmbedded={true} />
            </div>
          </div>
        );

      case "meals":
        return <div className="p-12 text-center bg-white rounded-3xl shadow-sm">
                 <span className="text-4xl mb-4 block">🍽️</span>
                 <h2 className="text-xl font-bold">Meal Records</h2>
                 <p className="text-slate-500">Module under development.</p>
               </div>;

      default: 
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      
      {/* Sidebar Component */}
      <AdminSidebar 
        collapsed={collapsed} 
        active={active} 
        setActive={setActive} 
        handleLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <span className="text-2xl">☰</span>
            </button>
            <div>
              <h1 className="font-black text-slate-800 text-xl tracking-tight">
                {active.charAt(0).toUpperCase() + active.slice(1)}
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Hostel Admin Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800">{user?.name || "Administrator"}</p>
              <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Master Admin</p>
            </div>
            <div className="w-11 h-11 bg-slate-900 text-yellow-500 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#FBFBFE]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}