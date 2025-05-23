const Patient = require('../models/Patient');

//crear un nuevo paciente
const createPatient = async (req, res)=>{
    const { fullname, dni, medicalInsurance, address, phone } = req.body;

    if(!fullname || !dni || !medicalInsurance){
        return res.status(400).json({ mensaje: 'El nombre, dni y cobertura medica son obligatorios'});
    }

    try{
        const existingPatient = await Patient.findOne({ dni });
        if(existingPatient){
            return res.status(400).json({ mensaje: 'Ya existe un paciente con ese dni'});
        }

        const newPatient = new Patient({ fullname, dni, medicalInsurance, address, phone});
        await newPatient.save();

        res.status(201).json({ mensaje: 'El paciente se registro correctamente', patient: newPatient});
    }catch(error){
        console.error('Error al registrar el paciente', error);
        res.status(500).json({ mensaje: 'No se pudo registrar el paciente'});
    }
};

//editar paciente
const updatePatient = async (req, res)=>{
    const { id } = req.params;
    const updates = req.body;

    try{
        const updatedPatient = await Patient.findByIdAndUpdate(id, updates, { new: true });

        if(!updatedPatient){
            return res.status(400).json({ mensaje: 'No se encontro el paciente'});
        }

        res.status(200).json({ mensaje: 'El paciente se actualizo correctamente', patient: updatedPatient});
    }catch(error){
        console.error('Error al actualizar el paciente', error);
        res.status(500),json({ mensaje: 'No se pudo actualizar el paciente'});
    }
};

//eliminar paciente
const deletePatient = async (req, res)=>{
    const { id } = req.params;

    try{
        const deletedPatient = await Patient.findByIdAndDelete(id);

        if(!deletedPatient){
            return res.status(404).json({ mensaje: 'No se encontro el paciente'});
        }

        res.status(200).json({ mensaje: 'El paciente se elimino correctamente'});
    }catch(error){
        console.error('Error al eliminar el paciente', error);
        res.status(500).json({ mensaje: 'No se pudo eliminar el paciente'});
    }
};

//obtener pacientes por los filtros obligatrorios
const getPatients = async (req, res) => {
    const { fullname, dni, medicalInsurance, page = 1, limit = 10 } = req.query;
    let filtro = {};
  
    try {
      //filtro
      if (fullname && dni && medicalInsurance) {
        filtro = {
          fullname: { $regex: fullname, $options: 'i' },
          dni,
          medicalInsurance: { $regex: medicalInsurance, $options: 'i' }
        };
      }
      const skip = (parseInt(page) - 1)*parseInt(limit);
  
      const patients = await Patient.find(filtro).skip(skip).limit(parseInt(limit));
      res.status(200).json(patients);
    } catch (error) {
      console.error('Error al obtener los pacientes:', error);
      res.status(500).json({ mensaje: 'Error al obtener los pacientes' });
    }
  };


module.exports ={
    getPatients,
    createPatient,
    updatePatient,
    deletePatient
};