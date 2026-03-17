/**
 * AI Question Generator Route
 * Uses OpenAI (or Anthropic) to generate test questions
 */

const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');

router.post('/generate', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { prompt, category, count = 10 } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: 'AI service not configured. Please add OPENAI_API_KEY to .env file.'
      });
    }

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are an expert test question creator for an IELTS and English language learning platform.
Generate multiple choice questions in valid JSON format ONLY.
Return ONLY a JSON array with no extra text.

Format:
[
  {
    "text": "Question text here?",
    "options": [
      {"id": "A", "text": "Option A"},
      {"id": "B", "text": "Option B"},
      {"id": "C", "text": "Option C"},
      {"id": "D", "text": "Option D"}
    ],
    "correctAnswer": "A",
    "explanation": "Brief explanation why A is correct",
    "difficulty": "medium",
    "category": "${category}",
    "tags": ["relevant", "tags"]
  }
]`;

    const userPrompt = prompt || `Generate ${count} ${category} questions for IELTS preparation.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    let responseText = completion.choices[0].message.content;

    // Parse the JSON response
    let parsed;
    try {
      const jsonData = JSON.parse(responseText);
      // Handle both array and object with questions key
      parsed = Array.isArray(jsonData) ? jsonData : (jsonData.questions || jsonData.data || []);
    } catch (parseError) {
      return res.status(500).json({ error: 'AI returned invalid JSON. Please try again.' });
    }

    // Validate each question
    const valid = parsed.filter(q =>
      q.text &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.correctAnswer &&
      ['A', 'B', 'C', 'D'].includes(q.correctAnswer)
    );

    res.json({
      success: true,
      questions: valid,
      generated: valid.length,
      message: `Generated ${valid.length} valid questions`
    });

  } catch (error) {
    console.error('AI generation error:', error);

    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ error: 'OpenAI quota exceeded. Please check your billing.' });
    }

    res.status(500).json({ error: 'AI generation failed. Please try again.' });
  }
});

module.exports = router;
