import Room from '../models/Room.js';
import LaundrySettings from '../models/LaundrySettings.js';

export const handleChatQuery = async (req, res) => {
  try {
    const { message } = req.body;
    const msg = message.toLowerCase();
    let response = "";
    let data = null;

    // 1. QUERY: LAUNDRY PRICES
    if (msg.includes('laundry') || msg.includes('wash') || msg.includes('price')) {
      const settings = await LaundrySettings.findOne();
      response = `👕 **Laundry Pricing:** \n\n` +
                 `• Wash Only: Rs. ${settings.washOnlyPrice}/pc\n` +
                 `• Wash & Iron: Rs. ${settings.washAndIronPrice}/pc\n` +
                 `• Dry Clean: Rs. ${settings.dryCleanPrice}/pc\n` +
                 `• Delivery Fee: Rs. ${settings.deliveryCharge}`;
    } 

    // 2. QUERY: AC ROOMS
    else if (msg.includes('ac') && msg.includes('room')) {
      const rooms = await Room.find({ airConditioning: 'AC', status: 'Available' }).limit(3);
      if (rooms.length > 0) {
        response = `❄️ I found ${rooms.length} available AC rooms for you:`;
        data = rooms.map(r => ({
          id: r._id,
          text: `Room ${r.roomNumber} (Block ${r.block}) - Rs.${r.monthlyRent}`,
          link: `/book/${r._id}`
        }));
      } else {
        response = "Currently, all AC rooms are fully occupied. Would you like to see Non-AC options?";
      }
    }

    // 3. QUERY: CHEAPEST / GENERAL ROOMS
    else if (msg.includes('room') || msg.includes('available')) {
      const rooms = await Room.find({ status: 'Available' }).sort({ monthlyRent: 1 }).limit(3);
      if (rooms.length > 0) {
        response = `🏠 Here are some available rooms starting from Rs. ${rooms[0].monthlyRent}:`;
        data = rooms.map(r => ({
          id: r._id,
          text: `Room ${r.roomNumber} - ${r.roomType}`,
          link: `/book/${r._id}`
        }));
      } else {
        response = "I'm sorry, we are currently fully booked!";
      }
    }

    // 4. DEFAULT RESPONSE
    else {
      response = "👋 Hi! I'm your Hostel Assistant. You can ask me about:\n" +
                 "• 'Available AC rooms'\n" +
                 "• 'Laundry prices'\n" +
                 "• 'Room rates'";
    }

    res.json({ reply: response, suggestions: data });
  } catch (error) {
    res.status(500).json({ message: "Chatbot error" });
  }
};