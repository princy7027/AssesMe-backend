const express = require('express');
const router = express.Router();
const AIQuestionController = require('../Controllers/AIQuestionController');
const auth = require('../middlewares/Auth');

router.use(express.json());

router.post('/generate-ai', auth, (req, res) => {
    AIQuestionController.generateQuestionsWithAI(req, res);
});

// router.post('/generate', auth, (req, res) => {
//     AIQuestionController.generateAndSaveQuestions(req, res);
// });

module.exports = router;