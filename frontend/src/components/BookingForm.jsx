import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GiWashingMachine, GiTShirt } from 'react-icons/gi';
import { useBookings } from '../context/BookingContext';
import { useNotifications } from '../context/NotificationContext';
import { CURRENT_USER } from '../constants/currentUser';

const PRICE_PER_PIECE = 50.00;
const BOOKING_FEE = 100.00;

export default function BookingForm({ onBack, onSummary }) {
  const { addBooking } = useBookings();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    fullName: CURRENT_USER.name,
    email: CURRENT_USER.email,
    telephone: '',
    service: '',
    pieces: 1,
    date: null,
    timeSlot: '',
    location: CURRENT_USER.roomNumber,
    addons: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceOptions = [
    {
      id: 'washing',
      name: 'Washing',
      description: 'Professional washing service',
      icon: GiWashingMachine,
    },
    {
      id: 'ironing',
      name: 'Ironing',
      description: 'Expert ironing service',
      icon: GiTShirt,
    },
    {
      id: 'both',
      name: 'Both Services',
      description: 'Washing + Ironing',
      icon: GiWashingMachine,
    }
  ];

  const timeSlots = ['Morning (9AM-12PM)', 'Afternoon (1PM-5PM)', 'Evening (6PM-9PM)'];

  const availableAddons = [
    { id: 'express', name: 'Express Service', price: 250.00 },
    { id: 'folding', name: 'Folding Service', price: 150.00 },
    { id: 'stain', name: 'Stain Removal', price: 350.00 },
    { id: 'fragrance', name: 'Premium Fragrance', price: 100.00 }
  ];

  const isIroning = formData.service === 'ironing';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Telephone validation: only numbers and max 10 digits
    if (name === 'telephone') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numbersOnly }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      service: prev.service === serviceId ? '' : serviceId,
      addons: serviceId === 'ironing' ? [] : prev.addons
    }));
  };

  const handlePiecesChange = (delta) => {
    setFormData(prev => ({
      ...prev,
      pieces: Math.min(8, Math.max(1, prev.pieces + delta))
    }));
  };

  const handleAddonToggle = (addonId) => {
    if (isIroning) return;
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter(a => a !== addonId)
        : [...prev.addons, addonId]
    }));
  };

  const piecesTotal = () => formData.pieces * PRICE_PER_PIECE;

  const addonsTotal = () =>
    availableAddons
      .filter(addon => formData.addons.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);

  const grandTotal = () => piecesTotal() + addonsTotal() + BOOKING_FEE;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.service) {
      addNotification('Please select a service', 'warning');
      return;
    }
    if (!formData.date || !formData.timeSlot || !formData.location) {
      addNotification('Please fill in all required fields', 'warning');
      return;
    }
    if (!formData.telephone || formData.telephone.length !== 10) {
      addNotification('Please enter a valid 10-digit telephone number', 'warning');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const selectedService = serviceOptions.find(s => s.id === formData.service);

    const summaryData = {
      ...formData,
      selectedServiceName: selectedService?.name,
      selectedAddonNames: formData.addons.map(id => availableAddons.find(a => a.id === id)),
      piecesTotal: piecesTotal(),
      addonsTotal: addonsTotal(),
      bookingFee: BOOKING_FEE,
      grandTotal: grandTotal()
    };

    setIsSubmitting(false);
    onSummary(summaryData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Laundry Booking Form</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Service Selection (single-select) ── */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Select Service *
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {serviceOptions.map((service, index) => {
              const Icon = service.icon;
              const isSelected = formData.service === service.id;
              return (
                <motion.button
                  key={service.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500 text-black shadow-lg'
                      : 'border-gray-300 bg-gray-50 text-gray-900 hover:border-gray-400'
                  }`}
                >
                  <Icon className="text-3xl mb-2 mx-auto" />
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-sm">{service.description}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Number of Pieces ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Pieces *{' '}
            <span className="text-gray-400 font-normal">(LKR {PRICE_PER_PIECE.toFixed(2)} per piece)</span>
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handlePiecesChange(-1)}
              disabled={formData.pieces <= 1}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-md font-bold text-gray-600 hover:border-amber-500 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              −
            </button>

            {/* Pill track */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 8 }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, pieces: n }))}
                  className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                    n === formData.pieces
                      ? 'bg-amber-500 text-black shadow-md scale-110'
                      : n < formData.pieces
                      ? 'bg-amber-200 text-amber-800'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handlePiecesChange(1)}
              disabled={formData.pieces >= 8}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 hover:border-amber-500 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>

            <span className="text-sm text-gray-500">
              {formData.pieces} {formData.pieces === 1 ? 'piece' : 'pieces'} × LKR {PRICE_PER_PIECE.toFixed(2)} ={' '}
              <span className="font-semibold text-gray-800">LKR {piecesTotal().toFixed(2)}</span>
            </span>
          </div>
        </div>

        {/* ── Personal Information ── */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telephone Number *{' '}
            <span className="text-gray-400 font-normal text-xs">(10 digits)</span>
          </label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            maxLength="10"
            placeholder="eg : 0774150135"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent"
            required
          />
          {formData.telephone.length > 0 && formData.telephone.length < 10 && (
            <p className="text-red-500 text-xs mt-1"> 
            </p>
          )}
        </div>

        {/* ── Booking Details ── */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date *</label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData(prev => ({ ...prev, date }))}
              minDate={new Date()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent"
              required
            >
              <option value="">Select time slot</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location / Room Number *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Room 101, Block A"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>

        {/* ── Add-ons ── */}
        <div className={`p-4 rounded-lg border transition-all ${isIroning ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-gray-50 border-transparent'}`}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Add-ons (Optional) — Prices in LKR
            </label>
            {isIroning && (
              <span className="text-xs text-red-500 font-medium bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                Not available for Ironing
              </span>
            )}
          </div>
          <div className="space-y-2">
            {availableAddons.map(addon => (
              <label
                key={addon.id}
                className={`flex items-center p-2 rounded transition-colors ${
                  isIroning
                    ? 'cursor-not-allowed'
                    : 'hover:bg-gray-100 cursor-pointer'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.addons.includes(addon.id)}
                  onChange={() => handleAddonToggle(addon.id)}
                  disabled={isIroning}
                  className="mr-2 w-4 h-4 disabled:cursor-not-allowed"
                />
                <span className="flex-1 text-gray-700">{addon.name}</span>
                <span className="text-[#14213D] font-semibold">LKR {addon.price.toFixed(2)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Price Summary ── */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-400">
          <h3 className="font-semibold text-gray-900 mb-3">Price Summary</h3>
          <div className="space-y-1.5 text-sm">

            {/* Pieces */}
            <div className="flex justify-between">
              <span className="text-gray-600">
                Pieces ({formData.pieces} × LKR {PRICE_PER_PIECE.toFixed(2)}):
              </span>
              <span className="font-semibold text-gray-900">LKR {piecesTotal().toFixed(2)}</span>
            </div>

            {/* Addons (only if any selected and not ironing) */}
            {!isIroning && formData.addons.length > 0 && (
              <>
                {formData.addons.map(id => {
                  const addon = availableAddons.find(a => a.id === id);
                  return (
                    <div key={id} className="flex justify-between text-gray-500">
                      <span className="pl-3">+ {addon.name}:</span>
                      <span>LKR {addon.price.toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between">
                  <span className="text-gray-600">Add-ons Total:</span>
                  <span className="font-semibold text-gray-900">LKR {addonsTotal().toFixed(2)}</span>
                </div>
              </>
            )}

            {/* Booking fee */}
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Fee:</span>
              <span className="font-semibold text-gray-900">LKR {BOOKING_FEE.toFixed(2)}</span>
            </div>

            {/* Grand total */}
            <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Estimated Total:</span>
              <span className="font-bold text-lg text-amber-500">LKR {grandTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#14213D] hover:bg-[#1e3160] disabled:bg-[#E5E5E5] disabled:text-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            'Review Booking Summary'
          )}
        </button>
      </form>
    </motion.div>
  );
}