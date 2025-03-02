import React from 'react';
import './GenericHeader.css'; 
import Logo from './Images/Logo.jpeg'

const GenericHeader = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>
      <div className="nav-container">
        <h2>KONGU HOSTELS</h2>
        <nav>
          <ul>
            <li><a href="/login">Login</a></li>            
          </ul>
        </nav>
      </div>
    </header>
  );
  
};

export default GenericHeader;


