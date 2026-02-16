/**
 * app.js
 * -------------
 * This file defines the Express application.
 * It sets up:
 * - Middleware
 * - CORS configuration
 * - Routes
 * - Global error handling
 *
 * IMPORTANT:
 * app.js does NOT start the server.
 * index.js is responsible for starting the server.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// =======================
// Initialize Express App
// =======================
const app = express();

// =======================
// Global Middleware
// =======================

// Parse incoming JSON requests
app.use(express.json());

// Parse cookies (used for JWT auth later)
app.use(cookieParser());

// Enable CORS so frontend (Vite on port 5173) can talk to backend
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

// =======================
// ROUTES (SAFE START)
// =======================

// Health check route
// This is used to confirm backend is running
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Clarity backend is running'
  });
});

// -----------------------
// Auth routes (enable ONLY when file exists)
// -----------------------
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
app.use('/auth', authRoutes);

/**
 * NOTE:
 * The following routes are intentionally NOT mounted yet.
 * We will enable them one-by-one AFTER implementing them.
 *
 * This prevents "Cannot find module" crashes.
 */

app.use('/api/projects', projectRoutes);
// app.use('/api/decisions', decisionRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/outcomes', outcomeRoutes);

// =======================
// Global Error Handler
// =======================
// Any error passed with next(err) will land here
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);

  res.status(500).json({
    error: 'Internal Server Error'
  });
});

// =======================
// Export Express App
// =======================
module.exports = app;
