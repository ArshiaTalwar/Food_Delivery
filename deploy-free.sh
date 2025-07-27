#!/bin/bash

echo "🆓 Zwiggy Free Deployment Guide"
echo "================================"
echo ""

echo "Choose your free deployment option:"
echo "1. Railway (Recommended - $5 credit monthly)"
echo "2. Render (750 hours/month free)"
echo "3. Vercel + Railway (Frontend + Backend)"
echo "4. Netlify + Railway (Frontend + Backend)"
echo "5. Show all options"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚂 Railway Deployment Steps:"
        echo "1. Go to https://railway.app and sign up with GitHub"
        echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "3. Select this repository"
        echo "4. Railway will auto-deploy your backend"
        echo "5. Add these environment variables in Railway dashboard:"
        echo ""
        echo "   NODE_ENV=production"
        echo "   MONGO_URL=your-mongodb-atlas-connection-string"
        echo "   JWT_SECRET=$(openssl rand -base64 32)"
        echo "   SALT=12"
        echo "   STRIPE_SECRET_KEY=your-stripe-secret-key"
        echo ""
        echo "6. For frontend, create a new service and set:"
        echo "   Build Command: cd frontend && npm install && npm run build"
        echo "   Start Command: npx serve -s frontend/dist -p \$PORT"
        echo ""
        echo "🎉 Your app will be live at https://your-app.up.railway.app"
        ;;
        
    2)
        echo ""
        echo "🎨 Render Deployment Steps:"
        echo "1. Go to https://render.com and sign up"
        echo "2. Connect your GitHub repository"
        echo "3. Create a Web Service for backend:"
        echo "   Build Command: cd backend && npm install"
        echo "   Start Command: cd backend && node server.js"
        echo ""
        echo "4. Create a Static Site for frontend:"
        echo "   Build Command: cd frontend && npm install && npm run build"
        echo "   Publish Directory: frontend/dist"
        echo ""
        echo "🎉 Your app will be live at your-app.onrender.com"
        ;;
        
    3)
        echo ""
        echo "▲ Vercel + Railway Deployment:"
        echo "Backend (Railway):"
        echo "1. Deploy backend to Railway (see option 1)"
        echo ""
        echo "Frontend (Vercel):"
        echo "1. Go to https://vercel.com and sign up"
        echo "2. Import your GitHub repository"
        echo "3. Set Framework Preset: 'Vite'"
        echo "4. Set Root Directory: 'frontend'"
        echo "5. Build Command: npm run build"
        echo "6. Output Directory: dist"
        echo ""
        echo "🎉 Frontend: your-app.vercel.app"
        echo "🎉 Backend: your-backend.up.railway.app"
        ;;
        
    4)
        echo ""
        echo "🌐 Netlify + Railway Deployment:"
        echo "Backend (Railway):"
        echo "1. Deploy backend to Railway (see option 1)"
        echo ""
        echo "Frontend (Netlify):"
        echo "1. Go to https://netlify.com and sign up"
        echo "2. Drag & drop your frontend/dist folder after building"
        echo "3. Or connect GitHub repo and set:"
        echo "   Base directory: frontend"
        echo "   Build command: npm run build"
        echo "   Publish directory: frontend/dist"
        echo ""
        echo "🎉 Frontend: your-app.netlify.app"
        echo "🎉 Backend: your-backend.up.railway.app"
        ;;
        
    5)
        echo ""
        echo "📋 All Free Deployment Options:"
        echo ""
        echo "🚂 Railway: $5 credit/month - railway.app"
        echo "🎨 Render: 750 hours/month - render.com" 
        echo "▲ Vercel: Unlimited static sites - vercel.com"
        echo "🌐 Netlify: 100GB bandwidth/month - netlify.com"
        echo "🔥 Firebase: 125K invocations/month - firebase.google.com"
        echo "⚡ Cyclic: Unlimited apps - cyclic.sh"
        echo ""
        echo "📊 Database Options (Free):"
        echo "🍃 MongoDB Atlas: 512MB storage - mongodb.com/cloud/atlas"
        echo "🐬 PlanetScale: 5GB storage - planetscale.com"
        echo "🐘 Supabase: 500MB storage - supabase.com"
        echo ""
        ;;
        
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Next Steps:"
echo "1. Set up MongoDB Atlas (free):"
echo "   - Go to https://mongodb.com/cloud/atlas"
echo "   - Create free cluster"
echo "   - Create database user" 
echo "   - Get connection string"
echo ""
echo "2. Update environment variables with your values"
echo "3. Deploy and enjoy your free app! 🎉"
echo ""
echo "💡 Need help? Check FREE_DEPLOYMENT_GUIDE.md for detailed instructions"