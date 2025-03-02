const express = require('express');
const Meal = require('../models/meals');
const { protect } = require('../middleware/authMiddleware'); // Protect middleware
const router = express.Router();

// Add or Update Meals
// Add a New Meal
router.post('/', protect(['Warden']), async (req, res) => {
  const { day, mealType, dishes, effectiveDate } = req.body;

  if (!day || !mealType || !dishes || !effectiveDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newMeal = new Meal({
      day,
      mealType,
      dishes,
      effectiveDate,
      createdBy: req.user.id, // Add warden ID from token
    });
    await newMeal.save();
    res.status(201).json({ message: 'Meal added successfully!', meal: newMeal });
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).json({ message: 'Server error while adding meal', error });
  }
});

// Update an Existing Meal
router.put('/:id', protect(['Warden']), async (req, res) => {
  const { day, mealType, dishes, effectiveDate } = req.body;
  console.log('Meal ID:', req.params.id);
  console.log('Request Body:', req.body);
  if (!day || !mealType || !dishes || !effectiveDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      { day, mealType, dishes, effectiveDate, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedMeal) {
      console.log('Meal not found.');

      return res.status(404).json({ message: 'Meal not found.' });
    }

    res.status(200).json({ message: 'Meal updated successfully!', meal: updatedMeal });
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ message: 'Server error while updating meal', error });
  }
});

// Fetch Meals
router.get('/', protect(['Admin', 'Warden', 'Caretaker']), async (req, res) => {
  const { day, effectiveDate } = req.query;

  try {
    const filter = {};
    if (day) filter.day = day;
    if (effectiveDate) filter.effectiveDate = new Date(effectiveDate);

    const meals = await Meal.find(filter).populate('createdBy', 'username email');
    res.status(200).json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Error fetching meals', error });
  }
});

// Delete a Meal
router.delete('/:id', protect(['Caretaker']), async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found.' });
    }
    res.status(200).json({ message: 'Meal deleted successfully!' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ message: 'Server error while deleting meal', error });
  }
});

module.exports = router;
