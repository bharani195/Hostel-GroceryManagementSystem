import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './StockList.css';

const StockList = () => {
  const [stocks, setStocks] = useState([]); // Full stock data
  const [searchQuery, setSearchQuery] = useState(''); // Search input
  const [filteredStocks, setFilteredStocks] = useState([]); // Filtered stocks for display
  const [error, setError] = useState(null); // Handle API errors

  useEffect(() => {
    // Fetching data from the API
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/stocks');
        const data = response.data?.data || []; // Extract "data" field from response
        if (Array.isArray(data)) {
          setStocks(data);
          setFilteredStocks(data);
        } else {
          setStocks([]);
          setFilteredStocks([]);
          console.error('Unexpected response format:', response.data);
        }
      } catch (err) {
        console.error('Error fetching stocks:', err);
        setError('Failed to fetch stock data. Please try again later.');
        setStocks([]);
        setFilteredStocks([]);
      }
    };

    fetchStocks();
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter stocks based on the search query
    const filtered = stocks.filter((stock) =>
      stock.itemName.toLowerCase().includes(query)
    );
    setFilteredStocks(filtered);
  };

  // Function to download the stock list as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Stock List', 14, 20); // Title

    // Add table
    doc.autoTable({
      startY: 30,
      head: [['S.No', 'Item Name', 'Quantity', 'Unit']],
      body: filteredStocks.map((stock, index) => [
        index + 1,
        stock.itemName,
        stock.quantity,
        stock.unit,
      ]),
    });

    doc.save('stock_list.pdf'); // Save the PDF
  };

  return (
    <div className="stock-list-container">
      <h1>Stock List</h1>

      {/* Error Handling */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by item name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Download Button */}
      <div className="download-container">
        <button onClick={downloadPDF} className="download-btn">
          Download as PDF
        </button>
      </div>

      {/* Stock Table */}
      {filteredStocks.length > 0 ? (
        <table className="stock-table">
          <thead>
            <tr>
              <th className='cls-s.no w-2'>S.No</th>
              <th>Item Name</th>
              <th>Quantity</th>
              {/* <th>Unit</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock, index) => (
              <tr key={stock._id || index}>
                <td className='w-2'>{index + 1}</td>
                <td>{stock.itemName}</td>
                <td>{stock.quantity} {stock.unit}</td>
                {/* <td>{stock.unit}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No stocks available.</p>
      )}
    </div>
  );
};

export default StockList;
