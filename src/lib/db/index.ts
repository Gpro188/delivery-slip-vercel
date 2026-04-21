import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Create connection pool for Supabase
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

// Create database connection
export const db = drizzle(pool, { schema });

export type Database = typeof db;
export type Schema = typeof schema;
