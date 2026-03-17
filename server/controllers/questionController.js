/**
 * Questions Controller
 * CRUD operations for questions
 */

const Question = require('../models/Question');

// Get questions for a test (random)
exports.getTestQuestions = async (req, res) => {
  try {
    const { category } = req.params;
    const { count = 20, difficulty } = req.query;

    const questions = await Question.getRandomQuestions(
      category,
      parseInt(count),
      difficulty || null
    );

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this category' });
    }

    // Shuffle options for each question
    const shuffled = questions.map(q => {
      const options = [...q.options].sort(() => Math.random() - 0.5);
      return { ...q, options };
    });

    res.json({ success: true, questions: shuffled, total: shuffled.length });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

// Get all questions (admin)
exports.getAllQuestions = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.text = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [questions, total] = await Promise.all([
      Question.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name'),
      Question.countDocuments(query)
    ]);

    res.json({
      success: true,
      questions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

// Create question (admin)
exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, question });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(400).json({ error: error.message || 'Failed to create question' });
  }
};

// Update question (admin)
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ success: true, question });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete question (admin)
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

// Bulk create questions (admin - for AI generated)
exports.bulkCreateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    const created = await Question.insertMany(
      questions.map(q => ({ ...q, createdBy: req.user._id, isAIGenerated: true }))
    );

    res.status(201).json({
      success: true,
      message: `${created.length} questions created successfully`,
      questions: created
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get category stats
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          easy: { $sum: { $cond: [{ $eq: ['$difficulty', 'easy'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$difficulty', 'medium'] }, 1, 0] } },
          hard: { $sum: { $cond: [{ $eq: ['$difficulty', 'hard'] }, 1, 0] } }
        }
      }
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
