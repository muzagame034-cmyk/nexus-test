const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const User = require('../models/User');
const TestResult = require('../models/TestResult');
const Question = require('../models/Question');

// All admin routes require admin role
router.use(protect, restrictTo('admin'));

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalQuestions, totalTests, recentTests] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Question.countDocuments({ isActive: true }),
      TestResult.countDocuments(),
      TestResult.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email')
    ]);

    const avgScore = await TestResult.aggregate([
      { $group: { _id: null, avg: { $avg: '$percentage' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalQuestions,
        totalTests,
        avgScore: avgScore[0]?.avg?.toFixed(1) || 0,
        recentTests
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'user' };
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, user: user.getPublicProfile() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
