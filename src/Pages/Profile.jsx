import React from 'react';

export default function Profile({ user, onLogout, setView }) {
  if (!user) {
    setView('login');
    return null;
  }

  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const userOrders = allOrders.filter((o) => o.customer && o.customer.email === user.email);

  return (
    <div className="auth-card" style={{ maxWidth: '500px' }}>
      <h2>User Profile</h2>
      <div className="profile-details">
        <div className="profile-row">
          <span>Full Name:</span>
          <strong>{user.name}</strong>
        </div>
        <div className="profile-row">
          <span>Registered Email:</span>
          <strong>{user.email}</strong>
        </div>
        <div className="profile-row">
          <span>Account Type:</span>
          <strong>Enterprise Logistics Client</strong>
        </div>
        <div className="profile-row">
          <span>Total Orders Placed:</span>
          <strong>{userOrders.length} orders</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button onClick={() => setView('orders')} className="btn-primary" style={{ flex: 1 }}>
          View Orders
        </button>
        <button onClick={onLogout} className="btn-logout" style={{ flex: 1 }}>
          Log Out
        </button>
      </div>
    </div>
  );
}