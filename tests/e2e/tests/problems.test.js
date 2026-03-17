const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const TestBase = require('../TestBase');
const JiraIntegration = require('../JiraIntegration');

describe('DSA Genie - Problem Solving Tests', function() {
  let driver;
  let jira;
  const testResults = [];
  const testUser = {
    username: `solver_${Date.now()}`,
    email: `solver${Date.now()}@example.com`,
    password: 'SolverPass123!'
  };

  before(async function() {
    this.timeout(60000);
    driver = new TestBase();
    await driver.setupDriver();

    if (process.env.JIRA_HOST && process.env.JIRA_USERNAME) {
      jira = new JiraIntegration();
    }

    // Register and login test user
    await driver.navigateTo('/register');
    await driver.typeText(By.id('username'), testUser.username);
    await driver.typeText(By.id('email'), testUser.email);
    await driver.typeText(By.id('password'), testUser.password);
    await driver.typeText(By.id('confirmPassword'), testUser.password);
    await driver.clickElement(By.css('button[type="submit"]'));
    await driver.waitForElement(By.css('.dashboard'), 15000);
  });

  after(async function() {
    await driver.teardownDriver();

    if (jira && testResults.length > 0) {
      try {
        const executionKey = await jira.createTestExecution('DSA-TP-3', 'Problem Solving Test Execution');
        await jira.uploadTestResults(testResults);
      } catch (error) {
        console.error('Failed to upload results to Jira:', error);
      }
    }
  });

  afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      const screenshot = await driver.takeScreenshot(`problem_failed_${this.currentTest.title}`);
      if (jira) {
        testResults.push({
          testCaseKey: `DSA-TC-${this.currentTest.title.replace(/\s+/g, '-').toLowerCase()}`,
          status: 'FAILED',
          comment: `Test failed: ${this.currentTest.err.message}`,
          attachments: [screenshot]
        });
      }
    } else if (this.currentTest.state === 'passed' && jira) {
      testResults.push({
        testCaseKey: `DSA-TC-${this.currentTest.title.replace(/\s+/g, '-').toLowerCase()}`,
        status: 'PASSED',
        comment: 'Test passed successfully'
      });
    }
  });

  it('should display problems list', async function() {
    await driver.navigateTo('/problems');
    const problemsList = await driver.waitForElement(By.css('.problems-list'), 15000);
    expect(problemsList).to.not.be.null;

    // Check if problems are loaded
    const problemCards = await driver.driver.findElements(By.css('.problem-card'));
    expect(problemCards.length).to.be.greaterThan(0);
  });

  it('should navigate to problem detail page', async function() {
    await driver.navigateTo('/problems');
    await driver.waitForElement(By.css('.problem-card'), 15000);

    // Click on first problem
    const firstProblem = await driver.driver.findElement(By.css('.problem-card:first-child'));
    await firstProblem.click();

    // Wait for problem detail page
    const problemDetail = await driver.waitForElement(By.css('.problem-detail'), 15000);
    expect(problemDetail).to.not.be.null;

    // Check for code editor
    const codeEditor = await driver.waitForElement(By.css('.code-editor'), 10000);
    expect(codeEditor).to.not.be.null;
  });

  it('should submit code solution', async function() {
    // Assuming we're on a problem detail page
    const codeEditor = await driver.waitForElement(By.css('.code-editor'), 10000);

    // Type a simple solution (this would need to be adjusted based on actual editor)
    const solution = `
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`;

    // This selector would need to be adjusted based on the actual Monaco editor implementation
    await driver.driver.executeScript(`
      const editor = window.monaco.editor.getEditors()[0];
      if (editor) {
        editor.setValue(\`${solution}\`);
      }
    `);

    // Click submit button
    await driver.clickElement(By.css('.submit-btn'));

    // Wait for submission result
    const result = await driver.waitForElement(By.css('.submission-result'), 30000);
    expect(result).to.not.be.null;
  });

  it('should display submission history', async function() {
    await driver.navigateTo('/profile');
    const submissionsTab = await driver.waitForElement(By.css('[data-tab="submissions"]'), 10000);
    await submissionsTab.click();

    const submissionHistory = await driver.waitForElement(By.css('.submission-history'), 10000);
    expect(submissionHistory).to.not.be.null;
  });

  it('should filter problems by difficulty', async function() {
    await driver.navigateTo('/problems');

    // Click on difficulty filter (Easy)
    const easyFilter = await driver.waitForElement(By.css('[data-filter="easy"]'), 10000);
    await easyFilter.click();

    // Wait for filtered results
    await driver.driver.sleep(2000); // Wait for filtering to apply

    const problemCards = await driver.driver.findElements(By.css('.problem-card'));
    if (problemCards.length > 0) {
      // Check if all visible problems are easy (this might need adjustment based on UI)
      const difficultyBadges = await driver.driver.findElements(By.css('.difficulty-badge'));
      for (let badge of difficultyBadges) {
        const text = await badge.getText();
        expect(text.toLowerCase()).to.include('easy');
      }
    }
  });
});