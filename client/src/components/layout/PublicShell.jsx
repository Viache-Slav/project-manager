import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

const PublicShell = ({ onLoginClick, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader onLoginClick={onLoginClick} />

      <main className="flex-1">
            {children}
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicShell;
