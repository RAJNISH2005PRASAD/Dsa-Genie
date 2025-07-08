const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 DSA Genie AI Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const defaultEnv = `# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key-here

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/dsa

# Server Configuration
PORT=5000
NODE_ENV=development`;
  
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ .env file created');
}

// Check if OpenAI API key is set
const envContent = fs.readFileSync(envPath, 'utf8');
const hasApiKey = envContent.includes('OPENAI_API_KEY=sk-');

if (!hasApiKey) {
  console.log('⚠️  OpenAI API key not found in .env file');
  console.log('Run: node setup-openai.js to set up your API key\n');
} else {
  console.log('✅ OpenAI API key found');
}

// Check if MongoDB is running
console.log('\n🔍 Checking MongoDB connection...');
try {
  // Try to connect to MongoDB
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/dsa', { 
    serverSelectionTimeoutMS: 5000 
  });
  
  mongoose.connection.once('open', () => {
    console.log('✅ MongoDB is running');
    mongoose.disconnect();
  });
  
  mongoose.connection.on('error', () => {
    console.log('❌ MongoDB is not running');
    console.log('Please start MongoDB first:');
    console.log('  - Windows: Start MongoDB service or run mongod');
    console.log('  - macOS/Linux: brew services start mongodb-community');
    console.log('  - Or install MongoDB if not installed\n');
  });
  
} catch (error) {
  console.log('❌ Error checking MongoDB:', error.message);
}

// Check if all required packages are installed
console.log('\n📦 Checking required packages...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const requiredPackages = ['openai', 'mongoose', 'dotenv'];
  
  for (const pkg of requiredPackages) {
    if (packageJson.dependencies && packageJson.dependencies[pkg]) {
      console.log(`✅ ${pkg} is installed`);
    } else {
      console.log(`❌ ${pkg} is missing`);
    }
  }
} catch (error) {
  console.log('❌ Error checking packages:', error.message);
}

console.log('\n📋 Setup Summary:');
console.log('1. ✅ .env file created');
console.log('2. ⚠️  Set your OpenAI API key: node setup-openai.js');
console.log('3. ⚠️  Start MongoDB if not running');
console.log('4. ✅ Required packages checked');
console.log('\n🎯 Next steps:');
console.log('1. Get your OpenAI API key from https://platform.openai.com/');
console.log('2. Run: node setup-openai.js');
console.log('3. Start MongoDB');
console.log('4. Run: node generateProblems.js arrays easy');
console.log('5. Start your server: npm start');
console.log('6. Start your client: cd ../client && npm start');

rl.close(); 