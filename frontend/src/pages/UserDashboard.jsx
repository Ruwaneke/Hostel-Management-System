import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserComplaints from "./UserComplaints";
import UserFeedback from "./UserFeedback";

const menuItems = [
  { id: "overview",   label: "Overview",   icon: "" },
  { id: "room",       label: "My Room",    icon: "" },
  { id: "payments",   label: "Payments",   icon: "" },
  { id: "laundry",    label: "Laundry",    icon: "" },
  { id: "complaints", label: "Complaints", icon: "" },
  { id: "meals",      label: "Meals",      icon: "" },
  { id: "feedback",   label: "Feedback",   icon: "" },
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <h2 className="text-2xl font-black text-brand-navy tracking-tight">Welcome back, {user?.name}! ✨</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Here is your hostel summary for today.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: "🛏️", value: "204",  label: "My Room",       color: "border-brand-navy", tc: "text-brand-navy", bg: "bg-brand-navy/5" },
                { icon: "💳", value: "Paid", label: "March Fee",     color: "border-emerald-500",  tc: "text-emerald-700",  bg: "bg-emerald-50"  },
                { icon: "👕", value: "3",    label: "Laundry Items", color: "border-sky-500",   tc: "text-sky-700",   bg: "bg-sky-50"   },
                { icon: "🔧", value: "1",    label: "Open Ticket",   color: "border-brand-gold",  tc: "text-[#e5920f]",  bg: "bg-brand-gold/10"  },
              ].map(s => (
                <div key={s.label} className={"bg-brand-white rounded-3xl shadow-sm border-l-4 p-5 hover:shadow-md transition-shadow " + s.color}>
                  <div className={"w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 " + s.bg}>{s.icon}</div>
                  <div className={"text-3xl font-black " + s.tc}>{s.value}</div>
                  <div className="text-slate-500 text-sm mt-1 font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-brand-white rounded-3xl shadow-sm p-6 border border-brand-platinum/30">
              <h3 className="font-bold text-brand-navy mb-5 text-lg">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[["🔧","Raise Complaint","complaints"],["👕","Submit Laundry","laundry"],["💳","View Payments","payments"],["🍽️","Today's Meals","meals"]].map(([icon, label, id]) => (
                  <button key={id} onClick={() => setActive(id)}
                    className="flex flex-col items-center gap-3 py-5 px-3 bg-brand-platinum/10 hover:bg-brand-gold/10 hover:text-brand-navy rounded-2xl text-sm font-bold text-slate-600 transition-all border border-brand-platinum/50 hover:border-brand-gold/50 hover:shadow-md">
                    <span className="text-2xl drop-shadow-sm">{icon}</span>
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
                    className="flex-1 min-w-0 px-5 py-3 border-2 border-brand-platinum rounded-xl text-sm font-medium focus:outline-none focus:border-brand-gold bg-brand-platinum/10 transition-colors"
                  />
                  <button
                    onClick={() => { if (laundryItems) setSubmitted(s => ({ ...s, laundry: true })); }}
                    className="px-6 py-3 bg-brand-gold hover:bg-[#e5920f] text-brand-black text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
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
        return <UserComplaints isEmbedded={true} />;

      case "feedback":
        return <UserFeedback isEmbedded={true} />;

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
        <header className="bg-brand-white border-b border-brand-platinum/50 px-8 py-4 flex items-center justify-between flex-shrink-0 relative z-10 shadow-sm">
          <div className="flex items-center gap-5">
            <button onClick={() => setCollapsed(!collapsed)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-brand-platinum/30 text-brand-navy transition-colors">
              <span className="text-xl">☰</span>
            </button>
            <div>
              <h1 className="font-extrabold text-brand-navy text-xl tracking-tight flex items-center gap-2">
                {menuItems.find(m => m.id === active)?.label}
              </h1>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-0.5">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-brand-navy">{user?.name}</p>
              <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider">Student</p>
            </div>
            <div className="w-11 h-11 bg-brand-navy text-brand-gold rounded-full flex items-center justify-center font-bold text-lg shadow-inner ring-2 ring-brand-platinum/50">
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
