const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌐 MongoDB Atlas Setup\n');

console.log('Follow these steps to get your MongoDB Atlas connection string:');
console.log('1. Go to: https://www.mongodb.com/atlas/database');
console.log('2. Sign up for free (no credit card required)');
console.log('3. Create a free cluster (M0 tier)');
console.log('4. Set up database user (username/password)');
console.log('5. Allow network access from anywhere');
console.log('6. Get your connection string from "Connect" button\n');

console.log('Your connection string should look like this:');
console.log('mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dsa?retryWrites=true&w=majority\n');

rl.question('Enter your MongoDB Atlas connection string: ', (connectionString) => {
  if (!connectionString || !connectionString.includes('mongodb+srv://')) {
    console.log('❌ Invalid connection string. It should start with "mongodb+srv://"');
    rl.close();
    return;
  }

  const envPath = path.join(__dirname, '.env');
  let envContent = '';

  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add MONGO_URI
  if (envContent.includes('MONGO_URI=')) {
    envContent = envContent.replace(
      /MONGO_URI=.*/,
      `MONGO_URI=${connectionString}`
    );
  } else {
    envContent += `\nMONGO_URI=${connectionString}`;
  }

  // Write back to .env file
  fs.writeFileSync(envPath, envContent);

  console.log('✅ MongoDB Atlas connection string saved to .env file!');
  console.log('You can now run: npm start');
  
  rl.close();
}); 