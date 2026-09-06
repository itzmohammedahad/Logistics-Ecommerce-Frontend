import React, { useState } from 'react';

export default function Contact({ user }) {
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    category: 'Logistics Hardware Support',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    inquiries.push({ ...formData, id: Date.now(), timestamp: new Date().toLocaleString() });
    localStorage.setItem('inquiries', JSON.stringify(inquiries));

    setSent(true);
    setFormData({ name: '', email: '', category: 'Logistics Hardware Support', message: '' });
  };

  return (
    <div className="auth-card" style={{ maxWidth: '550px' }}>
      <h2>Contact Logistics Desk</h2>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Have questions about API integrations, fleet tracking hardware, or bulk volume pricing?
      </p>

      {sent && (
        <div className="success-banner">
          ✅ Thank you! Your inquiry has been logged. Our dispatch support team will get in touch.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label>Work Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
          />
        </div>

        <div className="form-group">
          <label>Inquiry Topic</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-select"
          >
            <option value="Logistics Hardware Support">Logistics Hardware Support</option>
            <option value="Cloud SaaS API Gateway">Cloud SaaS API Gateway</option>
            <option value="Bulk Order Quotation">Bulk Order Quotation</option>
            <option value="Waybill & Billing Inquiries">Waybill & Billing Inquiries</option>
          </select>
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            rows="4"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Provide device model IDs or API questions..."
            className="input-textarea"
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Submit Ticket
        </button>
      </form>
    </div>
  );
}