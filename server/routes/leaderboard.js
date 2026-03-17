const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const TestResult = require('../models/TestResult');

// Get global leaderboard
router.get('/', protect, async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    const match = {};
    if (category && category !== 'all') match.category = category;

    const leaderboard = await TestResult.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$user',
          bestScore: { $max: '$percentage' },
          totalTests: { $sum: 1 },
          avgScore: { $avg: '$percentage' }
        }
      },
      { $sort: { bestScore: -1, avgScore: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          bestScore: 1,
          totalTests: 1,
          avgScore: { $round: ['$avgScore', 1] }
        }
      }
    ]);

    // Add ranks
    const ranked = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json({ success: true, leaderboard: ranked });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
