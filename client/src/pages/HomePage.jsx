import React from 'react';
import AuthForm from '../components/login/AuthForm';
import styles from './HomePage.module.css';

import PublicDesignItems from '../components/public/PublicDesignItems';
import AccordionSection from '../components/ui/AccordionSection';

const HomePage = () => {
  return (
    <div className={styles['home-page']}>
      <h1 className={styles['home-page__title']}>Welcome to Project Manager</h1>
      
      <AccordionSection title="AuthForm" className={styles['home-page__form-wrapper']}>
        <AuthForm />
      </AccordionSection>

      <AccordionSection title="Available products">
        <PublicDesignItems />
      </AccordionSection>

    </div>
  );
};

export default HomePage;
