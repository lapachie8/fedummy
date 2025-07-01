# API Testing Guide

## Overview

This guide provides comprehensive instructions for testing the Rental E-commerce Platform API using various tools and methods.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **API Testing Tool** (choose one):
   - Postman (recommended)
   - Insomnia
   - cURL
   - Thunder Client (VS Code extension)

## Setup

### 1. Start the API Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server
npm run dev
```

The API will be available at: `http://localhost:3001`

### 2. Environment Variables

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

## Testing Tools Setup

### Postman Collection

Import the following collection into Postman:

```json
{
  "info": {
    "name": "Rental E-commerce API",
    "description": "Complete API testing collection",
    "version": "1.0.0"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001/api"
    },
    {
      "key": "userToken",
      "value": ""
    },
    {
      "key": "adminToken",
      "value": ""
    }
  ]
}
```

### Environment Setup in Postman

1. Create a new environment called "Development"
2. Add these variables:
   - `baseUrl`: `http://localhost:3001/api`
   - `userToken`: (will be set after login)
   - `adminToken`: (will be set after admin login)

## Test Scenarios

### 1. Health Check

**Purpose**: Verify API is running

**cURL:**
```bash
curl -X GET http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 2. User Registration

**Purpose**: Create a new user account

**cURL:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testPassword123",
    "name": "Test User"
  }'
```

**Postman:**
- Method: POST
- URL: `{{baseUrl}}/auth/register`
- Body (JSON):
```json
{
  "email": "testuser@example.com",
  "password": "testPassword123",
  "name": "Test User"
}
```

**Test Script (Postman):**
```javascript
pm.test("Registration successful", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.token).to.exist;
    
    // Save token for future requests
    pm.environment.set("userToken", response.data.token);
});
```

### 3. User Login

**Purpose**: Authenticate user and get access token

**cURL:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testPassword123"
  }'
```

**Admin Login cURL:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin",
    "password": "admin123"
  }'
```

**Test Script (Postman):**
```javascript
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.token).to.exist;
    
    // Save token based on user role
    if (response.data.user.role === "admin") {
        pm.environment.set("adminToken", response.data.token);
    } else {
        pm.environment.set("userToken", response.data.token);
    }
});
```

### 4. Get Products

**Purpose**: Retrieve product list with filtering

**cURL:**
```bash
# Get all products
curl -X GET http://localhost:3001/api/products

# Get products with filters
curl -X GET "http://localhost:3001/api/products?page=1&limit=5&category=Anime&search=sword&available=true"
```

**Postman:**
- Method: GET
- URL: `{{baseUrl}}/products`
- Query Parameters:
  - `page`: 1
  - `limit`: 5
  - `category`: Anime
  - `search`: sword
  - `available`: true

**Test Script (Postman):**
```javascript
pm.test("Products retrieved successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.products).to.be.an('array');
    pm.expect(response.data.pagination).to.exist;
});
```

### 5. Get User Profile

**Purpose**: Retrieve authenticated user's profile

**cURL:**
```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Postman:**
- Method: GET
- URL: `{{baseUrl}}/users/profile`
- Headers: `Authorization: Bearer {{userToken}}`

**Test Script (Postman):**
```javascript
pm.test("Profile retrieved successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.email).to.exist;
    pm.expect(response.data.name).to.exist;
});
```

### 6. Create Product (Admin Only)

**Purpose**: Add a new product to the catalog

**cURL:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Test Cosplay Item",
    "description": "A test cosplay item for API testing",
    "price": 175000,
    "priceUnit": "item",
    "category": "Anime",
    "imageUrl": "/img/test-item.png",
    "available": true,
    "stock": 5
  }'
```

**Test Script (Postman):**
```javascript
pm.test("Product created successfully", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.id).to.exist;
    
    // Save product ID for future tests
    pm.environment.set("testProductId", response.data.id);
});
```

### 7. Create Order

**Purpose**: Place a rental order

**cURL:**
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 1,
        "rentalDays": 3
      }
    ],
    "personalInfo": {
      "fullName": "Test User",
      "email": "testuser@example.com",
      "phone": "+1234567890",
      "address": "123 Test Street",
      "city": "Jakarta",
      "postalCode": "12345"
    },
    "paymentMethod": "cash",
    "shippingMethod": "delivery"
  }'
```

**Test Script (Postman):**
```javascript
pm.test("Order created successfully", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.order.id).to.exist;
    pm.expect(response.data.transaction.id).to.exist;
    
    // Save order and transaction IDs
    pm.environment.set("testOrderId", response.data.order.id);
    pm.environment.set("testTransactionId", response.data.transaction.id);
});
```

### 8. Get Transactions (Admin Only)

**Purpose**: Retrieve transaction list for admin dashboard

**cURL:**
```bash
curl -X GET "http://localhost:3001/api/transactions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Test Script (Postman):**
```javascript
pm.test("Transactions retrieved successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.transactions).to.be.an('array');
    pm.expect(response.data.summary).to.exist;
});
```

### 9. Update Transaction Status (Admin Only)

**Purpose**: Change transaction status

**cURL:**
```bash
curl -X PUT http://localhost:3001/api/transactions/YOUR_TRANSACTION_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "status": "completed"
  }'
```

**Test Script (Postman):**
```javascript
pm.test("Transaction status updated", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.status).to.equal("completed");
});
```

## Error Testing Scenarios

### 1. Unauthorized Access

**Test**: Access protected endpoint without token

**cURL:**
```bash
curl -X GET http://localhost:3001/api/users/profile
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 2. Invalid Credentials

**Test**: Login with wrong password

**cURL:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 3. Validation Errors

**Test**: Create product with missing fields

**cURL:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Test Product"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Name, description, price, and category are required"
}
```

### 4. Resource Not Found

**Test**: Get non-existent product

**cURL:**
```bash
curl -X GET http://localhost:3001/api/products/99999
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 5. Forbidden Access

**Test**: User trying to access admin endpoint

**cURL:**
```bash
curl -X GET http://localhost:3001/api/transactions \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

## Automated Testing with Newman

### Install Newman

```bash
npm install -g newman
```

### Run Collection

```bash
newman run postman_collection.json -e environment.json
```

## Performance Testing

### Load Testing with Artillery

**Install Artillery:**
```bash
npm install -g artillery
```

**Create test configuration (artillery.yml):**
```yaml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/health"
      - get:
          url: "/api/products"
```

**Run load test:**
```bash
artillery run artillery.yml
```

## Integration Testing

### Jest Test Example

```javascript
const request = require('supertest');
const app = require('../index');

describe('API Integration Tests', () => {
  let userToken;
  let adminToken;

  beforeAll(async () => {
    // Login as admin
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin',
        password: 'admin123'
      });
    adminToken = adminResponse.body.data.token;

    // Register and login as user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    const userResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    userToken = userResponse.body.data.token;
  });

  test('GET /api/health should return 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('GET /api/products should return products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body.data.products).toBeInstanceOf(Array);
  });

  test('POST /api/products should create product (admin only)', async () => {
    const productData = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100000,
      category: 'Test Category'
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(productData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

## Troubleshooting

### Common Issues

1. **Server not starting**: Check if port 3001 is available
2. **Token expired**: Re-login to get new token
3. **CORS errors**: Ensure CORS is properly configured
4. **Database errors**: Check if in-memory storage is working

### Debug Mode

Start server with debug logging:
```bash
DEBUG=* npm run dev
```

### API Logs

Monitor server logs for request/response details and errors.

## Best Practices

1. **Test in sequence**: Some tests depend on previous test results
2. **Clean up**: Reset test data between test runs
3. **Use environment variables**: Don't hardcode URLs or tokens
4. **Test edge cases**: Include boundary value testing
5. **Validate responses**: Check both success and error scenarios
6. **Performance testing**: Test under load conditions
7. **Security testing**: Test authentication and authorization
8. **Documentation**: Keep test documentation updated

## Continuous Integration

### GitHub Actions Example

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - run: newman run postman_collection.json
```

This comprehensive testing guide ensures your API is thoroughly tested and production-ready.