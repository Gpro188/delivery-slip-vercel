# Quick Vercel Deployment Guide

## Option 1: Deploy via Vercel CLI (Recommended)

### Step 1: Set Environment Variables
Run these commands one by one:

```powershell
vercel env add POSTGRES_URL production
# Paste: postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

vercel env add POSTGRES_PRISMA_URL production
# Paste: postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true

vercel env add POSTGRES_URL_NO_SSL production
# Paste: postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

vercel env add POSTGRES_URL_NON_POOLING production
# Paste: postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

vercel env add POSTGRES_USER production
# Paste: postgres.xmaeoskrocnnhgmiwvcr

vercel env add POSTGRES_HOST production
# Paste: aws-1-ap-south-1.pooler.supabase.com

vercel env add POSTGRES_PASSWORD production
# Paste: 188Dpro188@

vercel env add POSTGRES_DATABASE production
# Paste: postgres

vercel env add NEXTAUTH_SECRET production
# Paste: 7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a

vercel env add NEXTAUTH_URL production
# Paste: https://your-app.vercel.app (will update after first deploy)
```

### Step 2: Deploy
```powershell
vercel --prod
```

---

## Option 2: Deploy via Vercel Dashboard (Easiest)

1. **Go to**: https://vercel.com/dashboard
2. **Click**: "New Project"
3. **Import**: Your Git repository OR drag & drop folder
4. **Add Environment Variables** in the dashboard:
   - Copy all values from `.env.local` file
   - Add each one in Vercel's Environment Variables section
5. **Click**: "Deploy"

---

## Environment Variables Needed:

| Variable | Value |
|----------|-------|
| POSTGRES_URL | postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres |
| POSTGRES_PRISMA_URL | postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true |
| POSTGRES_URL_NO_SSL | postgresql://postgres.xmaeoskrocnnhgmiwvcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres |
| POSTGRES_URL_NON_POOLING | postgresql://postgres.xmaeoskrocnnhgmiwcr:188Dpro188%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres |
| POSTGRES_USER | postgres.xmaeoskrocnnhgmiwvcr |
| POSTGRES_HOST | aws-1-ap-south-1.pooler.supabase.com |
| POSTGRES_PASSWORD | 188Dpro188@ |
| POSTGRES_DATABASE | postgres |
| NEXTAUTH_SECRET | 7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a |
| NEXTAUTH_URL | http://localhost:3000 (update after deploy) |

---

## Quick Commands:

```powershell
# Check deployment status
vercel ls

# View logs
vercel logs

# Open dashboard
vercel open
```
