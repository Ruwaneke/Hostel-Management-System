import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCalendar, FiMapPin, FiSettings, FiRotateCcw } from 'react-icons/fi';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Picked Up': 'bg-blue-100 text-blue-800 ',
  'In Progress': 'bg-orange-100 text-orange-800',
  'Ready for Pickup': 'bg-green-100 text-green-800'
};

export default function AdminTable({ bookings, onStatusUpdate }) {
  const [statusHistory, setStatusHistory] = useState({});

  const getNextStatus = (currentStatus) => {
    const statusFlow = ['Pending', 'Picked Up', 'In Progress', 'Ready for Pickup'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  const getPreviousStatus = (currentStatus) => {
    const statusFlow = ['Pending', 'Picked Up', 'In Progress', 'Ready for Pickup'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex > 0 ? statusFlow[currentIndex - 1] : null;
  };

  const handleStatusUpdate = (bookingId, newStatus) => {
    const booking = bookings.find(b => b.id === bookingId);
    const previousStatus = booking.status;

    // Store the previous status for undo
    setStatusHistory(prev => ({
      ...prev,
      [bookingId]: previousStatus
    }));

    onStatusUpdate(bookingId, newStatus);
  };

  const handleUndo = (bookingId) => {
    const previousStatus = statusHistory[bookingId];
    if (previousStatus) {
      onStatusUpdate(bookingId, previousStatus);
      
      // Remove from history after undo
      setStatusHistory(prev => {
        const updated = { ...prev };
        delete updated[bookingId];
        return updated;
      });
    }
  };

  const canUndo = (bookingId) => {
    return statusHistory[bookingId] !== undefined;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-900">
              <FiUser className="inline mr-2" />
              User
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">
              Service
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">
              <FiCalendar className="inline mr-2" />
              Date & Time
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">
              <FiMapPin className="inline mr-2" />
              Location
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">
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
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-4 px-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.userName}
                  </p>
                  {booking.addons && booking.addons.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Add-ons: {booking.addons.join(', ')}
                    </p>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 text-gray-900">
                {booking.serviceType}
              </td>
              <td className="py-4 px-4 text-gray-900">
                <div>
                  <p>{booking.date}</p>
                  <p className="text-sm text-gray-600">
                    {booking.timeSlot}
                  </p>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-900">
                {booking.location}
              </td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex gap-2">
                  {getNextStatus(booking.status) && (
                    <button
                      onClick={() => handleStatusUpdate(booking.id, getNextStatus(booking.status))}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Mark as {getNextStatus(booking.status)}
                    </button>
                  )}
                  
                  {canUndo(booking.id) && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => handleUndo(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center gap-1"
                      title="Undo last status change"
                    >
                      <FiRotateCcw className="w-4 h-4" />
                      Undo
                    </motion.button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No laundry requests found.
          </p>
        </div>
      )}
    </div>
  );
}