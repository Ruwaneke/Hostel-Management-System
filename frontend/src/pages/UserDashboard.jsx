import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { id: "overview",   label: "Overview",   icon: "" },
  { id: "room",       label: "My Room",    icon: "" },
  { id: "payments",   label: "Payments",   icon: "" },
  { id: "laundry",    label: "Laundry",    icon: "" },
  { id: "complaints", label: "Complaints", icon: "" },
  { id: "contact",    label: "Contact",    icon: "" },
];

const statusColor = {
  Paid:      "bg-yellow-100 text-yellow-800",
  Upcoming:  "bg-yellow-100 text-yellow-800",
  Delivered: "bg-yellow-100 text-yellow-800",
  Open:      "bg-red-100 text-red-700",
  Resolved:  "bg-yellow-100 text-yellow-800",
  Pending:   "bg-yellow-100 text-yellow-800",
};

const Badge = ({ s }) => (
  <span className={"px-2.5 py-0.5 rounded-full text-xs font-semibold " + (statusColor[s] || "bg-slate-100 text-slate-600")}>
    {s}
  </span>
);

const TH = ({ children }) => <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{children}</th>;
const TD = ({ children }) => <td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100">{children}</td>;

export default function UserDashboard() {
  const [active, setActive]       = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [complaint, setComplaint] = useState("");
  const [laundryItems, setLaundryItems] = useState("");
  const [submitted, setSubmitted] = useState({ complaint: false, laundry: false });

  const restaurants = [
    {
      id: 1,
      name: "Avanya",
      phone: "+94112345678",
      address: "Malabe, Sri Lanka",
      coordinates: { lat: 6.8730, lng: 80.7690 },
      meals: {
        today: {
          breakfast: { name: "Breakfast", items: ["Hoppers", "Jaggery", "Tea"] },
          lunch: { name: "Lunch", items: ["Curry & Rice", "Sambol", "Papadum"] },
          dinner: { name: "Dinner", items: ["Kottu Roti", "Curry Gravy", "Pickle"] }
        }
      }
    },
    {
      id: 2,
      name: "Luck Chinese Foods",
      phone: "+94119876543",
      address: "Malabe, Sri Lanka",
      coordinates: { lat: 6.8735, lng: 80.7695 },
      meals: {
        today: {
          breakfast: { name: "Breakfast", items: ["Steamed Momos", "Green Tea", "Toast"] },
          lunch: { name: "Lunch", items: ["Fried Rice", "Spring Rolls", "Sweet & Sour Chicken"] },
          dinner: { name: "Dinner", items: ["Hakka Noodles", "Chilli Garlic Prawns", "Fortune Cookies"] }
        }
      }
    },
    {
      id: 3,
      name: "Cafe Miya Miya",
      phone: "+94114567890",
      address: "Malabe, Sri Lanka",
      coordinates: { lat: 6.8740, lng: 80.7700 },
      meals: {
        today: {
          breakfast: { name: "Breakfast", items: ["Matcha Pancakes", "Miso Soup", "Rice Balls"] },
          lunch: { name: "Lunch", items: ["Teriyaki Chicken", "Edamame", "Miso Broth"] },
          dinner: { name: "Dinner", items: ["Tempura Udon", "Grilled Fish", "Green Tea Tiramisu"] }
        }
      }
    },
    {
      id: 4,
      name: "Anama",
      phone: "+94112223334",
      address: "Malabe, Sri Lanka",
      coordinates: { lat: 6.8745, lng: 80.7705 },
      meals: {
        today: {
          breakfast: { name: "Breakfast", items: ["Short Eats", "Wadeye", "Curry"] },
          lunch: { name: "Lunch", items: ["Dhal Curry", "Coconut Sambol", "Rice & Gravy"] },
          dinner: { name: "Dinner", items: ["Fish Curry", "Bread Roll", "Jaggery Pudding"] }
        }
      }
    },
    {
      id: 5,
      name: "Golden Meal",
      phone: "+94115555666",
      address: "Malabe, Sri Lanka",
      coordinates: { lat: 6.8750, lng: 80.7710 },
      meals: {
        today: {
          breakfast: { name: "Breakfast", items: ["Eggs Benedict", "Toast", "Coffee"] },
          lunch: { name: "Lunch", items: ["Grilled Chicken", "Vegetables", "Fries"] },
          dinner: { name: "Dinner", items: ["Steak", "Mashed Potatoes", "Chocolate Cake"] }
        }
      }
    }
  ];

  const { user, logout }          = useAuth();
  const navigate                  = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const renderContent = () => {
    switch (active) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Welcome back, {user?.name}! </h2>
              <p className="text-slate-400 text-sm mt-1">Here is your hostel summary for today.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: "", value: "204",  label: "My Room",       color: "border-l-indigo-500", tc: "text-indigo-600", bg: "bg-indigo-50" },
                { icon: "", value: "Paid", label: "March Fee",     color: "border-l-green-500",  tc: "text-green-600",  bg: "bg-green-50"  },
                { icon: "", value: "3",    label: "Laundry Items", color: "border-l-cyan-500",   tc: "text-cyan-600",   bg: "bg-cyan-50"   },
                { icon: "", value: "1",    label: "Open Ticket",   color: "border-l-amber-500",  tc: "text-amber-600",  bg: "bg-amber-50"  },
              ].map(s => (
                <div key={s.label} className={"bg-white rounded-2xl shadow-sm border-l-4 p-5 " + s.color}>
                  <div className={"w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 " + s.bg}>{s.icon}</div>
                  <div className={"text-2xl font-extrabold " + s.tc}>{s.value}</div>
                  <div className="text-slate-500 text-xs mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[["","Raise Complaint","complaints"],["","Submit Laundry","laundry"],["","View Payments","payments"],["","Today's Meals","meals"]].map(([icon, label, id]) => (
                  <button key={id} onClick={() => setActive(id)}
                    className="flex flex-col items-center gap-2 py-4 px-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl text-sm font-medium text-slate-600 transition border border-slate-200 hover:border-indigo-200">
                    <span className="text-xl">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "room":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">My Room</h2>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  ["Room Number",   "Room 204"],
                  ["Floor",         "2nd Floor"],
                  ["Room Type",     "Double Sharing"],
                  ["Roommate",      "Bob Smith"],
                  ["Check-in Date", "Jan 10, 2026"],
                  ["Status",        "Active"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs text-slate-400 font-medium mb-1">{label}</div>
                    <div className={"font-bold text-sm " + (label === "Status" ? "text-green-600" : "text-slate-800")}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">My Payments</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><TH>Month</TH><TH>Amount</TH><TH>Due Date</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {[
                    { month: "March 2026",    amount: "$450", due: "Mar 5",  status: "Paid"    },
                    { month: "February 2026", amount: "$450", due: "Feb 5",  status: "Paid"    },
                    { month: "January 2026",  amount: "$450", due: "Jan 5",  status: "Paid"    },
                    { month: "April 2026",    amount: "$450", due: "Apr 5",  status: "Upcoming"},
                  ].map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <TD>{p.month}</TD>
                      <TD><span className="font-semibold">{p.amount}</span></TD>
                      <TD>{p.due}</TD>
                      <TD><Badge s={p.status} /></TD>
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
            <h2 className="text-xl font-bold text-slate-800">Laundry Service</h2>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-700 mb-4">Submit a Laundry Request</h3>
              {submitted.laundry ? (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span></span> Request submitted! Expected return: Tomorrow 5 PM
                </div>
              ) : (
                <div className="flex gap-3 flex-wrap">
                  <input
                    type="number" min="1" placeholder="Number of items"
                    value={laundryItems} onChange={e => setLaundryItems(e.target.value)}
                    className="flex-1 min-w-0 px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                  />
                  <button
                    onClick={() => { if (laundryItems) setSubmitted(s => ({ ...s, laundry: true })); }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
                  >
                    Submit Request
                  </button>
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><TH>Date</TH><TH>Items</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {[
                    { date: "Mar 6, 2026",  items: "5 pcs", status: "Delivered" },
                    { date: "Feb 20, 2026", items: "3 pcs", status: "Delivered" },
                  ].map((l, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <TD>{l.date}</TD><TD>{l.items}</TD><TD><Badge s={l.status} /></TD>
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
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-700 mb-4">Raise a New Complaint</h3>
              {submitted.complaint ? (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span></span> Complaint submitted! Ticket #14 created. We will get back to you soon.
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={3} placeholder="Describe your issue..."
                    value={complaint} onChange={e => setComplaint(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50 resize-none"
                  />
                  <button
                    onClick={() => { if (complaint.trim()) setSubmitted(s => ({ ...s, complaint: true })); }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
                  >
                    Submit Complaint
                  </button>
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><TH>Issue</TH><TH>Date</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {[
                    { issue: "Broken AC in room 204", date: "Mar 7",  status: "Open"     },
                    { issue: "Leaking tap fixed",     date: "Feb 15", status: "Resolved" },
                  ].map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <TD>{c.issue}</TD><TD>{c.date}</TD><TD><Badge s={c.status} /></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Contact Administration</h2>
              <p className="text-slate-400 text-sm mt-1">Get in touch with management & restaurant services</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-4">Admin Contact Details</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                      <p className="text-xs text-indigo-100 font-semibold uppercase mb-1">Hostel Manager</p>
                      <p className="text-lg font-bold">Mr. Rajesh Kumar</p>
                      <p className="text-sm text-indigo-200 mt-1">📞 +91 9876543210</p>
                      <p className="text-sm text-indigo-200">📧 rajesh.kumar@hostel.com</p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                      <p className="text-xs text-indigo-100 font-semibold uppercase mb-1">Restaurant Manager</p>
                      <p className="text-lg font-bold">Ms. Priya Sharma</p>
                      <p className="text-sm text-indigo-200 mt-1">📞 +91 9876543211</p>
                      <p className="text-sm text-indigo-200">📧 meals@hostel.com</p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                      <p className="text-xs text-indigo-100 font-semibold uppercase mb-1">Hostel Address</p>
                      <p className="text-sm text-indigo-100 leading-relaxed mt-2">
                        Green Valley Hostel,<br/>
                        MG Road, Residency Area,<br/>
                        Bengaluru, Karnataka 560001,<br/>
                        India
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Actions */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-semibold transition border border-green-200">
                      <span>📱</span> Call Manager
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-semibold transition border border-blue-200">
                      <span>✉️</span> Send Email
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-semibold transition border border-purple-200">
                      <span>💬</span> Message on WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-96">
                  <iframe
                    title="Hostel Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen=""
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d969.8473508816476!2d77.59821971171723!3d12.970391549989005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16681c1d55d5%3A0x19e8330a4b7b8b8b!2sGreen%20Valley%20Hostel%2C%20MG%20Road%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1234567890"
                  ></iframe>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-slate-800 mb-3">Location Highlights</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Located in the heart of Bengaluru's business district</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Easy access to public transportation (Metro & Bus)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Close to shopping centers, cafes, and restaurants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Ample parking available for visitors</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-800 mb-4">Office Hours & Support</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-slate-500 font-semibold mb-1">Admin Office</p>
                  <p className="text-lg font-bold text-amber-700">9 AM - 6 PM</p>
                  <p className="text-xs text-slate-500 mt-1">Mon - Fri</p>
                </div>
                <div className="text-center border-l border-r border-amber-200">
                  <p className="text-sm text-slate-500 font-semibold mb-1">Restaurant Hours</p>
                  <p className="text-lg font-bold text-amber-700">24/7 Service</p>
                  <p className="text-xs text-slate-500 mt-1">All Days</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500 font-semibold mb-1">Emergency Support</p>
                  <p className="text-lg font-bold text-amber-700">24/7 Available</p>
                  <p className="text-xs text-slate-500 mt-1">Security & Medical</p>
                </div>
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={"flex flex-col text-white transition-all duration-300 " + (collapsed ? "w-16" : "w-56")} style={{backgroundColor: "#14213d"}}>
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{borderColor: "rgba(255,255,255,0.1)"}}>
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
                  ? "text-white shadow"
                  : "text-gray-300 hover:text-white")}
              style={active === item.id ? {backgroundColor: "#fca311"} : {backgroundColor: "rgba(252,163,17,0.1)"}}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="px-2 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:text-red-200 transition-all"
            style={{backgroundColor: "rgba(239,68,68,0.1)"}}
          >
            <span className="flex-shrink-0"></span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"></button>
            <div>
              <h1 className="font-bold text-slate-800 text-sm">
                {menuItems.find(m => m.id === active)?.icon}{" "}
                {menuItems.find(m => m.id === active)?.label}
              </h1>
              <p className="text-slate-400 text-xs">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-400">Student</p>
            </div>
            <div className="w-9 h-9 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
