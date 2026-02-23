import LoginIcon from './LoginIcon';

const LoginButton = ({
  onClick,
  className = '',
  iconClassName = '',
  title = 'Login',
}) => {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      className={[
        'active:scale-95 group',
        className,
      ].join(' ')}
    >
      <LoginIcon
        className={[
          'w-[var(--login-icon-size)] h-[var(--login-icon-size)]',
          'text-[var(--color-login)]',
          'transition duration-200',
          'group-hover:text-[var(--color-brand-hover)]',
          'group-hover:translate-x-1',
          'group-hover:scale-120',
          iconClassName,
        ].join(' ')}
      />
    </button>
  );
};

export default LoginButton;
