import { useState } from 'react';
import axios from '../../api/axios';
import ClientRegisterFormView from './ClientRegisterFormView';

const ClientRegisterForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        '/auth/register-client',
        form
      );

      localStorage.setItem('token', res.data.token);
      onSuccess?.();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientRegisterFormView
      form={form}
      loading={loading}
      error={error}
      onChange={handleChange}
      onSubmit={submit}
    />
  );
};

export default ClientRegisterForm;
