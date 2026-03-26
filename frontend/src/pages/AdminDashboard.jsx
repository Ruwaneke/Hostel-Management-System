import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminComplaints from "./AdminComplaints";
import AdminFeedback from "./AdminFeedback";

const menuItems = [
  { id: "dashboard",  label: "Dashboard",  icon: "" },
  { id: "users",      label: "Users",      icon: "" },
  { id: "rooms",      label: "Rooms",      icon: "" },
  { id: "payments",   label: "Payments",   icon: "" },
  { id: "laundry",    label: "Laundry",    icon: "" },
  { id: "complaints", label: "Complaints", icon: "" },
  { id: "meals",      label: "Meals",      icon: "" },
  { id: "feedback",   label: "Feedback",   icon: "" },
];

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

const statusColor = {
  Active:       "bg-[#fca311] bg-opacity-20 text-[#fca311]",
  Admin:        "bg-[#14213d] bg-opacity-10 text-[#14213d]",
  Paid:         "bg-[#fca311] bg-opacity-20 text-[#fca311]",
  Pending:      "bg-[#fca311] bg-opacity-20 text-[#fca311]",
  Overdue:      "bg-red-100 text-red-700",
  "In Progress":"bg-[#fca311] bg-opacity-20 text-[#fca311]",
  Ready:        "bg-[#fca311] bg-opacity-20 text-[#fca311]",
  Delivered:    "bg-[#fca311] bg-opacity-20 text-[#fca311]",
  Open:         "bg-red-100 text-red-700",
  Resolved:     "bg-[#fca311] bg-opacity-20 text-[#fca311]",
  Available:    "bg-[#fca311] bg-opacity-20 text-[#fca311]",
  Occupied:     "bg-red-100 text-red-700",
};

const Badge = ({ s }) => (
  <span className={"px-2.5 py-0.5 rounded-full text-xs font-semibold " + (statusColor[s] || "bg-slate-100 text-slate-600")}>
    {s}
  </span>
);

const usersData    = [
  { name: "Alice Johnson", email: "alice@example.com", role: "user",  room: "101", status: "Active" },
  { name: "Bob Smith",     email: "bob@example.com",   role: "user",  room: "102", status: "Active" },
  { name: "Carol White",   email: "carol@example.com", role: "admin", room: "",   status: "Admin"  },
];
const roomsData    = [
  { room: "101", type: "Single", floor: "1st", capacity: 1, status: "Occupied"  },
  { room: "102", type: "Double", floor: "1st", capacity: 2, status: "Occupied"  },
  { room: "201", type: "Single", floor: "2nd", capacity: 1, status: "Available" },
  { room: "202", type: "Triple", floor: "2nd", capacity: 3, status: "Available" },
];
const paymentsData = [
  { student: "Alice Johnson", amount: "$450", month: "March 2026",    status: "Paid"    },
  { student: "Bob Smith",     amount: "$450", month: "March 2026",    status: "Pending" },
  { student: "David Lee",     amount: "$450", month: "February 2026", status: "Overdue" },
];
const laundryData  = [
  { student: "Alice Johnson", items: 5, submitted: "Today 9:00 AM",  status: "In Progress" },
  { student: "Bob Smith",     items: 3, submitted: "Today 8:30 AM",  status: "Ready"        },
  { student: "Carol White",   items: 7, submitted: "Yesterday",      status: "Delivered"    },
];
const complaintsData = [
  { student: "Alice Johnson", issue: "Broken AC in room 101",       date: "Mar 7", status: "Open"        },
  { student: "Bob Smith",     issue: "Hot water not working",       date: "Mar 6", status: "Resolved"    },
  { student: "David Lee",     issue: "Lights flickering room 205",  date: "Mar 5", status: "In Progress" },
];

const TH = ({ children }) => <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{children}</th>;
const TD = ({ children }) => <td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100">{children}</td>;

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
              <h2 className="text-2xl font-black text-brand-navy tracking-tight">Dashboard Overview ✨</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Welcome back, {user?.name}!</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(s => {
                const c = colorCls[s.color];
                return (
                  <div key={s.label} className={"bg-brand-white rounded-3xl shadow-sm border-l-4 p-5 hover:shadow-md transition-shadow " + c.border}>
                    <div className={"w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 " + c.bg}>{s.icon}</div>
                    <div className={"text-3xl font-black " + c.text}>{s.value}</div>
                    <div className="text-slate-500 text-sm mt-1 font-semibold">{s.label}</div>
                  </div>
                );
              })}
            </div>
            <div className="bg-brand-navy rounded-3xl p-8 text-brand-platinum shadow-lg border border-brand-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
              <h3 className="font-extrabold text-brand-gold text-xl mb-6 relative z-10">Today at a Glance</h3>
              <div className="grid grid-cols-3 gap-6 text-center mt-4 relative z-10">
                {[["8","Open Tickets"],["3","Pending Payments"],["2","Laundry Ready"]].map(([v, l]) => (
                  <div key={l} className="bg-brand-white/5 border border-brand-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="text-3xl font-black text-brand-white">{v}</div>
                    <div className="text-sm font-semibold text-brand-platinum/70 uppercase tracking-wider mt-2">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">User Management</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><TH>Name</TH><TH>Email</TH><TH>Role</TH><TH>Room</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {usersData.map(u => (
                    <tr key={u.email} className="hover:bg-slate-50 transition">
                      <TD><div className="flex items-center gap-2"><div className="w-7 h-7 text-white rounded-full flex items-center justify-center text-xs font-bold" style={{backgroundColor: "#14213d"}}>{u.name[0]}</div>{u.name}</div></TD>
                      <TD>{u.email}</TD>
                      <TD><Badge s={u.role === "admin" ? "Admin" : "Active"} /></TD>
                      <TD>{u.room}</TD>
                      <TD><Badge s={u.status} /></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "rooms":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Room Management</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><TH>Room</TH><TH>Type</TH><TH>Floor</TH><TH>Capacity</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {roomsData.map(r => (
                    <tr key={r.room} className="hover:bg-slate-50 transition">
                      <TD><span className="font-semibold">Room {r.room}</span></TD>
                      <TD>{r.type}</TD><TD>{r.floor}</TD><TD>{r.capacity} person(s)</TD>
                      <TD><Badge s={r.status} /></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Payment Management</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><TH>Student</TH><TH>Amount</TH><TH>Month</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {paymentsData.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <TD>{p.student}</TD><TD className="font-semibold">{p.amount}</TD><TD>{p.month}</TD><TD><Badge s={p.status} /></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "laundry":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Laundry Management</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><TH>Student</TH><TH>Items</TH><TH>Submitted</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {laundryData.map((l, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <TD>{l.student}</TD><TD>{l.items} pcs</TD><TD>{l.submitted}</TD><TD><Badge s={l.status} /></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "complaints":
        return (
          <div className="bg-brand-white rounded-3xl shadow-sm overflow-hidden h-full flex flex-col border border-brand-platinum/30">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
              <AdminComplaints isEmbedded={true} />
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
              <span className={"text-xl flex-shrink-0 " + (active !== item.id && "opacity-70")}>{"→"}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-6 border-t border-brand-white/10 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
          >
            <span className="flex-shrink-0 text-xl opacity-80">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
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
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
