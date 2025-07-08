const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  // Contest timing
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  
  // Contest type and settings
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'special', 'adaptive'],
    default: 'daily'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'mixed'
  },
  topics: [{
    type: String,
    enum: ['arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'greedy', 'backtracking', 'binary-search', 'two-pointers', 'sliding-window', 'stack', 'queue', 'heap', 'trie', 'union-find', 'bit-manipulation', 'math', 'geometry']
  }],
  
  // Problems in the contest
  problems: [{
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true
    },
    points: {
      type: Number,
      default: 100
    },
    order: {
      type: Number,
      required: true
    }
  }],
  
  // Contest rules and scoring
  maxParticipants: {
    type: Number,
    default: 1000
  },
  entryFee: {
    type: Number,
    default: 0 // coins required to enter
  },
  prizePool: {
    coins: {
      type: Number,
      default: 0
    },
    distribution: [{
      rank: Number,
      percentage: Number,
      coins: Number
    }]
  },
  
  // Adaptive contest settings
  isAdaptive: {
    type: Boolean,
    default: false
  },
  adaptiveSettings: {
    initialDifficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    difficultyAdjustment: {
      type: String,
      enum: ['aggressive', 'moderate', 'conservative'],
      default: 'moderate'
    },
    problemCount: {
      type: Number,
      default: 5
    }
  },
  
  // Contest status
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  
  // Participants and submissions
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      default: 0
    },
    rank: {
      type: Number,
      default: 0
    },
    solvedProblems: [{
      problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
      },
      solvedAt: Date,
      timeTaken: Number, // in minutes
      points: Number
    }],
    startTime: Date,
    endTime: Date
  }],
  
  // Contest statistics
  stats: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  },
  
  // Contest metadata
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Tags and categories
  tags: [String],
  category: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contestSchema.index({ status: 1, startTime: 1 });
contestSchema.index({ type: 1, startTime: -1 });
contestSchema.index({ 'participants.userId': 1 });

// Method to add participant
contestSchema.methods.addParticipant = function(userId) {
  if (this.participants.length >= this.maxParticipants) {
    throw new Error('Contest is full');
  }
  
  const existingParticipant = this.participants.find(p => p.userId.toString() === userId.toString());
  if (existingParticipant) {
    throw new Error('User already registered for this contest');
  }
  
  this.participants.push({
    userId,
    joinedAt: new Date(),
    score: 0,
    rank: 0,
    solvedProblems: [],
    startTime: null,
    endTime: null
  });
  
  this.stats.totalParticipants = this.participants.length;
  return this.save();
};

// Method to start contest for participant
contestSchema.methods.startContestForParticipant = function(userId) {
  const participant = this.participants.find(p => p.userId.toString() === userId.toString());
  if (!participant) {
    throw new Error('User not registered for this contest');
  }
  
  if (participant.startTime) {
    throw new Error('Contest already started for this user');
  }
  
  participant.startTime = new Date();
  participant.endTime = new Date(participant.startTime.getTime() + this.duration * 60 * 1000);
  
  return this.save();
};

// Method to submit solution
contestSchema.methods.submitSolution = function(userId, problemId, isCorrect, timeTaken) {
  const participant = this.participants.find(p => p.userId.toString() === userId.toString());
  if (!participant) {
    throw new Error('User not registered for this contest');
  }
  
  if (!participant.startTime) {
    throw new Error('Contest not started for this user');
  }
  
  if (new Date() > participant.endTime) {
    throw new Error('Contest time has expired');
  }
  
  const problem = this.problems.find(p => p.problemId.toString() === problemId.toString());
  if (!problem) {
    throw new Error('Problem not found in contest');
  }
  
  const existingSubmission = participant.solvedProblems.find(sp => sp.problemId.toString() === problemId.toString());
  if (existingSubmission) {
    throw new Error('Problem already solved');
  }
  
  if (isCorrect) {
    participant.solvedProblems.push({
      problemId,
      solvedAt: new Date(),
      timeTaken,
      points: problem.points
    });
    
    participant.score += problem.points;
  }
  
  return this.save();
};

// Method to update leaderboard
contestSchema.methods.updateLeaderboard = function() {
  // Sort participants by score (descending) and then by completion time (ascending)
  this.participants.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    
    const aLastSolved = a.solvedProblems.length > 0 ? 
      Math.max(...a.solvedProblems.map(sp => sp.solvedAt.getTime())) : 0;
    const bLastSolved = b.solvedProblems.length > 0 ? 
      Math.max(...b.solvedProblems.map(sp => sp.solvedAt.getTime())) : 0;
    
    return aLastSolved - bLastSolved;
  });
  
  // Update ranks
  this.participants.forEach((participant, index) => {
    participant.rank = index + 1;
  });
  
  // Update contest statistics
  if (this.participants.length > 0) {
    this.stats.averageScore = this.participants.reduce((sum, p) => sum + p.score, 0) / this.participants.length;
    this.stats.completionRate = (this.participants.filter(p => p.solvedProblems.length > 0).length / this.participants.length) * 100;
  }
  
  return this.save();
};

// Method to distribute prizes
contestSchema.methods.distributePrizes = function() {
  if (this.prizePool.coins <= 0) return this;
  
  this.prizePool.distribution.forEach(dist => {
    const participants = this.participants.filter(p => p.rank === dist.rank);
    participants.forEach(participant => {
      // In a real implementation, you would update the user's coins here
      // For now, we'll just store the prize amount
      participant.prizeCoins = dist.coins;
    });
  });
  
  return this.save();
};

// Static method to get upcoming contests
contestSchema.statics.getUpcomingContests = function(limit = 10) {
  return this.find({
    status: 'upcoming',
    startTime: { $gt: new Date() },
    isActive: true
  })
  .sort({ startTime: 1 })
  .limit(limit)
  .populate('problems.problemId', 'title difficulty topics');
};

// Static method to get active contests
contestSchema.statics.getActiveContests = function() {
  const now = new Date();
  return this.find({
    status: 'active',
    startTime: { $lte: now },
    endTime: { $gt: now },
    isActive: true
  })
  .populate('problems.problemId', 'title difficulty topics');
};

// Static method to create adaptive contest
contestSchema.statics.createAdaptiveContest = function(userId, settings) {
  // This would typically use AI to select problems based on user's skill level
  // For now, we'll create a simple adaptive contest
  const contest = new this({
    title: `Adaptive Contest - ${new Date().toLocaleDateString()}`,
    description: 'AI-powered adaptive contest tailored to your skill level',
    slug: `adaptive-${Date.now()}`,
    startTime: new Date(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    duration: 120, // 2 hours
    type: 'adaptive',
    isAdaptive: true,
    adaptiveSettings: settings,
    status: 'upcoming'
  });
  
  return contest.save();
};

module.exports = mongoose.model('Contest', contestSchema); 