const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  topics: [{
    type: String,
    enum: ['arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'greedy', 'backtracking', 'binary-search', 'two-pointers', 'sliding-window', 'stack', 'queue', 'heap', 'trie', 'union-find', 'bit-manipulation', 'math', 'geometry', 'divide-and-conquer'],
    required: true
  }],
  
  // Problem constraints and examples
  constraints: [{
    type: String
  }],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  
  // Test cases
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    isHidden: {
      type: Boolean,
      default: false
    }
  }],
  
  // Solution templates
  solutionTemplate: {
    javascript: String,
    python: String,
    java: String,
    cpp: String
  },
  
  // AI-generated content
  aiContent: {
    hints: [{
      level: {
        type: Number,
        min: 1,
        max: 3
      },
      hint: String,
      cost: {
        type: Number,
        default: 0
      }
    }],
    explanation: {
      approach: String,
      timeComplexity: String,
      spaceComplexity: String,
      detailedSolution: String
    },
    similarProblems: [{
      problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
      },
      similarity: Number
    }],
    learningObjectives: [String],
    commonMistakes: [String],
    tips: [String]
  },
  
  // Statistics
  stats: {
    totalSubmissions: {
      type: Number,
      default: 0
    },
    acceptedSubmissions: {
      type: Number,
      default: 0
    },
    acceptanceRate: {
      type: Number,
      default: 0
    },
    averageTimeToSolve: {
      type: Number,
      default: 0 // in minutes
    },
    difficultyRating: {
      type: Number,
      default: 0 // user-rated difficulty
    },
    ratingCount: {
      type: Number,
      default: 0
    }
  },
  
  // Problem metadata
  source: {
    type: String,
    default: 'DSA Genie'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Tags for better categorization
  tags: [String],
  
  // Related problems for learning path
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  nextProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
problemSchema.index({ difficulty: 1 });
problemSchema.index({ topics: 1 });
problemSchema.index({ 'stats.acceptanceRate': -1 });
problemSchema.index({ 'stats.totalSubmissions': -1 });

// Method to update acceptance rate
problemSchema.methods.updateAcceptanceRate = function() {
  if (this.stats.totalSubmissions > 0) {
    this.stats.acceptanceRate = (this.stats.acceptedSubmissions / this.stats.totalSubmissions) * 100;
  }
  return this.save();
};

// Method to add submission
problemSchema.methods.addSubmission = function(isAccepted, timeTaken) {
  this.stats.totalSubmissions += 1;
  if (isAccepted) {
    this.stats.acceptedSubmissions += 1;
  }
  
  // Update average time
  const totalTime = this.stats.averageTimeToSolve * (this.stats.totalSubmissions - 1) + timeTaken;
  this.stats.averageTimeToSolve = totalTime / this.stats.totalSubmissions;
  
  this.updateAcceptanceRate();
  return this.save();
};

// Method to update difficulty rating
problemSchema.methods.updateDifficultyRating = function(newRating) {
  const totalRating = this.stats.difficultyRating * this.stats.ratingCount + newRating;
  this.stats.ratingCount += 1;
  this.stats.difficultyRating = totalRating / this.stats.ratingCount;
  return this.save();
};

// Static method to get problems by difficulty and topics
problemSchema.statics.getProblemsByFilters = function(filters) {
  const query = { isActive: true };
  
  if (filters.difficulty && filters.difficulty !== 'mixed') {
    query.difficulty = filters.difficulty;
  }
  
  if (filters.topics && filters.topics.length > 0) {
    query.topics = { $in: filters.topics };
  }
  
  if (filters.excludeSolved && filters.solvedProblemIds) {
    query._id = { $nin: filters.solvedProblemIds };
  }
  
  return this.find(query)
    .select('title slug difficulty topics stats')
    .sort({ 'stats.acceptanceRate': -1 });
};

// Static method to get recommended problems for user
problemSchema.statics.getRecommendedProblems = function(userId, userStats, limit = 10) {
  // This would typically use a more sophisticated recommendation algorithm
  // For now, we'll use a simple approach based on user's solved problems and preferences
  return this.aggregate([
    { $match: { isActive: true } },
    { $addFields: {
      score: {
        $add: [
          { $multiply: ['$stats.acceptanceRate', 0.4] },
          { $multiply: [{ $subtract: [100, '$stats.difficultyRating'] }, 0.3] },
          { $multiply: ['$stats.totalSubmissions', 0.01] }
        ]
      }
    }},
    { $sort: { score: -1 } },
    { $limit: limit }
  ]);
};

module.exports = mongoose.model('Problem', problemSchema); 