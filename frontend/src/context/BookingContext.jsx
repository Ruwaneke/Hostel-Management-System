import React, { createContext, useContext, useState } from 'react';
import { CURRENT_USER } from '../constants/currentUser';

const BookingContext = createContext();

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export default function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [lastPayment, setLastPayment] = useState(null);

  const addBooking = (booking) => {
    const newBooking = {
      id: Date.now(),
    
      userName: CURRENT_USER.name,                   
      email: CURRENT_USER.email,
      serviceType: booking.serviceType,          
      date: booking.date,                         
      timeSlot: booking.timeSlot,                     
      location: booking.location,               
      addons: booking.addons ?? [],               
      totalAmount: booking.totalAmount,
      telephone: booking.telephone,
      status: 'Pending',                            
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBookingStatus = (id, status) => {
    setBookings(prev => prev.map(booking =>
      booking.id === id ? { ...booking, status } : booking
    ));
  };

  const savePayment = (payment) => {
    setLastPayment(payment);
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      updateBookingStatus,
      lastPayment,
      savePayment
    }}>
      {children}
    </BookingContext.Provider>
  );
}

