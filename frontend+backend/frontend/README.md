# 📱 Mobile Recharge Application

A complete mobile recharge application built with React, featuring user authentication, wallet management, plan selection, and admin dashboard.

## 🚀 Features

### 🔐 Authentication & Security
- User registration and login
- Admin login with elevated privileges
- Role-based access control
- Session management with localStorage

### 💳 Wallet & Payments
- Digital wallet system with balance tracking
- Wallet top-up functionality
- Multiple payment methods (UPI, Card, Net Banking)
- Transaction history and status tracking

### 📶 Recharge & Plans
- Mobile number validation
- Operator selection (Airtel, Jio, Vi, BSNL)
- Plan categories (Unlimited, Data, Talktime)
- Plan filtering and search
- Instant recharge processing

### 📊 Admin Features
- Admin dashboard with platform overview
- User management
- Plan management (add/delete plans)
- Transaction monitoring
- Revenue tracking

### 🎨 UI/UX Features
- Responsive mobile-first design
- Dark/Light theme toggle
- Clean and minimal interface
- Loading states and notifications

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: Custom lightweight store
- **Storage**: localStorage for persistence
- **Build Tool**: Vite

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔑 Demo Credentials

- **Admin**: admin@test.com / admin123
- **User**: Register with any email/password

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── store/              # Global state management
├── utils/              # Utility functions and data
└── App.jsx             # Main application component
```

## 🎯 Key Features Implemented

- ✅ User Authentication (Login/Register)
- ✅ Wallet Management with Top-up
- ✅ Recharge Plans with Filtering
- ✅ Transaction History
- ✅ Admin Dashboard
- ✅ Responsive Design
- ✅ Theme Toggle
- ✅ Real-time Balance Updates
- ✅ Plan Management (Admin)
- ✅ User Management (Admin)

## 🚀 Getting Started

1. Start the app and register a new account
2. Top up your wallet from the Wallet page
3. Browse and select recharge plans
4. View transaction history
5. Use admin@test.com/admin123 for admin features

## 📱 Mobile Responsive

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Customization

The app uses a minimal architecture that's easy to extend:
- Add new operators in `utils/data.js`
- Modify plans structure
- Add new payment methods
- Extend admin features
- Add analytics and reporting

## 📄 License

MIT License - feel free to use this project for learning and development.