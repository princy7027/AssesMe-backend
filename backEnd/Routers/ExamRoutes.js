const { 
    createExam, 
    deleteExam, 
    getAllExams,     // Changed from getAllExamData
    getExamById, 
    updateExam
} = require('../Controllers/ExamController');
const auth = require('../middlewares/Auth');
const router = require('express').Router();
router.post('/create-exam',auth, createExam)
    .put('/update-exam/:id', auth, updateExam)
    .delete('/delete-exam/:id', auth, deleteExam)
    .get('/all', auth, getAllExams)
    .get('/:id', auth, getExamById)
    .get('/user/:userId', auth, getUserExams);

module.exports = router;