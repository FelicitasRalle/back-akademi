const express = require('express');
const router = express.Router();

const{
    createDoctor,
    getDoctors,
    updateDoctor,
    deleteDoctor
}= require('../controllers/doctorController');

const { protect } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

router.get('/', protect, checkRole('admin', 'recepcionista'), getDoctors);
router.post('/', protect, checkRole('admin', 'recepcionista'), createDoctor);
router.put('/:id', protect, checkRole('admin', 'recepcionista'), updateDoctor);
router.delete('/:id', protect, checkRole('admin', 'recepcionista'), deleteDoctor);

module.exports = router;