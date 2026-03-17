const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const TestBase = require('../TestBase');
const JiraIntegration = require('../JiraIntegration');

describe('DSA Genie - Smoke Tests', function() {
  let driver;
  let jira;
  const testResults = [];

  before(async function() {
    this.timeout(30000);
    driver = new TestBase();
    await driver.setupDriver();

    // Initialize Jira integration if configured
    if (process.env.JIRA_HOST && process.env.JIRA_USERNAME) {
      jira = new JiraIntegration();
    }
  });

  after(async function() {
    this.timeout(10000);
    await driver.teardownDriver();

    // Upload results to Jira if configured
    if (jira && testResults.length > 0) {
      try {
        const executionKey = await jira.createTestExecution('DSA-TP-1', 'Smoke Test Execution');
        await jira.uploadTestResults(testResults);
      } catch (error) {
        console.error('Failed to upload results to Jira:', error);
      }
    }
  });

  afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      const screenshot = await driver.takeScreenshot(`failed_${this.currentTest.title}`);
      console.log(`Screenshot saved: ${screenshot}`);

      // Record failure in Jira
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

  it('should load homepage successfully', async function() {
    await driver.navigateTo('/');
    const title = await driver.getElementText(By.css('h1'));
    expect(title).to.not.be.empty;
  });

  it('should display login form', async function() {
    await driver.navigateTo('/login');
    const loginForm = await driver.waitForElement(By.css('.login-form'));
    expect(loginForm).to.not.be.null;
  });

  it('should display registration form', async function() {
    await driver.navigateTo('/register');
    const registerForm = await driver.waitForElement(By.css('.register-form'));
    expect(registerForm).to.not.be.null;
  });

  it('should load problems page', async function() {
    await driver.navigateTo('/problems');
    const problemsList = await driver.waitForElement(By.css('.problems-list'), 15000);
    expect(problemsList).to.not.be.null;
  });

  it('should load contests page', async function() {
    await driver.navigateTo('/contests');
    const contestsList = await driver.waitForElement(By.css('.contests-list'), 15000);
    expect(contestsList).to.not.be.null;
  });

  it('should load leaderboard', async function() {
    await driver.navigateTo('/leaderboard');
    const leaderboard = await driver.waitForElement(By.css('.leaderboard'), 15000);
    expect(leaderboard).to.not.be.null;
  });
});