import Laundry from "../models/Laundry.js";

// CREATE booking
export const createLaundryBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      telephone,
      service,
      pieces,
      date,
      timeSlot,
      location,
      addons,
      totalAmount,
    } = req.body;

    // Basic validation
    if (
      !fullName ||
      !email ||
      !telephone ||
      !service ||
      !date ||
      !timeSlot ||
      !location
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBooking = new Laundry({
      fullName,
      email,
      telephone,
      service,
      pieces,
      date,
      timeSlot,
      location,
      addons,
      totalAmount,
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET all bookings
export const getLaundryBookings = async (req, res) => {
  try {
    const bookings = await Laundry.find().sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};