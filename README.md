# Mnemia ParkAI — Intelligent Smart Parking Management System

[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-teal.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange.svg)](https://firebase.google.com/)

**Mnemia ParkAI** is a next-generation intelligent smart parking management platform built for modern urban smart cities. It eliminates parking search time, prevents double-booking through interval-based collision validation, provides dedicated EV charging bay reservations, simulates automated barrier gates with digital QR passes, and generates official tax receipts.

---

## 🌟 Key Capabilities

### 🚗 1. Driver & Vehicle Owner Portal
- **Real-Time Bay Availability**: Browse smart multi-level parking complexes with live floor-by-floor bay states (Available, Occupied, Reserved, Maintenance).
- **Conflict-Free Reservation Engine**: Mathematically checks requested time windows against existing bookings to prevent overlapping slot reservations.
- **EV Fast Charging Bays**: Dedicated bay reservations with duration-based EV charging power surcharges and automated fee calculations.
- **Contactless Checkout Simulator**: Instant UPI (QR code & VPA), Credit/Debit Card, and Net Banking payment options with simulated gateway outcomes and error testing toggles.
- **Scannable QR Fast-Pass**: Generates unique scannable verification tokens with booking reference, vehicle plate, and arrival windows.
- **Official Tax Receipts**: Full GST & Municipal cess breakdown, printable invoice, and transaction references.
- **Vehicle Garage**: Register and manage multiple vehicles (Cars, SUVs, EVs, 2-Wheelers) for 1-click booking.

### 🛡️ 2. Operational Administrator Hub
- **Command Center Dashboard**: Live KPIs (Total Bays, Active Parked Vehicles, Today's Revenue, Gate Barrier Flow).
- **Interactive Data Telemetry**:
  - 24-Hour Peak Parking Traffic Demand Curve (Recharts AreaChart)
  - Bay Infrastructure Distribution (Recharts PieChart)
  - Facility Revenue Comparison (Recharts BarChart)
- **Smart Barrier & QR Verification Terminal**:
  - Simulated ANPR gate barrier for Entry and Exit verification.
  - Interactive gate arm animations (`LOCKED`, `BARRIER OPENED (Proceed)`, `ACCESS DENIED`).
  - Protection against duplicate vehicle entry and premature exits.
- **Slot & Facility Management**:
  - Add, edit, and decommission parking bays across facilities.
  - Configure bay types (Standard, EV, Handicapped, VIP) and floors.
  - Inline operational status toggling (`available` / `occupied` / `maintenance`).
- **Operational Ledger & CSV Export**:
  - Audit trail of all parking sessions with search and filters.
  - One-click CSV report export for academic review and municipal records.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔑 Demo Review Accounts (1-Click Presets Included)

The application includes built-in quick login buttons in the Navbar and Login page for effortless presentation:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Driver / Vehicle Owner** | `user@parkai.com` | `user123` | Bookings, QR Passes, Receipts, Profile |
| **System Administrator** | `admin@parkai.com` | `admin123` | Full Dashboard, Barrier Scanner, Slot Mgmt, CSV Export |

> **Note:** You can also register a brand new account with either role directly from the **Register** page.

---

## 🎓 College Presentation Walkthrough (Step-by-Step)

Follow this 5-minute workflow to demonstrate the full system to project reviewers:

1. **Step 1: Explore Landing Page (`/`)**
   - Highlight the live telemetry ticker, features, 4-step workflow, and popular smart parking facilities.
2. **Step 2: Browse Facilities (`/locations`)**
   - Search for facilities, filter by EV Charging, and click **"Live Bay Map Preview"** to inspect real-time bay status on each floor.
3. **Step 3: Reserve a Bay (`/book`)**
   - Select arrival time and duration. Pick a bay (e.g., Slot `A-02` EV Bay).
   - Watch the dynamic fee calculator compute base parking, EV power surcharge, and 5% GST tax.
   - Click **"Confirm & Pay"**, choose UPI or Card in the checkout modal, and click **"Complete Booking"**.
   - Observe confetti celebration and newly issued Booking ID (e.g., `MNM-BK-XXXX`).
4. **Step 4: Inspect Passes & Invoices (`/my-bookings`)**
   - Click **"QR Fast-Pass"** to view the scannable gate code and arrival window.
   - Click **"Invoice Receipt"** to view the official municipal tax receipt and print preview.
5. **Step 5: Gate Barrier Check-in Simulation (`/admin`)**
   - Switch to **Admin Hub**. In the **Smart Barrier & QR Verification Terminal**, click the quick demo trigger for the booking or enter the ID.
   - Observe the gate barrier lift (`BARRIER OPENED (Proceed)`) and verify the vehicle is marked as entered.
   - Switch to the **Vehicle Exit Gate** tab and click **"Exit Gate"** to simulate vehicle departure and automatic bay release.
6. **Step 6: Management & Analytics (`/admin/slots` & `/admin/analytics`)**
   - View slot inventory, toggle operational status to `maintenance`, and export the verified bookings CSV report.

---

## ☁️ Firebase Cloud Firestore Configuration

Mnemia ParkAI features a **dual-engine persistence architecture**:
- **Offline / Presentation Mode**: Runs out of the box with zero external setup using local reactive persistent storage.
- **Cloud Firestore Mode**: Connects directly to Google Firebase once credentials are provided in `.env`.

### Connecting Firebase:
1. Create a Firebase project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Enable **Cloud Firestore** and deploy `firestore.rules` and `firestore.indexes.json`.
4. Create a `.env` file from `.env.example`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
5. Run the provided database seeder (`seedFirestoreDatabase()` in `src/firebase/seedScript.ts`) to populate live Firestore collections.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v3, Glassmorphism design tokens
- **Typography**: Google Fonts (Outfit & Inter)
- **Icons**: Lucide Icons
- **Visual Analytics**: Recharts (AreaChart, BarChart, PieChart)
- **Barcodes & QR**: `qrcode.react` SVG high-density render
- **Notifications**: `react-hot-toast`
- **Celebration Effects**: `canvas-confetti`
- **Database**: Cloud Firestore / Local Reactive Storage Bus
- **Security Rules**: Role-based access control (RBAC), document ownership validation

---

## 📄 License
Academic Project Submission — Designed and implemented for Mnemia ParkAI.
