import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:6000/api/users/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserRole(response.data.role);
          setDashboardData(response.data.message);
        })
        .catch((error) => {
          console.error('Error fetching dashboard:', error);
        });
    }
  }, []);

  return (
    <div>
      {userRole === 'Caretaker' && (
        <div>
          <h2>Caretaker Dashboard</h2>
          <p>{dashboardData}</p>
          {/* Caretaker specific actions */}
          <AddStock />
          <UpdateStock />
          <SubmitGroceryRequest />
        </div>
      )}

      {userRole === 'Warden' && (
        <div>
          <h2>Warden Dashboard</h2>
          <p>{dashboardData}</p>
          {/* Warden specific actions */}
          <ApproveRequests />
          <StockList />
        </div>
      )}

      {userRole === 'Admin' && (
        <div>
          <h2>Admin Dashboard</h2>
          <p>{dashboardData}</p>
          {/* Admin specific actions */}
          <ApproveRequests />
          <ManageUsers />
          <StockList />
        </div>
      )}

      {userRole && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
};

// Logout functionality
const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/'; 
};

export default Dashboard;
