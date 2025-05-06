const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/', protect, adminOnly, getUsers);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
