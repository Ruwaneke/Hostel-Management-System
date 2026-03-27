import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Initiate Stripe Checkout (Initial Bundle or Monthly Rent)
export const createCheckoutSession = async (req, res) => {
    try {
        const { bookingId, paymentType } = req.body; // paymentType: 'monthly' | 'initial' (optional)
        const booking = await Booking.findById(bookingId).populate('roomId');
        
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        let totalAmount = 0;
        let paymentDescription = "";

        if (paymentType === 'monthly') {
            totalAmount = booking.roomId.monthlyFee || 0;
            paymentDescription = `Monthly Rent Payment - Room ${booking.roomNumber}`;
        } else if (paymentType === 'initial') {
            const keyMoney = booking.roomId.keyMoney || 0;
            const monthlyFee = booking.roomId.monthlyFee || 0;
            totalAmount = keyMoney + monthlyFee;
            paymentDescription = `Initial Bundle (Key Money + 1st Month Rent) - Room ${booking.roomNumber}`;
        } else {
            // default behavior based on current booking state
            if (booking.paymentStatus === 'Unpaid') {
                const keyMoney = booking.roomId.keyMoney || 0;
                const monthlyFee = booking.roomId.monthlyFee || 0;
                totalAmount = keyMoney + monthlyFee;
                paymentDescription = `Initial Bundle (Key Money + 1st Month Rent) - Room ${booking.roomNumber}`;
            } else {
                totalAmount = booking.roomId.monthlyFee || 0;
                paymentDescription = `Monthly Rent Payment - Room ${booking.roomNumber}`;
            }
        }

        if (totalAmount <= 0) return res.status(400).json({ success: false, message: 'Invalid payment amount.' });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'lkr',
                    product_data: {
                        name: `HostelMS Room ${booking.roomNumber}`,
                        description: paymentDescription,
                    },
                    unit_amount: totalAmount * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
            cancel_url: `http://localhost:5173/user-dashboard`,
            metadata: {
                paymentType: paymentType || (booking.paymentStatus === 'Unpaid' ? 'initial' : 'monthly')
            }
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify Stripe payment and Update Booking Status
export const verifyPayment = async (req, res) => {
    try {
        const { session_id, booking_id } = req.body;
        if (!session_id || !booking_id) return res.status(400).json({ success: false, message: 'Missing IDs' });

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const booking = await Booking.findById(booking_id);
            if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

            // Calculate new Due Date (30 days from today)
            const nextDue = new Date();
            nextDue.setDate(nextDue.getDate() + 30);

            // Determine what kind of payment this was from Stripe session metadata
            const paymentType = session.metadata?.paymentType || (booking.paymentStatus === 'Unpaid' ? 'initial' : 'monthly');

            const updates = {
                status: 'Active',
                monthlyRentStatus: 'Paid',
                nextRentDueDate: nextDue
            };

            if (paymentType === 'initial') {
                updates.paymentStatus = 'Paid'; // mark key money as paid for initial bundle
            }

            const updatedBooking = await Booking.findByIdAndUpdate(booking_id, updates, { new: true }).populate('roomId');

            res.status(200).json({ success: true, message: 'Residency Updated!', data: updatedBooking });
        } else {
            res.status(400).json({ success: false, message: 'Stripe payment not verified.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get data for Receipt
export const getInvoiceDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate('roomId');
        
        if (!booking || (booking.paymentStatus !== 'Paid' && booking.monthlyRentStatus !== 'Paid')) {
            return res.status(400).json({ success: false, message: 'No paid invoice found.' });
        }

        const invoiceData = {
            invoiceId: `INV-${booking._id.toString().slice(-6).toUpperCase()}`,
            date: new Date(booking.updatedAt).toLocaleDateString(),
            studentName: booking.studentName,
            studentEmail: booking.studentEmail,
            roomNumber: booking.roomNumber,
            block: booking.roomId?.block || 'A',
            monthlyFee: booking.roomId?.monthlyFee || 0,
            keyMoney: booking.roomId?.keyMoney || 0,
            amountPaid: (booking.roomId.keyMoney + booking.roomId.monthlyFee), // Modify this logic if you want to show specific historical payments
            status: 'Paid'
        };
        res.status(200).json({ success: true, data: invoiceData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};