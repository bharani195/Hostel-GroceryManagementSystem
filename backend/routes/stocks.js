const express = require('express');
const Stock = require('../models/Stock');
const router = express.Router();

// Add new stock (Caretaker)
router.post('/add', async (req, res) => {
  const { itemName, quantity, unit } = req.body;

  try {
    if (!itemName || !quantity || !unit) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const stockExists = await Stock.findOne({
      itemName: itemName.toLowerCase(),
      unit: unit.toLowerCase(),
    });

    if (stockExists) {
      return res.status(400).json({ success: false, message: 'Stock item with the same unit already exists.' });
    }

    const newStock = new Stock({
      itemName: itemName.toLowerCase(),
      quantity,
      unit: unit.toLowerCase(),
    });
    await newStock.save();

    res.status(201).json({
      success: true,
      message: 'Stock added successfully.',
      data: newStock,
    });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding stock.',
      error: error.message,
    });
  }
});

// Update existing stock (Caretaker)
router.put('/update/:id', async (req, res) => {
  const { itemName, quantity, unit } = req.body;

  try {
    const stockId = req.params.id;
    console.log('Stock ID:', stockId); // Debug log

    if (!mongoose.Types.ObjectId.isValid(stockId)) {
      return res.status(400).json({ success: false, message: 'Invalid Stock ID.' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found.' });
    }

    stock.itemName = itemName.toLowerCase();
    stock.quantity = quantity;
    stock.unit = unit.toLowerCase();
    stock.lastUpdated = Date.now();

    await stock.save();
    res.status(200).json({
      success: true,
      message: 'Stock updated successfully.',
      data: stock,
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stock.',
      error: error.message,
    });
  }
});


// Delete stock (Caretaker)
router.delete('/delete/:id', async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Stock deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting stock.',
      error: error.message,
    });
  }
});

// Get all stock items (Warden/Admin)
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ itemName: 1 });
    res.status(200).json({
      success: true,
      message: 'Stocks fetched successfully.',
      data: Array.isArray(stocks) ? stocks : [], // Ensure data is always an array
    });
  } catch (error) {
    console.error('Error fetching stock items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock items.',
      error: error.message,
      data: [], // Fallback to empty array on error
    });
  }
});

// Get stock by ID
router.get('/:id', async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Stock item fetched successfully.',
      data: stock,
    });
  } catch (error) {
    console.error('Error fetching stock item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock item.',
      error: error.message,
    });
  }
});

module.exports = router;
