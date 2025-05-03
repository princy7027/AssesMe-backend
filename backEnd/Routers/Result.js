const express = require('express');
const router = express.Router();
const { 
    calculateResult,
    getExamResults,
    getStudentResults,
    deleteResult,
    getExamStatisticsForCreator
} = require('../Controllers/ResultController');
const auth = require('../middlewares/Auth');

router.post('/submit/:examId/:userId', auth, calculateResult);
router.get('/exam/:examId', auth, getExamResults);
router.get('/student/:userId/:examId', auth, getStudentResults);
router.delete('/:resultId', auth, deleteResult);  
router.get('/:examId', auth, getExamStatisticsForCreator);  

module.exports = router;