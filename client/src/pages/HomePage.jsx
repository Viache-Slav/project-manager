import React from 'react';
import AuthForm from '../components/login/AuthForm';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>Welcome to Project Manager</h1>
      <AuthForm />
    </div>
  );
};

export default HomePage;
