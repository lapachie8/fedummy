# Database Setup Guide

## Prerequisites

1. **Install PostgreSQL**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL Service**
   - Windows: Service starts automatically
   - macOS: `brew services start postgresql`
   - Ubuntu: `sudo systemctl start postgresql`

## Database Setup Steps

### 1. Create Database

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Or on Windows/macOS
psql -U postgres

# Create database
CREATE DATABASE rental_ecommerce;

# Create user (optional, for security)
CREATE USER rental_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE rental_ecommerce TO rental_user;

# Exit PostgreSQL
\q
```

### 2. Configure Environment Variables

Update `server/.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rental_ecommerce
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. Initialize Database Schema

```bash
# Navigate to server directory
cd server

# Run the schema file
psql -U postgres -d rental_ecommerce -f database/schema.sql

# Or if using custom user
psql -U rental_user -d rental_ecommerce -f database/schema.sql
```

### 4. Install Dependencies and Start Server

```bash
# Install new dependencies
npm install

# Start the server
npm run dev
```

## Verification

1. **Check Database Connection**
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `"database": "Connected"`

2. **Test API Endpoints**
   ```bash
   # Get products
   curl http://localhost:3001/api/products
   
   # Login as admin
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin", "password": "admin123"}'
   ```

## Database Features

### ✅ What's Included

- **User Management**: Registration, authentication, profiles
- **Product Catalog**: CRUD operations with categories and search
- **Order Processing**: Complete order workflow with items
- **Transaction Tracking**: Revenue and status management
- **Data Integrity**: Foreign keys, constraints, and validation
- **Performance**: Indexes on frequently queried columns
- **Security**: Password hashing, SQL injection prevention

### 🔄 Migration from In-Memory

The new database system is **fully compatible** with the existing frontend. All API endpoints remain the same, but now data is:

- ✅ **Persistent** - Survives server restarts
- ✅ **Scalable** - Handles concurrent users
- ✅ **Reliable** - ACID transactions
- ✅ **Searchable** - Full-text search capabilities
- ✅ **Backed up** - Can be backed up and restored

### 📊 Database Schema

```
users (authentication & profiles)
├── products (rental catalog)
├── orders (customer orders)
│   └── order_items (order details)
└── transactions (payment tracking)
```

## Troubleshooting

### Connection Issues

1. **Check PostgreSQL is running**
   ```bash
   sudo systemctl status postgresql  # Linux
   brew services list | grep postgres  # macOS
   ```

2. **Verify credentials**
   ```bash
   psql -U postgres -d rental_ecommerce -c "SELECT 1;"
   ```

3. **Check firewall/port**
   ```bash
   netstat -an | grep 5432
   ```

### Common Errors

- **"database does not exist"**: Run the CREATE DATABASE command
- **"password authentication failed"**: Check DB_PASSWORD in .env
- **"connection refused"**: PostgreSQL service not running

## Production Considerations

1. **Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access by IP

2. **Performance**
   - Configure connection pooling
   - Add more indexes as needed
   - Monitor query performance

3. **Backup**
   ```bash
   pg_dump -U postgres rental_ecommerce > backup.sql
   ```

4. **Restore**
   ```bash
   psql -U postgres -d rental_ecommerce < backup.sql
   ```