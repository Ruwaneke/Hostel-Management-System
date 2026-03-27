import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// @desc    Create a new room booking request
export const createBooking = async (req, res) => {
    try {
        const { 
            roomId, 
            roomNumber, 
            studentName, 
            studentEmail, 
            agreedToTerms, 
            nicNumber, 
            emergencyContactName, 
            emergencyContactPhone, 
            expectedMoveInDate, 
            specialRequests 
        } = req.body;

        // 1. Check if user already has a booking
        const existingBooking = await Booking.findOne({ studentEmail });
        if (existingBooking) {
            return res.status(400).json({ 
                success: false, 
                message: 'You already have an active booking or pending request.' 
            });
        }

        // 2. Check if room exists and has capacity
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found.' });
        }

        if (room.bookedStudents.length >= room.capacity) {
            return res.status(400).json({ 
                success: false, 
                message: 'Sorry, this room is already fully occupied.' 
            });
        }

        // 3. Create the booking document
        const booking = await Booking.create({
            roomId,
            roomNumber,
            studentName,
            studentEmail,
            agreedToTerms,
            nicNumber,
            emergencyContactName,
            emergencyContactPhone,
            expectedMoveInDate,
            specialRequests
        });

        // 4. CRITICAL: Add the student's email/ID to the Room's bookedStudents array
        // This ensures the occupancy count (e.g. 1/4 filled) updates correctly!
        await Room.findByIdAndUpdate(roomId, {
            $push: { bookedStudents: studentEmail } // or use user._id if you prefer tracking by ID
        });

        // 5. Send back the booking and populate roomId so frontend gets the keyMoney immediately
        const populatedBooking = await Booking.findById(booking._id).populate('roomId');

        res.status(201).json({ success: true, data: populatedBooking });

    } catch (error) {
        // Handle Mongoose validation errors (NIC format, Phone length, etc.)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get booking for the logged-in student
export const getMyBooking = async (req, res) => {
    try {
        const { email } = req.params; 
        
        // Populate 'roomId' is essential to get the keyMoney and monthlyFee data
        const booking = await Booking.findOne({ studentEmail: email }).populate('roomId');

        if (!booking) {
            return res.status(200).json({ success: true, data: null }); 
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error: Unable to fetch booking.' });
    }
};