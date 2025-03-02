import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockList.css';

const UpdateStock = () => {
  const [stocks, setStocks] = useState([]); // Always initialize as an empty array
  const [editingStock, setEditingStock] = useState(null);
  const [updatedItemName, setUpdatedItemName] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [updatedUnit, setUpdatedUnit] = useState('');
  const [newStock, setNewStock] = useState({ itemName: '', quantity: '', unit: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const unitOptions = ['kg', 'g', 'liters', 'ml'];

  let counter = 1;

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/stocks');
      const stockData = response.data?.data || []; // Safely access data
      if (Array.isArray(stockData)) {
        setStocks(stockData);
      } else {
        setStocks([]); // Default to empty array if response is invalid
        console.error('Unexpected response format:', response.data);
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError(err.response?.data?.message || 'Failed to load stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock item?')) return;

    setLoading(true);
    setError('');
    try {
      await axios.delete(`http://localhost:3001/api/stocks/delete/${id}`);
      setStocks((prevStocks) => prevStocks.filter((stock) => stock._id !== id));
      setSuccessMessage('Stock deleted successfully.');
    } catch (err) {
      console.error('Error deleting stock:', err);
      setError(err.response?.data?.message || 'Failed to delete stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stock) => {
    setEditingStock(stock._id);
    setUpdatedItemName(stock.itemName);
    setUpdatedQuantity(stock.quantity);
    setUpdatedUnit(stock.unit);
  };

  const handleCancelEdit = () => {
    setEditingStock(null);
    setUpdatedItemName('');
    setUpdatedQuantity('');
    setUpdatedUnit('');
    setError('');
    setSuccessMessage('');
  };

  const handleUpdate = async (id) => {
    if (!updatedItemName.trim() || isNaN(updatedQuantity) || updatedQuantity <= 0 || !updatedUnit.trim()) {
      setError('Please provide valid inputs for all fields.');
      return;
    }
    if (!unitOptions.includes(updatedUnit.toLowerCase())) {
      setError(`Invalid unit. Allowed units are: ${unitOptions.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.put(`http://localhost:3001/api/stocks/update/${id}`, {
        itemName: updatedItemName,
        quantity: Number(updatedQuantity),
        unit: updatedUnit,
      });
      setStocks((prevStocks) =>
        prevStocks.map((stock) => (stock._id === id ? response.data.data : stock))
      );
      setSuccessMessage('Stock updated successfully!');
      handleCancelEdit();
    } catch (err) {
      console.error('Error updating stock:', err);
      setError(err.response?.data?.message || 'Failed to update stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    const { itemName, quantity, unit } = newStock;

    if (!itemName.trim() || isNaN(quantity) || quantity <= 0 || !unit.trim()) {
      setError('Please provide valid inputs for all fields.');
      return;
    }
    if (!unitOptions.includes(unit.toLowerCase())) {
      setError(`Invalid unit. Allowed units are: ${unitOptions.join(', ')}`);
      return;
    }

    const existingStock = stocks.find(
      (stock) =>
        stock.itemName.toLowerCase() === itemName.toLowerCase() &&
        stock.unit.toLowerCase() === unit.toLowerCase()
    );
    if (existingStock) {
      setError('Stock already exists. Please update the existing stock.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/stocks/add', {
        itemName,
        quantity: Number(quantity),
        unit,
      });
      setStocks((prevStocks) => [...prevStocks, response.data.data]);
      setSuccessMessage('Stock added successfully!');
      setNewStock({ itemName: '', quantity: '', unit: '' });
    } catch (err) {
      console.error('Error adding stock:', err);
      setError(err.response?.data?.message || 'Failed to add stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-list-container">
      <h1>Update Stock</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form className="add-stock-form" onSubmit={handleAddStock}>
        <h3>Add New Stock</h3>
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            value={newStock.itemName}
            onChange={(e) => setNewStock({ ...newStock, itemName: e.target.value })}
            placeholder="Enter item name"
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={newStock.quantity}
            onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
            placeholder="Enter quantity"
            required
          />
        </div>
        <div className="form-group">
          <label>Unit</label>
          <select
            value={newStock.unit}
            onChange={(e) => setNewStock({ ...newStock, unit: e.target.value })}
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
        <button type="submit" className="add-stock-btn">
          Add Stock
        </button>
      </form>

      {loading && <p>Loading...</p>}

      {stocks.length > 0 ? (
        <table className="stock-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock._id}>
                <td>{counter++}</td>
                <td>
                  {editingStock === stock._id ? (
                    <input
                      type="text"
                      value={updatedItemName}
                      onChange={(e) => setUpdatedItemName(e.target.value)}
                    />
                  ) : (
                    stock.itemName
                  )}
                </td>
                <td>
                  {editingStock === stock._id ? (
                    <input
                      type="number"
                      value={updatedQuantity}
                      onChange={(e) => setUpdatedQuantity(e.target.value)}
                    />
                  ) : (
                    stock.quantity
                  )}
                </td>
                <td>
                  {editingStock === stock._id ? (
                    <select
                      value={updatedUnit}
                      onChange={(e) => setUpdatedUnit(e.target.value)}
                    >
                      <option value="">Select Unit</option>
                      {unitOptions.map((unit, index) => (
                        <option key={index} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  ) : (
                    stock.unit
                  )}
                </td>
                <td>
                  {editingStock === stock._id ? (
                    <>
                      <button onClick={() => handleUpdate(stock._id)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(stock)}>Edit</button>
                      <button onClick={() => handleDelete(stock._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No stocks available.</p>
      )}
    </div>
  );
};

export default UpdateStock;
