import React from 'react';
import { Link } from 'react-router-dom';
import './StudentHeader.css';

const StudentHeader = ({ handleLogout }) => {
  return (
    <header className="student-header">
      <h1>Student Portal</h1>
      <nav>
        <ul>
          <li><Link to="/meals">View Meals</Link></li>
          <li><Link to="/feedback/provide">Post Feedback</Link></li>
          <li><Link to="/feedback/my-feedback">Feedback History</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default StudentHeader;
