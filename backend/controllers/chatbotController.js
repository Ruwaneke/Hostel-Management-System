import Room from '../models/Room.js';
import LaundrySettings from '../models/LaundrySettings.js';

export const handleChatQuery = async (req, res) => {
  try {
    const { message } = req.body;
    const msg = message.toLowerCase(); // Convert to lowercase for easy matching
    let response = "";
    let data = null;

    // ========================================================
    // 1. LAUNDRY & PRICING INTENT (Catches typos like 'landry')
    // ========================================================
    if (msg.match(/laund|landry|wash|iron|dry clean|clean|clothes|price|pricing|cost/)) {
      const settings = await LaundrySettings.findOne() || {};
      response = `👕 **Laundry & Service Pricing:**\n\n` +
                 `**Base Prices (per piece):**\n` +
                 `• Wash Only: Rs. ${settings.washOnlyPrice || 0}\n` +
                 `• Wash & Dry: Rs. ${settings.washAndDryPrice || 0}\n` +
                 `• Iron Only: Rs. ${settings.ironOnlyPrice || 0}\n` +
                 `• Wash & Iron: Rs. ${settings.washAndIronPrice || 0}\n` +
                 `• Dry Clean: Rs. ${settings.dryCleanPrice || 0}\n\n` +
                 `**Speed Premium (per piece):**\n` +
                 `• 24-Hour Express: +Rs. ${settings.oneDayExtra || 0}\n` +
                 `• 48-Hour Standard: +Rs. ${settings.twoDayExtra || 0}\n\n` +
                 `🚚 Flat Delivery Fee: Rs. ${settings.deliveryCharge || 0}`;
      
      return res.json({ reply: response, suggestions: null });
    }

    // ========================================================
    // 2. SMART ROOM SEARCH INTENT (Dynamic Query Builder)
    // ========================================================
    if (msg.match(/room|bed|book|ac|cheap|affordable|boy|girl|male|female|share|shered|single/)) {
      let query = { status: 'Available' };
      let sort = { monthlyRent: 1 }; // Default sort by cheapest
      let descriptionParts = [];

      // A. Gender Filter
      if (msg.match(/boy|male|men/)) {
        // Find rooms strictly for Males OR mixed/all rooms
        query.designatedGender = { $in: ['Male', 'All'] };
        descriptionParts.push("Boys/Male");
      } else if (msg.match(/girl|female|women/)) {
        // Find rooms strictly for Females OR mixed/all rooms
        query.designatedGender = { $in: ['Female', 'All'] };
        descriptionParts.push("Girls/Female");
      }

      // B. AC / Non-AC Filter
      if (msg.match(/non-ac|non ac|without ac/)) {
        query.airConditioning = 'Non-AC';
        descriptionParts.push("Non-AC");
      } else if (msg.match(/\bac\b/)) { 
        // \bac\b ensures it strictly matches the word "ac", not "machine"
        query.airConditioning = 'AC';
        descriptionParts.push("AC");
      }

      // C. Room Type Filter (Catches typos like 'shered')
      if (msg.match(/share|shared|shered/)) {
        query.roomType = 'Shared';
        descriptionParts.push("Shared");
      } else if (msg.match(/single|private|alone/)) {
        query.roomType = 'Single';
        descriptionParts.push("Single");
      }

      // D. Price Sorting
      if (msg.match(/cheap|lowest|affordable/)) {
        sort = { monthlyRent: 1 };
      }

      // Execute the perfectly combined database query!
      const rooms = await Room.find(query).sort(sort).limit(4);

      // Format a natural-sounding response
      const descString = descriptionParts.length > 0 ? descriptionParts.join(" ") : "Available";

      if (rooms.length > 0) {
        response = `✨ I found ${rooms.length} ${descString} rooms for you:`;
        data = rooms.map(r => ({
          id: r._id,
          text: `Room ${r.roomNumber} (${r.designatedGender}, ${r.roomType}, ${r.airConditioning}) - Rs.${r.monthlyRent.toLocaleString()}`,
          link: `/book/${r._id}`
        }));
      } else {
        response = `😔 I'm sorry, I couldn't find any available ${descString} rooms right now. Try adjusting your search criteria!`;
      }

      return res.json({ reply: response, suggestions: data });
    }

    // ========================================================
    // 3. DEFAULT RESPONSE
    // ========================================================
    response = "👋 Hi! I'm your Hostel Assistant.\n\n" +
               "Try asking me things like:\n" +
               "• 'Find boys AC shared room'\n" +
               "• 'Show me cheap female rooms'\n" +
               "• 'What are the laundry prices?'";
    
    return res.json({ reply: response, suggestions: null });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ message: "Chatbot error" });
  }
};