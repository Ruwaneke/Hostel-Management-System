import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PaymentModal from './PaymentModal';

const PaymentForm = ({ addPaymentToHistory }) => {
  const [paymentMethod, setPaymentMethod] = useState('VISA');
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [saveDetails, setSaveDetails] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  // Validation functions
  const validateCardNumber = (number) => /^\d{16}$/.test(number.replace(/\s/g, ''));
  const validateCVV = (cvv) => /^\d{3}$/.test(cvv);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCashPayment = () => {
    const payment = {
      amount: 66.30,
      method: 'Cash on Delivery',
      status: 'Completed'
    };
    addPaymentToHistory(payment);
    alert('Cash payment confirmed!');
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
        amount: 66.30,
        method: paymentMethod,
        status: 'Completed',
        cardDetails: { ...cardDetails },
        saveDetails
      };
      addPaymentToHistory(payment);
      setLastPayment(payment);
      setShowModal(true);
    }
  };

  const paymentMethods = [
    { id: 'mastercard', name: 'Mastercard', logo: '💳' },
    { id: 'VISA', name: 'VISA', logo: '💳' },
    { id: 'paypal', name: 'PayPal', logo: '🅿️' },
    { id: 'cash', name: 'Cash on Delivery', logo: '💵' }
  ];

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i)
  }));

  return (
    <div className="max-w-2xl mx-auto bg-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-black mb-8 text-center">Payment Details</h2>

        {/* Payment Method Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="relative bg-white border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => handlePaymentMethodChange(method.id)}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => handlePaymentMethodChange(method.id)}
                  className="absolute top-2 left-2 w-4 h-4 accent-orange-400"
                />
                <div className="text-center mt-4">
                  {method.id === 'mastercard' && (
                    <div className="flex justify-center items-center space-x-1 mb-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
                      <div className="w-6 h-6 bg-orange-500 rounded-full opacity-80 -ml-2"></div>
                    </div>
                  )}
                  {method.id === 'VISA' && (
                    <div className="text-2xl font-bold text-blue-900 mb-2">VISA</div>
                  )}
                  {method.id === 'paypal' && (
                    <div className="text-2xl font-bold text-blue-600 mb-2">P</div>
                  )}
                  {method.id === 'cash' && (
                    <div className="text-sm font-bold text-gray-900 mb-2">💵</div>
                  )}
                  <div className="text-xs text-gray-600 uppercase">{method.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Detail Fields */}
        {(paymentMethod === 'mastercard' || paymentMethod === 'VISA') && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center">
                <label className="text-sm text-black mr-3 whitespace-nowrap font-medium">
                  Card number <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInputChange}
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                    errors.cardNumber ? 'border-red-500' : ''
                  }`}
                  placeholder=""
                />
              </div>
              <div className="flex items-center">
                <label className="text-sm text-black mr-3 whitespace-nowrap font-medium">
                  Cardholder <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={cardDetails.cardholderName}
                  onChange={handleCardInputChange}
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                    errors.cardholderName ? 'border-red-500' : ''
                  }`}
                  placeholder=""
                />
              </div>
            </div>

            {/* Expiry Date + CVC Row */}
            <div className="flex items-center space-x-4">
              <label className="text-sm text-black whitespace-nowrap font-medium">
                Expiry date <span className="text-orange-400">*</span>
              </label>
              <select
                name="expiryMonth"
                value={cardDetails.expiryMonth}
                onChange={handleCardInputChange}
                className={`px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  errors.expiryMonth ? 'border-red-500' : ''
                }`}
              >
                <option value="">Month</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
              <select
                name="expiryYear"
                value={cardDetails.expiryYear}
                onChange={handleCardInputChange}
                className={`px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  errors.expiryYear ? 'border-red-500' : ''
                }`}
              >
                <option value="">Year</option>
                {years.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
              <label className="text-sm text-black whitespace-nowrap font-medium ml-4">CVC</label>
              <div className="relative">
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  className={`px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                    errors.cvv ? 'border-red-500' : ''
                  }`}
                  placeholder=""
                  maxLength="3"
                />
                
              </div>
            </div>

            {/* Save Details Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="saveDetails"
                checked={saveDetails}
                onChange={(e) => setSaveDetails(e.target.checked)}
                className="w-4 h-4 bg-white border-gray-300 rounded focus:ring-orange-400"
              />
              <label htmlFor="saveDetails" className="ml-2 text-sm text-black">
                Save my details for future purchases
              </label>
            </div>

            {/* Order Summary Box */}
            <div style={{ backgroundColor: '#e5e5e5' }} className="border border-gray-300 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black">Subtotal (2 items)</span>
                  <span className="text-black">$60.80</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black">Home delivery cost</span>
                  <span className="text-sm text-black">$5.50</span>
                </div>
                <hr className="my-2 border-gray-400" />
                <div className="flex justify-between font-bold text-black">
                  <span>TOTAL AMOUNT</span>
                  <span>$66.30</span>
                </div>
              </div>
            </div>

            {/* Confirm Payment Button */}
            <button
              onClick={handleCardPayment}
              style={{ backgroundColor: '#14213d' }}
              className="w-full hover:opacity-90 text-white font-bold py-4 px-6 uppercase tracking-wide transition-opacity"
            >
              Confirm Payment
            </button>
          </div>
        )}

        {/* Cash on Delivery */}
        {paymentMethod === 'cash' && (
          <div className="space-y-6">
            <div style={{ backgroundColor: '#e5e5e5' }} className="border border-gray-300 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black">Subtotal (2 items)</span>
                  <span className="text-black">$60.80</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black">Home delivery cost</span>
                  <span className="text-sm text-black">$5.50</span>
                </div>
                <hr className="my-2 border-gray-400" />
                <div className="flex justify-between font-bold text-black">
                  <span>TOTAL AMOUNT</span>
                  <span>$66.30</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCashPayment}
              style={{ backgroundColor: '#14213d' }}
              className="w-full hover:opacity-90 text-white font-bold py-4 px-6 uppercase tracking-wide transition-opacity"
            >
              Confirm Payment
            </button>
          </div>
        )}

        {/* PayPal */}
        {paymentMethod === 'paypal' && (
          <div className="space-y-6">
            <div style={{ backgroundColor: '#e5e5e5' }} className="border border-gray-300 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black">Subtotal (2 items)</span>
                  <span className="text-black">$60.80</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black">Home delivery cost</span>
                  <span className="text-sm text-black">$5.50</span>
                </div>
                <hr className="my-2 border-gray-400" />
                <div className="flex justify-between font-bold text-black">
                  <span>TOTAL AMOUNT</span>
                  <span>$66.30</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => alert('PayPal payment would redirect to PayPal')}
              style={{ backgroundColor: '#14213d' }}
              className="w-full hover:opacity-90 text-white font-bold py-4 px-6 uppercase tracking-wide transition-opacity"
            >
              Pay with PayPal
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
