const { 
    getCreatorAnalytics, 
    removeCreator 
} = require('../Controllers/AdminController');
const auth = require('../middlewares/Auth');
const router = require('express').Router();

router.get('/creators/analytics', auth, getCreatorAnalytics)
    .delete('/creators/remove/:creatorId', auth, removeCreator);

module.exports = router;