const express = require('express');
const UsedGroceryRequest = require('../models/UsedGroceryRequest');
const Stock = require('../models/Stock');
const router = express.Router();

// Submit a new used grocery request
router.post('/submit', async (req, res) => {
  try {
    const { requests, submittedBy } = req.body;

    if (!requests || !Array.isArray(requests) || requests.length === 0 || !submittedBy) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    for (const item of requests) {
      const { itemName, quantity, unit } = item;

      if (!itemName || !quantity || !unit) {
        return res
          .status(400)
          .json({ message: `Invalid request data for item: ${itemName || 'unknown'}` });
      }

      const stock = await Stock.findOne({ itemName: itemName.trim().toLowerCase() });
      if (!stock) {
        return res.status(400).json({ message: `Stock item not found: ${itemName}` });
      }

      if (stock.quantity < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${itemName}. Available: ${stock.quantity}`,
        });
      }
    }

    const formattedRequests = requests.map((item) => ({
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit,
      note: item.note || '',
    }));

    const newRequest = new UsedGroceryRequest({ items: formattedRequests, submittedBy });
    const savedRequest = await newRequest.save();

    return res.status(201).json({ message: 'Request submitted successfully.', data: savedRequest });
  } catch (error) {
    console.error('Error submitting request:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// Approve or Reject by Warden with Reason
router.put('/warden/:id', async (req, res) => {
  const { status, approvedByWarden, rejectionReason } = req.body;

  try {
    const id = req.params.id.trim();
    if (!status || !approvedByWarden) {
      return res.status(400).json({ message: 'Status and approver are required.' });
    }

    const request = await UsedGroceryRequest.findById(id);
    if (!request || request.status !== 'Pending') {
      return res.status(404).json({ message: 'Request not found or already processed.' });
    }

    request.status = status;
    request.approvedByWarden = approvedByWarden;
    if (status === 'Rejected' && rejectionReason) {
      request.rejectionReason = rejectionReason;
    }
    request.updatedAt = Date.now();

    await request.save();
    res.status(200).json({ message: `Request ${status.toLowerCase()} by Warden.`, data: request });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Error updating request.', error: error.message });
  }
});

// Final Approval or Rejection by Admin
router.put('/admin/:id', async (req, res) => {
  const { status, approvedByAdmin, rejectionReason } = req.body;

  try {
    const id = req.params.id.trim();
    if (!status || !approvedByAdmin) {
      return res.status(400).json({ message: 'Status and approver are required.' });
    }

    const request = await UsedGroceryRequest.findById(id);
    if (!request || request.status !== 'Approved') {
      return res.status(404).json({ message: 'Request not found or not approved by Warden.' });
    }

    if (status === 'Approved') {
      for (const item of request.items) {
        const stock = await Stock.findOne({ itemName: item.itemName });
        if (!stock || stock.quantity < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${item.itemName}` });
        }
        stock.quantity -= item.quantity;
        await stock.save();
      }
    } else if (status === 'Rejected' && rejectionReason) {
      request.rejectionReason = rejectionReason;
    }

    request.status = status;
    request.approvedByAdmin = approvedByAdmin;
    request.updatedAt = Date.now();

    await request.save();
    res.status(200).json({ message: `Request ${status.toLowerCase()} by Admin.`, data: request });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Error updating request.', error: error.message });
  }
});

// Fetch all requests
router.get('/', async (req, res) => {
  try {
    const requests = await UsedGroceryRequest.find({})
      .sort({ createdAt: -1 }) // Latest requests first
      .lean(); // Convert MongoDB documents to plain JavaScript objects

    // Normalize data for consistent structure
    const formattedRequests = requests.map((req) => {
      if (!req.items || req.items.length === 0) {
        return {
          ...req,
          items: [
            {
              itemName: req.itemName || 'N/A',
              quantity: req.requestedQuantity || 'N/A',
              unit: req.unit || 'N/A',
            },
          ],
        };
      }
      return req;
    });

    res.status(200).json({ message: 'Requests fetched successfully.', data: formattedRequests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Error fetching requests.', error: error.message });
  }
});

module.exports = router;