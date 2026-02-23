import { useState } from 'react';
import AuthForm from '../components/login/AuthForm';
import PublicShell from '../components/layout/PublicShell';
import Modal from '../components/ui/Modal';
import AccordionSection from '../components/ui/AccordionSection';
import PublicDesignItems from '../components/public/PublicDesignItems';
import SectionWithBackground from '../components/layout/SectionWithBackground';
import { bgHomePage } from '../assets/bgHomepage/images';
import Container from '../components/layout/Container';

const HomePage = () => {
  const [authOpen, setAuthOpen] = useState(false);

  const openAuth = () => setAuthOpen(true);
  const closeAuth = () => setAuthOpen(false);

  return (
    <>
      <PublicShell onLoginClick={openAuth}>
        
        <SectionWithBackground images={bgHomePage}>
          <div className="hero-center">
            <h1 className="hero-title hero-title-shadow blue-wave-text">
              Would you like to join us?
            </h1>
          </div>
        </SectionWithBackground>

        <section className="py-16">
          <Container>
            <AccordionSection title="Available products">
              <PublicDesignItems />
            </AccordionSection>
          </Container>
        </section>
      </PublicShell>

      <Modal open={authOpen} onClose={closeAuth}>
        <AuthForm onSuccess={closeAuth} />
      </Modal>
    </>
  );
};

export default HomePage;
