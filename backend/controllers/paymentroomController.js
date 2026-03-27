import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Initiate Stripe Checkout (Initial Bundle or Monthly Rent)
 * @route   POST /api/payments/create-checkout-session
 */
export const createCheckoutSession = async (req, res) => {
    try {
        const { bookingId, paymentType } = req.body; 
        
        // Find booking and get room pricing details
        const booking = await Booking.findById(bookingId).populate('roomId');
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking record not found' });
        }

        let totalAmount = 0;
        let paymentDescription = "";

        // logic to determine charge amount
        if (paymentType === 'monthly') {
            totalAmount = booking.roomId.monthlyFee || 0;
            paymentDescription = `Monthly Rent Payment - Room ${booking.roomNumber}`;
        } else if (paymentType === 'initial') {
            const keyMoney = booking.roomId.keyMoney || 0;
            const monthlyFee = booking.roomId.monthlyFee || 0;
            totalAmount = keyMoney + monthlyFee;
            paymentDescription = `Initial Bundle (Key Money + 1st Month Rent) - Room ${booking.roomNumber}`;
        } else {
            // Default fallback logic based on booking status
            if (booking.paymentStatus === 'Unpaid') {
                totalAmount = (booking.roomId.keyMoney || 0) + (booking.roomId.monthlyFee || 0);
                paymentDescription = `Initial Bundle (Key Money + 1st Month Rent) - Room ${booking.roomNumber}`;
            } else {
                totalAmount = booking.roomId.monthlyFee || 0;
                paymentDescription = `Monthly Rent Payment - Room ${booking.roomNumber}`;
            }
        }

        if (totalAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Calculated payment amount is invalid.' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'lkr',
                    product_data: {
                        name: `HostelMS Room ${booking.roomNumber}`,
                        description: paymentDescription,
                    },
                    unit_amount: Math.round(totalAmount * 100), // Stripe expects cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user-dashboard`,
            metadata: {
                bookingId: bookingId,
                paymentType: paymentType || (booking.paymentStatus === 'Unpaid' ? 'initial' : 'monthly')
            }
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe Session Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Verify Stripe payment and Update Booking Status
 * @route   POST /api/payments/verify-payment
 */
export const verifyPayment = async (req, res) => {
    try {
        const { session_id, booking_id } = req.body;
        if (!session_id || !booking_id) {
            return res.status(400).json({ success: false, message: 'Missing session or booking identifiers' });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const booking = await Booking.findById(booking_id);
            if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

            // Calculate next billing cycle (30 days from now)
            const nextDue = new Date();
            nextDue.setDate(nextDue.getDate() + 30);

            const paymentType = session.metadata?.paymentType;

            const updates = {
                status: 'Active',
                monthlyRentStatus: 'Paid',
                nextRentDueDate: nextDue
            };

            // If this was the first payment, confirm the Key Money is settled
            if (paymentType === 'initial') {
                updates.paymentStatus = 'Paid'; 
            }

            const updatedBooking = await Booking.findByIdAndUpdate(booking_id, updates, { new: true }).populate('roomId');

            res.status(200).json({ success: true, message: 'Payment verified and residency updated!', data: updatedBooking });
        } else {
            res.status(400).json({ success: false, message: 'Stripe payment status not confirmed as paid.' });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get data for Receipt Generation
 * @route   GET /api/payments/invoice/:bookingId
 */
export const getInvoiceDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate('roomId');
        
        if (!booking || (booking.paymentStatus !== 'Paid' && booking.monthlyRentStatus !== 'Paid')) {
            return res.status(400).json({ success: false, message: 'No settled invoices found for this booking.' });
        }

        const invoiceData = {
            invoiceId: `INV-${booking._id.toString().slice(-6).toUpperCase()}`,
            date: new Date(booking.updatedAt).toLocaleDateString(),
            studentName: booking.studentName,
            studentEmail: booking.studentEmail,
            roomNumber: booking.roomNumber,
            block: booking.roomId?.block || 'N/A',
            monthlyFee: booking.roomId?.monthlyFee || 0,
            keyMoney: booking.roomId?.keyMoney || 0,
            // Logic assumes receipt shows the bundle if it was the initial payment
            amountPaid: (booking.roomId?.keyMoney || 0) + (booking.roomId?.monthlyFee || 0),
            status: 'Paid'
        };

        res.status(200).json({ success: true, data: invoiceData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};