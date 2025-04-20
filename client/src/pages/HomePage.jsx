import React from 'react';
import AuthForm from '../components/login/AuthForm';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles['home-page']}>
      <h1 className={styles['home-page__title']}>Welcome to Project Manager</h1>
      
      <div className={styles['home-page__form-wrapper']}>
        <AuthForm />
      </div>
    </div>
  );
};

export default HomePage;
