import Container from './Container';

const PublicFooter = ({ rightText = 'Built with React + Vite' }) => {
  return (
    <footer className="w-full border-t border-[var(--color-borderSoft)] bg-[var(--color-footer)]">
      <Container className="flex justify-between py-4 text-sm text-[var(--color-text-muted)]">
        <div>© {new Date().getFullYear()} Meblex Furniture</div>
        <div>{rightText}</div>
      </Container>
    </footer>
  );
};

export default PublicFooter;
