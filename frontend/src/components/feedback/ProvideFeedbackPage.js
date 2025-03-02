import React, { useState } from 'react';
import axios from 'axios';
import './ProvideFeedbackPage.css';

const ProvideFeedbackPage = () => {
  const [mealType, setMealType] = useState('');
  const [feedback, setFeedback] = useState('');
  const [date, setDate] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/feedback',
        { mealType, feedback, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setMealType('');
      setFeedback('');
      setDate('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="provide-feedback-page">
      <h2>Post Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Meal Type:
          <select value={mealType} onChange={(e) => setMealType(e.target.value)} required>
            <option value="">Select</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </label>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Feedback:
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback..."
            required
          />
        </label>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default ProvideFeedbackPage;
