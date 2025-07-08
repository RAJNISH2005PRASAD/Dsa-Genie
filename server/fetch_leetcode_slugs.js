const axios = require('axios');
const fs = require('fs');

async function fetchLeetCodeSlugs() {
  try {
    // Use a public repo with LeetCode problems list (slugs, titles, difficulty, tags)
    const url = 'https://raw.githubusercontent.com/LeetCode-OpenSource/LeetCode-Questions-JSON/master/questions.json';
    const response = await axios.get(url);
    if (!Array.isArray(response.data)) {
      throw new Error('Fetched data is not an array.');
    }
    const problems = response.data.map(p => ({
      title: p.title,
      slug: p.titleSlug,
      difficulty: p.difficulty,
      tags: p.topicTags.map(t => t.name)
    }));
    fs.writeFileSync(
      require('path').join(__dirname, 'leetcode_problems.json'),
      JSON.stringify(problems, null, 2),
      'utf-8'
    );
    console.log(`Saved ${problems.length} LeetCode problems to leetcode_problems.json`);
  } catch (err) {
    console.error('Error fetching or saving LeetCode problems:', err);
  }
}

fetchLeetCodeSlugs(); 