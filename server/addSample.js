const mongoose = require('mongoose');
const Problem = require('./models/Problem');
require('dotenv').config();

async function addSample() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Delete existing
  await Problem.findOneAndDelete({ slug: 'two-sum' });
  
  // Add new
  const problem = new Problem({
    title: 'Two Sum',
    slug: 'two-sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'easy',
    topics: ['arrays', 'hashmap'],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' }
    ],
    testCases: [
      { input: '[2,7,11,15]\n9', output: '[0,1]' },
      { input: '[3,2,4]\n6', output: '[1,2]' },
      { input: '[3,3]\n6', output: '[0,1]' },
      { input: '[1,5,3,7]\n8', output: '[1,2]' },
      { input: '[1,2,3,4]\n7', output: '[2,3]' }
    ],
    isActive: true,
    stats: { totalSubmissions: 0, acceptedSubmissions: 0, acceptanceRate: 0 }
  });
  await problem.save();
  console.log('Sample problem added');
  process.exit();
}
addSample();