import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
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

  if (!user) {
    return <p style={{ textAlign: 'center', marginTop: '5rem' }}>Loading...</p>;
  }

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '5rem'
    }}>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      {user.avatar && (
        <img
          src={user.avatar}
          alt="User avatar"
          style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '1rem' }}
        />
      )}

      <div>
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
    </div>
  );
};

export default Dashboard;
