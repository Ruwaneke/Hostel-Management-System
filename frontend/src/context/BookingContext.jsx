import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export default function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      userName: 'John Doe',
      serviceType: 'Washing',
      date: '2024-03-25',
      timeSlot: 'Morning',
      location: 'Room 101',
      status: 'Pending',
      addons: ['Express Service']
    }
  ]);

  const addBooking = (booking) => {
    const newBooking = {
      id: Date.now(),
      ...booking,
      status: 'Pending'
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBookingStatus = (id, status) => {
    setBookings(prev => prev.map(booking =>
      booking.id === id ? { ...booking, status } : booking
    ));
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus }}>
      {children}
    </BookingContext.Provider>
  );
}