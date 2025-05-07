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

//listar doctores por especialidad
const getDoctors = async (req, res) =>{
    const { specialty } = req.query;

    if(!specialty){
        return res.status(400).json({ mensaje: 'El filtro de especialidad es obligatorio'});
    }

    try{
        const doctors = await Doctor.find({
            specialty:{ $regex: specialty, $options: 'i'}
        });

        res.status(200).json.(doctors);
    }catch(error){
        console.error('Error al obtener doctores', error);
        res.status(500).json({ mensaje: 'Error al obtener los doctores'});
    }
};