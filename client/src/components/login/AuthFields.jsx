const AuthFields = ({
  isLogin,
  formData,
  onChange,
  onSubmit,
  onToggleMode,
  error,
}) => {
  return (
    <>
      <p className="my-4 text-sm text-amber-500/90 text-pulse-soft hover:scale-110 cursor-pointer">
        Or use your email and password:
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          required
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/25"
        />

        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/25"
          />
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          required
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/25"
        />

        <div className="mt-1 flex justify-center gap-3">

          <button
            type="submit"
            className="rounded-xl bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--color-brand-hover)] active:scale-[0.98]"
          >
            {isLogin ? 'LOG IN' : 'REGISTER'}
          </button>

          <button
            type="button"
            onClick={onToggleMode}
            className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-cyan-800 transition hover:bg-white/15 active:scale-[0.98]"
          >
            {isLogin ? 'REGISTER' : 'LOGIN'}
          </button>

        </div>

        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}

      </form>
    </>
  );
};

export default AuthFields;
