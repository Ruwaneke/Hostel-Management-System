import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Reusable Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Unpaid: "bg-rose-100 text-rose-700 border-rose-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
  };
  const defaultStyle = "bg-slate-100 text-slate-700 border-slate-200";
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  );
};

export default function AdminPayments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all invoices AND laundry payments from the backend
  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const [invoicesRes, laundryRes] = await Promise.all([
          axios.get('http://localhost:5025/api/invoices'),
          axios.get('http://localhost:5025/api/laundry/all') // Gets paid laundry orders
        ]);

        // 1. Format Room/Rent Invoices
        const formattedInvoices = invoicesRes.data.map(inv => ({
          _id: inv._id,
          type: 'Rent/Deposit',
          studentName: inv.studentName,
          studentEmail: inv.studentEmail,
          roomNumber: inv.roomNumber,
          description: inv.description,
          subDescription: inv.monthName || "Initial Deposit",
          amount: inv.amount,
          paidAt: inv.paidAt,
          status: inv.status,
          createdAt: inv.createdAt
        }));

        // 2. Format Laundry Payments
        const formattedLaundry = laundryRes.data.map(laundry => ({
          _id: laundry._id,
          type: 'Laundry',
          studentName: laundry.studentName,
          studentEmail: laundry.studentEmail,
          roomNumber: laundry.roomNumber,
          description: `Laundry: ${laundry.serviceType}`,
          subDescription: `${laundry.pieces} pcs • ${laundry.packageType}`,
          amount: laundry.totalAmount, // Use totalAmount from laundry model
          paidAt: laundry.paidAt,
          status: laundry.paymentStatus, // Use paymentStatus from laundry model
          createdAt: laundry.createdAt
        }));

        // 3. Combine and Sort by newest first
        const combinedTransactions = [...formattedInvoices, ...formattedLaundry].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTransactions(combinedTransactions);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllTransactions();
  }, []);

  // Calculate quick stats dynamically from the COMBINED array
  const totalRevenue = transactions
    .filter(txn => txn.status === 'Paid')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const pendingRevenue = transactions
    .filter(txn => txn.status === 'Unpaid')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalTransactions = transactions.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-navy border-t-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      
      {/* Header & Export Action */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-black text-brand-navy tracking-tight">Financial Ledger 💰</h2>
          <p className="text-slate-500 font-medium mt-1">Monitor all hostel payments, key money deposits, and laundry revenue.</p>
        </div>
        <button className="bg-brand-gold hover:bg-[#e5920f] text-brand-black font-black px-6 py-3 rounded-xl transition-all shadow-md">
          Export to CSV
        </button>
      </div>

      {/* Dynamic Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-brand-navy to-blue-900 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2 relative z-10">Total Collected Revenue</p>
          <h3 className="text-4xl font-black relative z-10">Rs. {totalRevenue.toLocaleString()}</h3>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pending / Unpaid</p>
          <h3 className="text-3xl font-black text-rose-600">Rs. {pendingRevenue.toLocaleString()}</h3>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Transactions</p>
          <h3 className="text-3xl font-black text-slate-700">{totalTransactions}</h3>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-black text-lg text-slate-800">All Transactions</h3>
          <input 
            type="text" 
            placeholder="Search by student or room..." 
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-navy"
          />
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Date Paid</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500 font-medium">No financial records found.</td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-slate-50 transition-colors border-t border-slate-100">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{txn.studentName}</div>
                      <div className="text-xs text-slate-400">{txn.studentEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-black text-brand-navy">{txn.roomNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${txn.type === 'Laundry' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                          {txn.type}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-700 text-sm">{txn.description}</div>
                      <div className="text-xs text-slate-400">{txn.subDescription}</div>
                    </td>
                    <td className="px-6 py-4 font-black text-brand-navy">Rs. {txn.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                      {txn.paidAt ? new Date(txn.paidAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={txn.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}