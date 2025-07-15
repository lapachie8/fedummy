-- Database schema for rental e-commerce platform

-- Create database (run this manually in PostgreSQL)
-- CREATE DATABASE rental_ecommerce;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    price_unit VARCHAR(50) DEFAULT 'item',
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    available BOOLEAN DEFAULT true,
    stock INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    personal_info JSONB NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    shipping_method VARCHAR(50) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    rental_days INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Insert default admin user
INSERT INTO users (id, email, password, name, role) 
VALUES (
    'admin',
    'admin@juiweaprent.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
    'Administrator',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, price_unit, category, image_url, available, stock) VALUES
('Feixiao Cosplay Set', 'Aksesoris lengkap untuk bermain Honkai Star-Rail, termasuk controller, headset, dan mouse pad khusus.', 150000, 'item', 'Honkai Star-Rail', '/img/ayang.png', true, 5),
('Kafka Cosplay Outfit', 'Kostum Kafka lengkap dengan aksesoris untuk cosplay Honkai Star-Rail yang sempurna.', 200000, 'item', 'Honkai Star-Rail', '/img/kafka.png', true, 3),
('Frieren Magic Staff', 'Tongkat sihir Frieren yang detail dan berkualitas tinggi untuk cosplay anime.', 125000, 'item', 'Anime', '/img/frieren.png', true, 2),
('Gaming Headset Premium', 'Headset gaming berkualitas tinggi dengan suara jernih dan desain ergonomis.', 75000, 'item', 'Gaming', 'https://images.pexels.com/photos/2582818/pexels-photo-2582818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', true, 10),
('Professional Camera', 'Kamera profesional untuk dokumentasi cosplay dan fotografi berkualitas tinggi.', 300000, 'item', 'Photography', 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', true, 4),
('Cosplay Wig Styling Kit', 'Set lengkap untuk styling wig cosplay dengan berbagai tools profesional.', 85000, 'item', 'Cosplay Tools', 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', true, 8),
('LED Light Panel Set', 'Panel LED untuk pencahayaan fotografi cosplay yang sempurna.', 180000, 'item', 'Photography', 'https://images.pexels.com/photos/1751550/pexels-photo-1751550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', true, 6),
('Anime Character Mask', 'Topeng karakter anime berkualitas tinggi dengan detail yang sempurna.', 95000, 'item', 'Anime', 'https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', true, 12),
('Samurai Katana Replica', 'Replika katana samurai berkualitas tinggi untuk cosplay dan koleksi.', 250000, 'item', 'Anime', '/img/katana.png', true, 3),
('Fantasy Bow Set', 'Set busur fantasi lengkap dengan anak panah untuk cosplay archer.', 175000, 'item', 'Anime', '/img/bow1.png', true, 4),
('Medieval Sword Replica', 'Replika pedang medieval yang detail untuk cosplay knight atau warrior.', 220000, 'item', 'Anime', '/img/sword.png', true, 2),
('Elven Bow Deluxe', 'Busur elven mewah dengan ukiran detail untuk cosplay fantasy.', 195000, 'item', 'Anime', '/img/bow2.png', true, 3)
ON CONFLICT DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();