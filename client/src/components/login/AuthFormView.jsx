import styles from './AuthForm.module.css';
import { GoogleLogin } from '@react-oauth/google';

const AuthFormView = ({
  isLogin,
  formData,
  error,

  onChange,
  onSubmit,
  onToggleMode,
  onGoogleSuccess,
  onGoogleError,
}) => {
  return (
    <div className={styles['auth-form']}>
      <p className={styles['auth-form__title']}>
        You can log in with your Google Account
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={onGoogleError}
        />
      </div>

      <p style={{ margin: '1rem 0' }}>
        Or use your email and password:
      </p>

      <form
        onSubmit={onSubmit}
        className={styles['auth-form__form']}
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          required
          className={styles['auth-form__input']}
        />

        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={onChange}
            required
            className={styles['auth-form__input']}
          />
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          required
          className={styles['auth-form__input']}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <button
            type="submit"
            className={`${styles['auth-form__button']} ${styles['auth-form__button--primary']}`}
          >
            {isLogin ? 'LOG IN' : 'REGISTER'}
          </button>

          <button
            type="button"
            onClick={onToggleMode}
            className={`${styles['auth-form__button']} ${styles['auth-form__button--secondary']}`}
          >
            {isLogin ? 'REGISTER' : 'LOGIN'}
          </button>
        </div>
      </form>

      {error && (
        <p className={styles['auth-form__error']}>
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthFormView;
