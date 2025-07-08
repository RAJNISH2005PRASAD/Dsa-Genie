# Gemini API Setup Guide

This guide will help you set up the Gemini API for the DSA Genie application.

## Prerequisites

- A Google account
- Node.js and npm installed
- MongoDB connection configured

## Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (it will look like a long string)

## Step 2: Configure the API Key

### Option A: Using the Setup Script (Recommended)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run the Gemini setup script:
   ```bash
   node setup-gemini.js
   ```

3. Enter your Gemini API key when prompted

### Option B: Manual Configuration

1. Create a `.env` file in the server directory if it doesn't exist
2. Add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Step 3: Test the Setup

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. Test the registration functionality:
   ```bash
   node test-registration.js
   ```

3. Access the admin panel in your browser and try generating a problem with AI

## Step 4: Verify Everything Works

1. **Registration**: Try creating a new user account
2. **Admin Panel**: Access the admin panel and test:
   - Manual problem creation
   - AI problem generation
   - Contest generation
3. **AI Features**: Test chat, hints, and explanations

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY is not configured"**
   - Make sure you've added the API key to your `.env` file
   - Restart the server after adding the key

2. **"Failed to generate problem"**
   - Check if your API key is valid
   - Ensure you have sufficient quota on your Google AI Studio account
   - Check the server logs for detailed error messages

3. **"Registration failed"**
   - Run the registration test: `node test-registration.js`
   - Check MongoDB connection
   - Verify the server is running on the correct port

### API Quota and Limits

- Free tier: 15 requests per minute
- Paid tier: Higher limits available
- Monitor usage in [Google AI Studio](https://makersuite.google.com/app/apikey)

### Environment Variables

Make sure your `.env` file contains:
```
GEMINI_API_KEY=your_api_key_here
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Features Available with Gemini

Once configured, you can use:

1. **AI Problem Generation**: Generate DSA problems with specific topics and difficulty levels
2. **Contest Generation**: Create contests with multiple problems
3. **Manual Problem Creation**: Create problems manually with AI assistance
4. **AI Chat**: Get help with DSA concepts
5. **Hints and Explanations**: AI-powered hints for problems
6. **Solution Analysis**: Analyze user solutions and provide feedback
7. **Learning Paths**: Generate personalized learning paths
8. **Problem Recommendations**: AI-powered problem recommendations

## Security Notes

- Never commit your API key to version control
- Use environment variables for sensitive data
- Monitor API usage to avoid unexpected charges
- Consider implementing rate limiting for production use

## Support

If you encounter issues:

1. Check the server logs for error messages
2. Verify your API key is correct
3. Test with the provided test scripts
4. Check your Google AI Studio account for quota issues 