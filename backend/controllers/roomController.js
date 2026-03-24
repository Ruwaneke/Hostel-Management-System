import { Room } from '../models/Room.js';

// Create a new room
export const createRoom = async (req, res) => {
    try {
        const roomData = { ...req.body };
        // If your frontend sends images via multer, extract filenames
        if (req.files && req.files.length > 0) {
            roomData.images = req.files.map(file => file.filename);
        }
        
        const room = await Room.create(roomData);
        res.status(201).json({ success: true, data: room });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all rooms
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single room
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: "Room not found" });
        res.status(200).json({ success: true, data: room });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a room
export const updateRoom = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.filename);
        }

        const room = await Room.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!room) return res.status(404).json({ success: false, message: "Room not found" });
        res.status(200).json({ success: true, data: room });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a room
export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: "Room not found" });
        res.status(200).json({ success: true, message: "Room deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};