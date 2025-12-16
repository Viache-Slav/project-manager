import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import styles from './Dashboard.module.css';
import AdminPanel from '../components/admin-panel/AdminPanel.jsx';
import UploadForm from '../components/upload/UploadForm';
import TrackManager from '../components/track/TrackManager';
import ProductList from '../components/catalog/ProductList';
import AccordionSection from '../components/ui/AccordionSection';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const reloadProductsRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromGoogle = urlParams.get('token');
    if (tokenFromGoogle) {
      localStorage.setItem('token', tokenFromGoogle);
      window.history.replaceState(null, '', '/dashboard');
    }
  
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/auth/user');
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/');
      }
    };
  
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      if (!user.role && user.googleId) {
        navigate('/choose-role');
      } else if (user.status !== 'approved') {
        navigate('/pending-approval');
      }
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
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
        <AccordionSection title="Admin panel">
          <AdminPanel />
        </AccordionSection>
      )}

      <AccordionSection title="Catalog">
        <ProductList user={user}
          onReady={(fn) => {
            reloadProductsRef.current = fn;
          }}/>
      </AccordionSection>

      {user?.role === 'admin' && (
        <AccordionSection title="Upload product">
          <UploadForm onCreated={() => {
            if (reloadProductsRef.current) {
              reloadProductsRef.current();
            }
          }} />
        </AccordionSection>
      )}

      {user?.role === 'admin' && (
        <AccordionSection title="Tracks">
          <TrackManager />
        </AccordionSection>
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
