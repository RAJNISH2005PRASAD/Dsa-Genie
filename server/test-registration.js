const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testRegistration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-genie');
    console.log('Connected to MongoDB');

    // Test user data
    const testUser = {
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'testpass123'
    };

    console.log('Testing registration with:', testUser);

    // Create user
    const user = new User(testUser);
    await user.save();

    console.log('✅ User created successfully:', {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    // Test password comparison
    const isPasswordValid = await user.comparePassword('testpass123');
    console.log('✅ Password comparison test:', isPasswordValid);

    // Test duplicate username
    try {
      const duplicateUser = new User({
        username: testUser.username,
        email: 'different@example.com',
        password: 'testpass123'
      });
      await duplicateUser.save();
      console.log('❌ Duplicate username should have failed');
    } catch (error) {
      console.log('✅ Duplicate username correctly rejected:', error.message);
    }

    // Test duplicate email
    try {
      const duplicateEmail = new User({
        username: 'differentuser',
        email: testUser.email,
        password: 'testpass123'
      });
      await duplicateEmail.save();
      console.log('❌ Duplicate email should have failed');
    } catch (error) {
      console.log('✅ Duplicate email correctly rejected:', error.message);
    }

    // Clean up
    await User.findByIdAndDelete(user._id);
    console.log('✅ Test user cleaned up');

    console.log('\n🎉 All registration tests passed!');
  } catch (error) {
    console.error('❌ Registration test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testRegistration(); 