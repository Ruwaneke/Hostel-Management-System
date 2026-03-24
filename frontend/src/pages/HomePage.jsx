import React, { useState } from 'react';
import Header from '../components/Header';
import PaymentForm from '../components/PaymentForm';
import PaymentHistory from './PaymentHistory';

const HomePage = () => {
  const [selectedSection, setSelectedSection] = useState('Room');
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Function to add a new payment to history
  const addPaymentToHistory = (payment) => {
    setPaymentHistory(prev => [...prev, { ...payment, id: Date.now(), date: new Date().toLocaleDateString() }]);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <Header selectedSection={selectedSection} onSectionChange={setSelectedSection} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Welcome to {selectedSection} Services</h2>
            <p className="text-black">
              Manage your hostel services efficiently. Select a section above to view details.
            </p>
          </div>

          {/* Payment Form */}
          <div className="mb-8">
            <PaymentForm addPaymentToHistory={addPaymentToHistory} />
          </div>

          {/* Payment History */}
          <div>
            <PaymentHistory paymentHistory={paymentHistory} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;