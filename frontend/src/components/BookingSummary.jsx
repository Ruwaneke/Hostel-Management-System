import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { useBookings } from '../context/BookingContext';
import { useNotifications } from '../context/NotificationContext';

export default function BookingSummary({ bookingSummaryData, onEdit, onConfirm, onCancel }) {
  const { addBooking } = useBookings();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const booking = {
      userName: bookingSummaryData.fullName,
      serviceType: bookingSummaryData.selectedServiceNames.join(' + '),
      date: bookingSummaryData.date?.toISOString().split('T')[0],
      timeSlot: bookingSummaryData.timeSlot,
      location: bookingSummaryData.location,
      addons: bookingSummaryData.selectedAddonNames.map(a => a.name),
      totalAmount: bookingSummaryData.addonsTotal + bookingSummaryData.bookingFee,
      email: bookingSummaryData.email,
      telephone: bookingSummaryData.telephone
    };

    addBooking(booking);
    addNotification('Booking confirmed successfully!', 'success');
    setIsSubmitting(false);
    onConfirm();
  };

  const totalPrice = bookingSummaryData.addonsTotal + bookingSummaryData.bookingFee;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Booking Summary
      </h2>

      <div className="space-y-6">
        {/* Customer Info */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{bookingSummaryData.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{bookingSummaryData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              <p className="font-medium text-gray-900 dark:text-white">{bookingSummaryData.telephone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
              <p className="font-medium text-gray-900 dark:text-white">{bookingSummaryData.location}</p>
            </div>
          </div>
        </div>

        {/* Services Selected */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <FiCheck className="mr-2 text-green-600 dark:text-green-400" />
            Selected Services
          </h3>
          <div className="space-y-2">
            {bookingSummaryData.selectedServiceNames.map((service, index) => (
              <div key={index} className="flex items-center">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  {service}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Date:</span> {bookingSummaryData.date?.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Time:</span> {bookingSummaryData.timeSlot}
            </p>
          </div>
        </div>

        {/* Add-ons */}
        {bookingSummaryData.selectedAddonNames.length > 0 ? (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Selected Add-ons
            </h3>
            <div className="space-y-2">
              {bookingSummaryData.selectedAddonNames.map((addon, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{addon.name}</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    LKR {addon.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-gray-600 dark:text-gray-300 text-sm">
            No add-ons selected
          </div>
        )}

        {/* Price Breakdown */}
        <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Price Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Add-ons Total:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                LKR {bookingSummaryData.addonsTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Booking Fee:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                LKR {bookingSummaryData.bookingFee.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-blue-200 dark:border-blue-700 pt-2 mt-2 flex justify-between">
              <span className="font-bold text-lg text-gray-900 dark:text-white">Total Amount:</span>
              <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                LKR {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onEdit}
            className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <FiX className="mr-2" />
            Edit Booking
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <FiCheck className="mr-2" />
                Confirm Booking
              </>
            )}
          </button>
        </div>

        <button
          onClick={onCancel}
          className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-semibold py-2 px-4 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}