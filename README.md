# School Management API

A Node.js API for managing school data with location-based sorting capabilities.

## Features

- Add new schools with name, address, and geographical coordinates
- List schools sorted by proximity to a user's location
- Input validation for all API endpoints
- SQLite database for data persistence
- Operation logging for monitoring requests and responses

## Tech Stack

- Node.js
- Express.js
- SQLite
- Joi (for validation)
- dotenv (for environment variables)
- morgan (for logging)

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
   PORT=3000
   DB_TYPE=sqlite
   DB_FILE=./database.sqlite
   LOG_OPERATIONS=true
   LOG_FILE=./operations.log
   ```

4. Set up the database:
   (The application will create the necessary tables on startup)

5. Start the server:
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

### School Operation Logs
- **URL**: `/api/schoolLogs`
- **Method**: GET
- **Description**: Retrieves logs specific to school operations (adding and listing schools)

## Testing

A Postman collection is included in the `/postman` directory for testing the API endpoints. Import this collection into Postman to get started.

### Postman Testing Instructions

1. Import the collection from `/postman/School_Management_API.postman_collection.json`
2. Set up an environment with `baseUrl` variable set to `http://localhost:5000`
3. Test the following endpoints:
   - `GET {{baseUrl}}/api/test` - Verify API is working
   - `POST {{baseUrl}}/api/addSchool` - Add a new school
   - `GET {{baseUrl}}/api/listSchools?latitude=34.0522&longitude=-118.2437` - List schools by proximity
   - `GET {{baseUrl}}/api/logs` - View all operation logs
   - `GET {{baseUrl}}/api/schoolLogs` - View school-related operation logs

## Deployment

To deploy this application:

1. Set up a Node.js environment on your hosting service
2. Configure the SQLite database location (or switch to a production database)
3. Set the appropriate environment variables in `.env`:
   ```
   PORT=5000
   DB_TYPE=sqlite
   DB_FILE=./database.sqlite
   LOG_OPERATIONS=true
   LOG_FILE=./operations.log
   ```
4. Build and start the application with `npm start`

## Technical Implementation Notes

- **Database**: SQLite is used for data storage (originally planned with MySQL)
- **Distance Calculation**: Haversine formula for accurate geographical distance measurement
- **Logging**: Comprehensive request/response logging with timestamps and performance metrics
- **Validation**: All API inputs are validated with Joi schema validation
- **Error Handling**: Structured error responses with appropriate HTTP status codes

## License

[MIT](LICENSE)
# EducaseAssignment
