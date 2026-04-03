import React, { useState } from 'react';
import { QrScanner } from '@ericblade/react-qr-scanner';
import axios from 'axios';

export default function AdminQRScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (data) => {
    if (data && !studentData) {
      // The QR code contains: hostelms://verify-booking/BOOKING_ID
      const bookingId = data.text.split('/').pop();
      setScanResult(bookingId);
      
      try {
        const res = await axios.get(`http://localhost:5025/api/bookings/status-by-id/${bookingId}`);
        setStudentData(res.data.booking);
      } catch (err) {
        setError("Invalid QR Code or Booking Not Found");
      }
    }
  };

  return (
    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black text-brand-navy mb-6 text-center">Student Entry Verification 🛡️</h2>
      
      {!studentData ? (
        <div className="overflow-hidden rounded-2xl border-4 border-brand-navy">
          <QrScanner
            onDecode={handleScan}
            onError={(err) => console.error(err)}
            style={{ width: '100%' }}
          />
          <p className="p-4 bg-brand-navy text-white text-center font-bold animate-pulse">Scanning for Receipt QR...</p>
        </div>
      ) : (
        <div className="animate-in zoom-in duration-300">
          <div className={`p-6 rounded-2xl text-center border-2 ${studentData.paymentStatus === 'Paid' ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
            <div className="text-6xl mb-4">{studentData.paymentStatus === 'Paid' ? '✅' : '❌'}</div>
            <h3 className="text-3xl font-black text-slate-800">{studentData.studentName}</h3>
            <p className="text-xl font-bold text-brand-navy mt-2">Room {studentData.roomNumber}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-left">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Rent Status</p>
                <p className={`font-black ${studentData.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>{studentData.paymentStatus}</p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase">NIC Verified</p>
                <p className="font-black text-slate-800">{studentData.nicNumber}</p>
              </div>
            </div>

            <button 
              onClick={() => {setStudentData(null); setScanResult(null);}} 
              className="mt-8 w-full bg-brand-navy text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              Scan Next Student
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-4 text-rose-500 text-center font-bold">{error}</p>}
    </div>
  );
}