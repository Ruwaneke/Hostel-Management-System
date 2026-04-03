import { Restaurant } from '../models/Restaurant.js';
import { FoodItem } from '../models/FoodItem.js';

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Restaurants retrieved successfully',
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving restaurants'
        });
    }
};

// Get single restaurant with its food items
export const getRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findById(id).populate('createdBy', 'name email');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        const foodItems = await FoodItem.find({ restaurantId: id, isAvailable: true })
            .sort({ availableDate: -1 });

        res.status(200).json({
            success: true,
            message: 'Restaurant retrieved successfully',
            data: {
                ...restaurant.toObject(),
                foodItems
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving restaurant'
        });
    }
};

// Create restaurant
export const createRestaurant = async (req, res) => {
    try {
        const { restaurantName, contactNo, address, googleMapLink } = req.body;

        // Validation
        if (!restaurantName || !contactNo || !address) {
            return res.status(400).json({
                success: false,
                message: 'Please provide restaurant name, contact number, and address'
            });
        }

        const restaurant = await Restaurant.create({
            restaurantName: restaurantName.trim(),
            contactNo: contactNo.trim(),
            address: address.trim(),
            googleMapLink: googleMapLink?.trim() || '',
            createdBy: req.user.id
        });

        const savedRestaurant = await Restaurant.findById(restaurant._id).populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Restaurant created successfully',
            data: savedRestaurant
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Restaurant already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating restaurant'
        });
    }
};

// Update restaurant
export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { restaurantName, contactNo, address, googleMapLink } = req.body;

        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            {
                restaurantName: restaurantName?.trim(),
                contactNo: contactNo?.trim(),
                address: address?.trim(),
                googleMapLink: googleMapLink?.trim()
            },
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Restaurant updated successfully',
            data: restaurant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating restaurant'
        });
    }
};

// Delete restaurant (soft delete and cascade to food items)
export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        // Soft delete food items
        await FoodItem.updateMany(
            { restaurantId: id },
            { isAvailable: false }
        );

        // Soft delete restaurant
        restaurant.isActive = false;
        await restaurant.save();

        res.status(200).json({
            success: true,
            message: 'Restaurant deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting restaurant'
        });
    }
};
