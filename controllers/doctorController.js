const Doctor = require('../models/Doctor');

//crear nuevo doctor
const createDoctor = async (req, res) =>{
    const { fullname, dni, email, phone, specialty } = req.body;

    if(!fullname || !dni || !email || !phone || !specialty){
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios'});
    }

    try{
        const existing = await Doctor.findOne({ dni });
        if(existing){
            return res.status(400).json({ mensaje: 'Ya existe un doctor con ese dni'});
        }

        const newDoctor = new Doctor({ fullname, dni, email, phone, specialty});
        await newDoctor.save();

        res.status(201).json({ mensaje: 'El doctor se registro correctamente'});
    }catch(error){
        console.error('Error al registrar nuevo doctor', error);
        res.status(500).json({ mensaje: 'No se pudo registrar el nuevo doctor'});
    }
};