require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const axios = require('axios');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa';
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateProblemWithGemini(topic = 'arrays', difficulty = 'easy') {
  const prompt = `Generate a complete DSA problem in JSON format with the following structure:\n\n{\n  "title": "Problem Title",\n  "slug": "problem-slug",\n  "description": "Detailed problem description with examples",\n  "difficulty": "${difficulty}",\n  "topics": ["${topic}"],\n  "constraints": ["constraint 1", "constraint 2"],\n  "examples": [\n    {\n      "input": "example input",\n      "output": "example output", \n      "explanation": "explanation of the example"\n    }\n  ],\n  "testCases": [],\n  "solutionTemplate": {\n    "javascript": "function solve(input) {\\n  // Your code here\\n}",\n    "python": "def solve(input):\\n    # Your code here",\n    "java": "public class Solution {\\n    public static String solve(String input) {\\n        // Your code here\\n    }\\n}",\n    "cpp": "string solve(string input) {\\n    // Your code here\\n}"\n  },\n  "aiContent": {},\n  "stats": {\n    "totalSubmissions": 0,\n    "acceptedSubmissions": 0,\n    "acceptanceRate": 0,\n    "averageTimeToSolve": 0,\n    "difficultyRating": 0,\n    "ratingCount": 0\n  },\n  "source": "DSA Genie AI",\n  "isPremium": false,\n  "isActive": true,\n  "tags": ["${topic}"],\n  "prerequisites": [],\n  "nextProblems": []\n}\n\nThe problem should be about ${topic} and have ${difficulty} difficulty level. Make it realistic and educational. Return only the JSON object, no additional text.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  const data = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const res = await axios.post(url, data);
    // Gemini returns the response in a nested structure
    const text = res.data.candidates[0].content.parts[0].text;
    let problemData;
    try {
      problemData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', text);
      throw new Error('Invalid JSON response from Gemini');
    }
    return problemData;
  } catch (error) {
    console.error('Error generating problem with Gemini:', error.response?.data || error.message);
    throw error;
  }
}

async function addProblemToDatabase(problemData) {
  try {
    await mongoose.connect(MONGO_URI);
    const problem = new Problem(problemData);
    await problem.save();
    console.log(`✅ Problem "${problemData.title}" created successfully!`);
    return problem;
  } catch (error) {
    console.error('Error adding problem to database:', error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const topic = args[0] || 'arrays';
  const difficulty = args[1] || 'easy';
  console.log(`🚀 Generating ${difficulty} problem about ${topic} using Gemini API...`);
  try {
    const problemData = await generateProblemWithGemini(topic, difficulty);
    await addProblemToDatabase(problemData);
    console.log('🎉 Problem generation completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  main().catch(console.error);
} 