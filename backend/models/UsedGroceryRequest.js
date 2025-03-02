const mongoose = require('mongoose');

const usedGroceryRequestSchema = new mongoose.Schema({
  items: [
    {
      itemName: { type: String, required: true }, // Item name
      quantity: { type: Number, required: true }, // Use 'quantity' instead of 'requestedQuantity'
      unit: { type: String, default: 'kg' }, // Unit of measurement
      note: { type: String, default: '' }, // Notes/Comments
    },
  ],
  submittedBy: { type: String, required: true }, // Caretaker name/ID
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }, // Request status
  approvedByWarden: { type: String, default: null }, // Warden who approved
  approvedByAdmin: { type: String, default: null }, // Admin who approved
  rejectionReason: { type: String, default: null }, // Reason for rejection
  submittedAt: { type: Date, default: Date.now }, // Submission timestamp
  updatedAt: { type: Date, default: Date.now }, // Last updated timestamp
});

module.exports = mongoose.model('UsedGroceryRequest', usedGroceryRequestSchema);