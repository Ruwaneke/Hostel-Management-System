import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import BookingSummary from '../components/BookingSummary';
import PaymentForm from '../components/PaymentForm';
import Notification from '../components/Notification';
import Header from '../components/Header';

export default function LaundryPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('form'); // 'form' | 'summary' | 'payment'
  const [bookingSummaryData, setBookingSummaryData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const handleSummary = (summaryData) => {
    setBookingSummaryData(summaryData);
    setCurrentStep('summary');
  };

  const handleEditBooking = () => {
    setCurrentStep('form');
  };

  // Called after booking is confirmed in BookingSummary → go to payment
  const handleConfirmBooking = (data) => {
    setBookingSummaryData(data);  // ← update with confirmed data
    setCurrentStep('payment');
  };

  const handleCancel = () => {
    setCurrentStep('form');
    setBookingSummaryData(null);
  };

  const handleBack = () => {
    setCurrentStep('form');
    setBookingSummaryData(null);
    navigate('/');
  };

  const addPaymentToHistory = (payment) => {
    setPaymentHistory(prev => [
      ...prev,
      { ...payment, id: Date.now(), date: new Date().toLocaleDateString() }
    ]);
  };

  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -40 },
  };

  return (
    <>
    <Header />
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Laundry Management System
          </h1>
          <p className="text-gray-600">Book your laundry service with ease</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {['Booking', 'Review', 'Payment'].map((label, i) => {
              const stepKey = ['form', 'summary', 'payment'][i];
              const isActive = currentStep === stepKey;
              const isDone =
                (i === 0 && ['summary', 'payment'].includes(currentStep)) ||
                (i === 1 && currentStep === 'payment');
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isDone
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-[#14213d] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isDone ? '✓' : i + 1}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isActive ? 'text-[#14213d]' : isDone ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < 2 && <div className="w-8 h-px bg-gray-300" />}
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentStep === 'form' && (
            <motion.div
              key="form"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <BookingForm onBack={handleBack} onSummary={handleSummary} />
            </motion.div>
          )}

         
          {currentStep === 'summary' && (
            <motion.div
              key="summary"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <BookingSummary
                bookingSummaryData={bookingSummaryData}
                onEdit={handleEditBooking}
                onConfirm={handleConfirmBooking}
                onCancel={handleCancel}
              />
            </motion.div>
          )}

          {currentStep === 'payment' && (
            <motion.div
              key="payment"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <PaymentForm
                bookingData={bookingSummaryData}
                addPaymentToHistory={addPaymentToHistory}
                onBack={() => setCurrentStep('summary')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Notification />
      </div>
    </div>
    </>
  );
}