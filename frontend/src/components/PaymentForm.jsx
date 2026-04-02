import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PaymentModal from './PaymentModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const PaymentForm = ({ bookingData, addPaymentToHistory, onBack, onPaymentComplete }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const booking = bookingData || location.state?.booking;

  const [paymentMethod, setPaymentMethod] = useState('VISA');
  const [cardDetails, setCardDetails] = useState({
    cardholderName: booking?.fullName || '',   // ✅ no CURRENT_USER
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [saveDetails, setSaveDetails] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  // ✅ bookingSummaryData uses grandTotal
  const totalAmount = booking?.grandTotal ?? booking?.totalAmount ?? 0;

  const validateCardNumber = (number) => /^\d{16}$/.test(number.replace(/\s/g, ''));
  const validateCVV = (cvv) => /^\d{3}$/.test(cvv);

  const handleCardInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '');
    }
    setCardDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const buildPayment = (method) => ({
    amount: totalAmount,
    method,
    status: 'Success',
    bookingData: booking
  });

  const notifySuccess = () => addNotification?.('Payment confirmed successfully!', 'success');

  const handleCashPayment = () => {
    const payment = buildPayment('Cash on Delivery');
    addPaymentToHistory?.(payment);
    notifySuccess();
    setLastPayment(payment);
    setShowModal(true);
  };

  const handleCardPayment = () => {
    const newErrors = {};
    if (!cardDetails.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    if (!validateCardNumber(cardDetails.cardNumber)) newErrors.cardNumber = 'Card number must be 16 digits';
    if (!cardDetails.expiryMonth) newErrors.expiryMonth = 'Month is required';
    if (!cardDetails.expiryYear) newErrors.expiryYear = 'Year is required';
    if (!validateCVV(cardDetails.cvv)) newErrors.cvv = 'CVV must be 3 digits';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payment = {
        ...buildPayment(paymentMethod),
        cardDetails: { ...cardDetails },
        saveDetails,
      };
      addPaymentToHistory?.(payment);
      notifySuccess();
      setLastPayment(payment);
      setShowModal(true);
    }
  };

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold">No booking found</h2>
          <p className="text-sm text-gray-500 mt-2">Please complete a laundry booking first.</p>
          <button
            onClick={() => navigate('/laundry')}
            className="mt-6 px-5 py-3 bg-[#14213D] text-white rounded-lg"
          >
            Go to Laundry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">

        {/* ── Payment Form ── */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-5">Payment Details</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Select payment method</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {['VISA', 'Mastercard', 'PayPal', 'Cash on Delivery'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-2xl px-4 py-3 border text-left transition ${
                      paymentMethod === method
                        ? 'border-[#14213D] bg-[#14213D] text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod !== 'Cash on Delivery' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                  <input
                    name="cardholderName"
                    value={cardDetails.cardholderName}
                    onChange={handleCardInputChange}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                  />
                  {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    maxLength="19"
                    placeholder="0000 0000 0000 0000"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                  />
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Month</label>
                    <select
                      name="expiryMonth"
                      value={cardDetails.expiryMonth}
                      onChange={handleCardInputChange}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {errors.expiryMonth && <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Year</label>
                    <select
                      name="expiryYear"
                      value={cardDetails.expiryYear}
                      onChange={handleCardInputChange}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={String(new Date().getFullYear() + i)}>
                          {String(new Date().getFullYear() + i)}
                        </option>
                      ))}
                    </select>
                    {errors.expiryYear && <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    maxLength="3"
                    placeholder="123"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14213D]"
                  />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            )}

            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                type="button"
                onClick={handleCardPayment}
                className="flex-1 rounded-xl bg-[#14213D] px-4 py-3 text-white font-semibold hover:bg-[#1e3160] transition-colors"
              >
                Confirm Card Payment
              </button>
              <button
                type="button"
                onClick={handleCashPayment}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold hover:bg-gray-50 transition-colors"
              >
                Pay with Cash
              </button>
            </div>
          </div>
        </div>

        {/* ── Order Summary (inline, no separate component) ── */}
        <div className="bg-[#f8fafc] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="font-medium text-gray-800">{booking?.fullName ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Service</span>
              <span className="font-medium text-gray-800">{booking?.selectedServiceName ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pieces</span>
              <span className="font-medium text-gray-800">{booking?.pieces ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-800">
                {booking?.date
                  ? (booking.date instanceof Date
                      ? booking.date.toLocaleDateString()
                      : new Date(booking.date).toLocaleDateString())
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span className="font-medium text-gray-800">{booking?.timeSlot ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span className="font-medium text-gray-800">{booking?.location ?? '—'}</span>
            </div>

            {/* Add-ons */}
            {(booking?.selectedAddonNames ?? []).length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-500 mb-1">Add-ons</p>
                {booking.selectedAddonNames.map((addon, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-600 pl-2">• {addon.name}</span>
                    <span className="text-gray-800">LKR {addon.price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Booking fee */}
            {(booking?.bookingFee ?? 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Fee</span>
                <span className="font-medium text-gray-800">LKR {booking.bookingFee.toFixed(2)}</span>
              </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-300 pt-3 mt-2 flex justify-between items-center">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-extrabold text-xl text-amber-500">
                LKR {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showModal && lastPayment && (
        <PaymentModal
          payment={lastPayment}
          onClose={() => setShowModal(false)}
          onPaymentComplete={onPaymentComplete}
        />
      )}
    </div>
  );
};

export default PaymentForm;