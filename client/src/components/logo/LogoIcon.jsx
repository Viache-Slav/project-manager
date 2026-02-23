const LogoIcon = ({ compact }) => {
  return (
    <svg
      width={compact ? 40 : 50}
      viewBox="0 0 65 65"
      fill="none"
      className="block"
    >
      <path
        d="M24 26c0-8 4.5-14 8-14s8 6 8 14"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M20 28c0 6 4 10 12 10s12-4 12-10"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M18 30v10c0 8 6 14 14 14h0c8 0 14-6 14-14V30"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 36h-3c-2 0-4-2-4-4v-2c0-2 2-4 4-4h3"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 36h3c2 0 4-2 4-4v-2c0-2-2-4-4-4h-3"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 54v6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M40 54v6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M22 60h20"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LogoIcon;
