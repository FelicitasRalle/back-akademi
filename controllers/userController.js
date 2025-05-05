const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//registro nuevo usuario
const registerUser = async (req, res) => {
    const{ fullname, dni, cuil, email, password, rol} = req.body;

    try{
        //verfico si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({mensaje: 'El usuario ya existe en el servidor'});

        //hasheo la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //crear nuevo usuario
        const newUser = new User({
            fullname,
            dni,
            cuil,
            email,
            password: hashedPassword,
            rol
        });

        await newUser.save();

        res.status(201).json({ mensaje: 'El usuario se registro correctamente'});
    }catch (error){
        console.error("error en el registro: ", error);
        res.status(500).json({ mensaje: 'Se produjo un error al registrar el usuario'});
    }
};

//login
const loginUser = async (req, res) =>{
    const { email, password} = req.body;

    try{
        const user = await User.findOne({ email});
        if (!user) return res.status(400).json({ mensaje: 'Las credenciales son invalidas'});

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) return res.status(400).json({ mensaje: 'Las credenciales son invalidas'});

        //generar jwt
        const token = jwt.sign(
            { id: user._id, rol: user.rol},
            process.env.JWT_SECRET
        );

        res.json({ mensaje: 'Login existoso', token});
    }catch(error){
        res.status(500).json({ mensaje: 'Error al iniciar sesion'});
    }
};

module.exports = {
    registerUser,
    loginUser
};