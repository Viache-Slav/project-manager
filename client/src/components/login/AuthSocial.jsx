import { useGoogleLogin } from '@react-oauth/google';

const GoogleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.7 2.7 30.2 0.5 24 0.5 14.7 0.5 6.7 5.8 2.8 13.5l7.9 6.1C12.6 13.5 17.9 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.7c-.3 2-1.6 5.1-4.5 7.1l7 5.4c4.1-3.8 6.3-9.4 6.3-16.2z"/>
    <path fill="#FBBC05" d="M10.7 28.6c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.9-6.1C1.3 16 0.5 19.4 0.5 23.8S1.3 31.6 2.8 35l7.9-6.4z"/>
    <path fill="#34A853" d="M24 47.5c6.2 0 11.4-2 15.2-5.5l-7-5.4c-1.9 1.3-4.5 2.2-8.2 2.2-6.1 0-11.4-4-13.3-9.6L2.8 35C6.7 42.2 14.7 47.5 24 47.5z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const AuthSocial = ({ onGoogleSuccess, className = '' }) => {
  const login = useGoogleLogin({
    onSuccess: onGoogleSuccess,
  });

  return (
    <>
      <p className="mb-4 text-sm text-amber-500/90 text-pulse-soft">
        You can log in with your Google Account
      </p>

      <button
        type="button"
        onClick={() => login()}
        className={[
          'group relative mx-auto flex items-center justify-center gap-2',
          'h-10 px-4 rounded-xl',
          'overflow-hidden',
          'shadow-[0_15px_50px_rgba(0,0,0,0.25)]',
          'transition-all duration-200 ease-out',
          'hover:shadow-[0_18px_50px_rgba(227,159,10,0.30)]',
          'hover:-translate-y-[2px]',
          'active:scale-[0.98]',
          className,
        ].join(' ')}
        aria-label="Continue with Google"
      >
        <span className="
          absolute inset-0
          bg-black/10
          group-hover:bg-black/20
          transition duration-300
        " />

        <span className="relative z-10 flex items-center gap-2">
          <span className="grid place-items-center w-7 h-7 rounded-lg">
            <GoogleIcon className="w-4 h-4" />
          </span>

          <span className="mr-1 google-text-shine">
            Continue with Google
          </span>
        </span>
      </button>
    </>
  );
};

export default AuthSocial;
