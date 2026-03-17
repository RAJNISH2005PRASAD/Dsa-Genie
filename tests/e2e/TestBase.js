const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class TestBase {
  constructor() {
    this.driver = null;
    this.baseUrl = process.env.BASE_URL || 'http://localhost:5173';
    this.apiUrl = process.env.API_URL || 'http://localhost:3000';
  }

  async setupDriver() {
    const options = new chrome.Options();

    // Headless mode for CI/CD
    if (process.env.CI || process.env.HEADLESS) {
      options.addArguments('--headless');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
    }

    options.addArguments('--window-size=1920,1080');
    options.addArguments('--disable-web-security');
    options.addArguments('--disable-features=VizDisplayCompositor');

    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await this.driver.manage().setTimeouts({ implicit: 10000 });
  }

  async teardownDriver() {
    if (this.driver) {
      await this.driver.quit();
    }
  }

  async navigateTo(path = '') {
    await this.driver.get(`${this.baseUrl}${path}`);
  }

  async waitForElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForElementToBeVisible(locator, timeout = 10000) {
    const element = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async clickElement(locator) {
    const element = await this.waitForElementToBeVisible(locator);
    await element.click();
  }

  async typeText(locator, text) {
    const element = await this.waitForElementToBeVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  async getElementText(locator) {
    const element = await this.waitForElementToBeVisible(locator);
    return await element.getText();
  }

  async takeScreenshot(filename) {
    const screenshotDir = path.join(__dirname, '../screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshot = await this.driver.takeScreenshot();
    const filepath = path.join(screenshotDir, `${filename}_${Date.now()}.png`);
    fs.writeFileSync(filepath, screenshot, 'base64');
    return filepath;
  }

  async login(username, password) {
    await this.navigateTo('/login');
    await this.typeText(By.id('username'), username);
    await this.typeText(By.id('password'), password);
    await this.clickElement(By.css('button[type="submit"]'));
    await this.waitForElement(By.css('.dashboard'), 15000);
  }

  async logout() {
    try {
      await this.clickElement(By.css('.logout-btn'));
      await this.waitForElement(By.css('.login-form'), 5000);
    } catch (error) {
      console.log('Logout element not found, user might already be logged out');
    }
  }
}

module.exports = TestBase;