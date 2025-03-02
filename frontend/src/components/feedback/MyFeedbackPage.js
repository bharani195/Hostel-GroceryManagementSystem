import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyFeedbackPage.css';

const MyFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedback/mine', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        alert('Failed to load feedbacks.');
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="my-feedback-page">
      <h2>Feedback History</h2>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Meal Type</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb._id}>
              <td>{new Date(fb.date).toLocaleDateString()}</td>
              <td>{fb.mealType}</td>
              <td>{fb.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyFeedbackPage;
