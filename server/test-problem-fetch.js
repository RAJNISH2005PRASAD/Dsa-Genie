const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-genie', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testProblemCreationAndFetch() {
  try {
    console.log('Testing problem creation and fetch...');
    
    // Create a test problem
    const testProblem = new Problem({
      title: 'Test Problem - Two Sum',
      slug: 'test-problem-two-sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'easy',
      topics: ['arrays', 'two-pointers'],
      constraints: ['2 <= nums.length <= 104', '-109 <= nums[i] <= 109'],
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        }
      ],
      testCases: [
        {
          input: '[2,7,11,15]\n9',
          output: '[0,1]',
          isHidden: false
        }
      ],
      solutionTemplate: {
        javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
        python: 'def twoSum(nums, target):\n    # Your code here',
        java: 'public int[] twoSum(int[] nums, int target) {\n    // Your code here\n}',
        cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}'
      },
      source: 'Test Creation',
      isActive: true
    });

    // Save the problem
    const savedProblem = await testProblem.save();
    console.log('✅ Problem created successfully:', {
      id: savedProblem._id,
      title: savedProblem.title,
      slug: savedProblem.slug,
      isActive: savedProblem.isActive
    });

    // Test fetching by slug
    const fetchedBySlug = await Problem.findOne({ slug: 'test-problem-two-sum', isActive: true });
    console.log('✅ Fetched by slug:', fetchedBySlug ? 'SUCCESS' : 'FAILED');
    if (fetchedBySlug) {
      console.log('   - Title:', fetchedBySlug.title);
      console.log('   - Slug:', fetchedBySlug.slug);
    }

    // Test fetching by ID
    const fetchedById = await Problem.findById(savedProblem._id);
    console.log('✅ Fetched by ID:', fetchedById ? 'SUCCESS' : 'FAILED');
    if (fetchedById) {
      console.log('   - Title:', fetchedById.title);
      console.log('   - Slug:', fetchedById.slug);
    }

    // Test fetching all problems
    const allProblems = await Problem.find({ isActive: true });
    console.log('✅ Total active problems:', allProblems.length);

    // Clean up - delete the test problem
    await Problem.findByIdAndDelete(savedProblem._id);
    console.log('✅ Test problem cleaned up');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testProblemCreationAndFetch(); 