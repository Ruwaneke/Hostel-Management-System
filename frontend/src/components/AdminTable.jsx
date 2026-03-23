import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCalendar, FiMapPin, FiSettings } from 'react-icons/fi';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  'Picked Up': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  'In Progress': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
  'Ready for Pickup': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
};

export default function AdminTable({ bookings, onStatusUpdate }) {
  const getNextStatus = (currentStatus) => {
    const statusFlow = ['Pending', 'Picked Up', 'In Progress', 'Ready for Pickup'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
              <FiUser className="inline mr-2" />
              User
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
              Service
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
              <FiCalendar className="inline mr-2" />
              Date & Time
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
              <FiMapPin className="inline mr-2" />
              Location
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
              <FiSettings className="inline mr-2" />
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <motion.tr
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="py-4 px-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.userName}
                  </p>
                  {booking.addons.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add-ons: {booking.addons.join(', ')}
                    </p>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 text-gray-900 dark:text-white">
                {booking.serviceType}
              </td>
              <td className="py-4 px-4 text-gray-900 dark:text-white">
                <div>
                  <p>{booking.date}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {booking.timeSlot}
                  </p>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-900 dark:text-white">
                {booking.location}
              </td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </td>
              <td className="py-4 px-4">
                {getNextStatus(booking.status) && (
                  <button
                    onClick={() => onStatusUpdate(booking.id, getNextStatus(booking.status))}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                  >
                    Mark as {getNextStatus(booking.status)}
                  </button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No laundry requests found.
          </p>
        </div>
      )}
    </div>
  );
}