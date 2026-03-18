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

// Enable CORS so frontend can talk to backend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
].filter(Boolean);

console.log('CORS allowed origins:', allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
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
const ticketRoutes = require('./routes/ticketRoutes');
const releaseRoutes = require('./routes/releaseRoutes');
const workflowRoutes = require('./routes/workflowRoutes');

app.use('/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/releases', releaseRoutes);
app.use('/api/workflows', workflowRoutes);

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
