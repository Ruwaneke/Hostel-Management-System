import { FoodItem } from '../models/FoodItem.js';
import { Restaurant } from '../models/Restaurant.js';

// Get all food items (with filters)
export const getAllFoodItems = async (req, res) => {
    try {
        const { restaurantId, category, date } = req.query;
        let filter = { isAvailable: true };

        if (restaurantId) {
            filter.restaurantId = restaurantId;
        }

        if (category) {
            filter.category = category;
        }

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            filter.availableDate = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const foodItems = await FoodItem.find(filter)
            .populate('restaurantId', 'restaurantName contactNo address googleMapLink')
            .populate('createdBy', 'name')
            .sort({ availableDate: -1 });

        res.status(200).json({
            success: true,
            message: 'Food items retrieved successfully',
            data: foodItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving food items'
        });
    }
};

// Get single food item
export const getFoodItem = async (req, res) => {
    try {
        const { id } = req.params;

        const foodItem = await FoodItem.findById(id)
            .populate('restaurantId')
            .populate('createdBy', 'name email');

        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Food item retrieved successfully',
            data: foodItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving food item'
        });
    }
};

// Create food item
export const createFoodItem = async (req, res) => {
    try {
        const { foodName, category, availableDate, description, restaurantId } = req.body;

        // Validation
        if (!foodName || !category || !availableDate || !restaurantId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide food name, category, available date, and restaurant'
            });
        }

        // Validate category
        if (!['breakfast', 'lunch', 'dinner'].includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Category must be breakfast, lunch, or dinner'
            });
        }

        // Verify restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant || !restaurant.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found or inactive'
            });
        }

        // Parse availableDate consistently with validation
        const [year, month, day] = availableDate.split('-').map(Number);
        const dateToStore = new Date(year, month - 1, day);
        
        const foodItem = await FoodItem.create({
            foodName: foodName.trim(),
            category,
            availableDate: dateToStore,
            description: description?.trim() || '',
            restaurantId,
            createdBy: req.user.id
        });

        const savedFoodItem = await FoodItem.findById(foodItem._id)
            .populate('restaurantId', 'restaurantName contactNo address googleMapLink')
            .populate('createdBy', 'name');

        res.status(201).json({
            success: true,
            message: 'Food item created successfully',
            data: savedFoodItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating food item'
        });
    }
};

// Update food item
export const updateFoodItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { foodName, category, availableDate, description } = req.body;

        // Validate category if provided
        if (category && !['breakfast', 'lunch', 'dinner'].includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Category must be breakfast, lunch, or dinner'
            });
        }

        // Parse availableDate consistently with validation if provided
        let updateData = {
            foodName: foodName?.trim(),
            category,
            description: description?.trim()
        };
        
        if (availableDate) {
            const [year, month, day] = availableDate.split('-').map(Number);
            updateData.availableDate = new Date(year, month - 1, day);
        }

        const foodItem = await FoodItem.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('restaurantId', 'restaurantName contactNo address googleMapLink').populate('createdBy', 'name');

        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Food item updated successfully',
            data: foodItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating food item'
        });
    }
};

// Delete food item (soft delete)
export const deleteFoodItem = async (req, res) => {
    try {
        const { id } = req.params;

        const foodItem = await FoodItem.findByIdAndUpdate(
            id,
            { isAvailable: false },
            { new: true }
        );

        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Food item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting food item'
        });
    }
};

// Get food items by date and category
export const getFoodItemsByDateAndCategory = async (req, res) => {
    try {
        const { date, category } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required'
            });
        }

        let filter = { isAvailable: true };

        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        filter.availableDate = {
            $gte: startDate,
            $lte: endDate
        };

        if (category) {
            filter.category = category;
        }

        const foodItems = await FoodItem.find(filter)
            .populate('restaurantId')
            .sort({ category: 1 });

        res.status(200).json({
            success: true,
            message: 'Food items retrieved successfully',
            data: foodItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving food items'
        });
    }
};
