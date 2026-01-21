const ClientRegisterFormView = ({
  form,
  loading,
  error,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <h3>Create account</h3>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={onChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={onChange}
        required
      />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={onChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={onChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Register'}
      </button>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </form>
  );
};

export default ClientRegisterFormView;
