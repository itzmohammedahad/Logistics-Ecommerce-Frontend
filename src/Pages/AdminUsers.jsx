import React, { useState } from 'react';

export default function AdminUsers({ products, setProducts, setView }) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'products'
  
  // Local storage user state
  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch {
      return [];
    }
  });

  // New User Form State
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Buyer' });
  const [showUserModal, setShowUserModal] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Logistics Hardware',
    price: '',
    stock: '',
    sellerEmail: 'admin@nexlogistics.com',
    description: '',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80'
  });
  const [showProductModal, setShowProductModal] = useState(false);

  // --- USER HANDLERS ---
  const handleAddUser = (e) => {
    e.preventDefault();
    if (users.some((u) => u.email.toLowerCase() === newUser.email.trim().toLowerCase())) {
      alert('A user with this email already exists.');
      return;
    }

    const createdUser = {
      id: 'USR-' + Date.now().toString().slice(-6),
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      password: newUser.password,
      role: newUser.role
    };

    const updated = [...users, createdUser];
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
    setShowUserModal(false);
    setNewUser({ name: '', email: '', password: '', role: 'Buyer' });
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user record?')) {
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
    }
  };

  // --- PRODUCT HANDLERS ---
  const handleAddProduct = (e) => {
    e.preventDefault();
    const createdProduct = {
      id: Date.now(),
      name: newProduct.name.trim(),
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock) || 20,
      sellerEmail: newProduct.sellerEmail.trim().toLowerCase(),
      description: newProduct.description,
      image: newProduct.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80'
    };

    const updated = [createdProduct, ...products];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    setShowProductModal(false);
    setNewProduct({
      name: '',
      category: 'Logistics Hardware',
      price: '',
      stock: '',
      sellerEmail: 'admin@nexlogistics.com',
      description: '',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80'
    });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to remove this product from the master catalog?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem('products', JSON.stringify(updated));
    }
  };

  return (
    <div className="orders-container">
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>🛡️ Operations Console & Database</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Full Read/Write/Delete controls over Platform Registry</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`pill-btn ${activeTab === 'users' ? 'active-pill' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 User Registry ({users.length})
          </button>
          <button
            className={`pill-btn ${activeTab === 'products' ? 'active-pill' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Master Products ({products.length})
          </button>
          <button onClick={() => setView('home')} className="btn-primary" style={{ padding: '0.4rem 0.8rem' }}>
            Back to Store
          </button>
        </div>
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Registered Tenants & User Records</h3>
            <button onClick={() => setShowUserModal(true)} className="btn-add">
              + Add New User
            </button>
          </div>

          <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.8rem' }}>User ID</th>
                  <th style={{ padding: '0.8rem' }}>Name / Org</th>
                  <th style={{ padding: '0.8rem' }}>Email</th>
                  <th style={{ padding: '0.8rem' }}>Role</th>
                  <th style={{ padding: '0.8rem', textAlign: 'center' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.8rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{u.id}</td>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.8rem' }}>{u.email}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span className={`badge ${u.role === 'Admin' ? 'admin-badge' : u.role === 'Seller' ? 'seller-badge' : ''}`}>
                        {u.role || 'Buyer'}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="btn-delete"
                        title="Delete User Record"
                        style={{ fontSize: '1rem', padding: '0.2rem 0.5rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Inventory & Service Catalog Registry</h3>
            <button onClick={() => setShowProductModal(true)} className="btn-add">
              + Add New Product
            </button>
          </div>

          <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.8rem' }}>ID / SKU</th>
                  <th style={{ padding: '0.8rem' }}>Product Name</th>
                  <th style={{ padding: '0.8rem' }}>Category</th>
                  <th style={{ padding: '0.8rem' }}>Price (₹)</th>
                  <th style={{ padding: '0.8rem' }}>Stock</th>
                  <th style={{ padding: '0.8rem' }}>Vendor Email</th>
                  <th style={{ padding: '0.8rem', textAlign: 'center' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.8rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>SKU-{p.id}</td>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span className="badge">{p.category}</span>
                    </td>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>₹{p.price.toLocaleString()}</td>
                    <td style={{ padding: '0.8rem' }}>{p.stock || 25} units</td>
                    <td style={{ padding: '0.8rem', fontSize: '0.85rem', color: 'var(--muted)' }}>{p.sellerEmail || 'admin@nexlogistics.com'}</td>
                    <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="btn-delete"
                        title="Delete Product"
                        style={{ fontSize: '1rem', padding: '0.2rem 0.5rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD USER */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Create New User Record</h3>
              <button className="btn-close" onClick={() => setShowUserModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="input-select"
                >
                  <option value="Buyer">Buyer / Client</option>
                  <option value="Seller">Vendor / Seller</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
              <div className="form-group">
                <label>Full Name / Org</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Acme Transport Ltd."
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="name@company.com"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Save User to Database
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add Product to Catalog</h3>
              <button className="btn-close" onClick={() => setShowProductModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. RFID Gate Reader"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="input-select"
                  >
                    <option value="Logistics Hardware">Logistics Hardware</option>
                    <option value="Cloud Software">Cloud Software</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="2999"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label>Stock Count</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="50"
                  />
                </div>
                <div className="form-group">
                  <label>Vendor / Seller Email</label>
                  <input
                    type="email"
                    required
                    value={newProduct.sellerEmail}
                    onChange={(e) => setNewProduct({ ...newProduct, sellerEmail: e.target.value })}
                    placeholder="seller@logistics.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Device specifications or API details..."
                  className="input-textarea"
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Add Product to Store Catalog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}