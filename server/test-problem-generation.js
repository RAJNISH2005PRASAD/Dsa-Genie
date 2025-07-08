const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const { geminiGenerateJSON } = require('./utils/gemini');
require('dotenv').config();

async function testProblemGeneration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-genie');
    console.log('Connected to MongoDB');

    console.log('Testing AI problem generation...');

    // Test schema
    const problemSchema = {
      title: "string",
      slug: "string", 
      description: "string",
      difficulty: "easy|medium|hard",
      topics: ["arrays|strings|linked-lists|trees|graphs|dynamic-programming|greedy|backtracking|binary-search|two-pointers|sliding-window|stack|queue|heap|trie|union-find|bit-manipulation|math|geometry"],
      constraints: ["string"],
      examples: [{
        input: "string",
        output: "string",
        explanation: "string"
      }],
      testCases: [{
        input: "string",
        output: "string",
        isHidden: "boolean"
      }],
      solutionTemplate: {
        javascript: "string",
        python: "string", 
        java: "string",
        cpp: "string"
      },
      aiContent: {
        hints: [{
          level: "number",
          hint: "string",
          cost: "number"
        }],
        explanation: {
          approach: "string",
          timeComplexity: "string",
          spaceComplexity: "string",
          detailedSolution: "string"
        },
        learningObjectives: ["string"],
        commonMistakes: ["string"],
        tips: ["string"]
      },
      stats: {
        totalSubmissions: 0,
        acceptedSubmissions: 0,
        acceptanceRate: 0,
        averageTimeToSolve: 0,
        difficultyRating: 0,
        ratingCount: 0
      },
      source: "DSA Genie AI",
      isPremium: false,
      isActive: true,
      tags: ["string"]
    };

    const prompt = `Generate a complete DSA problem about arrays with easy difficulty level. Make it realistic, educational, and well-structured. Include proper examples and constraints.

IMPORTANT: 
- Use only valid topic values: arrays, strings, linked-lists, trees, graphs, dynamic-programming, greedy, backtracking, binary-search, two-pointers, sliding-window, stack, queue, heap, trie, union-find, bit-manipulation, math, geometry
- Use only valid difficulty values: easy, medium, hard
- Make sure topics array contains only valid topic values
- Test cases should be objects with input, output, and isHidden fields
- Do not include prerequisites or nextProblems fields
- All string values should be properly escaped`;

    console.log('Generating problem with AI...');
    const problemData = await geminiGenerateJSON(prompt, problemSchema);
    
    console.log('AI generated data:', JSON.stringify(problemData, null, 2));

    // Validate and clean the data
    if (!problemData.title || !problemData.description) {
      throw new Error('Generated problem is missing required fields');
    }

    // Ensure topics is an array and contains valid values
    if (!Array.isArray(problemData.topics)) {
      problemData.topics = ['arrays'];
    }
    
    // Validate topic values
    const validTopics = ['arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'greedy', 'backtracking', 'binary-search', 'two-pointers', 'sliding-window', 'stack', 'queue', 'heap', 'trie', 'union-find', 'bit-manipulation', 'math', 'geometry'];
    problemData.topics = problemData.topics.filter(t => validTopics.includes(t));
    if (problemData.topics.length === 0) {
      problemData.topics = ['arrays'];
    }

    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(problemData.difficulty)) {
      problemData.difficulty = 'easy';
    }

    // Create slug if not provided
    if (!problemData.slug) {
      problemData.slug = problemData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Ensure testCases is properly formatted
    if (Array.isArray(problemData.testCases)) {
      problemData.testCases = problemData.testCases.map(tc => {
        if (typeof tc === 'string') {
          return { input: tc, output: '', isHidden: false };
        }
        return {
          input: tc.input || '',
          output: tc.output || '',
          isHidden: tc.isHidden || false
        };
      });
    } else {
      problemData.testCases = [];
    }

    // Ensure examples is properly formatted
    if (!Array.isArray(problemData.examples)) {
      problemData.examples = [];
    }

    // Ensure constraints is an array
    if (!Array.isArray(problemData.constraints)) {
      problemData.constraints = [];
    }

    // Ensure solutionTemplate is properly formatted
    if (!problemData.solutionTemplate) {
      problemData.solutionTemplate = {
        javascript: `function solve(input) {\n  // Your code here\n}`,
        python: `def solve(input):\n    # Your code here`,
        java: `public class Solution {\n    public static String solve(String input) {\n        // Your code here\n    }\n}`,
        cpp: `string solve(string input) {\n    // Your code here\n}`
      };
    }

    // Ensure aiContent is properly formatted
    if (!problemData.aiContent) {
      problemData.aiContent = {
        hints: [],
        explanation: {
          approach: '',
          timeComplexity: '',
          spaceComplexity: '',
          detailedSolution: ''
        },
        learningObjectives: [],
        commonMistakes: [],
        tips: []
      };
    }

    // Ensure stats is properly formatted
    if (!problemData.stats) {
      problemData.stats = {
        totalSubmissions: 0,
        acceptedSubmissions: 0,
        acceptanceRate: 0,
        averageTimeToSolve: 0,
        difficultyRating: 0,
        ratingCount: 0
      };
    }

    // Remove any fields that shouldn't be in the model
    delete problemData.prerequisites;
    delete problemData.nextProblems;

    console.log('Creating problem in database...');
    const problem = new Problem(problemData);
    await problem.save();

    console.log('✅ Problem created successfully:', {
      _id: problem._id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      topics: problem.topics
    });

    // Clean up
    await Problem.findByIdAndDelete(problem._id);
    console.log('✅ Test problem cleaned up');

    console.log('\n🎉 Problem generation test passed!');
  } catch (error) {
    console.error('❌ Problem generation test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testProblemGeneration(); 