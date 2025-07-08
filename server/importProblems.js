const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Problem = require('./models/Problem');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa';

async function main() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-genie';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  let problems;
  try {
    problems = JSON.parse(fs.readFileSync(require.resolve('./codeforces_problems.json'), 'utf-8'));
  } catch (err) {
    console.error('Failed to read codeforces_problems.json. Please make sure the file exists and is valid JSON.');
    process.exit(1);
  }
  let imported = 0, skipped = 0, failed = 0;

  for (const p of problems) {
    const exists = await Problem.findOne({ slug: p.slug });
    if (exists) {
      skipped++;
      continue;
    }
    const problem = new Problem({
      title: p.name,
      slug: p.slug,
      description: `Codeforces problem ${p.contestId || ''}${p.index}: ${p.name}`,
      difficulty: p.rating ? (p.rating <= 1200 ? 'easy' : p.rating <= 1800 ? 'medium' : 'hard') : 'medium',
      topics: p.tags,
      source: 'Codeforces',
      isActive: true,
      tags: p.tags,
      aiContent: {},
      stats: {
        totalSubmissions: 0,
        acceptedSubmissions: 0,
        acceptanceRate: 0,
        averageTimeToSolve: 0,
        difficultyRating: 0,
        ratingCount: 0
      },
      codeforcesMeta: {
        contestId: p.contestId,
        index: p.index,
        type: p.type,
        rating: p.rating
      }
    });
    try {
      await problem.save();
      imported++;
      if (imported % 100 === 0) console.log(`Imported: ${imported}`);
    } catch (e) {
      failed++;
      console.error(`Failed to import: ${p.name}`);
    }
  }
  console.log(`Done! Imported: ${imported}, Skipped: ${skipped}, Failed: ${failed}`);
  mongoose.disconnect();
}

main(); 