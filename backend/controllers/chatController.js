import { GoogleGenerativeAI } from '@google/generative-ai';
// IMPORT YOUR ROOM MODEL HERE (adjust path if needed)
import { Room } from '../models/Room.js'; 

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, reply: "Please say something!" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // --- PART 1: Ask AI to extract search parameters into JSON ---
        const extractionPrompt = `
        You are an assistant for a Hostel Management System. A student asked: "${message}"
        Extract their search preferences and return ONLY a valid JSON object. Do not include markdown formatting or backticks.
        Use these exact keys:
        - "gender" (string: "Boy", "Girl", or null if not mentioned)
        - "type" (string: "Single", "Double", "Triple", or null)
        - "isAC" (boolean: true if they want AC, false if non-AC, null if not mentioned)
        - "maxPrice" (number: the maximum monthly fee they mentioned, or null)
        `;

        const jsonResult = await model.generateContent(extractionPrompt);
        let searchParams = {};
        
        try {
            // Clean up the text just in case the AI added formatting
            const cleanJsonText = jsonResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            searchParams = JSON.parse(cleanJsonText);
        } catch (e) {
            console.log("Could not parse AI JSON:", jsonResult.response.text());
        }

        // --- PART 2: Search the MongoDB Database ---
        let dbQuery = { status: "Available" }; // Only search for available rooms

        // Apply the AI's filters to our database query
        if (searchParams.type) dbQuery.type = new RegExp(searchParams.type, 'i');
        // If your database uses 'isAC' or 'hasAC', map it here:
        if (searchParams.isAC !== null && searchParams.isAC !== undefined) dbQuery.isAC = searchParams.isAC; 
        if (searchParams.maxPrice) dbQuery.price = { $lte: searchParams.maxPrice };
        // If your Room model has a gender/block field, add it here:
        // if (searchParams.gender) dbQuery.allowedGender = new RegExp(searchParams.gender, 'i');

        // Fetch matching rooms from MongoDB
        const foundRooms = await Room.find(dbQuery).limit(5);

        // --- PART 3: Ask AI to write a friendly reply based on the DB results ---
        const replyPrompt = `
        You are a helpful hostel receptionist.
        The student asked: "${message}"
        Here are the available rooms from the database: ${JSON.stringify(foundRooms)}
        
        If the database returned rooms, tell the student the details (room number, type, price) nicely. 
        If the database array is empty, politely say we don't have exactly what they are looking for right now, but they can try adjusting their search.
        Keep the answer short, friendly, and use formatting like bullet points if listing multiple rooms.
        `;

        const finalResult = await model.generateContent(replyPrompt);
        const finalReply = finalResult.response.text();

        // Send the AI's friendly reply back to the React frontend
        res.status(200).json({
            success: true,
            reply: finalReply,
            rawRooms: foundRooms // Sending this just in case you want to use the raw data in React
        });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ success: false, reply: "Sorry, my AI brain is resting right now. Please try again later!" });
    }
};