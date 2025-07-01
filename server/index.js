const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory storage (replace with database in production)
let users = [
  {
    id: 'admin',
    email: 'admin@juiweaprent.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
    name: 'Administrator',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let products = [
  {
    id: 1,
    name: 'Feixiao Cosplay Set',
    description: 'Aksesoris lengkap untuk bermain Honkai Star-Rail, termasuk controller, headset, dan mouse pad khusus.',
    price: 150000,
    priceUnit: 'item',
    category: 'Honkai Star-Rail',
    imageUrl: '/img/ayang.png',
    available: true,
    stock: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Kafka Cosplay Outfit',
    description: 'Kostum Kafka lengkap dengan aksesoris untuk cosplay Honkai Star-Rail yang sempurna.',
    price: 200000,
    priceUnit: 'item',
    category: 'Honkai Star-Rail',
    imageUrl: '/img/kafka.png',
    available: true,
    stock: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'Frieren Magic Staff',
    description: 'Tongkat sihir Frieren yang detail dan berkualitas tinggi untuk cosplay anime.',
    price: 125000,
    priceUnit: 'item',
    category: 'Anime',
    imageUrl: '/img/frieren.png',
    available: true,
    stock: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let transactions = [];
let orders = [];

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
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Authentication endpoints
app.post('/api/auth/register', validateUser, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: generateId(),
      email,
      password: hashedPassword,
      name,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    
    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Remove password from response
    const { password: _, ...userResponse } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
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
    const user = users.find(u => u.email === email || u.email === `${email}@juiweaprent.com`);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
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
app.get('/api/users/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const { password: _, ...userResponse } = user;
  res.json({
    success: true,
    data: userResponse
  });
});

app.put('/api/users/profile', authenticateToken, (req, res) => {
  const { name, email } = req.body;
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Check if email is already taken by another user
  if (email && email !== users[userIndex].email) {
    const emailExists = users.find(u => u.email === email && u.id !== req.user.id);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use'
      });
    }
  }
  
  // Update user
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    updatedAt: new Date()
  };
  
  const { password: _, ...userResponse } = users[userIndex];
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: userResponse
  });
});

// Product endpoints
app.get('/api/products', (req, res) => {
  const { page = 1, limit = 10, category, search, available } = req.query;
  let filteredProducts = [...products];
  
  // Filter by category
  if (category && category !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  // Filter by search query
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by availability
  if (available !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.available === (available === 'true'));
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalItems: filteredProducts.length,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

app.post('/api/products', authenticateToken, requireAdmin, validateProduct, (req, res) => {
  const { name, description, price, priceUnit = 'item', category, imageUrl, available = true, stock = 1 } = req.body;
  
  const newProduct = {
    id: generateNumericId(),
    name,
    description,
    price: parseFloat(price),
    priceUnit,
    category,
    imageUrl: imageUrl || 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    available,
    stock: parseInt(stock),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
});

app.put('/api/products/:id', authenticateToken, requireAdmin, validateProduct, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  const { name, description, price, priceUnit, category, imageUrl, available, stock } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    description: description || products[productIndex].description,
    price: price ? parseFloat(price) : products[productIndex].price,
    priceUnit: priceUnit || products[productIndex].priceUnit,
    category: category || products[productIndex].category,
    imageUrl: imageUrl || products[productIndex].imageUrl,
    available: available !== undefined ? available : products[productIndex].available,
    stock: stock ? parseInt(stock) : products[productIndex].stock,
    updatedAt: new Date()
  };
  
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: products[productIndex]
  });
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  products.splice(productIndex, 1);
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Order endpoints
app.post('/api/orders', authenticateToken, (req, res) => {
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
  
  // Calculate total
  let total = 0;
  const orderItems = [];
  
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${item.productId} not found`
      });
    }
    
    if (!product.available || product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Product ${product.name} is not available or insufficient stock`
      });
    }
    
    const itemTotal = product.price * item.quantity * item.rentalDays;
    total += itemTotal;
    
    orderItems.push({
      product,
      quantity: item.quantity,
      rentalDays: item.rentalDays,
      price: product.price,
      subtotal: itemTotal
    });
  }
  
  const newOrder = {
    id: generateId(),
    userId: req.user.id,
    items: orderItems,
    personalInfo,
    paymentMethod,
    shippingMethod,
    total,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(Date.now() + (Math.max(...items.map(i => i.rentalDays)) * 24 * 60 * 60 * 1000))
  };
  
  orders.push(newOrder);
  
  // Update product stock
  for (const item of items) {
    const productIndex = products.findIndex(p => p.id === item.productId);
    if (productIndex !== -1) {
      products[productIndex].stock -= item.quantity;
      if (products[productIndex].stock <= 0) {
        products[productIndex].available = false;
      }
    }
  }
  
  // Create transaction record
  const transaction = {
    id: `TXN${Date.now()}`,
    orderId: newOrder.id,
    customerName: personalInfo.fullName,
    customerEmail: personalInfo.email,
    items: orderItems,
    total,
    status: 'pending',
    createdAt: new Date(),
    dueDate: newOrder.dueDate
  };
  
  transactions.push(transaction);
  
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: {
      order: newOrder,
      transaction
    }
  });
});

app.get('/api/orders', authenticateToken, (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  let userOrders = orders.filter(order => order.userId === req.user.id);
  
  // Filter by status
  if (status) {
    userOrders = userOrders.filter(order => order.status === status);
  }
  
  // Sort by creation date (newest first)
  userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedOrders = userOrders.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      orders: paginatedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(userOrders.length / limit),
        totalItems: userOrders.length,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // Check if user owns the order or is admin
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  res.json({
    success: true,
    data: order
  });
});

// Transaction endpoints (Admin only)
app.get('/api/transactions', authenticateToken, requireAdmin, (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  let filteredTransactions = [...transactions];
  
  // Filter by status
  if (status) {
    filteredTransactions = filteredTransactions.filter(t => t.status === status);
  }
  
  // Sort by creation date (newest first)
  filteredTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
  
  // Calculate revenue
  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0);
  
  res.json({
    success: true,
    data: {
      transactions: paginatedTransactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredTransactions.length / limit),
        totalItems: filteredTransactions.length,
        itemsPerPage: parseInt(limit)
      },
      summary: {
        totalRevenue,
        totalTransactions: transactions.length,
        completedTransactions: transactions.filter(t => t.status === 'completed').length,
        pendingTransactions: transactions.filter(t => t.status === 'pending').length,
        activeTransactions: transactions.filter(t => t.status === 'active').length
      }
    }
  });
});

app.put('/api/transactions/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'active', 'completed', 'cancelled'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Valid status is required (pending, active, completed, cancelled)'
    });
  }
  
  const transactionIndex = transactions.findIndex(t => t.id === req.params.id);
  if (transactionIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found'
    });
  }
  
  transactions[transactionIndex].status = status;
  transactions[transactionIndex].updatedAt = new Date();
  
  // Update corresponding order status
  const orderIndex = orders.findIndex(o => o.id === transactions[transactionIndex].orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();
  }
  
  res.json({
    success: true,
    message: 'Transaction status updated successfully',
    data: transactions[transactionIndex]
  });
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({
    success: true,
    data: categories
  });
});

// Statistics endpoint (Admin only)
app.get('/api/statistics', authenticateToken, requireAdmin, (req, res) => {
  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0);
  
  const totalUsers = users.filter(u => u.role === 'user').length;
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.available).length;
  
  const recentOrders = orders
    .filter(o => new Date(o.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .length;
  
  res.json({
    success: true,
    data: {
      revenue: {
        total: totalRevenue,
        thisMonth: transactions
          .filter(t => t.status === 'completed' && new Date(t.createdAt).getMonth() === new Date().getMonth())
          .reduce((sum, t) => sum + t.total, 0)
      },
      users: {
        total: totalUsers,
        newThisWeek: users
          .filter(u => u.role === 'user' && new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
          .length
      },
      products: {
        total: totalProducts,
        available: availableProducts,
        outOfStock: totalProducts - availableProducts
      },
      orders: {
        total: orders.length,
        recentOrders,
        pending: orders.filter(o => o.status === 'pending').length,
        active: orders.filter(o => o.status === 'active').length,
        completed: orders.filter(o => o.status === 'completed').length
      }
    }
  });
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
});

module.exports = app;