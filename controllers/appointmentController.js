const Appointment = require('../models/Appointment');

//crear turno
const createAppointment = async (req, res) =>{
    const { doctor, patient, date, time, reason } = req.body;

    if(!doctor || !patient || !date || !time || !reason){
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios'});
    }

    try{
        const newAppointment = new Appointment({ doctor, patient, date, time, reason });
        await newAppointment.save();

        res.status(201).json({ mensaje: 'turno registrado correctamente', appointment: newAppointment});
    }catch(error){
        console.error('Error al registrar el turno', error);
        res.status(500).json({ mensaje: 'No se pudo registrar el turno'});   
    }
};