import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    const verifyStripePayment = async () => {
      try {
        // 1. Get the token - Without this, the backend will reject the update!
        const token = localStorage.getItem('token');
        
        console.log("Verifying with Backend...");

        const response = await fetch('http://localhost:5025/api/payments/verify-payment', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // MUST BE HERE
          },
          body: JSON.stringify({ session_id: sessionId, booking_id: bookingId })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log("Verification Success!");
          setStatus('success');
        } else {
          console.error("Verification Failed:", data.message);
          setStatus('error');
          setErrorMessage(data.message || 'Payment verification failed.');
        }
      } catch (error) {
        console.error("Network Error:", error);
        setStatus('error');
        setErrorMessage('Server is not responding.');
      }
    };

    if (sessionId && bookingId) {
      verifyStripePayment();
    } else {
      navigate('/user-dashboard');
    }
  }, [sessionId, bookingId, navigate]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Premium Card Container */}
      <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] max-w-lg w-full text-center border-t-4 border-blue-500 animate-in zoom-in-95 duration-500 relative overflow-hidden">
        
        {/* Soft Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-50 blur-3xl pointer-events-none rounded-b-[100%]"></div>

        <div className="relative z-10">
          
          {/* ── LOADING STATE ── */}
          {status === 'verifying' && (
            <div className="py-10">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-8 shadow-sm"></div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Securing Residency...</h2>
              <p className="text-slate-500 mt-2 font-medium">Validating your transaction with Stripe's secure servers.</p>
            </div>
          )}

          {/* ── SUCCESS STATE ── */}
          {status === 'success' && (
            <div className="py-2">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm border border-emerald-100">
                ✓
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Payment Confirmed!</h2>
              
              {/* Transaction Details Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1.5">Initial Bundle Settled</p>
                  <p className="text-blue-900 font-extrabold text-lg">Key Money + 1st Month's Rent</p>
              </div>

              <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">
                Your residency is now <span className="text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">Active</span>. 
                The hostel administration has been notified of your secured unit. You can view your Digital Pass in the dashboard.
              </p>
              
              <div className="space-y-4">
                <Link to="/user-dashboard" className="block w-full bg-blue-600 text-white font-extrabold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shadow-blue-600/20 text-sm">
                  Enter Student Portal
                </Link>
                <Link to={`/payment-receipt?booking_id=${bookingId}`} className="block w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-100 hover:text-blue-600 transition-colors text-sm">
                  Download Official Receipt (PDF)
                </Link>
              </div>
            </div>
          )}

          {/* ── ERROR STATE ── */}
          {status === 'error' && (
            <div className="py-6">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 border border-rose-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">
                !
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Verification Error</h2>
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl mb-8">
                <p className="text-rose-600 font-bold text-sm">{errorMessage}</p>
              </div>
              <Link to="/user-dashboard" className="block w-full bg-slate-800 text-white font-extrabold py-4 rounded-xl hover:bg-slate-900 transition-all shadow-md text-sm">
                Return to Dashboard
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}