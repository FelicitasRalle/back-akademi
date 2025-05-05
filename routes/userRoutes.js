//ruta del usuario
const express = require('express');
const router = express.Router();
const { registerUser, loginUser} = require('../controllers/userController');

//ruta de prueba
router.get("/", (req,  res)=>{
    res.json({ mensaje: 'la ruta de usuarios esta funcionando correctamente'});
});

//registro
router.post('/register', registerUser);

//login
router.post('/login', loginUser);

module.exports = router;