// RejectReasonModal.js
import React, { useState } from 'react';
import './RejectReasonModal.css';
const RejectReasonModal = ({ isVisible, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('Rejection reason is required.');
      return;
    }
    onSubmit(reason);
    setReason('');
  };

  if (!isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Reject Request</h3>
        <textarea
          placeholder="Enter reason for rejection"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RejectReasonModal;
