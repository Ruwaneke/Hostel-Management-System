import { GoogleGenerativeAI } from '@google/generative-ai';
import { Room } from '../models/Room.js'; // <-- Make sure this path points to your Room model

export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, reply: "Please say something!" });
        }

        // Initialize Gemini with the key from your .env
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 1. Ask AI to understand the student's message
        const extractionPrompt = `
        You are an assistant for a Hostel Management System. A student asked: "${message}"
        Extract their search preferences and return ONLY a valid JSON object. Do not include markdown formatting or backticks.
        Use these exact keys:
        - "type" (string: "Single", "Double", "Triple", or null)
        - "maxPrice" (number: the maximum monthly fee they mentioned, or null)
        `;

        const jsonResult = await model.generateContent(extractionPrompt);
        let searchParams = {};
        
        try {
            // Clean up the text so JSON.parse works perfectly
            const cleanJsonText = jsonResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            searchParams = JSON.parse(cleanJsonText);
        } catch (e) {
            console.log("Could not parse AI JSON:", jsonResult.response.text());
        }

        // 2. Search your MongoDB Database
        let dbQuery = { status: "Available" }; 

        // Match the Room type (Single, Double, etc.)
        if (searchParams.type) {
            dbQuery.type = new RegExp(searchParams.type, 'i');
        }
        
        // Match the price (less than or equal to the student's budget)
        if (searchParams.maxPrice) {
            dbQuery.price = { $lte: searchParams.maxPrice };
        }

        // Fetch up to 5 matching rooms from MongoDB
        const foundRooms = await Room.find(dbQuery).limit(5);

        // 3. Ask AI to write a friendly reply
        const replyPrompt = `
        You are a helpful hostel receptionist.
        The student asked: "${message}"
        Here are the available rooms from the database: ${JSON.stringify(foundRooms)}
        
        If the database returned rooms, tell the student the details nicely (room number, type, price). 
        If the database array is empty [], politely say we don't have exactly what they are looking for right now.
        Keep the answer short, friendly, and use bullet points if there are multiple rooms.
        `;

        const finalResult = await model.generateContent(replyPrompt);
        const finalReply = finalResult.response.text();

        // 4. Send the reply back to the frontend
        res.status(200).json({
            success: true,
            reply: finalReply
        });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ success: false, reply: "Sorry, I am having trouble connecting to my AI brain right now!" });
    }
};