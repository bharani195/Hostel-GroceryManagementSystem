// groceryRequest.js
const mongoose = require('mongoose');

const groceryRequestSchema = new mongoose.Schema({
  items: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  submittedBy: { type: String, required: true },
  wardenApproval: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  adminApproval: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  rejectionReason: { type: String, default: null }, // New field for rejection reason
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GroceryRequest', groceryRequestSchema);
