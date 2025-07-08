# AI Problem Generation Guide

This guide explains how to use the AI-powered problem generation features in your DSA application.

## Features

1. **Command Line Script**: Generate problems directly from terminal
2. **Admin UI**: Web interface for generating problems
3. **API Endpoint**: Programmatic access to problem generation

## Prerequisites

1. **OpenAI API Key**: Set your OpenAI API key as an environment variable:
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

2. **MongoDB**: Make sure your MongoDB server is running

3. **Backend Server**: Start your backend server with `npm start`

## Usage Methods

### 1. Command Line Script

Navigate to the `server/` directory and run:

```bash
# Generate default problems (arrays, strings, linked-lists - easy & medium)
node generateProblems.js

# Generate a specific problem
node generateProblems.js arrays easy
node generateProblems.js dynamic-programming hard
node generateProblems.js binary-search medium
```

### 2. Admin Web Interface

1. Start your frontend: `cd client && npm start`
2. Navigate to `/admin` in your browser
3. Select topic and difficulty
4. Click "Generate Problem with AI"

### 3. API Endpoint

Make a POST request to `/api/ai/generate-problem`:

```bash
curl -X POST http://localhost:5000/api/ai/generate-problem \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "topic": "arrays",
    "difficulty": "easy"
  }'
```

## Available Topics

- arrays
- strings
- linked-lists
- trees
- graphs
- dynamic-programming
- greedy
- backtracking
- binary-search
- two-pointers
- sliding-window
- stack
- queue
- heap
- trie
- union-find
- bit-manipulation
- math
- geometry

## Available Difficulties

- easy
- medium
- hard

## Generated Problem Structure

Each generated problem includes:

- **Title**: Descriptive problem name
- **Slug**: URL-friendly identifier
- **Description**: Detailed problem description with examples
- **Difficulty**: Easy, medium, or hard
- **Topics**: Array of relevant topics
- **Constraints**: Problem constraints
- **Examples**: Sample input/output with explanations
- **Solution Templates**: Code templates for multiple languages
- **Tags**: Additional categorization tags

## Admin Access

To access the admin panel, your user account must have `role: 'admin'` in the database.

To make a user an admin, update their document in MongoDB:

```javascript
db.users.updateOne(
  { username: "your-username" },
  { $set: { role: "admin" } }
)
```

## Troubleshooting

### OpenAI API Issues
- Ensure your API key is valid and has sufficient credits
- Check that the `OPENAI_API_KEY` environment variable is set
- Verify your OpenAI account has access to GPT-3.5-turbo

### Database Issues
- Make sure MongoDB is running
- Check your connection string in the environment variables
- Ensure your database has write permissions

### Rate Limiting
- The script includes delays between requests to avoid OpenAI rate limits
- If you encounter rate limits, increase the delay in `generateProblems.js`

## Example Generated Problem

```json
{
  "title": "Find Maximum Subarray Sum",
  "slug": "find-maximum-subarray-sum",
  "description": "Given an array of integers, find the contiguous subarray with the largest sum...",
  "difficulty": "medium",
  "topics": ["arrays", "dynamic-programming"],
  "constraints": ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
  "examples": [
    {
      "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
      "output": "6",
      "explanation": "The subarray [4,-1,2,1] has the largest sum = 6"
    }
  ],
  "solutionTemplate": {
    "javascript": "function maxSubArray(nums) {\n  // Your code here\n}",
    "python": "def max_sub_array(nums):\n    # Your code here"
  }
}
```

## Security Notes

- The admin endpoint requires authentication and admin role
- Generated problems are validated before saving
- API keys should be kept secure and not committed to version control 