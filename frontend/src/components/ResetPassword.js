import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/users/reset-password', { email }); // Updated endpoint
      setMessage('Password reset link has been sent to your email!');
    } catch (error) {
      setMessage('Error sending password reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <h2 className="reset-heading">Reset Password</h2>
      <form onSubmit={handleResetPassword} className="reset-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="reset-input"
        />
        <button type="submit" disabled={loading} className="reset-button">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      {message && <p className="reset-message">{message}</p>}
    </div>
  );
};

export default ResetPassword;
