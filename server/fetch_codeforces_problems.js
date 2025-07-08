const axios = require('axios');
const fs = require('fs');

async function fetchCodeforcesProblems() {
  try {
    const url = 'https://codeforces.com/api/problemset.problems';
    const response = await axios.get(url);
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch Codeforces problems');
    }
    const problems = response.data.result.problems.map(p => ({
      contestId: p.contestId,
      index: p.index,
      name: p.name,
      type: p.type,
      rating: p.rating || null,
      tags: p.tags,
      slug: `cf-${p.contestId || 'lib'}-${p.index}` // unique slug
    }));
    fs.writeFileSync(
      require('path').join(__dirname, 'codeforces_problems.json'),
      JSON.stringify(problems, null, 2),
      'utf-8'
    );
    console.log(`Saved ${problems.length} Codeforces problems to codeforces_problems.json`);
  } catch (err) {
    console.error('Error fetching Codeforces problems:', err.message);
  }
}

fetchCodeforcesProblems(); 