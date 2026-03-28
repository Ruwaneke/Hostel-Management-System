import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiCreditCard, FiUser, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useBookings } from '../context/BookingContext';
import StatusIndicator from '../components/StatusIndicator';
import Notification from '../components/Notification';

export default function Dashboard() {
  const { bookings, lastPayment } = useBookings();  
  const userBooking = bookings[0];
  const bd = lastPayment?.bookingData ?? {};         

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
          <h1 className="text-4xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Track your laundry booking status</p>
        </motion.div>

        {/* ── Payment Summary Card (shows only after a payment) ── */}
        {lastPayment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
          >
            {/* Card header */}
            <div style={{ backgroundColor: '#14213d' }} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-400 flex items-center justify-center">
                  <FiCheckCircle className="text-white" size={18} />
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest">Last Payment</p>
                  <h2 className="text-white text-lg font-bold">Payment Successful</h2>
                </div>
              </div>
              <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
                {lastPayment.status}
              </span>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Left — Customer & Payment info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Customer Details
                </h3>
                <div className="flex items-center gap-3">
                  <FiUser className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">{bd.fullName ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900">{bd.location ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCreditCard className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="font-semibold text-gray-900">{lastPayment.method}</p>
                  </div>
                </div>
              </div>

              {/* Right — Booking info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Booking Details
                </h3>
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Service</p>
                    <p className="font-semibold text-gray-900">{bd.selectedServiceName ?? '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pieces</p>
                  <p className="font-semibold text-gray-900">
                    {bd.pieces} piece{bd.pieces !== 1 ? 's' : ''} × LKR 50.00
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Schedule</p>
                  <p className="font-semibold text-gray-900">
                    {bd.date ? new Date(bd.date).toLocaleDateString('en-GB') : '—'} · {bd.timeSlot ?? '—'}
                  </p>
                </div>
                {(bd.addonsTotal ?? 0) > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Add-ons</p>
                    <p className="font-semibold text-gray-900">LKR {bd.addonsTotal.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Total bar */}
            <div className="mx-6 mb-6 rounded-xl bg-gradient-to-r from-[#14213d] to-[#1e3160] px-5 py-4 flex justify-between items-center">
              <span className="text-white/80 text-sm font-medium uppercase tracking-wide">Total Paid</span>
              <span className="text-amber-400 text-2xl font-extrabold">
                LKR {(lastPayment.amount ?? 0).toFixed(2)}
              </span>
            </div>
          </motion.div>
        )}

        {/* ── Current Booking / Status (unchanged) ── */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Current Booking</h2>
          {userBooking ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-semibold text-gray-900">{userBooking.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-900">{userBooking.date} - {userBooking.timeSlot}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{userBooking.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Add-ons</p>
                  <p className="font-semibold text-gray-900">
                    {userBooking.addons.length > 0 ? userBooking.addons.join(', ') : 'None'}
                  </p>
                </div>
              </div>
              <StatusIndicator status={userBooking.status} />
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">{statusMessages[userBooking.status]}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No active bookings found.</p>
              <Link to="/laundry" className="bg-blue-900 hover:bg-blue-950 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Book a Service
              </Link>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/" className="text-[#14213d] hover:text-amber-500 font-semibold">← Back to Home</Link>
        </div>
        <Notification />
      </div>
    </div>
  );
}