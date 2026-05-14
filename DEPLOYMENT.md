# EduTrack ERP - Production Deployment Guide

This guide covers deploying the **EduTrack ERP** application for a production environment. The architecture consists of a Next.js (React) frontend, a NestJS backend, and a PostgreSQL database (Neon), alongside Cloudinary for file storage.

## 🏗️ 1. Architecture Overview
- **Frontend**: Next.js 16 (deployed on Vercel)
- **Backend**: NestJS (deployed on Render/Railway)
- **Database**: PostgreSQL (Neon.tech or Supabase)
- **File Storage**: Cloudinary

---

## 🔒 2. Environment Variables Checklist
Before deploying, ensure you have the following secrets ready. 

### Backend (`backend/.env`)
```env
PORT=10000
NODE_ENV=production
JWT_SECRET=generate_a_very_long_secure_random_string
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
DATABASE_URL="postgresql://user:password@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?connection_limit=5"
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

### Frontend (`.env.production`)
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app
```

---

## 🚀 3. Deploying the Backend (Render)

We have included a `render.yaml` Blueprint file at the root.

1. Create a [Render](https://render.com/) account.
2. Connect your GitHub repository.
3. In the Render Dashboard, click **New > Blueprint**.
4. Select your repository. Render will automatically detect `render.yaml`.
5. Enter the required **Environment Variables** (specifically `DATABASE_URL`, `FRONTEND_URL`, and Cloudinary variables).
6. Click **Apply**. Render will automatically run `npm install`, `npx prisma generate`, build the NestJS app, and start it.

---

## 🚀 4. Deploying the Database (Neon) & Seeding

1. Create a free Postgres database on [Neon.tech](https://neon.tech/).
2. Copy the connection string into your Backend's `DATABASE_URL`.
3. Once your backend is connected locally to the production database, you need to push the schema and seed the initial admin users:
   ```bash
   cd backend
   npx prisma migrate deploy   # Pushes the schema to the production DB safely
   npm run db:seed             # Generates the Owner/Admin credentials and settings
   ```

---

## 🚀 5. Deploying the Frontend (Vercel)

We have included a `vercel.json` to enforce strict security headers and optimize regions.

1. Create a [Vercel](https://vercel.com/) account.
2. Click **Add New Project** and select your GitHub repository.
3. Under **Framework Preset**, Next.js should automatically be selected.
4. Open **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL` (Point this to your live Render backend URL).
5. Click **Deploy**. Vercel will build the frontend, optimize images via the `next.config.ts`, and launch the app.

---

## 🛡️ 6. Production Security Hardening (Implemented)

The codebase has been hardened with the following:
- **Helmet**: Secures the backend by setting various HTTP headers (XSS filtering, HSTS, etc.).
- **Throttler (Rate Limiting)**: Prevents brute-force login attempts (Current limit: 100 requests per minute).
- **Strict ValidationPipe**: Strips all unknown fields from incoming POST/PATCH requests, preventing Mass Assignment vulnerabilities.
- **CORS Lock**: The backend strictly only accepts requests from the `FRONTEND_URL`.
- **JWT Persistence**: Invalid tokens throw a 401, which the frontend's unified `apiClient` gracefully catches to force a clean logout rather than crashing the UI.

---

## 🧪 7. QA & Testing Checklist

After deployment, perform the following validation:
- [ ] **Login Flow**: Log in using `owner@edutrack.in` / `Admin@123`.
- [ ] **Create a Student**: Ensure the payload succeeds and the table updates.
- [ ] **Upload a File**: Go to the Student's "Documents" tab, upload a test PDF/JPG, and verify it renders from Cloudinary.
- [ ] **Dashboard Analytics**: Confirm the Recharts graphs load without console errors.
- [ ] **Settings Save**: Navigate to Settings, change the Institute Name, and verify the "Saved successfully" toast appears.

## 📈 8. Post-Launch Optimizations
- **Connection Pooling**: Neon provides a pooled connection URL (usually port 6543 or with `?pgbouncer=true`). Use this in `DATABASE_URL` to prevent running out of DB connections under heavy load.
- **CDN Caching**: Next.js App Router aggressively caches fetch requests by default. Ensure your dynamic APIs are actively triggering `revalidatePath` if you notice stale data.
