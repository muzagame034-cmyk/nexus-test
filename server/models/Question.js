/**
 * Question Model
 * Stores all test questions with categories and difficulty levels
 */

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // Question text
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    minlength: [5, 'Question must be at least 5 characters']
  },

  // Answer options (always 4)
  options: {
    type: [{
      text: { type: String, required: true },
      id: { type: String, required: true } // 'A', 'B', 'C', 'D'
    }],
    validate: {
      validator: function(v) { return v.length === 4; },
      message: 'Question must have exactly 4 options'
    }
  },

  // Correct answer ID ('A', 'B', 'C', or 'D')
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    enum: ['A', 'B', 'C', 'D']
  },

  // Explanation (optional, shown after test)
  explanation: {
    type: String,
    default: null
  },

  // Test category
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'general-knowledge','english-vocabulary','grammar',
      'reading','listening','ielts-mock',
      'math','physics','chemistry','biology',
      'history','geography','it','literature','logic'
    ]
  },

  // Difficulty level
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },

  // IELTS specific fields
  ieltsSection: {
    type: String,
    enum: ['listening', 'reading', 'writing', 'speaking', null],
    default: null
  },

  // Tags for better filtering
  tags: [{
    type: String,
    trim: true
  }],

  // Track usage statistics
  stats: {
    timesUsed: { type: Number, default: 0 },
    timesCorrect: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 }
  },

  // Whether question is active/published
  isActive: {
    type: Boolean,
    default: true
  },

  // Who created this question
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // AI generated flag
  isAIGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// ============================================
// INDEXES for better query performance
// ============================================

questionSchema.index({ category: 1, difficulty: 1, isActive: 1 });
questionSchema.index({ tags: 1 });

// ============================================
// STATIC METHODS
// ============================================

// Get random questions for a test
questionSchema.statics.getRandomQuestions = async function(category, count = 20, difficulty = null) {
  const query = { category, isActive: true };
  if (difficulty) query.difficulty = difficulty;

  const questions = await this.aggregate([
    { $match: query },
    { $sample: { size: count } },
    {
      $project: {
        text: 1,
        options: 1,
        correctAnswer: 1,
        category: 1,
        difficulty: 1,
        explanation: 1
      }
    }
  ]);

  return questions;
};

module.exports = mongoose.model('Question', questionSchema);
