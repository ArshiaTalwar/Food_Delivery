# Free Deployment Options for Zwiggy

This guide covers **completely free** deployment options for your MERN stack food delivery application.

## 🆓 Option 1: Railway (Recommended - Easiest)

**Free Tier:** $5 credit monthly (usually enough for small apps)

### Steps:
1. **Sign up at [Railway.app](https://railway.app) with GitHub**
2. **Create new project from GitHub repo**
3. **Deploy backend:**
   ```bash
   # Railway will auto-detect Node.js
   # Add these environment variables in Railway dashboard:
   ```
   - `NODE_ENV=production`
   - `PORT=4000`
   - `MONGO_URL=<your-mongodb-atlas-url>`
   - `JWT_SECRET=your-super-secret-key`
   - `STRIPE_SECRET_KEY=your-stripe-key`

4. **Deploy frontend:**
   - Add separate service for frontend
   - Set build command: `npm run build`
   - Set start command: `npx serve -s dist -p $PORT`

### Database: Use MongoDB Atlas Free Tier
- 512MB storage (free forever)
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🆓 Option 2: Render + MongoDB Atlas (Most Reliable)

**Free Tier:** Unlimited static sites, 750 hours/month for web services

### Backend Deployment:
1. **Sign up at [Render.com](https://render.com)**
2. **Connect your GitHub repo**
3. **Create Web Service:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
   - Environment Variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGO_URL=your-mongodb-atlas-url
     JWT_SECRET=your-super-secret-key
     STRIPE_SECRET_KEY=your-stripe-key
     ```

### Frontend Deployment:
1. **Create Static Site on Render**
2. **Build Command:** `cd frontend && npm install && npm run build`
3. **Publish Directory:** `frontend/dist`

---

## 🆓 Option 3: Vercel + PlanetScale/MongoDB Atlas

### Frontend (Vercel):
1. **Sign up at [Vercel.com](https://vercel.com)**
2. **Import your GitHub repo**
3. **Configure:**
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Backend Options:
**Option A: Vercel Functions (Serverless)**
- Convert Express app to Vercel functions
- Limited to 10 seconds execution time

**Option B: Railway/Render for backend**
- Use one of the above services just for backend

---

## 🆓 Option 4: Netlify + Railway

### Frontend (Netlify):
1. **Sign up at [Netlify.com](https://netlify.com)**
2. **Connect GitHub repo**
3. **Build settings:**
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`

### Backend (Railway):
- Use Railway for backend as described in Option 1

---

## 🆓 Option 5: Heroku Alternative - Cyclic

**Free Tier:** Unlimited apps, 1GB storage per app

### Steps:
1. **Sign up at [Cyclic.sh](https://www.cyclic.sh)**
2. **Connect GitHub repo**
3. **Auto-deploys from main branch**
4. **Add environment variables in dashboard**

---

## 🆓 Option 6: Firebase + MongoDB Atlas

### Frontend (Firebase Hosting):
1. **Install Firebase CLI:** `npm install -g firebase-tools`
2. **Initialize project:** `firebase init hosting`
3. **Deploy:** `firebase deploy`

### Backend (Firebase Functions):
- Convert Express to Firebase Functions
- 125K invocations/month free

---

## 🗄️ Free Database Options

### 1. MongoDB Atlas (Recommended)
- **Free Tier:** 512MB storage
- **Sign up:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Setup:**
  ```
  1. Create cluster
  2. Create database user
  3. Whitelist IP addresses (0.0.0.0/0 for development)
  4. Get connection string
  ```

### 2. PlanetScale (MySQL)
- **Free Tier:** 5GB storage, 1 billion reads/month
- Would require converting from MongoDB to MySQL

### 3. Supabase (PostgreSQL)
- **Free Tier:** 500MB storage, 50K auth users
- Would require converting from MongoDB to PostgreSQL

---

## 🚀 Quick Deploy Setup (Railway - Recommended)

### 1. Prepare Your Repo
```bash
# Add to root package.json
{
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "start": "cd backend && npm install && node server.js"
  }
}
```

### 2. Create railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. Environment Variables Template
```bash
# Copy this to Railway/Render environment variables
NODE_ENV=production
PORT=4000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/zwiggy?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-32-chars-min
SALT=12
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
FRONTEND_URL=https://your-frontend-domain.com
```

---

## 📋 Complete Free Stack Recommendation

**Best Free Combination:**
1. **Frontend:** Vercel or Netlify
2. **Backend:** Railway or Render
3. **Database:** MongoDB Atlas Free Tier
4. **Domain:** Use provided subdomains or get free domain from Freenom

### Total Monthly Cost: $0 ✅

---

## 🔧 Quick Setup Commands

### MongoDB Atlas Setup:
```bash
# 1. Create cluster at mongodb.com/cloud/atlas
# 2. Create database user
# 3. Get connection string
# 4. Replace in environment variables
```

### Frontend Build for Static Hosting:
```bash
cd frontend
npm install
npm run build
# Upload 'dist' folder to Netlify/Vercel
```

### Backend Environment Setup:
```bash
# Create .env file with:
NODE_ENV=production
PORT=4000
MONGO_URL=your-mongodb-atlas-url
JWT_SECRET=your-super-secret-key-32-chars-minimum
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

---

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Update backend CORS to include your frontend domain
   - Add frontend URL to environment variables

2. **Environment Variables:**
   - Make sure all required variables are set
   - Use production URLs, not localhost

3. **Build Failures:**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json

4. **Database Connection:**
   - Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas
   - Use correct connection string format

---

## 📞 Free Support Resources

- **Railway:** [Discord Community](https://discord.gg/railway)
- **Render:** [Community Forum](https://community.render.com/)
- **Vercel:** [Discord Community](https://discord.gg/vercel)
- **MongoDB:** [Community Forums](https://developer.mongodb.com/community/forums/)

---

## 🎯 Quick Start (5-Minute Deploy)

1. **Fork/Clone this repo**
2. **Sign up for Railway**
3. **Connect GitHub repo**
4. **Set environment variables**
5. **Deploy!**

Your app will be live at: `https://your-app-name.up.railway.app`

**All completely free!** 🎉