-- Delivery Slip Generator - PostgreSQL Setup
-- Run this SQL to initialize the database

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- From settings (your office address)
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

-- Institutions (affiliated institutions - permanent storage)
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

-- Delivery slips (for tracking)
CREATE TABLE IF NOT EXISTS delivery_slips (
    id SERIAL PRIMARY KEY,
    institution_id INTEGER REFERENCES institutions(id),
    slip_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_institutions_name ON institutions(institution_name);
CREATE INDEX idx_delivery_slips_institution ON delivery_slips(institution_id);

-- Insert default admin user (password: 'admin123' - change this after first login)
-- You'll need to hash the password using bcrypt before inserting
-- For now, use your application's registration endpoint
