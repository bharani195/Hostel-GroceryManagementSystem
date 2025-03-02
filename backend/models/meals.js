const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., Monday
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner'], required: true },
  dishes: { type: [String], required: true }, // Array of dishes
  effectiveDate: { type: Date, required: true }, // Start date when the meal plan is valid
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Meal', mealSchema);
