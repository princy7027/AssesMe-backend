const express = require('express');
const router = express.Router();
const { generateAndSaveQuestions } = require('../Controllers/AIQuestionController');
const auth = require('../middlewares/Auth');

router.use(express.json());

// Fix: Change to generateAndSaveQuestions instead of generate
router.post('/generate', auth, generateAndSaveQuestions);

module.exports = router;