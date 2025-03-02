import React, { useState } from 'react';
import axios from 'axios';

const StockUpdateForm = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/stocks/update', {
      itemName,
      quantity,
      unit
    })
    .then(res => alert(res.data.message))
    .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
      <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
      <button type="submit">Update Stock</button>
    </form>
  );
};

export default StockUpdateForm;
