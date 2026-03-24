import React from "react";

export const menuItems = [
  { id: "dashboard",  label: "Dashboard",   icon: "📊" },
  { id: "users",      label: "Users",       icon: "👥" },
  { id: "roomManage", label: "Manage Rooms",icon: "🛏️" }, // Linked to roomManage
  { id: "payments",   label: "Payments",    icon: "💳" },
  { id: "laundry",    label: "Laundry",     icon: "🧺" },
  { id: "complaints", label: "Complaints",  icon: "🛠️" },
  { id: "meals",      label: "Meals",       icon: "🍽️" },
];

export default function AdminSidebar({ collapsed, active, setActive, handleLogout }) {
  return (
    <aside className={"flex flex-col bg-indigo-900 text-white transition-all duration-300 " + (collapsed ? "w-16" : "w-56")}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-indigo-800">
        <span className="text-2xl flex-shrink-0">🏢</span>
        {!collapsed && <span className="font-extrabold text-lg">HostelMS</span>}
      </div>
      
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            title={collapsed ? item.label : ""}
            className={
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all " +
              (active === item.id
                ? "bg-white text-indigo-800 shadow"
                : "text-indigo-200 hover:bg-indigo-800 hover:text-white")
            }
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
          <span className="flex-shrink-0">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}