import { Room } from '../models/Room.js';
import { User } from '../models/User.js';

// GET /api/rooms — all rooms (admin) or available rooms (user)
export const getRooms = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { status: 'available' };
        const rooms = await Room.find(filter).populate('occupants', 'name email');
        res.status(200).json({ success: true, count: rooms.length, rooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/rooms/:id
export const getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate('occupants', 'name email');
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.status(200).json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/rooms — admin only
export const createRoom = async (req, res) => {
    try {
        const { roomNumber, floor, type, capacity, price, amenities } = req.body;
        const room = await Room.create({ roomNumber, floor, type, capacity, price, amenities });
        res.status(201).json({ success: true, message: 'Room created', room });
    } catch (error) {
        const msg = error.code === 11000 ? 'Room number already exists' : error.message;
        res.status(400).json({ success: false, message: msg });
    }
};

// PUT /api/rooms/:id — admin only
export const updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.status(200).json({ success: true, message: 'Room updated', room });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/rooms/:id — admin only
export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.status(200).json({ success: true, message: 'Room deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/rooms/:id/assign — admin assigns a student to a room
export const assignRoom = async (req, res) => {
    try {
        const { studentId } = req.body;
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        if (room.occupants.length >= room.capacity) {
            return res.status(400).json({ success: false, message: 'Room is full' });
        }
        if (room.occupants.includes(studentId)) {
            return res.status(400).json({ success: false, message: 'Student already assigned to this room' });
        }

        room.occupants.push(studentId);
        if (room.occupants.length >= room.capacity) room.status = 'occupied';
        await room.save();

        res.status(200).json({ success: true, message: 'Student assigned to room', room });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/rooms/:id/vacate — admin removes a student from a room
export const vacateRoom = async (req, res) => {
    try {
        const { studentId } = req.body;
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

        room.occupants = room.occupants.filter(id => id.toString() !== studentId);
        if (room.occupants.length < room.capacity) room.status = 'available';
        await room.save();

        res.status(200).json({ success: true, message: 'Student removed from room', room });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
