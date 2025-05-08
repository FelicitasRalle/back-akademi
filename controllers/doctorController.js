const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

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

//listar doctores
const getDoctors = async (req, res) => {
    const { specialty } = req.query;
  
    try {
      let doctors;
  
      if (specialty) {
        //filtro para mostrar por especialidad
        doctors = await Doctor.find({
          specialty: { $regex: specialty, $options: 'i' },
          enabled: true
        });
      } else {
        //muestro todos, inclusos los no habilitads
        doctors = await Doctor.find();
      }
  
      res.status(200).json(doctors);
    } catch (error) {
      console.error('Error al obtener doctores:', error);
      res.status(500).json({ mensaje: 'Error al obtener los doctores' });
    }
  };
  

//editar doctor ya creado
const updateDoctor = async (req, res) =>{
    const { id } = req.params;
    const updates = req.body;

    try{
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, updates, { new: true });

        if(!updatedDoctor){
            return res.status(404).json({ mensaje: 'Doctor no encontrdo'});
        }

        res.status(200).json({ mensaje: 'El doctor se actualizo correctamente'});
    }catch(error){
        console.error('Error al actualizar doctor', error);
        res.status(500).json({ mensaje: 'No se pudo actualizar el doctor'});
    }
};

//eliminar un dcotor
const deleteDoctor = async (req, res) => {
    const { id } = req.params;
  
    try {
      // verifico si el doctor tiene turnos asignados
      const turnosAsignados = await Appointment.findOne({ doctor: id });
      if (turnosAsignados) {
        return res.status(400).json({
          mensaje: 'No se puede eliminar el doctor porque tiene turnos asignados'
        });
      }
  
      const deletedDoctor = await Doctor.findByIdAndDelete(id);
      if (!deletedDoctor) {
        return res.status(404).json({ mensaje: 'Doctor no encontrado' });
      }
  
      res.status(200).json({ mensaje: 'Doctor eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el doctor:', error);
      res.status(500).json({ mensaje: 'No se pudo eliminar el doctor' });
    }
  };
  

module.exports = {
    createDoctor,
    getDoctors,
    updateDoctor,
    deleteDoctor
};