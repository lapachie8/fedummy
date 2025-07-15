@@ .. @@
 -- Create trigger to update updated_at timestamp
 CREATE OR REPLACE FUNCTION update_updated_at_column()
 RETURNS TRIGGER AS $$
 BEGIN
     NEW.updated_at = CURRENT_TIMESTAMP;
     RETURN NEW;
 END;
 $$ language 'plpgsql';

+-- Cart items table
+CREATE TABLE IF NOT EXISTS cart_items (
+    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
+    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
+    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
+    quantity INTEGER NOT NULL DEFAULT 1,
+    rental_days INTEGER NOT NULL DEFAULT 1,
+    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
+    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
+    UNIQUE(user_id, product_id)
+);
+
+-- Create indexes for cart items
+CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
+CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

 -- Apply triggers to tables
 CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
+CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();