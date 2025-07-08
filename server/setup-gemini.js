const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Gemini API Key Setup\n');

console.log('To get your Gemini API key:');
console.log('1. Go to https://makersuite.google.com/app/apikey');
console.log('2. Sign in with your Google account');
console.log('3. Click "Create API Key"');
console.log('4. Copy the API key\n');

rl.question('Enter your Gemini API key: ', (apiKey) => {
  if (!apiKey || apiKey.trim().length === 0) {
    console.log('❌ API key cannot be empty');
    rl.close();
    return;
  }

  const envPath = path.join(__dirname, '.env');
  let envContent = '';

  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add GEMINI_API_KEY
  if (envContent.includes('GEMINI_API_KEY=')) {
    envContent = envContent.replace(
      /GEMINI_API_KEY=.*/,
      `GEMINI_API_KEY=${apiKey.trim()}`
    );
  } else {
    envContent += `\nGEMINI_API_KEY=${apiKey.trim()}`;
  }

  // Write back to .env file
  fs.writeFileSync(envPath, envContent);

  console.log('✅ Gemini API key saved to .env file!');
  console.log('You can now use AI features in the admin panel.');
  
  rl.close();
}); 