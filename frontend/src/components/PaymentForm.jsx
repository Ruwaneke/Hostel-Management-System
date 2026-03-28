import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PaymentModal from './PaymentModal';
import { CURRENT_USER } from '../constants/currentUser';

const PaymentForm = ({ bookingData, addPaymentToHistory, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('VISA');
  const [cardDetails, setCardDetails] = useState({
    cardholderName: bookingData?.fullName || CURRENT_USER.name,
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [saveDetails, setSaveDetails] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  // Use real total from booking data (convert LKR to display as-is)
  const totalAmount = bookingData?.grandTotal ?? 0;

  const validateCardNumber = (number) => /^\d{16}$/.test(number.replace(/\s/g, ''));
  const validateCVV = (cvv) => /^\d{3}$/.test(cvv);

const handleCardInputChange = (e) => {
  let { name, value } = e.target;


  if (name === "cardNumber") {
    value = value.replace(/\D/g, ""); // only digits]
    value = value.match(/.{1,4}/g)?.join(" ") || "";
  }

  if (name === "cvv") {
    value = value.replace(/\D/g, ""); // only digits
  }

  setCardDetails(prev => ({ ...prev, [name]: value }));

  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const buildPayment = (method) => ({
    amount: totalAmount,
    method,
    status: 'Completed',
    bookingData,
  });

  const handleCashPayment = () => {
    const payment = buildPayment('Cash on Delivery');
    addPaymentToHistory?.(payment);
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
      setLastPayment(payment);
      setShowModal(true);
    }
  };

  const paymentMethods = [
    { id: 'mastercard', name: 'Mastercard' },
    { id: 'VISA', name: 'VISA' },
    { id: 'paypal', name: 'PayPal' },
    { id: 'cash', name: 'Cash on Delivery' },
  ];

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0'),
  }));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i),
  }));

  /* ── Order summary box shared across all payment methods ── */
  const OrderSummary = () => (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 space-y-2">
      <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Order Summary</p>

      {bookingData && (
        <>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Service</span>
            <span className="font-medium text-gray-800">{bookingData.selectedServiceName}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Pieces ({bookingData.pieces} × LKR 50.00)</span>
            <span>LKR {(bookingData.piecesTotal ?? 0).toFixed(2)}</span>
          </div>
          {(bookingData.addonsTotal ?? 0) > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Add-ons</span>
              <span>LKR {bookingData.addonsTotal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Booking Fee</span>
            <span>LKR {(bookingData.bookingFee ?? 0).toFixed(2)}</span>
          </div>
        </>
      )}

      <hr className="border-gray-300 my-1" />
      <div className="flex justify-between font-bold text-gray-900">
        <span>TOTAL AMOUNT</span>
        <span className="text-amber-500 text-lg">LKR {totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-800 transition-colors text-sm flex items-center gap-1"
            >
              ← Back
            </button>
          )}
          <h2 className="text-2xl font-bold text-black">Payment Details</h2>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => handlePaymentMethodChange(method.id)}
                className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                  paymentMethod === method.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => handlePaymentMethodChange(method.id)}
                  className="absolute top-2 left-2 w-3.5 h-3.5 accent-amber-500"
                />
                <div className="text-center mt-3">
                  {method.id === 'mastercard' && (
                    <div className="flex justify-center mb-1.5">
                      <div className="w-5 h-5 bg-red-500 rounded-full opacity-80" />
                      <div className="w-5 h-5 bg-orange-400 rounded-full opacity-80 -ml-2" />
                    </div>
                  )}
                  {method.id === 'VISA' && (
                    <div className="text-xl font-extrabold text-blue-900 mb-1.5 tracking-tight">VISA</div>
                  )}
                  {method.id === 'paypal' && (
                    <div className="text-xl font-bold text-blue-600 mb-1.5">Pay</div>
                  )}
                  {method.id === 'cash' && (
                    <div className="text-lg mb-1.5">💵</div>
                  )}
                  <div className="text-xs text-gray-500 uppercase font-medium">{method.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Card fields (VISA / Mastercard) ── */}
        {(paymentMethod === 'mastercard' || paymentMethod === 'VISA') && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInputChange}
                  maxLength="19"
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent ${
                    errors.cardNumber ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={cardDetails.cardholderName}
                  onChange={handleCardInputChange}
                  placeholder="Full name on card"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent ${
                    errors.cardholderName ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
              </div>
            </div>

            <div className="flex items-end gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry <span className="text-amber-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    name="expiryMonth"
                    value={cardDetails.expiryMonth}
                    onChange={handleCardInputChange}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 ${
                      errors.expiryMonth ? 'border-red-400' : 'border-gray-300'
                    }`}
                  >
                    <option value="">MM</option>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <select
                    name="expiryYear"
                    value={cardDetails.expiryYear}
                    onChange={handleCardInputChange}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 ${
                      errors.expiryYear ? 'border-red-400' : 'border-gray-300'
                    }`}
                  >
                    <option value="">YYYY</option>
                    {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV <span className="text-amber-500">*</span></label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  maxLength="3"
                  placeholder="123"
                   inputMode="numeric"
                  className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400 ${
                    errors.cvv ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
              
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="saveDetails"
                checked={saveDetails}
                onChange={(e) => setSaveDetails(e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
              <label htmlFor="saveDetails" className="text-sm text-gray-600">
                Save my details for future purchases
              </label>
            </div>

            <OrderSummary />

            <button
              onClick={handleCardPayment}
              style={{ backgroundColor: '#14213d' }}
              className="w-full hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg uppercase tracking-wide transition-opacity"
            >
              Confirm Payment — LKR {totalAmount.toFixed(2)}
            </button>
          </div>
        )}

        {/* ── Cash on Delivery ── */}
        {paymentMethod === 'cash' && (
          <div className="space-y-5">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              💡 Payment will be collected when your laundry is picked up or delivered.
            </div>
            {/* ── Disabled notice ── */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 font-medium">
                Cash on Delivery is currently unavailable. Please select another payment method.
            </div>
            <OrderSummary />
            <button
                type="button"
                disabled
                className="w-full px-4 py-3 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed font-semibold opacity-50"
                title="Cash on Delivery is currently unavailable"
            >
                Confirm — Cash on Delivery
            </button>
            {/*<button
              onClick={handleCashPayment}
              style={{ backgroundColor: '#14213d' }}
              className="w-full hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg uppercase tracking-wide transition-opacity"
            >
              Confirm — Cash on Delivery
            </button>*/}
          </div>
        )}

        {/* ── PayPal ── */}
        {paymentMethod === 'paypal' && (
          <div className="space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              You will be redirected to PayPal to complete the payment securely.
            </div>
            <OrderSummary />
            <button
              onClick={() => alert('PayPal redirect would happen here')}
              className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-4 px-6 rounded-lg uppercase tracking-wide transition-colors"
            >
              Pay with PayPal — LKR {totalAmount.toFixed(2)}
            </button>
          </div>
        )}

        {/* Success Modal */}
        {showModal && lastPayment && (
          <PaymentModal
            payment={lastPayment}
            onClose={() => setShowModal(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default PaymentForm;