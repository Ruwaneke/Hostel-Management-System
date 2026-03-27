import { GoogleGenerativeAI } from '@google/generative-ai';
import Room from '../models/Room.js';

export const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, reply: "Please say something!" });
        }

        const chatContext = history 
            ? history.map(h => `${h.sender === 'user' ? 'Student' : 'AI'}: ${h.text}`).join('\n') 
            : "";

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // 🚀 THE FIX: Upgraded from the retired 1.5 model to the current active 2.5 model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // --- HARDCODED KNOWLEDGE BASE ---
        const HOSTEL_RULES = `
        Official Hostel Rules:
        1. Payments must be settled before the 5th of every month.
        2. Visitors are not allowed inside the rooms after 8:00 PM.
        3. Students are responsible for furniture (Beds, Tables, Chairs).
        4. Strictly no smoking or alcohol consumption on the premises.
        5. Key money is non-refundable if the stay is less than 6 months.
        6. Management reserves the right to inspect rooms for security.
        `;

        // 1. extractionPrompt with Context
        const extractionPrompt = `
        You are an AI for a University Student Hostel. 
        Recent Conversation:
        ${chatContext}
        Student's new message: "${message}"

        Based on the conversation and new message, determine if we need to search the database for a room right now.
        Return ONLY a valid JSON object. Use these exact keys:
        - "isSearch" (boolean: true if they are looking for rooms, checking availability, or asking about prices)
        - "roomType" (string: "Single", "Double", "Triple", "Shared", or null)
        - "maxPrice" (number: max monthly fee, or null)
        `;

        const jsonResult = await model.generateContent(extractionPrompt);
        let searchParams = { isSearch: false };
        
        try {
            const cleanJsonText = jsonResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            searchParams = JSON.parse(cleanJsonText);
        } catch (e) {
            console.log("Could not parse AI JSON");
        }

        let foundRooms = null;
        let replyPrompt = "";

        // 2. Search Database if needed
        if (searchParams.isSearch) {
            let dbQuery = {}; 
            if (searchParams.roomType) dbQuery.roomType = new RegExp(searchParams.roomType, 'i');
            if (searchParams.maxPrice) dbQuery.monthlyFee = { $lte: searchParams.maxPrice };

            const allRooms = await Room.find(dbQuery);
            foundRooms = allRooms.filter(room => room.capacity > room.bookedStudents.length).slice(0, 3);

            replyPrompt = `
            ${HOSTEL_RULES}
            
            IMPORTANT RULES FOR YOUR REPLY:
            1. You are a Student Hostel Assistant.
            2. If rooms are found, list them neatly. Include Block, Room Number, Type, Monthly Fee, Key Money, and if it has AC or not. Mention the furniture (beds/tables/chairs).
            3. Answer any questions about rules using the Official Hostel Rules provided above.
            4. If the student asks you to speak Sinhala, you MUST reply entirely in Sinhala.

            Recent Conversation:
            ${chatContext}
            Student's message: "${message}"
            
            Database Results: ${JSON.stringify(foundRooms)}
            `;
        } else {
            // 3. Conversational Prompt (with memory and rules)
            replyPrompt = `
            ${HOSTEL_RULES}

            IMPORTANT RULES FOR YOUR REPLY:
            1. You are a Student Hostel Assistant.
            2. Answer any questions about the hostel rules accurately using the Official Hostel Rules provided above.
            3. Keep your tone friendly, helpful, and concise.
            4. If the student asks you to speak Sinhala, you MUST reply entirely in Sinhala.

            Recent Conversation:
            ${chatContext}
            Student's message: "${message}"
            `;
        }

        const finalResult = await model.generateContent(replyPrompt);
        const finalReply = finalResult.response.text();

        res.status(200).json({ success: true, reply: finalReply });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ success: false, reply: "Sorry, I am having trouble connecting to my AI brain right now!" });
    }
};