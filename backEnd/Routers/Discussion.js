const express = require('express');
const router = express.Router();
const auth = require('../middlewares/Auth');
const {
    createDiscussion,
    getDiscussionsByExam,
    deleteDiscussion
} = require('../Controllers/Discussion');

router.use(express.json());

router
    .post('/create', auth, createDiscussion)
    .get('/:examId', auth, getDiscussionsByExam)
    .delete('/:discussionId', auth, deleteDiscussion);

module.exports = router;