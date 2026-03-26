import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: [true, 'Day is required']
        },
        mealType: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner'],
            required: [true, 'Meal type is required']
        },
        items: {
            type: [String],
            required: [true, 'Meal items are required']
        },
        calories: {
            type: Number
        },
        serveTime: {
            type: String // e.g. "7:00 AM - 9:00 AM"
        }
    },
    { timestamps: true }
);

// Compound unique index — one entry per day + meal type
mealSchema.index({ day: 1, mealType: 1 }, { unique: true });

export const Meal = mongoose.model('Meal', mealSchema);