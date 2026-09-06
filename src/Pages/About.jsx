import React from 'react';

export default function About({ setView }) {
  return (
    <div className="info-page">
      <div className="hero-banner">
        <h2>Enterprise Supply Chain & Logistics Tech Hub</h2>
        <p>Connecting supply chain hardware sensors with multi-tenant SaaS aggregation engines.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>99.98%</h3>
          <p>API Dispatch Uptime</p>
        </div>
        <div className="stat-card">
          <h3>2.5M+</h3>
          <p>Shipments Tracked Daily</p>
        </div>
        <div className="stat-card">
          <h3>450+</h3>
          <p>Enterprise Fleet Partners</p>
        </div>
      </div>

      <div className="content-card">
        <h3>What We Do</h3>
        <p>
          NexLogistics provides end-to-end supply chain visibility. From industrial IoT telemetry hardware to cloud-native route planning APIs, we aggregate multi-carrier logistics into a singular, unified platform.
        </p>
        <button onClick={() => setView('home')} className="btn-primary" style={{ marginTop: '1.25rem' }}>
          Explore Products & APIs
        </button>
      </div>
    </div>
  );
}