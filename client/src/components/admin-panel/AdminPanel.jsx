import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './AdminPanel.module.css';

const roleLabels = {
  admin: 'Admin (Leader)',
  designer: 'Designer',
  employee: 'Employee',
};

const AdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    fetchPendingUsers();
    fetchRoles();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const { data } = await axios.get('/admin/pending-users');
      setPendingUsers(data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get('/admin/roles');
      setAvailableRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleRoleChange = (userId, role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const handleApprove = async (userId) => {
    const user = pendingUsers.find(u => u._id === userId);
    const selectedRole = selectedRoles[userId] || user.role;

    if (!selectedRole) {
      alert('Please select a role before approving!');
      return;
    }

    try {
      await axios.patch(`/admin/users/${userId}/approve`, { role: selectedRole, });
      fetchPendingUsers();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.patch(`/admin/users/${userId}/reject`);
      fetchPendingUsers();
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
                    value={selectedRoles[user._id] || user.role || ''}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={styles['admin-panel__select']}
                  >
                    <option value="">Select Role</option>

                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {roleLabels[role] || role}
                      </option>
                    ))}
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
