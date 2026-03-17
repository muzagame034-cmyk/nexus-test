/**
 * Test Controller - Natijalar saqlanishi tuzatildi
 * - options (A,B,C,D) ham saqlanadi
 * - To'liq savol ma'lumotlari qaytariladi
 */

const TestResult = require('../models/TestResult');
const Question = require('../models/Question');
const User = require('../models/User');

// ── SUBMIT TEST ──
exports.submitTest = async (req, res) => {
  try {
    const { category, answers, timeTaken, timeLimit } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({ error: 'No answers provided' });
    }

    const questionIds = answers.map(a => a.questionId).filter(Boolean);
    const questions = await Question.find({ _id: { $in: questionIds } });

    const questionMap = {};
    questions.forEach(q => { questionMap[q._id.toString()] = q; });

    let correctCount = 0, incorrectCount = 0, skippedCount = 0;
    const diffBreakdown = {
      easy:   { total:0, correct:0 },
      medium: { total:0, correct:0 },
      hard:   { total:0, correct:0 }
    };

    const scoredAnswers = answers.map(answer => {
      const question = questionMap[answer.questionId];
      if (!question) return null;

      const isCorrect = !!(answer.selectedAnswer && answer.selectedAnswer === question.correctAnswer);

      if (!answer.selectedAnswer) skippedCount++;
      else if (isCorrect) correctCount++;
      else incorrectCount++;

      const diff = question.difficulty || 'medium';
      diffBreakdown[diff].total++;
      if (isCorrect) diffBreakdown[diff].correct++;

      // Statistikani yangilash
      Question.findByIdAndUpdate(answer.questionId, {
        $inc: { 'stats.timesUsed': 1, 'stats.timesCorrect': isCorrect ? 1 : 0 }
      }).exec();

      return {
        questionId: answer.questionId,
        questionText: question.text,
        // ✅ YANGI: variantlarni ham saqlaymiz
        options: question.options || [],
        selectedAnswer: answer.selectedAnswer || null,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        isCorrect,
        timeTaken: answer.timeTaken || 0
      };
    }).filter(Boolean);

    const totalQuestions = scoredAnswers.length;
    if (totalQuestions === 0) {
      return res.status(400).json({ error: 'No valid questions found' });
    }

    const percentage = Math.round((correctCount / totalQuestions) * 100);

    const testResult = await TestResult.create({
      user: req.user._id,
      category,
      answers: scoredAnswers,
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      skippedAnswers: skippedCount,
      percentage,
      timeTaken,
      timeLimit,
      difficultyBreakdown: diffBreakdown
    });

    // User statistikasini yangilash
    await req.user.updateStats(correctCount, totalQuestions, percentage);

    // Test tarixini yangilash
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        testHistory: {
          $each: [{ testId: testResult._id, category, score: correctCount, percentage, completedAt: new Date() }],
          $slice: -20
        }
      }
    });

    res.status(201).json({ success: true, result: testResult });

  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ error: 'Failed to submit test: ' + error.message });
  }
};

// ── GET RESULT ──
exports.getTestResult = async (req, res) => {
  try {
    const result = await TestResult.findById(req.params.id).populate('user', 'name email');
    if (!result) return res.status(404).json({ error: 'Test result not found' });

    if (result.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch result' });
  }
};

// ── GET USER HISTORY ──
exports.getUserHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = { user: req.user._id };
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [results, total] = await Promise.all([
      TestResult.find(query).select('-answers').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      TestResult.countDocuments(query)
    ]);

    res.json({
      success: true,
      results,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// ── GET PROGRESS ──
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const categoryStats = await TestResult.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgScore: { $avg: '$percentage' },
        bestScore: { $max: '$percentage' },
        lastTaken: { $max: '$createdAt' }
      }}
    ]);

    const recentTests = await TestResult.find({ user: userId })
      .select('category percentage createdAt grade')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, categoryStats, recentTests, userStats: req.user.stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};
