const { 
    getDiscussionByExam, 
    addDiscussion, 
    editDiscussion, 
    deleteDiscussion 
} = require('../Controllers/DiscussionController');

const router = require('express').Router();

router
    .get('/:examId', getDiscussionByExam)
    .post('/add', addDiscussion)
    .put('/edit/:examId/:discussionId', editDiscussion)
    .delete('/delete/:examId/:discussionId', deleteDiscussion);

module.exports = router;
