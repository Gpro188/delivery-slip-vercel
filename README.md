# Delivery Slip Generator - Next.js + Vercel

A modern, cloud-native delivery slip management system built with Next.js, designed for deployment on Vercel.

## 🚀 Features

- ✅ **Institution Management** - Store and manage affiliated institutions
- ✅ **CSV/Excel Import** - Bulk import institution data
- ✅ **CSV/Excel Export** - Download institution lists
- ✅ **Slip Generation** - Generate delivery slips for selected institutions
- ✅ **Print & PDF Download** - Print or download slips as PDF
- ✅ **Search & Filter** - Easy institution search with address display
- ✅ **Authentication** - Secure admin login
- ✅ **Cloud Deployment** - Deploy to Vercel with global CDN

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel account (free)
- PostgreSQL database (Vercel Postgres or Supabase)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and update it:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:
- Get PostgreSQL connection string from Vercel or Supabase
- Generate NextAuth secret: `openssl rand -base64 32`

### 3. Database Setup

Push the database schema:

```bash
npm run db:push
```

Or manually run the SQL from `database-setup.sql`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Required Environment Variables on Vercel

- `POSTGRES_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret key
- `NEXTAUTH_URL` - Your Vercel deployment URL

## 📁 Project Structure

```
delivery-slip-vercel/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── api/               # API routes
│   │   └── (routes)/          # Page routes
│   ├── components/            # React components
│   └── lib/                   # Utilities & database
├── public/                    # Static files
├── package.json
└── README.md
```

## 🗄️ Database Schema

### Tables

1. **users** - Admin authentication
2. **from_settings** - Your office address details
3. **institutions** - Affiliated institutions (permanent storage)
4. **delivery_slips** - Slip generation tracking

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Vercel Postgres)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Excel Processing**: SheetJS (xlsx)
- **PDF Generation**: pdf-lib
- **Deployment**: Vercel

## 📊 Migration from PHP Version

This is a complete rewrite of the PHP delivery slip system with modern technologies:

| PHP Version | Next.js Version |
|-------------|-----------------|
| PHP 7/8 | Node.js 18+ |
| MySQL | PostgreSQL |
| Apache | Vercel Serverless |
| Bootstrap 5 | Tailwind CSS |
| jQuery | React 18 |
| PHP Sessions | NextAuth JWT |

## 🔐 Default Admin Credentials

After initial setup, create admin user:
- Username: `admin`
- Password: Set during first login

## 📝 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Update database schema
```

## 🤝 Support

For issues or questions, please refer to the original PHP version documentation or create an issue.

## 📄 License

MIT License
