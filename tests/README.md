# DSA Genie Test Automation

This directory contains end-to-end test automation for the DSA Genie platform using Selenium WebDriver and Jira integration.

## Features

- **Selenium WebDriver**: Browser automation for comprehensive E2E testing
- **Jira Integration**: Automatic test result reporting and bug creation
- **Mocha Framework**: Test organization and reporting
- **Screenshot Capture**: Automatic screenshots on test failures
- **Cross-browser Support**: Chrome, Firefox, Safari, Edge

## Test Structure

```
tests/
├── e2e/
│   ├── TestBase.js          # Base test class with common utilities
│   ├── JiraIntegration.js   # Jira API integration
│   └── tests/
│       ├── smoke.test.js    # Basic functionality tests
│       ├── auth.test.js     # User authentication tests
│       └── problems.test.js # Problem solving workflow tests
├── scripts/
│   └── upload-to-jira.js    # Manual Jira upload script
├── .env.example             # Environment configuration template
└── package.json             # Test dependencies and scripts
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd tests
npm install
```

### 2. Configure Environment

Copy the example environment file and update values:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# Application URLs
BASE_URL=http://localhost:5173
API_URL=http://localhost:3000

# Browser settings
HEADLESS=false  # Set to true for CI/CD

# Jira Integration (optional)
JIRA_HOST=your-jira-instance.atlassian.net
JIRA_USERNAME=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=DSA
```

### 3. Start the Application

Make sure both frontend and backend are running:

```bash
# Terminal 1 - Start backend
cd ../server
npm run dev

# Terminal 2 - Start frontend
cd ../client
npm run dev
```

### 4. Run Tests

#### Run all tests
```bash
npm test
```

#### Run smoke tests only
```bash
npm run test:smoke
```

#### Run with CI reporter
```bash
npm run test:ci
```

#### Run tests in parallel
```bash
npm run test:parallel
```

## Jira Integration Setup

### 1. Create Jira API Token

1. Go to your Jira instance
2. Navigate to Account Settings → Security → API tokens
3. Create a new token
4. Copy the token to your `.env` file

### 2. Configure Jira Project

1. Create a project in Jira (or use existing)
2. Install "Zephyr Scale" or "Xray" add-on for test management
3. Create test cases and test plans
4. Update project key in `.env`

### 3. Test Case Mapping

Tests automatically map to Jira test cases using the pattern:
- Test title: "should login with registered user"
- Jira key: "DSA-TC-should-login-with-registered-user"

## Test Categories

### Smoke Tests (`smoke.test.js`)
- Basic page loading
- Navigation functionality
- Core UI elements presence

### Authentication Tests (`auth.test.js`)
- User registration
- Login/logout flow
- Invalid credential handling
- Duplicate user prevention

### Problem Solving Tests (`problems.test.js`)
- Problems list display
- Problem detail navigation
- Code submission workflow
- Submission history
- Problem filtering

## Customizing Tests

### Adding New Test Cases

1. Create new test file in `tests/e2e/tests/`
2. Extend `TestBase` class for common utilities
3. Follow the naming pattern: `*.test.js`
4. Include Jira result tracking in `afterEach`

### Page Object Pattern

For better maintainability, consider implementing Page Object pattern:

```javascript
class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  async enterUsername(username) {
    // Implementation
  }

  async enterPassword(password) {
    // Implementation
  }

  async clickLogin() {
    // Implementation
  }
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          npm install
          cd server && npm install
          cd ../client && npm install
      - name: Start services
        run: |
          cd server && npm run dev &
          cd client && npm run build && npm run preview &
          sleep 10
      - name: Run E2E tests
        run: |
          cd tests
          npm run test:ci
        env:
          CI: true
          HEADLESS: true
```

## Troubleshooting

### Common Issues

1. **ChromeDriver version mismatch**
   ```bash
   npm update chromedriver
   ```

2. **Element not found errors**
   - Increase timeouts in TestBase.js
   - Check if selectors match current UI

3. **Jira connection issues**
   - Verify API token is correct
   - Check Jira permissions
   - Ensure project key exists

4. **Screenshot failures**
   - Ensure screenshots directory is writable
   - Check disk space

### Debug Mode

Run tests with debug logging:

```bash
DEBUG=selenium-webdriver:* npm test
```

## Contributing

1. Follow existing code style
2. Add appropriate test cases to Jira
3. Update documentation for new features
4. Ensure tests pass in CI before merging

## Support

For issues with:
- **Selenium**: Check [WebDriver documentation](https://www.selenium.dev/documentation/)
- **Jira API**: Check [Jira REST API documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- **Mocha**: Check [Mocha documentation](https://mochajs.org/)