import React, { useState, useEffect } from 'react';
import { initialProducts } from './data/products';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Orders from './Pages/Orders';
import Profile from './Pages/Profile';
import AdminUsers from './Pages/AdminUsers';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Register from './Pages/Register';
import './App.css';

export default function App() {
  const [view, setView] = useState('home');

  // Dynamic Product State (Persistent across admin additions/deletions)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // User Session State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setView('home');
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.find((item) => item.id === product.id);
      if (exists) {
        return safePrev.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...safePrev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev
        .map((item) => (item.id === id ? { ...item, quantity: (item.quantity || 1) + delta } : item))
        .filter((item) => item.quantity > 0);
    });
  };

  const removeItem = (id) => setCart((prev) => (Array.isArray(prev) ? prev.filter((i) => i.id !== id) : []));
  const clearCart = () => setCart([]);

  const totalCartCount = (Array.isArray(cart) ? cart : []).reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <div className="app-container">
      <Navbar
        view={view}
        setView={setView}
        user={user}
        onLogout={handleLogout}
        cartCount={totalCartCount}
      />

      <main className="main-content">
        {view === 'home' && <Home products={products} addToCart={addToCart} />}
        {view === 'about' && <About setView={setView} />}
        {view === 'contact' && <Contact user={user} />}
        {view === 'orders' && <Orders user={user} setView={setView} />}
        {view === 'profile' && <Profile user={user} onLogout={handleLogout} setView={setView} />}

        {/* Protected Ops Console Route with Full CRUD */}
        {view === 'admin' && (
          user?.role === 'Admin' ? (
            <AdminUsers
              products={products}
              setProducts={setProducts}
              setView={setView}
            />
          ) : (
            <div className="empty-cart">
              <h2>⛔ Access Denied</h2>
              <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.5rem' }}>
                You must be an authorized Administrator to access the Ops Console.
              </p>
              <button onClick={() => setView('home')} className="btn-primary">Return to Store</button>
            </div>
          )
        )}

        {view === 'cart' && (
          <Cart
            cart={cart}
            updateQty={updateQty}
            removeItem={removeItem}
            clearCart={clearCart}
            setView={setView}
            user={user}
          />
        )}

        {view === 'login' && <Login onLogin={handleLogin} setView={setView} />}
        {view === 'register' && <Register onLogin={handleLogin} setView={setView} />}
      </main>
    </div>
  );
}