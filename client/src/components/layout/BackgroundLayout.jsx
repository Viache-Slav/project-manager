import bgImage from '../../assets/background.jpg';

const BackgroundLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(10, 25, 47, 0.08)' }}
        />

        <div
          className="absolute -top-[10%] left-0 right-0 h-[50%]"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0) 70%)',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default BackgroundLayout;
