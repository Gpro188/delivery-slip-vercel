# 🏗️ APPLICATION ARCHITECTURE

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                    (Chrome, Edge, Safari)                    │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                      VERCEL PLATFORM                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js Application                      │  │
│  │                                                       │  │
│  │  Frontend (React Components)                         │  │
│  │  ├─ Login Page                                        │  │
│  │  ├─ Dashboard                                         │  │
│  │  ├─ Institution Management                           │  │
│  │  ├─ Settings                                          │  │
│  │  └─ Slip Generation & Print                          │  │
│  │                                                       │  │
│  │  Backend (API Routes - Serverless)                   │  │
│  │  ├─ /api/auth/*                                       │  │
│  │  ├─ /api/institutions/*                               │  │
│  │  ├─ /api/settings/*                                   │  │
│  │  ├─ /api/import/*                                     │  │
│  │  └─ /api/export/*                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ Connection Pool
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                   POSTGRESQL DATABASE                        │
│              (Supabase or Vercel Postgres)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                              │  │
│  │  ├─ users (authentication)                           │  │
│  │  ├─ institutions (affiliated)                        │  │
│  │  ├─ from_settings (office address)                   │  │
│  │  └─ delivery_slips (tracking)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### **1. User Login Flow**

```
User enters credentials
        │
        ▼
POST /api/auth/callback/credentials
        │
        ▼
NextAuth validates user
        │
        ▼
Query database: SELECT * FROM users WHERE username = ?
        │
        ▼
Compare password hash (bcrypt)
        │
        ▼
Create JWT session token
        │
        ▼
Set HTTP-only cookie
        │
        ▼
Redirect to /dashboard
```

---

### **2. Institution List Flow**

```
User visits /institutions
        │
        ▼
Middleware checks session
        │
        ▼
If valid → continue
If invalid → redirect to /login
        │
        ▼
Page component mounts
        │
        ▼
GET /api/institutions
        │
        ▼
Query database: SELECT * FROM institutions ORDER BY name
        │
        ▼
Return JSON array
        │
        ▼
Render table with institutions
```

---

### **3. Import Flow**

```
User uploads CSV/Excel file
        │
        ▼
POST /api/import (multipart/form-data)
        │
        ▼
Parse file with SheetJS
        │
        ▼
Validate each row
        │
        ▼
For each valid row:
  INSERT INTO institutions VALUES (...)
        │
        ▼
Return success/error report
        │
        ▼
Display results to user
```

---

### **4. Slip Generation Flow**

```
User selects institutions
        │
        ▼
Click "Generate Slips"
        │
        ▼
Store IDs in sessionStorage
        │
        ▼
Navigate to /slips/preview
        │
        ▼
GET /api/institutions?ids=1,2,3...
GET /api/settings
        │
        ▼
Load institution data + settings
        │
        ▼
Render slips in 2x2 grid
        │
        ▼
User clicks "Print"
        │
        ▼
window.print() → Browser print dialog
        │
        ▼
Print-optimized CSS applied
        ▼
A4 page with 4 slips
```

---

## Component Architecture

```
App (layout.tsx)
│
├─ AuthProvider (Session provider)
│
├─ Pages
│   ├─ /login
│   │   └─ LoginPage (username/password form)
│   │
│   ├─ /dashboard
│   │   └─ DashboardPage (stats + quick actions)
│   │
│   ├─ /institutions
│   │   ├─ InstitutionsPage (list + search + select)
│   │   └─ /import
│   │       └─ ImportPage (file upload + process)
│   │
│   ├─ /settings
│   │   └─ SettingsPage (form + logo upload)
│   │
│   └─ /slips
│       ├─ /select
│       │   └─ SlipSelectPage (multi-select institutions)
│       └─ /preview
│           └─ SlipPreviewPage (print + download)
│
└─ API Routes
    ├─ /api/auth/[...nextauth]
    │   └─ NextAuth handler
    │
    ├─ /api/institutions
    │   ├─ GET (list all or by IDs)
    │   ├─ POST (create)
    │   ├─ PUT (update)
    │   └─ DELETE (remove)
    │
    ├─ /api/settings
    │   ├─ GET (fetch settings)
    │   └─ PUT (update settings)
    │
    ├─ /api/upload
    │   └─ POST (file upload)
    │
    ├─ /api/import
    │   └─ POST (CSV/Excel import)
    │
    └─ /api/export
        └─ GET (export to CSV/Excel)
```

---

## Database Relationships

```
┌──────────────┐
│    users     │
│              │
│  id (PK)     │
│  username    │
│  password    │
│  created_at  │
└──────────────┘

┌──────────────────────┐
│  from_settings       │
│                      │
│  id (PK)             │
│  institution_name    │
│  place               │
│  district            │
│  pin                 │
│  contact_number      │
│  logo_url            │
│  updated_at          │
└──────────────────────┘

┌──────────────────────────┐
│    institutions           │
│                           │
│  id (PK)                  │
│  institution_name (UQ)    │
│  address_line             │
│  post                     │
│  district                 │
│  pin                      │
│  phone                    │
│  phone2                   │
│  created_at               │
│  updated_at               │
└────────────┬─────────────┘
             │
             │ 1-to-many
             │
┌────────────▼─────────────┐
│   delivery_slips         │
│                          │
│  id (PK)                 │
│  institution_id (FK)     │────── references institutions.id
│  slip_date               │
│  status                  │
│  created_at              │
└──────────────────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────┐
│         Layer 1: HTTPS                  │
│    (Vercel provides automatically)      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│    Layer 2: Authentication              │
│       (NextAuth.js JWT)                 │
│    ┌─────────────────────────────┐     │
│    │ 1. User logs in             │     │
│    │ 2. JWT token created        │     │
│    │ 3. Token stored in cookie   │     │
│    │ 4. Every request validated  │     │
│    └─────────────────────────────┘     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│    Layer 3: Middleware                  │
│    (Route protection)                   │
│    ┌─────────────────────────────┐     │
│    │ Check session on:           │     │
│    │ • /dashboard/*              │     │
│    │ • /institutions/*           │     │
│    │ • /settings/*               │     │
│    │ • /slips/*                  │     │
│    └─────────────────────────────┘     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│    Layer 4: API Validation              │
│    (Input sanitization)                 │
│    ┌─────────────────────────────┐     │
│    │ • Validate request body     │     │
│    │ • Type checking (TypeScript)│     │
│    │ • SQL injection prevention  │     │
│    │   (Drizzle ORM)             │     │
│    └─────────────────────────────┘     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│    Layer 5: Database                    │
│    (PostgreSQL security)                │
│    ┌─────────────────────────────┐     │
│    │ • Parameterized queries     │     │
│    │ • Connection pooling        │     │
│    │ • Row-level security        │     │
│    │ • Encrypted connections     │     │
│    └─────────────────────────────┘     │
└─────────────────────────────────────────┘
```

---

## Deployment Pipeline

```
Developer
   │
   │ 1. git push
   ▼
GitHub Repository
   │
   │ 2. Webhook triggers
   ▼
Vercel
   │
   │ 3. npm install
   │ 4. npm run build
   │ 5. Run tests
   ▼
Build Success?
   │
   ├─ YES → Deploy to CDN
   │         │
   │         │ 6. Global distribution
   │         ▼
   │      Users worldwide
   │
   └─ NO → Send error notification
```

---

## File Upload Flow (Logo)

```
User selects logo file
        │
        ▼
POST /api/upload
        │
        ▼
Receive FormData
        │
        ▼
Validate file type (image/*)
        │
        ▼
Generate unique filename
        │
        ▼
[Currently] Return local path
        │
        ▼
[Production] Upload to:
  ├─ Vercel Blob Storage
  ├─ AWS S3
  └─ Cloudinary
        │
        ▼
Return public URL
        │
        ▼
Store URL in from_settings.logo_url
```

---

## Print Flow Architecture

```
User clicks "Print"
        │
        ▼
window.print() triggered
        │
        ▼
Browser enters print mode
        │
        ▼
@media print CSS activates
        │
        ├─ .no-print elements hidden
        │  (headers, buttons, etc.)
        │
        ├─ .slip-grid layout applied
        │  (2x2 grid, exact measurements)
        │
        ├─ .slip-card styling
        │  (98mm x 138mm per slip)
        │
        └─ @page rules applied
           (A4 size, 5mm margins)
        │
        ▼
Print preview shown
        │
        ▼
User confirms print
        │
        ▼
A4 page with 4 slips printed
```

---

## Technology Stack Diagram

```
┌──────────────────────────────────────────┐
│              FRONTEND                     │
│                                           │
│  Next.js 14 (React Framework)            │
│  ├─ React 18 (UI Library)                │
│  ├─ TypeScript (Type Safety)             │
│  ├─ Tailwind CSS (Styling)               │
│  └─ Lucide Icons (Icon Library)          │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│              BACKEND                      │
│                                           │
│  Next.js API Routes (Serverless)         │
│  ├─ NextAuth.js (Authentication)         │
│  ├─ Drizzle ORM (Database Queries)       │
│  ├─ SheetJS (Excel Processing)           │
│  └─ pdf-lib (PDF Generation)             │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│             DATABASE                      │
│                                           │
│  PostgreSQL (Relational DB)              │
│  ├─ Supabase (Free tier)                 │
│  └─ Vercel Postgres (Integrated)         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│           INFRASTRUCTURE                  │
│                                           │
│  Vercel Platform                          │
│  ├─ Global CDN                           │
│  ├─ Serverless Functions                 │
│  ├─ Automatic HTTPS                      │
│  ├─ Auto-scaling                         │
│  └─ Git-based deployment                 │
└──────────────────────────────────────────┘
```

---

## State Management

```
┌──────────────────────────────────────┐
│        Client-Side State             │
│                                      │
│  React useState:                     │
│  ├─ Form data                        │
│  ├─ Loading states                   │
│  ├─ Search filters                   │
│  └─ Selected institutions            │
│                                      │
│  Session Storage:                    │
│  └─ Selected institution IDs         │
│     (for slip generation)            │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│        Server-Side State             │
│                                      │
│  NextAuth Session (JWT):             │
│  ├─ User ID                          │
│  ├─ Username                         │
│  └─ Expiry                           │
│                                      │
│  Database (PostgreSQL):              │
│  ├─ All persistent data              │
│  └─ Single source of truth           │
└──────────────────────────────────────┘
```

---

This architecture is designed for:
- ✅ Scalability
- ✅ Security
- ✅ Performance
- ✅ Maintainability
- ✅ Developer experience
- ✅ User experience
