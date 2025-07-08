const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 OpenAI API Key Setup\n');

console.log('To get your OpenAI API key:');
console.log('1. Go to https://platform.openai.com/');
console.log('2. Sign up or log in');
console.log('3. Go to API Keys section');
console.log('4. Click "Create new secret key"');
console.log('5. Copy the key (it starts with "sk-...")\n');

rl.question('Enter your OpenAI API key: ', (apiKey) => {
  if (!apiKey || !apiKey.startsWith('sk-')) {
    console.log('❌ Invalid API key format. API keys should start with "sk-"');
    rl.close();
    return;
  }

  const envPath = path.join(__dirname, '.env');
  let envContent = '';

  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add OPENAI_API_KEY
  if (envContent.includes('OPENAI_API_KEY=')) {
    envContent = envContent.replace(
      /OPENAI_API_KEY=.*/,
      `OPENAI_API_KEY=${apiKey}`
    );
  } else {
    envContent += `\nOPENAI_API_KEY=${apiKey}`;
  }

  // Write back to .env file
  fs.writeFileSync(envPath, envContent);

  console.log('✅ API key saved to .env file!');
  console.log('You can now run: node generateProblems.js arrays easy');
  
  rl.close();
}); 