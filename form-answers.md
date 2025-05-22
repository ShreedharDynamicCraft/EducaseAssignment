# School Management API - Assignment Submission

## Personal Information

1. **Name**: [Your Name]

2. **Rate your skills with Node.Js**: Good (4/5)

3. **Resume link**: [Your Resume Link]

4. **Contact number**: [Your Contact Number]

5. **Email ID**: [Your Email Address]

## Deliverables

6. **Deliverable 1 - Source code repository with complete API implementation**:
   GitHub Repository: https://github.com/[your-username]/school-management-api
   
   The repository contains a complete Node.js API implementation for school management with the following features:
   - Express.js framework for API development
   - SQLite database (initially attempted with MySQL but switched due to connection issues)
   - Input validation using Joi
   - Proximity-based sorting using the Haversine formula
   - Comprehensive error handling
   - API documentation
   - Operation logging for all requests and responses
   - Deployed on Vercel for easy access and testing

## Hosting on Vercel (Command Line Deployment)

I've deployed the API on Vercel using their command-line interface for a streamlined deployment process. Here's the exact process I followed:

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Create Vercel Configuration File

Create a `vercel.json` file in the project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "DB_TYPE": "sqlite",
    "LOG_OPERATIONS": "true"
  }
}
```

### 3. Login to Vercel from Command Line

```bash
vercel login
```

### 4. Deploy to Vercel

From the project directory, run:

```bash
vercel
```

This starts an interactive deployment process:
- Select your Vercel scope/account
- Confirm the project name or provide a custom name
- Choose to link to an existing project or create a new one
- Confirm the deployment directory

### 5. Set Environment Variables

```bash
vercel env add DB_TYPE sqlite
vercel env add LOG_OPERATIONS true
```

### 6. Deploy to Production

```bash
vercel --prod
```

After deployment, Vercel provides a URL where your API is hosted, typically in the format:
`https://school-management-api-[username].vercel.app`

### 7. Verify Deployment

Test your API with curl commands:

```bash
# Check API status
curl https://school-management-api-[username].vercel.app/api

# Test API functionality
curl https://school-management-api-[username].vercel.app/api/test

# Add a school
curl -X POST https://school-management-api-[username].vercel.app/api/addSchool \
  -H "Content-Type: application/json" \
  -d '{"name":"Test School","address":"123 Test Street","latitude":34.0522,"longitude":-118.2437}'

# List schools
curl "https://school-management-api-[username].vercel.app/api/listSchools?latitude=34.0522&longitude=-118.2437"
```

### 8. Monitor Deployments

```bash
# List deployments
vercel ls

# Get deployment logs
vercel logs https://school-management-api-[username].vercel.app
```

The live API is now accessible at: https://school-management-api-[username].vercel.app/api

### API Testing on Vercel

You can test the live API endpoints using the same Postman collection, just update the baseUrl variable to:
```
https://school-management-api-[your-username].vercel.app
```

For quick testing without Postman, you can use these URLs:
- API Status: https://school-management-api-[your-username].vercel.app/api
- API Test: https://school-management-api-[your-username].vercel.app/api/test
- List Schools: https://school-management-api-[your-username].vercel.app/api/listSchools?latitude=34.0522&longitude=-118.2437

### Vercel Deployment Advantages

- **Free Tier**: Generous free tier suitable for this project
- **Automatic HTTPS**: Secure API endpoints by default
- **Global CDN**: Fast response times from anywhere in the world
- **CI/CD Pipeline**: Automatic deployments from GitHub
- **Serverless Architecture**: Scales automatically based on traffic
- **Deployment Previews**: Each pull request can have its own preview deployment

## Data Models and Schemas

### Database Schema

The application uses the following SQLite table schema:

```sql
CREATE TABLE IF NOT EXISTS schools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Validation Schemas

For the Add School API:

```javascript
const addSchoolSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(255)
    .messages({
      'string.empty': 'School name is required',
      'string.min': 'School name should be at least 2 characters',
      'any.required': 'School name is required'
    }),
  address: Joi.string().required().trim().min(5).max(255)
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address should be at least 5 characters',
      'any.required': 'Address is required'
    }),
  latitude: Joi.number().required().min(-90).max(90)
    .messages({
      'number.base': 'Latitude must be a number',
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required'
    }),
  longitude: Joi.number().required().min(-180).max(180)
    .messages({
      'number.base': 'Longitude must be a number',
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required'
    })
});
```

For the List Schools API:

```javascript
const listSchoolsSchema = Joi.object({
  latitude: Joi.number().required().min(-90).max(90)
    .messages({
      'number.base': 'Latitude must be a number',
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required'
    }),
  longitude: Joi.number().required().min(-180).max(180)
    .messages({
      'number.base': 'Longitude must be a number',
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required'
    })
});
```

### Response Schemas

Add School Success Response:
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

List Schools Success Response:
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
      "created_at": "2023-05-22 07:15:30",
      "distance": 0
    }
  ]
}
```

Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Implementation Notes

- **Database**: SQLite was used instead of MySQL due to connection issues, but maintains identical functionality
- **Distance Calculation**: Implemented using the Haversine formula for accurate geographical distance
- **Validation**: All input fields are validated for proper format, non-empty values, and correct data types
- **Error Handling**: Comprehensive error handling with descriptive messages
- **Testing**: API has been thoroughly tested with various data scenarios

## Hosting Instructions

To run the API locally:
1. Clone the repository
2. Run `npm install` to install dependencies
3. Configure environment variables in `.env` file
4. Run `npm start` to start the server
5. Access the API at http://localhost:5000/api

The live version is hosted at [Your Hosting URL].

## Postman Testing Instructions

### Setting Up Postman for API Testing

1. **Install Postman**:
   - Download and install Postman from [postman.com/downloads](https://www.postman.com/downloads/)
   - Launch the application and create a free account if you don't have one

2. **Import the Collection**:
   - Open Postman
   - Click "Import" in the top-left corner
   - Select "Upload Files" and choose the `School_Management_API.postman_collection.json` file from the `/Users/shreedhar/Assignment/EducaseAssignment/postman/` directory
   - Click "Import" to add the collection to your workspace

3. **Set Up Environment Variables**:
   - Click on "Environments" in the left sidebar
   - Click "Create Environment" and name it "School Management Local"
   - Add a variable named `baseUrl` with the value `http://localhost:5000`
   - Click "Save"
   - Select this environment from the dropdown in the top-right corner

### Testing the API Endpoints

#### Test 1: Verify API is Running

1. Open the "School Management API" collection
2. Select the "Test" request or create a new GET request to `{{baseUrl}}/api/test`
3. Click "Send"
4. Expected response (200 OK):
   ```json
   {
     "message": "School routes are working"
   }
   ```

#### Test 2: Add a New School

1. Open the "Add School" request 
2. Verify the following settings:
   - Method: POST
   - URL: `{{baseUrl}}/api/addSchool`
   - Headers: Content-Type: application/json
   - Body (raw JSON):
   ```json
   {
     "name": "Central High School",
     "address": "123 Education Street, City",
     "latitude": 34.0522,
     "longitude": -118.2437
   }
   ```
3. Click "Send"
4. Expected response (201 Created):
   ```json
   {
     "success": true,
     "message": "School added successfully",
     "data": {
       "id": 1,
       "name": "Central High School",
       "address": "123 Education Street, City",
       "latitude": 34.0522,
       "longitude": -118.2437
     }
   }
   ```

#### Test 3: Add Another School with Different Coordinates

1. Duplicate the "Add School" request by right-clicking and selecting "Duplicate"
2. Update the request body:
   ```json
   {
     "name": "Lincoln Elementary",
     "address": "456 Learning Avenue, City",
     "latitude": 34.0550,
     "longitude": -118.2500
   }
   ```
3. Click "Send"
4. Verify you receive a success response with a new ID

#### Test 4: List Schools by Proximity

1. Open the "List Schools" request
2. Verify the following settings:
   - Method: GET
   - URL: `{{baseUrl}}/api/listSchools?latitude=34.0522&longitude=-118.2437`
3. Click "Send"
4. Expected response (200 OK):
   ```json
   {
     "success": true,
     "message": "Schools retrieved successfully",
     "data": [
       {
         "id": 1,
         "name": "Central High School",
         "address": "123 Education Street, City",
         "latitude": 34.0522,
         "longitude": -118.2437,
         "distance": 0
       },
       {
         "id": 2,
         "name": "Lincoln Elementary",
         "address": "456 Learning Avenue, City",
         "latitude": 34.0550,
         "longitude": -118.2500,
         "distance": 0.65
       }
     ]
   }
   ```
   Note: The schools will be sorted by distance, with the closest school first.

#### Test 5: List Schools from Different Location

1. Duplicate the "List Schools" request
2. Change the query parameters to:
   `?latitude=34.0550&longitude=-118.2500`
3. Click "Send"
4. Verify that the sorting has changed, with Lincoln Elementary now being closer

#### Test 6: Test Validation Error

1. Duplicate the "Add School" request
2. Modify the request body to have invalid data:
   ```json
   {
     "name": "",
     "address": "Invalid School",
     "latitude": 200,
     "longitude": -118.2437
   }
   ```
3. Click "Send"
4. Expected response (400 Bad Request):
   ```json
   {
     "success": false,
     "message": "Validation failed",
     "error": "School name is required, Latitude must be between -90 and 90"
   }
   ```

### Advanced Testing

#### Adding Test Scripts

Postman allows you to add test scripts that run after your request. Here's how to add a basic test for the "Add School" endpoint:

1. Open the "Add School" request
2. Click on the "Scripts" tab
3. In the "Tests" section (post-response script area), add the following script:
   ```javascript
   pm.test("Status code is 201", function () {
     pm.response.to.have.status(201);
   });

   pm.test("Response has correct structure", function () {
     const responseJson = pm.response.json();
     pm.expect(responseJson).to.have.property('success');
     pm.expect(responseJson).to.have.property('message');
     pm.expect(responseJson).to.have.property('data');
     pm.expect(responseJson.data).to.have.property('id');
   });
   ```
4. Click "Send" and check the "Test Results" tab at the bottom to see if your tests passed

#### Using Pre-request Scripts

You can also use pre-request scripts to set up data before making a request:

1. Open the "Add School" request
2. Click on the "Scripts" tab
3. In the "Pre-request Script" section, add:
   ```javascript
   // Generate a random school name to avoid duplicates
   const randomNum = Math.floor(Math.random() * 1000);
   pm.variables.set("schoolName", "Test School " + randomNum);
   ```
4. Modify your request body to use this variable:
   ```json
   {
     "name": "{{schoolName}}",
     "address": "123 Education Street, City",
     "latitude": 34.0522,
     "longitude": -118.2437
   }
   ```
5. Click "Send" and observe that each request creates a school with a unique name

#### Creating a Collection Runner

To run all tests at once:

1. Click on the "..." next to your collection name
2. Select "Run collection"
3. Select which requests to include
4. Click "Run" to execute all requests in sequence

This allows you to quickly verify that all endpoints are functioning correctly
