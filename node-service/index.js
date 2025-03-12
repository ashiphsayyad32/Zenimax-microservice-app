const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const categoryRoutes = require('./routes/categoryRoutes');
const todoRoutes = require('./routes/todoRoutes');

// Import database configuration
const { initializeDatabase } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', categoryRoutes);
app.use('/api', todoRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Node.js service running on port ${PORT}`);
  const dbInitialized = await initializeDatabase();
  if (dbInitialized) {
    console.log('Database initialized successfully');
  } else {
    console.error('Failed to initialize database');
  }
});
