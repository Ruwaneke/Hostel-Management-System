import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

const STATUS_FLOW = ['Pending Drop-off', 'Washing', 'Ready for Pickup', 'Delivered'];

export default function AdminLaundry() {
  const [activeTab, setActiveTab] = useState('orders'); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [adminNoteInput, setAdminNoteInput] = useState("");

  const [settings, setSettings] = useState({
    washOnlyPrice: 0, washAndDryPrice: 0, ironOnlyPrice: 0, washAndIronPrice: 0, dryCleanPrice: 0,
    oneDayExtra: 0, twoDayExtra: 0, weeklyExtra: 0,
    deliveryCharge: 0
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, settingsRes] = await Promise.all([
        axios.get('http://localhost:5025/api/laundry/all'),
        axios.get('http://localhost:5025/api/laundry/settings')
      ]);
      setOrders(ordersRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (error) {
      console.error("Error fetching laundry data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: Number(e.target.value) });
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await axios.put('http://localhost:5025/api/laundry/settings', settings);
      alert("Pricing updated successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to update pricing.");
    } finally {
      setSavingSettings(false);
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setAdminNoteInput(order.adminNote || ""); 
  };

  const handleUpdateOrder = async (newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5025/api/laundry/${selectedOrder._id}/status`, {
        status: newStatus,
        adminNote: adminNoteInput
      });
      setOrders(orders.map(o => o._id === selectedOrder._id ? res.data.order : o));
      setSelectedOrder(null); 
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-navy border-t-brand-gold"></div>
      </div>
    );
  }

  const currentStatusIndex = selectedOrder ? STATUS_FLOW.indexOf(selectedOrder.status) : -1;
  const nextStatus = currentStatusIndex !== -1 && currentStatusIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentStatusIndex + 1] : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 relative">
      
      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-brand-navy tracking-tight">Laundry Management 👕</h2>
          <p className="text-slate-500 font-medium mt-1">Manage student laundry orders and dynamic service pricing.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Active Orders
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Pricing & Settings
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* TAB 1: ACTIVE ORDERS */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Student & Contact</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Room & Service</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-12 text-slate-500 font-medium">No paid laundry orders right now.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors border-t border-slate-100">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {order.image ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                              <img src={`/laundryImage/${order.image}`} alt="Laundry" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-sm shrink-0">👕</div>
                          )}
                          <div>
                            <div className="font-bold text-slate-800">{order.studentName}</div>
                            <div className="text-xs text-slate-500">{order.studentPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-brand-navy">Room {order.roomNumber}</div>
                        <div className="text-xs font-bold text-slate-500">{order.serviceType} • {order.packageType}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{order.pieces} pcs @ Rs.{order.pricePerPiece}/pc</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-emerald-600">Rs. {order.totalAmount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                        {order.adminNote && <div className="text-[10px] text-rose-500 font-bold mt-2 bg-rose-50 p-1.5 rounded inline-block max-w-[150px] truncate" title={order.adminNote}>Note: {order.adminNote}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => openOrderModal(order)} className="bg-brand-navy text-white hover:bg-slate-800 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm">
                          View & Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* TAB 2: PRICING SETTINGS */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">⚙️</div>
            <h3 className="text-2xl font-black text-slate-800">Dynamic Pricing Engine</h3>
            <p className="text-slate-500 text-sm mt-2">Set base prices and speed premiums. Changes apply instantly to new orders.</p>
          </div>

          <form onSubmit={saveSettings} className="space-y-10">
            
            {/* 1. Base Service Prices */}
            <div>
              <h4 className="font-black text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-3 mb-4">1. Base Service Prices (Rs. / piece)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'washOnlyPrice', label: 'Wash Only' },
                  { key: 'washAndDryPrice', label: 'Wash and Dry' },
                  { key: 'ironOnlyPrice', label: 'Iron Only' },
                  { key: 'washAndIronPrice', label: 'Wash and Iron' },
                  { key: 'dryCleanPrice', label: 'Dry Clean' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-800">{item.label}</span>
                    <input type="number" name={item.key} value={settings[item.key] || 0} onChange={handleSettingsChange} required
                      className="w-24 text-right px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-navy font-bold" />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Speed Premium */}
            <div>
              <h4 className="font-black text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-3 mb-4">2. Turnaround Speed Premium (Rs. / piece)</h4>
              <p className="text-xs text-slate-500 mb-4">This amount is ADDED to the base price per piece for fast delivery.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <span className="font-bold text-amber-900">One Day Service</span>
                  <input type="number" name="oneDayExtra" value={settings.oneDayExtra || 0} onChange={handleSettingsChange} required
                    className="w-24 text-right px-3 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 font-bold bg-white" />
                </div>
                <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <span className="font-bold text-amber-900">Two Day Service</span>
                  <input type="number" name="twoDayExtra" value={settings.twoDayExtra || 0} onChange={handleSettingsChange} required
                    className="w-24 text-right px-3 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 font-bold bg-white" />
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-700">Weekly Service</span>
                  <input type="number" name="weeklyExtra" value={settings.weeklyExtra || 0} onChange={handleSettingsChange} required
                    className="w-24 text-right px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-navy font-bold" />
                </div>
              </div>
            </div>

            {/* 3. Delivery Charge */}
            <div>
              <h4 className="font-black text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-3 mb-4">3. Flat Fees (Rs.)</h4>
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <div>
                  <span className="font-bold text-blue-900 block">Flat Delivery & Pickup Charge</span>
                  <span className="text-xs text-blue-700">Applied once per total order, not per piece.</span>
                </div>
                <input type="number" name="deliveryCharge" value={settings.deliveryCharge || 0} onChange={handleSettingsChange} required
                  className="w-28 text-right px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:border-blue-500 font-black text-lg bg-white" />
              </div>
            </div>

            <button type="submit" disabled={savingSettings} className="w-full bg-brand-navy hover:bg-slate-800 text-white font-black text-xl py-5 rounded-2xl transition-all shadow-lg hover:-translate-y-1 hover:shadow-brand-navy/30">
              {savingSettings ? "Saving Settings..." : "Save Pricing Engine Rules"}
            </button>

          </form>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 3. MODAL UPDATED */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 md:p-8">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full flex flex-col max-h-full animate-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-2xl font-black text-brand-navy">Order Details</h3>
                <p className="text-slate-500 text-xs font-bold mt-1">Order ID: {selectedOrder._id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 font-bold shadow-sm transition-colors border border-slate-200">✕</button>
            </div>

            <div className="overflow-y-auto p-6 md:p-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-6">
                  <div className="bg-slate-100 rounded-2xl h-64 w-full flex items-center justify-center overflow-hidden border border-slate-200 shadow-inner">
                    {selectedOrder.image ? (
                      <img src={`/laundryImage/${selectedOrder.image}`} alt="Laundry Item" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-400"><div className="text-6xl mb-2">👕</div><p className="font-bold text-sm">No Photo Attached</p></div>
                    )}
                  </div>

                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                    <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Student Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-slate-500 font-semibold text-sm">Name</span><span className="font-bold text-slate-800 text-sm">{selectedOrder.studentName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 font-semibold text-sm">Room</span><span className="font-black text-brand-navy text-sm">{selectedOrder.roomNumber}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 font-semibold text-sm">Phone</span><span className="font-bold text-slate-800 text-sm">{selectedOrder.studentPhone}</span></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Current Status</p>
                    <div className="text-xl"><StatusBadge status={selectedOrder.status} /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col justify-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Service & Speed</p>
                      <p className="font-black text-brand-navy text-sm">{selectedOrder.serviceType}</p>
                      <p className="font-bold text-slate-500 text-[10px] uppercase mt-1">{selectedOrder.packageType}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col justify-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Quantity</p>
                      <p className="font-black text-brand-navy text-sm">{selectedOrder.pieces} Pieces</p>
                      <p className="font-bold text-slate-500 text-[10px] uppercase mt-1">@ Rs. {selectedOrder.pricePerPiece} /pc</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Total Paid</span>
                    <span className="font-black text-emerald-600 text-xl">Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>

                  {selectedOrder.specialInstructions && (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1"><span>⚠️</span> Student Instructions</p>
                      <p className="text-sm font-semibold text-amber-900 italic">"{selectedOrder.specialInstructions}"</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Admin Private Note</label>
                    <textarea value={adminNoteInput} onChange={(e) => setAdminNoteInput(e.target.value)} placeholder="e.g. Added extra stain remover..."
                      className="w-full border border-slate-200 p-3 rounded-xl font-medium focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy resize-none h-20 bg-slate-50" />
                  </div>

                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
              <button onClick={() => handleUpdateOrder(selectedOrder.status)} className="px-6 py-4 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                Save Note Only
              </button>
              {nextStatus ? (
                <button onClick={() => handleUpdateOrder(nextStatus)} className="flex-1 bg-brand-navy text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex justify-center items-center gap-2">
                  Mark as: {nextStatus} <span className="text-lg">→</span>
                </button>
              ) : (
                <button disabled className="flex-1 bg-emerald-500 text-white font-black py-4 rounded-xl shadow-inner cursor-not-allowed opacity-90">
                  ✓ Order Completely Delivered
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}