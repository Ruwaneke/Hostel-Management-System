import { GoogleGenerativeAI } from '@google/generative-ai';
import { Room } from '../models/Room.js';

export const handleChat = async (req, res) => {
    try {
        // Now we receive the message AND the chat history from React
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, reply: "Please say something!" });
        }

        // Format the history so the AI can read it easily
        const chatContext = history 
            ? history.map(h => `${h.sender === 'user' ? 'Student' : 'AI'}: ${h.text}`).join('\n') 
            : "";

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 1. extractionPrompt with Context
        const extractionPrompt = `
        You are an AI for a University Student Hostel. 
        Recent Conversation:
        ${chatContext}
        Student's new message: "${message}"

        Based on the conversation and new message, determine if we need to search the database for a room right now.
        Return ONLY a valid JSON object. Do not include markdown formatting or backticks.
        Use these exact keys:
        - "isSearch" (boolean: true if they are actively looking for a room, checking availability, or asking about prices. false if just chatting/greeting)
        - "type" (string: "Single", "Double", "Triple", "Dormitory", or null)
        - "maxPrice" (number: max monthly fee, or null)
        - "gender" (string: "Boy", "Girl", or null)
        - "isAC" (boolean: true for AC, false for non-AC, null for any)
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
            let dbQuery = { status: "Available" }; 
            if (searchParams.type) dbQuery.type = new RegExp(searchParams.type, 'i');
            if (searchParams.maxPrice) dbQuery.price = { $lte: searchParams.maxPrice };
            // Add gender/AC if your DB supports them!

            foundRooms = await Room.find(dbQuery).limit(3);

            replyPrompt = `
            IMPORTANT RULES:
            1. You are a Student Hostel Assistant (for long-term semesters/months). NEVER say "for tonight" or act like a hotel.
            2. If the student asks you to speak Sinhala, you MUST reply entirely in Sinhala.
            3. If a room says "Any" gender, just say "suitable for you". Don't use robotic terms like 'Any gender room'.

            Recent Conversation:
            ${chatContext}
            Student's message: "${message}"
            
            Database Results: ${JSON.stringify(foundRooms)}
            
            Write a helpful, natural reply to the student. If rooms are found, list the room number, type, and monthly fee clearly. If none found, say so politely.
            `;
        } else {
            // 3. Conversational Prompt (with memory)
            replyPrompt = `
            IMPORTANT RULES:
            1. You are a Student Hostel Assistant. Do not act like a nightly hotel.
            2. If the student asks you to speak Sinhala, you MUST reply entirely in Sinhala.
            3. Read the conversation history to understand context (e.g., if they ask a follow-up question about a room you just showed them).

            Recent Conversation:
            ${chatContext}
            Student's message: "${message}"
            
            Write a natural, helpful reply based on the context. Keep it short.
            `;
        }

        const finalResult = await model.generateContent(replyPrompt);
        const finalReply = finalResult.response.text();

        res.status(200).json({
            success: true,
            reply: finalReply
        });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ success: false, reply: "Sorry, I am having trouble connecting to my AI brain right now!" });
    }
};