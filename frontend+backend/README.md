# Mobile Recharge App - Full Stack

A complete mobile recharge application with React frontend and Node.js backend.

## Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── package.json       # Root package.json with scripts
└── README.md         # This file
```

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```
   This runs both frontend (http://localhost:5173) and backend (http://localhost:5000) simultaneously.

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install dependencies for root, frontend, and backend
- `npm run frontend:dev` - Start only frontend development server
- `npm run backend:dev` - Start only backend development server
- `npm run frontend:build` - Build frontend for production
- `npm run clean` - Remove all node_modules folders

## Environment Setup

1. **Backend Environment:**
   - Copy `backend/.env.example` to `backend/.env`
   - Configure your MongoDB connection and JWT secret

2. **Frontend Configuration:**
   - The frontend is configured to connect to backend at `http://localhost:5000`

## Features

- User authentication and authorization
- Mobile recharge plans management
- Wallet functionality
- Transaction history
- Admin dashboard
- Real-time notifications

## Tech Stack

**Frontend:**
- React 19
- React Router DOM
- Tailwind CSS
- Chart.js

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing