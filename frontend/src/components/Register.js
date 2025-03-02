import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = ({ isAdmin }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: isAdmin ? '' : 'Student',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!form.username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!form.email.trim() || !/^[\w-.]+@[\w-]+\.+[\w-]{2,4}$/.test(form.email)) {
      setError('Valid email is required.');
      return;
    }
    if (isAdmin && !form.role) {
      setError('Please select a role.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/users/register',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('User registered successfully!');
      setForm({ username: '', email: '', role: isAdmin ? '' : 'Student' }); 
      if (isAdmin) {
        setTimeout(() => navigate('/admin/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setError(error.response?.data?.message || 'Error registering user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Create an Account</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
        {isAdmin && (
          <div className="input-group">
            <select
              name="role"
              value={form.role}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select Role</option>
              <option value="Caretaker">Caretaker</option>
              <option value="Warden">Warden</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        )}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {message && <p className="register-message success-message">{message}</p>}
      {error && <p className="register-message error-message">{error}</p>}
    </div>
  );
};

export default Register;
