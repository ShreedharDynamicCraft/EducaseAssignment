require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('./config/database');
const { loggerMiddleware, getOperationLogs } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware); // Add logger middleware

// Import routes
const schoolRoutes = require('./routes/schoolRoutes');

// Apply routes with /api prefix
app.use('/api', schoolRoutes);

// Root route for basic server check
app.get('/', (req, res) => {
  res.send('School Management API Server is running. Use /api endpoints to access the API.');
});

// Root API route for API check
app.get('/api', (req, res) => {
  res.json({
    message: 'School Management API is running',
    endpoints: [
      { method: 'POST', path: '/api/addSchool', description: 'Add a new school' },
      { method: 'GET', path: '/api/listSchools', description: 'List schools by proximity' },
      { method: 'GET', path: '/api/test', description: 'Test if API routes are working' },
      { method: 'GET', path: '/api/logs', description: 'View operation logs' }
    ]
  });
});

// Route to get operation logs
app.get('/api/logs', (req, res) => {
  const logs = getOperationLogs();
  res.json({
    total: logs.length,
    logs
  });
});

// Database connection and server initialization
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API is available at http://localhost:${PORT}/api`);
      console.log(`Operation logs will be stored at ${process.env.LOG_FILE || './operations.log'}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
