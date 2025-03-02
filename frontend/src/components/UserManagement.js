import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search, role]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/users', {
        params: {
          search,
          role,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const currentUserId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;

    if (id === currentUserId) {
      alert('You cannot delete your own account.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('User deleted successfully.');
      fetchUsers();
    } catch (err) {
      if (err.response?.status === 404) {
        alert('User not found. It might have been deleted already.');
      } else if (err.response?.status === 403) {
        alert('You are not authorized to perform this action.');
      } else {
        alert(err.response?.data?.message || 'Error deleting user.');
      }
      console.error('Error details:', err);
    }
  };

  return (
    <div className="user-management-container">
      <h2>User Management</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="Caretaker">Caretaker</option>
          <option value="Warden">Warden</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="card-container">
          {users.map((user) => (
            <div className="user-card" key={user._id}>
              <div className="card-header">
                <h3>{user.username}</h3>
                <span className={`badge-${user.role.toLowerCase()}`}>{user.role}</span>
              </div>
              <p>{user.email}</p>
              <button onClick={() => handleDelete(user._id)} className="delete-btn">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
