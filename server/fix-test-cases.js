const mongoose = require('mongoose');
const Problem = require('./models/Problem');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-genie')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function fixTestCases() {
  try {
    const problems = await Problem.find({});
    for (const problem of problems) {
      let changed = false;
      if (problem.testCases && problem.testCases.length > 0) {
        for (const tc of problem.testCases) {
          if (typeof tc.input !== 'string') {
            tc.input = JSON.stringify(tc.input);
            changed = true;
          }
          if (typeof tc.output !== 'string') {
            tc.output = JSON.stringify(tc.output);
            changed = true;
          }
        }
        if (changed) {
          await problem.save();
          console.log(`Fixed test cases for: ${problem.title}`);
        }
      }
    }
    console.log('All test cases fixed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixTestCases(); 