# MongoDB Atlas Setup Guide

Since MongoDB is not installed locally, let's use MongoDB Atlas (free cloud database).

## Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/atlas/database
2. Click "Try Free"
3. Sign up with your email (no credit card required)

## Step 2: Create a Free Cluster

1. Choose "FREE" tier (M0)
2. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
3. Choose a region close to you
4. Click "Create"

## Step 3: Set Up Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

## Step 4: Set Up Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

## Step 5: Get Your Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

## Step 6: Update Your .env File

Replace the MONGO_URI in your `.env` file with your Atlas connection string:

```
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/dsa?retryWrites=true&w=majority
```

Replace:
- `yourusername` with your database username
- `yourpassword` with your database password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

## Step 7: Test Connection

Run your server:
```bash
npm start
```

You should see: "Connected to MongoDB"

## Alternative: Quick Setup Script

If you prefer, you can run:
```bash
node setup-atlas.js
```
And follow the prompts to configure MongoDB Atlas automatically. 