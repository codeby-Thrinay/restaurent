# 🍽️ DinePulse - Digital Restaurant Management & QR Ordering Platform

**DinePulse** is a modern, full-stack digital dining platform built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Prisma ORM**, and **SQLite**. It resolves common restaurant operational bottlenecks by enabling customers to scan table QR codes, view dynamic menus, place orders, call floor servers, and request bills directly from their table.

---

## 🌟 Key Features & Role Portals

### 1. 📱 Customer View (`/table/[tableId]`)
- **Table Context**: Mobile-first responsive interface per dining table.
- **Dynamic Menu & Filters**: Search dishes, filter by category (Starters, Mains, Desserts, Drinks) and dietary tags (Vegetarian vs Non-Veg).
- **Interactive Cart**: Slide-over drawer with item customization notes and live total calculation.
- **Table Quick Actions**:
  - 🛎️ **Call Waiter**: One-tap request popup for Water, Cutlery, or General Help.
  - 🧾 **Request Bill**: Select payment method (Card, Cash, UPI) with built-in split-bill calculator.
- **Live Order Tracker (`/table/[tableId]/status`)**: Real-time progress tracker (`Order Sent` ➔ `Cooking` ➔ `Plated` ➔ `Served`) + post-meal 5-star rating feedback form.

### 2. 👨‍🍳 Kitchen Display System - KDS (`/kitchen`)
- High-contrast ticket grid for line cooks & chefs.
- Preparation timer counters with color-coded urgency alerts (<10m Green, >10m Amber, >20m Red).
- One-click cooking status triggers (`Start Cooking` ➔ `Mark Order Plated & Ready`).

### 3. 🏃 Floor Staff & Waiter Station (`/staff`)
- Visual floor grid map showing real-time table statuses (`Vacant`, `Occupied`, `Bill Requested`, `Needs Cleaning`).
- Table assistance queue for responding to waiter calls.
- Table checkout and clean reset triggers.

### 4. ⚙️ Admin Operations & Stock Manager (`/admin`)
- Full Menu CRUD: Add new dishes with photos, prices, descriptions, and dietary options.
- Instant stock availability toggle badges (`In Stock` / `Sold Out`).

### 5. 🖨️ Table Printable QR Generator (`/admin/qr`)
- Automatically generates downloadable canvas QR code stand cards for all dining tables (Table 1..N).

### 6. 👑 Executive Owner Analytics (`/owner`)
- Key business metrics: Gross Revenue, Total Orders Processed, Average Order Value (AOV), Customer Satisfaction Rating.
- Bestselling Dishes ranking table by total sales.
- Live customer review feed.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed

### 2. Installation & Database Setup
```bash
# Clone the repository
git clone https://github.com/codeby-Thrinay/restaurent.git
cd restaurent

# Install dependencies
npm install

# Push database schema & seed sample data
npx prisma db push
npx ts-node prisma/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Built With
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: PostgreSQL / SQLite with [Prisma ORM](https://www.prisma.io/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **QR Code Generator**: [qrcode](https://www.npmjs.com/package/qrcode)
