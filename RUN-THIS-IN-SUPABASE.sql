-- =====================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
-- Step 1: Go to https://supabase.com/dashboard
-- Step 2: Click SQL Editor
-- Step 3: Copy ALL this SQL and paste
-- Step 4: Click "Run"
-- =====================================================

-- Create all database tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS from_settings (
    id SERIAL PRIMARY KEY,
    institution_name VARCHAR(255),
    place VARCHAR(100),
    district VARCHAR(100),
    pin VARCHAR(10),
    contact_number VARCHAR(20),
    logo_url VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS institutions (
    id SERIAL PRIMARY KEY,
    institution_name VARCHAR(255) UNIQUE NOT NULL,
    address_line TEXT,
    post VARCHAR(100),
    district VARCHAR(100),
    pin VARCHAR(10),
    phone VARCHAR(20),
    phone2 VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS delivery_slips (
    id SERIAL PRIMARY KEY,
    institution_id INTEGER REFERENCES institutions(id),
    slip_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_institutions_name ON institutions(institution_name);
CREATE INDEX IF NOT EXISTS idx_delivery_slips_institution ON delivery_slips(institution_id);

-- Create admin user
-- Username: admin
-- Password: password
INSERT INTO users (username, password) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- =====================================================
-- After running this, you can start the app!
-- Run: npm run dev
-- Login with: admin / password
-- =====================================================
