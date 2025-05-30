import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MealsPage.css';

const MealsPage = ({ userRole }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [form, setForm] = useState({
    day: '',
    mealType: '',
    dishes: '',
    effectiveDate: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMeals();
  }, []);

  // Fetch meals from the server
  const fetchMeals = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/meals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
      alert('Failed to fetch meals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle meal editing
  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setForm({
      day: meal.day,
      mealType: meal.mealType,
      dishes: meal.dishes.join(', '),
      effectiveDate: new Date(meal.effectiveDate).toISOString().split('T')[0],
    });
  };

  // Handle meal update
  const handleUpdateMeal = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/meals',
        {
          ...form,
          dishes: form.dishes.split(',').map((dish) => dish.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
      fetchMeals();
      setEditingMeal(null);
      setForm({ day: '', mealType: '', dishes: '', effectiveDate: '' });
    } catch (error) {
      console.error('Error updating meal:', error);
      alert('Failed to update meal. Please try again.');
    }
  };

  return (
    <div className="meals-page">
      <h2>Meal Plan</h2>
      {loading && <p>Loading meals...</p>}
      {!loading && meals.length === 0 && <p>No meals found.</p>}

      <table className="meals-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Meal Type</th>
            <th>Dishes</th>
            <th>Effective Date</th>
            {userRole === 'Warden' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal._id}>
              <td>{meal.day}</td>
              <td>{meal.mealType}</td>
              <td>{meal.dishes.join(', ')}</td>
              <td>{new Date(meal.effectiveDate).toLocaleDateString()}</td>
              {userRole === 'Warden' && (
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditMeal(meal)}
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {editingMeal && (
        <div className="edit-modal">
          <h3>Edit Meal</h3>
          <label>
            Day:
            <input
              type="text"
              name="day"
              value={form.day}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Meal Type:
            <select
              name="mealType"
              value={form.mealType}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </label>
          <label>
            Dishes:
            <input
              type="text"
              name="dishes"
              value={form.dishes}
              onChange={handleInputChange}
              placeholder="Comma-separated"
            />
          </label>
          <label>
            Effective Date:
            <input
              type="date"
              name="effectiveDate"
              value={form.effectiveDate}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleUpdateMeal}>Save</button>
          <button onClick={() => setEditingMeal(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MealsPage;
