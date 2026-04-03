import Room from '../models/Room.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createRoom = async (req, res) => {
  try {
    const { 
      block, roomNumber, floorLevel, roomType, designatedGender, 
      airConditioning, bathroomType, furnishing, hasBalcony, 
      bedCount, tableCount, chairCount, 
      monthlyRent, keyMoney, maxCapacity, description, status, display 
    } = req.body;

    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) return res.status(400).json({ message: "Room number already exists" });

    let imageName = '';
    if (req.file) imageName = req.file.filename; 

    const room = await Room.create({
      block, roomNumber, floorLevel, roomType, designatedGender, 
      airConditioning, bathroomType, 
      furnishing: furnishing ? furnishing.split(',') : [], 
      hasBalcony, bedCount, tableCount, chairCount, 
      monthlyRent, keyMoney, maxCapacity, description, status,
      display: display === 'true', // Convert string to boolean
      image: imageName 
    });

    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Error creating room", error: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room", error: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (req.file) {
      req.body.image = req.file.filename;
      if (room.image) {
        const oldImagePath = path.join(__dirname, '../../frontend/public/roomImage', room.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
    }

    if (req.body.furnishing && typeof req.body.furnishing === 'string') {
        req.body.furnishing = req.body.furnishing.split(',');
    }
    
    if (req.body.display !== undefined) {
        req.body.display = req.body.display === 'true';
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ message: "Error updating room", error: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.image) {
      const imagePath = path.join(__dirname, '../../frontend/public/roomImage', room.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await room.deleteOne();
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error: error.message });
  }
};