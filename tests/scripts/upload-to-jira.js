const JiraIntegration = require('../e2e/JiraIntegration');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function uploadTestResults() {
  const jira = new JiraIntegration();

  try {
    // Read test results from mochawesome report
    const reportPath = path.join(__dirname, '../mochawesome-report/mochawesome.json');
    if (!fs.existsSync(reportPath)) {
      console.log('No test report found. Run tests first with: npm run test:ci');
      return;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    // Create test execution in Jira
    const executionKey = await jira.createTestExecution(
      process.env.JIRA_TEST_PLAN_KEY || 'DSA-TP-1',
      `Automated Test Execution - ${new Date().toISOString()}`
    );

    // Process test results
    const testResults = [];

    for (const suite of report.suites) {
      for (const test of suite.tests) {
        const status = test.state === 'passed' ? 'PASSED' : 'FAILED';
        const comment = test.state === 'failed' ? test.err.message : 'Test passed successfully';

        // Generate test case key from test title
        const testCaseKey = `DSA-TC-${test.title.replace(/\s+/g, '-').toLowerCase()}`;

        testResults.push({
          testCaseKey,
          status,
          comment,
          attachments: [] // Could add screenshots here if available
        });
      }
    }

    // Upload results
    await jira.uploadTestResults(testResults);
    console.log(`Successfully uploaded ${testResults.length} test results to Jira`);

  } catch (error) {
    console.error('Error uploading test results to Jira:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  uploadTestResults();
}

module.exports = { uploadTestResults };