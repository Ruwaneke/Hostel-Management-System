import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code'; // The package we just installed

export default function PaymentReceipt() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('booking_id');

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) {
      navigate('/user-dashboard');
      return;
    }

    const fetchInvoice = async () => {
      try {
        const response = await fetch(`http://localhost:5025/api/payments/invoice/${bookingId}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setInvoice(data.data);
        } else {
          setError(data.message || 'Failed to load invoice details.');
        }
      } catch (err) {
        setError('Server error while loading receipt.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [bookingId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-[#14213D] animate-pulse">Generating Receipt...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#E5E5E5] py-12 px-6 font-sans flex flex-col items-center">
      
      {/* Hide these buttons when printing using Tailwind's 'print:hidden' class */}
      <div className="w-full max-w-2xl flex justify-between mb-6 print:hidden">
        <button onClick={() => navigate('/user-dashboard')} className="px-6 py-2 bg-white text-[#14213D] font-bold rounded-xl shadow-sm hover:shadow-md transition">
          ← Back to Dashboard
        </button>
        <button onClick={handlePrint} className="px-6 py-2 bg-[#14213D] text-[#FCA311] font-black rounded-xl shadow-lg hover:bg-[#FCA311] hover:text-[#14213D] transition">
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* The Printable Receipt Area */}
      <div className="bg-white p-10 md:p-14 rounded-2xl shadow-2xl w-full max-w-2xl border-t-[12px] border-[#14213D] print:shadow-none print:border-t-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#14213D] tracking-tighter flex items-center gap-2">
              <span className="text-[#FCA311]">🏠</span> HostelMS
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Smart Campus Living</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-gray-300 uppercase tracking-widest">Receipt</h2>
            <p className="font-bold text-[#14213D] mt-1">{invoice.invoiceId}</p>
            <p className="text-sm font-bold text-gray-500">{invoice.date}</p>
          </div>
        </div>

        {/* Student & Room Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
            <p className="font-black text-[#14213D] text-lg">{invoice.studentName}</p>
            <p className="font-bold text-gray-600 text-sm">{invoice.studentEmail}</p>
            <p className="font-bold text-gray-600 text-sm">NIC: {invoice.nicNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Room Details</p>
            <p className="font-black text-[#14213D] text-lg">Room {invoice.roomNumber}</p>
            <p className="font-bold text-gray-600 text-sm uppercase">Block {invoice.block}</p>
          </div>
        </div>

        {/* Payment Details Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#14213D] text-[#FCA311]">
              <tr>
                <th className="p-4 font-black uppercase text-xs tracking-widest">Description</th>
                <th className="p-4 font-black uppercase text-xs tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="p-4 font-bold text-gray-700">Initial Key Money & Deposit</td>
                <td className="p-4 font-black text-[#14213D] text-right">Rs. {invoice.amountPaid}.00</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-gray-500 text-xs">Payment Method: {invoice.paymentMethod}</td>
                <td className="p-4 font-black text-emerald-600 text-right uppercase text-sm">
                  ✓ {invoice.status}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer & QR Code */}
        <div className="flex justify-between items-end pt-8 border-t-2 border-gray-100">
          <div>
            <p className="text-sm font-bold text-[#14213D]">Thank you for your payment!</p>
            <p className="text-xs font-bold text-gray-400 mt-1">If you have any questions, please contact administration.</p>
          </div>
          <div className="p-2 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
            {/* Generates a scannable QR code of the Invoice ID */}
            <QRCode value={`VERIFY-INV:${invoice.invoiceId}|STU:${invoice.nicNumber}`} size={80} level="H" />
          </div>
        </div>

      </div>
    </div>
  );
}