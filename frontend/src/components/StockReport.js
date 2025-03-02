import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockReport = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    axios.get('/api/stocks/report')
      .then(res => setStocks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Stock Report</h1>
      <ul>
        {stocks.map(stock => (
          <li key={stock._id}>{stock.itemName} - {stock.quantity} {stock.unit}</li>
        ))}
      </ul>
    </div>
  );
};

export default StockReport;
