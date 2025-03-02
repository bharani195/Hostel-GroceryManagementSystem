import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WardenHeader.css';

const WardenHeader = ({ handleLogout }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <header className="warden-header">
      <div className="warden-logo-container">
        <h1>Warden Dashboard</h1>
      </div>
      <nav className="nav-links">
        <a href="/grocery-request-list">Grocery Requests</a>
        <a href="/used-approval">Used Approval</a>
        <a href="/stock-list">Stock List</a>
        <a href="/meals">View Meals</a>
        <a href="/feedback">View Feedback</a>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default WardenHeader;
