import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LaundryBookingForm from './LaundryBookingForm';

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending Drop-off': "bg-amber-100 text-amber-700 border-amber-200",
    'Washing': "bg-blue-100 text-blue-700 border-blue-200",
    'Ready for Pickup': "bg-purple-100 text-purple-700 border-purple-200",
    'Delivered': "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
};

const TABS = ['New Request', 'My Orders'];

export default function StudentLaundry() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('New Request');
  const [settings, setSettings] = useState(null);
  const [orders, setOrders] = useState([]);
  const [roomNumber, setRoomNumber] = useState("Fetching...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, ordersRes, bookingRes] = await Promise.all([
          axios.get('http://localhost:5025/api/laundry/settings'),
          axios.get(`http://localhost:5025/api/laundry/student/${user._id}`),
          axios.get(`http://localhost:5025/api/bookings/status/${user._id}`)
        ]);

        setSettings(settingsRes.data);
        setOrders(ordersRes.data);

        if (bookingRes.data.hasBooking) {
          setRoomNumber(bookingRes.data.booking.roomNumber);
        } else {
          setRoomNumber("Not Assigned");
        }
      } catch (error) {
        console.error("Error fetching laundry data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user._id) fetchData();
  }, [user]);

  // DELETE handler — only works for Delivered orders
  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`http://localhost:5025/api/laundry/${orderId}`);
      setOrders(orders.filter(o => o._id !== orderId));
    } catch (error) {
      alert("Failed to delete order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-navy border-t-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            <span className="text-brand-navy">My </span>
            <span className="text-brand-gold">Laundry</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">Book a wash, select your service type, and track your clothes.</p>
        </div>

        {activeTab !== 'New Request' && (
          <button
            onClick={() => setActiveTab('New Request')}
            className="flex items-center gap-2 bg-brand-gold hover:bg-[#e5920f] text-brand-navy font-black px-5 py-3 rounded-full shadow-md transition-all hover:-translate-y-0.5"
          >
            <span className="text-lg">+</span> New Request
          </button>
        )}
      </div>

      {/* TAB BUTTONS */}
      <div className="flex gap-3 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border-2 ${
              activeTab === tab
                ? 'bg-brand-navy text-brand-gold border-brand-navy shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-navy/40'
            }`}
          >
            {tab}
            {tab === 'My Orders' && orders.length > 0 && (
              <span className={`ml-2 text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-brand-gold text-brand-navy' : 'bg-slate-100 text-slate-500'
              }`}>
                {orders.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'New Request' && (
        <LaundryBookingForm user={user} roomNumber={roomNumber} settings={settings} />
      )}

      {activeTab === 'My Orders' && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-black text-lg text-slate-800">My Laundry Orders</h3>
            <span className="px-3 py-1 bg-brand-navy/10 text-brand-navy rounded-full text-xs font-black uppercase tracking-wider">
              {orders.length > 0 ? `${orders.length} Orders` : "None Yet"}
            </span>
          </div>

          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-50">🧺</div>
                <h4 className="text-xl font-bold text-slate-700">No Orders Yet</h4>
                <p className="text-slate-500 mt-2">Your laundry history and live status tracking will appear here.</p>
                <button
                  onClick={() => setActiveTab('New Request')}
                  className="mt-6 bg-brand-gold hover:bg-[#e5920f] text-brand-navy font-black px-6 py-3 rounded-full shadow-md transition-all"
                >
                  + Make a Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border-2 border-slate-100 rounded-2xl p-5 hover:border-brand-navy/30 transition-colors shadow-sm flex flex-col gap-4">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        {order.image ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                            <img src={`/laundryImage/${order.image}`} alt="Laundry" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">👕</div>
                        )}
                        <div>
                          <h4 className="font-black text-slate-800">{order.serviceType}</h4>
                          <p className="text-xs font-bold text-brand-navy mt-0.5">{order.packageType}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{order.pieces} Pieces • Rs. {order.totalAmount}</p>
                        </div>
                      </div>

                      {/* Status, date, and delete button */}
                      <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                        <StatusBadge status={order.status} />
                        <p className="text-[10px] text-slate-400">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>

                        {/* Delete button — only shows for Delivered orders */}
                        {order.status === 'Delivered' && (
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-full transition-all"
                          >
                             Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {(order.specialInstructions || order.adminNote) && (
                      <div className="mt-2 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {order.specialInstructions && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Instructions</p>
                            <p className="text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-lg italic">"{order.specialInstructions}"</p>
                          </div>
                        )}
                        {order.adminNote && (
                          <div>
                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">Admin Note</p>
                            <p className="text-xs font-bold text-rose-700 bg-rose-50 p-2 rounded-lg">"{order.adminNote}"</p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}