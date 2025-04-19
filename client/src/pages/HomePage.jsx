import React from 'react';
import AuthMenu from '../components/AuthMenu';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>Welcome to Project Manager</h1>
      <AuthMenu />
    </div>
  );
};

export default HomePage;
