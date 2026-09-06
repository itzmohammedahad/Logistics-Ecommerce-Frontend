# 🚚 NexLogistics — SaaS Aggregator & Telematics E-Commerce Platform

A multi-tenant e-commerce and logistics aggregation platform designed for freight, IoT tracking sensors, and supply chain SaaS subscriptions. Built with a pure client-side React architecture, persistent client document storage, and strict Role-Based Access Control (RBAC).

---

## 🌟 Core Features

- **Role-Based Access Control (RBAC):**
  - **Buyer / Client:** Explore hardware & software catalogs, category filtering, cart operations, multi-mode payment (Default COD, UPI, Card), and real-time order waybill tracking.
  - **Vendor / Seller:** View incoming fulfillment orders filtered strictly to their own products and inventory.
  - **SuperAdmin Ops Console:** Centralized administration dashboard with complete CRUD operations (Add/Delete Users, Add/Delete Catalog Products).
- **Aggregator Ledger & Settlement Engine:** Live invoice calculation computing Subtotal, 18% GST, 2.5% Platform Fee (Admin revenue), and Seller Net Payout.
- **Waybill Delivery Lifecycle:** Simulates end-to-end delivery tracking stages:  
  `Dispatched` ➔ `In Transit` ➔ `Out for Delivery` ➔ `Delivered`.
- **Zero-Backend Document Storage:** Uses browser `localStorage` as a client-side document database to persist users, catalog inventory, and orders across page reloads without breaking on refresh.

---

## 🛠️ Tech Stack

- **Frontend:** React, JavaScript (ES6+), Semantic HTML5
- **Styling:** Custom Modular CSS (Flexbox, CSS Grid, Variables)
- **State & Storage:** React Hooks (`useState`, `useEffect`), Browser `localStorage`

---

## 🚀 Getting Started Locally

### Prerequisites
Before you begin, ensure you have the following installed on your machine:

- Node.js v18 or later
- npm (comes bundled with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/itzmohammedahad/Logistics-Ecommerce---Frontend.git
   cd Logistics-Ecommerce---Frontend
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local development URL shown in the terminal in your browser.

### Production Build

To create an optimized production build, run:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```