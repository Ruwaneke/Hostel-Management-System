import React from 'react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';

const PaymentModal = ({ payment, onClose }) => {
  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setTextColor(20, 33, 61); // #14213d
    doc.text('Payment Receipt', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    doc.text(`Amount: $${payment.amount.toFixed(2)}`, 20, 40);
    doc.text(`Payment Method: ${payment.method}`, 20, 50);
    doc.text(`Date: ${payment.date}`, 20, 60);
    doc.text(`Status: ${payment.status}`, 20, 70);
    doc.save('receipt.pdf');
  };

  const downloadTextReceipt = () => {
    const receiptText = `Payment Receipt\n\nAmount: $${payment.amount.toFixed(2)}\nPayment Method: ${payment.method}\nDate: ${payment.date}\nStatus: ${payment.status}`;
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipt.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      >
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="text-lg font-semibold text-black">Payment Successful!</h3>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-black">Amount:</span>
            <span className="font-medium text-black">${payment.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Payment Method:</span>
            <span className="font-medium text-black">{payment.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Date:</span>
            <span className="font-medium text-black">{payment.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Status:</span>
            <span className="font-medium" style={{ color: '#14213d' }}>{payment.status}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={downloadReceipt}
            style={{ backgroundColor: '#14213d' }}
            className="flex-1 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Download PDF Receipt
          </button>
          <button
            onClick={downloadTextReceipt}
            style={{ backgroundColor: '#fca311' }}
            className="flex-1 text-black py-2 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Download Text Receipt
          </button>
        </div>

        <button
          onClick={onClose}
          style={{ backgroundColor: '#e5e5e5' }}
          className="w-full mt-4 text-black py-2 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
