import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import styles from './Dashboard.module.css';
import AdminPanel from '../components/admin-panel/AdminPanel.jsx';
import TrackManager from '../components/track/TrackManager';
import DesignCatalog from '../components/design/DesignCatalog';
import AccordionSection from '../components/ui/AccordionSection';
import DesignItemUploadForm from '../components/design/DesignItemUploadForm';
import MaterialsOverview from '../components/materials/MaterialsOverview';
import AdminOrders from '../components/orders/AdminOrders';
import CatalogImport from '../components/catalog-import/CatalogImport';

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
      if (user.status !== 'approved') {
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
      </div>

      {user?.role === 'admin' && (
        <AccordionSection title="Admin panel">
          <AdminPanel />
        </AccordionSection>
      )}

      <AccordionSection title="Upload design item">
        <DesignItemUploadForm onCreated={reloadProductsRef.current} />
      </AccordionSection>

      <AccordionSection title="Materials">
        <MaterialsOverview />
      </AccordionSection>

      <AccordionSection title="Catalog import">
        <CatalogImport />
      </AccordionSection>

      <AccordionSection title="Catalog">
        <DesignCatalog />
      </AccordionSection>

      <AccordionSection title="Orders">
        <AdminOrders />
      </AccordionSection>

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
