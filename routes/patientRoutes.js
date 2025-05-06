const express = require('express');
const router = express.Router();

const{
    getPatients,
    createPatient,
    updatePatient,
    updatePatient,
    deletePatient
}= require('../controllers/patientController');

router.get('/', patientController.getPatients);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);


module.export = router;