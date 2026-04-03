import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
    {
        restaurantName: {
            type: String,
            required: [true, 'Restaurant name is required'],
            trim: true,
            minlength: [3, 'Name must be at least 3 characters']
        },
        contactNo: {
            type: String,
            required: [true, 'Contact number is required'],
            trim: true,
            match: [/^\d{10}$|^\+\d{1,3}\d{10}$/, 'Please provide a valid contact number']
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true
        },
        googleMapLink: {
            type: String,
            trim: true
        },
        isActive: {
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

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
