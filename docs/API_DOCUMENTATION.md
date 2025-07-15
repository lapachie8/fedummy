# Rental E-commerce Platform API Documentation

## Overview

This REST API provides comprehensive functionality for a rental e-commerce platform, including user management, product catalog, order processing, and transaction tracking.

**Base URL:** `http://localhost:3001/api`

**API Version:** 1.0.0

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this standard format:

```json
{
  "success": boolean,
  "message": "string",
  "data": object | array,
  "error": "string (only on errors)"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Endpoints

### Health Check

#### GET /api/health

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

## Authentication Endpoints

### Register User

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2024-01-20T10:30:00.000Z",
      "updatedAt": "2024-01-20T10:30:00.000Z"
    },
    "token": "jwt-token-string"
  }
}
```

### Login

#### POST /api/auth/login

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Admin Login:**
```json
{
  "email": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "admin",
      "email": "admin@juiweaprent.com",
      "name": "Administrator",
      "role": "admin",
      "createdAt": "2024-01-20T10:30:00.000Z",
      "updatedAt": "2024-01-20T10:30:00.000Z"
    },
    "token": "jwt-token-string"
  }
}
```

### Logout

#### POST /api/auth/logout

Logout user (token-based, no server-side session invalidation).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Endpoints

### Get User Profile

#### GET /api/users/profile

Get current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

### Update User Profile

#### PUT /api/users/profile

Update current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid-string",
    "email": "johnsmith@example.com",
    "name": "John Smith",
    "role": "user",
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:35:00.000Z"
  }
}
```

---

## Product Endpoints

### Get Products

#### GET /api/products

Get list of products with optional filtering and pagination.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `category` (string) - Filter by category
- `search` (string) - Search in name, description, category
- `available` (boolean) - Filter by availability

**Example:** `/api/products?page=1&limit=5&category=Anime&search=sword&available=true`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Feixiao Cosplay Set",
        "description": "Complete cosplay set for Honkai Star-Rail",
        "price": 150000,
        "priceUnit": "item",
        "category": "Honkai Star-Rail",
        "imageUrl": "/img/ayang.png",
        "available": true,
        "stock": 5,
        "createdAt": "2024-01-20T10:30:00.000Z",
        "updatedAt": "2024-01-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 12,
      "itemsPerPage": 5
    }
  }
}
```

### Get Product by ID

#### GET /api/products/:id

Get detailed information about a specific product.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Feixiao Cosplay Set",
    "description": "Complete cosplay set for Honkai Star-Rail",
    "price": 150000,
    "priceUnit": "item",
    "category": "Honkai Star-Rail",
    "imageUrl": "/img/ayang.png",
    "available": true,
    "stock": 5,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

### Create Product (Admin Only)

#### POST /api/products

Create a new product.

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "New Cosplay Item",
  "description": "Amazing cosplay item description",
  "price": 175000,
  "priceUnit": "item",
  "category": "Anime",
  "imageUrl": "/img/new-item.png",
  "available": true,
  "stock": 3
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 123,
    "name": "New Cosplay Item",
    "description": "Amazing cosplay item description",
    "price": 175000,
    "priceUnit": "item",
    "category": "Anime",
    "imageUrl": "/img/new-item.png",
    "available": true,
    "stock": 3,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

### Update Product (Admin Only)

#### PUT /api/products/:id

Update an existing product.

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 200000,
  "stock": 5,
  "available": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 123,
    "name": "Updated Product Name",
    "description": "Amazing cosplay item description",
    "price": 200000,
    "priceUnit": "item",
    "category": "Anime",
    "imageUrl": "/img/new-item.png",
    "available": true,
    "stock": 5,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:35:00.000Z"
  }
}
```

### Delete Product (Admin Only)

#### DELETE /api/products/:id

Delete a product.

**Headers:** `Authorization: Bearer <admin-token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Order Endpoints

### Create Order

#### POST /api/orders

Create a new rental order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "rentalDays": 3
    },
    {
      "productId": 2,
      "quantity": 2,
      "rentalDays": 7
    }
  ],
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "Jakarta",
    "postalCode": "12345"
  },
  "paymentMethod": "cash",
  "shippingMethod": "delivery"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "uuid-string",
      "userId": "user-uuid",
      "items": [
        {
          "product": {
            "id": 1,
            "name": "Feixiao Cosplay Set",
            "price": 150000
          },
          "quantity": 1,
          "rentalDays": 3,
          "price": 150000,
          "subtotal": 450000
        }
      ],
      "personalInfo": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "address": "123 Main St",
        "city": "Jakarta",
        "postalCode": "12345"
      },
      "paymentMethod": "cash",
      "shippingMethod": "delivery",
      "total": 450000,
      "status": "pending",
      "createdAt": "2024-01-20T10:30:00.000Z",
      "updatedAt": "2024-01-20T10:30:00.000Z",
      "dueDate": "2024-01-23T10:30:00.000Z"
    },
    "transaction": {
      "id": "TXN1705747800000",
      "orderId": "uuid-string",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "total": 450000,
      "status": "pending",
      "createdAt": "2024-01-20T10:30:00.000Z",
      "dueDate": "2024-01-23T10:30:00.000Z"
    }
  }
}
```

### Get User Orders

#### GET /api/orders

Get current user's orders with pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `status` (string) - Filter by status (pending, active, completed, cancelled)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid-string",
        "userId": "user-uuid",
        "items": [...],
        "personalInfo": {...},
        "paymentMethod": "cash",
        "shippingMethod": "delivery",
        "total": 450000,
        "status": "pending",
        "createdAt": "2024-01-20T10:30:00.000Z",
        "updatedAt": "2024-01-20T10:30:00.000Z",
        "dueDate": "2024-01-23T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 5,
      "itemsPerPage": 10
    }
  }
}
```

### Get Order by ID

#### GET /api/orders/:id

Get detailed information about a specific order.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "userId": "user-uuid",
    "items": [...],
    "personalInfo": {...},
    "paymentMethod": "cash",
    "shippingMethod": "delivery",
    "total": 450000,
    "status": "pending",
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z",
    "dueDate": "2024-01-23T10:30:00.000Z"
  }
}
```

---

## Transaction Endpoints (Admin Only)

### Get Transactions

#### GET /api/transactions

Get all transactions with pagination and filtering.

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `status` (string) - Filter by status

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TXN1705747800000",
        "orderId": "uuid-string",
        "customerName": "John Doe",
        "customerEmail": "john@example.com",
        "items": [...],
        "total": 450000,
        "status": "pending",
        "createdAt": "2024-01-20T10:30:00.000Z",
        "dueDate": "2024-01-23T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    },
    "summary": {
      "totalRevenue": 5000000,
      "totalTransactions": 50,
      "completedTransactions": 30,
      "pendingTransactions": 15,
      "activeTransactions": 5
    }
  }
}
```

### Update Transaction Status

#### PUT /api/transactions/:id/status

Update the status of a transaction.

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "status": "completed"
}
```

**Valid statuses:** `pending`, `active`, `completed`, `cancelled`

**Response (200):**
```json
{
  "success": true,
  "message": "Transaction status updated successfully",
  "data": {
    "id": "TXN1705747800000",
    "orderId": "uuid-string",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "total": 450000,
    "status": "completed",
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:35:00.000Z",
    "dueDate": "2024-01-23T10:30:00.000Z"
  }
}
```

---

## Utility Endpoints

### Get Categories

#### GET /api/categories

Get list of all product categories.

**Response (200):**
```json
{
  "success": true,
  "data": [
    "Honkai Star-Rail",
    "Anime",
    "Gaming",
    "Photography",
    "Cosplay Tools"
  ]
}
```

### Get Statistics (Admin Only)

#### GET /api/statistics

Get platform statistics and analytics.

**Headers:** `Authorization: Bearer <admin-token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 5000000,
      "thisMonth": 1200000
    },
    "users": {
      "total": 150,
      "newThisWeek": 12
    },
    "products": {
      "total": 25,
      "available": 20,
      "outOfStock": 5
    },
    "orders": {
      "total": 200,
      "recentOrders": 15,
      "pending": 10,
      "active": 25,
      "completed": 160
    }
  }
}
```

---

## Cart Management Endpoints

### Get User Cart

#### GET /api/cart

Get current user's cart items.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid-string",
        "product_id": 1,
        "quantity": 2,
        "rental_days": 3,
        "created_at": "2024-01-20T10:30:00.000Z",
        "name": "Feixiao Cosplay Set",
        "description": "Complete cosplay set",
        "price": 150000,
        "price_unit": "item",
        "category": "Honkai Star-Rail",
        "image_url": "/img/ayang.png",
        "available": true,
        "subtotal": 900000
      }
    ],
    "total": 900000,
    "itemCount": 2
  }
}
```

### Add Product to Cart

#### POST /api/cart

Add a product to user's cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2,
  "rentalDays": 3
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "data": {
    "id": "uuid-string",
    "product_id": 1,
    "quantity": 2,
    "rental_days": 3,
    "created_at": "2024-01-20T10:30:00.000Z",
    "name": "Feixiao Cosplay Set",
    "price": 150000,
    "subtotal": 900000
  }
}
```

### Update Cart Item

#### PUT /api/cart/:id

Update quantity or rental days of a cart item.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 3,
  "rentalDays": 5
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "id": "uuid-string",
    "product_id": 1,
    "quantity": 3,
    "rental_days": 5,
    "subtotal": 2250000
  }
}
```

### Remove Item from Cart

#### DELETE /api/cart/:id

Remove a specific item from cart.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

### Clear Cart

#### DELETE /api/cart

Remove all items from user's cart.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

## Security Considerations

1. **JWT Secret**: Change the JWT secret in production
2. **Password Hashing**: Passwords are hashed using bcrypt
3. **Input Validation**: Basic validation is implemented
4. **SQL Injection**: Not applicable (using in-memory storage)
5. **XSS Protection**: Implement on frontend
6. **HTTPS**: Use HTTPS in production