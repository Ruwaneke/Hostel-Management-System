import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { FiCheckCircle, FiDownload, FiFileText } from 'react-icons/fi';
import { useBookings } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';

const PaymentModal = ({ payment, onClose, onPaymentComplete }) => {
  const navigate = useNavigate();
  const { addBooking, savePayment } = useBookings();

  // ✅ Updated handleClose — saves payment to backend before closing
  const handleClose = async () => {
    try {
      await fetch('http://localhost:5025/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount:      payment.amount,
          method:      payment.method,
          status:      payment.status,
          bookingData: payment.bookingData,
          cardDetails: payment.cardDetails ?? null,
          saveDetails: payment.saveDetails ?? false,
        }),
      });
    } catch (err) {
      console.error('Failed to save payment:', err);
    }

    addBooking({
      serviceType: payment.bookingData?.selectedServiceName,
      date: payment.bookingData?.date
        ? new Date(payment.bookingData.date).toISOString().split('T')[0]
        : null,
      timeSlot:    payment.bookingData?.timeSlot,
      location:    payment.bookingData?.location,
      addons:      (payment.bookingData?.selectedAddonNames ?? []).map(a => a.name),
      totalAmount: payment.amount,
      telephone:   payment.bookingData?.telephone,
    });
    savePayment(payment);
    onClose();
    if (onPaymentComplete) {
      onPaymentComplete();
    } else {
      setTimeout(() => navigate('/dashboard'), 100);
    }
  };

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  const receiptNo = `RCP-${Date.now().toString().slice(-8)}`;
  const bd = payment?.bookingData ?? {};

  const rows = [
    { label: 'Receipt No.',    value: receiptNo },
    { label: 'Date',           value: today },
    { label: 'Payment Method', value: payment?.method ?? '—' },
    { label: '', value: '', divider: true },
    { label: 'Customer',       value: bd.fullName ?? '—' },
    { label: 'Phone',          value: bd.telephone ?? '—' },
    { label: 'Location',       value: bd.location ?? '—' },
    { label: '', value: '', divider: true },
    { label: 'Service',        value: bd.selectedServiceName ?? '—' },
    { label: 'Pieces',         value: bd.pieces ? `${bd.pieces} piece${bd.pieces > 1 ? 's' : ''}` : '—' },
    { label: 'Date & Time',    value: bd.date && bd.timeSlot ? `${new Date(bd.date).toLocaleDateString('en-GB')} · ${bd.timeSlot}` : '—' },
    ...(bd.addonsTotal > 0
      ? [{ label: 'Add-ons', value: `LKR ${bd.addonsTotal.toFixed(2)}` }]
      : []),
    { label: 'Booking Fee',    value: `LKR ${(bd.bookingFee ?? 0).toFixed(2)}` },
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    const navy = [20, 33, 61];
    const amber = [252, 163, 17];

    doc.setFillColor(...navy);
    doc.rect(0, 0, 210, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Receipt', 20, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Laundry Management System', 20, 28);
    doc.text(`Receipt: ${receiptNo}`, 140, 28);

    doc.setFillColor(...amber);
    doc.roundedRect(150, 8, 45, 12, 3, 3, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const sections = [
      {
        title: 'Payment Details',
        items: [
          ['Date', today],
          ['Payment Method', payment?.method ?? '—'],
          ['Status', payment?.status ?? '—'],
        ],
      },
      {
        title: 'Customer Details',
        items: [
          ['Name', bd.fullName ?? '—'],
          ['Phone', bd.telephone ?? '—'],
          ['Location', bd.location ?? '—'],
        ],
      },
      {
        title: 'Booking Details',
        items: [
          ['Service', bd.selectedServiceName ?? '—'],
          ['Pieces', bd.pieces ? `${bd.pieces} piece(s) × LKR 50.00 = LKR ${(bd.piecesTotal ?? 0).toFixed(2)}` : '—'],
          ['Schedule', bd.date && bd.timeSlot ? `${new Date(bd.date).toLocaleDateString('en-GB')} · ${bd.timeSlot}` : '—'],
          ...(bd.addonsTotal > 0 ? [['Add-ons', `LKR ${bd.addonsTotal.toFixed(2)}`]] : []),
          ['Booking Fee', `LKR ${(bd.bookingFee ?? 0).toFixed(2)}`],
        ],
      },
    ];

    let y = 50;
    sections.forEach(({ title, items }) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...navy);
      doc.text(title, 20, y);
      y += 6;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, 190, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      items.forEach(([k, v]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        doc.text(`${k}:`, 20, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text(String(v), 75, y);
        y += 8;
      });
      y += 4;
    });

    doc.setFillColor(245, 247, 255);
    doc.roundedRect(20, y, 170, 20, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...navy);
    doc.text('TOTAL AMOUNT', 28, y + 13);
    doc.setTextColor(...amber);
    doc.text(`LKR ${(payment?.amount ?? 0).toFixed(2)}`, 140, y + 13);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for using our service. Keep this receipt for your records.', 20, y + 32);

    doc.save(`receipt-${receiptNo}.pdf`);
  };

  const downloadText = () => {
    const lines = [
      '========================================',
      '       LAUNDRY MANAGEMENT SYSTEM        ',
      '            PAYMENT RECEIPT             ',
      '========================================',
      `Receipt No. : ${receiptNo}`,
      `Date        : ${today}`,
      `Method      : ${payment?.method ?? '—'}`,
      `Status      : ${payment?.status ?? '—'}`,
      '----------------------------------------',
      'CUSTOMER',
      `Name        : ${bd.fullName ?? '—'}`,
      `Phone       : ${bd.telephone ?? '—'}`,
      `Location    : ${bd.location ?? '—'}`,
      '----------------------------------------',
      'BOOKING',
      `Service     : ${bd.selectedServiceName ?? '—'}`,
      `Pieces      : ${bd.pieces ?? '—'} × LKR 50.00 = LKR ${(bd.piecesTotal ?? 0).toFixed(2)}`,
      `Schedule    : ${bd.date ? new Date(bd.date).toLocaleDateString('en-GB') : '—'} · ${bd.timeSlot ?? '—'}`,
      ...(bd.addonsTotal > 0 ? [`Add-ons     : LKR ${bd.addonsTotal.toFixed(2)}`] : []),
      `Booking Fee : LKR ${(bd.bookingFee ?? 0).toFixed(2)}`,
      '========================================',
      `TOTAL       : LKR ${(payment?.amount ?? 0).toFixed(2)}`,
      '========================================',
      '',
      'Thank you for using our service!',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* ── Header ── */}
          <div style={{ backgroundColor: '#14213d' }} className="px-6 py-5 relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-green-400 flex items-center justify-center shadow-lg">
                <FiCheckCircle className="text-white" size={22} />
              </div>
              <div>
                <p className="text-white/70 text-xs uppercase tracking-widest">Payment</p>
                <h3 className="text-white text-xl font-bold">Successful!</h3>
              </div>
              <span className="ml-auto bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {payment?.status ?? 'Completed'}
              </span>
            </div>
          </div>

          {/* ── Receipt No strip ── */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-2 flex justify-between items-center">
            <span className="text-xs text-gray-500 font-mono">{receiptNo}</span>
            <span className="text-xs text-gray-500">{today}</span>
          </div>

          {/* ── Details ── */}
          <div className="px-6 py-4 space-y-0.5 max-h-72 overflow-y-auto">
            {rows.map((row, i) => {
              if (row.divider) return <div key={i} className="border-t border-dashed border-gray-200 my-2" />;
              return (
                <div key={i} className="flex justify-between items-baseline py-1">
                  <span className="text-xs text-gray-500 w-32 shrink-0">{row.label}</span>
                  <span className={`text-sm font-medium text-right ${row.highlight ? 'text-green-600' : 'text-gray-800'}`}>
                    {row.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Total ── */}
          <div className="mx-6 mb-4 rounded-xl bg-gradient-to-r from-[#14213d] to-[#1e3160] px-5 py-4 flex justify-between items-center">
            <span className="text-white/80 text-sm font-medium uppercase tracking-wide">Total Paid</span>
            <span className="text-amber-400 text-2xl font-extrabold">
              LKR {(payment?.amount ?? 0).toFixed(2)}
            </span>
          </div>

          {/* ── Actions ── */}
          <div className="px-6 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={downloadPDF}
                style={{ backgroundColor: '#14213d' }}
                className="flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                <FiDownload size={14} />
                PDF Receipt
              </button>
              <button
                onClick={downloadText}
                style={{ backgroundColor: '#fca311' }}
                className="flex items-center justify-center gap-2 text-black text-sm font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                <FiFileText size={14} />
                Text Receipt
              </button>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;