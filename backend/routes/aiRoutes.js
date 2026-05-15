const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   POST /api/ai/chat
 * @desc    Get AI chat response
 * @access  Private
 */
router.post('/chat', authMiddleware, async (req, res) => {
    try {
        const { prompt, context } = req.body;
        console.log('Chat request received:', { prompt, contextSize: context?.tasks?.length });
        if (!prompt) {

            return res.status(400).json({ message: 'Prompt is required' });
        }

        const response = await aiService.generateResponse(prompt, context);
        res.json({ response });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ message: 'AI Service error' });
    }
});

/**
 * @route   POST /api/ai/summarize
 * @desc    Summarize provided text
 * @access  Private
 */
router.post('/summarize', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }

        const data = await aiService.summarizeText(text);
        res.json(data);
    } catch (error) {
        console.error('AI Summarize Error:', error);
        res.status(500).json({ message: 'AI Service error' });
    }
});

module.exports = router;
