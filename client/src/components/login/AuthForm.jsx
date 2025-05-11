import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './AuthForm.module.css';
import { GoogleLogin } from '@react-oauth/google';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleMode = () => {
    localStorage.removeItem('token'); 
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      username: '',
      password: '',
      role: 'employee'
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/auth/login' : '/auth/register';
  
    try {
      const res = await axios.post(url, formData);
      if (isLogin && res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
  
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      setError(message);
    }
  };

  return (
    <div className={styles['auth-form']}>
      <p className={styles['auth-form__title']}>
        You can log in with your Google Account
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            axios.post('/auth/google-login', { token: credentialResponse.credential })
              .then(res => {
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard');
              })
              .catch(() => setError('Google login failed'));
          }}
          onError={() => setError('Google login failed')}
        />
      </div>

      <p style={{ margin: '1rem 0' }}>
        Or use your email and password:
      </p>

      <form onSubmit={handleSubmit} className={styles['auth-form__form']}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles['auth-form__input']}
        />
        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className={styles['auth-form__input']}
          />
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles['auth-form__input']}
        />
        {!isLogin && (
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className={styles['auth-form__input']}
          >
            <option value="employee">Employee</option>
            <option value="admin">Leader</option>
          </select>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            className={`${styles['auth-form__button']} ${styles['auth-form__button--primary']}`}
          >
            {isLogin ? 'LOG IN' : 'REGISTER'}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className={`${styles['auth-form__button']} ${styles['auth-form__button--secondary']}`}
          >
            {isLogin ? 'REGISTER' : 'LOGIN'}
          </button>
        </div>
      </form>

      {error && <p className={styles['auth-form__error']}>{error}</p>}
    </div>
  );
};

export default AuthForm;
