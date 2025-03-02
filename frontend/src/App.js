import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import GroceryRequestList from './components/GroceryRequestList';
import SubmitGroceryRequest from './components/SubmitGroceryRequest';
import AddStock from './components/AddStock';
import UpdateStock from './components/UpdateStock';
import StockList from './components/StockList';
import AdminHeader from './components/AdminHeader';
import CaretakerHeader from './components/CaretakerHeader';
import WardenHeader from './components/WardenHeader';
import AdminFooter from './components/AdminFooter';
import CaretakerFooter from './components/CaretakerFooter';
import WardenFooter from './components/WardenFooter';
import UpdatePassword from './components/UpdatePassword';
import ResetPassword from './components/ResetPassword';
import HomePage from './components/HomePage';
import AdminDashboard from './components/AdminDashboard';
import CaretakerDashboard from './components/CaretakerDashboard';
import WardenDashboard from './components/WardenDashboard';
import NotFound from './components/404';
import UsedApproval from './components/UsedApproval';
import UsedGroceryRequestForm from './components/UsedGroceryRequestForm';
import UserManagement from './components/UserManagement'; 

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setUserRole(null);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserRole(null);
  };

  const renderHeaderFooter = () => {
    if (!token) return { header: null };
    switch (userRole) {
      case 'Admin':
        return { header: <AdminHeader handleLogout={handleLogout} />, footer: <AdminFooter /> };
      case 'Caretaker':
        return { header: <CaretakerHeader handleLogout={handleLogout} />, footer: <CaretakerFooter /> };
      case 'Warden':
        return { header: <WardenHeader handleLogout={handleLogout} />, footer: <WardenFooter /> };
      default:
        return { header: null, footer: null };
    }
  };

  const { header } = renderHeaderFooter();

  return (
    <Router>
      {header}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {token && (
          <>
            {/* Admin Routes */}
            {userRole === 'Admin' && (
              <>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/register" element={<Register isAdmin={true} />} />
                <Route path="/grocery-request-list" element={<GroceryRequestList />} />
                <Route path="/stock-list" element={<StockList />} />
                <Route path="/used-approval" element={<UsedApproval role="Admin" />} />
                <Route path="/user-management" element={<UserManagement />} /> 
              </>
            )}

            {/* Caretaker Routes */}
            {userRole === 'Caretaker' && (
              <>
                <Route path="/caretaker-dashboard" element={<CaretakerDashboard />} />
                <Route path="/grocery-request-list" element={<GroceryRequestList />} />
                <Route path="/submit-grocery-request" element={<SubmitGroceryRequest />} />
                <Route path="/add-stock" element={<AddStock />} />
                <Route path="/update-stock" element={<UpdateStock />} />
                <Route path="/stock-list" element={<StockList />} />
                <Route path="/used-approval" element={<UsedApproval role="Caretaker" />} />
                <Route path="/used-grocery-request-form" element={<UsedGroceryRequestForm />} />
              </>
            )}

            {/* Warden Routes */}
            {userRole === 'Warden' && (
              <>
                <Route path="/warden-dashboard" element={<WardenDashboard />} />
                <Route path="/stock-list" element={<StockList />} />
                <Route path="/used-approval" element={<UsedApproval role="Warden" />} />
                <Route path="/grocery-request-list" element={<GroceryRequestList />} />
              </>
            )}

          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
