const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { validateAddSchool, validateListSchools } = require('../middleware/validation');
const { getOperationLogs } = require('../middleware/logger');

// Add logging middleware
router.use((req, res, next) => {
  console.log(`[API Request] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Add School route
router.post('/addSchool', validateAddSchool, schoolController.addSchool);

// List Schools route
router.get('/listSchools', validateListSchools, schoolController.listSchools);

// Test route to verify the router is working
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'School routes are working' });
});

// Debug route to check database
router.get('/debug/database', async (req, res) => {
  try {
    const { query } = require('../config/database');
    const schools = await query('SELECT * FROM schools');
    res.json({ 
      message: 'Database query successful',
      count: schools.length,
      schools 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get school-related operation logs
router.get('/schoolLogs', (req, res) => {
  const allLogs = getOperationLogs();
  
  // Filter logs related to school operations
  const schoolLogs = allLogs.filter(log => {
    return log.request.url.includes('/addSchool') || 
           log.request.url.includes('/listSchools');
  });
  
  res.json({
    total: schoolLogs.length,
    logs: schoolLogs
  });
});

module.exports = router;
