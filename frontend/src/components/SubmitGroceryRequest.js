import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubmitGroceryRequest.css';

const SubmitGroceryRequest = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const unitOptions = ['kg', 'g', 'liters', 'ml', 'pcs'];

  // Assume a default "Caretaker" role for submission
  const [submittedBy, setSubmittedBy] = useState('Caretaker');
  const token = localStorage.getItem('token'); // Use token for API headers if available

  // Function to add an item to the list
  const handleAddItem = () => {
    setError('');
    if (!itemName.trim()) {
      setError('Item Name is required.');
      return;
    }
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      setError('Quantity must be a valid number greater than 0.');
      return;
    }
    if (!unit || !unitOptions.includes(unit)) {
      setError('Please select a valid unit.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    // Check for duplicate items
    if (items.some((item) => item.itemName.toLowerCase() === itemName.toLowerCase())) {
      setError('This item already exists in the list.');
      return;
    }

    // Add new item
    const newItem = { itemName, quantity: Number(quantity), unit, description };
    setItems([...items, newItem]);

    // Reset fields
    setItemName('');
    setQuantity('');
    setUnit('');
    setDescription('');
  };

  // Function to delete an item from the list
  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Function to submit the grocery request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (items.length === 0) {
      setError('Please add at least one item before submitting.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3001/api/grocery-requests/submit',
        { items, submittedBy },
        {
          headers: { Authorization: `Bearer ${token}` }, // Token included for backend
        }
      );
      setSuccessMessage(response.data.message || 'Request submitted successfully!');
      setItems([]); // Clear the items list
    } catch (err) {
      console.error('Submission Error:', err);
      setError(err.response?.data?.message || 'Failed to submit the request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Submit Grocery Request</h2>
      <form className="grocery-request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            placeholder="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="">Select Unit</option>
            {unitOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter item description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <button type="button" className="add-item-btn" onClick={handleAddItem}>
          Add Item
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <h3>Items to Submit</h3>
        {items.length === 0 ? (
          <p>No items added yet.</p>
        ) : (
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {index + 1}. {item.itemName} - {item.quantity} {item.unit} ({item.description})
                <button
                  type="button"
                  style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}
                  onClick={() => handleDeleteItem(index)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="form-group">
          <label>Submitted By</label>
          <input type="text" value={submittedBy} readOnly />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>

        {successMessage && <p style={{ color: 'green', marginTop: '20px' }}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default SubmitGroceryRequest;
