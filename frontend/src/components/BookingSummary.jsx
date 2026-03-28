import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { useBookings } from '../context/BookingContext';
import { useNotifications } from '../context/NotificationContext';

const PRICE_PER_PIECE = 50.00;

export default function BookingSummary({ bookingSummaryData, onEdit, onConfirm, onCancel }) {
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    fullName,
    email,
    telephone,
    location,
    selectedServiceName,   // single string
    pieces,
    date,
    timeSlot,
    selectedAddonNames,    // array of addon objects { id, name, price }
    piecesTotal,
    addonsTotal,
    bookingFee,
    grandTotal,
  } = bookingSummaryData;

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const booking = {
      userName: fullName,
      serviceType: selectedServiceName,
      pieces,
      date: date?.toISOString().split('T')[0],
      timeSlot,
      location,
      addons: (selectedAddonNames ?? []).map(a => a.name),
      totalAmount: grandTotal,
      email,
      telephone,
    };

    //addNotification('Booking confirmed successfully!', 'success');
    setIsSubmitting(false);
    onConfirm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Booking Summary
      </h2>

      <div className="space-y-6">

        {/* ── Customer Info ── */}
        <div className="bg-gray-50  p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900  mb-3">Customer Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-gray-900 ">{fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900 ">{email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900 ">{telephone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900 ">{location}</p>
            </div>
          </div>
        </div>

        {/* ── Service & Schedule ── */}
        <div className="bg-blue-50  p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-900  mb-3 flex items-center">
            <FiCheck className="mr-2 text-green-600 dark:text-green-400" />
            Selected Service
          </h3>

          {/* Service badge */}
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {selectedServiceName || '—'}
          </span>

          {/* Pieces */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-600">Pieces:</span>
            <span className="font-semibold text-gray-900">
              {pieces} {pieces === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          {/* Date & Time */}
          <div className="mt-3 pt-3 border-t border-blue-200 space-y-1">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Date:</span> {date?.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Time:</span> {timeSlot}
            </p>
          </div>
        </div>

        {/* ── Add-ons ── */}
        {(selectedAddonNames ?? []).length > 0 ? (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">Selected Add-ons</h3>
            <div className="space-y-2">
              {selectedAddonNames.map((addon, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{addon.name}</span>
                  <span className="font-semibold text-amber-500">
                    LKR {addon.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg text-gray-500 text-sm">
            No add-ons selected
          </div>
        )}

        {/* ── Price Breakdown ── */}
        <div className="bg-[#14213D] p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-4">Price Breakdown</h3>
          <div className="space-y-2 text-sm">

            {/* Pieces cost */}
            <div className="flex justify-between">
              <span className="text-gray-50">
                Pieces ({pieces} × LKR {PRICE_PER_PIECE.toFixed(2)}):
              </span>
              <span className="font-semibold text-gray-100">
                LKR {(piecesTotal ?? 0).toFixed(2)}
              </span>
            </div>

            {/* Addons cost (only if any) */}
            {(addonsTotal ?? 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-50">Add-ons Total:</span>
                <span className="font-semibold text-gray-100">
                  LKR {addonsTotal.toFixed(2)}
                </span>
              </div>
            )}

            {/* Booking fee */}
            <div className="flex justify-between">
              <span className="text-gray-50 ">Booking Fee:</span>
              <span className="font-semibold text-gray-100">
                LKR {(bookingFee ?? 0).toFixed(2)}
              </span>
            </div>

            {/* Grand total */}
            <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between">
              <span className="font-bold text-lg text-gray-50">Total Amount:</span>
              <span className="font-bold text-2xl text-amber-500">
                LKR {(grandTotal ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onEdit}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <FiX className="mr-2" />
            Edit Booking
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
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
          className="w-full text-gray-500  hover:text-gray-900 font-semibold py-2 px-4 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}