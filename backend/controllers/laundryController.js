import Stripe from 'stripe';
import Laundry from '../models/Laundry.js';
import LaundrySettings from '../models/LaundrySettings.js';

export const getLaundrySettings = async (req, res) => {
  try {
    let settings = await LaundrySettings.findOne();
    if (!settings) settings = await LaundrySettings.create({});
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLaundrySettings = async (req, res) => {
  try {
    const { 
      washOnlyPrice, washAndDryPrice, ironOnlyPrice, washAndIronPrice, dryCleanPrice,
      oneDayExtra, twoDayExtra, weeklyExtra, deliveryCharge 
    } = req.body;
    
    let settings = await LaundrySettings.findOne();
    if (!settings) {
      settings = new LaundrySettings(req.body);
    } else {
      if (washOnlyPrice !== undefined) settings.washOnlyPrice = washOnlyPrice;
      if (washAndDryPrice !== undefined) settings.washAndDryPrice = washAndDryPrice;
      if (ironOnlyPrice !== undefined) settings.ironOnlyPrice = ironOnlyPrice;
      if (washAndIronPrice !== undefined) settings.washAndIronPrice = washAndIronPrice;
      if (dryCleanPrice !== undefined) settings.dryCleanPrice = dryCleanPrice;
      if (oneDayExtra !== undefined) settings.oneDayExtra = oneDayExtra;
      if (twoDayExtra !== undefined) settings.twoDayExtra = twoDayExtra;
      if (weeklyExtra !== undefined) settings.weeklyExtra = weeklyExtra;
      if (deliveryCharge !== undefined) settings.deliveryCharge = deliveryCharge;
    }
    
    await settings.save();
    res.status(200).json({ message: "Laundry prices updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLaundryCheckout = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { studentId, studentName, studentEmail, studentPhone, roomNumber, serviceType, packageType, pieces, specialInstructions } = req.body;
    
    const imageName = req.file ? req.file.filename : null;
    const settings = await LaundrySettings.findOne() || await LaundrySettings.create({});
    
    // 1. Calculate Base Price from Service Type
    let basePrice = 0;
    if (serviceType === 'Wash Only') basePrice = settings.washOnlyPrice;
    else if (serviceType === 'Wash and Dry') basePrice = settings.washAndDryPrice;
    else if (serviceType === 'Iron Only') basePrice = settings.ironOnlyPrice;
    else if (serviceType === 'Wash and Iron') basePrice = settings.washAndIronPrice;
    else if (serviceType === 'Dry Clean') basePrice = settings.dryCleanPrice;
    else return res.status(400).json({ message: "Invalid service type" });

    // 2. Calculate Premium from Package Speed
    let extraPrice = 0;
    if (packageType === 'One Day Service') extraPrice = settings.oneDayExtra;
    else if (packageType === 'Two Day Service') extraPrice = settings.twoDayExtra;
    else if (packageType === 'Weekly Service') extraPrice = settings.weeklyExtra;
    else return res.status(400).json({ message: "Invalid package type" });

    // 3. Final Calculation
    const pricePerPiece = basePrice + extraPrice;
    const totalAmount = (pricePerPiece * Number(pieces)) + (settings.deliveryCharge || 0);

    const newLaundryOrder = await Laundry.create({
      studentId, studentName, studentEmail, studentPhone, roomNumber, 
      serviceType, packageType, pieces: Number(pieces), 
      specialInstructions, pricePerPiece, totalAmount,
      image: imageName, 
      status: 'Pending Drop-off',
      paymentStatus: 'Unpaid'
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: { 
          currency: 'lkr', 
          product_data: { 
            name: `Laundry: ${serviceType} (${packageType})`, 
            description: `${pieces} pcs @ Rs.${pricePerPiece}/pc + Delivery (Rs.${settings.deliveryCharge})` 
          }, 
          unit_amount: totalAmount * 100 
        }, 
        quantity: 1 
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/laundry-success?laundry_success=${newLaundryOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/user-dashboard`, 
    });

    newLaundryOrder.stripeSessionId = session.id;
    await newLaundryOrder.save();

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Laundry Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyLaundryPayment = async (req, res) => {
  try {
    const { orderId, stripeSessionId } = req.body;
    const order = await Laundry.findById(orderId);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus === 'Paid') return res.json({ success: true, message: 'Already verified' });

    order.paymentStatus = 'Paid';
    order.stripeSessionId = stripeSessionId;
    order.paidAt = new Date();
    await order.save();

    res.json({ success: true, message: 'Laundry payment verified!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentLaundryOrders = async (req, res) => {
  try {
    const orders = await Laundry.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLaundryOrders = async (req, res) => {
  try {
    const orders = await Laundry.find({ paymentStatus: 'Paid' }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLaundryStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const order = await Laundry.findByIdAndUpdate(req.params.id, { status, adminNote }, { new: true });
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};