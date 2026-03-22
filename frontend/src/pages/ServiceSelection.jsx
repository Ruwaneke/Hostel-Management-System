import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTshirt, FaIron } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ServiceSelection = () => {
  const [selectedService, setSelectedService] = useState('');
  const navigate = useNavigate();

  const services = [
    {
      id: 'washing',
      name: 'Washing',
      icon: <FaTshirt className="text-4xl text-blue-500" />,
      description: 'Professional washing service for your clothes'
    },
    {
      id: 'ironing',
      name: 'Ironing',
      icon: <FaIron className="text-4xl text-orange-500" />,
      description: 'Expert ironing to make your clothes crisp and neat'
    }
  ];

  const handleSelect = (serviceId) => {
    setSelectedService(serviceId);
    // Store in localStorage for persistence
    localStorage.setItem('selectedService', serviceId);
  };

  const handleNext = () => {
    if (selectedService) {
      navigate('/booking');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Laundry Service</h1>
          <p className="text-lg text-gray-600">Choose your laundry service</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
                selectedService === service.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => handleSelect(service.id)}
            >
              <div className="text-center">
                <div className="mb-4 flex justify-center">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
                {selectedService === service.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 text-blue-500 font-semibold"
                  >
                    ✓ Selected
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!selectedService}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              selectedService
                ? 'bg-blue-500 hover:bg-blue-600 shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Next: Book Service
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceSelection;