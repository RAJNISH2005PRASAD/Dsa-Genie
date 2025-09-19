# DSA Genie Deployment Guide

This guide will help you deploy your DSA Genie platform with:
- **Frontend (React + Vite)** → **Vercel**
- **Backend (Node.js + Express)** → **Render**

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **MongoDB Atlas**: Set up a cloud MongoDB database
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
4. **Render Account**: Sign up at [render.com](https://render.com)

## Step 1: Prepare Your Repository

### 1.1 Push your code to GitHub
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Create a new branch for deployment (if main is protected)
```bash
git checkout -b deploy
git push origin deploy
```

## Step 2: Deploy Backend to Render

### 2.1 Create a new Web Service on Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository and branch

### 2.2 Configure the Web Service

**Basic Settings:**
- **Name**: `dsa-genie-backend`
- **Environment**: `Node`
- **Branch**: `main` (or `deploy` if using a different branch)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.3 Set Environment Variables

In the Render dashboard, go to your service → Environment tab and add:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dsa-genie
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=https://your-frontend-url.vercel.app
```

**Optional AI Service Keys:**
```
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-judge0-api-key
```

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait for the build to complete (5-10 minutes)
3. Note your backend URL (e.g., `https://dsa-genie-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

### 3.1 Create a new project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select your repository

### 3.2 Configure the Project

**Framework Preset**: `Vite`
**Root Directory**: `client`
**Build Command**: `npm run build`
**Output Directory**: `dist`

### 3.3 Set Environment Variables

In the Vercel dashboard, go to your project → Settings → Environment Variables and add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with your actual Render backend URL.

### 3.4 Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-5 minutes)
3. Note your frontend URL (e.g., `https://dsa-genie.vercel.app`)

## Step 4: Update Backend CORS Settings

After getting your Vercel frontend URL, update your Render backend:

1. Go to your Render service → Environment
2. Update `CLIENT_URL` to your actual Vercel URL
3. Redeploy the service

## Step 5: Test Your Deployment

### 5.1 Test Backend
Visit: `https://your-backend-url.onrender.com/api/health`
You should see: `{"status":"OK","message":"DSA Genie Server is running!"}`

### 5.2 Test Frontend
Visit your Vercel URL and check if:
- The page loads correctly
- API calls work (check browser network tab)
- Authentication works
- All features function properly

## Step 6: Set Up Custom Domain (Optional)

### 6.1 Vercel Custom Domain
1. Go to your Vercel project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 6.2 Render Custom Domain
1. Go to your Render service → Settings → Custom Domains
2. Add your custom domain
3. Update DNS records as instructed

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `CLIENT_URL` in Render matches your Vercel URL exactly
   - Check that CORS origins include your Vercel domain

2. **Build Failures**
   - Check build logs in Vercel/Render dashboards
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

3. **Environment Variables**
   - Double-check all environment variables are set correctly
   - Ensure no typos in variable names
   - Restart services after changing environment variables

4. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

### Useful Commands:

```bash
# Test build locally
cd client && npm run build
cd server && npm start

# Check environment variables
echo $VITE_API_URL
echo $MONGO_URI

# View logs
# Vercel: Check deployment logs in dashboard
# Render: Check service logs in dashboard
```

## Environment Variables Reference

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Backend (Render)
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dsa-genie
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=https://your-frontend-url.vercel.app
OPENAI_API_KEY=your-openai-api-key (optional)
GEMINI_API_KEY=your-gemini-api-key (optional)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com (optional)
JUDGE0_API_KEY=your-judge0-api-key (optional)
```

## Cost Information

- **Vercel**: Free tier includes 100GB bandwidth, unlimited static deployments
- **Render**: Free tier includes 750 hours/month, sleeps after 15 minutes of inactivity
- **MongoDB Atlas**: Free tier includes 512MB storage

## Next Steps

1. Set up monitoring and logging
2. Configure CI/CD for automatic deployments
3. Set up error tracking (Sentry, etc.)
4. Implement caching strategies
5. Set up backup strategies for your database

---

**Need Help?** Check the logs in your Vercel and Render dashboards for detailed error messages.
