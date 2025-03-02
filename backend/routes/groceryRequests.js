const express = require('express');
const GroceryRequest = require('../models/groceryRequest');
const router = express.Router();

// Helper function: Validate approval status
const validateApprovalStatus = (status) => ['Approved', 'Rejected'].includes(status);

// Submit a new grocery request
router.post('/submit', async (req, res) => {
  const { items, submittedBy } = req.body;

  // Validate input
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Items must be a non-empty array.' });
  }

  if (!submittedBy) {
    return res.status(400).json({ message: 'SubmittedBy field is required.' });
  }

  // Validate individual item fields
  for (const item of items) {
    if (!item.itemName || typeof item.itemName !== 'string' || item.itemName.trim() === '') {
      return res.status(400).json({ message: 'Each item must have a valid "itemName".' });
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return res.status(400).json({ message: 'Each item must have a valid "quantity" greater than 0.' });
    }
    if (!item.unit || typeof item.unit !== 'string' || item.unit.trim() === '') {
      return res.status(400).json({ message: 'Each item must have a valid "unit".' });
    }
  }

  try {
    const newRequest = new GroceryRequest({ items, submittedBy });
    await newRequest.save();
    res.status(201).json({ message: 'Grocery request submitted successfully!' });
  } catch (error) {
    console.error('Error submitting grocery request:', error);
    res.status(500).json({ message: 'Error submitting grocery request', error });
  }
});

// View all grocery requests with filters
router.get('/', async (req, res) => {
  const { status } = req.query;

  try {
    let filter = {};
    if (status) {
      const statusFilters = {
        Pending: { wardenApproval: 'Pending', adminApproval: 'Pending' },
        'Approved by Warden': { wardenApproval: 'Approved', adminApproval: 'Pending' },
        'Approved by Admin': { adminApproval: 'Approved' },
        Rejected: {
          $or: [{ wardenApproval: 'Rejected' }, { adminApproval: 'Rejected' }],
        },
      };
      filter = statusFilters[status] || {};
    }
    const requests = await GroceryRequest.find(filter);
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});


// Warden rejects with reason
router.put('/warden/:id/reject', async (req, res) => {
  const { rejectionReason } = req.body;

  if (!rejectionReason || rejectionReason.trim() === '') {
    return res.status(400).json({ message: 'Rejection reason is required.' });
  }

  try {
    const request = await GroceryRequest.findById(req.params.id);
    if (!request || request.wardenApproval !== 'Pending') {
      return res.status(404).json({ message: 'Request not found or already processed.' });
    }

    request.wardenApproval = 'Rejected';
    request.rejectionReason = rejectionReason;
    await request.save();

    res.status(200).json({ message: 'Request rejected with reason.', request });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Error rejecting request', error });
  }
});

// Admin rejects with reason
router.put('/admin/:id/reject', async (req, res) => {
  const { rejectionReason } = req.body;

  if (!rejectionReason || rejectionReason.trim() === '') {
    return res.status(400).json({ message: 'Rejection reason is required.' });
  }

  try {
    const request = await GroceryRequest.findById(req.params.id);
    if (!request || request.wardenApproval !== 'Approved' || request.adminApproval !== 'Pending') {
      return res.status(404).json({ message: 'Request not found or cannot be rejected.' });
    }

    request.adminApproval = 'Rejected';
    request.rejectionReason = rejectionReason;
    await request.save();

    res.status(200).json({ message: 'Request rejected with reason.', request });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Error rejecting request', error });
  }
});


// Approve all pending requests
router.put('/approve-all', async (req, res) => {
  try {
    const result = await GroceryRequest.updateMany(
      { wardenApproval: 'Pending', adminApproval: 'Pending' }, // Filter for pending requests
      { $set: { wardenApproval: 'Approved', adminApproval: 'Approved' } } // Update approvals
    );

    res.status(200).json({ message: 'All pending requests approved!', result });
  } catch (error) {
    console.error('Error approving all requests:', error);
    res.status(500).json({ message: 'Failed to approve all requests', error });
  }
});

module.exports = router;
