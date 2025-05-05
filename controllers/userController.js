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
        if(ullname) user.fullname = fullname;
        if (dni) user.dni = dni;
        if (cuil) user.cuil = cuil;
        if (email) user.email = email;
        if (rol) user.rol = rol;

        await user.save();
        res.json({ mensaje: "el usuario se encontro correctamente"});
    }catch(error){
        console.error("error al actualiar el usuario", error);
        res.status(500).json({ mensaje: "error al actualizar el usuario"});
    }
}

//eliminar (solo admin)
const deleteUser = async (req, res)=>{
    const { id } = req.params;

    try{
        const user = await UserfindByIdAndDelete(id)
        if(!user) return res.status(404).json({ mensaje: "el usuario no se encontro"});

        res.json({ mensaje: "el usuario se ha eliminado correctamente"});
    }catch(error){
        console.error("error al eliminar el usuario", error);
        res.status(500).json({ mensaje: "error al eliminar el usuario"});
    }
}


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
    getUsers,
    updateUsers,
    deleteUsers,
    loginUser
};