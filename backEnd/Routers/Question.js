const { createQuestion, updateQuestion, deleteQuestion, getAllQuestions, getQuestionById } = require('../Controllers/QuestionController');

const router = require('express').Router();

router.post('/create-question' , createQuestion)
    .put('/update-question/:id' , updateQuestion)
    .delete('/delete-question/:id', deleteQuestion)
    .get('/all', getAllQuestions)
    .get('/:id' , getQuestionById)

module.exports = router;