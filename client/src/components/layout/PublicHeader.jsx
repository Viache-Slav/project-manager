import Container from './Container';
import Logo from '../logo/Logo';
import LoginButton from '../login/LoginButton';

const PublicHeader = ({ onLoginClick }) => {
  return (
    <header className="w-full border-b border-[var(--color-borderSoft)] backdrop-blur h-[var(--header-height)] bg-[var(--color-header)]">
      <Container className="h-full flex items-center justify-between">
        <Logo />
        <LoginButton className="mr-8" onClick={onLoginClick} />
      </Container>
    </header>
  );
};

export default PublicHeader;
