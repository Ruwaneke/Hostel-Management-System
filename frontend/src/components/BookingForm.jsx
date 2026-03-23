import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GiWashingMachine, GiTShirt } from 'react-icons/gi';
import { useBookings } from '../context/BookingContext';
import { useNotifications } from '../context/NotificationContext';

export default function BookingForm({ onBack, onSummary }) {
  const { addBooking } = useBookings();
  const { addNotification } = useNotifications();
  const [currentStep, setCurrentStep] = useState('form');
  
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    telephone: '',
    services: [],
    date: null,
    timeSlot: '',
    location: '',
    addons: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceOptions = [
    {
      id: 'washing',
      name: 'Washing',
      description: 'Professional washing service',
      icon: GiWashingMachine,
      color: 'bg-blue-500'
    },
    {
      id: 'ironing',
      name: 'Ironing',
      description: 'Expert ironing service',
      icon: GiTShirt,
      color: 'bg-orange-500'
    },
    {
      id: 'both',
      name: 'Both Services',
      description: 'Washing + Ironing',
      icon: GiWashingMachine,
      color: 'bg-purple-500'
    }
  ];

  const timeSlots = ['Morning (9AM-12PM)', 'Afternoon (1PM-5PM)', 'Evening (6PM-9PM)'];
  
  const availableAddons = [
    { id: 'express', name: 'Express Service', price: 250.00 },
    { id: 'folding', name: 'Folding Service', price: 150.00 },
    { id: 'stain', name: 'Stain Removal', price: 350.00 },
    { id: 'fragrance', name: 'Premium Fragrance', price: 100.00 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleAddonToggle = (addonId) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter(a => a !== addonId)
        : [...prev.addons, addonId]
    }));
  };

  const calculateAddonsTotal = () => {
    return availableAddons
      .filter(addon => formData.addons.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.services.length === 0) {
      addNotification('Please select at least one service', 'warning');
      return;
    }

    if (!formData.date || !formData.timeSlot || !formData.location || !formData.telephone) {
      addNotification('Please fill in all required fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const summaryData = {
      ...formData,
      selectedServiceNames: formData.services.map(id => 
        serviceOptions.find(s => s.id === id).name
      ),
      selectedAddonNames: formData.addons.map(id => 
        availableAddons.find(a => a.id === id)
      ),
      addonsTotal: calculateAddonsTotal(),
      bookingFee: 100.00
    };

    setIsSubmitting(false);
    onSummary(summaryData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Laundry Booking Form
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Services *
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {serviceOptions.map((service, index) => {
              const Icon = service.icon;
              const isSelected = formData.services.includes(service.id);
              return (
                <motion.button
                  key={service.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleServiceToggle(service.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `border-blue-500 ${service.color} text-white shadow-lg`
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400'
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

        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Telephone Number *
          </label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Booking Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Booking Date *
            </label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData(prev => ({ ...prev, date }))}
              minDate={new Date()}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Slot *
            </label>
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location / Room Number *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Room 101, Block A"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Add-ons Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Add-ons (Optional) - Prices in LKR
          </label>
          <div className="space-y-2">
            {availableAddons.map(addon => (
              <label key={addon.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600/50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.addons.includes(addon.id)}
                  onChange={() => handleAddonToggle(addon.id)}
                  className="mr-2 w-4 h-4"
                />
                <span className="flex-1 text-gray-700 dark:text-gray-300">
                  {addon.name}
                </span>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  LKR {addon.price.toFixed(2)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Price Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Add-ons Total:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                LKR {calculateAddonsTotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Booking Fee:</span>
              <span className="font-semibold text-gray-900 dark:text-white">LKR 100.00</span>
            </div>
            <div className="border-t border-blue-200 dark:border-blue-800 pt-1 mt-2 flex justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">Estimated Total:</span>
              <span className="font-bold text-lg text-green-600 dark:text-green-400">
                LKR {(calculateAddonsTotal() + 100.00).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
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