const Appointment = require('../models/Appointment');

//crear turno
const createAppointment = async (req, res) => {
    const { doctor, patient, date, time, reason } = req.body;
  
    if (!doctor || !patient || !date || !time || !reason) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
  
    try {
      // Validar duplicado
      const turnoExistente = await Appointment.findOne({ doctor, date, time });
      if (turnoExistente) {
        return res.status(400).json({
          mensaje: 'El doctor ya tiene un turno asignado en esa fecha y hora'
        });
      }
  
      const newAppointment = new Appointment({ doctor, patient, date, time, reason });
      await newAppointment.save();
  
      res.status(201).json({ mensaje: 'Turno creado correctamente', appointment: newAppointment });
    } catch (error) {
      console.error('Error al crear turno:', error);
      res.status(500).json({ mensaje: 'No se pudo crear el turno' });
    }
  };
  

//listar turnos
const getAppointments = async (req, res) => {
  const { doctor, patient, page = 1, limit = 10 } = req.query;
  const filtro = {};

  try {
    //listo con los dos fltros obligatorios
    if (doctor && patient) {
      filtro.doctor = doctor;
      filtro.patient = patient;
    }
    const skip = (parseInt(page) - 1)*parseInt(limit);

    //muestro todos
    const appointments = await Appointment.find(filtro)
      .populate('doctor', 'fullname specialty')
      .populate('patient', 'fullname dni');

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error al obtener turnos', error);
    res.status(500).json({ mensaje: 'Error al obtener los turnos' });
  }
};


//editar un turno
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { doctor, date, time, status } = req.body;

  try {
    // validar disponibilidad
    if (doctor && date && time) {
      const turnoExistente = await Appointment.findOne({
        doctor,
        date,
        time,
        _id: { $ne: id }
      });

      if (turnoExistente) {
        return res.status(400).json({
          mensaje: 'El doctor ya tiene un turno en esa fecha y hora'
        });
      }
    }

    const updated = await Appointment.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }
    //mensaje segun es cancelado o confirmao el turno
    if (status === 'confirmado') {
      return res.status(200).json({ mensaje: 'El turno fue confirmado correctamente', appointment: updated });
    } else if (status === 'cancelado') {
      return res.status(200).json({ mensaje: 'El turno fue cancelado correctamente', appointment: updated });
    }
    res.status(200).json({ mensaje: 'Turno actualizado correctamente', appointment: updated });
  } catch (error) {
    console.error('Error al actualizar turno:', error);
    res.status(500).json({ mensaje: 'No se pudo actualizar el turno' });
  }
};



//eliminar turno
const deleteAppointment = async (req, res) =>{
    const { id } = req.params;

    try{
        const deleted = await Appointment.findByIdAndDelete(id);
        if(!deleted) return res.status(404).json({ mensaje: 'No se encontro el turno'});

        res.status(200).json({ mensaje: 'Se elimino el turno correctamente'});
    }catch(error){
        console.error('Error al eliminar el turno', error);
        res.status(500).json({ mensaje: 'No se pudo eliminar el turno'});
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment
};