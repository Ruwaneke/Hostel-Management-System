import Room from '../models/Room.js';
import fs from 'fs';
import path from 'path';

// Helper to delete images from the backend/uploads folder
const deleteImagesFromDisk = (photoPaths) => {
    photoPaths.forEach(photoPath => {
        // Ensure this path matches where your multer saves files
        const fullPath = path.join(process.cwd(), 'uploads', path.basename(photoPath));
        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath);
            } catch (err) {
                console.error("Error deleting file:", fullPath, err);
            }
        }
    });
};

export const addRoom = async (req, res) => {
  try {
    const { block, roomNumber, roomType, capacity, isAC, features, keyMoney, monthlyFee, beds, tables, chairs } = req.body;
    
    // Store path as it will be served (e.g., /uploads/filename.jpg)
    const photoPaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    if (!roomNumber || !roomType || !capacity || !keyMoney || !monthlyFee || !beds || photoPaths.length === 0) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields and upload images.' });
    }

    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) return res.status(400).json({ success: false, message: 'Room number already exists.' });

    const featuresArray = typeof features === 'string' && features.trim() !== '' 
        ? features.split(',').map(f => f.trim()) 
        : (Array.isArray(features) ? features : []);

    const room = await Room.create({
        block, 
        roomNumber, 
        roomType, 
        capacity,
        isAC: isAC === 'true' || isAC === true, 
        beds, 
        tables: tables || 0, 
        chairs: chairs || 0,
        features: featuresArray, 
        keyMoney, 
        monthlyFee, 
        photos: photoPaths
    });

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllRoomsAdmin = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 }); 
    res.status(200).json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getAvailableRoomsStudent = async (req, res) => {
  try {
    // Logic to find rooms where there are still slots available
    const rooms = await Room.find();
    const availableRooms = rooms.filter(room => room.capacity > room.bookedStudents.length);
    res.status(200).json({ success: true, count: availableRooms.length, data: availableRooms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.status(200).json({ success: true, data: room });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateRoom = async (req, res) => {
    try {
        let room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

        const { block, roomNumber, roomType, capacity, isAC, features, keyMoney, monthlyFee, beds, tables, chairs } = req.body;

        let featuresArray = room.features;
        if (features !== undefined) {
            featuresArray = typeof features === 'string' ? features.split(',').map(f => f.trim()) : features;
        }

        let photoPaths = room.photos;
        if (req.files && req.files.length > 0) {
            deleteImagesFromDisk(room.photos); // Clean up old photos
            photoPaths = req.files.map(file => `/uploads/${file.filename}`);
        }

        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {
            block: block || room.block,
            roomNumber: roomNumber || room.roomNumber,
            roomType: roomType || room.roomType,
            capacity: capacity || room.capacity,
            isAC: isAC !== undefined ? (isAC === 'true' || isAC === true) : room.isAC,
            beds: beds || room.beds,
            tables: tables !== undefined ? tables : room.tables,
            chairs: chairs !== undefined ? chairs : room.chairs,
            features: featuresArray,
            keyMoney: keyMoney || room.keyMoney,
            monthlyFee: monthlyFee || room.monthlyFee,
            photos: photoPaths
        }, { new: true, runValidators: true });

        res.status(200).json({ success: true, data: updatedRoom });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

        if (room.bookedStudents && room.bookedStudents.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete a room that has students. Please unallocate all students first.' 
            });
        }

        deleteImagesFromDisk(room.photos);
        await room.deleteOne();

        res.status(200).json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};