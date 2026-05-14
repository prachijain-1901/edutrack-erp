# Deployment Guide — EduTrack ERP

This guide covers the steps to deploy EduTrack ERP to production using Vercel (Frontend) and Render/Neon (Backend/Database).

## 🗄️ 1. Database Setup (Neon/PostgreSQL)
1.  Create a free project at [Neon.tech](https://neon.tech).
2.  Copy the connection string (e.g., `postgres://user:pass@host/dbname?sslmode=require`).
3.  Add this to your backend `.env` as `DATABASE_URL`.

## ⚙️ 2. Backend Deployment (Render)
1.  Connect your GitHub repository to [Render.com](https://render.com).
2.  Create a **Web Service**.
3.  **Root Directory**: `backend`
4.  **Build Command**: `npm install && npx prisma generate && npm run build`
5.  **Start Command**: `npm run start:prod`
6.  **Environment Variables**:
    - `DATABASE_URL`: Your Neon string.
    - `JWT_SECRET`: A long random string.
    - `CLOUDINARY_URL`: Your Cloudinary API environment variable.
    - `THROTTLE_TTL`: `60000`
    - `THROTTLE_LIMIT`: `100`

## 🎨 3. Frontend Deployment (Vercel)
1.  Push your code to GitHub.
2.  Import the project in [Vercel](https://vercel.com).
3.  **Framework Preset**: Next.js
4.  **Root Directory**: `./` (Root)
5.  **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: Your Render Web Service URL (e.g., `https://edutrack-api.onrender.com/api/v1`)
    - `NEXT_PUBLIC_SOCKET_URL`: Your Render Web Service URL (without `/api/v1`)

## ☁️ 4. Cloudinary Setup
1.  Create a free account at [Cloudinary](https://cloudinary.com).
2.  Go to the Dashboard and find your "API Environment variable".
3.  Add it to your backend env as `CLOUDINARY_URL`.

## 🧪 5. Verification
Once deployed:
1.  Access the frontend URL.
2.  Check the browser console to ensure the WebSocket connects successfully.
3.  Perform a test login to verify API connectivity.
