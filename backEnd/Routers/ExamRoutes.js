const { createExam, deleteExam, getAllExamData, getExamById } = require('../Controllers/ExamController');

const router = require('express').Router();

router.post('/create-exam' , createExam)
    .put('/update-exam/:id' , updateExam)
    .delete('/delete-exam/:id', deleteExam)
    .get('/all', getAllExamData)
    .get('/:id' , getExamById)

module.exports = router;