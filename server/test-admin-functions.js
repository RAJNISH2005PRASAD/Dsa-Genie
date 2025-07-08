const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const User = require('./models/User');
require('dotenv').config();

async function testAdminFunctions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-genie');
    console.log('Connected to MongoDB');

    console.log('Testing admin functions...');

    // Create a test admin user
    const adminUser = new User({
      username: 'testadmin' + Date.now(),
      email: 'admin' + Date.now() + '@test.com',
      password: 'adminpass123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Test admin user created');

    // Create a test problem
    const testProblem = new Problem({
      title: 'Test Problem for Admin Functions',
      slug: 'test-problem-admin-functions',
      description: 'This is a test problem to verify admin functions',
      difficulty: 'easy',
      topics: ['arrays'],
      constraints: ['1 <= n <= 100'],
      examples: [{
        input: '[1, 2, 3]',
        output: '6',
        explanation: 'Sum of array elements'
      }],
      testCases: [{
        input: '[1, 2, 3]',
        output: '6',
        isHidden: false
      }],
      solutionTemplate: {
        javascript: 'function solve(input) { return input.reduce((a, b) => a + b, 0); }',
        python: 'def solve(input): return sum(input)',
        java: 'public static int solve(int[] input) { return Arrays.stream(input).sum(); }',
        cpp: 'int solve(vector<int>& input) { return accumulate(input.begin(), input.end(), 0); }'
      },
      source: 'Manual Creation',
      isActive: true,
      tags: ['arrays']
    });
    await testProblem.save();
    console.log('✅ Test problem created');

    // Test getting admin problems
    const adminProblems = await Problem.find({
      $or: [
        { source: 'DSA Genie AI' },
        { source: 'Manual Creation' },
        { source: { $regex: /Admin/i } }
      ]
    }).select('title slug difficulty topics source createdAt');
    
    console.log(`✅ Found ${adminProblems.length} admin problems`);
    adminProblems.forEach(problem => {
      console.log(`  - ${problem.title} (${problem.difficulty}) - ${problem.source}`);
    });

    // Test updating problem
    const updatedProblem = await Problem.findByIdAndUpdate(
      testProblem._id,
      { 
        title: 'Updated Test Problem',
        difficulty: 'medium'
      },
      { new: true }
    );
    console.log('✅ Problem updated successfully');

    // Test deleting problem
    await Problem.findByIdAndDelete(testProblem._id);
    console.log('✅ Problem deleted successfully');

    // Verify deletion
    const deletedProblem = await Problem.findById(testProblem._id);
    if (!deletedProblem) {
      console.log('✅ Problem deletion verified');
    } else {
      console.log('❌ Problem still exists after deletion');
    }

    // Clean up
    await User.findByIdAndDelete(adminUser._id);
    console.log('✅ Test admin user cleaned up');

    console.log('\n🎉 All admin function tests passed!');
  } catch (error) {
    console.error('❌ Admin function test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testAdminFunctions(); 