/**
 * User Model
 * Handles user authentication, profiles, and test history
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  avatar: {
    type: String,
    default: null
  },

  // User statistics
  stats: {
    totalTests: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 }
  },

  // Recent test history (last 20 tests)
  testHistory: [{
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestResult' },
    category: String,
    score: Number,
    percentage: Number,
    completedAt: { type: Date, default: Date.now }
  }],

  // Account status
  isActive: {
    type: Boolean,
    default: true
  },

  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ============================================
// MIDDLEWARE - Hash password before saving
// ============================================

userSchema.pre('save', async function(next) {
  // Only hash if password was modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ============================================
// METHODS
// ============================================

// Compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update stats after test completion
userSchema.methods.updateStats = async function(score, total, percentage) {
  this.stats.totalTests += 1;
  this.stats.totalQuestions += total;
  this.stats.correctAnswers += score;
  this.stats.totalScore += percentage;
  this.stats.averageScore = Math.round(this.stats.totalScore / this.stats.totalTests);

  if (percentage > this.stats.bestScore) {
    this.stats.bestScore = percentage;
  }

  await this.save();
};

// Get public profile (no sensitive data)
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    stats: this.stats,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
