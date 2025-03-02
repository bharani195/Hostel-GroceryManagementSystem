import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/users/login', { email, password });
      const token = response.data.token;

      localStorage.setItem('token', token);
      setToken(token);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userRole = decodedToken.role;

      alert('Login successful!');

    
      if (userRole === 'Admin') navigate('/admin-dashboard');
      else if (userRole === 'Caretaker') navigate('/caretaker-dashboard');
      else if (userRole === 'Warden') navigate('/warden-dashboard');
      else navigate('/404');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid credentials.');
    }
  };

  return (
    
    
    
    <div className="login-container">
      
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <div>
          <br></br>
          Forgot Password? <Link to="/reset-password">Click Here</Link>
        </div>
      </form>
    </div>
  );
  
    
};

export default Login;
