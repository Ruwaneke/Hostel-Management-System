import React from 'react';
import { motion } from 'framer-motion';
import { GiWashingMachine, GiTShirt } from 'react-icons/gi';

const services = [
  {
    id: 'washing',
    name: 'Washing',
    description: 'Professional washing service for your clothes',
    icon: GiWashingMachine,
    color: 'bg-blue-500'
  },
  {
    id: 'ironing',
    name: 'Ironing',
    description: 'Expert ironing service to keep your clothes crisp',
    icon: GiTShirt,
    color: 'bg-orange-500'
  }
];

export default function ServiceSelection({ onServiceSelect }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onServiceSelect(service)}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mb-4 mx-auto`}>
            <service.icon className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
            {service.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            {service.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}