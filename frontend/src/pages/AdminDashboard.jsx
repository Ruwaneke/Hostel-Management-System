import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar, { menuItems } from "./adminSidebar"; // <-- Ensure this matches your file name exactly
import RoomManage from "./roomAllocation/roomManage"; // <-- Ensure this matches your file name exactly

// --- DATA ARRAYS ---
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

const usersData      = [ { name: "Alice Johnson", email: "alice@example.com", role: "user",  room: "101", status: "Active" }, { name: "Bob Smith",     email: "bob@example.com",   role: "user",  room: "102", status: "Active" }, { name: "Carol White",   email: "carol@example.com", role: "admin", room: "",   status: "Admin"  } ];
const roomsData      = [ { room: "101", type: "Single", floor: "1st", capacity: 1, status: "Occupied"  }, { room: "102", type: "Double", floor: "1st", capacity: 2, status: "Occupied"  }, { room: "201", type: "Single", floor: "2nd", capacity: 1, status: "Available" }, { room: "202", type: "Triple", floor: "2nd", capacity: 3, status: "Available" } ];
const paymentsData   = [ { student: "Alice Johnson", amount: "$450", month: "March 2026",    status: "Paid"    }, { student: "Bob Smith",      amount: "$450", month: "March 2026",    status: "Pending" }, { student: "David Lee",      amount: "$450", month: "February 2026", status: "Overdue" } ];
const laundryData    = [ { student: "Alice Johnson", items: 5, submitted: "Today 9:00 AM",  status: "In Progress" }, { student: "Bob Smith",      items: 3, submitted: "Today 8:30 AM",  status: "Ready"        }, { student: "Carol White",   items: 7, submitted: "Yesterday",      status: "Delivered"    } ];
const complaintsData = [ { student: "Alice Johnson", issue: "Broken AC in room 101",       date: "Mar 7", status: "Open"        }, { student: "Bob Smith",      issue: "Hot water not working",       date: "Mar 6", status: "Resolved"    }, { student: "David Lee",      issue: "Lights flickering room 205",  date: "Mar 5", status: "In Progress" } ];
const mealsData      = [ { day: "Monday",    breakfast: "Oats & Milk",      lunch: "Rice & Dal",       dinner: "Roti & Paneer"  }, { day: "Tuesday",   breakfast: "Bread & Eggs",     lunch: "Noodles",          dinner: "Biryani"        }, { day: "Wednesday", breakfast: "Poha",             lunch: "Chana Masala",     dinner: "Dal Makhani"    }, { day: "Thursday",  breakfast: "Idli & Sambar",    lunch: "Rajma Rice",       dinner: "Pasta"          }, { day: "Friday",    breakfast: "Upma",             lunch: "Pulao",            dinner: "Chole Bhature"  } ];

const TH = ({ children }) => <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{children}</th>;
const TD = ({ children }) => <td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100">{children}</td>;
// --- END DATA ARRAYS ---

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
            <h2 className="text-2xl font-bold text-slate-800">Welcome back, Admin!</h2>
            <p className="text-slate-500">Select an option from the sidebar to manage the system.</p>
          </div>
        );
      case "users": 
        return <div className="p-8">User Management Coming Soon...</div>; // Replaced with a placeholder
      case "roomManage": 
        return <RoomManage />;
      case "payments":
        return <div className="p-8">Payment Management Coming Soon...</div>;
      case "laundry":
        return <div className="p-8">Laundry Management Coming Soon...</div>;
      case "complaints":
        return <div className="p-8">Complaints Management Coming Soon...</div>;
      case "meals":
        return <div className="p-8">Meal Management Coming Soon...</div>;
      default: 
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      
      {/* 1. Sidebar */}
      <AdminSidebar 
        collapsed={collapsed} 
        active={active} 
        setActive={setActive} 
        handleLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
            >
              ☰
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
              <p className="text-sm font-semibold text-slate-700">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}