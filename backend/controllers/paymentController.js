import Payment from '../models/paymentModel.js';

const extractLast4 = (cardNumber = '') =>
  cardNumber.replace(/\s/g, '').slice(-4) || null;

export const createPayment = async (req, res) => {
  try {
    const { amount, method, status, bookingData, cardDetails, saveDetails } = req.body;

    if (amount == null || !method) {
      return res.status(400).json({ message: 'amount and method are required.' });
    }

    let safeCardDetails;
    if (cardDetails && method !== 'Cash on Delivery') {
      safeCardDetails = {
        cardholderName: cardDetails.cardholderName,
        last4:          extractLast4(cardDetails.cardNumber),
        expiryMonth:    cardDetails.expiryMonth,
        expiryYear:     cardDetails.expiryYear,
      };
    }

    const payment = await Payment.create({
    userId:        bookingData?.userId ?? 'guest',
    serviceType:   'laundry',
    amount,
    paymentMethod: method === 'Cash on Delivery' ? 'cash' : 'card', 
    status:        'success',                                         
    method,
    bookingData,
    cardDetails:   safeCardDetails,
    saveDetails:   saveDetails ?? false,
});

    res.status(201).json({
      message:   'Payment recorded successfully.',
      paymentId: payment._id,
      status:    payment.status,
    });
  } catch (error) {
    console.error('createPayment error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};