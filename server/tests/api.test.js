const request = require('supertest');
const app = require('../index');

describe('Rental E-commerce API Tests', () => {
  let userToken;
  let adminToken;
  let testProductId;
  let testOrderId;
  let testTransactionId;

  // Setup: Login as admin and create user
  beforeAll(async () => {
    // Login as admin
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin',
        password: 'admin123'
      });
    
    expect(adminResponse.status).toBe(200);
    adminToken = adminResponse.body.data.token;

    // Register and login as user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    if (registerResponse.status === 201) {
      userToken = registerResponse.body.data.token;
    } else {
      // User might already exist, try login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      userToken = loginResponse.body.data.token;
    }
  });

  describe('Health Check', () => {
    test('GET /api/health should return 200', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API is running');
    });
  });

  describe('Authentication', () => {
    test('POST /api/auth/register should create new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'newpassword123',
        name: 'New User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
    });

    test('POST /api/auth/login should authenticate user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    test('POST /api/auth/login should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Products', () => {
    test('GET /api/products should return products list', async () => {
      const response = await request(app).get('/api/products');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toBeInstanceOf(Array);
      expect(response.body.data.pagination).toBeDefined();
    });

    test('GET /api/products with filters should work', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({
          page: 1,
          limit: 5,
          category: 'Anime',
          available: true
        });
      
      expect(response.status).toBe(200);
      expect(response.body.data.products).toBeInstanceOf(Array);
    });

    test('GET /api/products/:id should return specific product', async () => {
      const response = await request(app).get('/api/products/1');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
    });

    test('GET /api/products/:id should return 404 for non-existent product', async () => {
      const response = await request(app).get('/api/products/99999');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
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
      expect(response.body.data.name).toBe(productData.name);
      
      testProductId = response.body.data.id;
    });

    test('POST /api/products should reject unauthorized access', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100000,
        category: 'Test Category'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('PUT /api/products/:id should update product (admin only)', async () => {
      const updateData = {
        name: 'Updated Test Product',
        price: 150000
      };

      const response = await request(app)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });
  });

  describe('User Profile', () => {
    test('GET /api/users/profile should return user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBeDefined();
    });

    test('GET /api/users/profile should reject unauthorized access', async () => {
      const response = await request(app).get('/api/users/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('PUT /api/users/profile should update user profile', async () => {
      const updateData = {
        name: 'Updated Test User'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });
  });

  describe('Orders', () => {
    test('POST /api/orders should create order', async () => {
      const orderData = {
        items: [
          {
            productId: 1,
            quantity: 1,
            rentalDays: 3
          }
        ],
        personalInfo: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          address: '123 Test Street',
          city: 'Jakarta',
          postalCode: '12345'
        },
        paymentMethod: 'cash',
        shippingMethod: 'delivery'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.order.id).toBeDefined();
      expect(response.body.data.transaction.id).toBeDefined();
      
      testOrderId = response.body.data.order.id;
      testTransactionId = response.body.data.transaction.id;
    });

    test('GET /api/orders should return user orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toBeInstanceOf(Array);
    });

    test('GET /api/orders/:id should return specific order', async () => {
      const response = await request(app)
        .get(`/api/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testOrderId);
    });
  });

  describe('Transactions (Admin)', () => {
    test('GET /api/transactions should return transactions (admin only)', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toBeInstanceOf(Array);
      expect(response.body.data.summary).toBeDefined();
    });

    test('GET /api/transactions should reject user access', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('PUT /api/transactions/:id/status should update transaction status', async () => {
      const response = await request(app)
        .put(`/api/transactions/${testTransactionId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
    });
  });

  describe('Utilities', () => {
    test('GET /api/categories should return categories', async () => {
      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    test('GET /api/statistics should return statistics (admin only)', async () => {
      const response = await request(app)
        .get('/api/statistics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.revenue).toBeDefined();
      expect(response.body.data.users).toBeDefined();
      expect(response.body.data.products).toBeDefined();
      expect(response.body.data.orders).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('Should return 404 for non-existent endpoints', async () => {
      const response = await request(app).get('/api/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('Should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
          // Missing password and name
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // Cleanup
  afterAll(async () => {
    // Clean up test data if needed
    if (testProductId) {
      await request(app)
        .delete(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
  });
});