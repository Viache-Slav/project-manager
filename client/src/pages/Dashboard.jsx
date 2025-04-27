import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import AdminPanel from '../components/admin-panel/AdminPanel.jsx';

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
        console.error('Error fetching user:', error);
        navigate('/');
      }
    };
  
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      if (!user.role) {
        navigate('/choose-role');
      } else if (user.status !== 'approved' && user.role !== 'admin') {
        navigate('/pending-approval');
      }
    }
  }, [user, navigate]);
  

  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/api/auth/logout';
  };

  if (!user) {
    return <p style={{ textAlign: 'center', marginTop: '5rem' }}>Loading...</p>;
  }

  const firstLetter = user.username ? user.username.charAt(0).toUpperCase() : '';

  return (
    <div className={styles['dashboard']}>
      <div className={styles['dashboard__avatar']}>
        {firstLetter}
      </div>

      <div className={styles['dashboard__info']}>
        <h1>Welcome, {user.username}!</h1>
        <p className={styles['dashboard__email']}>Email: {user.email}</p>
        {user?.role === 'admin' && (
          <button onClick={() => navigate('/upload')}>
            Being finalized
          </button>
        )}
      </div>

      {user?.role === 'admin' && (
        <AdminPanel />
      )}
      
      <button
        onClick={handleLogout}
        className={styles['dashboard__logout-button']}
      >
        LOGOUT
      </button>
    </div>
  );
};

export default Dashboard;
