const fs = require('fs');
const path = require('path');

// Sample data for serverless environment
const sampleSchools = [
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

// In-memory database for serverless environments
let schools = [...sampleSchools];
let nextId = 4;

// Function to initialize database
function connect() {
  return Promise.resolve(true);
}

// Helper function to get all schools
function query() {
  return Promise.resolve(schools);
}

// Helper function to add a school
function insert(_, params) {
  const [name, address, latitude, longitude] = params;
  
  const newSchool = {
    id: nextId++,
    name,
    address,
    latitude,
    longitude,
    created_at: new Date().toISOString()
  };
  
  schools.push(newSchool);
  return Promise.resolve({ insertId: newSchool.id });
}

module.exports = {
  connect,
  query,
  insert
};
