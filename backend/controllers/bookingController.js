import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Invoice from '../models/Invoice.js';

// ==========================================
// 1. CREATE BOOKING & STRIPE CHECKOUT
// ==========================================
export const createBookingAndCheckout = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // 🔥 DESTRUCTURED name AND email FROM req.body
    const { 
      roomId, 
      userId, 
      name, 
      email, 
      nicNumber, 
      emergencyContactName, 
      emergencyContactPhone, 
      expectedMoveInDate, 
      specialRequests 
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Prevent Multiple Bookings
    const existingBooking = await Booking.findOne({ 
      studentId: userId, 
      status: { $in: ['Pending Approval', 'Confirmed', 'Active'] } 
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: 'You already have an active or pending room booking. You cannot book multiple rooms.' 
      });
    }

    // 🔥 SAVING THE REAL name AND email TO THE DATABASE
    const newBooking = await Booking.create({
      studentId: userId, 
      studentEmail: email, // Saved real email
      studentName: name,   // Saved real name
      roomId: room._id,
      roomNumber: room.roomNumber,
      agreedToTerms: true,
      nicNumber,
      emergencyContactName,
      emergencyContactPhone,
      expectedMoveInDate,
      specialRequests,
      status: 'Pending Approval',
      paymentStatus: 'Unpaid'
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: { 
            currency: 'lkr', 
            product_data: { name: `Key Money (Refundable Deposit) - Room ${room.roomNumber}` }, 
            unit_amount: room.keyMoney * 100 
          }, 
          quantity: 1 
        },
        {
          price_data: { 
            currency: 'lkr', 
            product_data: { name: `First Month Rent - Room ${room.roomNumber}` }, 
            unit_amount: room.monthlyRent * 100 
          }, 
          quantity: 1 
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/payment-success/${newBooking._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/book/${roomId}`, 
    });

    newBooking.stripeSessionId = session.id;
    await newBooking.save();

    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. VERIFY PAYMENT & CREATE INVOICE
// ==========================================
export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, stripeSessionId } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.paymentStatus === 'Paid') {
      return res.json({ success: true, message: 'Payment was already verified.' });
    }

    const room = await Room.findById(booking.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    booking.paymentStatus = 'Paid';
    booking.status = 'Confirmed';
    booking.stripeSessionId = stripeSessionId; 
    
    const startDate = booking.expectedMoveInDate ? new Date(booking.expectedMoveInDate) : new Date();
    booking.paidUntil = startDate; 
    await booking.save();

    room.currentOccupancy = (room.currentOccupancy || 0) + 1; 
    if (room.currentOccupancy >= room.maxCapacity) {
      room.status = 'Full';
    }
    await room.save();

    const firstMonthName = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    await Invoice.create({
      studentId: booking.studentId,
      studentEmail: booking.studentEmail,
      studentName: booking.studentName,
      roomNumber: booking.roomNumber,
      description: `First Month Rent & Key Money (Room ${booking.roomNumber})`,
      monthName: firstMonthName, 
      amount: (room.monthlyRent || 0) + (room.keyMoney || 0),
      status: 'Paid',
      stripeSessionId: stripeSessionId,
      paidAt: new Date()
    });

    res.json({ success: true, message: 'Payment verified and room secured!' });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 3. GET USER BOOKING STATUS (For Dashboard)
// ==========================================
export const getUserBookingStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const booking = await Booking.findOne({ 
      studentId: userId, 
      status: { $in: ['Confirmed', 'Active'] } 
    });

    res.json({ hasBooking: !!booking, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 4. GET ROOM OCCUPANTS (For Admin Panel)
// ==========================================
export const getOccupantsByRoom = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      roomId: req.params.roomId,
      status: { $in: ['Confirmed', 'Active'] }
    }).lean(); 

    for (let booking of bookings) {
      const invoices = await Invoice.find({ studentId: booking.studentId });
      booking.invoices = invoices; 
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 5. NEW: CREATE MONTHLY RENT CHECKOUT
// ==========================================
export const createMonthlyRentCheckout = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    const room = await Room.findById(booking.roomId);

    if (!booking || !room) return res.status(404).json({ message: "Booking or Room not found" });

    const nextMonthDate = new Date(booking.paidUntil);
    const monthName = nextMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'lkr',
          product_data: { 
            name: `Monthly Rent - ${monthName}`, 
            description: `Room ${room.roomNumber} recurring fee` 
          },
          unit_amount: room.monthlyRent * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/monthly-success/${booking._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/user-dashboard`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Monthly Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 6. NEW: VERIFY MONTHLY RENT PAYMENT
// ==========================================
export const verifyMonthlyRent = async (req, res) => {
  try {
    const { bookingId, stripeSessionId } = req.body;
    
    const existingInvoice = await Invoice.findOne({ stripeSessionId });
    if (existingInvoice) {
      return res.json({ success: true, message: 'Payment already verified.' });
    }

    const booking = await Booking.findById(bookingId);
    const room = await Room.findById(booking.roomId);

    // Advance paidUntil by exactly 1 month
    const newPaidUntil = new Date(booking.paidUntil);
    newPaidUntil.setMonth(newPaidUntil.getMonth() + 1);
    booking.paidUntil = newPaidUntil;
    await booking.save();

    const paidMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    await Invoice.create({
      studentId: booking.studentId,
      studentEmail: booking.studentEmail,
      studentName: booking.studentName,
      roomNumber: booking.roomNumber,
      description: `Monthly Rent Payment`,
      monthName: paidMonthName,
      amount: room.monthlyRent,
      status: 'Paid',
      stripeSessionId: stripeSessionId,
      paidAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Verify Monthly Error:", error);
    res.status(500).json({ message: error.message });
  }
};