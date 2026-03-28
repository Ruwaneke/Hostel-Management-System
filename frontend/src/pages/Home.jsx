import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import BookingSummary from '../components/BookingSummary';
import Notification from '../components/Notification';

export default function Home() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('form');
  const [bookingSummaryData, setBookingSummaryData] = useState(null);

  const handleEditBooking = () => {
    setCurrentStep('form');
  };

  const handleConfirmBooking = () => {
    navigate('/dashboard');
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

  const handleSummary = (summaryData) => {
    setBookingSummaryData(summaryData);
    setCurrentStep('summary');
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Laundry Management System
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Book your laundry service with ease
          </p>
        </motion.div>

        {currentStep === 'form' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BookingForm
              onBack={handleBack}
              onSummary={handleSummary}
            />
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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

        <Notification />
      </div>
    </div>
  );
}