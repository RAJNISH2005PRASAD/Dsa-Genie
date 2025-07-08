const axios = require('axios');

const API_URL = 'http://localhost:5000/api/ai/generate-problem';
const ADMIN_TOKEN = 'YOUR_ADMIN_JWT_TOKEN'; // <-- Replace with your real admin JWT token

const topics = [
  'arrays', 'strings', 'linked-lists', 'trees', 'graphs',
  'dynamic-programming', 'greedy', 'backtracking', 'binary-search',
  'two-pointers', 'sliding-window', 'stack', 'queue', 'heap',
  'trie', 'union-find', 'bit-manipulation', 'math', 'geometry'
];
const difficulties = ['easy', 'medium', 'hard'];

async function generateProblem(topic, difficulty) {
  try {
    const res = await axios.post(API_URL, { topic, difficulty }, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    console.log('Generated:', res.data.problem.title);
  } catch (err) {
    console.error(`Failed for ${topic} (${difficulty}):`, err.response?.data?.error || err.message);
  }
}

async function main() {
  for (let topic of topics) {
    for (let difficulty of difficulties) {
      await generateProblem(topic, difficulty);
    }
  }
}

main(); 