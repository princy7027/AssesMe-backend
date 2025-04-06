const router = require('express').Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../Controllers/UserController');
const auth = require('../middlewares/Auth');
router.get('/all', auth, getAllUsers);
router.get('/:id', auth, getUserById);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', auth, deleteUser);

module.exports = router;