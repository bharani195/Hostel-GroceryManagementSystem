import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsedGroceryRequestForm.css';

const UsedGroceryForm = () => {
  const [stocks, setStocks] = useState([]);
  const [requests, setRequests] = useState([{ itemName: '', quantity: '', note: '' }]);
  const [availableStock, setAvailableStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const token = localStorage.getItem('token');
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : {};
  const submittedBy = decodedToken?.id || decodedToken?._id || 'Unknown';

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/stocks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success && Array.isArray(response.data.data)) {
        setStocks(response.data.data);
      } else {
        throw new Error('Unexpected stock data format.');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to load stock data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, value) => {
    const updatedRequests = [...requests];
    updatedRequests[index].itemName = value;

    const stockItem = stocks.find((stock) => stock.itemName === value);
    if (stockItem) {
      updatedRequests[index].unit = stockItem.unit; // Automatically set unit from stock
      setAvailableStock(stockItem.quantity);
    } else {
      setAvailableStock(null);
    }

    setRequests(updatedRequests);
  };

  const handleQuantityChange = (index, value) => {
    const updatedRequests = [...requests];
    updatedRequests[index].quantity = value;
    setRequests(updatedRequests);
  };

  const handleNoteChange = (index, value) => {
    const updatedRequests = [...requests];
    updatedRequests[index].note = value;
    setRequests(updatedRequests);
  };

  const handleAddRow = () => {
    setRequests([...requests, { itemName: '', quantity: '', note: '' }]);
  };

  const handleRemoveRow = (index) => {
    const updatedRequests = requests.filter((_, i) => i !== index);
    setRequests(updatedRequests);
  };

  const validateRequests = () => {
    for (const request of requests) {
      if (!request.itemName || !request.quantity) {
        setError('All fields are required.');
        return false;
      }
      const stockItem = stocks.find((stock) => stock.itemName === request.itemName);
      if (!stockItem || stockItem.quantity < request.quantity) {
        setError(`Insufficient stock available for ${request.itemName}.`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateRequests()) return;

    const confirmation = window.confirm('Are you sure you want to submit this request?');
    if (!confirmation) return;

    try {
      setLoading(true);

      const formattedRequests = requests.map(({ itemName, quantity, note }) => {
        const stockItem = stocks.find((stock) => stock.itemName === itemName);
        return {
          itemName: itemName.trim(),
          quantity: parseFloat(quantity),
          unit: stockItem.unit, // Use the unit from the stock
          note: note.trim(),
        };
      });

      const payload = { requests: formattedRequests, submittedBy };

      console.log('Submitting Payload:', payload);

      const response = await axios.post(
        'http://localhost:3001/api/used-grocery-requests/submit',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(response.data.message || 'Request submitted successfully!');
      setRequests([{ itemName: '', quantity: '', note: '' }]); // Reset form
      setError('');
    } catch (error) {
      console.error('Error submitting request:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="used-grocery-form-container">
      <h2>Submit Used Grocery Request</h2>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {requests.map((request, index) => (
        <div key={index} className="request-row">
          <select
            value={request.itemName}
            onChange={(e) => handleItemChange(index, e.target.value)}
          >
            <option value="">Select Item</option>
            {stocks.map((stock) => (
              <option key={stock._id} value={stock.itemName}>
                {stock.itemName} ({stock.quantity} available)
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={request.quantity}
            onChange={(e) => handleQuantityChange(index, e.target.value)}
          />

          <span className="unit-display">
            {stocks.find((stock) => stock.itemName === request.itemName)?.unit || ''}
          </span>

          <input
            type="text"
            placeholder="Note (Optional)"
            value={request.note}
            onChange={(e) => handleNoteChange(index, e.target.value)}
          />

          <button onClick={() => handleRemoveRow(index)} disabled={requests.length === 1}>
            Remove
          </button>
        </div>
      ))}

      <button onClick={handleAddRow}>Add Item</button>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {availableStock !== null && (
        <p className="stock-info">Available Stock: {availableStock}</p>
      )}
    </div>
  );
};

export default UsedGroceryForm;
