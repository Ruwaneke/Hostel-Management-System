import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; // The QR Code generator

export default function PaymentSuccess() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id'); // Gets the Stripe session ID from the URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('Verifying your secure payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Send the booking ID and Stripe Session ID to your backend to officially mark it as PAID
        await axios.post('http://localhost:5025/api/bookings/verify-payment', {
          bookingId,
          stripeSessionId: sessionId
        });
        
        setVerificationStatus('Success');
      } catch (error) {
        console.error("Verification failed", error);
        setVerificationStatus('Failed');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      verifyPayment();
    } else {
      setVerificationStatus('Failed');
      setLoading(false);
    }
  }, [bookingId, sessionId]);

  // Function to handle PDF/Print Download
  const handleDownloadReceipt = () => {
    window.print(); // Triggers the browser's native print-to-pdf feature
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e5e5e5] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-navy border-t-brand-gold mb-6"></div>
        <h2 className="text-xl font-bold text-slate-600">{verificationStatus}</h2>
      </div>
    );
  }

  if (verificationStatus === 'Failed') {
    return (
      <div className="min-h-screen bg-[#e5e5e5] flex flex-col justify-center items-center text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-black text-rose-600 mb-2">Payment Verification Failed</h2>
        <p className="text-slate-500 mb-6">We could not verify your payment with Stripe. Please contact administration.</p>
        <button onClick={() => navigate('/user-dashboard')} className="bg-brand-navy text-white px-6 py-3 rounded-xl font-bold">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5e5e5] py-12 px-6 flex justify-center items-center">
      
      {/* RECEIPT CARD (This is what gets printed!) */}
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-xl overflow-hidden border border-slate-200 printable-receipt">
        
        {/* Green Success Header */}
        <div className="bg-emerald-500 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg border-4 border-emerald-400">
            ✓
          </div>
          <h1 className="text-3xl font-black mb-1">Payment Successful!</h1>
          <p className="font-medium opacity-90">Your room is now officially secured.</p>
        </div>

        {/* Receipt Body */}
        <div className="p-8 sm:p-12">
          
          <div className="flex justify-between items-start mb-10 pb-10 border-b-2 border-dashed border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Booking Reference</p>
              <p className="text-lg font-black text-brand-navy">{bookingId.substring(0, 8).toUpperCase()}</p>
              <p className="text-sm font-semibold text-slate-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
            </div>
            
            {/* QR CODE GENERATOR */}
            <div className="p-2 bg-white border-2 border-slate-100 rounded-xl shadow-sm">
              <QRCodeSVG 
                value={`hostelms://verify-booking/${bookingId}`} 
                size={80} 
                bgColor={"#ffffff"}
                fgColor={"#14213d"} // brand-navy
                level={"M"}
              />
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Transaction Details</h3>
            
            <div className="flex justify-between items-center text-slate-600 font-medium pb-4 border-b border-slate-100">
              <span>First Month Rent</span>
              <span className="text-slate-800">Paid ✓</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 font-medium pb-4 border-b border-slate-100">
              <span>Refundable Key Money</span>
              <span className="text-slate-800">Paid ✓</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 font-medium pb-4 border-b border-slate-100">
              <span>Payment Gateway</span>
              <span className="text-slate-800 flex items-center gap-2">Stripe <span className="w-2 h-2 rounded-full bg-emerald-500"></span></span>
            </div>
          </div>

          {/* Action Buttons (These will be hidden when printing using CSS) */}
          <div className="flex flex-col sm:flex-row gap-4 no-print">
            <button 
              onClick={handleDownloadReceipt}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2"
            >
              <span>📥</span> Download Receipt
            </button>
            <button 
              onClick={() => navigate('/user-dashboard')}
              className="flex-1 bg-brand-navy hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2"
            >
              Go to My Dashboard <span>→</span>
            </button>
          </div>

        </div>
      </div>
      
      {/* CSS to hide buttons when the user prints the PDF */}
      <style>{`
        @media print {
          body { background-color: white; }
          .no-print { display: none !important; }
          .printable-receipt { box-shadow: none; border: none; }
        }
      `}</style>
    </div>
  );
}