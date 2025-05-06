const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPassword
} = require('../controllers/userController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/', protect, adminOnly, getUsers);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
