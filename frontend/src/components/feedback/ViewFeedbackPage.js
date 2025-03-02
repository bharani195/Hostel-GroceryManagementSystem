import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewFeedbackPage.css';

const ViewFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filters, setFilters] = useState({ mealType: '', date: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedback', {
          params: { ...filters },
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        alert('Failed to load feedbacks.');
      }
    };

    fetchFeedbacks();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="view-feedback-page">
      <h2>Feedbacks</h2>
      <div className="filters">
        <select name="mealType" onChange={handleFilterChange}>
          <option value="">All Meal Types</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
        <input
          type="date"
          name="date"
          onChange={handleFilterChange}
        />
      </div>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Meal Type</th>
            <th>Student</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb._id}>
              <td>{new Date(fb.date).toLocaleDateString()}</td>
              <td>{fb.mealType}</td>
              <td>{fb.student.name}</td>
              <td>{fb.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewFeedbackPage;
