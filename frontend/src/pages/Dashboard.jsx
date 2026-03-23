import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import StatusIndicator from '../components/StatusIndicator';
import Notification from '../components/Notification';

export default function Dashboard() {
  const { bookings } = useBookings();

  // For demo, show the first booking as user's booking
  const userBooking = bookings[0];

  const statusMessages = {
    'Pending': 'Your booking is being processed. We will pick up your laundry soon.',
    'Picked Up': 'Your clothes have been picked up and are being processed.',
    'In Progress': 'Your laundry is currently being washed/ironed.',
    'Ready for Pickup': 'Your clothes are ready to collect!'
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your laundry booking status
          </p>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Booking
          </h2>

          {userBooking ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Service Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{userBooking.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date & Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userBooking.date} - {userBooking.timeSlot}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{userBooking.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add-ons</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userBooking.addons.length > 0 ? userBooking.addons.join(', ') : 'None'}
                  </p>
                </div>
              </div>

              <StatusIndicator status={userBooking.status} />

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  {statusMessages[userBooking.status]}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No active bookings found.
              </p>
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Book a Service
              </Link>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>

        <Notification />
      </div>
    </div>
  );
}