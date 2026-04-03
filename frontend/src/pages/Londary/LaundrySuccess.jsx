import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function LaundrySuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('laundry_success');
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState('Verifying Payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId || !sessionId) {
        setStatus('Invalid Payment Link');
        return;
      }
      try {
        await axios.post('http://localhost:5025/api/laundry/verify-payment', {
          orderId,
          stripeSessionId: sessionId
        });
        setStatus('Payment Successful! Order Confirmed.');
      } catch (error) {
        console.error(error);
        setStatus('Verification Failed.');
      }
    };
    verifyPayment();
  }, [orderId, sessionId]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-200">
        <div className={`text-6xl mb-6 ${status.includes('Successful') ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`}>
          {status.includes('Successful') ? '✅' : '⏳'}
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">{status}</h2>
        <p className="text-slate-500 mb-8">
          {status.includes('Successful') 
            ? "Your laundry order has been received. You can now drop off your clothes!" 
            : "Please wait while we confirm your transaction with Stripe."}
        </p>
        
        {status.includes('Successful') && (
          <button 
            onClick={() => navigate('/user-dashboard')}
            className="w-full bg-brand-navy hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
          >
            Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}