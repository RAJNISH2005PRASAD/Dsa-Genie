const express = require('express');
const axios = require('axios');
const router = express.Router();
const Problem = require('../models/Problem');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

function toBase64(str) {
  return Buffer.from(str, 'utf-8').toString('base64');
}

// Run code for a problem (using Judge0 API with base64)
router.post('/:id/run', async (req, res) => {
  try {
    const { code, language } = req.body;
    const { id } = req.params;
  
    // Map language to Judge0 language ID
    const languageMap = {
      'javascript': 63, // JavaScript (Node.js 12.14.0)
      'python': 71,     // Python (3.8.1)
      'cpp': 54,        // C++ (GCC 9.2.0)
      'java': 62        // Java (OpenJDK 13.0.1)
    };
    
    const languageId = languageMap[language] || 63; // Default to JavaScript
    
    // Get API key from environment variable
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
    
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'YOUR_RAPIDAPI_KEY_HERE') {
      return res.status(500).json({ 
        error: 'RapidAPI key not configured. Please add your API key to .env file.' 
      });
    }
    
    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true',
      {
        source_code: toBase64(code),
        language_id: languageId,
        // Optionally, you can add stdin for the main run if needed
      },
      {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    res.json({
      output: response.data.stdout || '',
      error: response.data.stderr || '',
      status: response.data.status,
      testResults: [] // Simplified: no test cases for run
    });
  } catch (err) {
    console.error('Run code error:', err.response?.data || err.message);
    console.error('Full error object:', JSON.stringify(err, null, 2));
    
    // Handle API quota exceeded - return mock response for demo
    const errorMessage = err.response?.data?.message || err.message || '';
    if (errorMessage.includes('exceeded the DAILY quota')) {
      return res.json({
        output: 'Code execution quota exceeded. This is a demo limitation.\nIn a production environment, you would have a paid API plan.',
        error: '',
        status: { description: 'Demo Mode' },
        testResults: []
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to run code',
      details: err.response?.data || err.message 
    });
  }
});

// Submit code for a problem (using Judge0 API with base64)
router.post('/:id/submit', auth, async (req, res) => {
  const { code, language } = req.body;
  const { id } = req.params;
  
  try {
    // Map language to Judge0 language ID
    const languageMap = {
      'javascript': 63, // JavaScript (Node.js 12.14.0)
      'python': 71,     // Python (3.8.1)
      'cpp': 54,        // C++ (GCC 9.2.0)
      'java': 62        // Java (OpenJDK 13.0.1)
    };
    
    const languageId = languageMap[language] || 63; // Default to JavaScript
    
    // Get API key from environment variable
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
    
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'YOUR_RAPIDAPI_KEY_HERE') {
      return res.status(500).json({ 
        error: 'RapidAPI key not configured. Please add your API key to .env file.' 
      });
    }
    
    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true',
      {
        source_code: toBase64(code),
        language_id: languageId,
        // Optionally, you can add stdin for the main submit if needed
      },
      {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    // If accepted, update user solvedProblems and activity
    if (response.data.status && response.data.status.description === 'Accepted') {
      const user = await User.findById(req.user._id);
      const problem = await Problem.findById(id);
      if (user && problem) {
        const alreadySolved = user.solvedProblems.some(sp => sp.problemId.toString() === id);
        if (!alreadySolved) {
          user.solvedProblems.push({ problemId: id, difficulty: problem.difficulty });
          user.recentActivity.push({
            type: 'solved',
            description: `Solved problem "${problem.title}"`,
            timestamp: new Date()
          });
          await user.save();
        }
      }
    }
    
    res.json({
      output: response.data.stdout || '',
      error: response.data.stderr || '',
      status: response.data.status,
      message: 'Submitted successfully!'
    });
  } catch (err) {
    console.error('Submit code error:', err.response?.data || err.message);
    res.status(500).json({ 
      error: 'Failed to submit code',
      details: err.response?.data || err.message 
    });
  }
});

// GET /problems - fetch all problems
router.get('/', async (req, res) => {
  try {
    const { difficulty, search, source } = req.query;
    const query = { isActive: true };
    if (difficulty) query.difficulty = difficulty;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (source) query.source = source;
    const problems = await Problem.find(query)
      .select('title slug difficulty topics stats source');
    res.json({ problems });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// POST /problems - create a new problem
router.post('/', async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json({ message: 'Problem created successfully', problem });
  } catch (err) {
    console.error('Error creating problem:', err);
    res.status(400).json({ error: 'Failed to create problem', details: err.message });
  }
});

// GET /problems/id/:id - fetch a single problem by ID
router.get('/id/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json({ problem });
  } catch (err) {
    console.error('Error fetching problem:', err);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

// GET /problems/:slug - fetch a single problem by slug (must be last)
router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug, isActive: true });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json({ problem });
  } catch (err) {
    console.error('Error fetching problem:', err);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

module.exports = router;
