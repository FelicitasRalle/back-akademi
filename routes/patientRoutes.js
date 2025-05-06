const express = require('express');
const router = express.Router();

const{
    getPatients,
    createPatient,
    updatePatient,
    deletePatient
}= require('../controllers/patientController');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

router.get('/', getPatients);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);


module.exports = router;