import React, { useState } from 'react';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '5rem auto',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      textAlign: 'center',
      backgroundColor: '#fff'
    }}>
      <p style={{ marginBottom: '1rem' }}>
        You can log in with your Google Account
      </p>

      <a
        href="http://localhost:5000/api/auth/google" 
        style={{
        padding: '0.5rem 1.5rem',
        marginBottom: '1rem',
        border: 'none',
        borderRadius: '25px',
        backgroundColor: '#fff',
        boxShadow: '0 0 5px rgba(0,0,0,0.2)',
        cursor: 'pointer'
      }}>
        Continue with Google
      </a>

      <p style={{ margin: '1rem 0' }}>
        Or log in using an email and password, after registering:
      </p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="your@email.com"
          style={inputStyle}
        />
        {!isLogin && (
          <input
            type="text"
            placeholder="User name"
            style={inputStyle}
          />
        )}
        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
        />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            style={{
              ...buttonStyle,
              backgroundColor: '#ff6600',
              color: 'white'
            }}
          >
            {isLogin ? 'LOG IN' : 'SIGN UP'}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            style={{
              ...buttonStyle,
              backgroundColor: '#f0f0f0',
              color: '#333'
            }}
          >
            {isLogin ? 'REGISTRATION' : 'LOGIN'}
          </button>
        </div>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '12px',
  border: '1px solid #ccc',
  width: '100%'
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '25px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default AuthForm;
