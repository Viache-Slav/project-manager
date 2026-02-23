const LoginIcon = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M10 17l5-5-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12H3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 19V5a2 2 0 0 0-2-2h-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LoginIcon;
