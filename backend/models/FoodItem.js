import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
    {
        foodName: {
            type: String,
            required: [true, 'Food name is required'],
            trim: true,
            minlength: [2, 'Food name must be at least 2 characters']
        },
        category: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner'],
            required: [true, 'Category is required']
        },
        availableDate: {
            type: Date,
            required: [true, 'Available date is required']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: [true, 'Restaurant is required']
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

// Index for efficient querying
foodItemSchema.index({ restaurantId: 1, availableDate: 1 });

export const FoodItem = mongoose.model('FoodItem', foodItemSchema);
