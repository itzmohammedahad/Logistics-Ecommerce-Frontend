import React from 'react';

export default function Navbar({ view, setView, user, onLogout, cartCount = 0 }) {
  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => setView('home')}>
        <span className="brand-icon">🚚</span>
        <span className="brand-name">NexLogistics </span>
      </div>

      <nav className="nav-links">
        <button className={`nav-link ${view === 'home' ? 'active-link' : ''}`} onClick={() => setView('home')}>
          Catalog
        </button>
        <button className={`nav-link ${view === 'about' ? 'active-link' : ''}`} onClick={() => setView('about')}>
          About
        </button>
        <button className={`nav-link ${view === 'contact' ? 'active-link' : ''}`} onClick={() => setView('contact')}>
          Contact
        </button>

        {/* Orders link dynamic text based on role */}
        {user && (
          <button className={`nav-link ${view === 'orders' ? 'active-link' : ''}`} onClick={() => setView('orders')}>
            {user.role === 'Seller' ? 'Seller Orders' : user.role === 'Admin' ? 'All Orders' : 'My Orders'}
          </button>
        )}

        {/* Admin Link ONLY visible to Admin accounts */}
        {user?.role === 'Admin' && (
          <button className={`nav-link ${view === 'admin' ? 'active-link' : ''}`} onClick={() => setView('admin')}>
            Dashboard
          </button>
        )}
      </nav>

      <div className="nav-actions">
        {/* Only Buyers need the cart */}
        {(!user || user.role === 'Buyer') && (
          <button className={`cart-btn ${view === 'cart' ? 'active-link' : ''}`} onClick={() => setView('cart')}>
            🛒 Cart <span className="cart-badge">{cartCount}</span>
          </button>
        )}

        {user ? (
          <div className="user-dropdown">
            <button className="user-btn" onClick={() => setView('profile')}>
              👤 {user.name.split(' ')[0]} ({user.role})
            </button>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        ) : (
          <button className={`btn-login ${view === 'login' ? 'active-link' : ''}`} onClick={() => setView('login')}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}