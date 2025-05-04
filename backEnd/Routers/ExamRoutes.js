const { 
    createExam, 
    deleteExam, 
    getAllExams,
    getExamById, 
    updateExam,
    getUserExams,
    getStudentExamsWithResults   
} = require('../Controllers/ExamController');
const auth = require('../middlewares/Auth');
const router = require('express').Router();

router.post('/create-exam', auth, createExam)
    .put('/update-exam/:id', auth, updateExam)
    .delete('/delete-exam/:id', auth, deleteExam)
    .get('/all', auth, getAllExams)
    .get('/user/:userId', auth, getUserExams)    
    .get('/:id', auth, getExamById)
    .get('/student-results/:studentId',auth,getStudentExamsWithResults);
module.exports = router;