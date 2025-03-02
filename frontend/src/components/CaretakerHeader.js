import React from 'react';
import './CaretakerHeader.css';
import { useNavigate } from 'react-router-dom';

const CaretakerHeader = ({ handleLogout }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <header className="caretaker-header">
      <div className="caretaker-logo-container">
        <h1>Kongu Hostel</h1>
        <h1>Caretaker Dashboard</h1>
      </div>
      <nav className="nav-links">
        <a href="/grocery-request-list">Grocery Requests</a>
        <a href="/submit-grocery-request">Submit Grocery Request</a>
        <a href="/used-approval">Used Approval</a>
        <a href="/used-grocery-request-form">Submit Used Grocery Request</a> {/* New Link */}
        <a href="/stock-list">Stock List</a>
        <a href="/update-stock">Update Stock</a>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default CaretakerHeader;
