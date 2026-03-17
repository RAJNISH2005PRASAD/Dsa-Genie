const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const TestBase = require('../TestBase');
const JiraIntegration = require('../JiraIntegration');

describe('DSA Genie - User Authentication Tests', function() {
  let driver;
  let jira;
  const testResults = [];
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123!'
  };

  before(async function() {
    this.timeout(30000);
    driver = new TestBase();
    await driver.setupDriver();

    if (process.env.JIRA_HOST && process.env.JIRA_USERNAME) {
      jira = new JiraIntegration();
    }
  });

  after(async function() {
    await driver.teardownDriver();

    if (jira && testResults.length > 0) {
      try {
        const executionKey = await jira.createTestExecution('DSA-TP-2', 'Authentication Test Execution');
        await jira.uploadTestResults(testResults);
      } catch (error) {
        console.error('Failed to upload results to Jira:', error);
      }
    }
  });

  afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      const screenshot = await driver.takeScreenshot(`auth_failed_${this.currentTest.title}`);
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

  it('should register a new user successfully', async function() {
    await driver.navigateTo('/register');

    // Fill registration form
    await driver.typeText(By.id('username'), testUser.username);
    await driver.typeText(By.id('email'), testUser.email);
    await driver.typeText(By.id('password'), testUser.password);
    await driver.typeText(By.id('confirmPassword'), testUser.password);

    // Submit form
    await driver.clickElement(By.css('button[type="submit"]'));

    // Wait for success message or redirect
    try {
      await driver.waitForElement(By.css('.success-message'), 10000);
    } catch (error) {
      // Check if redirected to dashboard
      await driver.waitForElement(By.css('.dashboard'), 10000);
    }
  });

  it('should login with registered user', async function() {
    await driver.login(testUser.username, testUser.password);

    // Verify login success
    const dashboard = await driver.waitForElement(By.css('.dashboard'));
    expect(dashboard).to.not.be.null;

    // Check if username is displayed
    const userInfo = await driver.getElementText(By.css('.user-info'));
    expect(userInfo).to.include(testUser.username);
  });

  it('should logout successfully', async function() {
    await driver.logout();

    // Verify logout success - should be redirected to login or home
    try {
      await driver.waitForElement(By.css('.login-form'), 5000);
    } catch (error) {
      // Check if on home page
      const homeContent = await driver.waitForElement(By.css('.home-content'), 5000);
      expect(homeContent).to.not.be.null;
    }
  });

  it('should prevent login with invalid credentials', async function() {
    await driver.navigateTo('/login');

    await driver.typeText(By.id('username'), 'invaliduser');
    await driver.typeText(By.id('password'), 'wrongpassword');
    await driver.clickElement(By.css('button[type="submit"]'));

    // Should show error message
    const errorMessage = await driver.waitForElement(By.css('.error-message'));
    expect(errorMessage).to.not.be.null;
    const errorText = await driver.getElementText(By.css('.error-message'));
    expect(errorText.toLowerCase()).to.include('invalid');
  });

  it('should prevent registration with existing username', async function() {
    await driver.navigateTo('/register');

    await driver.typeText(By.id('username'), testUser.username); // Use existing username
    await driver.typeText(By.id('email'), `different${Date.now()}@example.com`);
    await driver.typeText(By.id('password'), 'TestPass123!');
    await driver.typeText(By.id('confirmPassword'), 'TestPass123!');

    await driver.clickElement(By.css('button[type="submit"]'));

    // Should show error message
    const errorMessage = await driver.waitForElement(By.css('.error-message'));
    expect(errorMessage).to.not.be.null;
  });
});