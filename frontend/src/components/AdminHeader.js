import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = ({ handleLogout }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <header className="admin-header">
      <div className="admin-logo-container">
        <h1>Kongu Hostel</h1>
        <h1>Admin Dashboard</h1>
      </div>
      <nav className="nav-links">
        <a href="/register">Create User</a>
        <a href="/grocery-request-list">Grocery Requests</a>
        <a href="/used-approval">Used Approval</a>
        <a href="/stock-list">Stock List</a>
        <a href="/user-management">Manage Users</a>
        <a href="/" onClick={onLogout}>Logout</a>
      </nav>
    </header>
  );
};

export default AdminHeader;
