import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import AuthFormView from './AuthFormView';

const AuthForm = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const toggleMode = () => {
    localStorage.removeItem('token');

    setIsLogin((prev) => !prev);
    setFormData({
      email: '',
      username: '',
      password: '',
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? '/auth/login' : '/auth/register';

    try {
      const res = await axios.post(url, formData);

      if (isLogin && res.data.token) {
        localStorage.setItem('token', res.data.token);
        onSuccess?.();
        navigate('/dashboard');
        return;
      }

      if (!isLogin) {
        setError(
          'Registration successful. Wait for admin approval.'
        );
        setIsLogin(true);
        setFormData({
          email: '',
          username: '',
          password: '',
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong'
      );
    }
  };

  const handleGoogleSuccess = (tokenResponse) => {
    axios.post('/auth/google-login', {
      accessToken: tokenResponse.access_token,
    })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        onSuccess?.();
        navigate('/dashboard');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Google login failed');
      });
  };

  return (
    <AuthFormView
      isLogin={isLogin}
      formData={formData}
      error={error}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onToggleMode={toggleMode}
      onGoogleSuccess={handleGoogleSuccess}
      onGoogleError={() =>
        setError('Google login failed')
      }
    />
  );
};

export default AuthForm;
