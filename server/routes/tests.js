// tests.js routes
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { submitTest, getTestResult, getUserHistory, getUserProgress } = require('../controllers/testController');

router.post('/submit', protect, submitTest);
router.get('/history', protect, getUserHistory);
router.get('/progress', protect, getUserProgress);
router.get('/result/:id', protect, getTestResult);

module.exports = router;
