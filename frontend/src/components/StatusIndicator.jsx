import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTruck, FiSettings, FiCheckCircle } from 'react-icons/fi';

const statusConfig = {
  'Pending': {
    icon: FiClock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    progress: 25
  },
  'Picked Up': {
    icon: FiTruck,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    progress: 50
  },
  'In Progress': {
    icon: FiSettings,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    progress: 75
  },
  'Ready for Pickup': {
    icon: FiCheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    progress: 100
  }
};

const statusSteps = ['Pending', 'Picked Up', 'In Progress', 'Ready for Pickup'];

export default function StatusIndicator({ status }) {
  const currentIndex = statusSteps.indexOf(status);
  const config = statusConfig[status];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Status: {status}
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
          {status}
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          {statusSteps.map((step, index) => {
            const stepConfig = statusConfig[step];
            const Icon = stepConfig.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? stepConfig.color.replace('text-', 'bg-') + ' text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  } ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                >
                  <Icon className="text-lg" />
                </motion.div>
                <span className={`text-xs mt-1 text-center ${
                  isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        <div className="relative">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${config.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`h-full rounded-full ${config.color.replace('text-', 'bg-')}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}