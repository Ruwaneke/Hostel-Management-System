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
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center border-t-8 border-[#14213D] animate-in zoom-in duration-500">
        
        {status === 'verifying' && (
          <div className="py-10">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-[#FCA311] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-black text-[#14213D]">Securing Residency...</h2>
            <p className="text-slate-400 mt-2">Validating your transaction with Stripe.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner ring-8 ring-emerald-50">
              ✓
            </div>
            <h2 className="text-3xl font-black text-[#14213D] mb-2 tracking-tight">Payment Confirmed!</h2>
            <p className="text-slate-500 font-medium mb-8">
              Your residency is now <span className="text-emerald-600 font-bold uppercase">Active</span>. 
              The hostel management has been notified of your move-in.
            </p>
            <div className="space-y-3">
              <Link to="/user-dashboard" className="block w-full bg-[#14213D] text-[#FCA311] font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-blue-900/20">
                Enter Student Portal
              </Link>
              <Link to={`/payment-receipt?booking_id=${bookingId}`} className="block w-full bg-slate-50 border border-slate-200 text-[#14213D] font-bold py-4 rounded-2xl hover:bg-slate-100 transition-colors">
                Download Receipt (PDF)
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              !
            </div>
            <h2 className="text-3xl font-black text-[#14213D] mb-2">Verification Error</h2>
            <p className="text-red-500 font-bold mb-8">{errorMessage}</p>
            <Link to="/user-dashboard" className="block w-full bg-[#14213D] text-white font-black py-4 rounded-2xl">
              Go Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}