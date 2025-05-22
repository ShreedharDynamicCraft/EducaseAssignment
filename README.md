# School Management API

A Node.js API for managing school data with location-based sorting capabilities.

## Features

- Add new schools with name, address, and geographical coordinates
- List schools sorted by proximity to a user's location
- Input validation for all API endpoints
- SQLite database for local development
- In-memory data storage for serverless deployment
- Comprehensive error handling

## Tech Stack

- Node.js
- Express.js
- SQLite (local development)
- In-memory JSON storage (serverless)
- Joi (for validation)
- dotenv (for environment variables)

## Installation and Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd EducaseAssignment
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DB_TYPE=json        # Use 'json' for in-memory or 'sqlite' for file storage
   DB_FILE=./database.sqlite
   LOG_OPERATIONS=false
   VERCEL=0            # Set to 1 when deploying to Vercel
   ```

4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Add School
- **URL**: `/api/addSchool`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "School Name",
    "address": "School Address",
    "latitude": 34.0522,
    "longitude": -118.2437
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "School added successfully",
    "data": {
      "id": 1,
      "name": "School Name",
      "address": "School Address",
      "latitude": 34.0522,
      "longitude": -118.2437
    }
  }
  ```

### List Schools
- **URL**: `/api/listSchools?latitude=34.0522&longitude=-118.2437`
- **Method**: GET
- **Query Parameters**:
  - `latitude`: User's latitude (required)
  - `longitude`: User's longitude (required)
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Schools retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "School Name",
        "address": "School Address",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "distance": 0
      },
      // More schools sorted by distance...
    ]
  }
  ```

### Operation Logs
- **URL**: `/api/logs`
- **Method**: GET
- **Success Response**:
  ```json
  {
    "total": 5,
    "logs": [
      {
        "request": {
          "timestamp": "2023-05-22T10:15:30.123Z",
          "method": "POST",
          "url": "/api/addSchool",
          "body": {
            "name": "Test School",
            "address": "123 Test Street",
            "latitude": 34.0522,
            "longitude": -118.2437
          }
        },
        "response": {
          "timestamp": "2023-05-22T10:15:30.456Z",
          "statusCode": 201,
          "responseBody": "{\"success\":true,\"message\":\"School added successfully\",\"data\":{\"id\":1,\"name\":\"Test School\",\"address\":\"123 Test Street\",\"latitude\":34.0522,\"longitude\":-118.2437}}",
          "responseTime": 333
        }
      },
      // More operation logs...
    ]
  }
  ```

### Health Check
- **URL**: `/api/health`
- **Method**: GET
- **Success Response**:
  ```json
  {
    "status": "healthy", 
    "timestamp": "2023-05-22T10:15:30.123Z"
  }
  ```

## Testing

A Postman collection is included in the `/postman` directory for testing the API endpoints. Import this collection into Postman to get started.

### Postman Testing Instructions

1. Import the collection from `/postman/School_Management_API.postman_collection.json`
2. Set up an environment with `baseUrl` variable set to:
   - Local: `http://localhost:5000`
   - Production: `https://educase-assignment-btqhz25dh-shreedhar-anands-projects.vercel.app`
3. Test all endpoints as described in the collection documentation

## Deployment

### Local Deployment

To run the API locally:
1. Clone the repository
2. Install dependencies with `npm install`
3. Configure environment variables in `.env` file
4. Run `npm start` to start the server
5. Access the API at http://localhost:5000/api

### Vercel Deployment

The API is deployed on Vercel. Here's how to deploy your own instance:

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

4. Deploy to production:
   ```
   vercel --prod
   ```

Current production URL: [https://educase-assignment-btqhz25dh-shreedhar-anands-projects.vercel.app](https://educase-assignment-btqhz25dh-shreedhar-anands-projects.vercel.app)

## Technical Implementation Notes

- **Database**: SQLite for local development, in-memory data store for Vercel deployment
- **Distance Calculation**: Haversine formula for accurate geographical distance measurement
- **Logging**: Request/response logging with timestamps and performance metrics
- **Validation**: All API inputs are validated with Joi schema validation
- **Error Handling**: Structured error responses with appropriate HTTP status codes
- **Environment Detection**: Automatically detects and adapts to different environments (local vs serverless)

## License

[MIT](LICENSE)
# EducaseAssignment
