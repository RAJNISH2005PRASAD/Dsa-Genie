const mongoose = require('mongoose');
const axios = require('axios');
const Problem = require('./models/Problem');
require('dotenv').config();
const fs = require('fs');

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

async function fetchLeetCodeProblemDetails(slug) {
  const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        titleSlug
        content
        difficulty
        likes
        dislikes
        topicTags { name slug }
        exampleTestcases
        sampleTestCase
        codeSnippets { lang langSlug code }
        hints
        constraints
      }
    }
  `;
  try {
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      { query, variables: { titleSlug: slug } },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.data.question;
  } catch (error) {
    console.error(`Error fetching details for ${slug}:`, error.message);
    return null;
  }
}

async function main() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-genie';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Read problems from local file
  let problems;
  try {
    problems = JSON.parse(fs.readFileSync(require.resolve('./problems.json'), 'utf-8'));
  } catch (err) {
    console.error('Failed to read problems.json. Please make sure the file exists and is valid JSON.');
    process.exit(1);
  }
  let imported = 0, skipped = 0, failed = 0;

  for (const p of problems) {
    const exists = await Problem.findOne({ slug: p.slug });
    if (exists) {
      skipped++;
      continue;
    }
    // Fetch full problem details from LeetCode
    const details = await fetchLeetCodeProblemDetails(p.slug);
    if (!details) {
      failed++;
      console.error(`Failed to fetch details for: ${p.title}`);
      continue;
    }
    const problem = new Problem({
      title: details.title,
      slug: details.titleSlug,
      description: details.content, // Full HTML description
      difficulty: details.difficulty.toLowerCase(),
      topics: details.topicTags.map(t => t.name),
      source: 'LeetCode',
      isActive: true,
      tags: details.topicTags.map(t => t.name),
      aiContent: {},
      stats: {
        totalSubmissions: 0,
        acceptedSubmissions: 0,
        acceptanceRate: 0,
        averageTimeToSolve: 0,
        difficultyRating: 0,
        ratingCount: 0
      },
      leetCodeMeta: {
        questionId: details.questionId,
        likes: details.likes,
        dislikes: details.dislikes,
        exampleTestcases: details.exampleTestcases,
        sampleTestCase: details.sampleTestCase,
        codeSnippets: details.codeSnippets,
        hints: details.hints,
        constraints: details.constraints
      }
    });
    try {
      await problem.save();
      imported++;
      console.log(`Imported: ${details.title}`);
    } catch (e) {
      failed++;
      console.error(`Failed to import: ${details.title}`);
    }
  }
  console.log(`Done! Imported: ${imported}, Skipped: ${skipped}, Failed: ${failed}`);
  mongoose.disconnect();
}

main();
