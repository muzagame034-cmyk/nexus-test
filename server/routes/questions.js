const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getTestQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
  getCategoryStats
} = require('../controllers/questionController');

// Public - get questions for test
router.get('/test/:category', protect, getTestQuestions);

// Admin only routes
router.get('/', protect, restrictTo('admin'), getAllQuestions);
router.post('/', protect, restrictTo('admin'), createQuestion);
router.post('/bulk', protect, restrictTo('admin'), bulkCreateQuestions);
router.get('/stats', protect, restrictTo('admin'), getCategoryStats);
router.put('/:id', protect, restrictTo('admin'), updateQuestion);
router.delete('/:id', protect, restrictTo('admin'), deleteQuestion);

module.exports = router;
