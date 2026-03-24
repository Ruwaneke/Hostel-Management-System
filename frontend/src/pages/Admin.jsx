import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useNotifications } from '../context/NotificationContext';
import AdminTable from '../components/AdminTable';
import Notification from '../components/Notification';

export default function Admin() {
  const { bookings, updateBookingStatus } = useBookings();
  const { addNotification } = useNotifications();

  const handleStatusUpdate = (id, newStatus) => {
    updateBookingStatus(id, newStatus);
    addNotification(`Booking status updated to ${newStatus}`, 'success');

    // Simulate notifications to user
    if (newStatus === 'Picked Up') {
      addNotification('User notified: Clothes have been picked up', 'info');
    } else if (newStatus === 'Ready for Pickup') {
      addNotification('User notified: Clothes are ready to collect', 'info');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage all laundry service requests
          </p>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Laundry Requests
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {bookings.length} requests
            </div>
          </div>

          <AdminTable bookings={bookings} onStatusUpdate={handleStatusUpdate} />
        </div>

        <div className="text-center mt-8">
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