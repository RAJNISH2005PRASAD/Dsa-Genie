const mongoose = require('mongoose');
const Problem = require('./models/Problem');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-genie')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample test cases for different problem types
const sampleTestCases = {
  'two-sum': [
    {
      input: '[2, 7, 11, 15]\n9',
      output: '[0, 1]',
      isHidden: false
    },
    {
      input: '[3, 2, 4]\n6',
      output: '[1, 2]',
      isHidden: false
    },
    {
      input: '[3, 3]\n6',
      output: '[0, 1]',
      isHidden: false
    }
  ],
  'reverse-string': [
    {
      input: 'hello',
      output: 'olleh',
      isHidden: false
    },
    {
      input: 'world',
      output: 'dlrow',
      isHidden: false
    },
    {
      input: 'a',
      output: 'a',
      isHidden: false
    }
  ],
  'palindrome-number': [
    {
      input: '121',
      output: 'true',
      isHidden: false
    },
    {
      input: '-121',
      output: 'false',
      isHidden: false
    },
    {
      input: '10',
      output: 'false',
      isHidden: false
    }
  ],
  'valid-parentheses': [
    {
      input: '()',
      output: 'true',
      isHidden: false
    },
    {
      input: '()[]{}',
      output: 'true',
      isHidden: false
    },
    {
      input: '(]',
      output: 'false',
      isHidden: false
    }
  ]
};

async function addTestCases() {
  try {
    // Get all problems
    const problems = await Problem.find({});
    console.log(`Found ${problems.length} problems`);

    for (const problem of problems) {
      console.log(`Processing: ${problem.title}`);
      
      // Check if problem already has test cases
      if (problem.testCases && problem.testCases.length > 0) {
        console.log(`  - Already has ${problem.testCases.length} test cases`);
        continue;
      }

      // Try to find matching test cases based on slug
      let testCases = [];
      if (sampleTestCases[problem.slug]) {
        testCases = sampleTestCases[problem.slug];
        console.log(`  - Adding ${testCases.length} test cases from template`);
      } else {
        // Create generic test cases
        testCases = [
          {
            input: 'test input',
            output: 'expected output',
            isHidden: false
          },
          {
            input: 'another test',
            output: 'another expected',
            isHidden: false
          }
        ];
        console.log(`  - Adding ${testCases.length} generic test cases`);
      }

      // Update the problem with test cases
      problem.testCases = testCases;
      await problem.save();
      console.log(`  - Updated successfully`);
    }

    console.log('All problems processed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
addTestCases(); 