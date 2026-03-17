/**
 * TestResult Model
 * Stores completed test results with detailed analysis
 */

const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  // Which user took the test
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Test category
  category: {
    type: String,
    required: true,
    enum: [
      'general-knowledge','english-vocabulary','grammar',
      'reading','listening','ielts-mock',
      'math','physics','chemistry','biology',
      'history','geography','it','literature','logic'
    ]
  },

  // All questions with user answers
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    questionText: String,
    // ✅ Variantlar ham saqlanadi (review uchun)
    options: [{
      id: String,
      text: String
    }],
    selectedAnswer: String,
    correctAnswer: String,
    explanation: String,
    isCorrect: Boolean,
    timeTaken: Number
  }],

  // Summary statistics
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  incorrectAnswers: { type: Number, required: true },
  skippedAnswers: { type: Number, default: 0 },
  percentage: { type: Number, required: true },

  // Time tracking
  timeLimit: { type: Number },    // total time limit in seconds
  timeTaken: { type: Number },    // actual time taken in seconds

  // Performance grade
  grade: {
    type: String,
    enum: ['A+', 'A', 'B', 'C', 'D', 'F']
  },

  // Difficulty breakdown
  difficultyBreakdown: {
    easy: { total: Number, correct: Number },
    medium: { total: Number, correct: Number },
    hard: { total: Number, correct: Number }
  },

  // Test completion status
  status: {
    type: String,
    enum: ['completed', 'abandoned', 'timeout'],
    default: 'completed'
  },

  // For IELTS mock tests - section scores
  ieltsSections: {
    listening: { score: Number, total: Number },
    reading: { score: Number, total: Number },
    writing: { score: Number, total: Number },
    speaking: { score: Number, total: Number }
  }
}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

testResultSchema.index({ user: 1, createdAt: -1 });
testResultSchema.index({ category: 1, percentage: -1 });
testResultSchema.index({ percentage: -1 }); // For leaderboard

// ============================================
// MIDDLEWARE - Calculate grade before saving
// ============================================

testResultSchema.pre('save', function(next) {
  // Auto-calculate grade based on percentage
  const p = this.percentage;
  if (p >= 95) this.grade = 'A+';
  else if (p >= 85) this.grade = 'A';
  else if (p >= 75) this.grade = 'B';
  else if (p >= 60) this.grade = 'C';
  else if (p >= 50) this.grade = 'D';
  else this.grade = 'F';

  next();
});

module.exports = mongoose.model('TestResult', testResultSchema);
