const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

//registro nuevo usuario
const registerUser = async (req, res) => {
    const{ fullname, dni, cuil, email, password, rol} = req.body;

    try{
        //verfico si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({mensaje: 'El usuario ya existe en el servidor' });

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

//listar (solo admin)
const getUsers = async(req, res) =>{
    try{
        const users = await User.find().select("-password"); //sin contraseña
        res.json(users);
    }catch(eror){
        console.error("error al obtener los usuarios", error);
        res.status(500).json({ mensaje: "error al obtener los usuarios"});
    }
};

//editar (soloa dmin)
const updateUser = async (req, res) =>{
    const { id } = req.params;
    const { fullname, dni, cuil, email, rol } = req.body;

    try{
        const user = await User.findById(id);
        if(!user) return res.status(404).json({ mensaje: "el usuario no es encontrado"});

        //acualizo los datos si vienen el body
        if(fullname) user.fullname = fullname;
        if (dni) user.dni = dni;
        if (cuil) user.cuil = cuil;
        if (email) user.email = email;
        if (rol) user.rol = rol;

        await user.save();
        res.json({ mensaje: "el usuario se actualizo correctamente"});
    }catch(error){
        console.error("error al actualiar el usuario", error);
        res.status(500).json({ mensaje: "error al actualizar el usuario"});
    }
}

//eliminar (solo admin)
const deleteUser = async (req, res)=>{
    const { id } = req.params;

    try{
        const deletedUser = await User.findByIdAndDelete(id)
        if(!deletedUser){
            return res.status(404).json({ mensaje: "no se pudo encontrar el usuario"});
        }

        res.json({ mensaje: "el usuario se ha eliminado correctamente"});
    }catch(error){
        console.error("error al eliminar el usuario", error);
        res.status(500).json({ mensaje: "error al eliminar el usuario"});
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

//solicitar resetear la contraseña
const forgotPassword = async (req, res) =>{
    const { email } = req.body;

    try{
        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ mensaje: "no se encontro el usuario"});

        //genero un token y tiempo de vencimiento (1 hora)
        const token = crypto.randomBytes(32).toString('hex');
        const expiration = Date.now()+3600000; //una hora

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiration;
        await user.save();

        //conf de nodemailer con gmail
        const trasnporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, //mi mail
                pass: process.env.EMAIL_PASS //mi contraseña
            }
        });

        const resetLink = `http://localhost:3000/api/users/reset-password/${token}`;

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Recuperacion de contraseña',
            text: `Olvidaste tu contraseña? Haz click en el siguiente link:\n\n${resetLink}\n\nEste link expirará en 1 hora.`,
        };

        await trasnporter.sendMail(mailOptions);

        res.status(200).json({ mensaje: 'El email se ha enviado de forma corecta'});
    }catch(error){
        console.error('Error al enviar el mail', error);
        res.status(500).json({ mensaje: 'Error al procesar la solictud'});
    }
};

//resetear la contraseña
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try{
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } //el token no vencido
        });

        if(!user) return res.status(400).json({ mensaje: 'Token incorrecto o expirado'});

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
       

        await user.save();

        res.status(200).json({ mensaje: 'La contraseña se actualizo correctamente'});
    }catch(error){
        console.error('Error al cambiar la contrseña', error);
        res.status(500).json({ mensaje: 'No se pudo cambiar la contraseña'});
    }
};

module.exports = {
    registerUser,
    getUsers,
    updateUser,
    deleteUser,
    loginUser,
    forgotPassword,
    resetPassword
};