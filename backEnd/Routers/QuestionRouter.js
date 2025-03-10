const express = require('express');
const { ensureAuthenticated } = require('../middlewares/Auth');

const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
    console.log('--- logged in user Details ', req.user);
    
    res.status(200).json([
        {
            topic: "Networking",
            question: 100
        }
    ]);
});

module.exports = router;  