import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import AdminPanelView from './AdminPanelView';

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
      const { data } = await axios.get(
        '/admin/pending-users'
      );
      setPendingUsers(data);
    } catch (err) {
      console.error(
        'Error fetching pending users:',
        err
      );
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get('/admin/roles');
      setAvailableRoles(data);
    } catch (err) {
      console.error(
        'Error fetching roles:',
        err
      );
    }
  };

  const handleRoleChange = (userId, role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const handleApprove = async (userId) => {
    const user = pendingUsers.find(
      (u) => u._id === userId
    );

    const selectedRole =
      selectedRoles[userId] || user?.role;

    if (!selectedRole) {
      alert(
        'Please select a role before approving!'
      );
      return;
    }

    try {
      await axios.patch(
        `/admin/users/${userId}/approve`,
        { role: selectedRole }
      );
      fetchPendingUsers();
    } catch (err) {
      console.error(
        'Error approving user:',
        err
      );
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.patch(
        `/admin/users/${userId}/reject`
      );
      fetchPendingUsers();
    } catch (err) {
      console.error(
        'Error rejecting user:',
        err
      );
    }
  };

  return (
    <AdminPanelView
      pendingUsers={pendingUsers}
      availableRoles={availableRoles}
      selectedRoles={selectedRoles}
      onRoleChange={handleRoleChange}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
};

export default AdminPanel;
