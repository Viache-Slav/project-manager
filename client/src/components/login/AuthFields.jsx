const AuthFields = ({ isLogin, formData, onChange, onSubmit, onToggleMode, error }) => {
  const hintCls = [
    'my-4 text-sm',
    'text-amber-500/90',
    'cursor-default select-none',
    'transition-transform duration-150',
    'hover:scale-[1.02]',
  ].join(' ');

  const inputCls = [
    'w-full rounded-xl',
    'border border-white/15',
    'bg-white/5',
    'px-4 py-3',
    'text-white placeholder:text-white/40',
    'outline-none',
    'transition',
    'focus:border-[var(--color-brand)]',
    'focus:ring-2 focus:ring-[var(--color-brand)]/25',
  ].join(' ');

  const btnPrimaryCls = [
    'relative px-6 py-2.5',
    'text-sm font-semibold',
    'text-amber-400',
    'bg-transparent',
    'after:absolute after:left-0.5 after:right-0.5 after:bottom-0',
    'after:h-[2px]',
    'after:bg-amber-500',
    'after:rounded-full',
    'after:transition-all after:duration-200',
    'rounded-full hover:bg-amber-500/20 hover:backdrop-blur-sm',
    'active:scale-[0.8]',
  ].join(' ');

  const btnSecondaryCls = [
    'rounded-xl px-6 py-2.5',
    'text-sm font-semibold',
    'text-white/70',
    'bg-transparent',
    'border border-transparent',
    'transition-all duration-200',
    'hover:text-white',
    'hover:bg-white/10',
    'active:scale-[0.8]',
  ].join(' ');

  const srOnlyCls = 'sr-only';

  return (
    <>
      <p className={hintCls}>
        Or use your email and password:
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className={srOnlyCls} htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          required
          autoComplete="email"
          inputMode="email"
          className={inputCls}
        />

        {!isLogin && (
          <>
            <label className={srOnlyCls} htmlFor="auth-username">Username</label>
            <input
              id="auth-username"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={onChange}
              required
              autoComplete="username"
              className={inputCls}
            />
          </>
        )}

        <label className={srOnlyCls} htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          required
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          className={inputCls}
        />

        <div className="mt-1 flex justify-center gap-3">
          <button type="submit" className={btnPrimaryCls}>
            {isLogin ? 'LOG IN' : 'REGISTER'}
          </button>

          <button type="button" onClick={onToggleMode} className={btnSecondaryCls}>
            {isLogin ? 'REGISTER' : 'LOGIN'}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-400" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </form>
    </>
  );
};

export default AuthFields;