//ruta del usuario
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

router.post('/register', protect, adminOnly, registerUser);
router.post('/login', loginUser);

//endpoints del ABM
router.get('/', protect, adminOnly, getUsers); //listar usuarios
router.put('/:id', protect, adminOnly, updateUser); //editar usuarios
router.delete('/:id', protect, adminOnly, deleteUser); // baja de usuario

module.exports = router;