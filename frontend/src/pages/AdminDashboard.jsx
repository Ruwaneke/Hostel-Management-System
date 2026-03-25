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
  indigo: { border: "border-l-blue-700", text: "text-blue-900", bg: "bg-blue-50" },
  green:  { border: "border-l-yellow-500",  text: "text-yellow-700",  bg: "bg-yellow-50"  },
  cyan:   { border: "border-l-yellow-600",   text: "text-yellow-800",   bg: "bg-yellow-50"   },
  red:    { border: "border-l-red-500",    text: "text-red-600",    bg: "bg-red-50"    },
};

const statusColor = {
  Active:       "bg-yellow-100 text-yellow-800",
  Admin:        "bg-blue-900 bg-opacity-10 text-blue-900",
  Paid:         "bg-yellow-100 text-yellow-800",
  Pending:      "bg-yellow-100 text-yellow-800",
  Overdue:      "bg-red-100 text-red-700",
  "In Progress":"bg-yellow-100 text-yellow-800",
  Ready:        "bg-yellow-100 text-yellow-800",
  Delivered:    "bg-yellow-100 text-yellow-800",
  Open:         "bg-red-100 text-red-700",
  Resolved:     "bg-yellow-100 text-yellow-800",
  Available:    "bg-yellow-100 text-yellow-800",
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
  const [selectedDay, setSelectedDay] = useState("today");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [showEditingMeals, setShowEditingMeals] = useState(false);
  const [editingRestaurantDetails, setEditingRestaurantDetails] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [phoneError, setPhoneError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [newFood, setNewFood] = useState({ mealType: "breakfast", food: "" });

  const initialRestaurants = [
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
        },
        tomorrow: {
          breakfast: { name: "Breakfast", items: ["Puttu", "Banana", "Milk"] },
          lunch: { name: "Lunch", items: ["Lamprais", "Salad", "Raita"] },
          dinner: { name: "Dinner", items: ["Devilled Chicken", "Roti", "Dessert"] }
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
        },
        tomorrow: {
          breakfast: { name: "Breakfast", items: ["Congee", "Century Egg", "Soy Milk"] },
          lunch: { name: "Lunch", items: ["Mapo Tofu", "Bok Choy", "Jasmine Rice"] },
          dinner: { name: "Dinner", items: ["Peking Duck", "Noodle Soup", "Lychee Pudding"] }
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
        },
        tomorrow: {
          breakfast: { name: "Breakfast", items: ["Tamagoyaki", "Nori Toast", "Yuzu Tea"] },
          lunch: { name: "Lunch", items: ["Katsu Curry", "Pickled Vegetables", "Akari Rice"] },
          dinner: { name: "Dinner", items: ["Yakitori Skewers", "Miso Ramen", "Dorayaki"] }
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
        },
        tomorrow: {
          breakfast: { name: "Breakfast", items: ["Pol Roti", "Jaggery", "Milk Tea"] },
          lunch: { name: "Lunch", items: ["Chick Pea Curry", "Eggplant Brinjal", "Basmati Rice"] },
          dinner: { name: "Dinner", items: ["Prawn Curry", "Chapati", "Fruit Salad"] }
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
        },
        tomorrow: {
          breakfast: { name: "Breakfast", items: ["Omelette", "Bacon", "Juice"] },
          lunch: { name: "Lunch", items: ["Beef Burger", "Coleslaw", "Ice Cream"] },
          dinner: { name: "Dinner", items: ["Salmon", "Asparagus", "Cheesecake"] }
        }
      }
    }
  ];

  const [restaurants, setRestaurants] = useState(initialRestaurants);

  const { user, logout }          = useAuth();
  const navigate                  = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+94\d{9,10}$/;
    return phoneRegex.test(phone);
  };

  const addRestaurant = () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setPhoneError("All fields are required");
      return;
    }
    if (!validatePhone(formData.phone)) {
      setPhoneError("Phone must start with +94 and have 9-10 digits");
      return;
    }

    const newRestaurant = {
      id: Math.max(...restaurants.map(r => r.id), 0) + 1,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      coordinates: { lat: 6.8750, lng: 80.7710 },
      meals: {
        today: {
          breakfast: { name: "Breakfast", items: [] },
          lunch: { name: "Lunch", items: [] },
          dinner: { name: "Dinner", items: [] }
        },
        tomorrow: {
          breakfast: { name: "Breakfast", items: [] },
          lunch: { name: "Lunch", items: [] },
          dinner: { name: "Dinner", items: [] }
        }
      }
    };

    setRestaurants([...restaurants, newRestaurant]);
    setFormData({ name: "", phone: "", address: "" });
    setPhoneError("");
    setShowAddRestaurant(false);
    setSaveMessage(`✅ ${newRestaurant.name} restaurant added successfully!`);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const updateRestaurant = (id, updatedData) => {
    const updatedRestaurants = restaurants.map(r => r.id === id ? { ...r, ...updatedData } : r);
    setRestaurants(updatedRestaurants);
    if (selectedRestaurant?.id === id) {
      setSelectedRestaurant(updatedRestaurants.find(r => r.id === id));
    }
  };

  const validatePhoneOnBlur = (phone) => {
    if (phone && !validatePhone(phone)) {
      setPhoneError("Phone must start with +94 and have 9-10 digits");
    } else {
      setPhoneError("");
    }
  };

  const deleteRestaurant = (id) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
    if (selectedRestaurant?.id === id) {
      setSelectedRestaurant(null);
      setShowEditingMeals(false);
    }
  };

  const addFoodToMeal = (restaurantId, mealType) => {
    if (newFood.food.trim() === "") return;
    const updatedRestaurants = restaurants.map(r => 
      r.id === restaurantId ? {
        ...r,
        meals: {
          ...r.meals,
          [selectedDay]: {
            ...r.meals[selectedDay],
            [mealType]: {
              ...r.meals[selectedDay][mealType],
              items: [...r.meals[selectedDay][mealType].items, newFood.food]
            }
          }
        }
      } : r
    );
    setRestaurants(updatedRestaurants);
    if (selectedRestaurant?.id === restaurantId) {
      setSelectedRestaurant(updatedRestaurants.find(r => r.id === restaurantId));
    }
    setNewFood({ mealType, food: "" });
  };

  const removeFoodFromMeal = (restaurantId, mealType, index) => {
    const updatedRestaurants = restaurants.map(r => 
      r.id === restaurantId ? {
        ...r,
        meals: {
          ...r.meals,
          [selectedDay]: {
            ...r.meals[selectedDay],
            [mealType]: {
              ...r.meals[selectedDay][mealType],
              items: r.meals[selectedDay][mealType].items.filter((_, i) => i !== index)
            }
          }
        }
      } : r
    );
    setRestaurants(updatedRestaurants);
    if (selectedRestaurant?.id === restaurantId) {
      setSelectedRestaurant(updatedRestaurants.find(r => r.id === restaurantId));
    }
  };

  const openGoogleMaps = (restaurant) => {
    const { coordinates, name } = restaurant;
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${coordinates.lat},${coordinates.lng},15z`;
    window.open(mapsUrl, "_blank");
  };

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
          <div className="space-y-6">
            {!showEditingMeals ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Restaurant Meal Management</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage restaurants and their daily meals</p>
                  </div>
                  <button
                    onClick={() => setShowAddRestaurant(!showAddRestaurant)}
                    className="px-6 py-3 text-white font-semibold rounded-xl transition"
                    style={{backgroundColor: "#14213d"}}
                  >
                    {showAddRestaurant ? "Cancel" : "+ Add Restaurant"}
                  </button>
                </div>

                {saveMessage && (
                  <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-pulse">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-lg">{saveMessage}</p>
                    </div>
                  </div>
                )}

                {showAddRestaurant && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Add New Restaurant</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Restaurant Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Restaurant name"
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number (format: +94XXXXXXXXX)</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            setPhoneError("");
                          }}
                          onFocus={(e) => {
                            if (!e.target.value) {
                              setFormData({ ...formData, phone: "+94" });
                            }
                          }}
                          onBlur={(e) => validatePhoneOnBlur(e.target.value)}
                          placeholder="+94XXXXXXXXX or +94XXXXXXXXXX"
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                        />
                        {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Full address"
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                        />
                      </div>
                      <button
                        onClick={addRestaurant}
                        className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
                      >
                        Add Restaurant
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map(restaurant => (
                    <div key={restaurant.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
                      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white">
                        <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                        <p className="text-sm text-indigo-100">Malabe, Sri Lanka</p>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 font-semibold mb-1">CONTACT</p>
                          <p className="text-sm font-bold text-slate-800">{restaurant.phone}</p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 font-semibold mb-2">TODAY'S MEALS</p>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {Object.entries(restaurant.meals.today).map(([type, data]) => (
                              data.items.length > 0 && (
                                <p key={type} className="text-xs text-slate-700 capitalize">
                                  <span className="font-semibold">{type}:</span> {data.items.slice(0, 2).join(", ")}{data.items.length > 2 ? "..." : ""}
                                </p>
                              )
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(restaurant.name)}/@${restaurant.coordinates.lat},${restaurant.coordinates.lng},15z`;
                            window.open(mapsUrl, "_blank");
                          }}
                          className="w-full px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-sm rounded-lg transition flex items-center justify-center gap-2"
                        >
                          📍 View on Map
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedRestaurant(restaurant);
                              setEditingRestaurantDetails({ ...restaurant });
                              setPhoneError("");
                              setShowEditingMeals(true);
                            }}
                            className="flex-1 px-3 py-2 text-white font-semibold text-sm rounded-lg transition"
                            style={{backgroundColor: "#14213d"}}
                          >
                            Edit Meals
                          </button>
                          <button
                            onClick={() => deleteRestaurant(restaurant.id)}
                            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowEditingMeals(false);
                      setSelectedRestaurant(null);
                      setEditingRestaurantDetails(null);
                      setPhoneError("");
                    }}
                    disabled={phoneError.length > 0}
                    className={`px-4 py-2 font-semibold rounded-lg text-sm transition ${
                      phoneError.length > 0
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "text-white"
                    }`}
                    style={phoneError.length === 0 ? {backgroundColor: "#14213d"} : {}}
                  >
                    ← Back to Restaurants
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedRestaurant?.name}</h2>
                    <p className="text-slate-400 text-sm">Edit meals for {selectedRestaurant?.name}</p>
                  </div>
                </div>

                {saveMessage && (
                  <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-pulse">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-lg">{saveMessage}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 text-lg">Restaurant Details</h3>
                    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Restaurant Name</label>
                        <input
                          type="text"
                          value={editingRestaurantDetails?.name || ""}
                          onChange={(e) => setEditingRestaurantDetails({ ...editingRestaurantDetails, name: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number</label>
                        <input
                          type="tel"
                          value={editingRestaurantDetails?.phone || ""}
                          onChange={(e) => {
                            setEditingRestaurantDetails({ ...editingRestaurantDetails, phone: e.target.value });
                            setPhoneError("");
                          }}
                          onFocus={(e) => {
                            if (!e.target.value) {
                              setEditingRestaurantDetails({ ...editingRestaurantDetails, phone: "+94" });
                            }
                          }}
                          placeholder="+94XXXXXXXXX or +94XXXXXXXXXX"
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                        />
                        {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={editingRestaurantDetails?.address || ""}
                          onChange={(e) => setEditingRestaurantDetails({ ...editingRestaurantDetails, address: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(editingRestaurantDetails?.name)}/@${editingRestaurantDetails?.coordinates.lat},${editingRestaurantDetails?.coordinates.lng},15z`;
                          window.open(mapsUrl, "_blank");
                        }}
                        className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition"
                      >
                        📍 View on Google Maps
                      </button>
                      <button
                        onClick={() => {
                          if (editingRestaurantDetails?.phone && !validatePhone(editingRestaurantDetails.phone)) {
                            setPhoneError("Phone must start with +94 and have 9-10 digits");
                            return;
                          }
                          updateRestaurant(editingRestaurantDetails.id, {
                            name: editingRestaurantDetails.name,
                            phone: editingRestaurantDetails.phone,
                            address: editingRestaurantDetails.address
                          });
                          setPhoneError("");
                          setSaveMessage(`✅ ${editingRestaurantDetails.name} details saved successfully!`);
                          setTimeout(() => setSaveMessage(""), 3000);
                        }}
                        className="w-full px-4 py-3 text-white font-semibold rounded-lg transition text-base"
                        style={{backgroundColor: "#fca311"}}
                      >
                        💾 Save Changes
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-3 mb-3">
                      {[
                        { id: "today", label: "Today's Menu", icon: "📅" },
                        { id: "tomorrow", label: "Tomorrow's Menu", icon: "📆" }
                      ].map(day => (
                        <button
                          key={day.id}
                          onClick={() => setSelectedDay(day.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                            selectedDay === day.id
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <span>{day.icon}</span>
                          {day.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {Object.entries(selectedRestaurant?.meals[selectedDay] || {}).map(([mealType, mealData]) => (
                        <div key={mealType} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                          <div className={`p-4 text-white font-bold ${
                            mealType === "breakfast" ? "bg-amber-500" :
                            mealType === "lunch" ? "bg-indigo-500" :
                            "bg-slate-700"
                          }`}>
                            {mealData.name}
                          </div>

                          <div className="p-4 space-y-3">
                            <div>
                              <h4 className="text-xs font-semibold text-slate-600 mb-2 uppercase">Food Items</h4>
                              <ul className="space-y-2 max-h-32 overflow-y-auto">
                                {mealData.items.map((item, idx) => (
                                  <li key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg text-sm">
                                    <span className="text-slate-700">• {item}</span>
                                    <button
                                      onClick={() => removeFoodFromMeal(selectedRestaurant.id, mealType, idx)}
                                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                                    >
                                      ✕
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="border-t border-slate-200 pt-3">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Add item..."
                                  value={newFood.mealType === mealType ? newFood.food : ""}
                                  onChange={(e) => setNewFood({ mealType, food: e.target.value })}
                                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-slate-50"
                                />
                                <button
                                  onClick={() => addFoodToMeal(selectedRestaurant.id, mealType)}
                                  className="px-3 py-2 text-white text-sm font-semibold rounded-lg transition"
                                  style={{backgroundColor: "#14213d"}}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
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
