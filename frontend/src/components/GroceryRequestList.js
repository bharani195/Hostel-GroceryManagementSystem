import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'jspdf-autotable';
import './GroceryRequestList.css';

const GroceryRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  let counter = 1;

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/grocery-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
      setFilteredRequests(response.data);
    } catch (error) {
      console.error('Error fetching grocery requests:', error);
      alert('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    if (!selectedDate) {
      alert('Please select a date for filtering.');
      return;
    }

    const filtered = requests.filter((request) => {
      const requestDate = new Date(request.createdAt).toLocaleDateString();
      const selected = new Date(selectedDate).toLocaleDateString();
      return requestDate === selected;
    });

    setFilteredRequests(filtered);
  };

  const handleAction = async (id, actionType, role) => {
    const endpoint =
      role === 'Warden'
        ? `http://localhost:3001/api/grocery-requests/warden/${id}`
        : `http://localhost:3001/api/grocery-requests/admin/${id}`;

    try {
      await axios.put(
        endpoint,
        { approvalStatus: actionType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the state to reflect the approved/rejected request
      const updatedRequests = requests.map((request) => {
        if (request._id === id) {
          if (role === 'Warden') {
            request.wardenApproval = actionType;
          } else {
            request.adminApproval = actionType;
          }
        }
        return request;
      });
      setRequests(updatedRequests);
      setFilteredRequests(updatedRequests);
      alert(`Request ${actionType.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(`Error ${actionType.toLowerCase()} request:`, error);
      alert(`Failed to ${actionType.toLowerCase()} the request. Please try again.`);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="grocery-requests-container">
      <h2>Grocery Requests</h2>

      {/* Loading Indicator */}
      {loading && <p>Loading requests...</p>}

      {/* Date Filter */}
      <div className="date-filter-container">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="Select Date"
        />
        <button onClick={handleDateFilter} className="filter-btn">
          Filter
        </button>
      </div>

      {/* Grocery Requests Table */}
      <table className="grocery-requests-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item Name</th>
            <th>Quantity</th>
            
            <th>Description</th> 
            <th>Date</th>
            <th>Warden Approval</th>
            <th>Admin Approval</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) =>
            request.items.map((item, index) => (
              <tr key={`${request._id}-${index}`}>
                <td>{counter++}</td>
                <td>{item.itemName}</td>
                <td>{item.quantity} {item.unit}</td>
               
                <td>{item.description || 'N/A'}</td> {/* Display Description */}
                <td>{formatDate(request.createdAt)}</td>
                <td
                  style={{
                    color:
                      request.wardenApproval === 'Approved'
                        ? 'green'
                        : request.wardenApproval === 'Rejected'
                        ? 'red'
                        : 'orange',
                  }}
                >
                  {request.wardenApproval || 'Pending'}
                </td>
                <td
                  style={{
                    color:
                      request.adminApproval === 'Approved'
                        ? 'green'
                        : request.adminApproval === 'Rejected'
                        ? 'red'
                        : 'orange',
                  }}
                >
                  {request.adminApproval || 'Pending'}
                </td>
                <td>
                  {decodedToken.role === 'Warden' && request.wardenApproval === 'Pending' && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleAction(request._id, 'Approved', 'Warden')}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleAction(request._id, 'Rejected', 'Warden')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {decodedToken.role === 'Admin' &&
                    request.wardenApproval === 'Approved' &&
                    request.adminApproval === 'Pending' && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => handleAction(request._id, 'Approved', 'Admin')}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleAction(request._id, 'Rejected', 'Admin')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GroceryRequestList;
