import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RejectReasonModal from './RejectReasonModal';
import './UsedApproval.css';

const UsedApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userRole = decodedToken.role;
  const userId = decodedToken?.id || decodedToken?._id;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/api/used-grocery-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data || [];
        setRequests(data.reverse()); // Reverse sorting to show latest first
        setFilteredRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        alert('Failed to fetch requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filterByStatus = (status) => {
    setFilterStatus(status);
    if (status === 'All') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((req) => req.status === status));
    }
  };

  const approveAllPending = async () => {
    const pendingRequests = requests.filter((req) => req.status === 'Pending');
    if (pendingRequests.length === 0) {
      alert('No pending requests to approve.');
      return;
    }

    try {
      await Promise.all(
        pendingRequests.map((req) =>
          axios.put(
            `http://localhost:3001/api/used-grocery-requests/warden/${req._id}`,
            { status: 'Approved', approvedByWarden: userId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );

      const updatedRequests = requests.map((req) =>
        req.status === 'Pending'
          ? { ...req, status: 'Approved', approvedByWarden: userId }
          : req
      );
      setRequests(updatedRequests);
      filterByStatus(filterStatus); // Reapply the filter
      alert('All pending requests approved successfully!');
    } catch (error) {
      console.error('Error approving all requests:', error);
      alert('Failed to approve all pending requests.');
    }
  };

  const handleAction = async (id, actionType, role) => {
    const endpoint =
      role === 'Warden'
        ? `http://localhost:3001/api/used-grocery-requests/warden/${id}`
        : `http://localhost:3001/api/used-grocery-requests/admin/${id}`;
    const approverField = role === 'Warden' ? 'approvedByWarden' : 'approvedByAdmin';

    try {
      await axios.put(
        endpoint,
        { status: actionType, [approverField]: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedRequests = requests.map((req) =>
        req._id === id
          ? {
              ...req,
              status: actionType,
              ...(role === 'Warden' && { approvedByWarden: userId }),
              ...(role === 'Admin' && { approvedByAdmin: userId }),
            }
          : req
      );
      setRequests(updatedRequests);
      filterByStatus(filterStatus); // Reapply the filter
      alert(`Request ${actionType.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(`Error ${actionType.toLowerCase()} request:`, error);
      alert(`Failed to ${actionType.toLowerCase()} request.`);
    }
  };

  const handleReject = (id) => {
    setSelectedRequestId(id);
    setModalVisible(true);
  };

  const submitRejectionReason = async (reason) => {
    try {
      const endpoint =
        userRole === 'Warden'
          ? `http://localhost:3001/api/used-grocery-requests/warden/${selectedRequestId}/reject`
          : `http://localhost:3001/api/used-grocery-requests/admin/${selectedRequestId}/reject`;

      await axios.put(
        endpoint,
        { rejectionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Request rejected successfully.');
      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequestId
            ? { ...req, status: 'Rejected', rejectionReason: reason }
            : req
        )
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject the request.');
    } finally {
      setModalVisible(false);
      setSelectedRequestId(null);
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
    <div className="used-approval-container">
      <h2>Used Grocery Requests</h2>

      {loading && <p>Loading requests...</p>}

      <div className="filter-container">
        <button onClick={() => filterByStatus('All')} className={filterStatus === 'All' ? 'active' : ''}>
          All
        </button>
        <button onClick={() => filterByStatus('Pending')} className={filterStatus === 'Pending' ? 'active' : ''}>
          Pending
        </button>
        <button onClick={() => filterByStatus('Approved')} className={filterStatus === 'Approved' ? 'active' : ''}>
          Approved
        </button>
        {userRole === 'Warden' && (
          <button onClick={approveAllPending} className="approve-all-btn">
            Approve All Pending
          </button>
        )}
      </div>

      <table className="used-approval-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Warden Approval</th>
            <th>Admin Approval</th>
            {userRole !== 'Caretaker' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request, index) => (
              request.items && request.items.length > 0 ? (
                request.items.map((item, itemIndex) => (
                  <tr key={`${request._id}-${itemIndex}`}>
                    {itemIndex === 0 && (
                      <>
                        <td rowSpan={request.items.length}>{index + 1}</td>
                        <td rowSpan={request.items.length}>{formatDate(request.submittedAt)}</td>
                        <td>{item.itemName || 'N/A'}</td>
                       <td>{`${item.quantity || 'N/A'} ${item.unit || ''}`}</td>
                        <td
                          rowSpan={request.items.length}
                          style={{
                            color: request.approvedByWarden
                              ? 'green'
                              : request.status === 'Rejected'
                              ? 'red'
                              : 'orange',
                          }}
                        >
                          {request.approvedByWarden ? 'Approved' : request.status || 'Pending'}
                        </td>
                        <td
                          rowSpan={request.items.length}
                          style={{
                            color: request.approvedByAdmin ? 'green' : 'orange',
                          }}
                        >
                          {request.approvedByAdmin ? 'Approved' : 'Pending'}
                        </td>
                        {userRole !== 'Caretaker' && (
                          <td rowSpan={request.items.length}>
                            {userRole === 'Warden' && request.status === 'Pending' && (
                              <>
                                <button
                                  className="approve-btn"
                                  onClick={() => handleAction(request._id, 'Approved', 'Warden')}
                                >
                                  Approve
                                </button>
                                <button
                                  className="reject-btn"
                                  onClick={() => handleReject(request._id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {userRole === 'Admin' &&
                              request.approvedByWarden &&
                              !request.approvedByAdmin && (
                                <>
                                  <button
                                    className="approve-btn"
                                    onClick={() => handleAction(request._id, 'Approved', 'Admin')}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="reject-btn"
                                    onClick={() => handleReject(request._id)}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                          </td>
                        )}
                      </>
                    )}
                    
                  </tr>
                ))
              ) : (
                <tr key={request._id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(request.submittedAt)}</td>
                  <td>{request.itemName || 'N/A'}</td>
                  <td>{`${request.requestedQuantity || 'N/A'} ${request.unit || ''}`}</td>
                  <td
                    style={{
                      color: request.approvedByWarden
                        ? 'green'
                        : request.status === 'Rejected'
                        ? 'red'
                        : 'orange',
                    }}
                  >
                    {request.approvedByWarden ? 'Approved' : request.status || 'Pending'}
                  </td>
                  <td
                    style={{
                      color: request.approvedByAdmin ? 'green' : 'orange',
                    }}
                  >
                    {request.approvedByAdmin ? 'Approved' : 'Pending'}
                  </td>
                  {userRole !== 'Caretaker' && (
                    <td>
                      {userRole === 'Warden' && request.status === 'Pending' && (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() => handleAction(request._id, 'Approved', 'Warden')}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleReject(request._id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {userRole === 'Admin' &&
                        request.approvedByWarden &&
                        !request.approvedByAdmin && (
                          <>
                            <button
                              className="approve-btn"
                              onClick={() => handleAction(request._id, 'Approved', 'Admin')}
                            >
                              Approve
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleReject(request._id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                    </td>
                  )}
                </tr>
              )
            ))
          ) : (
            <tr>
              <td colSpan={userRole !== 'Caretaker' ? 7 : 6}>No requests found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <RejectReasonModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={submitRejectionReason}
      />
    </div>
  );
};

export default UsedApproval;
