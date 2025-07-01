# Rental E-commerce Platform with REST API

A comprehensive rental e-commerce platform with a full-featured REST API backend and React frontend.

## Features

### Frontend (React)
- 🛍️ Product catalog with filtering and search
- 🛒 Shopping cart with rental duration selection
- 👤 User authentication and profile management
- 📦 Order management and checkout process
- 🔐 Admin dashboard for product and transaction management
- 📱 Responsive design with Tailwind CSS

### Backend (REST API)
- 🔐 JWT-based authentication and authorization
- 👥 User management (registration, login, profile)
- 📦 Product CRUD operations with filtering
- 🛒 Order processing and management
- 💰 Transaction tracking and status updates
- 📊 Admin analytics and statistics
- ✅ Comprehensive input validation
- 🔒 Role-based access control

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd rental-ecommerce
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
npm run install:server
```

4. **Set up environment variables**
```bash
cd server
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

1. **Start the API server**
```bash
npm run server
```
The API will be available at `http://localhost:3001`

2. **Start the frontend (in a new terminal)**
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Demo Accounts
- **Admin**: `admin` / `admin123`
- **User**: Register any email/password combination

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

#### Products
- `GET /api/products` - Get products with filtering
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

#### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

#### Transactions (Admin)
- `GET /api/transactions` - Get all transactions
- `PUT /api/transactions/:id/status` - Update transaction status

#### Utilities
- `GET /api/categories` - Get product categories
- `GET /api/statistics` - Get platform statistics (admin only)

## Testing

### API Testing

1. **Run automated tests**
```bash
npm run test:api
```

2. **Manual testing with Postman**
   - Import the collection from `postman/Rental_API_Collection.json`
   - Set up environment variables
   - Run the test scenarios

3. **cURL examples**
```bash
# Health check
curl -X GET http://localhost:3001/api/health

# Login as admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin", "password": "admin123"}'

# Get products
curl -X GET http://localhost:3001/api/products
```

### Frontend Testing
The frontend integrates seamlessly with the API. Test the complete user flow:
1. Register/login as user or admin
2. Browse and filter products
3. Add items to cart
4. Complete checkout process
5. View orders and transactions

## Project Structure

```
rental-ecommerce/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Backend API server
│   ├── index.js           # Main server file
│   ├── package.json       # Server dependencies
│   └── tests/             # API tests
├── docs/                  # API documentation
├── postman/               # Postman collection
└── public/                # Static assets
```

## API Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (user/admin)
- Secure password hashing with bcrypt
- Token expiration handling

### Data Management
- In-memory storage (easily replaceable with database)
- CRUD operations for all resources
- Data validation and sanitization
- Error handling and logging

### Business Logic
- Product inventory management
- Order processing workflow
- Transaction status tracking
- Revenue calculation and analytics

### Security
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting ready

## Development

### Adding New Endpoints

1. **Define the route**
```javascript
app.get('/api/new-endpoint', authenticateToken, (req, res) => {
  // Implementation
});
```

2. **Add validation middleware**
```javascript
const validateInput = (req, res, next) => {
  // Validation logic
  next();
};
```

3. **Update documentation**
- Add to API_DOCUMENTATION.md
- Include in Postman collection
- Add test cases

### Database Integration
The current implementation uses in-memory storage. To integrate with a database:

1. Install database driver (e.g., `pg` for PostgreSQL)
2. Replace in-memory arrays with database queries
3. Update connection configuration in `.env`
4. Implement database migrations

### Deployment
For production deployment:

1. **Environment Configuration**
   - Set secure JWT secret
   - Configure database connection
   - Set up CORS for production domain
   - Enable HTTPS

2. **Performance Optimization**
   - Implement caching
   - Add rate limiting
   - Optimize database queries
   - Set up monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions and support:
- Check the API documentation in `docs/`
- Review the testing guide
- Examine the Postman collection examples
- Open an issue for bugs or feature requests