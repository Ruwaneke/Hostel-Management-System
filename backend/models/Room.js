import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: [true, 'Room number is required'],
            unique: true,
            trim: true
        },
        floor: {
            type: Number,
            required: [true, 'Floor number is required']
        },
        type: {
            type: String,
            enum: ['single', 'double', 'triple'],
            required: [true, 'Room type is required']
        },
        capacity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: [true, 'Room price is required']
        },
        amenities: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: ['available', 'occupied', 'maintenance'],
            default: 'available'
        },
        occupants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    { timestamps: true }
);

// Virtual to check if full
roomSchema.virtual('isFull').get(function () {
    return this.occupants.length >= this.capacity;
});

export const Room = mongoose.model('Room', roomSchema);
