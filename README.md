# SplitMint - MERN Stack

Welcome to the SplitMint! This application is built using the MERN stack (MongoDB, Express, React, Node.js).

## Setup & Running

You have two separate directories: `frontend` (React + Vite) and `backend` (Express + MongoDB).

### 1. Start the Backend

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Make sure MongoDB is running locally on port `27017` (default), or update the `MONGO_URI` in `server.js` or through a `.env` file.
3. Start the server (runs on port 5000):
   ```bash
   node server.js
   ```

### 2. Start the Frontend

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open the Local URL provided by Vite (usually `http://localhost:5173`) in your browser to see the beautiful UI.

## Features Implemented:
- Premium Glassmorphism UI (Vanilla CSS)
- User Authentication Flow (Frontend Layout + Backend REST API)
- Dashboard View with summary cards and groups stub.
- Database Models for User, Groups, Expenses, and custom splits mapping.
- Extensible API routes with JWT token authentication.
