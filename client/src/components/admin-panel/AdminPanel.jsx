import React, { useEffect, useState } from 'react';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [roles, setRoles] = useState({});

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/pending-users', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data);
      } else {
        console.error('Error fetching pending users');
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const handleRoleChange = (userId, role) => {
    setRoles(prev => ({ ...prev, [userId]: role }));
  };

  const handleApprove = async (userId) => {
    const user = pendingUsers.find(u => u._id === userId);
    const selectedRole = roles[userId] || user.role;

    if (!selectedRole) {
      alert('Please select a role before approving!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: selectedRole })
      });

      if (response.ok) {
        fetchPendingUsers();
      } else {
        console.error('Error approving user');
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/reject`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        fetchPendingUsers();
      } else {
        console.error('Error rejecting user');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <div className={styles['admin-panel']}>
      <h2>Pending Users</h2>
      {pendingUsers.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <table className={styles['admin-panel__table']}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Select Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <select
                    value={roles[user._id] || user.role || ''}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={styles['admin-panel__select']}
                  >
                    <option value="">Select Role</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin (Leader)</option>
                  </select>
                </td>
                <td className={styles['admin-panel__button']}>
                  <button
                    onClick={() => handleApprove(user._id)}
                    className={styles['admin-panel__button-approve']}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(user._id)}
                    className={styles['admin-panel__button-reject']}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
