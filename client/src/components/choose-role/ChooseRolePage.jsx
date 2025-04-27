import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseRolePage = () => {
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/set-role', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ role })
      });

      if (response.ok) {
        navigate('/pending-approval');
      } else {
        alert('Role selection error');
      }
    } catch (error) {
      console.error('Error submitting role:', error);
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
