import React, { useState } from 'react';
import axios from 'axios';
import './AddStock.css'; // Import the CSS for styling

const AddStock = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const unitOptions = ['kg', 'g', 'liters', 'ml'];

  const handleAddStock = async (e) => {
    e.preventDefault();

    // Input validation
    if (!itemName.trim()) {
      alert('Item name cannot be empty.');
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      alert('Quantity must be a positive number.');
      return;
    }
    if (!unitOptions.includes(unit.toLowerCase())) {
      alert(`Invalid unit. Allowed units are: ${unitOptions.join(', ')}`);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/stocks/add', {
        itemName,
        quantity: Number(quantity),
        unit,
      });
      alert(response.data.message || 'Stock added successfully!');
      // Reset input fields
      setItemName('');
      setQuantity('');
      setUnit('');
    } catch (error) {
      console.error('Error adding stock:', error);
      alert(
        error.response?.data?.message || 'Failed to add stock. Please try again.'
      );
    }
  };

  return (
    <div className="add-stock-container">
      <h2>Add Stock</h2>
      <form onSubmit={handleAddStock} className="add-stock-form">
        <div className="form-group">
          <label htmlFor="itemName">Item Name</label>
          <input
            id="itemName"
            type="text"
            placeholder="Enter Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="unit">Unit</label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select Unit</option>
            {unitOptions.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-btn">
          Add Stock
        </button>
      </form>
    </div>
  );
};

export default AddStock;
