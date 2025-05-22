const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create logs directory if it doesn't exist
const logFile = process.env.LOG_FILE || './operations.log';
const logDir = path.dirname(logFile);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Logger middleware function
const loggerMiddleware = (req, res, next) => {
  // Original send function
  const originalSend = res.send;
  
  // Request timestamp
  const timestamp = new Date().toISOString();
  
  // Request details
  const requestLog = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined,
    headers: req.headers
  };
  
  // Log request
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Override send to intercept the response
  res.send = function(body) {
    // Convert body to string if it's an object
    const responseBody = typeof body === 'object' ? JSON.stringify(body) : body;
    
    // Response details
    const responseLog = {
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode,
      responseBody: responseBody,
      responseTime: new Date() - new Date(timestamp)
    };
    
    // Create complete log entry
    const logEntry = {
      request: requestLog,
      response: responseLog
    };
    
    // Write to log file if enabled
    if (process.env.LOG_OPERATIONS === 'true') {
      fs.appendFile(
        logFile, 
        JSON.stringify(logEntry, null, 2) + ',\n', 
        (err) => {
          if (err) console.error('Error writing to log file:', err);
        }
      );
    }
    
    // Continue with the original send
    return originalSend.call(this, body);
  };
  
  next();
};

// Function to get operation logs
const getOperationLogs = () => {
  try {
    if (fs.existsSync(logFile)) {
      const logContent = fs.readFileSync(logFile, 'utf8');
      // Parse the logs (handling the trailing comma)
      const logsText = '[' + logContent.replace(/,\s*$/, '') + ']';
      return JSON.parse(logsText);
    }
    return [];
  } catch (error) {
    console.error('Error reading log file:', error);
    return [];
  }
};

module.exports = {
  loggerMiddleware,
  getOperationLogs
};
