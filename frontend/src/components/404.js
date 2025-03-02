import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      color: '#333',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{
        fontSize: '6rem',
        margin: '0',
        color: '#dc3545',
      }}>
        404
      </h1>
      <p style={{
        fontSize: '2rem',
        margin: '10px 0',
      }}>
        Oops! Page Not Found
      </p>
      <p style={{
        fontSize: '1rem',
        margin: '10px 0 20px',
        color: '#6c757d',
      }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" style={{
        padding: '10px 20px',
        fontSize: '1rem',
        textDecoration: 'none',
        color: '#fff',
        backgroundColor: '#007bff',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
      }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
