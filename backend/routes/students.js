const express = require('express');
const Student = require('../models/Student');
const { protect } = require('../middleware/authMiddleware'); // Middleware for authentication
const router = express.Router();

// Create a new student
router.post('/', protect(['Admin']), async (req, res) => {
  const { name, email, roomNumber, department, hostel, batch } = req.body;

  // Validate required fields
  if (!name || !email || !roomNumber || !department || !hostel || !batch) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new student record
    const student = new Student({
      name,
      email,
      roomNumber,
      department,
      hostel,
      batch,
      password: email // Default password is the email
    });

    await student.save();
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student', error });
  }
});

// Get all students
router.get('/', protect(['Admin', 'Warden', 'Caretaker']), async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  }
});

// Update student details
router.put('/:id', protect(['Admin']), async (req, res) => {
  const { name, email, rollNumber, department, hostel, roomNumber, batch } = req.body;

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update only the provided fields
    if (name) student.name = name;
    if (email) student.email = email;
    if (rollNumber) student.rollNumber = rollNumber;
    if (department) student.department = department;
    if (hostel) student.hostel = hostel;
    if (roomNumber) student.roomNumber = roomNumber;
    if (batch) student.batch = batch;

    await student.save();
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error });
  }
});

// Delete a student
router.delete('/:id', protect(['Admin']), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error });
  }
});

module.exports = router;