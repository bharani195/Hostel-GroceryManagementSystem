const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  itemName: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: [0, 'Quantity cannot be negative.'] 
  },
  unit: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true }); // Automatically add createdAt and updatedAt

// Ensure itemName and unit combination is unique
stockSchema.index({ itemName: 1, unit: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
