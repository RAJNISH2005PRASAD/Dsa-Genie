#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🚀 DSA Genie Test Automation Runner');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Copying from .env.example...');
  fs.copyFileSync(path.join(__dirname, '.env.example'), envPath);
  console.log('✅ Created .env file. Please update it with your configuration.\n');
}

// Check if application is running
console.log('🔍 Checking if applications are running...');

const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
const apiUrl = process.env.API_URL || 'http://localhost:3000';

try {
  // Check if frontend is accessible
  execSync(`curl -s ${baseUrl} > /dev/null`, { stdio: 'pipe' });
  console.log(`✅ Frontend is running on ${baseUrl}`);
} catch (error) {
  console.log(`❌ Frontend not accessible on ${baseUrl}`);
  console.log('   Please start the frontend: cd ../client && npm run dev\n');
}

try {
  // Check if backend is accessible
  execSync(`curl -s ${apiUrl}/api/health > /dev/null`, { stdio: 'pipe' });
  console.log(`✅ Backend is running on ${apiUrl}`);
} catch (error) {
  console.log(`❌ Backend not accessible on ${apiUrl}`);
  console.log('   Please start the backend: cd ../server && npm run dev\n');
}

console.log('\n📋 Available test commands:');
console.log('  npm test              - Run all tests');
console.log('  npm run test:smoke    - Run smoke tests only');
console.log('  npm run test:ci       - Run tests with CI reporter');
console.log('  npm run jira:upload   - Upload results to Jira');

console.log('\n🔧 Configuration needed:');
console.log('  1. Update .env file with correct URLs');
console.log('  2. Configure Jira settings (optional)');
console.log('  3. Ensure Chrome browser is installed');

console.log('\n🎯 Ready to run tests! Use: npm test\n');