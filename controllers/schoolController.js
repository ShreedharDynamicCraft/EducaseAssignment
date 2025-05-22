const { query, insert } = require('../config/database');
const { calculateDistance } = require('../utils/geoUtils');

// Add a new school
const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    const result = await insert(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude
      }
    });
  } catch (error) {
    console.error('Error adding school:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add school',
      error: error.message
    });
  }
};

// List schools sorted by proximity
const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    // Get all schools
    const schools = await query('SELECT * FROM schools');
    
    if (!schools.length) {
      return res.status(200).json({
        success: true,
        message: 'No schools found',
        data: []
      });
    }

    // Calculate distance for each school and add it as a property
    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(
        userLat, userLng,
        school.latitude, school.longitude
      );
      return { ...school, distance };
    });

    // Sort schools by distance (closest first)
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
};

module.exports = {
  addSchool,
  listSchools
};
