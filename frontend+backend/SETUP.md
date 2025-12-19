# Setup Guide

## Initial Setup

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Backend Environment:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret
   ```

3. **Start Development:**
   ```bash
   # From root directory
   npm run dev
   ```

## Development URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Project Structure

```
├── frontend/          # React app (Vite + Tailwind)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── backend/           # Node.js API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Custom middleware
│   │   └── services/      # Business logic
│   └── package.json
└── package.json       # Root scripts
```

## Available Commands

- `npm run dev` - Start both frontend and backend
- `npm run frontend:dev` - Start only frontend
- `npm run backend:dev` - Start only backend
- `npm run install:all` - Install all dependencies
- `npm run clean` - Remove all node_modules