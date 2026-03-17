const JiraApi = require('jira-client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class JiraIntegration {
  constructor() {
    this.jira = new JiraApi({
      protocol: 'https',
      host: process.env.JIRA_HOST,
      username: process.env.JIRA_USERNAME,
      password: process.env.JIRA_API_TOKEN,
      apiVersion: '2',
      strictSSL: true
    });

    this.projectKey = process.env.JIRA_PROJECT_KEY || 'DSA';
    this.testExecutionKey = null;
  }

  async createTestExecution(testPlanKey, summary) {
    try {
      const issue = await this.jira.addNewIssue({
        fields: {
          project: { key: this.projectKey },
          summary: summary,
          description: `Automated test execution for ${summary}`,
          issuetype: { name: 'Test Execution' },
          customfield_10020: testPlanKey // Test Plan field
        }
      });

      this.testExecutionKey = issue.key;
      console.log(`Created Test Execution: ${issue.key}`);
      return issue.key;
    } catch (error) {
      console.error('Error creating test execution:', error);
      throw error;
    }
  }

  async updateTestResult(testCaseKey, status, comment = '', attachments = []) {
    try {
      // Update test execution with test result
      const testResult = {
        testCase: { key: testCaseKey },
        status: { name: status }, // PASSED, FAILED, BLOCKED, etc.
        comment: comment
      };

      if (attachments.length > 0) {
        testResult.attachments = attachments;
      }

      await this.jira.addTestExecutionTestResult(this.testExecutionKey, testResult);
      console.log(`Updated test result for ${testCaseKey}: ${status}`);
    } catch (error) {
      console.error(`Error updating test result for ${testCaseKey}:`, error);
    }
  }

  async createBug(title, description, priority = 'Medium', attachments = []) {
    try {
      const issue = await this.jira.addNewIssue({
        fields: {
          project: { key: this.projectKey },
          summary: title,
          description: description,
          issuetype: { name: 'Bug' },
          priority: { name: priority }
        }
      });

      // Add attachments if provided
      for (const attachment of attachments) {
        if (fs.existsSync(attachment)) {
          await this.jira.addAttachmentOnIssue(issue.key, fs.createReadStream(attachment));
        }
      }

      console.log(`Created bug: ${issue.key}`);
      return issue.key;
    } catch (error) {
      console.error('Error creating bug:', error);
      throw error;
    }
  }

  async getTestCases(testPlanKey) {
    try {
      const testCases = await this.jira.searchJira(`project = ${this.projectKey} AND type = "Test Case" AND "Test Plan" = "${testPlanKey}"`);
      return testCases.issues;
    } catch (error) {
      console.error('Error fetching test cases:', error);
      return [];
    }
  }

  async uploadTestResults(results) {
    try {
      for (const result of results) {
        await this.updateTestResult(
          result.testCaseKey,
          result.status,
          result.comment,
          result.attachments
        );
      }
      console.log('All test results uploaded to Jira');
    } catch (error) {
      console.error('Error uploading test results:', error);
    }
  }
}

module.exports = JiraIntegration;