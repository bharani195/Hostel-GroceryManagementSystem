const express = require('express');
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Submit Feedback
router.post('/', protect(['Student']), async (req, res) => {
  const { mealType, feedback, date } = req.body;

  if (!mealType || !feedback || !date) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newFeedback = new Feedback({
      student: req.user.id,
      mealType,
      feedback,
      date,
    });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!', feedback: newFeedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback', error });
  }
});

// Get Feedback for Admin/Warden/Caretaker
router.get('/', protect(['Admin', 'Warden', 'Caretaker']), async (req, res) => {
  const { mealType, date, student } = req.query;

  try {
    const filter = {};
    if (mealType) filter.mealType = mealType;
    if (date) filter.date = new Date(date);
    if (student) filter.student = student;

    const feedbacks = await Feedback.find(filter).populate('student', 'name email');
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback', error });
  }
});

// Get Student's Own Feedback
router.get('/mine', protect(['Student']), async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.user.id });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback', error });
  }
});

module.exports = router;
