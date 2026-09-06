import React, { useState } from 'react';

export default function Register({ onLogin, setView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Buyer'); // Buyer | Seller | Admin
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setError('An account with this email already exists.');
      return;
    }

    const newUser = {
      id: 'USR-' + Date.now().toString().slice(-6),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    onLogin(newUser);
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Role</label>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {['Buyer', 'Seller', 'Admin'].map((r) => (
              <button
                key={r}
                type="button"
                className={`pill-btn ${role === r ? 'active-pill' : ''}`}
                style={{ flex: 1, padding: '0.4rem 0.2rem' }}
                onClick={() => setRole(r)}
              >
                {r === 'Buyer' && '🛒 Buyer'}
                {r === r && r === 'Seller' && '🏪 Seller'}
                {r === 'Admin' && '🛡️ Admin'}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>{role === 'Seller' ? 'Vendor / Company Name' : 'Full Name'}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === 'Seller' ? 'Acme Telematics' : 'John Doe'}
          />
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
          Register as {role}
        </button>
      </form>
      <p className="auth-switch">
        Already registered? <span onClick={() => setView('login')}>Sign in here</span>
      </p>
    </div>
  );
}