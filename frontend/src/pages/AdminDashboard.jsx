import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { id: "dashboard",  label: "Dashboard",  icon: "" },
  { id: "users",      label: "Users",      icon: "" },
  { id: "rooms",      label: "Rooms",      icon: "" },
  { id: "payments",   label: "Payments",   icon: "" },
  { id: "laundry",    label: "Laundry",    icon: "" },
  { id: "complaints", label: "Complaints", icon: "" },
  { id: "meals",      label: "Meals",      icon: "" },
];

const stats = [
  { label: "Total Rooms",    value: 48,  icon: "", color: "indigo" },
  { label: "Occupied",       value: 35,  icon: "",  color: "green"  },
  { label: "Total Students", value: 127, icon: "",  color: "cyan"   },
  { label: "Open Tickets",   value: 8,   icon: "",  color: "red"    },
];

const colorCls = {
  indigo: { border: "border-l-indigo-500", text: "text-indigo-600", bg: "bg-indigo-50" },
  green:  { border: "border-l-green-500",  text: "text-green-600",  bg: "bg-green-50"  },
  cyan:   { border: "border-l-cyan-500",   text: "text-cyan-600",   bg: "bg-cyan-50"   },
  red:    { border: "border-l-red-500",    text: "text-red-600",    bg: "bg-red-50"    },
};

const statusColor = {
  Active:       "bg-green-100 text-green-700",
  Admin:        "bg-violet-100 text-violet-700",
  Paid:         "bg-green-100 text-green-700",
  Pending:      "bg-amber-100 text-amber-700",
  Overdue:      "bg-red-100 text-red-700",
  "In Progress":"bg-amber-100 text-amber-700",
  Ready:        "bg-cyan-100 text-cyan-700",
  Delivered:    "bg-green-100 text-green-700",
  Open:         "bg-red-100 text-red-700",
  Resolved:     "bg-green-100 text-green-700",
  Available:    "bg-green-100 text-green-700",
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
const mealsData    = [
  { day: "Monday",    breakfast: "Oats & Milk",      lunch: "Rice & Dal",       dinner: "Roti & Paneer"  },
  { day: "Tuesday",   breakfast: "Bread & Eggs",     lunch: "Noodles",          dinner: "Biryani"        },
  { day: "Wednesday", breakfast: "Poha",             lunch: "Chana Masala",     dinner: "Dal Makhani"    },
  { day: "Thursday",  breakfast: "Idli & Sambar",    lunch: "Rajma Rice",       dinner: "Pasta"          },
  { day: "Friday",    breakfast: "Upma",             lunch: "Pulao",            dinner: "Chole Bhature"  },
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
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>
              <p className="text-slate-400 text-sm mt-1">Welcome back, {user?.name}!</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(s => {
                const c = colorCls[s.color];
                return (
                  <div key={s.label} className={"bg-white rounded-2xl shadow-sm border-l-4 p-5 " + c.border}>
                    <div className={"text-2xl w-10 h-10 rounded-xl flex items-center justify-center mb-3 " + c.bg}>{s.icon}</div>
                    <div className={"text-2xl font-extrabold " + c.text}>{s.value}</div>
                    <div className="text-slate-500 text-xs mt-1 font-medium">{s.label}</div>
                  </div>
                );
              })}
            </div>
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Today at a Glance</h3>
              <div className="grid grid-cols-3 gap-4 text-center mt-4">
                {[["8","Open Tickets"],["3","Pending Payments"],["2","Laundry Ready"]].map(([v, l]) => (
                  <div key={l} className="bg-white/20 rounded-xl p-3">
                    <div className="text-2xl font-extrabold">{v}</div>
                    <div className="text-xs text-indigo-100 mt-1">{l}</div>
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
                      <TD><div className="flex items-center gap-2"><div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{u.name[0]}</div>{u.name}</div></TD>
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
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Complaints & Maintenance</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><TH>Student</TH><TH>Issue</TH><TH>Date</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {complaintsData.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <TD>{c.student}</TD><TD>{c.issue}</TD><TD>{c.date}</TD><TD><Badge s={c.status} /></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "meals":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Weekly Meal Schedule</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><TH>Day</TH><TH>Breakfast</TH><TH>Lunch</TH><TH>Dinner</TH></tr></thead>
                <tbody>
                  {mealsData.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <TD><span className="font-bold text-indigo-700">{m.day}</span></TD>
                      <TD>{m.breakfast}</TD><TD>{m.lunch}</TD><TD>{m.dinner}</TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={"flex flex-col bg-indigo-900 text-white transition-all duration-300 " + (collapsed ? "w-16" : "w-56")}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-indigo-800">
          <span className="text-2xl flex-shrink-0"></span>
          {!collapsed && <span className="font-extrabold text-lg">HostelMS</span>}
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              title={collapsed ? item.label : ""}
              className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all " +
                (active === item.id
                  ? "bg-white text-indigo-800 shadow"
                  : "text-indigo-200 hover:bg-indigo-800 hover:text-white")}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="px-2 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-900/40 hover:text-red-200 transition-all"
          >
            <span className="flex-shrink-0"></span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
            >
              
            </button>
            <div>
              <h1 className="font-bold text-slate-800 text-sm">
                {menuItems.find(m => m.id === active)?.icon}{" "}
                {menuItems.find(m => m.id === active)?.label}
              </h1>
              <p className="text-slate-400 text-xs">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
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
