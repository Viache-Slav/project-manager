import React, { useEffect, useState } from 'react';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/approve/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      fetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/reject/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      fetchUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <div className={styles['admin-panel']}>
      <h2 className={styles['admin-panel__title']}>Pending Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className={styles['admin-panel__table']}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td className={styles['admin-panel__actions']}>
                  {u.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(u._id)}
                        className={styles['admin-panel__approve']}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(u._id)}
                        className={styles['admin-panel__reject']}
                      >
                        Reject
                      </button>
                    </>
                  )}
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
