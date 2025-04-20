import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
          credentials: 'include',
        });

        if (!response.ok) {
          navigate('/');
        }
      } catch (error) {
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/api/auth/logout';
  };

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '5rem'
    }}>
      <h1>Welcome to the Dashboard!</h1>
      <p>You have successfully logged in via Google.</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: '#ff6600',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}
      >
        LOGOUT
      </button>
    </div>
  );
};

export default Dashboard;
