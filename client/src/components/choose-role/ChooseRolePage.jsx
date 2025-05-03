import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const ChooseRolePage = () => {
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch('/auth/set-role', { role });
      navigate('/pending-approval');
    } catch (error) {
      console.error('Error submitting role:', error);
      alert('Role selection error');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>Choose your role</h1>
      <form onSubmit={handleSubmit}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="admin">Leader</option>
        </select>
        <br />
        <button type="submit" style={{ marginTop: '2rem' }}>
          Confirm selection
        </button>
      </form>
    </div>
  );
};

export default ChooseRolePage;
