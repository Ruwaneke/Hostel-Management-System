import { Meal } from '../models/Meal.js';

// GET /api/meals — all users can view the weekly schedule
export const getMeals = async (req, res) => {
    try {
        const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const meals = await Meal.find({}).sort({ day: 1, mealType: 1 });

        // Group by day for easy frontend consumption
        const schedule = {};
        for (const day of DAYS_ORDER) {
            schedule[day] = meals.filter(m => m.day === day);
        }

        res.status(200).json({ success: true, meals, schedule });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/meals/:id
export const getMeal = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });
        res.status(200).json({ success: true, meal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/meals — admin only
export const createMeal = async (req, res) => {
    try {
        const { day, mealType, items, calories, serveTime } = req.body;
        const meal = await Meal.create({ day, mealType, items, calories, serveTime });
        res.status(201).json({ success: true, message: 'Meal created', meal });
    } catch (error) {
        const msg = error.code === 11000
            ? `A ${req.body.mealType} entry for ${req.body.day} already exists`
            : error.message;
        res.status(400).json({ success: false, message: msg });
    }
};

// PUT /api/meals/:id — admin only
export const updateMeal = async (req, res) => {
    try {
        const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });
        res.status(200).json({ success: true, message: 'Meal updated', meal });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/meals/:id — admin only
export const deleteMeal = async (req, res) => {
    try {
        const meal = await Meal.findByIdAndDelete(req.params.id);
        if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });
        res.status(200).json({ success: true, message: 'Meal deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};