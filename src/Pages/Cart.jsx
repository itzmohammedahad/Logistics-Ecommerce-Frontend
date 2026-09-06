import React, { useState } from 'react';

export default function Cart({ cart = [], updateQty, removeItem, clearCart, setView, user }) {
  const [method, setMethod] = useState('Cash on Delivery (COD)');

  const safeCart = Array.isArray(cart) ? cart : [];
  const subtotal = safeCart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const adminPlatformFee = subtotal * 0.025;
  const sellerPayout = subtotal - adminPlatformFee;

  const handleCheckout = () => {
    if (!user) {
      alert('Please log in or register before checking out!');
      setView('login');
      return;
    }

    const finalPaymentMethod = method || 'Cash on Delivery (COD)';
    const paymentStatus = finalPaymentMethod === 'Cash on Delivery (COD)' ? 'PENDING (COD)' : 'PAID (ONLINE)';

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const trackingId = 'TRK-' + Math.floor(1000000 + Math.random() * 9000000);

    const newOrder = {
      orderId,
      trackingNumber: trackingId,
      status: 'Dispatched',
      customer: {
        name: user.name,
        email: user.email,
        role: user.role || 'Buyer'
      },
      items: safeCart,
      payment: {
        method: finalPaymentMethod,
        status: paymentStatus,
        totalBuyerPaid: total,
        adminCommission: adminPlatformFee,
        sellerReceives: sellerPayout
      },
      orderDate: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.unshift(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    alert(`🎉 Order Placed!\n\nOrder ID: ${orderId}\nWaybill: ${trackingId}\nTotal: ₹${total.toLocaleString()}`);
    clearCart();
    setView('orders');
  };

  if (safeCart.length === 0) {
    return (
      <div className="empty-cart">
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.5rem' }}>Browse our hardware and software catalog.</p>
        <button onClick={() => setView('home')} className="btn-primary">Browse Catalog</button>
      </div>
    );
  }

  const paymentModes = [
    { id: 'Cash on Delivery (COD)', label: '💵 Cash on Delivery (COD) [Default]' },
    { id: 'UPI (GPay / PhonePe / Paytm)', label: '📱 UPI (Instant QR / VPA)' },
    { id: 'Credit / Debit Card', label: '💳 Corporate / Debit Card' },
    { id: 'Net Banking', label: '🏦 Net Banking (RTGS/NEFT)' }
  ];

  return (
    <div className="cart-layout">
      {/* Left Column: Detailed Cart Items */}
      <div className="cart-items">
        <h2>Shopping Cart ({safeCart.reduce((sum, i) => sum + (i.quantity || 1), 0)} items)</h2>
        
        {safeCart.map((item) => (
          <div key={item.id} className="cart-item" style={{ alignItems: 'flex-start' }}>
            <img src={item.image} alt={item.name} style={{ width: '75px', height: '75px', borderRadius: '6px' }} />
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span className="badge" style={{ fontSize: '0.7rem' }}>{item.category}</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--muted)' }}>SKU-{item.id}</span>
              </div>

              <h4 style={{ margin: '0 0 0.25rem 0' }}>{item.name}</h4>
              
              {/* Extra Logistics & Product Details */}
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                Fulfilled by: <strong>{item.sellerEmail || 'Direct Logistics Hub'}</strong> | Stock: <span style={{ color: '#16a34a' }}>Available</span>
              </p>

              <p className="item-price" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                ₹{item.price.toLocaleString()} unit price
              </p>
            </div>

            <div className="qty-controls" style={{ marginTop: '0.5rem' }}>
              <button onClick={() => updateQty(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.id, 1)}>+</button>
            </div>

            <div style={{ fontWeight: 700, minWidth: '95px', textAlign: 'right', marginTop: '0.5rem', fontSize: '1.05rem' }}>
              ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
            </div>

            <button onClick={() => removeItem(item.id)} className="btn-remove" style={{ marginTop: '0.4rem' }}>✕</button>
          </div>
        ))}
      </div>

      {/* Right Column: Invoice Summary */}
      <div className="cart-summary">
        <h3>Invoice & Settlement Ledger</h3>

        <div className="summary-section">
          <p className="section-title">Client Billing</p>
          <div className="summary-row"><span>Items Subtotal:</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>GST (18%):</span><span>₹{gst.toLocaleString()}</span></div>
          <div className="summary-row total"><span>Total Payable:</span><span>₹{total.toLocaleString()}</span></div>
        </div>

        <hr style={{ margin: '0.75rem 0', borderColor: 'var(--border)' }} />

        <div className="summary-section">
          <p className="section-title">Aggregator Split (Backend)</p>
          <div className="summary-row split-text"><span>Admin Commission (2.5%):</span><span>+ ₹{adminPlatformFee.toFixed(2)}</span></div>
          <div className="summary-row split-text"><span>Seller Net Payout:</span><span>₹{sellerPayout.toFixed(2)}</span></div>
        </div>

        <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>Select Payment Mode</h4>
        <div className="payment-options">
          {paymentModes.map((mode) => (
            <label key={mode.id} className={`pay-label ${method === mode.id ? 'active' : ''}`}>
              <input
                type="radio"
                name="pay"
                value={mode.id}
                checked={method === mode.id}
                onChange={() => setMethod(mode.id)}
              />
              {mode.label}
            </label>
          ))}
        </div>

        <button onClick={handleCheckout} className="btn-primary checkout-btn" style={{ marginTop: '1rem', width: '100%' }}>
          Confirm Order via {method}
        </button>
      </div>
    </div>
  );
}