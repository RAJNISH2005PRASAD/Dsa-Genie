const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  
  // Gamification fields
  coins: {
    type: Number,
    default: 100
  },
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastSolvedDate: {
      type: Date,
      default: null
    }
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  
  // Progress tracking
  solvedProblems: [{
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    },
    solvedAt: {
      type: Date,
      default: Date.now
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    timeTaken: Number, // in minutes
    attempts: {
      type: Number,
      default: 1
    }
  }],
  
  // Preferences and settings
  preferences: {
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'mixed'
    },
    topics: [{
      type: String,
      enum: ['arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'greedy', 'backtracking', 'binary-search', 'two-pointers', 'sliding-window', 'stack', 'queue', 'heap', 'trie', 'union-find', 'bit-manipulation', 'math', 'geometry']
    }],
    dailyGoal: {
      type: Number,
      default: 3
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Statistics
  stats: {
    totalSolved: {
      type: Number,
      default: 0
    },
    easySolved: {
      type: Number,
      default: 0
    },
    mediumSolved: {
      type: Number,
      default: 0
    },
    hardSolved: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    averageTimePerProblem: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0
    }
  },
  
  // Contest participation
  contests: [{
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest'
    },
    score: Number,
    rank: Number,
    participatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Achievements and badges
  achievements: [{
    type: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Recent activity
  recentActivity: [{
    type: {
      type: String
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // AI Chat history
  chatHistory: [{
    _id: String,
    content: String,
    role: {
      type: String,
      enum: ['user', 'assistant']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['text', 'code', 'hint', 'explanation'],
      default: 'text'
    }
  }],
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
// Removed duplicate indexes - unique: true already creates indexes for username and email

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to add solved problem
userSchema.methods.addSolvedProblem = function(problemId, difficulty, timeTaken, attempts = 1) {
  const solvedProblem = {
    problemId,
    difficulty,
    timeTaken,
    attempts,
    solvedAt: new Date()
  };
  
  this.solvedProblems.push(solvedProblem);
  this.stats.totalSolved += 1;
  this.stats[`${difficulty}Solved`] += 1;
  this.stats.totalTimeSpent += timeTaken;
  this.stats.averageTimePerProblem = this.stats.totalTimeSpent / this.stats.totalSolved;
  
  // Update streak
  const today = new Date().toDateString();
  const lastSolved = this.streak.lastSolvedDate ? new Date(this.streak.lastSolvedDate).toDateString() : null;
  
  if (lastSolved === today) {
    // Already solved today, don't update streak
  } else if (lastSolved === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
    // Solved yesterday, continue streak
    this.streak.current += 1;
  } else {
    // Break in streak, start new one
    this.streak.current = 1;
  }
  
  this.streak.lastSolvedDate = new Date();
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }
  
  // Add coins based on difficulty
  const coinRewards = { easy: 10, medium: 20, hard: 30 };
  this.coins += coinRewards[difficulty];
  
  // Add experience
  const expRewards = { easy: 50, medium: 100, hard: 200 };
  this.experience += expRewards[difficulty];
  
  // Level up logic
  const expNeeded = this.level * 100;
  if (this.experience >= expNeeded) {
    this.level += 1;
    this.experience -= expNeeded;
    this.coins += 50; // Bonus coins for leveling up
  }
  
  return this.save();
};

// Method to get user progress
userSchema.methods.getProgress = function() {
  return {
    totalSolved: this.stats.totalSolved,
    easySolved: this.stats.easySolved,
    mediumSolved: this.stats.mediumSolved,
    hardSolved: this.stats.hardSolved,
    streak: this.streak,
    level: this.level,
    experience: this.experience,
    coins: this.coins,
    accuracy: this.stats.accuracy
  };
};

module.exports = mongoose.model('User', userSchema); 