-- =========================
-- Users table
-- =========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'created_admin', 'main_admin'
    approved BOOLEAN DEFAULT FALSE,  -- Created Admin must be approved by CEO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Products table
-- =========================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    image_url TEXT,
    created_by INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Cart table
-- =========================
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Orders table
-- =========================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Order items
-- =========================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT,
    price DECIMAL(10,2)
);

-- =========================
-- Seed Main Admin (CEO)
-- =========================
-- NOTE: Replace <HASHED_PASSWORD> with an actual bcrypt hash
-- Example hash for password 'admin123' is:
-- $2b$10$Q9oD6h4V6yZ8RObZLx..UO4PgK5Cvi0lYbS2KpR7oVxGmXjUd9Nja

INSERT INTO users (name, email, password, role, approved)
VALUES ('CEO', 'ceo@example.com', '$2b$10$Q9oD6h4V6yZ8RObZLx..UO4PgK5Cvi0lYbS2KpR7oVxGmXjUd9Nja', 'main_admin', true);
