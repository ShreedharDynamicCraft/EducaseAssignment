require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Ensure no authentication is required
app.use((req, res, next) => {
  // Skip authentication check
  next();
});

// Determine which database to use
let dbModule;
if (process.env.VERCEL === '1') {
  // Use JSON-based in-memory database for serverless
  dbModule = require('./config/database-json');
} else if (process.env.DB_TYPE === 'memory') {
  // Use in-memory SQLite
  dbModule = require('./config/database-serverless');
} else {
  // Use file-based SQLite
  dbModule = require('./config/database');
}

const { connect } = dbModule;

// Import routes with the appropriate database
const schoolRoutes = require('./routes/schoolRoutes')(dbModule);

// Apply routes with /api prefix
app.use('/api', schoolRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('School Management API is running. Use /api endpoints to access the API.');
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    message: 'School Management API is running',
    environment: process.env.VERCEL === '1' ? 'serverless' : 'standard',
    endpoints: [
      { method: 'POST', path: '/api/addSchool', description: 'Add a new school' },
      { method: 'GET', path: '/api/listSchools', description: 'List schools by proximity' },
      { method: 'GET', path: '/api/test', description: 'Test if API routes are working' }
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Handle server initialization based on environment
if (process.env.VERCEL === '1') {
  // For Vercel, just connect to database
  connect()
    .then(() => {
      console.log('Database connected for serverless environment');
    })
    .catch(err => {
      console.error('Failed to connect to database in serverless:', err);
    });
  
  // Export for serverless
  module.exports = app;
} else {
  // For regular Node.js server
  connect()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API is available at http://localhost:${PORT}/api`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    })
    .catch(err => {
      console.error('Failed to connect to database:', err);
      process.exit(1);
    });
}
