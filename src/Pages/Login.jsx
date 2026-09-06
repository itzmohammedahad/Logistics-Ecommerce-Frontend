import React, { useState } from 'react';

export default function Login({ onLogin, setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Buyer');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (user) {
      // Update role if selected differently or preserve account role
      const loggedUser = { ...user, activeRole: role };
      onLogin(loggedUser);
    } else {
      setError('Invalid email or password. Please check your credentials or register.');
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign In</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Login As</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <button
              type="button"
              className={`pill-btn ${role === 'Buyer' ? 'active-pill' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setRole('Buyer')}
            >
              Buyer
            </button>
            <button
              type="button"
              className={`pill-btn ${role === 'Seller' ? 'active-pill' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setRole('Seller')}
            >
              Seller
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Sign In
        </button>
      </form>
      <p className="auth-switch">
        Need an account? <span onClick={() => setView('register')}>Register here</span>
      </p>
    </div>
  );
}