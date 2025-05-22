const express = require('express');
const cors = require('cors');

// Simple in-memory database
const schools = [
  {
    id: 1,
    name: 'Central High School',
    address: '123 Education Street, City',
    latitude: 34.0522,
    longitude: -118.2437,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Lincoln Elementary',
    address: '456 Learning Avenue, City',
    latitude: 34.0550,
    longitude: -118.2500,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Washington Middle School',
    address: '789 Knowledge Road, City',
    latitude: 34.0480,
    longitude: -118.2350,
    created_at: new Date().toISOString()
  }
];

let nextId = 4;

// Calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Basic validation
function validateSchoolInput(body) {
  const { name, address, latitude, longitude } = body;
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('School name is required and should be at least 2 characters');
  }
  
  if (!address || address.trim().length < 5) {
    errors.push('Address is required and should be at least 5 characters');
  }
  
  if (latitude === undefined || isNaN(parseFloat(latitude)) || 
      parseFloat(latitude) < -90 || parseFloat(latitude) > 90) {
    errors.push('Latitude must be a number between -90 and 90');
  }
  
  if (longitude === undefined || isNaN(parseFloat(longitude)) || 
      parseFloat(longitude) < -180 || parseFloat(longitude) > 180) {
    errors.push('Longitude must be a number between -180 and 180');
  }
  
  return errors;
}

// Create express app
const app = express();
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('School Management API is running on Vercel');
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'School Management API is running on Vercel',
    endpoints: [
      { method: 'POST', path: '/api/addSchool', description: 'Add a new school' },
      { method: 'GET', path: '/api/listSchools', description: 'List schools by proximity' },
      { method: 'GET', path: '/api/test', description: 'Test if API routes are working' }
    ]
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'School routes are working' });
});

// Add School endpoint
app.post('/api/addSchool', (req, res) => {
  try {
    const errors = validateSchoolInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.join(', ')
      });
    }
    
    const { name, address, latitude, longitude } = req.body;
    const newSchool = {
      id: nextId++,
      name,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      created_at: new Date().toISOString()
    };
    
    schools.push(newSchool);
    
    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: newSchool
    });
  } catch (error) {
    console.error('Error adding school:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add school',
      error: error.message
    });
  }
});

// List Schools endpoint
app.get('/api/listSchools', (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude || 
        isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude)) ||
        parseFloat(latitude) < -90 || parseFloat(latitude) > 90 ||
        parseFloat(longitude) < -180 || parseFloat(longitude) > 180) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'Valid latitude and longitude are required'
      });
    }
    
    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);
    
    // Calculate distance for each school
    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(
        userLat, userLng,
        school.latitude, school.longitude
      );
      return { ...school, distance };
    });
    
    // Sort by distance
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    
    return res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      data: schoolsWithDistance
    });
  } catch (error) {
    console.error('Error listing schools:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve schools',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;
