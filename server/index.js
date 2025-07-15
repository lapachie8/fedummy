const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { query, transaction } = require('./database/connection');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Utility functions
const generateId = () => uuidv4();
const generateNumericId = () => Math.floor(Math.random() * 1000000) + 1;

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Validation middleware
const validateUser = (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  if (req.path === '/register' && !name) {
    return res.status(400).json({
      success: false,
      message: 'Name is required for registration'
    });
  }
  
  next();
};

const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;
  
  if (!name || !description || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'Name, description, price, and category are required'
    });
  }
  
  if (price <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be greater than 0'
    });
  }
  
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Routes

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await query('SELECT 1');
    res.json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API is running but database connection failed',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'Disconnected'
    });
  }
});

// Landing page endpoint
app.get('/api/landing', async (req, res) => {
  try {
    // Get featured products (latest 4 products)
    const featuredProducts = await query(
      'SELECT * FROM products WHERE available = true ORDER BY created_at DESC LIMIT 4'
    );
    
    // Get categories with product counts
    const categoriesResult = await query(`
      SELECT 
        category, 
        COUNT(*) as product_count,
        COUNT(CASE WHEN available = true THEN 1 END) as available_count
      FROM products 
      GROUP BY category 
      ORDER BY product_count DESC
    `);
    
    // Get basic statistics
    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM products WHERE available = true) as total_products,
        (SELECT COUNT(DISTINCT category) FROM products) as total_categories,
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_customers,
        (SELECT COUNT(*) FROM transactions WHERE status = 'completed') as completed_orders
    `);
    
    const stats = statsResult.rows[0];
    
    res.json({
      success: true,
      data: {
        hero: {
          title: "Sewa Equipment Berkualitas, Untuk Kebutuhan Cosplaymu",
          subtitle: "Produk berkualitas, periode sewa fleksibel, dan layanan yang luar biasa. Rasakan kenyamanan menyewa daripada membeli.",
          cta: "Cari Produk"
        },
        featuredProducts: featuredProducts.rows,
        categories: categoriesResult.rows,
        statistics: {
          totalProducts: parseInt(stats.total_products),
          totalCategories: parseInt(stats.total_categories),
          totalCustomers: parseInt(stats.total_customers),
          completedOrders: parseInt(stats.completed_orders)
        },
        testimonials: [
          {
            id: 1,
            name: "Sarah Wilson",
            rating: 5,
            comment: "Amazing quality cosplay items! Perfect for my Kafka cosplay.",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
          },
          {
            id: 2,
            name: "Mike Chen",
            rating: 5,
            comment: "Great service and fast delivery. Will rent again!",
            avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
          },
          {
            id: 3,
            name: "Anna Rodriguez",
            rating: 5,
            comment: "Professional equipment at affordable rental prices.",
            avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
          }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
});

// Authentication endpoints
app.post('/api/auth/register', validateUser, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const result = await query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at, updated_at',
      [email, hashedPassword, name, 'user']
    );
    
    const newUser = result.rows[0];
    
    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', validateUser, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await query(
      'SELECT * FROM users WHERE email = $1 OR email = $2',
      [email, `${email}@juiweaprent.com`]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const user = result.rows[0];
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Remove password from response
    const { password: _, ...userResponse } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// User endpoints
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, req.user.id]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }
    
    // Update user
    const result = await query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, name, role, created_at, updated_at',
      [name, email, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Product endpoints
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, available } = req.query;
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;
    
    // Filter by category
    if (category && category !== 'All') {
      whereConditions.push(`category = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }
    
    // Filter by search query
    if (search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR category ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    // Filter by availability
    if (available !== undefined) {
      whereConditions.push(`available = $${paramIndex}`);
      queryParams.push(available === 'true');
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM products ${whereClause}`,
      queryParams
    );
    const totalItems = parseInt(countResult.rows[0].count);
    
    // Get products with pagination
    const productsResult = await query(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );
    
    res.json({
      success: true,
      data: {
        products: productsResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/products', authenticateToken, requireAdmin, validateProduct, async (req, res) => {
  try {
    const { name, description, price, price_unit = 'item', category, image_url, available = true, stock = 1 } = req.body;
    
    const result = await query(
      'INSERT INTO products (name, description, price, price_unit, category, image_url, available, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, description, parseFloat(price), price_unit, category, image_url || 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', available, parseInt(stock)]
    );
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/products/:id', authenticateToken, requireAdmin, validateProduct, async (req, res) => {
  try {
    const { name, description, price, price_unit, category, image_url, available, stock } = req.body;
    
    const result = await query(
      'UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price), price_unit = COALESCE($4, price_unit), category = COALESCE($5, category), image_url = COALESCE($6, image_url), available = COALESCE($7, available), stock = COALESCE($8, stock), updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [name, description, price ? parseFloat(price) : null, price_unit, category, image_url, available, stock ? parseInt(stock) : null, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Order endpoints
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, personalInfo, paymentMethod, shippingMethod } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }
    
    if (!personalInfo || !paymentMethod || !shippingMethod) {
      return res.status(400).json({
        success: false,
        message: 'Personal info, payment method, and shipping method are required'
      });
    }
    
    const result = await transaction(async (client) => {
      // Calculate total and validate products
      let total = 0;
      const orderItems = [];
      
      for (const item of items) {
        const productResult = await client.query('SELECT * FROM products WHERE id = $1', [item.productId]);
        
        if (productResult.rows.length === 0) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        
        const product = productResult.rows[0];
        
        if (!product.available || product.stock < item.quantity) {
          throw new Error(`Product ${product.name} is not available or insufficient stock`);
        }
        
        const itemTotal = product.price * item.quantity * item.rentalDays;
        total += itemTotal;
        
        orderItems.push({
          product,
          quantity: item.quantity,
          rental_days: item.rentalDays,
          price: product.price,
          subtotal: itemTotal
        });
      }
      
      // Create order
      const orderResult = await client.query(
        'INSERT INTO orders (user_id, personal_info, payment_method, shipping_method, total, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [
          req.user.id,
          JSON.stringify(personalInfo),
          paymentMethod,
          shippingMethod,
          total,
          new Date(Date.now() + (Math.max(...items.map(i => i.rentalDays)) * 24 * 60 * 60 * 1000))
        ]
      );
      
      const newOrder = orderResult.rows[0];
      
      // Create order items
      for (let i = 0; i < orderItems.length; i++) {
        const orderItem = orderItems[i];
        const item = items[i];
        
        await client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, rental_days, price, subtotal) VALUES ($1, $2, $3, $4, $5, $6)',
          [newOrder.id, item.productId, item.quantity, item.rentalDays, orderItem.price, orderItem.subtotal]
        );
        
        // Update product stock
        await client.query(
          'UPDATE products SET stock = stock - $1, available = CASE WHEN stock - $1 <= 0 THEN false ELSE available END WHERE id = $2',
          [item.quantity, item.productId]
        );
      }
      
      // Create transaction record
      const transactionId = `TXN${Date.now()}`;
      const transactionResult = await client.query(
        'INSERT INTO transactions (id, order_id, customer_name, customer_email, total, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [transactionId, newOrder.id, personalInfo.fullName, personalInfo.email, total, newOrder.due_date]
      );
      
      return {
        order: { ...newOrder, items: orderItems },
        transaction: transactionResult.rows[0]
      };
    });
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    let whereConditions = ['user_id = $1'];
    let queryParams = [req.user.id];
    let paramIndex = 2;
    
    // Filter by status
    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }
    
    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;
    
    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM orders ${whereClause}`,
      queryParams
    );
    const totalItems = parseInt(countResult.rows[0].count);
    
    // Get orders with pagination
    const ordersResult = await query(
      `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );
    
    res.json({
      success: true,
      data: {
        orders: ordersResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const orderResult = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const order = orderResult.rows[0];
    
    // Check if user owns the order or is admin
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Get order items
    const itemsResult = await query(
      'SELECT oi.*, p.name, p.description, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
      [req.params.id]
    );
    
    res.json({
      success: true,
      data: {
        ...order,
        items: itemsResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// Transaction endpoints (Admin only)
app.get('/api/transactions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;
    
    // Filter by status
    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM transactions ${whereClause}`,
      queryParams
    );
    const totalItems = parseInt(countResult.rows[0].count);
    
    // Get transactions with pagination
    const transactionsResult = await query(
      `SELECT * FROM transactions ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );
    
    // Calculate revenue
    const revenueResult = await query(
      "SELECT COALESCE(SUM(total), 0) as total_revenue FROM transactions WHERE status = 'completed'"
    );
    const totalRevenue = parseFloat(revenueResult.rows[0].total_revenue);
    
    // Get transaction counts by status
    const statusCounts = await query(
      "SELECT status, COUNT(*) as count FROM transactions GROUP BY status"
    );
    
    const summary = {
      totalRevenue,
      totalTransactions: totalItems,
      completedTransactions: 0,
      pendingTransactions: 0,
      activeTransactions: 0
    };
    
    statusCounts.rows.forEach(row => {
      summary[`${row.status}Transactions`] = parseInt(row.count);
    });
    
    res.json({
      success: true,
      data: {
        transactions: transactionsResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: parseInt(limit)
        },
        summary
      }
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/transactions/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'active', 'completed', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (pending, active, completed, cancelled)'
      });
    }
    
    const result = await transaction(async (client) => {
      // Update transaction status
      const transactionResult = await client.query(
        'UPDATE transactions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, req.params.id]
      );
      
      if (transactionResult.rows.length === 0) {
        throw new Error('Transaction not found');
      }
      
      const updatedTransaction = transactionResult.rows[0];
      
      // Update corresponding order status
      await client.query(
        'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [status, updatedTransaction.order_id]
      );
      
      return updatedTransaction;
    });
    
    res.json({
      success: true,
      message: 'Transaction status updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// Categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT category FROM products ORDER BY category');
    const categories = result.rows.map(row => row.category);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// Statistics endpoint (Admin only)
app.get('/api/statistics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get revenue statistics
    const revenueResult = await query(`
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN status = 'completed' AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN total ELSE 0 END), 0) as this_month_revenue
      FROM transactions
    `);
    
    // Get user statistics
    const userResult = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at > CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_this_week
      FROM users 
      WHERE role = 'user'
    `);
    
    // Get product statistics
    const productResult = await query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN available = true THEN 1 END) as available_products,
        COUNT(CASE WHEN available = false THEN 1 END) as out_of_stock
      FROM products
    `);
    
    // Get order statistics
    const orderResult = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN created_at > CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as recent_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders
      FROM orders
    `);
    
    const revenue = revenueResult.rows[0];
    const users = userResult.rows[0];
    const products = productResult.rows[0];
    const orders = orderResult.rows[0];
    
    res.json({
      success: true,
      data: {
        revenue: {
          total: parseFloat(revenue.total_revenue),
          thisMonth: parseFloat(revenue.this_month_revenue)
        },
        users: {
          total: parseInt(users.total_users),
          newThisWeek: parseInt(users.new_this_week)
        },
        products: {
          total: parseInt(products.total_products),
          available: parseInt(products.available_products),
          outOfStock: parseInt(products.out_of_stock)
        },
        orders: {
          total: parseInt(orders.total_orders),
          recentOrders: parseInt(orders.recent_orders),
          pending: parseInt(orders.pending_orders),
          active: parseInt(orders.active_orders),
          completed: parseInt(orders.completed_orders)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Cart Management Endpoints

// Get user's cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.id,
        c.product_id,
        c.quantity,
        c.rental_days,
        c.created_at,
        p.name,
        p.description,
        p.price,
        p.price_unit,
        p.category,
        p.image_url,
        p.available,
        (p.price * c.quantity * c.rental_days) as subtotal
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `, [req.user.id]);
    
    const cartItems = result.rows;
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    
    res.json({
      success: true,
      data: {
        items: cartItems,
        total: total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Add product to cart
app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1, rentalDays = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    if (quantity < 1 || rentalDays < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity and rental days must be at least 1'
      });
    }
    
    // Check if product exists and is available
    const productResult = await query(
      'SELECT * FROM products WHERE id = $1',
      [productId]
    );
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const product = productResult.rows[0];
    
    if (!product.available || product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available or insufficient stock'
      });
    }
    
    // Check if item already exists in cart
    const existingItem = await query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );
    
    let result;
    
    if (existingItem.rows.length > 0) {
      // Update existing item
      result = await query(
        'UPDATE cart_items SET quantity = quantity + $1, rental_days = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 AND product_id = $4 RETURNING *',
        [quantity, rentalDays, req.user.id, productId]
      );
    } else {
      // Add new item
      result = await query(
        'INSERT INTO cart_items (user_id, product_id, quantity, rental_days) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.user.id, productId, quantity, rentalDays]
      );
    }
    
    // Get updated cart item with product details
    const cartItemResult = await query(`
      SELECT 
        c.id,
        c.product_id,
        c.quantity,
        c.rental_days,
        c.created_at,
        p.name,
        p.description,
        p.price,
        p.price_unit,
        p.category,
        p.image_url,
        p.available,
        (p.price * c.quantity * c.rental_days) as subtotal
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = $1
    `, [result.rows[0].id]);
    
    res.status(201).json({
      success: true,
      message: 'Product added to cart successfully',
      data: cartItemResult.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update cart item
app.put('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    const { quantity, rentalDays } = req.body;
    const cartItemId = req.params.id;
    
    if (quantity && quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    if (rentalDays && rentalDays < 1) {
      return res.status(400).json({
        success: false,
        message: 'Rental days must be at least 1'
      });
    }
    
    // Check if cart item belongs to user
    const cartItemCheck = await query(
      'SELECT * FROM cart_items WHERE id = $1 AND user_id = $2',
      [cartItemId, req.user.id]
    );
    
    if (cartItemCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    // Update cart item
    const result = await query(
      'UPDATE cart_items SET quantity = COALESCE($1, quantity), rental_days = COALESCE($2, rental_days), updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [quantity, rentalDays, cartItemId, req.user.id]
    );
    
    // Get updated cart item with product details
    const cartItemResult = await query(`
      SELECT 
        c.id,
        c.product_id,
        c.quantity,
        c.rental_days,
        c.created_at,
        p.name,
        p.description,
        p.price,
        p.price_unit,
        p.category,
        p.image_url,
        p.available,
        (p.price * c.quantity * c.rental_days) as subtotal
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = $1
    `, [cartItemId]);
    
    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: cartItemResult.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Remove item from cart
app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    const cartItemId = req.params.id;
    
    const result = await query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [cartItemId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Clear entire cart
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    await query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    
    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
});
// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Admin credentials: admin / admin123`);
  console.log(`🗄️  Database: PostgreSQL`);
});

module.exports = app;