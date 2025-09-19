#!/usr/bin/env node

/**
 * DSA Genie Deployment Setup Script
 * This script helps prepare your project for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 DSA Genie Deployment Setup\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Check if client and server directories exist
if (!fs.existsSync('client') || !fs.existsSync('server')) {
  console.error('❌ Client and server directories not found');
  process.exit(1);
}

console.log('✅ Project structure looks good\n');

// Create environment files if they don't exist
const clientEnvPath = 'client/.env.local';
const serverEnvPath = 'server/.env';

if (!fs.existsSync(clientEnvPath)) {
  const clientEnvContent = `# Vercel Environment Variables
VITE_API_URL=https://your-backend-url.onrender.com/api
`;
  fs.writeFileSync(clientEnvPath, clientEnvContent);
  console.log('📝 Created client/.env.local');
}

if (!fs.existsSync(serverEnvPath)) {
  const serverEnvContent = `# Render Environment Variables
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dsa-genie
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=https://your-frontend-url.vercel.app

# AI Service Keys (optional)
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key

# Judge0 API (optional)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-judge0-api-key
`;
  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log('📝 Created server/.env');
}

// Check if all required files exist
const requiredFiles = [
  'client/vercel.json',
  'render.yaml',
  'DEPLOYMENT_GUIDE.md'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check the setup.');
  process.exit(1);
}

console.log('\n🎉 Setup complete! Next steps:');
console.log('1. Update environment variables in client/.env.local and server/.env');
console.log('2. Push your code to GitHub');
console.log('3. Follow the DEPLOYMENT_GUIDE.md for detailed instructions');
console.log('4. Deploy backend to Render first');
console.log('5. Deploy frontend to Vercel');
console.log('6. Update CORS settings with your actual URLs');

console.log('\n📚 Read DEPLOYMENT_GUIDE.md for complete instructions');
