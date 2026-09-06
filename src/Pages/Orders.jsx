import React, { useState, useEffect } from 'react';

export default function Orders({ user, setView }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(stored);
  }, []);

  if (!user) {
    return (
      <div className="empty-cart">
        <h2>Please Sign In</h2>
        <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.5rem' }}>You must be logged in to view order history.</p>
        <button onClick={() => setView('login')} className="btn-primary">Sign In</button>
      </div>
    );
  }

  // Strict Role Filtering
  let visibleOrders = [];
  if (user.role === 'Admin') {
    visibleOrders = orders; // Admin sees all orders
  } else if (user.role === 'Seller') {
    // Seller only sees orders containing their products
    visibleOrders = orders.filter((o) =>
      o.items?.some((item) => item.sellerEmail === user.email)
    );
  } else {
    // Buyer only sees their own placed orders
    visibleOrders = orders.filter((o) => o.customer?.email === user.email);
  }

  const advanceStatus = (orderId) => {
    const updated = orders.map((o) => {
      if (o.orderId === orderId) {
        let nextStatus = 'In Transit';
        if (o.status === 'Dispatched') nextStatus = 'In Transit';
        else if (o.status === 'In Transit') nextStatus = 'Out for Delivery';
        else if (o.status === 'Out for Delivery') nextStatus = 'Delivered';
        else if (o.status === 'Delivered') return o;
        return { ...o, status: nextStatus };
      }
      return o;
    });

    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
  };

  if (visibleOrders.length === 0) {
    return (
      <div className="empty-cart">
        <div style={{ fontSize: '3.5rem' }}>📦</div>
        <h2>No Orders Found</h2>
        <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.5rem' }}>
          {user.role === 'Seller'
            ? 'No customer has placed an order for your inventory yet.'
            : user.role === 'Admin'
            ? 'No platform orders recorded yet.'
            : "You haven't placed any orders yet."}
        </p>
        <button onClick={() => setView('home')} className="btn-primary">Browse Catalog</button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>
          {user.role === 'Seller' && '📦 Vendor Dispatch Queue'}
          {user.role === 'Admin' && '🛡️ Global Aggregator Order Book'}
          {user.role === 'Buyer' && '📦 My Waybills & Tracking'}
        </h2>
        <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
          {visibleOrders.length} {visibleOrders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      <div className="orders-list">
        {visibleOrders.map((order) => {
          // If seller, filter item list to only their items
          const displayItems = user.role === 'Seller'
            ? order.items.filter((item) => item.sellerEmail === user.email)
            : order.items;

          return (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div>
                  <strong>Order ID:</strong> {order.orderId}
                  <span className="order-date"> | {new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <span className={`status-badge ${order.status === 'Delivered' ? 'delivered-badge' : 'pending-badge'}`}>
                  {order.status || 'Dispatched'}
                </span>
              </div>

              <div className="order-body">
                <p><strong>Tracking No:</strong> <span className="tracking-text">{order.trackingNumber}</span></p>
                <p><strong>Customer:</strong> {order.customer?.name} ({order.customer?.email})</p>
                <p><strong>Payment:</strong> {order.payment?.method} ({order.payment?.status})</p>

                <div className="order-items-preview">
                  {displayItems.map((item) => (
                    <span key={item.id} className="item-tag">
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>

                {/* Aggregator Settlement Details */}
                <div className="ledger-box">
                  <small><strong>Settlement Split:</strong></small>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>
                    <span>Seller Payout: ₹{order.payment?.sellerReceives?.toLocaleString()}</span>
                    <span>Admin Platform Fee (2.5%): ₹{order.payment?.adminCommission?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="order-footer" style={{ alignItems: 'center' }}>
                <div>
                  <span>Total Amount: </span>
                  <strong style={{ fontSize: '1.1rem' }}>₹{order.payment?.totalBuyerPaid?.toLocaleString()}</strong>
                </div>

                {/* Only Sellers and Admins can update fulfillment tracking */}
                {(user.role === 'Seller' || user.role === 'Admin') && order.status !== 'Delivered' && (
                  <button onClick={() => advanceStatus(order.orderId)} className="btn-add" style={{ fontSize: '0.8rem' }}>
                    🚚 Advance Delivery Stage
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}