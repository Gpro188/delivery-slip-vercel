# 🎯 SUPABASE SETUP INSTRUCTIONS

## STEP 1: Replace YOUR_PASSWORD in .env.local

1. Open: `c:\xampp\htdocs\delivery-slip-vercel\.env.local`
2. Find: `YOUR_PASSWORD` (appears 5 times)
3. Replace ALL with your actual Supabase password
4. Save the file

---

## STEP 2: Generate NEXTAUTH_SECRET

1. Open: https://generate-secret.vercel.app/32
2. Copy the generated secret
3. Open: `c:\xampp\htdocs\delivery-slip-vercel\.env.local`
4. Replace: `REPLACE_THIS_WITH_GENERATED_SECRET` with your secret
5. Save the file

---

## STEP 3: Run Database Setup SQL in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on **SQL Editor** (left sidebar)
3. Click **New query**
4. Copy and paste the SQL below
5. Click **Run** (or Ctrl+Enter)

### SQL TO RUN:

```sql
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
CREATE INDEX IF NOT EXISTS idx_institutions_name ON institutions(institution_name);
CREATE INDEX IF NOT EXISTS idx_delivery_slips_institution ON delivery_slips(institution_id);
```

---

## STEP 4: Create Admin User

After running the SQL above, run this in the **same SQL Editor**:

```sql
-- Creates admin user with password: "password"
INSERT INTO users (username, password) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
```

**This creates:**
- Username: `admin`
- Password: `password`

**To use a custom password:**
1. Go to: https://bcrypt-generator.com
2. Enter your password (e.g., `admin123`)
3. Rounds: 10
4. Click "Generate"
5. Copy the hash
6. Run: `INSERT INTO users (username, password) VALUES ('admin', 'YOUR_HASH_HERE');`

---

## STEP 5: Verify Database Setup

Run this SQL to check if tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- delivery_slips
- from_settings
- institutions
- users

---

## STEP 6: Test Local Connection

Once you've updated `.env.local` with your password and secret:

```bash
cd c:\xampp\htdocs\delivery-slip-vercel
npm run dev
```

Open: http://localhost:3000

Login with:
- Username: `admin`
- Password: `password`

---

## STEP 7: Deploy to Vercel

Add these environment variables in Vercel dashboard:

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Go to: Settings → Environment Variables
4. Add these (copy from your `.env.local`):

```
POSTGRES_URL=postgresql://postgres:YOUR_PASSWORD@db.xmaeoskrocnnhgmiwvcr.supabase.co:5432/postgres
POSTGRES_PRISMA_URL=postgresql://postgres:YOUR_PASSWORD@db.xmaeoskrocnnhgmiwvcr.supabase.co:5432/postgres?pgbouncer=true
POSTGRES_URL_NO_SSL=postgresql://postgres:YOUR_PASSWORD@db.xmaeoskrocnnhgmiwvcr.supabase.co:5432/postgres
POSTGRES_URL_NON_POOLING=postgresql://postgres:YOUR_PASSWORD@db.xmaeoskrocnnhgmiwvcr.supabase.co:5432/postgres
POSTGRES_USER=postgres
POSTGRES_HOST=db.xmaeoskrocnnhgmiwvcr.supabase.co
POSTGRES_PASSWORD=YOUR_PASSWORD
POSTGRES_DATABASE=postgres
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET
NEXTAUTH_URL=https://your-project.vercel.app
```

5. Click **Deploy** or push to GitHub to trigger auto-deploy

---

## ✅ CHECKLIST

- [ ] Replaced `YOUR_PASSWORD` in `.env.local` with actual password
- [ ] Generated NEXTAUTH_SECRET and added to `.env.local`
- [ ] Ran database setup SQL in Supabase
- [ ] Created admin user in database
- [ ] Tested locally with `npm run dev`
- [ ] Added environment variables to Vercel
- [ ] Deployed to Vercel

---

## 🎉 DONE!

Your app is now:
- ✅ Running locally on http://localhost:3000
- ✅ Connected to Supabase database
- ✅ Ready to deploy to Vercel
- ✅ $0 cost forever!
