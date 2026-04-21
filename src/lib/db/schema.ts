import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

// Users table for authentication
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// From settings (your office address)
export const fromSettings = pgTable('from_settings', {
  id: serial('id').primaryKey(),
  institutionName: varchar('institution_name', { length: 255 }),
  place: varchar('place', { length: 100 }),
  district: varchar('district', { length: 100 }),
  pin: varchar('pin', { length: 10 }),
  contactNumber: varchar('contact_number', { length: 20 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Institutions (affiliated institutions - permanent storage)
export const institutions = pgTable('institutions', {
  id: serial('id').primaryKey(),
  institutionName: varchar('institution_name', { length: 255 }).notNull().unique(),
  addressLine: text('address_line'),
  post: varchar('post', { length: 100 }),
  district: varchar('district', { length: 100 }),
  pin: varchar('pin', { length: 10 }),
  phone: varchar('phone', { length: 20 }),
  phone2: varchar('phone2', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Delivery slips (for tracking)
export const deliverySlips = pgTable('delivery_slips', {
  id: serial('id').primaryKey(),
  institutionId: integer('institution_id').references(() => institutions.id),
  slipDate: timestamp('slip_date').defaultNow(),
  status: varchar('status', { length: 20 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});
