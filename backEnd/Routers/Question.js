const { 
    createQuestions,
    updateQuestion,
    deleteQuestion,
    getQuestionsByExamId
} = require('../Controllers/QuestionController');
const auth = require('../middlewares/Auth');
const express = require('express');
const router = express.Router();

// Add express.json() middleware for parsing JSON bodies
router.use(express.json());

router
    .post('/create/:examId', auth, createQuestions)
    .put('/update/:examId', auth, updateQuestion)
    .delete('/delete/:examId', auth, deleteQuestion)
    .get('/:examId', auth, getQuestionsByExamId);

module.exports = router;