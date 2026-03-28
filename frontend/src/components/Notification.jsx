import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const notificationIcons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  warning: FiAlertCircle,
  info: FiInfo
};

const notificationColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500'
};

export default function Notification() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = notificationIcons[notification.type] || notificationIcons.info;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 border-l-4 border-gray-300 "
              style={{ borderLeftColor: notificationColors[notification.type]?.replace('bg-', '') }}
            >
              <div className={`p-2 rounded-full ${notificationColors[notification.type]} text-white`}>
                <Icon className="text-lg" />
              </div>
              <p className="flex-1 text-gray-900">
                {notification.message}
              </p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="text-gray-500" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}