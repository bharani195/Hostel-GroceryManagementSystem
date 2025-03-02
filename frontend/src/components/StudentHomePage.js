import React from 'react';
import './StudentHomePage.css';

const StudentHomePage = () => {
  return (
    <div className="student-homepage">
      <h2>Welcome to the Student Portal</h2>
      <p>Select an option from the menu to get started:</p>
      <ul>
        <li><strong>View Meals</strong>: Check out the weekly meal plan.</li>
        <li><strong>Post Feedback</strong>: Share your thoughts on meals.</li>
        <li><strong>Feedback History</strong>: Review your past feedback.</li>
      </ul>
    </div>
  );
};

export default StudentHomePage;
