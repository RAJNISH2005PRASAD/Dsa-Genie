# Quick Setup Guide

## 1. Set up Environment Variables

Create a `.env` file in the `server` directory with the following content:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/dsa-genie

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Gemini API Key (Get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

## 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and paste it in your `.env` file

## 3. Start the Application

### Terminal 1 - Start Server
```bash
cd server
npm install
npm start
```

### Terminal 2 - Start Client
```bash
cd client
npm install
npm run dev
```

## 4. Test the Setup

1. **Test Registration**: Try creating a new user account
2. **Test AI Features**: Go to Admin panel and try generating a problem
3. **Test Manual Creation**: Try creating a problem manually

## 5. Troubleshooting

### If registration fails:
```bash
cd server
node test-registration.js
```

### If AI generation fails:
```bash
cd server
node test-problem-generation.js
```

### Common Issues:
- **"GEMINI_API_KEY is not configured"**: Make sure you've added the API key to `.env`
- **"Failed to generate problem"**: Check if your API key is valid and has quota
- **"Registration failed"**: Check MongoDB connection

## 6. Features Available

Once set up, you can:
- ✅ Create user accounts
- ✅ Generate DSA problems with AI
- ✅ Create problems manually
- ✅ Generate contests with AI
- ✅ Use AI chat and hints
- ✅ Get problem recommendations

## 7. Admin Panel Features

- **Manual Problem Creation**: Create problems with full control
- **AI Problem Generation**: Generate problems with specific topics/difficulty
- **Contest Generation**: Create contests with multiple problems
- **Additional Context**: Provide custom descriptions for AI generation 