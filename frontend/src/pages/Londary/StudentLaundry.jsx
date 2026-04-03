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

export default function StudentLaundry() {
  const { user } = useAuth();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-navy border-t-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      <div>
        <h2 className="text-3xl font-black text-brand-navy tracking-tight">Laundry Services 👕</h2>
        <p className="text-slate-500 font-medium mt-1">Book a wash, select your service type, and track your clothes.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE SEPARATED FORM COMPONENT */}
        <div className="xl:col-span-6">
          <LaundryBookingForm user={user} roomNumber={roomNumber} settings={settings} />
        </div>

        {/* RIGHT COLUMN: ORDER HISTORY & STATUS */}
        <div className="xl:col-span-6 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-black text-lg text-slate-800">My Laundry Orders</h3>
              <span className="px-3 py-1 bg-brand-navy/10 text-brand-navy rounded-full text-xs font-black uppercase tracking-wider">
                {orders.length > 0 ? "Active" : "Pending"}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 opacity-50">🧺</div>
                  <h4 className="text-xl font-bold text-slate-700">No Orders Yet</h4>
                  <p className="text-slate-500 mt-2">Your laundry history and live status tracking will appear here.</p>
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

                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                          <StatusBadge status={order.status} />
                          <p className="text-[10px] text-slate-400">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Show special instructions or admin notes if they exist */}
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
        </div>

      </div>
    </div>
  );
}